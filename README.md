# A Healthy Habit

> [!WARNING]
> **UNDER CONSTRUCTION**
>
> This is an old project currently being revived. The codebase is in active flux and is not in working order. Expect missing features, broken builds, and significant structural changes in progress.

A React Native habit tracker app for Android and iOS.

## Tech Stack

- **React Native** 0.76.5 (New Architecture enabled)
- **React** 18.3.1
- **TypeScript** 5.x
- **Redux Toolkit** 2.x + Redux Persist (AsyncStorage)
- **React Native Paper** 5.x (Material Design 3)
- **React Native Reanimated** 3.x
- **React Native Gesture Handler** 2.x

## Requirements

- Node.js 18+
- Yarn
- For iOS: Xcode 15+, CocoaPods
- For Android: Android Studio, JDK 17

## Getting Started

### Install dependencies

```sh
yarn install
```

### iOS

```sh
cd ios && pod install && cd ..
yarn ios
```

### Android

```sh
yarn android
```

### Metro bundler

```sh
yarn start
```

## Project Structure

```
src/
├── components/
│   ├── App/          # Root app component, theme provider
│   ├── EditHabbit/   # Add/edit habit dialog
│   ├── EditHabbitDates/  # Date picker for habit history
│   ├── Habbit/       # Habit card component
│   ├── ReorderingHabbit/ # Draggable habit list item
│   └── screens/
│       └── Habbits.tsx   # Main habits list screen
├── store/
│   └── index.ts      # Redux store, slices, selectors
└── utils/
    ├── calculateStreaks.ts
    ├── hsla.ts
    ├── themeFromColor.ts
    └── translations.ts
```

## Features

- Add, edit, and delete habits
- Track daily completion with streaks
- Set milestone goals (7, 30, 90, 180, 365 days)
- Edit historical dates via date picker
- Custom drag-to-reorder sorting
- Dark mode support
- English and Danish localization

## Upgrade Notes (from 0.64 to 0.76)

### New Architecture

New Architecture is enabled by default (`newArchEnabled=true`). All dependencies have been updated to versions that support Fabric and the Turbo Module system.

### Removed packages

- `react-native-appearance` — replaced by React Native's built-in `useColorScheme`
- `react-native-navigation-bar-color` — package was unmaintained; navigation bar coloring removed

### react-native-paper v5 (Material Design 3)

The app now uses MD3 theming. Custom colors are extended via:

```typescript
declare module 'react-native-paper' {
  interface MD3Colors {
    warn: string;
  }
}
```

### react-native-bootsplash v5

**Android:** The splash screen now uses the AndroidX SplashScreen API (`Theme.SplashScreen`). The `BootTheme` in `res/values/styles.xml` references `windowSplashScreenAnimatedIcon` and `windowSplashScreenBackground`.

**iOS:** Uses `BootSplash.storyboard` (already present in the project). The `AppDelegate` calls `[RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]`.

### Gradle & Android

- Gradle 8.6, AGP 8.6.1
- `compileSdk` 35, `targetSdk` 34, `minSdk` 24
- Java 17 source/target compatibility
- `com.facebook.react` plugin handles JS bundling (replaces old `react.gradle`)
- `jcenter()` removed — all dependencies now from `mavenCentral()`

### iOS

- Flipper removed (deprecated in RN 0.74+)
- `AppDelegate` now extends `RCTAppDelegate` (much simpler implementation)
- Minimum iOS version determined by `min_ios_version_supported` (15.1 for RN 0.76)
