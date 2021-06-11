import React, {useEffect, useState} from 'react';
import {
  View,
  AppState,
  AppStateStatus,
  StatusBar,
  FlatList,
  FlatListProps,
} from 'react-native';
import {Appbar, Divider, FAB, Menu, useTheme} from 'react-native-paper';
import {DEFAULT_APPBAR_HEIGHT} from 'react-native-paper/src/components/Appbar/Appbar';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {connect} from 'react-redux';
import i18n from 'i18n-js';
import DraggableFlatlist from 'react-native-draggable-flatlist';
import {
  Habbit as HabbitType,
  RootState,
  reorderCustomOrder,
  store,
  changeSortBy,
} from '../../store';
import Habbit from '../Habbit';
import EditHabbit from '../EditHabbit';
import {getDate} from 'date-fns';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ReorderingHabbit from '../ReorderingHabbit';
import Hsla, {hexToHsla} from '../../utils/hsla';

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList,
) as unknown as <T>(props: FlatListProps<T>) => React.ReactElement;

const Habbits = ({
  habbits,
  customOrder,
  settings,
}: {
  habbits: RootState['habbits'];
  customOrder: RootState['customOrder'];
  settings: RootState['settings'];
}) => {
  const {colors} = useTheme();

  // current date is used in keyextractor so we refresh the components
  // when a fresh day arives :)
  const [currentDate, setCurrentDate] = useState(getDate(new Date()));

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setCurrentDate(getDate(new Date()));
    }
  };

  const [showAddHabbit, setShowAddHabbit] = useState(false);

  const renderSortableHabbit = ({
    item,
    drag,
    isActive,
  }: {
    item: HabbitType;
    drag: () => void;
    isActive: boolean;
  }) => {
    return <ReorderingHabbit habbit={item} drag={drag} isActive={isActive} />;
  };

  const renderHabbit = ({item}: {item: HabbitType}) => {
    return <Habbit habbit={item} />;
  };

  const flatListData = () => {
    switch (settings.sortBy) {
      case 'custom':
        return customOrder.map(id => {
          return habbits[id];
        });
      case 'default':
        return Object.values(habbits);
      default:
        return Object.values(habbits);
    }
  };

  const [reordering, setReordering] = useState(false);

  const insets = useSafeAreaInsets();

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const headerColor = new Hsla(hexToHsla(colors.background));
  const headerIsDark = headerColor.isDark();
  const headerIconColor = colors.onSurface;
  const appBarInset = insets.top + 20;

  const headerOffset = useSharedValue(0);
  const headerWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: headerOffset.value}],
    };
  });
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      headerOffset.value = Math.max(
        -(DEFAULT_APPBAR_HEIGHT + appBarInset),
        Math.min(
          scrollOffset.value > 20 ? -20 : 0,
          headerOffset.value + (scrollOffset.value - event.contentOffset.y),
        ),
      );
      scrollOffset.value = event.contentOffset.y;
    },
  });

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={headerIsDark ? 'light-content' : 'dark-content'}
      />
      <Animated.View
        style={[
          {
            paddingTop: appBarInset,
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            paddingLeft: 5,
            backgroundColor: headerColor.getHexString(),
            flexDirection: 'row',
            alignItems: 'center',
            height: DEFAULT_APPBAR_HEIGHT + appBarInset,
          },
          headerWrapperStyle,
        ]}>
        <Appbar.Content
          title={i18n.t('appName')}
          titleStyle={{color: headerIconColor}}
        />
        {settings.sortBy === 'custom' && (
          <>
            {reordering ? (
              <Appbar.Action
                onPress={() => setReordering(false)}
                icon="check"
                color={headerIconColor}
              />
            ) : (
              <Appbar.Action
                onPress={() => setReordering(true)}
                icon="reorder-horizontal"
                color={headerIconColor}
              />
            )}
          </>
        )}
        <Menu
          style={{marginTop: insets.top}}
          visible={showHeaderMenu}
          onDismiss={() => setShowHeaderMenu(false)}
          anchor={
            <Appbar.Action
              onPress={() => setShowHeaderMenu(true)}
              icon="dots-vertical"
              color={headerIconColor}
            />
          }>
          <Menu.Item title="Sort by" titleStyle={{fontWeight: 'bold'}} />
          <Divider />
          <Menu.Item
            icon="sort-ascending"
            onPress={() => {
              setShowHeaderMenu(false);
              setTimeout(() => {
                store.dispatch(changeSortBy('default'));
              }, 0);
            }}
            title="Created"
          />
          <Menu.Item
            icon="sort"
            onPress={() => {
              setShowHeaderMenu(false);
              setTimeout(() => {
                store.dispatch(changeSortBy('custom'));
                if (customOrder.length === 0) {
                  const newOrder = Object.values(habbits).map(
                    habbit => habbit.id,
                  );
                  store.dispatch(reorderCustomOrder(newOrder));
                  setReordering(true);
                }
              }, 0);
            }}
            title="Manually"
          />
        </Menu>
      </Animated.View>
      {reordering ? (
        <DraggableFlatlist
          data={flatListData()}
          renderItem={renderSortableHabbit}
          keyExtractor={item => item.id + currentDate}
          ListHeaderComponent={
            <View style={{height: DEFAULT_APPBAR_HEIGHT + appBarInset}} />
          }
          ListFooterComponent={<View style={{height: 100}} />}
          onDragEnd={({data}) => {
            const newOrder = Object.values(data).map(habbit => habbit.id);
            store.dispatch(reorderCustomOrder(newOrder));
          }}
        />
      ) : (
        <AnimatedFlatList
          data={flatListData()}
          renderItem={renderHabbit}
          keyExtractor={item => item.id + currentDate}
          ListHeaderComponent={
            <View style={{height: DEFAULT_APPBAR_HEIGHT + appBarInset}} />
          }
          ListFooterComponent={<View style={{height: 100}} />}
          onScroll={scrollHandler}
        />
      )}

      {!showAddHabbit ? (
        <FAB
          style={{position: 'absolute', bottom: 0, right: 0, margin: 16}}
          icon="plus"
          onPress={() => setShowAddHabbit(true)}
        />
      ) : showAddHabbit ? (
        <EditHabbit
          isOpen={showAddHabbit}
          onClose={() => setShowAddHabbit(false)}
        />
      ) : null}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    habbits: state.habbits,
    customOrder: state.customOrder,
    settings: state.settings,
  };
};

export default connect(mapStateToProps)(Habbits);
