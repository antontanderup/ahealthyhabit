import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useDispatch} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Slot} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {store, hydrate} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {initDatabase, loadAllData} from '../src/database';
import '../src/i18n';

SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        const data = await loadAllData();
        dispatch(hydrate(data));
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) return null;

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppLayout />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
