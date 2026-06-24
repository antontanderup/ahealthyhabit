import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../theme';

type CheckboxProps = {
  value: boolean;
  onValueChange: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({value, onValueChange, style}: CheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={({pressed}) => [style, pressed && {opacity: 0.6}]}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{checked: value}}>
      <MaterialCommunityIcons
        name={
          value ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'
        }
        size={24}
        color={value ? theme.primary : theme.outline}
      />
    </Pressable>
  );
}
