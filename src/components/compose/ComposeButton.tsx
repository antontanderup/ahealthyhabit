import React from 'react';
import {useColorScheme} from 'react-native';
import {Host, Button, Text as JCText} from '@expo/ui/jetpack-compose';
import {useTheme} from '../../theme';

type ComposeButtonProps = {
  label: string;
  onClick: () => void;
  enabled?: boolean;
};

export function ComposeButton({
  label,
  onClick,
  enabled = true,
}: ComposeButtonProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Host matchContents seedColor={theme.primary} colorScheme={colorScheme}>
      <Button onClick={onClick} enabled={enabled}>
        <JCText>{label}</JCText>
      </Button>
    </Host>
  );
}
