import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import Checkbox from 'expo-checkbox';
import {useTheme} from '../../theme';

type ComposeCheckboxProps = {
  value: boolean;
  onValueChange: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function ComposeCheckbox({value, onValueChange, style}: ComposeCheckboxProps) {
  const theme = useTheme();

  return (
    <Checkbox
      value={value}
      onValueChange={onValueChange}
      color={value ? theme.primary : undefined}
      style={style}
    />
  );
}
