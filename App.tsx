import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';
import Habbits from './src/components/screens/Habbits';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';

import './src/utils/translations';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warn: string;
    }
  }
}

const commonTheme = {
  roundness: 15,
  colors: {
    primary: '#04C96A',
    accent: '#1FFF93',
    warn: '#C91C04',
  },
};

const darkTheme = {
  ...DarkTheme,
  ...commonTheme,
  colors: {
    ...DarkTheme.colors,
    ...commonTheme.colors,
    // #017D41
    //#7D0F00
  },
  dark: true,
};

const lightTheme = {
  ...DefaultTheme,
  ...commonTheme,
  colors: {
    ...DefaultTheme.colors,
    ...commonTheme.colors,
    // #017D41
    //#7D0F00
  },
  dark: false,
};

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    RNBootSplash.hide({fade: true});
    changeNavigationBarColor(theme.colors.background, !isDarkMode, false);
  });

  useEffect(() => {
    changeNavigationBarColor(theme.colors.background, !isDarkMode, false);
  }, [isDarkMode, theme]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" />
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
