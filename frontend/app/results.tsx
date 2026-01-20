import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';

export default function ResultsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentAnalysis, reset } = useAppStore();

  if (!currentAnalysis) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.backgroundLight]}
          style={styles.gradient}
        >
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            <Button
              title={t('results.newAnalysis')}
              onPress={() => {
                reset();
                router.push('/');
              }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const handleExportPDF = async () => {
    try {
      const html = generatePDFHTML(currentAnalysis, t);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert(t('common.error'), 'PDF oluşturulamadı');
    }
  };

  const handleNewAnalysis = () => {
    reset();
    router.push('/');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('results.title')}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/history')}
                style={styles.iconButton}
              >
                <Ionicons name="time" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Metric Cards - Streamlit Style */}
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Genel Skor</Text>
              <Text style={styles.metricValue}>{currentAnalysis.overall_score}</Text>
              <Text style={styles.metricSubtext}>/ 100</Text>
            </Card>

            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Risk Durumu</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: getStatusColor(currentAnalysis.band), fontSize: 18 },
                ]}
              >
                {currentAnalysis.band}
              </Text>
            </Card>

            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Frekans</Text>
              <Text style={styles.metricValue}>{currentAnalysis.frequency}</Text>
              <Text style={styles.metricSubtext}>Hz - Stabil</Text>
            </Card>
          </View>

          {/* Patient & Overall Info */}
          <Card>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('results.patient')}</Text>
                <Text style={styles.infoValue}>{currentAnalysis.patient_name}</Text>
              </View>
              {currentAnalysis.patient_age && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('results.age')}</Text>
                  <Text style={styles.infoValue}>{currentAnalysis.patient_age}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('results.overallScore')}</Text>
                <Text style={styles.infoValue}>
                  {currentAnalysis.overall_score}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('results.status')}</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: getStatusColor(currentAnalysis.band) },
                  ]}
                >
                  {currentAnalysis.band}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('results.frequency')}</Text>
                <Text style={styles.infoValue}>
                  {currentAnalysis.frequency} Hz
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('results.sensor')}</Text>
                <Text style={styles.infoValue}>
                  {currentAnalysis.sensor_name || currentAnalysis.sensor_type}
                </Text>
              </View>
            </View>
          </Card>

          {/* Results Table */}
          <Card>
            <Text style={styles.sectionTitle}>Organ Analiz Sonuçları</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, { flex: 2 }]}>
                  {t('results.organ')}
                </Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>
                  {t('results.score')}
                </Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>
                  {t('results.stress')}
                </Text>
              </View>

              {/* Table Rows */}
              {currentAnalysis.results.map((result, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {result.organ}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { flex: 1 },
                      { color: result.score >= 70 ? COLORS.success : COLORS.warning },
                    ]}
                  >
                    {result.score}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { flex: 1 },
                      {
                        color:
                          result.stress <= 3
                            ? COLORS.success
                            : result.stress <= 6
                            ? COLORS.warning
                            : COLORS.error,
                      },
                    ]}
                  >
                    {result.stress}
                  </Text>
                </View>
              ))}
            </View>

            {/* Notes */}
            <View style={styles.notes}>
              <Text style={styles.notesTitle}>Notlar:</Text>
              {currentAnalysis.results.slice(0, 3).map((result, index) => (
                <View key={index} style={styles.noteItem}>
                  <Ionicons
                    name="information-circle"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.noteText}>
                    <Text style={styles.noteOrgan}>{result.organ}:</Text> {result.note}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttons}>
            <Button
              title="Kapsamlı Rapor"
              onPress={() => router.push('/comprehensive')}
              icon={<Ionicons name="document" size={20} color={COLORS.text} />}
            />
            <Button
              title="Detaylı Analiz"
              onPress={() => router.push('/detailed')}
              variant="outline"
              icon={<Ionicons name="bar-chart" size={20} color={COLORS.primary} />}
            />
            <Button
              title={t('results.exportPdf')}
              onPress={handleExportPDF}
              variant="outline"
              icon={<Ionicons name="document-text" size={20} color={COLORS.primary} />}
            />
            <Button
              title={t('results.newAnalysis')}
              onPress={handleNewAnalysis}
              icon={<Ionicons name="add-circle" size={20} color={COLORS.text} />}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function generatePDFHTML(analysis: any, t: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>RezzoniX Analyzer - Analiz Raporu</title>
        <style>
          body {
            font-family: 'Helvetica', sans-serif;
            padding: 40px;
            color: #333;
          }
          h1 {
            color: #00D9FF;
            text-align: center;
            margin-bottom: 10px;
          }
          .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-item {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
          }
          .info-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #00D9FF;
            color: white;
          }
          .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 8px;
            margin-top: 30px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>RezzoniX Analyzer</h1>
        <p class="subtitle">Analiz Raporu</p>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Danışan</div>
            <div class="info-value">${analysis.patient_name}</div>
          </div>
          ${
            analysis.patient_age
              ? `
          <div class="info-item">
            <div class="info-label">Yaş</div>
            <div class="info-value">${analysis.patient_age}</div>
          </div>
          `
              : ''
          }
          <div class="info-item">
            <div class="info-label">Genel Skor</div>
            <div class="info-value">${analysis.overall_score}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Durum</div>
            <div class="info-value">${analysis.band}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Frekans</div>
            <div class="info-value">${analysis.frequency} Hz</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Organ</th>
              <th>Skor (0-100)</th>
              <th>Stres (0-10)</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.results
              .map(
                (r: any) => `
              <tr>
                <td>${r.organ}</td>
                <td>${r.score}</td>
                <td>${r.stress}</td>
                <td>${r.note}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        
        <div class="disclaimer">
          <strong>Yasal Bildirim:</strong> Bu sistem yalnızca destekleyici analiz amaçlıdır; 
          tanı, tedavi veya tıbbi müdahale amacıyla kullanılmaz. Uygulama çıktıları 
          klinik değerlendirme yerine geçmez.
        </div>
      </body>
    </html>
  `;
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
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metricSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    width: '47%',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  table: {
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: 14,
    color: COLORS.text,
  },
  notes: {
    marginTop: 20,
    gap: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  noteItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noteOrgan: {
    fontWeight: '600',
    color: COLORS.text,
  },
  buttons: {
    gap: 12,
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
