import React, {useEffect} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Habbits from './../screens/Habbits';
import {Provider as PaperProvider} from 'react-native-paper';

import themeFromColors from '../../utils/themeFromColor';

export default () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = themeFromColors('#03b45f', isDarkMode);

  useEffect(() => {
    RNBootSplash.hide({fade: true});
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
