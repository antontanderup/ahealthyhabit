import React, {useEffect, useState} from 'react';
import {
  View,
  AppState,
  AppStateStatus,
  StatusBar,
  FlatList,
  FlatListProps,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Appbar, Divider, FAB, Menu, useTheme} from 'react-native-paper';
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
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  Habit as HabitType,
  reorderCustomOrder,
  changeSortBy,
} from '../../store';
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
  const {colors, fonts} = useTheme();
  const dispatch = useAppDispatch();
  const habits = useAppSelector(state => state.habits);
  const customOrder = useAppSelector(state => state.customOrder);
  const settings = useAppSelector(state => state.settings);

  const [currentDate, setCurrentDate] = useState(toLocalISODate(new Date()));
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setCurrentDate(toLocalISODate(new Date()));
    }
  };

  const listData = (): HabitType[] => {
    if (settings.sortBy === 'custom') {
      return customOrder.map(id => habits[id]).filter(Boolean);
    }
    return Object.values(habits);
  };

  const insets = useSafeAreaInsets();
  const headerIsDark = useColorScheme() === 'dark';
  const headerTitleColor = colors.onSurface;
  const headerIconColor = colors.onSurfaceVariant;
  const appBarInset = insets.top + 20;

  const headerOffset = useSharedValue(0);
  const scrollOffset = useSharedValue(0);

  const headerTitleFontStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollOffset.value, [0, 20], [30, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(scrollOffset.value, [0, 20], [6, 0], Extrapolate.CLAMP),
  }));

  const headerWrapperStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerOffset.value}],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const scrollY = event.contentOffset.y;
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
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const listHeader = (
    <View style={{height: DEFAULT_APPBAR_HEIGHT + appBarInset}} />
  );
  const listFooter = <View style={{height: 100}} />;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={headerIsDark ? 'light-content' : 'dark-content'}
      />
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: appBarInset,
            height: DEFAULT_APPBAR_HEIGHT + appBarInset,
            backgroundColor: colors.surfaceContainer,
          },
          headerWrapperStyle,
        ]}>
        <Animated.Text
          style={[
            styles.headerTitle,
            {fontFamily: fonts.titleLarge.fontFamily, color: headerTitleColor},
            headerTitleFontStyle,
          ]}>
          {t('yourHabits')}
        </Animated.Text>

        {settings.sortBy === 'custom' && (
          <Appbar.Action
            onPress={() => setReordering(r => !r)}
            icon={reordering ? 'check' : 'reorder-horizontal'}
            iconColor={headerIconColor}
          />
        )}
        <Menu
          style={{marginTop: insets.top}}
          visible={showHeaderMenu}
          onDismiss={() => setShowHeaderMenu(false)}
          anchor={
            <Appbar.Action
              onPress={() => setShowHeaderMenu(true)}
              icon="dots-vertical"
              iconColor={headerIconColor}
            />
          }>
          <Menu.Item
            title={t('sortBy')}
            titleStyle={{fontWeight: 'bold'}}
          />
          <Divider />
          <Menu.Item
            leadingIcon="sort-ascending"
            onPress={() => {
              setShowHeaderMenu(false);
              dispatch(changeSortBy('default'));
            }}
            title={t('sortCreated')}
          />
          <Menu.Item
            leadingIcon="sort"
            onPress={() => {
              setShowHeaderMenu(false);
              dispatch(changeSortBy('custom'));
              if (customOrder.length === 0) {
                dispatch(reorderCustomOrder(Object.keys(habits)));
                setReordering(true);
              }
            }}
            title={t('sortManually')}
          />
        </Menu>
      </Animated.View>

      {reordering ? (
        <DraggableFlatlist
          data={listData()}
          renderItem={({item, drag, isActive}: RenderItemParams<HabitType>) => (
            <ReorderingHabit habit={item} drag={drag} isActive={isActive} />
          )}
          keyExtractor={item => item.id + currentDate}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          onDragEnd={({data}) =>
            dispatch(reorderCustomOrder(data.map(h => h.id)))
          }
        />
      ) : (
        <AnimatedFlatList
          data={listData()}
          renderItem={({item}: {item: HabitType}) => <Habit habit={item} />}
          keyExtractor={item => (item as HabitType).id + currentDate}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          onScroll={scrollHandler}
        />
      )}

      {showAddHabit ? (
        <EditHabit isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} />
      ) : (
        <FAB style={styles.fab} icon="plus" onPress={() => setShowAddHabit(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
  header: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    paddingLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {flex: 1},
  fab: {position: 'absolute', bottom: 0, right: 0, margin: 16},
});
