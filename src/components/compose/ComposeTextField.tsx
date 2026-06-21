import React from 'react';
import {useColorScheme} from 'react-native';
import {
  Host,
  OutlinedTextField,
  Text as JCText,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import {useTheme} from '../../theme';

type ComposeTextFieldProps = {
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  placeholder?: string;
};

export function ComposeTextField({
  defaultValue = '',
  onChangeText,
  label,
  placeholder,
}: ComposeTextFieldProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';
  const nativeValue = useNativeState(defaultValue);

  return (
    <Host matchContents={{vertical: true}} seedColor={theme.primary} colorScheme={colorScheme}>
      <OutlinedTextField
        value={nativeValue}
        onValueChange={onChangeText}
        singleLine>
        {label && (
          <OutlinedTextField.Label>
            <JCText>{label}</JCText>
          </OutlinedTextField.Label>
        )}
        {placeholder && (
          <OutlinedTextField.Placeholder>
            <JCText>{placeholder}</JCText>
          </OutlinedTextField.Placeholder>
        )}
      </OutlinedTextField>
    </Host>
  );
}
