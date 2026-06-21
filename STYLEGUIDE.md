# Style Guide

See CLAUDE.md for project conventions. This file covers component patterns.

## Component structure

```tsx
import {useTheme, createUseStyles} from '@/theme';

type FooProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Foo({label, onPress, disabled = false}: FooProps) {
  const theme = useTheme();
  const styles = useStyles();
  // ...
}

const useStyles = createUseStyles(theme => ({
  container: {backgroundColor: theme.surfaceContainer},
  containerPressed: {opacity: 0.5},
}));
```

Always use `createUseStyles` — even when the component doesn't consume theme tokens. This keeps styles co-located and makes adopting tokens later trivial. No `StyleSheet.create` calls outside of `createUseStyles`.

All theme token references (colors, backgrounds, borders) must live inside `createUseStyles`. Never reference `theme.*` inside an inline style object in JSX. The only values permitted inline are those genuinely computed at render time from JS measurements — for example a width derived from a state variable or a safe-area inset:

```tsx
// correct — theme token in createUseStyles, computed value inline
<View style={[styles.header, {height: DEFAULT_HEIGHT + insets.top}]} />

// wrong — theme token leaked into JSX
<Text style={[styles.label, {color: theme.primary}]} />
```

For conditional styles, define named variants in `createUseStyles` and compose them:

```tsx
// correct
<View style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]} />

// wrong
<View style={[styles.chip, {backgroundColor: selected ? theme.primaryContainer : theme.surfaceContainerHigh}]} />
```

## Theme tokens

Access via `useTheme()` from `src/theme`.

| Token                                 | Use                                                    |
| ------------------------------------- | ------------------------------------------------------ |
| `background` / `onBackground`         | Screen background and text                             |
| `surface` / `onSurface`               | Cards, dialogs, sheets                                 |
| `surfaceVariant` / `onSurfaceVariant` | Secondary surfaces, muted text, icons                  |
| `surfaceContainer`                    | Inputs, list rows, chips                               |
| `surfaceContainerHigh`                | Elevated state (e.g. active drag row)                  |
| `primary` / `onPrimary`               | Primary actions, active borders                        |
| `primaryContainer` / `onPrimaryContainer` | Selected chips, goal-reached state                 |
| `outlineVariant`                      | Subtle dividers                                        |
| `error` / `onError`                   | Destructive actions                                    |

## Jetpack Compose components

Import from `@expo/ui/jetpack-compose`. Every JC component must be wrapped in a `Host`. Use `matchContents` when the Host should size to its content (inline use). Always pass `seedColor={theme.primary}` and `colorScheme` — never hardcode a hex value.

### Wrappers

Prefer the pre-built wrappers in `src/components/compose/` — they handle `Host`, theming, and `colorScheme` automatically:

| Wrapper | Props | Use |
| ------- | ----- | --- |
| `ComposeButton` | `label`, `onClick`, `enabled?` | Primary dialog action |
| `ComposeTextButton` | `label`, `onClick`, `destructive?`, `enabled?` | Low-emphasis or destructive action |
| `ComposeTextField` | `defaultValue?`, `onChangeText?`, `label?`, `placeholder?` | Native Material3 text input |
| `ComposeCheckbox` | `value`, `onCheckedChange` | Standard (non-modified) checkbox |

```tsx
import {
  ComposeButton,
  ComposeTextButton,
  ComposeTextField,
  ComposeCheckbox,
} from '../compose';

<ComposeTextField
  defaultValue={initialName}
  onChangeText={setName}
  label={t('habitName')}
/>
<ComposeCheckbox value={checked} onCheckedChange={setChecked} />
<ComposeTextButton label={t('delete')} onClick={handleDelete} destructive />
<ComposeButton label={t('save')} onClick={handleSave} />
```

If you need a JC component that doesn't have a wrapper yet, create one in `src/components/compose/` following the same pattern (wrap in `Host` with `seedColor={theme.primary}` and `colorScheme`, export from `index.ts`), then use the wrapper everywhere instead of the raw component.

Use raw `Host` + JC component only when the use-site needs capabilities the wrapper intentionally omits (e.g. `Checkbox` with custom `modifiers`).

### Raw Host usage

```tsx
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {useColorScheme} from 'react-native';
import {useTheme} from '../../theme';

const theme = useTheme();
const colorScheme = useColorScheme();

<Host matchContents seedColor={theme.primary} colorScheme={colorScheme}>
  <Checkbox value={checked} onCheckedChange={setChecked} />
</Host>
```

### Available JC components used in this project

| Component | Use |
| --------- | --- |
| `Checkbox` | Done-today toggle (with `clip(Shapes.Circle)` modifier), goal selection rows via `ComposeCheckbox` |
| `FloatingActionButton` | Primary floating action (add habit) |
| `Button` | Via `ComposeButton` |
| `TextButton` | Via `ComposeTextButton` |
| `OutlinedTextField` | Via `ComposeTextField` |

### FloatingActionButton

Requires an XML vector drawable icon loaded via `require()`. Icons live in `src/assets/icons/`.

```tsx
import {Host, FloatingActionButton, Icon} from '@expo/ui/jetpack-compose';

<View style={styles.fabContainer}>
  <Host matchContents seedColor={theme.primary} colorScheme={colorScheme}>
    <FloatingActionButton onClick={onPress}>
      <FloatingActionButton.Icon>
        <Icon source={require('../../assets/icons/add.xml')} />
      </FloatingActionButton.Icon>
    </FloatingActionButton>
  </Host>
</View>
```

`fabContainer` style: `position: 'absolute', bottom: 16, right: 16`.

## Pressable

```tsx
<Pressable
  style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
  onPress={handlePress}
  hitSlop={8}>
```

Pressed style is always `opacity: 0.5`, named `<base>Pressed`.

## Icons

```tsx
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

<MaterialCommunityIcons name="dots-vertical" size={20} color={theme.onSurfaceVariant} />
```

Both `MaterialCommunityIcons.ttf` and `MaterialIcons.ttf` are loaded via the `expo-font` plugin in `app.json`.

| Purpose             | Name                          |
| ------------------- | ----------------------------- |
| Options menu        | `dots-vertical`               |
| Calendar            | `calendar-range`              |
| Reorder toggle (on) | `check`                       |
| Reorder toggle (off)| `reorder-horizontal`          |
| Sort ascending      | `sort-ascending`              |
| Sort manual         | `sort`                        |
| Drag handle         | `drag-horizontal-variant`     |
| Drag active         | `arrow-up-down`               |
| Goal star           | `star`                        |
| Chevron left/right  | `chevron-left` / `chevron-right` |

Icon-only buttons must always have `accessibilityLabel` set.

## Modals (dialogs and pickers)

Use React Native `Modal` with `transparent` and `animationType="fade"`. The outer `Pressable` is the backdrop (dismisses on tap); the inner `Pressable` stops propagation.

```tsx
<Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
  <Pressable style={styles.overlay} onPress={onClose}>
    <Pressable
      style={[styles.dialog, {backgroundColor: theme.surface}]}
      onPress={e => e.stopPropagation()}>
      {/* content */}
    </Pressable>
  </Pressable>
</Modal>
```

Standard overlay style: `flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24`.

Standard dialog style: `width: '100%', borderRadius: 16, elevation: 6`.

## Spacing & typography

| fontSize | Role                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| `12`     | Caption, section label (`fontWeight: '600'`, `letterSpacing: 0.5`)                   |
| `14`     | Secondary text, chip labels                                                           |
| `16`     | Body, list labels, inputs                                                             |
| `20`     | Dialog title                                                                          |
| `30→20`  | Animated screen title (interpolated on scroll via Reanimated)                         |

Dividers: `height: StyleSheet.hairlineWidth, backgroundColor: theme.outlineVariant`.

Card border radius: `12`. Dialog border radius: `16`. Chip border radius: `50`.

## Animations

Use `react-native-reanimated`. `withTiming` for value transitions. Shared values may be mutated inside `useAnimatedScrollHandler` — add `// eslint-disable-next-line react-hooks/immutability` on those lines since the rule false-positives on valid worklet mutations.
