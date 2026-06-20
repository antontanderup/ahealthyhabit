import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useHabits} from '../habits/HabitsContext';
import {palette, semanticColors, spacing, radius, typography} from '../theme';
import type {ColorScheme} from '../theme';

type AddHabitModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddHabitModal({visible, onClose}: AddHabitModalProps) {
  const {addHabit} = useHabits();
  const {t} = useTranslation();
  const rawScheme = useColorScheme();
  const colorScheme: ColorScheme = rawScheme === 'dark' ? 'dark' : 'light';
  const colors = semanticColors[colorScheme];

  const [name, setName] = useState('');

  const handleSave = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addHabit(trimmed);
    setName('');
    onClose();
  }, [name, addHabit, onClose]);

  const handleCancel = useCallback(() => {
    setName('');
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surfaceRaised,
              borderTopColor: colors.border,
            },
          ]}>
          <Text style={[styles.title, {color: colors.textPrimary}]}>
            {t('addHabit')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder={t('habitName')}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <View style={styles.buttons}>
            <Pressable
              onPress={handleCancel}
              style={[styles.cancelButton, {borderColor: colors.border}]}>
              <Text style={[styles.cancelText, {color: colors.textSecondary}]}>
                {t('cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={styles.saveButton}>
              <Text style={styles.saveText}>{t('save')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    padding: spacing[6],
    paddingBottom: spacing[10],
    gap: spacing[4],
  },
  title: {
    ...(typography.h2 as object),
  } as object,
  input: {
    ...(typography.bodyLarge as object),
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  } as object,
  buttons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    ...(typography.label as object),
  } as object,
  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: palette.green[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    ...(typography.label as object),
    color: palette.neutral[0],
  } as object,
});
