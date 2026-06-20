import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import type {Habit} from '../types';
import {useHabits} from '../habits/HabitsContext';
import {HabitCard} from '../components/HabitCard';
import {AddHabitModal} from '../components/AddHabitModal';
import {palette, semanticColors, spacing, radius, typography} from '../theme';
import type {ColorScheme} from '../theme';

export default function HomeScreen() {
  const {habits} = useHabits();
  const {t} = useTranslation();
  const rawScheme = useColorScheme();
  const colorScheme: ColorScheme = rawScheme === 'dark' ? 'dark' : 'light';
  const colors = semanticColors[colorScheme];

  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleAddPress = useCallback(() => {
    setAddModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setAddModalVisible(false);
  }, []);

  const renderHabit = useCallback(
    ({item}: {item: Habit}) => <HabitCard habit={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Habit) => item.id, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <Text style={[styles.headerTitle, {color: colors.textPrimary}]}>
          {t('yourHabits')}
        </Text>
      </View>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, {color: colors.textPrimary}]}>
              {t('noHabitsYet')}
            </Text>
            <Text style={[styles.emptySubtitle, {color: colors.textMuted}]}>
              {t('noHabitsSubtitle')}
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.list,
          habits.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.footer, {borderTopColor: colors.border}]}>
        <Pressable
          onPress={handleAddPress}
          style={[styles.addButton, {borderColor: palette.green[500]}]}>
          <Text style={[styles.addButtonText, {color: palette.green[500]}]}>
            {t('addHabit')}
          </Text>
        </Pressable>
      </View>
      <AddHabitModal visible={addModalVisible} onClose={handleModalClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...(typography.h1 as object),
  } as object,
  list: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    gap: spacing[3],
  },
  listEmpty: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    gap: spacing[2],
  },
  emptyTitle: {
    ...(typography.h3 as object),
  } as object,
  emptySubtitle: {
    ...(typography.body as object),
  } as object,
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
  },
  addButton: {
    height: 52,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...(typography.label as object),
  } as object,
});
