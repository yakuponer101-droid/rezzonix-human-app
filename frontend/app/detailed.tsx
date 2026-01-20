import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';

export default function DetailedAnalysisScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentAnalysis } = useAppStore();

  if (!currentAnalysis) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.backgroundLight]}
          style={styles.gradient}
        >
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Analiz bulunamadı</Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </View>
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Detaylı Analiz</Text>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Overall Health Score */}
          <Card style={styles.card}>
            <Text style={styles.updateText}>
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </Text>
            <Text style={styles.sectionTitle}>Genel Sağlık Puanı</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{currentAnalysis.overall_score}</Text>
                <Text style={styles.scoreMax}>/ 100</Text>
              </View>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.statusText}>{currentAnalysis.band}</Text>
              </View>
            </View>
          </Card>

          {/* Body Composition */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Vücut Kompozisyonu</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </View>
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Yağ Oranı</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, styles.progressWarning, { width: '60%' }]} />
                <Text style={styles.metricValue}>22%</Text>
              </View>
              <Text style={styles.metricStatus}>Uyarı</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Kas Kütlesi</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, styles.progressGood, { width: '70%' }]} />
                <Text style={styles.metricValue}>52kg</Text>
              </View>
              <Text style={[styles.metricStatus, { color: COLORS.success }]}>Normal</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>BMI</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, styles.progressGood, { width: '65%' }]} />
                <Text style={styles.metricValue}>24.5</Text>
              </View>
              <Text style={[styles.metricStatus, { color: COLORS.success }]}>Normal</Text>
            </View>
          </Card>

          {/* Vitamin Values */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Vitamin Değerleri</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </View>
          </Card>

          {/* Organ Health */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Organ Sağlığı</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </View>
            
            {currentAnalysis.results.slice(0, 3).map((result, index) => (
              <View key={index} style={styles.organItem}>
                <Text style={styles.organName}>{result.organ}</Text>
                <Text style={[styles.organScore, { color: result.score >= 70 ? COLORS.success : COLORS.warning }]}>
                  {result.score}
                </Text>
              </View>
            ))}
          </Card>

          {/* Expert Recommendations */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Uzman Tavsiyeleri</Text>
            <View style={styles.recommendation}>
              <Ionicons name="bulb" size={24} color={COLORS.warning} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Destekleyici Gözlem</Text>
                <Text style={styles.recommendationText}>
                  Yaşam tarzı/uyku/su dengesi izlenebilir. Profesyonel değerlendirme önerilir.
                </Text>
              </View>
            </View>
          </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    padding: 20,
  },
  updateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreMax: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: `${COLORS.success}20`,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
  },
  progressWarning: {
    backgroundColor: COLORS.warning,
  },
  progressGood: {
    backgroundColor: COLORS.success,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 50,
  },
  metricStatus: {
    fontSize: 12,
    color: COLORS.warning,
  },
  organItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  organName: {
    fontSize: 14,
    color: COLORS.text,
  },
  organScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendation: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: `${COLORS.warning}10`,
    borderRadius: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
