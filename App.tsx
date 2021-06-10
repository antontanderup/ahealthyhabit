import React, {useEffect} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';
import Habbits from './src/components/screens/Habbits';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';

import './src/utils/translations';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import themeFromColors from './src/utils/themeFromColor';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warn: string;
    }
  }
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = themeFromColors('#03b45f', isDarkMode);

  useEffect(() => {
    RNBootSplash.hide({fade: true});
    changeNavigationBarColor(
      theme.colors.background.slice(0, 7),
      !isDarkMode,
      false,
    );
  });

  useEffect(() => {
    changeNavigationBarColor(
      theme.colors.background.slice(0, 7),
      !isDarkMode,
      false,
    );
  }, [isDarkMode, theme]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <View style={styles.container}>
              <Habbits />
            </View>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
