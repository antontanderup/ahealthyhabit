import type { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const palette = {
  green: {
    100: '#D6FAE8',
    500: '#04C96A',
    600: '#02A554',
  },
  blue: {
    500: '#1CB0F6',
    600: '#0099DB',
  },
  purple: {
    500: '#CE82FF',
    600: '#A560E8',
  },
  amber: {
    500: '#FFC800',
    600: '#E6B400',
  },
  red: {
    500: '#FF4B4B',
    600: '#E63030',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F7F7F7',
    100: '#E5E5E5',
    300: '#AFAFAF',
    600: '#777777',
    900: '#1A1A1A',
  },
  dark: {
    0: '#FFFFFF',
    100: '#B0C8D4',
    300: '#6B8899',
    600: '#2D4050',
    700: '#263540',
    800: '#1E2A32',
    900: '#131F24',
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export type SemanticColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
};

export const semanticColors: Record<ColorScheme, SemanticColors> = {
  light: {
    background: palette.neutral[0],
    surface: palette.neutral[50],
    surfaceRaised: palette.neutral[0],
    border: palette.neutral[100],
    textPrimary: palette.neutral[900],
    textSecondary: palette.neutral[600],
    textMuted: palette.neutral[300],
  },
  dark: {
    background: palette.dark[900],
    surface: palette.dark[800],
    surfaceRaised: palette.dark[700],
    border: palette.dark[600],
    textPrimary: palette.dark[0],
    textSecondary: palette.dark[100],
    textMuted: palette.dark[300],
  },
};

// ---------------------------------------------------------------------------
// Spacing — 4px base grid
// ---------------------------------------------------------------------------

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

type FontWeight = TextStyle['fontWeight'];

type TypeScale = {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: TextStyle['textTransform'];
};

export const typography: Record<string, TypeScale> = {
  display: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.8,
  },
} as const;

// ---------------------------------------------------------------------------
// Elevation
// ---------------------------------------------------------------------------

export const elevation = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 16,
} as const;

// ---------------------------------------------------------------------------
// Button depth (3D push effect)
// ---------------------------------------------------------------------------

export const buttonDepth = {
  green: {
    face: palette.green[500],
    floor: palette.green[600],
  },
  blue: {
    face: palette.blue[500],
    floor: palette.blue[600],
  },
  purple: {
    face: palette.purple[500],
    floor: palette.purple[600],
  },
  amber: {
    face: palette.amber[500],
    floor: palette.amber[600],
  },
  red: {
    face: palette.red[500],
    floor: palette.red[600],
  },
  white: {
    face: palette.neutral[0],
    floor: palette.neutral[100],
  },
} as const;

export type ButtonVariant = keyof typeof buttonDepth;

// ---------------------------------------------------------------------------
// Convenience re-export
// ---------------------------------------------------------------------------

export const colors = palette;
