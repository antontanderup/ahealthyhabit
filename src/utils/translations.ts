import i18n from 'i18n-js';
// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    appName: 'A Healthy Habit',
    Edit: 'Edit',
    'Habbit name': 'Habbit name',
    Done: 'Done',
    Delete: 'Delete',
    Save: 'Save',
    'Add habbit': 'Add habbit',
    Goals: 'Goals',
    Days: {
      count: {
        one: '1 day',
        other: '{{count}} days',
        zero: '0 days',
      },
    },
    habbit: {
      current: {
        count: {
          one: '1 day. Lets make this a habbit!',
          other: '{{count}} days. Keep it up!',
          zero: 'Lets go!',
        },
      },
      currentTodayDone: {
        count: {
          one: 'Day {{count}}. It starts here.',
          other: 'Day {{count}}. Good job!',
          zero: 'Lets go!',
        },
      },
      longest: {
        count: {
          one: 'Best: 1 day',
          other: 'Best: {{count}} days',
          zero: '',
        },
      },
    },
  },
  da: {
    appName: 'En God Vane',
    Edit: 'Rediger',
    'Habbit name': 'Navn på vane',
    Done: 'Færdig',
    Delete: 'Slet',
    Save: 'Gem',
    'Add habbit': 'Tilføj vane',
    Goals: 'Mål',
    Days: {
      count: {
        one: '1 dag',
        other: '{{count}} dage',
        zero: '0 dage',
      },
    },
    habbit: {
      current: {
        count: {
          one: '1 dag. Det starter her.',
          other: '{{count}} dage. Hold gejsten oppe!',
          zero: 'Sæt igang!',
        },
      },
      currentTodayDone: {
        count: {
          one: 'Dag {{count}}. Ses i morgen!',
          other: 'Dag {{count}}. Godt klaret!',
          zero: 'Sæt igang!',
        },
      },
      longest: {
        count: {
          one: 'Bedste: 1 dag',
          other: 'Bedste: {{count}} dage',
          zero: '',
        },
      },
    },
  },
};
// Set the locale once at the beginning of your app.
i18n.locale = 'eng';

i18n.fallbacks = true;
