# A Healthy Habit — Design Guide

Inspired by the gamified, playful visual language of Duolingo: bold colors, rounded shapes, 3D-effect buttons, and a clear dark/light mode system. Everything maps to TypeScript tokens in `src/theme/`.

---

## 1. Color

### Brand

| Token | Hex | Usage |
|---|---|---|
| `green.500` | `#04C96A` | Primary actions, active states, section banners |
| `green.600` | `#02A554` | Button depth shadow, pressed state |
| `green.100` | `#D6FAE8` | Light green tint backgrounds |

### Accent

| Token | Hex | Usage |
|---|---|---|
| `blue.500` | `#1CB0F6` | Secondary CTAs, links, progress fills |
| `blue.600` | `#0099DB` | Blue button depth shadow |
| `purple.500` | `#CE82FF` | Achievements, rewards, special milestones |
| `purple.600` | `#A560E8` | Purple depth shadow |
| `amber.500` | `#FFC800` | Streaks, stars, gold rewards |
| `amber.600` | `#E6B400` | Streak depth shadow |
| `red.500` | `#FF4B4B` | Hearts, warnings, destructive actions |
| `red.600` | `#E63030` | Red depth shadow |

### Neutrals — Light Mode

| Token | Hex | Usage |
|---|---|---|
| `neutral.0` | `#FFFFFF` | Page background |
| `neutral.50` | `#F7F7F7` | Secondary surface (alternate rows, sheet backgrounds) |
| `neutral.100` | `#E5E5E5` | Borders, dividers, disabled button outlines |
| `neutral.300` | `#AFAFAF` | Muted text, placeholder text, locked icons |
| `neutral.600` | `#777777` | Secondary text |
| `neutral.900` | `#1A1A1A` | Primary text |

### Neutrals — Dark Mode

| Token | Hex | Usage |
|---|---|---|
| `dark.900` | `#131F24` | Page background |
| `dark.800` | `#1E2A32` | Surface (cards, list items) |
| `dark.700` | `#263540` | Elevated surface (modals, raised cards) |
| `dark.600` | `#2D4050` | Borders, dividers |
| `dark.300` | `#6B8899` | Muted text |
| `dark.100` | `#B0C8D4` | Secondary text |
| `dark.0` | `#FFFFFF` | Primary text |

### Semantic Aliases

```
background        = neutral.0      / dark.900
surface           = neutral.50     / dark.800
surfaceRaised     = neutral.0      / dark.700
border            = neutral.100    / dark.600
textPrimary       = neutral.900    / dark.0
textSecondary     = neutral.600    / dark.100
textMuted         = neutral.300    / dark.300
```

---

## 2. Typography

The app ships with system fonts. On Android the default is **Roboto**. For a rounder, more playful feel matching the inspiration, load **Nunito** (available via `expo-font` + Google Fonts) as the brand typeface.

```
src/assets/fonts/
  Nunito-Regular.ttf
  Nunito-SemiBold.ttf
  Nunito-Bold.ttf
  Nunito-ExtraBold.ttf
```

### Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display` | 48px | ExtraBold 800 | 56px | -0.5 | Streak count, score, hero numbers |
| `h1` | 28px | Bold 700 | 34px | -0.3 | Page titles |
| `h2` | 22px | Bold 700 | 28px | -0.2 | Section headings, card titles |
| `h3` | 18px | SemiBold 600 | 24px | 0 | Sub-section labels |
| `bodyLarge` | 17px | Regular 400 | 24px | 0 | Primary body copy |
| `body` | 15px | Regular 400 | 22px | 0 | Standard UI text |
| `bodySmall` | 13px | Regular 400 | 18px | 0 | Secondary detail text |
| `label` | 12px | Bold 700 | 16px | 0.5 | Uppercase labels (SECTION 1, DAILY QUEST) |
| `caption` | 11px | SemiBold 600 | 14px | 0.8 | Timestamps, fine print |

`label` is always rendered **uppercase** via `textTransform: 'uppercase'`.

---

## 3. Spacing

8px base grid. All layout values must be a multiple of 4.

| Token | Value | Common use |
|---|---|---|
| `space.1` | 4px | Icon-to-label gap, tight internal padding |
| `space.2` | 8px | Small component gaps |
| `space.3` | 12px | Input internal padding (vertical) |
| `space.4` | 16px | Standard horizontal screen padding, button padding |
| `space.5` | 20px | Card internal padding |
| `space.6` | 24px | Section gap |
| `space.8` | 32px | Large section gap |
| `space.10` | 40px | Hero section vertical padding |
| `space.12` | 48px | Top/bottom of full-page sections |
| `space.16` | 64px | Display-level spacing |

Horizontal screen edge padding is always `space.4` (16px).

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | 6px | Small chips, inline badges |
| `radius.sm` | 10px | Input fields, small cards |
| `radius.md` | 16px | Standard cards, bottom sheets |
| `radius.lg` | 20px | Section banners, large cards |
| `radius.xl` | 28px | Large modals |
| `radius.full` | 9999px | Pill buttons, progress bars, avatar circles, stat badges |

---

## 5. Elevation & Shadows

### 3D Button Effect

The most distinctive visual pattern: buttons appear three-dimensional by rendering a darker-colored "floor" slab 4px below the button face. On press, the button translates down to meet the floor (eliminating the gap).

```
Rest state:   button face at Y=0, floor at Y=4  →  gap visible
Pressed state: button face at Y=4, floor at Y=4 →  gap gone
```

Implementation: wrap a `Pressable` in a container View. The container holds the floor (same shape, darker color). The inner Pressable translates with `Animated.Value`.

### Material Elevation (non-button surfaces)

| Level | `elevation` | Usage |
|---|---|---|
| 0 | 0 | Flat (page background) |
| 1 | 2 | Subtle lift (list items on scroll) |
| 2 | 4 | Cards |
| 3 | 8 | Bottom sheets, modals |
| 4 | 16 | Full-screen overlays |

---

## 6. Components

### 6.1 PrimaryButton

Pill-shaped, solid fill, 3D depth effect.

```
┌──────────────────────────────┐  ← button face (green.500, radius.full)
│         CONTINUE             │    height: 56px, paddingHorizontal: space.8
└──────────────────────────────┘
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← floor slab (green.600), height: 4px
```

- Text: `label` style, `textPrimary` on dark backgrounds (white on green)
- Disabled: face `neutral.100`, floor `neutral.200`, text `neutral.300`
- Full-width by default; accepts `size="sm"` (height 44px) variant

### 6.2 SecondaryButton

Pill-shaped, outlined, no depth effect.

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ← transparent fill, 2px border (green.500)
│         ADD HABIT            │    height: 52px
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

- Text: `label` style, `green.500`
- Pressed: fill `green.100` (light mode) / `dark.700` (dark mode)

### 6.3 GhostButton

Text-only, no background, no border. Used for "Maybe later", "Skip" type actions.

- Text: `body` or `bodyLarge` style, `blue.500`
- Pressed: opacity 0.6

### 6.4 Progress Bar

```
┌────────────────────────────────────────┐  ← track (neutral.100 / dark.600), radius.full
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← fill (green.500 / blue.500), animated width
└────────────────────────────────────────┘
```

- Track height: 16px
- Fill animates via `Animated.Value` on mount and value change
- Label text (`0 / 100`) centered inside track in `caption` style, `textMuted`

### 6.5 HabitNode

Circular lesson/habit button arranged in a vertical path layout.

```
      ◉  ← active: green.500 fill, white star icon, pulsing glow ring
      ●  ← upcoming: neutral.100 / dark.700 fill, neutral.300 icon
      ●
   ▣     ← treasure chest (reward checkpoint) — flat icon, no circle
      ●
```

States:
- **Active** (today's target): `green.500`, glowing `green.100` ring, white icon, bounces gently
- **Completed**: `blue.500` fill, white checkmark
- **Locked**: `neutral.100` / `dark.700`, `neutral.300` icon, non-tappable
- **Reward**: Treasure chest illustration, no circle background

Size: 64px diameter for main nodes, 52px for minor/sub nodes.

### 6.6 SectionBanner

Full-width green banner at the top of a path section.

```
╔══════════════════════════════════════╗  ← green.500, radius.lg, padding space.5
║  SECTION 1, UNIT 1      [≡]         ║
║  Make introductions                  ║
╚══════════════════════════════════════╝
```

- Title: `h2` white
- Label: `label` style, rgba(255,255,255,0.8)
- Right icon: notes/guidebook icon, white, tappable
- Margin horizontal: `space.4`

### 6.7 StatBadge

Icon + number in a horizontal row, used in the top header.

```
[🔥] 10    [💎] 515    [⚡] 25
```

- Icon: 20px, colored (amber for streak, blue for gems, pink for energy)
- Number: `h3` style, `textPrimary`
- Minimum tap target: 44×44px
- Arranged in a horizontal `<View style={{ flexDirection: 'row', gap: space.4 }}>`

### 6.8 HabitCard

Card showing a habit with its streak status and today's completion state.

```
┌─────────────────────────────────────┐  ← surface, radius.md, elevation 2
│  🏃 Run 5km              ✓          │  ← title (h3) + completion toggle
│  ──────────────────────────         │  ← progress bar
│  🔥 14 day streak   Best: 21 days   │  ← stat row (bodySmall, textMuted)
└─────────────────────────────────────┘
```

- Background: `surface`
- Padding: `space.5`
- Check icon: green when done, `neutral.100` border when not done (40px circle)
- Tapping the check triggers a confetti burst animation

### 6.9 LeaderboardRow

Horizontal list item for ranking screens.

```
│ 21  [A]  Anton Tanderup          0 XP │
        └── 40px circle, colored initial, bold white letter
```

- Rank number: `h3` style, `textSecondary`, 32px min width
- Avatar: 40px circle, colored background, white initial letter (`h3`)
- Name: `bodyLarge`, `textPrimary`
- XP: `body`, `textMuted`, right-aligned
- Highlighted row (current user): `green.100` / `dark.700` background

### 6.10 StreakDisplay

Full-screen motivational panel shown on streak events.

```
        [mascot illustration]
              206
    ┌─────────────────────────────┐
    │ Do 3 lessons in a row to   │  ← bodyLarge, textPrimary, centered
    │ revive your streak! Ready?  │
    └─────────────────────────────┘
    ○ ─── ○ ─── ○  ← step indicator dots
    ┌───────────────────────────┐
    │         LET'S GO          │  ← PrimaryButton (white fill on dark bg)
    └───────────────────────────┘
```

- Background: deep blue-purple gradient (`#1A1560` → `#3B1FA0`)
- Number: `display` style, white, centered
- Sub-copy: `bodyLarge`, white

### 6.11 BottomTabBar

Five tabs. Active tab gets a blue-outlined rounded square badge behind the icon.

```
[🏠]  [🗂]  [🫐]  [❤️]  [🐦]  [···]
 ↑
active: icon inside a rounded square (radius.sm), blue.500 border 2px, surface fill
```

- Tab icon size: 26px
- Tab bar height: 80px (includes safe area inset)
- Active icon: `blue.500` or brand-specific color per tab
- Inactive icon: `neutral.300` / `dark.300`
- Background: `surface` with 1px top border `border`

### 6.12 QuestCard

Used on the Quests screen. Title + progress bar + reward icon.

```
DAILY QUEST                        ⏱ 4H
Start a streak
[░░░░░░░░░░░░░░░░░] 0 / 1         [📦]
```

- Section label (`label` style, `textMuted`) + timer right-aligned
- Quest name: `h3`, `textPrimary`
- Progress bar: 8px height variant
- Reward chest: 48×48px illustration, right side

---

## 7. Animation

All interactive animations use `react-native-reanimated` (already in the project).

### Button Press (3D push)
```
onPressIn:  translate Y += 4  (duration: 80ms, easing: Easing.out(Easing.quad))
onPressOut: translate Y -= 4  (duration: 120ms, easing: Easing.out(Easing.back))
```

### Habit Completion (check tap)
1. Scale check icon: 1 → 1.3 → 1.0 (spring, duration 300ms)
2. Emit confetti particles from touch point (5-8 colored dots, arc upward)
3. Progress bar fill animates to new value (300ms, Easing.out(Easing.cubic))

### Node Unlock
Spring bounce: scale 0 → 1.2 → 1.0 with `withSpring({ damping: 8, stiffness: 100 })`

### Screen Transitions
Horizontal slide (left for forward, right for back). Use Expo Router's default Stack transition on Android.

### Streak Counter Increment
Roll each digit upward individually with a vertical translate, staggered 50ms per digit.

### Progress Bar Mount
Fill width animates from 0 to target over 600ms with `Easing.out(Easing.cubic)`.

---

## 8. Dark Mode

The app sets `userInterfaceStyle: "automatic"` in `app.json`, meaning the OS controls the mode. In components:

```ts
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme(); // 'light' | 'dark'
const colors = colorScheme === 'dark' ? darkColors : lightColors;
```

Rules:
- Never hard-code hex colors in component files — always reference tokens
- Images/illustrations remain unchanged between modes
- Icons swap from `neutral.900` to `dark.0` automatically via the color alias system
- The green header bar (`SectionBanner`) stays the same green in both modes

---

## 9. Iconography

Use **Material Community Icons** (already bundled via `react-native-vector-icons`). Supplement with custom illustrated icons for:
- Streak fire (animated flame)
- Gem/crystal (XP currency)
- Treasure chest (reward)
- Trophy variants (gold / purple / silver)

Standard icon sizes:
- Navigation / tab icons: 26px
- Inline icons (in text or badges): 18–20px
- Illustration icons (reward, achievement): 48–64px

---

## 10. Layout Patterns

### Screen Shell
```
<SafeAreaView>
  <StatusBar />
  <Header />            ← StatBadge row, height ~52px
  <ScrollView>
    <SectionBanner />
    {/* content */}
  </ScrollView>
  <BottomTabBar />
</SafeAreaView>
```

### Path Layout (Habit Nodes)
Nodes are staggered left/right using absolute or alternating margin offsets on a vertical `ScrollView`. Each node is centered in a 50% column that alternates sides.

```
        ◉         (center)
      ●           (center-left)
              ▣   (center-right)
        ●         (center)
```

### Card List
```
<FlatList
  contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
  ItemSeparatorComponent={() => null}  // use gap instead
/>
```

### Section with Label
```
<View style={{ gap: 12 }}>
  <Text style={styles.label}>DAILY QUEST</Text>
  <QuestCard ... />
</View>
```

---

## 11. Theme File Location

All tokens live in `src/theme/index.ts`. Components import from there — never from inline literals.

```ts
import { colors, spacing, radius, typography } from '@/theme';
```

See `src/theme/index.ts` for the full TypeScript implementation of every token defined in this guide.
