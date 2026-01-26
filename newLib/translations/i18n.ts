import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/theme/translations/en';
import hi from '@/theme/translations/hi';

// Add more languages as needed
const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

i18n.use(initReactI18next).init({
  // compatibilityJSON removed or set to 'v4' if needed by your i18next version
  resources,
  lng: Localization.getLocales()[0]?.languageCode || 'en', // e.g. en-US → en
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
