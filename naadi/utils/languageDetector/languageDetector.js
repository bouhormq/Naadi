import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app_language';

const languageDetector = {
  type: 'languageDetector',
  async: true, // Mark as async
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage) {
        console.log('LanguageDetector: Detected language from storage:', savedLanguage);
        callback(savedLanguage);
      } else {
        console.log('LanguageDetector: No language found in storage, using fallback.');
        // Fallback or let i18next handle it based on its config
        callback(null); // Signal no detection, let i18next fallback
      }
    } catch (error) {
      console.error('LanguageDetector: Error reading language from storage', error);
      callback(null); // Signal error, let i18next fallback
    }
  },
  init: () => {}, // Required but can be empty
  cacheUserLanguage: async (lng) => {
    try {
      console.log('LanguageDetector: Caching language:', lng);
      await AsyncStorage.setItem(STORAGE_KEY, lng);
    } catch (error) {
      console.error('LanguageDetector: Error saving language to storage', error);
    }
  },
};

export default languageDetector; 