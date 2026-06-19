import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {useDispatch} from 'react-redux';
import {ThemeProvider} from '../../theme';
import Habits from './../screens/Habits';
import {initDatabase, loadAllData} from '../../database';
import {hydrate} from '../../store';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        const data = await loadAllData();
        dispatch(hydrate(data));
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) return null;

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Habits />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
