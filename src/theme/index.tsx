import React, {createContext, useContext, useMemo} from 'react';
import type {ReactNode} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';

export type Theme = {
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  error: string;
  onError: string;
  outline: string;
  outlineVariant: string;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({children}: {children: ReactNode}) {
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme({fallbackSourceColor: '#04c96a'});
  const colors = (
    colorScheme === 'dark' ? theme.dark : theme.light
  ) as unknown as Theme;
  return (
    <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export function createUseStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T,
): () => T {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
