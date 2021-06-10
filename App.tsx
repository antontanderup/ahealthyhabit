import React from 'react';
import {AppearanceProvider} from 'react-native-appearance';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';
import {PersistGate} from 'redux-persist/lib/integration/react';

import './src/utils/translations';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import App from './src/components/App';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warn: string;
    }
  }
}

export default () => {
  return (
    <AppearanceProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </AppearanceProvider>
  );
};
