import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import Hsla, {hexToHsla} from './hsla';

const themeFromColors = (inputColor: string, darkMode: boolean) => {
  const base = new Hsla(hexToHsla(inputColor));

  const commonColors = {
    primary: base.getHexString(),
    warn: base.getHexString({h: 0}),
  };

  const darkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...commonColors,
      secondary: base.getHexString({s: base.s - 10}),
      background: base.getHexString({l: 10, s: base.s - base.s * 0.8}),
      surface: base.getHexString({l: 10, s: 5}),
      onSurface: base.getHexString({l: 100, s: 10}),
      onBackground: base.getHexString({l: 100, s: 10}),
      backdrop: base.getHexString({l: 5, a: 0.5, s: 5}),
    },
  };

  const lightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...commonColors,
      secondary: base.getHexString({s: base.s + 10}),
      background: base.getHexString({l: 95, s: base.s - base.s * 0.8}),
      surface: base.getHexString({l: 99}),
      onSurface: base.getHexString({l: 5, s: 10}),
      onBackground: base.getHexString({l: 5, s: 10}),
      backdrop: base.getHexString({l: 90, a: 0.5, s: 5}),
    },
  };

  return darkMode ? darkTheme : lightTheme;
};

export default themeFromColors;
