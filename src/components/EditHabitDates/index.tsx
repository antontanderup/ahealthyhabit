import React from 'react';
import {DatePickerModal} from 'react-native-paper-dates';
import {useAppDispatch} from '../../store/hooks';
import {Habit, editDates} from '../../store';
import {toLocalISODate} from '../../utils/dateUtils';

export default function EditHabitDates({
  isOpen,
  onClose,
  habit,
}: {
  habit: Habit;
  onClose: () => void;
  isOpen: boolean;
}) {
  const dispatch = useAppDispatch();

  const dates = React.useMemo(
    () =>
      habit.recordedDates.map(d => {
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day);
      }),
    [habit.recordedDates],
  );

  const onConfirm = ({dates: newDates}: {dates: Date[]}) => {
    dispatch(
      editDates({
        id: habit.id,
        dates: newDates.map(toLocalISODate),
      }),
    );
    onClose();
  };

  return (
    <DatePickerModal
      locale="en"
      mode="multiple"
      visible={isOpen}
      onDismiss={onClose}
      dates={dates}
      onConfirm={onConfirm}
      validRange={{endDate: new Date()}}
      animationType="fade"
    />
  );
}
