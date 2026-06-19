import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Habit} from '../../store';
import {useTheme, createUseStyles} from '../../theme';

export default function ReorderingHabit({
  habit,
  drag,
  isActive,
}: {
  habit: Habit;
  drag: () => void;
  isActive: boolean;
}) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <TouchableOpacity onPressIn={drag} style={styles.row}>
      <Text style={styles.name}>{habit.name}</Text>
      <MaterialCommunityIcons
        name={isActive ? 'arrow-up-down' : 'drag-horizontal-variant'}
        size={24}
        color={theme.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
}

const useStyles = createUseStyles(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: theme.onSurface,
  },
}));
