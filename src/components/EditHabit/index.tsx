import React, {useState} from 'react';
import {View, Text, Modal, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {Habit} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {createUseStyles} from '../../theme';
import {
  ComposeButton,
  ComposeCheckbox,
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
        <Pressable
          style={styles.dialog}
          onPress={e => e.stopPropagation()}>
          <Text style={styles.dialogTitle}>
            {habit?.name ? `${t('edit')} ${habit.name}` : t('addHabit')}
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
            {GOAL_OPTIONS.map((goal, index) => (
              <View key={`goal${goal}`}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={({pressed}) => [
                    styles.checkboxRow,
                    pressed && styles.checkboxRowPressed,
                  ]}
                  onPress={() => toggleGoal(goal)}>
                  <ComposeCheckbox
                    value={goals.includes(goal)}
                    onCheckedChange={() => toggleGoal(goal)}
                  />
                  <Text style={styles.checkboxLabel}>
                    {t('daysCount', {count: goal})}
                  </Text>
                </Pressable>
              </View>
            ))}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 16,
    elevation: 6,
    backgroundColor: theme.surface,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 24,
    marginBottom: 16,
    color: theme.onSurface,
  },
  dialogContent: {
    paddingHorizontal: 24,
  },
  textFieldWrapper: {
    marginBottom: 16,
  },
  goalsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: theme.onSurface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 0,
    backgroundColor: theme.outlineVariant,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxRowPressed: {
    opacity: 0.5,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: theme.onSurface,
  },
  dialogActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actionSpacer: {
    flex: 1,
  },
}));
