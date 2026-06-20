# A Healthy Habit

An Android habit tracker built with React Native and Expo.

## Architecture

- **Framework**: Expo (managed workflow with development build via `expo-dev-client`) with **Expo Router** for file-based routing
- **State**: Redux Toolkit — a single flat slice in `src/store/index.ts`. Side effects (SQLite persistence) run via `createListenerMiddleware`
- **Database**: `expo-sqlite` via `src/database/index.ts`
- **i18n**: `i18next` + `react-i18next` + `expo-localization` — translation files in `src/i18n/`

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
app/
  _layout.tsx         Root layout (Redux Provider, database init)
  index.tsx           Placeholder route
src/
  store/              Redux slice + listener middleware
  database/           expo-sqlite helpers
  i18n/               Translation files (en, da)
  utils/              dateUtils, calculateStreaks
```

## Conventions

### Exports

- Always use **named exports**. No default exports except for screen components inside `screens/`.

### TypeScript

- Never use `any` — always use explicit types.
- Import types with `import type` when the import is type-only.

### Naming

- Never abbreviate variable or function names.
- Hook files use camelCase prefixed with `use`.

### Translations

- All user-visible strings must go through `t()` from `useTranslation`.
- Add new keys to both `src/i18n/en.json` and `src/i18n/da.json`.

### State mutations

- Dispatch Redux actions for all state changes — never mutate local copies of store data.
- Date strings in the store are always `YYYY-MM-DD` in the device's local timezone (use `toLocalISODate` from `src/utils/dateUtils`).
