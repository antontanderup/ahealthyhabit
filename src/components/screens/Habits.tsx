import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  AppState,
  AppStateStatus,
  StatusBar,
  FlatList,
  FlatListProps,
  StyleSheet,
  useColorScheme,
  Pressable,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Host, FloatingActionButton, Icon} from '@expo/ui/jetpack-compose';
import {clip, Shapes} from '@expo/ui/jetpack-compose/modifiers';
import {router} from 'expo-router';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import DraggableFlatlist, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {Habit as HabitType, CardStyle} from '../../types';
import {useHabits} from '../../habits/HabitsContext';
import {useSettingsStore} from '../../store';
import {useTheme, createUseStyles} from '../../theme';
import Habit from '../Habit';
import EditHabit from '../EditHabit';
import ReorderingHabit from '../ReorderingHabit';
import {toLocalISODate} from '../../utils/dateUtils';

const DEFAULT_APPBAR_HEIGHT = 56;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList,
) as unknown as <T>(props: FlatListProps<T>) => React.ReactElement;

export default function Habits() {
  const {t} = useTranslation();
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = useStyles();
  const {habits, creationOrder, reorder} = useHabits();
  const sortBy = useSettingsStore(state => state.sortBy);
  const changeSortBy = useSettingsStore(state => state.changeSortBy);
  const cardStyle = useSettingsStore(state => state.cardStyle);
  const changeCardStyle = useSettingsStore(state => state.changeCardStyle);

  const [currentDate, setCurrentDate] = useState(toLocalISODate(new Date()));
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setCurrentDate(toLocalISODate(new Date()));
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const listData = useMemo((): HabitType[] => {
    if (sortBy === 'custom') {
      return habits;
    }
    const byId = new Map(habits.map(h => [h.id, h]));
    return creationOrder
      .map(id => byId.get(id))
      .filter((h): h is HabitType => h !== undefined);
  }, [habits, creationOrder, sortBy]);

  const insets = useSafeAreaInsets();
  const headerIsDark = colorScheme === 'dark';
  const appBarInset = insets.top + 20;

  const headerOffset = useSharedValue(0);
  const scrollOffset = useSharedValue(0);

  const headerTitleFontStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      scrollOffset.value,
      [0, 20],
      [30, 20],
      Extrapolate.CLAMP,
    ),
    marginBottom: interpolate(
      scrollOffset.value,
      [0, 20],
      [6, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const headerWrapperStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerOffset.value}],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const scrollY = event.contentOffset.y;
      // eslint-disable-next-line react-hooks/immutability
      headerOffset.value =
        scrollY <= 0
          ? withTiming(0)
          : Math.max(
              -(DEFAULT_APPBAR_HEIGHT + appBarInset),
              Math.min(
                scrollOffset.value > 20 ? -20 : 0,
                headerOffset.value +
                  (scrollOffset.value - event.contentOffset.y),
              ),
            );
      // eslint-disable-next-line react-hooks/immutability
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const listHeader = (
    <View style={{height: DEFAULT_APPBAR_HEIGHT + appBarInset}} />
  );
  const listFooter = <View style={{height: 100}} />;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={headerIsDark ? 'light-content' : 'dark-content'}
      />
      <Animated.View
        style={[
          styles.header,
          {paddingTop: appBarInset, height: DEFAULT_APPBAR_HEIGHT + appBarInset},
          headerWrapperStyle,
        ]}>
        <Animated.Text
          style={[styles.headerTitle, headerTitleFontStyle]}>
          {t('yourHabits')}
        </Animated.Text>

        {sortBy === 'custom' && (
          <Pressable
            onPress={() => setReordering(r => !r)}
            style={({pressed}) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
            hitSlop={8}>
            <MaterialCommunityIcons
              name={reordering ? 'check' : 'reorder-horizontal'}
              size={24}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
        )}
        <Pressable
          onPress={() => setShowHeaderMenu(true)}
          style={({pressed}) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
          hitSlop={8}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={theme.onSurfaceVariant}
          />
        </Pressable>
      </Animated.View>

      {reordering ? (
        <DraggableFlatlist
          data={listData}
          renderItem={({item, drag, isActive}: RenderItemParams<HabitType>) => (
            <ReorderingHabit habit={item} drag={drag} isActive={isActive} />
          )}
          keyExtractor={item => item.id + currentDate}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          onDragEnd={({data}) => reorder(data.map(h => h.id))}
        />
      ) : (
        <AnimatedFlatList
          data={listData}
          renderItem={({item}: {item: HabitType}) => <Habit habit={item} />}
          keyExtractor={item => (item as HabitType).id + currentDate}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          onScroll={scrollHandler}
        />
      )}

      {!showAddHabit && (
        <View style={[styles.fabContainer, {bottom: insets.bottom + 16}]}>
          <Host
            matchContents
            seedColor={theme.primary}
            colorScheme={colorScheme}>
            <FloatingActionButton
              onClick={() => setShowAddHabit(true)}
              modifiers={[clip(Shapes.Circle)]}>
              <FloatingActionButton.Icon>
                <Icon source={require('../../assets/icons/add.xml')} />
              </FloatingActionButton.Icon>
            </FloatingActionButton>
          </Host>
        </View>
      )}

      {showAddHabit && (
        <EditHabit
          isOpen={showAddHabit}
          onClose={() => setShowAddHabit(false)}
        />
      )}

      <Modal
        visible={showHeaderMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHeaderMenu(false)}>
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setShowHeaderMenu(false)}>
          <View style={[styles.menuContainer, {top: appBarInset + insets.top}]}>
            <Text style={styles.menuSectionTitle}>{t('sortBy')}</Text>
            <View style={styles.menuDivider} />
            <Pressable
              style={({pressed}) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                setShowHeaderMenu(false);
                changeSortBy('default');
                setReordering(false);
              }}>
              <MaterialCommunityIcons
                name="sort-ascending"
                size={20}
                color={theme.onSurfaceVariant}
              />
              <Text style={styles.menuItemText}>{t('sortCreated')}</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                setShowHeaderMenu(false);
                changeSortBy('custom');
                setReordering(true);
              }}>
              <MaterialCommunityIcons
                name="sort"
                size={20}
                color={theme.onSurfaceVariant}
              />
              <Text style={styles.menuItemText}>{t('sortManually')}</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Text style={styles.menuSectionTitle}>{t('cardStyle')}</Text>
            <View style={styles.menuDivider} />
            {(
              [
                {value: 'playful', label: t('cardStylePlayful'), icon: 'emoticon-outline'},
                {value: 'hero', label: t('cardStyleHero'), icon: 'rocket-launch-outline'},
                {value: 'compact', label: t('cardStyleCompact'), icon: 'view-list'},
                {value: 'stats', label: t('cardStyleStats'), icon: 'chart-bar'},
              ] as {value: CardStyle; label: string; icon: string}[]
            ).map(option => (
              <Pressable
                key={option.value}
                style={({pressed}) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => {
                  setShowHeaderMenu(false);
                  changeCardStyle(option.value);
                }}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={20}
                  color={theme.onSurfaceVariant}
                />
                <Text style={[styles.menuItemText, cardStyle === option.value && styles.menuItemTextSelected]}>
                  {option.label}
                </Text>
                {cardStyle === option.value && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={theme.primary}
                    style={styles.menuItemCheck}
                  />
                )}
              </Pressable>
            ))}
            <View style={styles.menuDivider} />
            <Pressable
              style={({pressed}) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                setShowHeaderMenu(false);
                router.push('/settings');
              }}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={20}
                color={theme.onSurfaceVariant}
              />
              <Text style={styles.menuItemText}>{t('settings')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const useStyles = createUseStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.background,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    paddingLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
  },
  headerTitle: {
    flex: 1,
    color: theme.onSurface,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonPressed: {
    opacity: 0.5,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: theme.scrim + '1A',
  },
  menuContainer: {
    position: 'absolute',
    right: 8,
    borderRadius: 8,
    minWidth: 200,
    elevation: 4,
    shadowColor: theme.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: theme.surfaceContainer,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.onSurface,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.outlineVariant,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemPressed: {
    opacity: 0.5,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.onSurface,
    flex: 1,
  },
  menuItemTextSelected: {
    color: theme.primary,
    fontWeight: '600',
  },
  menuItemCheck: {
    marginLeft: 'auto',
  },
}));
