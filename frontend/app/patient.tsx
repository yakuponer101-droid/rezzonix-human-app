import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

export default function PatientScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setPatient } = useAppStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'child' | null>(null);

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('patient.errorName'));
      return;
    }

    if (!gender) {
      Alert.alert(t('common.error'), 'Lütfen cinsiyet seçin.');
      return;
    }

    const ageNum = age.trim() ? parseInt(age) : undefined;
    if (age.trim() && (isNaN(ageNum!) || ageNum! < 0 || ageNum! > 120)) {
      Alert.alert(t('common.error'), t('patient.errorAge'));
      return;
    }

    setPatient({ name: name.trim(), age: ageNum, gender });
    router.push('/organs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('patient.title')}</Text>
            </View>

            <Card style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('patient.name')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('patient.namePlaceholder')}
                  placeholderTextColor={COLORS.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('patient.age')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('patient.agePlaceholder')}
                  placeholderTextColor={COLORS.textSecondary}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </Card>

            <View style={styles.buttons}>
              <Button
                title={t('patient.history')}
                onPress={() => router.push('/history')}
                variant="outline"
              />
              <Button title={t('patient.continue')} onPress={handleContinue} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  card: {},
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  buttons: {
    gap: 12,
  },
});
