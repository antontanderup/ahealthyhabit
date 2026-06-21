import React from 'react';
import {useColorScheme} from 'react-native';
import {
  Host,
  FilledIconButton,
  OutlinedIconButton,
  Icon,
} from '@expo/ui/jetpack-compose';
import {useTheme, createUseStyles} from '../../theme';

type ComposeDoneButtonProps = {
  done: boolean;
  onToggle: () => void;
};

export function ComposeDoneButton({done, onToggle}: ComposeDoneButtonProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = useStyles();

  return (
    <Host style={styles.host} seedColor={theme.primary} colorScheme={colorScheme}>
      {done ? (
        <FilledIconButton onClick={onToggle}>
          <Icon source={require('../../assets/icons/check.xml')} />
        </FilledIconButton>
      ) : (
        <OutlinedIconButton onClick={onToggle}>
          <Icon source={require('../../assets/icons/check.xml')} />
        </OutlinedIconButton>
      )}
    </Host>
  );
}

const useStyles = createUseStyles(_theme => ({
  host: {
    width: 40,
    height: 40,
  },
}));
