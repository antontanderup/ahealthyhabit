import React, {useState} from 'react';
import i18n from 'i18n-js';
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  Portal,
  Subheading,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {addHabbit, editHabbit, Habbit, removeHabbit, store} from '../../store';
import produce from 'immer';
import {View} from 'react-native';

const EditHabbit = ({
  habbit,
  onClose,
  isOpen,
}: {
  habbit?: Habbit;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const {colors} = useTheme();

  // Habbit editor state
  const initialEditState = {
    name: habbit?.name || '',
    goals: habbit?.goals || [],
  };

  const [editState, setEditState] = useState({
    name: habbit?.name || '',
    goals: habbit?.goals || [],
  });

  const dispatchEditState = ({
    type,
    payload,
  }: {
    type: string;
    payload?: {name?: string; save?: boolean; goal?: number};
  }) => {
    const newState = produce(editState, (draft: typeof initialEditState) => {
      switch (type) {
        case 'INPUT_NAME':
          draft.name = payload?.name || '';
          break;
        case 'ADD_GOAL': {
          if (payload?.goal) {
            draft.goals.push(payload.goal);
          }
          break;
        }
        case 'REMOVE_GOAL': {
          draft.goals = draft.goals.filter(
            (value: number) => value !== payload?.goal,
          );
          break;
        }
      }
    });
    setEditState(newState);
  };

  const closeEditor = () => {
    if (habbit?.id) {
      store.dispatch(
        editHabbit({
          id: habbit.id,
          name: editState.name,
          goals: editState.goals,
        }),
      );
    } else if (editState.name && editState.name !== '') {
      store.dispatch(addHabbit(editState.name, editState.goals));
    }
    onClose();
  };

  const renderGoalCheckbox = (goalValue: number, index: number) => {
    return (
      <View key={`goal${goalValue}`}>
        {index > 0 && <Divider />}
        <Checkbox.Item
          label={i18n.t('Days.count', {count: goalValue})}
          status={editState.goals.includes(goalValue) ? 'checked' : 'unchecked'}
          onPress={() => {
            if (editState.goals.includes(goalValue)) {
              dispatchEditState({
                type: 'REMOVE_GOAL',
                payload: {goal: goalValue},
              });
            } else {
              dispatchEditState({
                type: 'ADD_GOAL',
                payload: {goal: goalValue},
              });
            }
          }}
        />
      </View>
    );
  };

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={closeEditor}>
        <Dialog.Title>
          {i18n.t('Edit')} {habbit?.name || i18n.t('Add habbit')}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label={i18n.t('Habbit name')}
            value={editState.name}
            onChangeText={name =>
              dispatchEditState({
                type: 'INPUT_NAME',
                payload: {name: name || ''},
              })
            }
          />
          <Subheading style={{marginTop: 10}}>{i18n.t('Goals')}</Subheading>
          {[7, 30, 90, 180, 365].map(renderGoalCheckbox)}
        </Dialog.Content>
        <Dialog.Actions>
          {habbit && (
            <Button
              mode="contained"
              compact
              style={{marginRight: 8}}
              color={colors.warn}
              onPress={() => store.dispatch(removeHabbit(habbit.id))}>
              {i18n.t('Delete')}
            </Button>
          )}
          <Button
            mode="contained"
            compact
            color={colors.primary}
            onPress={closeEditor}>
            {i18n.t(!habbit ? 'Done' : 'Save')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditHabbit;
