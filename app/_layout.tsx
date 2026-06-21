import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ThemeProvider} from '../src/theme';
import {HabitsProvider} from '../src/habits/HabitsContext';
import '../src/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HabitsProvider>
            <Stack screenOptions={{headerShown: false}} />
          </HabitsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
