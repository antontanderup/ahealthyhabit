import React from 'react';
import {Slot} from 'expo-router';
import {HabitsProvider} from '../src/habits/HabitsContext';
import '../src/i18n';

export default function RootLayout() {
  return (
    <HabitsProvider>
      <Slot />
    </HabitsProvider>
  );
}
