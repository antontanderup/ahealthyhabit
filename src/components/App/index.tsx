import React, {useEffect} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Habbits from './../screens/Habbits';
import {Provider as PaperProvider} from 'react-native-paper';

import themeFromColors from '../../utils/themeFromColor';

SplashScreen.preventAutoHideAsync();

export default () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = themeFromColors('#03b45f', isDarkMode);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Habbits />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
