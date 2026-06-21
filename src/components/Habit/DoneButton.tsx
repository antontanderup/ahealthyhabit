import React from 'react';
import {Pressable, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme, createUseStyles} from '../../theme';

type DoneButtonProps = {
  done: boolean;
  onToggle: () => void;
};

export function DoneButton({done, onToggle}: DoneButtonProps) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onToggle}
      style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
      hitSlop={8}
      accessibilityLabel="Toggle done">
      <View
        style={[
          styles.circle,
          done ? styles.circleDone : styles.circleUndone,
        ]}>
        {done && (
          <MaterialCommunityIcons name="check" size={16} color={theme.onPrimary} />
        )}
      </View>
    </Pressable>
  );
}

const useStyles = createUseStyles(theme => ({
  button: {
    padding: 6,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: theme.primary,
  },
  circleUndone: {
    borderWidth: 1.5,
    borderColor: theme.outline,
  },
}));
