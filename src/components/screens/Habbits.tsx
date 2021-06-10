import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  AppState,
  AppStateStatus,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import {Appbar, Divider, FAB, Menu, useTheme} from 'react-native-paper';
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

const Habbits = ({
  habbits,
  customOrder,
  settings,
}: {
  habbits: RootState['habbits'];
  customOrder: RootState['customOrder'];
  settings: RootState['settings'];
}) => {
  const {colors, dark} = useTheme();

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

  const renderHabbit = ({
    item,
    drag,
    isActive,
  }: {
    item: HabbitType;
    drag: () => void;
    isActive: boolean;
  }) => {
    if (reordering) {
      return <ReorderingHabbit habbit={item} drag={drag} isActive={isActive} />;
    }
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

  const [showFab, setShowFab] = useState(true);
  const scrollY = useRef(0);
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {y} = event.nativeEvent.contentOffset;
    if (y > scrollY.current) {
      if (showFab) {
        setShowFab(false);
      }
    } else {
      if (!showFab) {
        setShowFab(true);
      }
    }
    scrollY.current = y;
  };

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const headerColor = new Hsla(
    hexToHsla(dark ? colors.surface : colors.primary),
  );
  const headerIsDark = headerColor.isDark();
  const headerIconColor = headerColor.getHexString({l: headerIsDark ? 95 : 5});

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
      <Appbar.Header dark={headerIsDark} statusBarHeight={insets.top}>
        <Appbar.Content title={i18n.t('appName')} />
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
      </Appbar.Header>
      <DraggableFlatlist
        data={flatListData()}
        renderItem={renderHabbit}
        keyExtractor={item => item.id + currentDate}
        ListHeaderComponent={<View style={{height: 5}} />}
        ListFooterComponent={<View style={{height: 100}} />}
        onScroll={onScroll}
        onDragEnd={({data}) => {
          const newOrder = Object.values(data).map(habbit => habbit.id);
          store.dispatch(reorderCustomOrder(newOrder));
        }}
      />
      {!showAddHabbit ? (
        <FAB
          visible={showFab}
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
