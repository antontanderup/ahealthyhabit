import React, {useState, useMemo, useCallback} from 'react';
import {View, Text, Modal, Pressable, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {Habit} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {useTheme, createUseStyles} from '../../theme';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function EditHabitDates({
  isOpen,
  onClose,
  habit,
}: {
  habit: Habit;
  onClose: () => void;
  isOpen: boolean;
}) {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const {editDates} = useHabits();

  const today = useMemo(() => new Date(), []);

  const [displayYear, setDisplayYear] = useState(() => today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(() => today.getMonth());
  const [localDates, setLocalDates] = useState<Set<string>>(
    () => new Set(habit.recordedDates),
  );

  const calendarGrid = useMemo(
    () => buildCalendarGrid(displayYear, displayMonth),
    [displayYear, displayMonth],
  );

  const canGoNext =
    displayYear < today.getFullYear() ||
    (displayYear === today.getFullYear() && displayMonth < today.getMonth());

  const goToPrevious = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(y => y - 1);
    } else {
      setDisplayMonth(m => m - 1);
    }
  };

  const goToNext = () => {
    if (!canGoNext) return;
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(y => y + 1);
    } else {
      setDisplayMonth(m => m + 1);
    }
  };

  const toggleDate = useCallback(
    (day: number) => {
      const key = dateKey(displayYear, displayMonth, day);
      const date = new Date(displayYear, displayMonth, day);
      if (date > today) return;
      setLocalDates(prev => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [displayYear, displayMonth, today],
  );

  const handleConfirm = () => {
    editDates(habit.id, Array.from(localDates).sort());
    onClose();
  };

  const handleDismiss = () => {
    setLocalDates(new Set(habit.recordedDates));
    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}>
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Pressable
          style={[styles.dialog, {backgroundColor: theme.surface}]}
          onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Pressable
              onPress={goToPrevious}
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.navButtonPressed,
              ]}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={theme.onSurface}
              />
            </Pressable>
            <Text style={[styles.monthLabel, {color: theme.onSurface}]}>
              {MONTH_NAMES[displayMonth]} {displayYear}
            </Text>
            <Pressable
              onPress={goToNext}
              disabled={!canGoNext}
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.navButtonPressed,
                !canGoNext && styles.navButtonDisabled,
              ]}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={canGoNext ? theme.onSurface : theme.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <View style={styles.dayLabelsRow}>
            {DAY_LABELS.map(label => (
              <Text
                key={label}
                style={[styles.dayLabel, {color: theme.onSurfaceVariant}]}>
                {label}
              </Text>
            ))}
          </View>

          <ScrollView scrollEnabled={false}>
            <View style={styles.grid}>
              {calendarGrid.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.cell} />;
                }
                const key = dateKey(displayYear, displayMonth, day);
                const isSelected = localDates.has(key);
                const isFuture =
                  new Date(displayYear, displayMonth, day) > today;
                const isTodayCell =
                  displayYear === today.getFullYear() &&
                  displayMonth === today.getMonth() &&
                  day === today.getDate();

                return (
                  <Pressable
                    key={key}
                    onPress={() => !isFuture && toggleDate(day)}
                    style={({pressed}) => [
                      styles.cell,
                      isSelected && {
                        backgroundColor: theme.primaryContainer,
                      },
                      isTodayCell &&
                        !isSelected && {
                          borderWidth: 1,
                          borderColor: theme.primary,
                        },
                      pressed && !isFuture && styles.cellPressed,
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        isSelected
                          ? {color: theme.onPrimaryContainer}
                          : isFuture
                            ? {color: theme.onSurfaceVariant, opacity: 0.4}
                            : {color: theme.onSurface},
                      ]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={handleDismiss}
              style={({pressed}) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}>
              <Text style={[styles.actionButtonText, {color: theme.primary}]}>
                {t('cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={({pressed}) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}>
              <Text style={[styles.actionButtonText, {color: theme.primary}]}>
                {t('done')}
              </Text>
            </Pressable>
          </View>
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
    paddingTop: 16,
    paddingBottom: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  navButtonPressed: {
    opacity: 0.5,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  cell: {
    width: `${100 / 7}%` as `${number}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 2,
  },
  cellPressed: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  actionButtonPressed: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}));
