import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {Slot} from 'expo-router';
import {store, hydrateSettings} from '../src/store';
import {loadSettings} from '../src/database';
import {HabitsProvider} from '../src/habits/HabitsContext';
import '../src/i18n';

function AppLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    loadSettings().then(settings => dispatch(hydrateSettings(settings)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <HabitsProvider>
        <AppLayout />
      </HabitsProvider>
    </Provider>
  );
}
