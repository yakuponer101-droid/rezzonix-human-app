import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';
import { apiService } from '@/utils/api';

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { patient, selectedOrgans, sensorType, sensorName, setCurrentAnalysis } =
    useAppStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('preparing');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate scanning progress
    startScan();
  }, []);

  const [logMessages, setLogMessages] = useState<string[]>([]);

  const startScan = async () => {
    setStatus('analyzing');
    setLogMessages([]);

    // Detailed scan phases from Colab example
    const scanPhases = [
      { progress: 15, message: '> Veri paketleri [0xFF4A] gönderiliyor...' },
      { progress: 25, message: '> Bölge taraması başlatıldı...' },
      { progress: 40, message: '> Anomali tespiti ve manyetik alan taraması...' },
      { progress: 55, message: '> Doku yoğunluğu analizi: Normal' },
      { progress: 70, message: '> Manyetik alan: 45µT - Stabil' },
      { progress: 85, message: '> Senkronizasyon tamamlanıyor...' },
      { progress: 95, message: '> Sonuçlar derleniyor...' },
    ];

    let currentPhase = 0;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }

        const newProgress = prev + Math.random() * 8;
        
        // Add log messages at milestones
        if (currentPhase < scanPhases.length && newProgress >= scanPhases[currentPhase].progress) {
          setLogMessages((logs) => [...logs, scanPhases[currentPhase].message]);
          currentPhase++;
        }

        return Math.min(newProgress, 100);
      });
    }, 300);
  };

  const completeScan = async () => {
    setStatus('complete');

    try {
      // Create analysis via API
      const analysis = await apiService.createAnalysis({
        patient_name: patient.name,
        patient_age: patient.age,
        selected_organs: selectedOrgans,
        sensor_type: sensorType || 'BLE',
        sensor_name: sensorName || undefined,
      });

      setCurrentAnalysis(analysis);

      // Navigate to results after a short delay
      setTimeout(() => {
        router.replace('/results');
      }, 1500);
    } catch (error) {
      console.error('Analysis error:', error);
      // Still navigate to show some results
      setTimeout(() => {
        router.replace('/results');
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('scan.title')}</Text>

          {/* Animated Scan Visualization */}
          <View style={styles.scanContainer}>
            <Animated.View
              style={[
                styles.pulse,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.pulseGradient}
              >
                <Ionicons name="finger-print" size={80} color={COLORS.text} />
              </LinearGradient>
            </Animated.View>

            {/* Progress Rings */}
            <View style={[styles.ring, { opacity: 0.3 }]} />
            <View style={[styles.ring, { opacity: 0.2, transform: [{ scale: 1.3 }] }]} />
            <View style={[styles.ring, { opacity: 0.1, transform: [{ scale: 1.6 }] }]} />
          </View>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {status === 'preparing' && t('scan.preparing')}
            {status === 'analyzing' && t('scan.analyzing')}
            {status === 'complete' && t('scan.complete')}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>

          {/* Patient Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{patient.name}</Text>
            </View>
            {patient.age && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
                <Text style={styles.infoText}>{patient.age} yaş</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons
                name={sensorType === 'BLE' ? 'bluetooth' : 'hardware-chip'}
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>{sensorName || sensorType}</Text>
            </View>
          </View>

          {status !== 'complete' && (
            <Button
              title={t('scan.cancel')}
              onPress={handleCancel}
              variant="outline"
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  scanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  pulse: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    zIndex: 10,
  },
  pulseGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  statusText: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
  },
});
