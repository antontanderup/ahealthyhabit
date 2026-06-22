import React, {createContext, useContext, useEffect, useMemo} from 'react';
import type {ReactNode} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {useSettingsStore} from '../store';

export type Theme = {
  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;
  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  // Tertiary
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  // Error
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  // Background
  background: string;
  onBackground: string;
  // Surface
  surface: string;
  onSurface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  surfaceTint: string;
  inverseSurface: string;
  inverseOnSurface: string;
  // Outline
  outline: string;
  outlineVariant: string;
  // Misc
  shadow: string;
  scrim: string;
  backdrop: string;
  // Elevation overlays (as hex-alpha blended surface colors)
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({children}: {children: ReactNode}) {
  const colorScheme = useColorScheme();
  const {theme, updateTheme, resetTheme} = useMaterial3Theme({
    fallbackSourceColor: '#04c96a',
  });
  const themeColor = useSettingsStore(state => state.themeColor);

  useEffect(() => {
    if (themeColor !== null) {
      updateTheme(themeColor);
    } else {
      resetTheme();
    }
    // updateTheme/resetTheme are recreated on every render of useMaterial3Theme
    // (no useCallback inside the hook), so including them would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeColor]);

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
