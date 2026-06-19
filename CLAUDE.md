# A Healthy Habit

An Android habit tracker built with React Native and Expo.

## Architecture

- **Framework**: Expo (managed workflow with development build via `expo-dev-client`)
- **State**: Redux Toolkit — a single flat slice in `src/store/index.ts`. Side effects (SQLite persistence) run via `createListenerMiddleware`
- **Database**: `expo-sqlite` via `src/database/index.ts`
- **i18n**: `i18next` + `react-i18next` + `expo-localization` — translation files in `src/i18n/`
- **Theme**: `@pchmn/expo-material3-theme` exposed through a custom `ThemeProvider` in `src/theme/`
- **UI**: vanilla React Native components + `@expo/ui/jetpack-compose` for native Material3 components (Checkbox, FloatingActionButton, Button)

## Development

Requires a development build because of native modules:

```bash
npx expo run:android
```

## Before Committing

Run these checks in order:

```bash
yarn lint
yarn typecheck
```

## Directory Structure

```
App.tsx               Root component (GestureHandler, Redux Provider, SafeAreaProvider)
index.js              Entry point (registerRootComponent)
src/
  components/
    App/              ThemeProvider + database init + root screen
    screens/          Habits.tsx — the single full-screen view
    Habit/            Habit card (done-today toggle, goal chips, streak info)
    EditHabit/        Add / edit / delete habit dialog
    EditHabitDates/   Multi-date calendar picker dialog
    ReorderingHabit/  Drag-to-reorder row
  theme/              ThemeProvider, useTheme, createUseStyles
  store/              Redux slice + listener middleware
  database/           expo-sqlite helpers
  i18n/               Translation files (en, da)
  utils/              dateUtils, calculateStreaks
  assets/
    icons/            XML vector drawables for @expo/ui Icon
```

## Conventions

**Style Guide**: Read `STYLEGUIDE.md` before creating or editing any component.

### Exports

- Always use **named exports**. No default exports except for screen components inside `screens/`.
- All components are co-located in their own folder under `components/`.

### TypeScript

- Never use `any` — always use explicit types.
- Import types with `import type` when the import is type-only.

### Naming

- Never abbreviate variable or function names.
- Component files use PascalCase (`EditHabit/index.tsx`).
- Hook files use camelCase prefixed with `use`.

### Props

- Define prop types inline as a `type` alias directly above the component.
- Provide sensible defaults for all optional props.

### Translations

- All user-visible strings must go through `t()` from `useTranslation`.
- Add new keys to both `src/i18n/en.json` and `src/i18n/da.json`.

### State mutations

- Dispatch Redux actions for all state changes — never mutate local copies of store data.
- Date strings in the store are always `YYYY-MM-DD` in the device's local timezone (use `toLocalISODate` from `src/utils/dateUtils`).
