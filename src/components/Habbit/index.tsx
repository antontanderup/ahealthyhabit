import {isToday} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import i18n from 'i18n-js';
import {
  Avatar,
  Card,
  Checkbox,
  Chip,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import {Habbit, markTodayDone, markTodayUndone, store} from '../../store';
import {getStreaks} from '../../utils/calculateStreaks';
import EditHabbit from '../EditHabbit';
import EditHabitDates from '../EditHabbitDates';

export default ({habbit}: {habbit: Habbit}) => {
  // Process streaks
  const streaksDateArray = useMemo(
    () => getStreaks(habbit.recordedDates),
    [habbit.recordedDates],
  );

  // Helper consts
  const latestStreak = streaksDateArray[0];
  const lastDoneDate = latestStreak && latestStreak.dates[0];
  const doneToday = isToday(lastDoneDate);
  const currentStreak = latestStreak?.isCurrentStreak
    ? latestStreak?.dates?.length
    : 0;
  const longestStreak: number = useMemo(() => {
    const streaklengths = streaksDateArray.map(streak => streak.dates.length);
    return streaklengths.length > 0
      ? streaklengths.reduce((a, b) => Math.max(a, b))
      : 0;
  }, [streaksDateArray]);

  // Habbit editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [dateEditorOpen, setDateEditorOpen] = useState(false);

  const goalChip = (goal: number, index: number, goals: number[]) => {
    const isDisabled =
      goals[index - 1] && longestStreak / goals[index - 1] < 1 ? true : false;
    const progress = longestStreak / goal;
    const goalReached = progress >= 1;
    return (
      <Chip
        disabled={isDisabled}
        avatar={
          !isDisabled && !goalReached ? (
            <ProgressBar progress={progress} />
          ) : goalReached && !isDisabled ? (
            <Avatar.Icon icon="star" size={28} />
          ) : null
        }
        key={`goal${goal}`}
        style={styles.chip}>
        {i18n.t('Days.count', {count: goal})}
      </Chip>
    );
  };

  return (
    <Card
      elevation={4}
      mode="elevated"
      style={{
        marginHorizontal: 13,
        marginTop: 15,
        paddingBottom: 11,
      }}>
      <Card.Title
        title={habbit.name}
        subtitle={i18n.t(
          doneToday ? 'habbit.currentTodayDone.count' : 'habbit.current.count',
          {count: currentStreak},
        )}
        right={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}>
            <IconButton
              icon="dots-vertical"
              onPress={() => setEditorOpen(true)}
              size={20}
              style={{marginRight: 0}}
            />
            <IconButton
              icon="calendar-range"
              onPress={() => setDateEditorOpen(true)}
              size={20}
              style={{marginLeft: 0, marginRight: 15}}
            />
            <Checkbox
              status={doneToday ? 'checked' : 'unchecked'}
              onPress={() => {
                if (doneToday) {
                  store.dispatch(markTodayUndone(habbit.id));
                } else {
                  store.dispatch(markTodayDone(habbit.id));
                }
              }}
            />
          </View>
        )}
      />
      <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {streaksDateArray.length > 1 &&
          longestStreak > 0 &&
          currentStreak !== longestStreak && (
            <Chip style={styles.chip}>
              {i18n.t('habbit.longest.count', {count: longestStreak})}
            </Chip>
          )}
        {habbit.goals && habbit.goals.length > 0 ? (
          habbit.goals.map(goalChip)
        ) : (
          <Chip onPress={() => setEditorOpen(true)} style={styles.chip}>
            {i18n.t('Add goals')}
          </Chip>
        )}
      </Card.Content>
      <EditHabbit
        isOpen={editorOpen}
        habbit={habbit}
        onClose={() => setEditorOpen(false)}
      />
      <EditHabitDates
        isOpen={dateEditorOpen}
        habbit={habbit}
        onClose={() => setDateEditorOpen(false)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  chip: {marginRight: 8, marginBottom: 10},
});
