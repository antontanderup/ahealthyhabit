import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Habbits from './../screens/Habbits';
import {Provider as PaperProvider} from 'react-native-paper';

import themeFromColors from '../../utils/themeFromColor';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useColorScheme} from 'react-native-appearance';

export default () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = themeFromColors('#03b45f', isDarkMode);

  useEffect(() => {
    RNBootSplash.hide({fade: true});
    changeNavigationBarColor(
      theme.colors.background.slice(0, 7),
      !isDarkMode,
      false,
    );
  });

  useEffect(() => {
    changeNavigationBarColor(
      theme.colors.background.slice(0, 7),
      !isDarkMode,
      false,
    );
  }, [isDarkMode, theme]);

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
