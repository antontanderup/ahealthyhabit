import {MD3Theme} from 'react-native-paper';

export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & {
    warn: string;
  };
};
