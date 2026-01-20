import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tr from './tr.json';
import en from './en.json';

const LANGUAGE_KEY = 'app_language';

// Get stored language
const getStoredLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'tr';
  } catch (error) {
    return 'tr';
  }
};

// Save language
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
};

// Initialize i18n
const initI18n = async () => {
  const language = await getStoredLanguage();

  i18n.use(initReactI18next).init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: language,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });
};

initI18n();

export default i18n;
