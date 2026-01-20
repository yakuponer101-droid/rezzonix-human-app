import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';
import { apiService, Analysis } from '@/utils/api';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setCurrentAnalysis } = useAppStore();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalyses(50);
      setAnalyses(data);
    } catch (error) {
      console.error('Load analyses error:', error);
      Alert.alert(t('common.error'), 'Geçmiş yüklenemedi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalyses();
  };

  const handleOpenAnalysis = (analysis: Analysis) => {
    setCurrentAnalysis(analysis);
    router.push('/results');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (band: string) => {
    if (band === 'Dengeli') return COLORS.success;
    if (band === 'Takip') return COLORS.warning;
    return COLORS.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('history.title')}</Text>
            <Text style={styles.subtitle}>
              {analyses.length} {analyses.length === 1 ? 'kayıt' : 'kayıt'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {loading && analyses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>{t('common.loading')}</Text>
            </View>
          ) : analyses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>{t('history.noData')}</Text>
              <Button
                title={t('history.newAnalysis')}
                onPress={() => router.push('/')}
              />
            </View>
          ) : (
            analyses.map((analysis) => (
              <TouchableOpacity
                key={analysis.id}
                onPress={() => handleOpenAnalysis(analysis)}
                activeOpacity={0.7}
              >
                <Card style={styles.analysisCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.patientName}>{analysis.patient_name}</Text>
                      <Text style={styles.dateText}>
                        {formatDate(analysis.created_at)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.scoreBadge,
                        { backgroundColor: `${getStatusColor(analysis.band)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.scoreText,
                          { color: getStatusColor(analysis.band) },
                        ]}
                      >
                        {analysis.overall_score}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <Ionicons name="medical" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.infoText}>
                        {analysis.selected_organs.length} organ
                      </Text>
                    </View>

                    {analysis.patient_age && (
                      <View style={styles.infoRow}>
                        <Ionicons name="person" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>{analysis.patient_age} yaş</Text>
                      </View>
                    )}

                    <View style={styles.infoRow}>
                      <Ionicons
                        name={
                          analysis.sensor_type === 'BLE'
                            ? 'bluetooth'
                            : 'hardware-chip'
                        }
                        size={16}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.infoText}>{analysis.sensor_type}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(analysis.band)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(analysis.band) },
                        ]}
                      >
                        {analysis.band}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.bottomButton}>
          <Button
            title={t('history.newAnalysis')}
            onPress={() => {
              router.push('/');
            }}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  analysisCard: {},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
