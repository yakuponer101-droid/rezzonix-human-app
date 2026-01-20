import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ResonanceVisualizer } from '@/components/ResonanceVisualizer';
import { COLORS, FREQUENCY } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';
import '@/locales/i18n';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isOnline } = useAppStore();
  const [accepted, setAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const handleContinue = () => {
    if (!accepted) {
      Alert.alert(t('common.error'), t('disclaimer.accept'));
      return;
    }
    setShowDisclaimer(false);
  };

  const handleStartAnalysis = () => {
    router.push('/patient');
  };

  if (showDisclaimer) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.backgroundLight]}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.logo}>{t('app.name')}</Text>
              <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
            </View>

            <Card style={styles.disclaimerCard}>
              <Text style={styles.disclaimerTitle}>{t('disclaimer.title')}</Text>
              <ScrollView style={styles.disclaimerScroll}>
                <Text style={styles.disclaimerText}>{t('disclaimer.text')}</Text>
              </ScrollView>

              <View style={styles.acceptRow}>
                <Switch
                  value={accepted}
                  onValueChange={setAccepted}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={accepted ? COLORS.text : COLORS.textSecondary}
                />
                <Text style={styles.acceptText}>{t('disclaimer.accept')}</Text>
              </View>

              <Button title={t('disclaimer.continue')} onPress={handleContinue} />
            </Card>

            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => router.push('/about')}
            >
              <Text style={styles.aboutText}>{t('settings.about')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOnline ? COLORS.success : COLORS.error },
                ]}
              />
              <Text style={styles.statusText}>
                {isOnline ? t('common.online') : t('common.offline')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Resonance Display */}
          <View style={styles.resonanceContainer}>
            <ResonanceVisualizer frequency={FREQUENCY} size={220} />
            <View style={styles.frequencyDisplay}>
              <Text style={styles.frequencyValue}>{FREQUENCY} Hz</Text>
              <Text style={styles.frequencyLabel}>UNIVERSAL CORE RESONANCE</Text>
            </View>
          </View>

          {/* System Cards */}
          <View style={styles.systemGrid}>
            <Card style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <Text style={styles.systemLabel}>SYS.01</Text>
                <Ionicons name="pulse" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.systemTitle}>BIO-FIELD</Text>
              <Text style={styles.systemValue}>98%</Text>
              <Text style={styles.systemStatus}>OPTIMAL</Text>
            </Card>

            <Card style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <Text style={styles.systemLabel}>SYS.02</Text>
                <Ionicons name="flash" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.systemTitle}>NEURAL NET</Text>
              <Text style={styles.systemValue}>Sync</Text>
              <Text style={styles.systemStatus, { color: COLORS.secondary }]}>
                ALPHA
              </Text>
            </Card>
          </View>

          <View style={styles.systemGrid}>
            <Card style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <Text style={styles.systemLabel}>SYS.03</Text>
                <Ionicons name="heart" size={24} color="#FF6B9D" />
              </View>
              <Text style={styles.systemTitle}>HEART</Text>
              <Text style={styles.systemValue}>72 BPM</Text>
              <Text style={[styles.systemStatus, { color: COLORS.success }]}>
                NORMAL
              </Text>
            </Card>

            <Card style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <Text style={styles.systemLabel}>SYS.04</Text>
                <Ionicons name="grid" size={24} color="#FFB84D" />
              </View>
              <Text style={styles.systemTitle}>CELLULAR</Text>
              <Text style={styles.systemValue}>Active</Text>
              <Text style={[styles.systemStatus, { color: '#FFB84D' }]}>
                STABLE
              </Text>
            </Card>
          </View>

          {/* Main Action Button */}
          <Button
            title="HYPER-SCAN"
            onPress={handleStartAnalysis}
            icon={<Ionicons name="finger-print" size={24} color={COLORS.text} />}
          />

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/history')}
            >
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.navButtonText}>{t('patient.history')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/about')}
            >
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.navButtonText}>{t('settings.about')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  resonanceContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  frequencyDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 80,
  },
  frequencyValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  frequencyLabel: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    letterSpacing: 2,
  },
  systemGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  systemCard: {
    flex: 1,
  },
  systemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  systemLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  systemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  systemValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  systemStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  navButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimerCard: {
    marginTop: 40,
  },
  disclaimerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  disclaimerScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  disclaimerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  acceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  acceptText: {
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  aboutButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  aboutText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});
