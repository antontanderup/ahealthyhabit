import React from 'react';
import {store, Habbit, editDates} from '../../store';
import {DatePickerModal} from 'react-native-paper-dates';

const EditHabitDates = ({
  isOpen,
  onClose,
  habbit,
}: {
  habbit: Habbit;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const streaksDateArray = React.useMemo(
    () => habbit.recordedDates.map(stringDate => new Date(stringDate)),
    [habbit.recordedDates],
  );

  const onConfirm = ({dates}: {dates: Date[]}) => {
    store.dispatch(
      editDates({
        id: habbit.id,
        dates: dates.map(date => date.toDateString()),
      }),
    );
    onClose();
  };

  return (
    <DatePickerModal
      mode="multiple"
      visible={isOpen}
      onDismiss={onClose}
      dates={streaksDateArray}
      onConfirm={onConfirm}
      validRange={{
        endDate: new Date(), // optional
      }}
      animationType="fade"
    />
  );
};

export default EditHabitDates;
