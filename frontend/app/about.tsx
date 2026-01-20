import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { COLORS } from '@/utils/constants';

export default function AboutScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('about.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="pulse" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>{t('app.name')}</Text>
            <Text style={styles.appSubtitle}>{t('app.subtitle')}</Text>
          </View>

          <Card>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="business" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{t('about.developer')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{t('about.methodology')}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.noteBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
                <Text style={styles.noteText}>{t('about.note')}</Text>
              </View>
            </View>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>{t('disclaimer.text')}</Text>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Özellikler</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>12 Organ Sistemi Analizi</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>BLE ve USB Sensör Desteği</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>Çoklu Dil (TR/EN)</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>PDF Rapor Çıktısı</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>Analiz Geçmişi</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>528 Hz Rezonans Frekansı</Text>
              </View>
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 RezzoniX</Text>
            <Text style={styles.footerSubtext}>Version 1.0.0</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  noteBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: `${COLORS.warning}20`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
