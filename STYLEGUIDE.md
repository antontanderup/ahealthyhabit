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

No inline style objects except for values that are genuinely computed at render time (e.g. a width derived from a JS measurement). Dynamic theme-driven values (`{color: theme.primary}`) are acceptable inline.

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

Import from `@expo/ui/jetpack-compose`. Every JC component must be wrapped in a `Host`. Use `matchContents` when the Host should size to its content (inline use). Always pass `seedColor` and `colorScheme` so JC components match the app palette.

```tsx
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {useColorScheme} from 'react-native';

const colorScheme = useColorScheme();

<Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
  <Checkbox value={checked} onCheckedChange={setChecked} />
</Host>
```

### Available JC components used in this project

| Component | Use |
| --------- | --- |
| `Checkbox` | Done-today toggle, goal selection rows |
| `FloatingActionButton` | Primary floating action (add habit) |
| `Button` | Primary dialog action (save / done) |
| `TextButton` | Low-emphasis or destructive dialog action |

### Buttons

JC `Button` and `TextButton` require a `Host` and a `Text` child from `@expo/ui/jetpack-compose`:

```tsx
import {Host, Button, TextButton, Text as JCText} from '@expo/ui/jetpack-compose';

// Primary action
<Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
  <Button onClick={handleSave}>
    <JCText>{t('save')}</JCText>
  </Button>
</Host>

// Destructive action
<Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
  <TextButton onClick={handleDelete} colors={{contentColor: theme.error}}>
    <JCText>{t('delete')}</JCText>
  </TextButton>
</Host>
```

### FloatingActionButton

Requires an XML vector drawable icon loaded via `require()`. Icons live in `src/assets/icons/`.

```tsx
import {Host, FloatingActionButton, Icon} from '@expo/ui/jetpack-compose';

<View style={styles.fabContainer}>
  <Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
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
