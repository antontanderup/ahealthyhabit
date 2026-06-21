import React from 'react';
import {useColorScheme} from 'react-native';
import {Host, Checkbox} from '@expo/ui/jetpack-compose';
import {useTheme} from '../../theme';

type ComposeCheckboxProps = {
  value: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ComposeCheckbox({value, onCheckedChange}: ComposeCheckboxProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Host matchContents seedColor={theme.primary} colorScheme={colorScheme}>
      <Checkbox value={value} onCheckedChange={onCheckedChange} />
    </Host>
  );
}
