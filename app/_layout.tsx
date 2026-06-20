import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {Slot} from 'expo-router';
import {store, hydrate} from '../src/store';
import {initDatabase, loadAllData} from '../src/database';
import '../src/i18n';

function AppLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      await initDatabase();
      const data = await loadAllData();
      dispatch(hydrate(data));
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
