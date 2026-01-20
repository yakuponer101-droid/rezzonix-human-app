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

const ORGANS = [
  { key: 'brain', icon: 'brain' },
  { key: 'heart', icon: 'heart' },
  { key: 'lung', icon: 'fitness' },
  { key: 'liver', icon: 'water' },
  { key: 'kidney', icon: 'filter' },
  { key: 'stomach', icon: 'restaurant' },
  { key: 'pancreas', icon: 'medical' },
  { key: 'intestine', icon: 'git-network' },
  { key: 'thyroid', icon: 'shield' },
  { key: 'spine', icon: 'arrow-up' },
  { key: 'immune', icon: 'shield-checkmark' },
  { key: 'circulation', icon: 'repeat' },
];

export default function OrgansScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSelectedOrgans } = useAppStore();
  const [selected, setSelected] = useState<string[]>(['heart', 'liver', 'kidney']);

  const toggleOrgan = (organ: string) => {
    if (selected.includes(organ)) {
      setSelected(selected.filter((o) => o !== organ));
    } else {
      setSelected([...selected, organ]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      Alert.alert(t('common.error'), t('organs.errorMinimum'));
      return;
    }

    // Convert keys to Turkish names
    const organNames = selected.map((key) => t(`organs.list.${key}`));
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
                      {t(`organs.list.${organ.key}`)}
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
