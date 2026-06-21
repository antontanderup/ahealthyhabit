import {isToday} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {View, Text, Pressable, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {clip, Shapes} from '@expo/ui/jetpack-compose/modifiers';
import type {Habit as HabitType} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {getStreaks} from '../../utils/calculateStreaks';
import {useTheme, createUseStyles} from '../../theme';
import EditHabit from '../EditHabit';
import EditHabitDates from '../EditHabitDates';

export default function Habit({habit}: {habit: HabitType}) {
  const {t} = useTranslation();
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = useStyles();
  const {markTodayDone, markTodayUndone} = useHabits();

  const streaksDateArray = useMemo(
    () => getStreaks(habit.recordedDates),
    [habit.recordedDates],
  );

  const latestStreak = streaksDateArray[0];
  const lastDoneDate = latestStreak?.dates[0];
  const doneToday = lastDoneDate !== undefined && isToday(lastDoneDate);
  const currentStreak = latestStreak?.isCurrentStreak
    ? latestStreak.dates.length
    : 0;
  const longestStreak = useMemo(
    () =>
      streaksDateArray.reduce((max, s) => Math.max(max, s.dates.length), 0),
    [streaksDateArray],
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [dateEditorOpen, setDateEditorOpen] = useState(false);

  const renderGoalChip = (goal: number, index: number, goals: number[]) => {
    const isDisabled =
      goals[index - 1] != null && longestStreak / goals[index - 1] < 1;
    const progress = longestStreak / goal;
    const goalReached = progress >= 1;
    return (
      <View
        key={`goal${goal}`}
        style={[
          styles.chip,
          !isDisabled && styles.chipWithAvatar,
          goalReached && !isDisabled ? styles.chipGoalReached : styles.chipNotReached,
          isDisabled && styles.chipDisabled,
        ]}>
        {!isDisabled && !goalReached && (
          <View
            style={[
              styles.chipProgressFill,
              {width: `${Math.min(progress * 100, 100)}%` as `${number}%`},
            ]}
          />
        )}
        {goalReached && !isDisabled && (
          <MaterialCommunityIcons
            name="star"
            size={16}
            color={theme.onPrimaryContainer}
            style={styles.chipIcon}
          />
        )}
        <Text
          style={[
            styles.chipText,
            goalReached && !isDisabled
              ? styles.chipTextGoalReached
              : styles.chipTextDefault,
          ]}>
          {t('daysCount', {count: goal})}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.titleInfo}>
          <Text style={styles.title}>{habit.name}</Text>
          <Text style={styles.subtitle}>
            {currentStreak === 0
              ? t(doneToday ? 'habitCurrentTodayDoneZero' : 'habitCurrentZero')
              : t(doneToday ? 'habitCurrentTodayDone' : 'habitCurrent', {
                  count: currentStreak,
                })}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <Pressable
            onPress={() => setEditorOpen(true)}
            style={({pressed}) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            hitSlop={8}
            accessibilityLabel="Edit habit">
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
          <Pressable
            onPress={() => setDateEditorOpen(true)}
            style={({pressed}) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            hitSlop={8}
            accessibilityLabel="Edit dates">
            <MaterialCommunityIcons
              name="calendar-range"
              size={20}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
          <Host
            matchContents
            seedColor={theme.primary}
            colorScheme={colorScheme}>
            <Checkbox
              value={doneToday}
              onCheckedChange={() =>
                doneToday ? markTodayUndone(habit.id) : markTodayDone(habit.id)
              }
              modifiers={[clip(Shapes.Circle)]}
            />
          </Host>
        </View>
      </View>
      <View style={styles.content}>
        {streaksDateArray.length > 1 &&
          longestStreak > 0 &&
          currentStreak !== longestStreak && (
            <View style={[styles.chip, styles.chipNotReached]}>
              <Text style={[styles.chipText, styles.chipTextDefault]}>
                {t('habitLongest', {count: longestStreak})}
              </Text>
            </View>
          )}
        {habit.goals && habit.goals.length > 0 ? (
          habit.goals.map(renderGoalChip)
        ) : (
          <Pressable
            onPress={() => setEditorOpen(true)}
            style={[styles.chip, styles.chipNotReached]}>
            <Text style={[styles.chipText, styles.chipTextDefault]}>
              {t('addGoals')}
            </Text>
          </Pressable>
        )}
      </View>
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
    </View>
  );
}

const useStyles = createUseStyles(theme => ({
  card: {
    marginHorizontal: 13,
    marginTop: 15,
    paddingBottom: 2,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.onSurface,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    color: theme.onSurfaceVariant,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  iconButton: {
    padding: 8,
  },
  iconButtonPressed: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  chipWithAvatar: {
    paddingLeft: 6,
  },
  chipGoalReached: {
    backgroundColor: theme.primaryContainer,
  },
  chipNotReached: {
    backgroundColor: theme.surfaceContainerHigh,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipProgressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    opacity: 0.3,
    backgroundColor: theme.primary,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
  },
  chipTextGoalReached: {
    color: theme.onPrimaryContainer,
  },
  chipTextDefault: {
    color: theme.onSurfaceVariant,
  },
}));
