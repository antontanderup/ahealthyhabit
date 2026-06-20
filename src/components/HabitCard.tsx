import React, {useCallback, useMemo} from 'react';
import {View, Text, Pressable, StyleSheet, useColorScheme} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {isToday} from 'date-fns';
import type {Habit} from '../types';
import {useHabits} from '../habits/HabitsContext';
import {palette, semanticColors, spacing, radius, typography} from '../theme';
import type {ColorScheme} from '../theme';
import {getStreaks} from '../utils/calculateStreaks';
import {parseLocalDate} from '../utils/dateUtils';

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({habit}: HabitCardProps) {
  const {markTodayDone, markTodayUndone} = useHabits();
  const {t} = useTranslation();
  const rawScheme = useColorScheme();
  const colorScheme: ColorScheme = rawScheme === 'dark' ? 'dark' : 'light';
  const colors = semanticColors[colorScheme];

  const isDoneToday = useMemo(() => {
    if (habit.recordedDates.length === 0) return false;
    return isToday(parseLocalDate(habit.recordedDates[0]));
  }, [habit.recordedDates]);

  const streaks = useMemo(
    () => getStreaks(habit.recordedDates),
    [habit.recordedDates],
  );

  const currentStreak = useMemo(() => {
    const first = streaks[0];
    if (!first?.isCurrentStreak) return 0;
    return first.dates.length;
  }, [streaks]);

  const longestStreak = useMemo(() => {
    if (streaks.length === 0) return 0;
    return Math.max(...streaks.map(s => s.dates.length));
  }, [streaks]);

  const scale = useSharedValue(1);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handleToggle = useCallback(async () => {
    scale.value = withSpring(1.3, {damping: 8, stiffness: 300}, () => {
      scale.value = withSpring(1, {damping: 8, stiffness: 200});
    });
    if (isDoneToday) {
      await markTodayUndone(habit.id);
    } else {
      await markTodayDone(habit.id);
    }
  }, [isDoneToday, habit.id, markTodayDone, markTodayUndone, scale]);

  const streakMessage = isDoneToday
    ? t('habitCurrentTodayDone', {count: currentStreak})
    : t('habitCurrent', {count: currentStreak});

  const streakPrefix = currentStreak > 0 ? '🔥 ' : '';

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.surface, borderColor: colors.border},
      ]}>
      <View style={styles.header}>
        <Text
          style={[styles.name, {color: colors.textPrimary}]}
          numberOfLines={2}>
          {habit.name}
        </Text>
        <Animated.View style={checkAnimStyle}>
          <Pressable
            onPress={handleToggle}
            hitSlop={8}
            style={[
              styles.checkButton,
              isDoneToday
                ? styles.checkDone
                : [styles.checkUndone, {borderColor: colors.border}],
            ]}>
            {isDoneToday && (
              <Text style={styles.checkMark}>{'✓'}</Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
      <View style={styles.statsRow}>
        <Text style={[styles.statsText, {color: colors.textMuted}]}>
          {streakPrefix + streakMessage}
        </Text>
        {longestStreak > 1 && (
          <Text style={[styles.statsText, {color: colors.textMuted}]}>
            {'  ·  '}
            {t('habitLongest', {count: longestStreak})}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing[5],
    elevation: 2,
    borderWidth: 1,
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...(typography.h3 as object),
    flex: 1,
    marginRight: spacing[3],
  } as object,
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: palette.green[500],
  },
  checkUndone: {
    borderWidth: 2,
  },
  checkMark: {
    color: palette.neutral[0],
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statsText: {
    ...(typography.bodySmall as object),
  } as object,
});
