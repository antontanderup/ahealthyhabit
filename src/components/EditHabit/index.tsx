import React, {useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useAppDispatch} from '../../store/hooks';
import {addHabit, editHabit, Habit, removeHabit} from '../../store';

const GOAL_OPTIONS = [7, 30, 90, 180, 365] as const;

export default function EditHabit({
  habit,
  onClose,
  isOpen,
}: {
  habit?: Habit;
  onClose: () => void;
  isOpen: boolean;
}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  const [name, setName] = useState(habit?.name ?? '');
  const [goals, setGoals] = useState<number[]>(habit?.goals ?? []);

  const toggleGoal = (goal: number) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );
  };

  const handleSave = () => {
    if (habit?.id) {
      dispatch(editHabit({id: habit.id, name, goals}));
    } else if (name.trim()) {
      dispatch(addHabit(name, goals));
    }
    onClose();
  };

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={handleSave}>
        <Dialog.Title>
          {habit?.name ? `${t('edit')} ${habit.name}` : t('addHabit')}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label={t('habitName')}
            value={name}
            onChangeText={setName}
          />
          <Text variant="titleSmall" style={{marginTop: 10}}>
            {t('goals')}
          </Text>
          {GOAL_OPTIONS.map((goal, index) => (
            <View key={`goal${goal}`}>
              {index > 0 && <Divider />}
              <Checkbox.Item
                label={t('daysCount', {count: goal})}
                status={goals.includes(goal) ? 'checked' : 'unchecked'}
                onPress={() => toggleGoal(goal)}
              />
            </View>
          ))}
        </Dialog.Content>
        {isOpen && (
          <Dialog.Actions>
            {habit && (
              <Button
                mode="text"
                compact
                textColor={colors.error}
                onPress={() => dispatch(removeHabit(habit.id))}>
                {t('delete')}
              </Button>
            )}
            <Button
              mode="contained"
              compact
              onPress={handleSave}>
              {t(habit ? 'save' : 'done')}
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
}
