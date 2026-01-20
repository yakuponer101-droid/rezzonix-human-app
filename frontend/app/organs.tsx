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
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';
import i18n from '@/locales/i18n';

const ORGANS = [
  { key: 'bone_density', icon: 'body', tr: 'Kemik Mineral Yoğunluğu', en: 'Bone Mineral Density' },
  { key: 'rheumatoid', icon: 'medical', tr: 'Romatoid Kemik Hastalığı', en: 'Rheumatoid Bone Disease' },
  { key: 'bone_growth', icon: 'resize', tr: 'Kemik Büyüme İndeksi', en: 'Bone Growth Index' },
  { key: 'blood_sugar', icon: 'water', tr: 'Kan Şekeri', en: 'Blood Sugar' },
  { key: 'trace_element', icon: 'cube', tr: 'Eser Element', en: 'Trace Element' },
  { key: 'vitamin', icon: 'nutrition', tr: 'Vitamin', en: 'Vitamin' },
  { key: 'amino_acid', icon: 'flask', tr: 'Amino Asit', en: 'Amino Acid' },
  { key: 'coenzyme', icon: 'git-merge', tr: 'Koenzim', en: 'Coenzyme' },
  { key: 'fatty_acid', icon: 'water', tr: 'Esansiyel Yağ Asidi', en: 'Essential Fatty Acid' },
  { key: 'endocrine', icon: 'pulse', tr: 'Endokrin Sistem', en: 'Endocrine System' },
  { key: 'immune', icon: 'shield-checkmark', tr: 'Bağışıklık Sistemi', en: 'Immune System' },
  { key: 'thyroid', icon: 'shield', tr: 'Tiroid', en: 'Thyroid' },
  { key: 'toxin', icon: 'warning', tr: 'Yetersiz Toksini', en: 'Toxins' },
  { key: 'heavy_metal', icon: 'warning', tr: 'Ağır Metal', en: 'Heavy Metal' },
  { key: 'physical_quality', icon: 'fitness', tr: 'Temel Fiziksel Kalite', en: 'Basic Physical Quality' },
  { key: 'allergy', icon: 'medical', tr: 'Alerji', en: 'Allergy' },
  { key: 'obesity', icon: 'body', tr: 'Obezite', en: 'Obesity' },
  { key: 'skin', icon: 'hand-left', tr: 'Cilt', en: 'Skin' },
  { key: 'eye', icon: 'eye', tr: 'Göz', en: 'Eye' },
  { key: 'collagen', icon: 'cellular', tr: 'Kolajen', en: 'Collagen' },
  { key: 'heart_brain', icon: 'pulse', tr: 'Kalp ve Beyin Nabzı', en: 'Heart and Brain Pulse' },
  { key: 'blood_lipids', icon: 'water', tr: 'Kan Lipitleri', en: 'Blood Lipids' },
  { key: 'prostate', icon: 'man', tr: 'Prostat', en: 'Prostate' },
  { key: 'male_function', icon: 'man', tr: 'Erkek Cinsel Fonksiyon', en: 'Male Sexual Function' },
  { key: 'sperm', icon: 'man', tr: 'Sperm ve Meni', en: 'Sperm and Semen' },
  { key: 'male_hormone', icon: 'man', tr: 'Erkeklik Hormonu', en: 'Male Hormone' },
  { key: 'intestine', icon: 'git-network', tr: 'Yetersiz Bağırsıklık', en: 'Intestinal Function' },
  { key: 'consciousness', icon: 'bulb', tr: 'Yetersiz Bilinç Düzeyi', en: 'Consciousness Level' },
  { key: 'respiratory', icon: 'fitness', tr: 'Solunum Fonksiyonu', en: 'Respiratory Function' },
  { key: 'lecithin', icon: 'flask', tr: 'Lesitin', en: 'Lecithin' },
  { key: 'brain', icon: 'brain', tr: 'Beyin', en: 'Brain' },
  { key: 'heart', icon: 'heart', tr: 'Kalp', en: 'Heart' },
  { key: 'lung', icon: 'fitness', tr: 'Akciğer', en: 'Lung' },
  { key: 'liver', icon: 'water', tr: 'Karaciğer', en: 'Liver' },
  { key: 'kidney', icon: 'filter', tr: 'Böbrek', en: 'Kidney' },
  { key: 'stomach', icon: 'restaurant', tr: 'Mide', en: 'Stomach' },
  { key: 'pancreas', icon: 'medical', tr: 'Pankreas', en: 'Pancreas' },
  { key: 'spine', icon: 'arrow-up', tr: 'Omurga', en: 'Spine' },
  { key: 'circulation', icon: 'repeat', tr: 'Dolaşım', en: 'Circulation' },
  { key: 'metabolism', icon: 'flame', tr: 'Metabolizma', en: 'Metabolism' },
  { key: 'digestive', icon: 'restaurant', tr: 'Sindirim Sistemi', en: 'Digestive System' },
  { key: 'blood_clots', icon: 'water', tr: 'Kan Pıhtıları', en: 'Blood Clots' },
  { key: 'urea', icon: 'flask', tr: 'Üre', en: 'Urea' },
  { key: 'expert_analysis', icon: 'analytics', tr: 'Uzman Analiz', en: 'Expert Analysis' },
  { key: 'element_analysis', icon: 'cube', tr: 'Element Analizi', en: 'Element Analysis' },
];

export default function OrgansScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSelectedOrgans } = useAppStore();
  const [selected, setSelected] = useState<string[]>(['heart', 'liver', 'kidney']);

  const toggleOrgan = (organKey: string) => {
    if (selected.includes(organKey)) {
      setSelected(selected.filter((o) => o !== organKey));
    } else {
      setSelected([...selected, organKey]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      Alert.alert(t('common.error'), t('organs.errorMinimum'));
      return;
    }

    // Get translated organ names
    const currentLang = i18n.language || 'tr';
    const organNames = selected.map((key) => {
      const organ = ORGANS.find(o => o.key === key);
      return organ ? (currentLang === 'en' ? organ.en : organ.tr) : key;
    });
    setSelectedOrgans(organNames);
    router.push('/sensor');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('organs.title')}</Text>
            <Text style={styles.subtitle}>{t('organs.subtitle')}</Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.grid}>
              {ORGANS.map((organ) => {
                const isSelected = selected.includes(organ.key);
                const organName = i18n.language === 'en' ? organ.en : organ.tr;
                return (
                  <TouchableOpacity
                    key={organ.key}
                    style={[
                      styles.organCard,
                      isSelected && styles.organCardSelected,
                    ]}
                    onPress={() => toggleOrgan(organ.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={organ.icon as any}
                      size={32}
                      color={isSelected ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.organText,
                        isSelected && styles.organTextSelected,
                      ]}
                    >
                      {organName}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.success}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <View style={styles.selectedCount}>
            <Text style={styles.selectedText}>
              {selected.length} {t('organs.title').toLowerCase()}
            </Text>
          </View>

          <View style={styles.buttons}>
            <Button
              title={t('organs.back')}
              onPress={() => router.back()}
              variant="outline"
            />
            <Button title={t('organs.continue')} onPress={handleContinue} />
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
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  card: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  organCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    position: 'relative',
  },
  organCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  organText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  organTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  selectedCount: {
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttons: {
    gap: 12,
  },
});
