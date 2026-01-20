import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/constants';
import i18n, { saveLanguage } from '@/locales/i18n';

interface LanguageSelectionProps {
  onLanguageSelected: () => void;
}

const LANGUAGES = [
  {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    nativeName: 'Türkçe',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    nativeName: 'English',
  },
];

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  onLanguageSelected,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleLanguageSelect = async (langCode: string) => {
    setSelectedLanguage(langCode);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await i18n.changeLanguage(langCode);
      await saveLanguage(langCode);
      
      // Wait a bit for visual feedback
      setTimeout(() => {
        onLanguageSelected();
      }, 300);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0E1A', '#000814']}
        style={styles.gradient}
      >
        {/* Starfield background */}
        <View style={styles.stars}>
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="language" size={60} color={COLORS.primary} />
            <Text style={styles.title}>Dil Seçimi</Text>
            <Text style={styles.titleEn}>Language Selection</Text>
            <View style={styles.divider} />
          </View>

          {/* Language Cards */}
          <View style={styles.languageContainer}>
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.8}
                style={styles.languageCardWrapper}
              >
                <Animated.View
                  style={[
                    styles.languageCard,
                    selectedLanguage === language.code && styles.languageCardSelected,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <LinearGradient
                    colors={
                      selectedLanguage === language.code
                        ? [COLORS.primary, COLORS.secondary]
                        : ['#1A1F2E', '#141824']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    {/* Flag */}
                    <View style={styles.flagContainer}>
                      <Text style={styles.flag}>{language.flag}</Text>
                    </View>

                    {/* Language Name */}
                    <Text style={styles.languageName}>{language.nativeName}</Text>
                    <Text style={styles.languageNameEn}>{language.name}</Text>

                    {/* Selection Indicator */}
                    {selectedLanguage === language.code && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
                      </View>
                    )}

                    {/* Decorative Elements */}
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer Text */}
          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.footerText}>
              Dili daha sonra ayarlardan değiştirebilirsiniz
            </Text>
            <Text style={styles.footerTextEn}>
              You can change the language later in settings
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  titleEn: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.primary,
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  languageContainer: {
    width: '100%',
    gap: 20,
  },
  languageCardWrapper: {
    width: '100%',
  },
  languageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  languageCardSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  cardGradient: {
    padding: 24,
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagContainer: {
    marginBottom: 12,
  },
  flag: {
    fontSize: 48,
  },
  languageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  languageNameEn: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  // Decorative corner elements
  cornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footerTextEn: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
});
