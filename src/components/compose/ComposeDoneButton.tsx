import React, {useState, useEffect} from 'react';
import {View, useColorScheme} from 'react-native';
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
  const [hostReady, setHostReady] = useState(false);

  useEffect(() => {
    setHostReady(true);
  }, []);

  return (
    <View style={styles.host}>
      {hostReady && (
        <Host
          style={styles.host}
          seedColor={theme.primary}
          colorScheme={colorScheme}>
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
      )}
    </View>
  );
}

const useStyles = createUseStyles(_theme => ({
  host: {
    width: 40,
    height: 40,
  },
}));
