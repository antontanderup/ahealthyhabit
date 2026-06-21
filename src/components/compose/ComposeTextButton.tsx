import React from 'react';
import {useColorScheme} from 'react-native';
import {Host, TextButton, Text as JCText} from '@expo/ui/jetpack-compose';
import {useTheme} from '../../theme';

type ComposeTextButtonProps = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  enabled?: boolean;
};

export function ComposeTextButton({
  label,
  onClick,
  destructive = false,
  enabled = true,
}: ComposeTextButtonProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Host matchContents seedColor={theme.primary} colorScheme={colorScheme}>
      <TextButton
        onClick={onClick}
        enabled={enabled}
        colors={destructive ? {contentColor: theme.error} : undefined}>
        <JCText>{label}</JCText>
      </TextButton>
    </Host>
  );
}
