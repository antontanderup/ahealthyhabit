import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Host, Checkbox, Button, TextButton, Text as JCText} from '@expo/ui/jetpack-compose';
import {useAppDispatch} from '../../store/hooks';
import {addHabit, editHabit, Habit, removeHabit} from '../../store';
import {useTheme, createUseStyles} from '../../theme';

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
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const styles = useStyles();
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
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleSave}>
      <Pressable style={styles.overlay} onPress={handleSave}>
        <Pressable
          style={[styles.dialog, {backgroundColor: theme.surface}]}
          onPress={e => e.stopPropagation()}>
          <Text style={[styles.dialogTitle, {color: theme.onSurface}]}>
            {habit?.name ? `${t('edit')} ${habit.name}` : t('addHabit')}
          </Text>
          <View style={styles.dialogContent}>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.outline,
                  color: theme.onSurface,
                  backgroundColor: theme.surface,
                },
              ]}
              placeholder={t('habitName')}
              placeholderTextColor={theme.onSurfaceVariant}
              value={name}
              onChangeText={setName}
            />
            <Text style={[styles.goalsLabel, {color: theme.onSurface}]}>
              {t('goals')}
            </Text>
            {GOAL_OPTIONS.map((goal, index) => (
              <View key={`goal${goal}`}>
                {index > 0 && (
                  <View
                    style={[
                      styles.divider,
                      {backgroundColor: theme.outlineVariant},
                    ]}
                  />
                )}
                <Pressable
                  style={({pressed}) => [
                    styles.checkboxRow,
                    pressed && styles.checkboxRowPressed,
                  ]}
                  onPress={() => toggleGoal(goal)}>
                  <Host
                    matchContents
                    seedColor="#04c96a"
                    colorScheme={colorScheme}>
                    <Checkbox
                      value={goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                  </Host>
                  <Text
                    style={[styles.checkboxLabel, {color: theme.onSurface}]}>
                    {t('daysCount', {count: goal})}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
          {isOpen && (
            <View style={styles.dialogActions}>
              {habit && (
                <Host
                  matchContents
                  seedColor="#04c96a"
                  colorScheme={colorScheme}>
                  <TextButton
                    onClick={() => dispatch(removeHabit(habit.id))}
                    colors={{contentColor: theme.error}}>
                    <JCText>{t('delete')}</JCText>
                  </TextButton>
                </Host>
              )}
              <View style={styles.actionSpacer} />
              <Host matchContents seedColor="#04c96a" colorScheme={colorScheme}>
                <Button onClick={handleSave}>
                  <JCText>{t(habit ? 'save' : 'done')}</JCText>
                </Button>
              </Host>
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
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  dialogContent: {
    paddingHorizontal: 24,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  goalsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 0,
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
