import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {useColorScheme} from 'react-native';
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {useTheme} from '../../theme';

type ComposeCheckboxProps = {
  value: boolean;
  onCheckedChange: (checked: boolean) => void;
  modifiers?: React.ComponentProps<typeof Checkbox>['modifiers'];
  style?: StyleProp<ViewStyle>;
};

export function ComposeCheckbox({
  value,
  onCheckedChange,
  modifiers,
  style,
}: ComposeCheckboxProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Host
      matchContents={!style}
      style={style}
      seedColor={theme.primary}
      colorScheme={colorScheme}>
      <Checkbox
        value={value}
        onCheckedChange={onCheckedChange}
        modifiers={modifiers}
      />
    </Host>
  );
}
