import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {Provider as PaperProvider} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Habits from './../screens/Habits';
import themeFromColors from '../../utils/themeFromColor';
import {initDatabase, loadAllData} from '../../database';
import {hydrate} from '../../store';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = themeFromColors('#03b45f', isDarkMode);
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
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Habits />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
