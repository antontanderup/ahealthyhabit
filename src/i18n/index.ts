import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import da from './da.json';

const languageCode = Localization.getLocales()[0]?.languageCode ?? 'en';

i18next.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    da: {translation: da},
  },
  lng: languageCode,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  // Hermes (React Native JS engine) lacks Intl.PluralRules support.
  // v3 compat uses simple singular/plural logic without it.
  compatibilityJSON: 'v3',
});

export default i18next;
