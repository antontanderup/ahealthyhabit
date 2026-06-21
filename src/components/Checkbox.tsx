import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import ExpoCheckbox from 'expo-checkbox';
import {useTheme} from '../theme';

type CheckboxProps = {
  value: boolean;
  onValueChange: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({value, onValueChange, style}: CheckboxProps) {
  const theme = useTheme();

  return (
    <ExpoCheckbox
      value={value}
      onValueChange={onValueChange}
      color={value ? theme.primary : undefined}
      style={style}
    />
  );
}
