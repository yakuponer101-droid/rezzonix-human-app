import React, { useState } from 'react';
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
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS } from '@/utils/constants';
import i18n, { saveLanguage } from '@/locales/i18n';

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function SettingsScreen() {
  const { t, i18n: i18nInstance } = useTranslation();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18nInstance.changeLanguage(langCode);
      await saveLanguage(langCode);
      setCurrentLanguage(langCode);
      Alert.alert(t('common.success'), 'Dil değiştirildi');
    } catch (error) {
      console.error('Language change error:', error);
      Alert.alert(t('common.error'), 'Dil değiştirilemedi');
    }
  };

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
          <Text style={styles.title}>{t('settings.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Language Selection */}
          <Card>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.languageList}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    currentLanguage === lang.code && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        currentLanguage === lang.code && styles.languageNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </View>
                  {currentLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* App Info */}
          <Card>
            <Text style={styles.sectionTitle}>Uygulama Bilgisi</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.version')}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025.01</Text>
            </View>
          </Card>

          {/* About Button */}
          <Button
            title={t('settings.about')}
            onPress={() => router.push('/about')}
            variant="outline"
            icon={<Ionicons name="information-circle" size={20} color={COLORS.primary} />}
          />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  languageList: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    color: COLORS.text,
  },
  languageNameSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
});
