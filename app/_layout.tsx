import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useTranslation} from 'react-i18next';
import {ThemeProvider, useTheme} from '../src/theme';
import {HabitsProvider} from '../src/habits/HabitsContext';
import '../src/i18n';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const theme = useTheme();
  const {t} = useTranslation();
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen
        name="settings"
        options={{
          title: t('settings'),
          headerStyle: {backgroundColor: theme.surface},
          headerTintColor: theme.onSurfaceVariant,
          headerTitleStyle: {color: theme.onSurface},
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HabitsProvider>
            <AppNavigator />
          </HabitsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
