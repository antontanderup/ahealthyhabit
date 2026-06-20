import React from 'react';
import {Slot} from 'expo-router';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {HabitsProvider} from '../src/habits/HabitsContext';
import '../src/i18n';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <HabitsProvider>
        <Slot />
      </HabitsProvider>
    </SafeAreaProvider>
  );
}
