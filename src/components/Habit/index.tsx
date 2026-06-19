import {isToday} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  useColorScheme,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {useAppDispatch} from '../../store/hooks';
import {Habit as HabitType, markTodayDone, markTodayUndone} from '../../store';
import {getStreaks} from '../../utils/calculateStreaks';
import {useTheme, createUseStyles} from '../../theme';
import EditHabit from '../EditHabit';
import EditHabitDates from '../EditHabitDates';

export default function Habit({habit}: {habit: HabitType}) {
  const {t} = useTranslation();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const styles = useStyles();
  const dispatch = useAppDispatch();

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
      <Pressable
        key={`goal${goal}`}
        onPress={isDisabled ? undefined : undefined}
        style={[
          styles.chip,
          goalReached && !isDisabled
            ? {backgroundColor: theme.primaryContainer}
            : isDisabled
            ? {backgroundColor: theme.surfaceVariant, opacity: 0.5}
            : {backgroundColor: theme.surfaceVariant},
        ]}>
        {!isDisabled && !goalReached && (
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(progress * 100, 100)}%` as `${number}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
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
            {
              color:
                goalReached && !isDisabled
                  ? theme.onPrimaryContainer
                  : theme.onSurfaceVariant,
            },
          ]}>
          {t('daysCount', {count: goal})}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.card, {backgroundColor: theme.surface}]}>
      <View style={styles.titleRow}>
        <View style={styles.titleInfo}>
          <Text style={[styles.title, {color: theme.onSurface}]}>
            {habit.name}
          </Text>
          <Text style={[styles.subtitle, {color: theme.onSurfaceVariant}]}>
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
            style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            hitSlop={8}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
          <Pressable
            onPress={() => setDateEditorOpen(true)}
            style={({pressed}) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            hitSlop={8}>
            <MaterialCommunityIcons
              name="calendar-range"
              size={20}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
          <Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
            <Checkbox
              value={doneToday}
              onCheckedChange={() =>
                dispatch(
                  doneToday
                    ? markTodayUndone(habit.id)
                    : markTodayDone(habit.id),
                )
              }
            />
          </Host>
        </View>
      </View>
      <View style={styles.content}>
        {streaksDateArray.length > 1 &&
          longestStreak > 0 &&
          currentStreak !== longestStreak && (
            <View style={[styles.chip, {backgroundColor: theme.surfaceVariant}]}>
              <Text style={[styles.chipText, {color: theme.onSurfaceVariant}]}>
                {t('habitLongest', {count: longestStreak})}
              </Text>
            </View>
          )}
        {habit.goals && habit.goals.length > 0 ? (
          habit.goals.map(renderGoalChip)
        ) : (
          <Pressable
            onPress={() => setEditorOpen(true)}
            style={[styles.chip, {backgroundColor: theme.surfaceVariant}]}>
            <Text style={[styles.chipText, {color: theme.onSurfaceVariant}]}>
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
    paddingBottom: 11,
    borderRadius: 12,
    elevation: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
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
    paddingHorizontal: 12,
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
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
  },
  progressBarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
    overflow: 'hidden',
    marginRight: 4,
    justifyContent: 'flex-end',
  },
  progressBarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
}));
