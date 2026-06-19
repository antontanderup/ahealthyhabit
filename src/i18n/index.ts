import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';
import {registerTranslation} from 'react-native-paper-dates';
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
});

registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: (inputFormat: string) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Must be later than ${date}`,
  mustBeLowerThan: (date: string) => `Must be earlier than ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
});

export default i18next;
