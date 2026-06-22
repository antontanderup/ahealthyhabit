import React, {useState} from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {Habit} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {createUseStyles} from '../../theme';
import {
  ComposeButton,
  ComposeTextButton,
  ComposeTextField,
} from '../compose';

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
  const styles = useStyles();
  const {addHabit, editHabit, removeHabit} = useHabits();

  const [name, setName] = useState(habit?.name ?? '');
  const [goals, setGoals] = useState<number[]>(habit?.goals ?? []);

  const toggleGoal = (goal: number) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );
  };

  const handleSave = () => {
    if (habit?.id) {
      editHabit(habit.id, name, goals);
    } else if (name.trim()) {
      addHabit(name, goals);
    }
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleSave}>
      <Pressable style={styles.overlay} onPress={handleSave}>
        <Pressable style={styles.dialog} onPress={e => e.stopPropagation()}>
          <Text style={styles.dialogTitle}>
            {habit?.id ? t('editHabit') : t('addHabit')}
          </Text>
          <View style={styles.dialogContent}>
            <View style={styles.textFieldWrapper}>
              <ComposeTextField
                defaultValue={habit?.name ?? ''}
                onChangeText={setName}
                label={t('habitName')}
              />
            </View>
            <Text style={styles.goalsLabel}>{t('goals')}</Text>
            <View style={styles.goalChips}>
              {GOAL_OPTIONS.map(goal => {
                const selected = goals.includes(goal);
                return (
                  <Pressable
                    key={`goal${goal}`}
                    style={({pressed}) => [
                      styles.goalChip,
                      selected && styles.goalChipSelected,
                      pressed && styles.goalChipPressed,
                    ]}
                    onPress={() => toggleGoal(goal)}>
                    <Text
                      style={[
                        styles.goalChipLabel,
                        selected && styles.goalChipLabelSelected,
                      ]}>
                      {t('daysCount', {count: goal})}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {isOpen && (
            <View style={styles.dialogActions}>
              {habit && (
                <ComposeTextButton
                  label={t('delete')}
                  onClick={() => {
                    removeHabit(habit.id);
                    onClose();
                  }}
                  destructive
                />
              )}
              <View style={styles.actionSpacer} />
              <ComposeButton
                label={t(habit ? 'save' : 'done')}
                onClick={handleSave}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const useStyles = createUseStyles(theme => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.scrim + '80',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 28,
    paddingTop: 28,
    paddingBottom: 16,
    elevation: 6,
    backgroundColor: theme.surfaceContainerHigh,
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 20,
    color: theme.onSurface,
  },
  dialogContent: {
    paddingHorizontal: 24,
  },
  textFieldWrapper: {
    marginBottom: 24,
  },
  goalsLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    color: theme.onSurfaceVariant,
  },
  goalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: theme.surfaceContainerHighest,
  },
  goalChipSelected: {
    backgroundColor: theme.primary,
  },
  goalChipPressed: {
    opacity: 0.7,
  },
  goalChipLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.onSurfaceVariant,
  },
  goalChipLabelSelected: {
    color: theme.onPrimary,
  },
  dialogActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  actionSpacer: {
    flex: 1,
  },
}));
