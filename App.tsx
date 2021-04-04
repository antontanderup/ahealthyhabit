import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import Habbits from './src/components/screens/Habbits';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider as PaperProvider, DarkTheme } from 'react-native-paper';

import './src/utils/translations';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warn: string;
    }
  }
}

const theme = {...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#04C96A",
    accent: "#1FFF93",
    warn: "#C91C04"
    // #017D41
    //#7D0F00
  },
};

export default function App() {
  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            <Habbits />
          </View>
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
