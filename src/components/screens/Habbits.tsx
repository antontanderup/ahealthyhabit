import React, {useEffect, useState} from 'react';
import {View, FlatList, AppState, AppStateStatus} from 'react-native';
import {Appbar, FAB, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import i18n from 'i18n-js';
import {Habbit as HabbitType, RootState} from '../../store';
import Habbit from '../Habbit';
import EditHabbit from '../EditHabbit';
import {getDate} from 'date-fns';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Habbits = ({habbits}: {habbits: RootState['habbits']}) => {
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

  const renderHabbit = ({item}: {item: HabbitType}) => {
    return <Habbit habbit={item} />;
  };

  const flatListData = Object.values(habbits);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
      }}>
      <Appbar.Header dark statusBarHeight={insets.top}>
        <Appbar.Content title={i18n.t('appName')} />
      </Appbar.Header>
      <FlatList
        data={flatListData}
        renderItem={renderHabbit}
        keyExtractor={item => item.id + currentDate}
        ListHeaderComponent={<View style={{height: 5}}/>}
        ListFooterComponent={<View style={{height: 100}} />}
      />
      {!showAddHabbit ? (
        <FAB
          style={{position: 'absolute', bottom: 0, right: 0, margin: 16}}
          icon="plus"
          onPress={() => setShowAddHabbit(true)}
        />
      ) : (
        <EditHabbit
          isOpen={showAddHabbit}
          onClose={() => setShowAddHabbit(false)}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    habbits: state.habbits,
  };
};

export default connect(mapStateToProps)(Habbits);
