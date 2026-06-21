# A Healthy Habit

A React Native habit tracker app for Android (and iOS).

## Tech Stack

- **Expo** ~56 (managed workflow, development build via `expo-dev-client`)
- **React Native** 0.85 / **React** 19
- **TypeScript** 6.x
- **Expo Router** — file-based routing
- **Zustand** — settings persistence (sort preference)
- **expo-sqlite** — habits and recorded dates stored locally
- **React Native Reanimated** 4.x
- **React Native Gesture Handler** 2.x
- **@pchmn/expo-material3-theme** — Material You dynamic theming

## Getting Started

Requires a development build due to native modules:

```sh
npx expo run:android
```

## Project Structure

```
app/
  _layout.tsx         Root layout (providers + SplashScreen)
  index.tsx           Habits list screen

src/
  components/
    screens/
      Habits.tsx        Main habits list screen
    Habit/              Habit card component
    EditHabit/          Add / edit habit modal
    EditHabitDates/     Date picker for habit history
    ReorderingHabit/    Draggable list item for reordering
  database/           expo-sqlite helpers + migrations
  habits/             HabitsContext — CRUD for habit state
  i18n/               Translation files (en, da)
  store/              Zustand settings store
  theme/              Material You ThemeProvider + useTheme + createUseStyles
  utils/              dateUtils, calculateStreaks
```

## Features

- Add, edit, and delete habits
- Track daily completion with streaks
- Set milestone goals (7, 30, 90, 180, 365 days)
- Edit historical dates via date picker
- Custom drag-to-reorder sorting
- Dark mode support (Material You dynamic colors)
- English and Danish localization

## Before Committing

```sh
yarn lint
yarn typecheck
```
