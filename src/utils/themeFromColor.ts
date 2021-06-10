import {DarkTheme, DefaultTheme} from 'react-native-paper';
import Hsla, {hexToHsla} from './hsla';

const themeFromColors = (inputColor: string, darkMode: boolean) => {
  const base = new Hsla(hexToHsla(inputColor));

  const commonTheme = {
    roundness: 15,
    colors: {
      primary: base.getHexString(), // primary color for your app, usually your brand color
      warn: base.getHexString({h: 0}),
    },
  };

  const darkTheme = {
    ...DarkTheme,
    ...commonTheme,
    colors: {
      ...DarkTheme.colors,
      ...commonTheme.colors,
      accent: base.getHexString({s: base.s - 10}), //secondary color for your app which complements the primary color
      background: base.getHexString({l: 10, s: base.s - base.s * 0.8}), //background color for pages, such as lists
      surface: base.getHexString({l: 10, s: 5}), // background color for elements containing content, such as cards
      text: base.getHexString({l: 100, s: 10}), //text color for content.
      //disabled: ,//color for disabled elements.
      placeholder: base.getHexString({l: 70, s: 5}), //color for placeholder text, such as input placeholder.
      backdrop: base.getHexString({l: 5, a: 0.5, s: 5}), //color for backdrops of various components such as modals.
      // onSurface : ,//background color for snackbars
      // notification: ,//background color for badges
    },
    dark: true,
  };

  const lightTheme = {
    ...DefaultTheme,
    ...commonTheme,
    colors: {
      ...DefaultTheme.colors,
      ...commonTheme.colors,
      accent: base.getHexString({s: base.s + 10}), //secondary color for your app which complements the primary color
      background: base.getHexString({l: 95, s: base.s - base.s * 0.8}), //background color for pages, such as lists
      surface: base.getHexString({l: 99}), // background color for elements containing content, such as cards
      text: base.getHexString({l: 5, s: 10}), //text color for content.
      //disabled: ,//color for disabled elements.
      placeholder: base.getHexString({l: 50, s: 10}), //color for placeholder text, such as input placeholder.
      backdrop: base.getHexString({l: 90, a: 0.5, s: 5}), //color for backdrops of various components such as modals.
      // onSurface : ,//background color for snackbars
      // notification: ,//background color for badges
    },
    dark: false,
  };

  return darkMode ? darkTheme : lightTheme;
};

export default themeFromColors;
