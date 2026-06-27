import {isToday} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Checkbox} from '../Checkbox';
import type {Habit as HabitType} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {getStreaks} from '../../utils/calculateStreaks';
import {useTheme, createUseStyles} from '../../theme';
import EditHabit from '../EditHabit';
import EditHabitDates from '../EditHabitDates';
import {useSettingsStore} from '../../store';
import {extractLeadingEmoji} from '../../utils/emojiUtils';

type CardProps = {
  habit: HabitType;
  doneToday: boolean;
  currentStreak: number;
  longestStreak: number;
  onToggleDone: () => void;
  onEditOpen: () => void;
  onDateEditorOpen: () => void;
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Big colored card — the streak number lives as a massive faded watermark,
// and a full-width button anchors the bottom.

function HeroCard({
  habit,
  doneToday,
  currentStreak,
  longestStreak,
  onToggleDone,
  onEditOpen,
  onDateEditorOpen,
}: CardProps) {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useHeroStyles();

  const displayNumber = currentStreak > 0 ? currentStreak : longestStreak;
  const nextGoal = habit.goals?.find(g => longestStreak < g) ?? null;
  const nextGoalProgress = nextGoal ? Math.min(longestStreak / nextGoal, 1) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.watermark}>{displayNumber > 0 ? displayNumber : ''}</Text>

      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{habit.name}</Text>
        <Pressable
          onPress={onEditOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit habit">
          <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.onSecondaryContainer} />
        </Pressable>
        <Pressable
          onPress={onDateEditorOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit dates">
          <MaterialCommunityIcons name="calendar-range" size={20} color={theme.onSecondaryContainer} />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        {currentStreak === 0
          ? t(doneToday ? 'habitCurrentTodayDoneZero' : 'habitCurrentZero')
          : t(doneToday ? 'habitCurrentTodayDone' : 'habitCurrent', {count: currentStreak})}
      </Text>

      {nextGoal != null && (
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.round(nextGoalProgress * 100)}%` as `${number}%`},
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {t('daysCount', {count: longestStreak})} / {t('daysCount', {count: nextGoal})}
          </Text>
        </View>
      )}

      <Pressable
        onPress={onToggleDone}
        style={({pressed}) => [
          styles.doneButton,
          {backgroundColor: doneToday ? theme.secondary : theme.onSecondaryContainer},
          pressed && styles.doneButtonPressed,
        ]}
        accessibilityLabel="Toggle done">
        <MaterialCommunityIcons
          name={doneToday ? 'check-circle' : 'circle-outline'}
          size={20}
          color={doneToday ? theme.onSecondary : theme.secondaryContainer}
        />
        <Text
          style={[
            styles.doneButtonText,
            {color: doneToday ? theme.onSecondary : theme.secondaryContainer},
          ]}>
          {t(doneToday ? 'markedDone' : 'markDone')}
        </Text>
      </Pressable>
    </View>
  );
}

const useHeroStyles = createUseStyles(theme => ({
  card: {
    marginHorizontal: 13,
    marginTop: 15,
    borderRadius: 16,
    backgroundColor: theme.secondaryContainer,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: 8,
    bottom: 44,
    fontSize: 112,
    fontWeight: '900',
    color: theme.onSecondaryContainer,
    opacity: 0.08,
    lineHeight: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingTop: 14,
    paddingRight: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: theme.onSecondaryContainer,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    color: theme.onSecondaryContainer,
    opacity: 0.75,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  iconButton: {padding: 8, marginTop: -2},
  iconButtonPressed: {opacity: 0.5},
  progressSection: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.onSecondaryContainer + '33',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: theme.secondary,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    marginTop: 4,
    color: theme.onSecondaryContainer,
    opacity: 0.6,
    textAlign: 'right',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  doneButtonPressed: {opacity: 0.75},
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
}));

// ─── Compact ──────────────────────────────────────────────────────────────────
// Single tight row per habit — streak as a pill, goals as coloured dots.

function CompactCard({
  habit,
  doneToday,
  currentStreak,
  longestStreak,
  onToggleDone,
  onEditOpen,
  onDateEditorOpen,
}: CardProps) {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useCompactStyles();
  const displayStreak = currentStreak > 0 ? currentStreak : longestStreak;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.indicator, doneToday && styles.indicatorDone]} />
        <Text style={styles.title} numberOfLines={1}>{habit.name}</Text>
        {displayStreak > 0 && (
          <View style={[styles.streakPill, doneToday && styles.streakPillDone]}>
            <Text style={[styles.streakPillText, doneToday && styles.streakPillTextDone]}>
              {t('daysCount', {count: displayStreak})}
            </Text>
          </View>
        )}
        <Pressable
          onPress={onEditOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit habit">
          <MaterialCommunityIcons name="dots-vertical" size={18} color={theme.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={onDateEditorOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit dates">
          <MaterialCommunityIcons name="calendar-range" size={18} color={theme.onSurfaceVariant} />
        </Pressable>
        <Checkbox value={doneToday} onValueChange={onToggleDone} style={styles.iconButton} />
      </View>
      {habit.goals && habit.goals.length > 0 && (
        <View style={styles.dotsRow}>
          {habit.goals.map(goal => (
            <View
              key={`dot${goal}`}
              style={[styles.dot, longestStreak >= goal && styles.dotReached]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const useCompactStyles = createUseStyles(theme => ({
  card: {
    marginHorizontal: 13,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: theme.surfaceContainer,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 2,
    paddingVertical: 2,
  },
  indicator: {
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: theme.outlineVariant,
    marginRight: 10,
  },
  indicatorDone: {backgroundColor: theme.primary},
  title: {flex: 1, fontSize: 15, fontWeight: '600', color: theme.onSurface},
  streakPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: theme.surfaceContainerHigh,
    marginRight: 4,
  },
  streakPillDone: {backgroundColor: theme.primaryContainer},
  streakPillText: {fontSize: 12, fontWeight: '600', color: theme.onSurfaceVariant},
  streakPillTextDone: {color: theme.onPrimaryContainer},
  iconButton: {padding: 6},
  iconButtonPressed: {opacity: 0.5},
  dotsRow: {
    flexDirection: 'row',
    paddingLeft: 23,
    paddingBottom: 8,
    paddingTop: 2,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.outlineVariant,
  },
  dotReached: {backgroundColor: theme.primary},
}));

// ─── Stats ────────────────────────────────────────────────────────────────────
// Dashboard view — three big numbers tell the whole story at a glance.

function StatsCard({
  habit,
  doneToday,
  currentStreak,
  longestStreak,
  onToggleDone,
  onEditOpen,
  onDateEditorOpen,
}: CardProps) {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useStatsStyles();
  const totalDays = habit.recordedDates.length;
  const goalsReached = (habit.goals ?? []).filter(g => longestStreak >= g).length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{habit.name}</Text>
        <Pressable
          onPress={onEditOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit habit">
          <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={onDateEditorOpen}
          style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          hitSlop={8}
          accessibilityLabel="Edit dates">
          <MaterialCommunityIcons name="calendar-range" size={20} color={theme.onSurfaceVariant} />
        </Pressable>
        <Checkbox value={doneToday} onValueChange={onToggleDone} style={styles.iconButton} />
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, doneToday && styles.statNumberActive]}>
            {currentStreak}
          </Text>
          <Text style={styles.statLabel}>{t('statsNow')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{longestStreak}</Text>
          <Text style={styles.statLabel}>{t('statsBest')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalDays}</Text>
          <Text style={styles.statLabel}>{t('statsTotal')}</Text>
        </View>
      </View>

      {habit.goals && habit.goals.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.goalsRow}>
            {habit.goals.map((goal, index, goals) => {
              const isDisabled = goals[index - 1] != null && longestStreak < goals[index - 1];
              const reached = longestStreak >= goal;
              return (
                <View
                  key={`goal${goal}`}
                  style={[
                    styles.goalChip,
                    reached ? styles.goalChipReached : styles.goalChipPending,
                    isDisabled && styles.goalChipDisabled,
                  ]}>
                  <MaterialCommunityIcons
                    name={reached ? 'trophy-outline' : 'flag-outline'}
                    size={12}
                    color={reached ? theme.onPrimaryContainer : theme.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.goalChipText,
                      reached ? styles.goalChipTextReached : styles.goalChipTextPending,
                    ]}>
                    {t('daysCount', {count: goal})}
                  </Text>
                </View>
              );
            })}
            {goalsReached > 0 && (
              <Text style={styles.goalsReachedNote}>
                {t('goalsReached', {count: goalsReached})}
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const useStatsStyles = createUseStyles(theme => ({
  card: {
    marginHorizontal: 13,
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: {flex: 1, fontSize: 16, fontWeight: '600', color: theme.onSurface},
  iconButton: {padding: 8},
  iconButtonPressed: {opacity: 0.5},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.outlineVariant,
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  statItem: {flex: 1, alignItems: 'center'},
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.onSurfaceVariant,
  },
  statNumberActive: {color: theme.primary},
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
    color: theme.onSurfaceVariant,
    opacity: 0.7,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: theme.outlineVariant,
    marginVertical: 4,
  },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    alignItems: 'center',
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  goalChipReached: {backgroundColor: theme.primaryContainer},
  goalChipPending: {backgroundColor: theme.surfaceContainerHigh},
  goalChipDisabled: {opacity: 0.4},
  goalChipText: {fontSize: 12},
  goalChipTextReached: {color: theme.onPrimaryContainer},
  goalChipTextPending: {color: theme.onSurfaceVariant},
  goalsReachedNote: {
    fontSize: 11,
    color: theme.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
}));

// ─── Default ──────────────────────────────────────────────────────────────────
// Letter avatar + coloured accent strip — friendly and personal.

function DefaultCard({
  habit,
  doneToday,
  currentStreak,
  longestStreak,
  onToggleDone,
  onEditOpen,
  onDateEditorOpen,
}: CardProps) {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useDefaultStyles();
  const emojiResult = extractLeadingEmoji(habit.name);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {emojiResult != null && (
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{emojiResult.emoji}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {emojiResult != null ? emojiResult.rest : habit.name}
          </Text>
          <Text style={styles.subtitle}>
            {currentStreak === 0
              ? t(doneToday ? 'habitCurrentTodayDoneZero' : 'habitCurrentZero')
              : t(doneToday ? 'habitCurrentTodayDone' : 'habitCurrent', {
                  count: currentStreak,
                })}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onEditOpen}
            style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            hitSlop={8}
            accessibilityLabel="Edit habit">
            <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.onSurfaceVariant} />
          </Pressable>
          <Pressable
            onPress={onDateEditorOpen}
            style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            hitSlop={8}
            accessibilityLabel="Edit dates">
            <MaterialCommunityIcons name="calendar-range" size={20} color={theme.onSurfaceVariant} />
          </Pressable>
          <Checkbox value={doneToday} onValueChange={onToggleDone} style={styles.iconButton} />
        </View>
      </View>

      <View style={styles.goalsRow}>
        {habit.goals && habit.goals.length > 0 ? (
          habit.goals.map((goal, index, goals) => {
            const isDisabled = goals[index - 1] != null && longestStreak < goals[index - 1];
            const reached = longestStreak >= goal;
            const progress = Math.min(longestStreak, goal) / goal;
            return (
              <View
                key={`goal${goal}`}
                style={[
                  styles.goalTag,
                  reached ? styles.goalTagReached : styles.goalTagPending,
                  isDisabled && styles.goalTagDisabled,
                ]}>
                {!reached && (
                  <View style={styles.goalTagProgressContainer}>
                    <View style={[styles.goalTagProgressFill, {flex: progress}]} />
                    <View style={{flex: 1 - progress}} />
                  </View>
                )}
                <MaterialCommunityIcons
                  name={reached ? 'star' : 'star-outline'}
                  size={13}
                  color={reached ? theme.onPrimaryContainer : theme.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.goalTagText,
                    reached ? styles.goalTagTextReached : styles.goalTagTextPending,
                  ]}>
                  {t('daysCount', {count: goal})}
                </Text>
              </View>
            );
          })
        ) : (
          <Pressable onPress={onEditOpen} style={styles.addGoalsRow}>
            <MaterialCommunityIcons name="plus-circle-outline" size={14} color={theme.onSurfaceVariant} />
            <Text style={styles.addGoalsText}>{t('addGoals')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const useDefaultStyles = createUseStyles(theme => ({
  card: {
    marginHorizontal: 13,
    marginTop: 15,
    borderRadius: 16,
    backgroundColor: theme.surfaceContainer,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 2,
    paddingVertical: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  info: {flex: 1},
  title: {fontSize: 16, fontWeight: '700', color: theme.onSurface},
  subtitle: {fontSize: 13, color: theme.onSurfaceVariant, marginTop: 1},
  actions: {flexDirection: 'row', alignItems: 'center'},
  iconButton: {padding: 8},
  iconButtonPressed: {opacity: 0.5},
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  goalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  goalTagProgressContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  goalTagProgressFill: {
    backgroundColor: theme.primaryContainer,
  },
  goalTagReached: {backgroundColor: theme.primaryContainer},
  goalTagPending: {backgroundColor: theme.surfaceContainerHigh},
  goalTagDisabled: {opacity: 0.4},
  goalTagText: {fontSize: 13},
  goalTagTextReached: {color: theme.onPrimaryContainer, fontWeight: '600'},
  goalTagTextPending: {color: theme.onSurfaceVariant},
  addGoalsRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  addGoalsText: {fontSize: 13, color: theme.onSurfaceVariant},
}));

// ─── Main component ────────────────────────────────────────────────────────────

export default function Habit({habit}: {habit: HabitType}) {
  const {markTodayDone, markTodayUndone} = useHabits();
  const cardStyle = useSettingsStore(state => state.cardStyle);

  const streaksDateArray = useMemo(
    () => getStreaks(habit.recordedDates),
    [habit.recordedDates],
  );

  const latestStreak = streaksDateArray[0];
  const lastDoneDate = latestStreak?.dates[0];
  const doneToday = lastDoneDate !== undefined && isToday(lastDoneDate);
  const currentStreak = latestStreak?.isCurrentStreak ? latestStreak.dates.length : 0;
  const longestStreak = useMemo(
    () => streaksDateArray.reduce((max, s) => Math.max(max, s.dates.length), 0),
    [streaksDateArray],
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [dateEditorOpen, setDateEditorOpen] = useState(false);

  const cardProps: CardProps = {
    habit,
    doneToday,
    currentStreak,
    longestStreak,
    onToggleDone: () =>
      doneToday ? markTodayUndone(habit.id) : markTodayDone(habit.id),
    onEditOpen: () => setEditorOpen(true),
    onDateEditorOpen: () => setDateEditorOpen(true),
  };

  return (
    <>
      {cardStyle === 'hero' ? (
        <HeroCard {...cardProps} />
      ) : cardStyle === 'compact' ? (
        <CompactCard {...cardProps} />
      ) : cardStyle === 'stats' ? (
        <StatsCard {...cardProps} />
      ) : (
        <DefaultCard {...cardProps} />
      )}
      <EditHabit
        isOpen={editorOpen}
        habit={habit}
        onClose={() => setEditorOpen(false)}
      />
      <EditHabitDates
        isOpen={dateEditorOpen}
        habit={habit}
        onClose={() => setDateEditorOpen(false)}
      />
    </>
  );
}
