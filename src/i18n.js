import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from './languageDetector'; // Import the custom detector

// Import remaining translation files
// import translationEN from './locales/en/translation.json'; // Removed English import
import translationFR from './locales/fr/translation.json';
import translationMA from './locales/ma/translation.json';
import translationES from './locales/es/translation.json';

// Remove 'en' from resources
const resources = {
  // en: { translation: translationEN }, // Removed English resources
  fr: { translation: translationFR },
  ma: { translation: translationMA },
  es: { translation: translationES },
};

i18n
  .use(languageDetector) // Use the custom detector
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Keep 'en' as fallback - i18next will return the key if not found

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    // Configuration for language detection
    detection: {
      // Order and from where user language should be detected
      order: ['languageDetector'], // Use only our custom detector

      // optional react-i18next specific options
      react: {
        // Set to false if you don't want to use Suspense
        useSuspense: false,
      },
    }
  });

export default i18n; 