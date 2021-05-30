import React from 'react';
import i18n from 'i18n-js';
import {Calendar} from 'react-native-calendars';
import {Portal, Dialog, Button, useTheme} from 'react-native-paper';
import {store, toggleDate, Habbit} from '../../store';
import {format} from 'date-fns';

const EditHabitDates = ({
  isOpen,
  onClose,
  habbit,
}: {
  habbit?: Habbit;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const {colors} = useTheme();

  const closeEditor = () => {
    onClose();
  };

  const markedDates = () => {
    const dates: {[key: string]: any} = {};
    habbit?.recordedDates.forEach(date => {
      dates[format(new Date(date), 'yyyy-LL-dd')] = {
        selected: true,
        color: colors.primary,
      };
    });
    return dates;
  };

  const dayPressed = (day: {dateString: string}) => {
    if (habbit) {
      store.dispatch(
        toggleDate({
          id: habbit.id,
          date: day.dateString,
        }),
      );
    }
  };
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={closeEditor}>
        <Dialog.Content>
          <Calendar
            markedDates={markedDates()}
            onDayPress={dayPressed}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: colors.accent,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.text,
              dayTextColor: colors.text,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              todayTextColor: colors.primary,
            }}
            maxDate={format(new Date(), 'yyyy-LL-dd')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            compact
            color={colors.primary}
            onPress={closeEditor}>
            {i18n.t('Done')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditHabitDates;
