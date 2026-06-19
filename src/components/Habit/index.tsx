import {isToday} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  Card,
  Checkbox,
  Chip,
  IconButton,
} from 'react-native-paper';
import {useAppDispatch} from '../../store/hooks';
import {Habit as HabitType, markTodayDone, markTodayUndone} from '../../store';
import {getStreaks} from '../../utils/calculateStreaks';
import EditHabit from '../EditHabit';
import EditHabitDates from '../EditHabitDates';

export default function Habit({habit}: {habit: HabitType}) {
  const {t} = useTranslation();
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
    const goalReached = longestStreak >= goal;
    return (
      <Chip
        disabled={isDisabled}
        selected={goalReached && !isDisabled}
        icon={goalReached && !isDisabled ? 'star' : undefined}
        key={`goal${goal}`}
        style={styles.chip}>
        {t('daysCount', {count: goal})}
      </Chip>
    );
  };

  return (
    <Card elevation={1} mode="elevated" style={styles.card}>
      <Card.Title
        title={habit.name}
        subtitle={
          currentStreak === 0
            ? t(doneToday ? 'habitCurrentTodayDoneZero' : 'habitCurrentZero')
            : t(doneToday ? 'habitCurrentTodayDone' : 'habitCurrent', {
                count: currentStreak,
              })
        }
        right={() => (
          <View style={styles.cardActions}>
            <IconButton
              icon="dots-vertical"
              onPress={() => setEditorOpen(true)}
              size={20}
              style={styles.iconLeft}
            />
            <IconButton
              icon="calendar-range"
              onPress={() => setDateEditorOpen(true)}
              size={20}
              style={styles.iconRight}
            />
            <Checkbox
              status={doneToday ? 'checked' : 'unchecked'}
              onPress={() =>
                dispatch(
                  doneToday
                    ? markTodayUndone(habit.id)
                    : markTodayDone(habit.id),
                )
              }
            />
          </View>
        )}
      />
      <Card.Content style={styles.content}>
        {streaksDateArray.length > 1 &&
          longestStreak > 0 &&
          currentStreak !== longestStreak && (
            <Chip style={styles.chip}>
              {t('habitLongest', {count: longestStreak})}
            </Chip>
          )}
        {habit.goals && habit.goals.length > 0 ? (
          habit.goals.map(renderGoalChip)
        ) : (
          <Chip onPress={() => setEditorOpen(true)} style={styles.chip}>
            {t('addGoals')}
          </Chip>
        )}
      </Card.Content>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 13, marginTop: 15, paddingBottom: 11},
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconLeft: {marginRight: 0},
  iconRight: {marginLeft: 0, marginRight: 15},
  content: {flexDirection: 'row', flexWrap: 'wrap'},
  chip: {marginRight: 8, marginBottom: 10, borderRadius: 50},
});
