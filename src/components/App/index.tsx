import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {Provider as PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {useDispatch} from 'react-redux';
import Habits from './../screens/Habits';
import {initDatabase, loadAllData} from '../../database';
import {hydrate} from '../../store';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {theme} = useMaterial3Theme({fallbackSourceColor: '#04c96a'});
  const paperTheme = isDarkMode
    ? {...MD3DarkTheme, colors: {...MD3DarkTheme.colors, ...theme.dark}}
    : {...MD3LightTheme, colors: {...MD3LightTheme.colors, ...theme.light}};
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
    <PaperProvider theme={paperTheme}>
      <View style={styles.container}>
        <Habits />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
