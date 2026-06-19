import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {List} from 'react-native-paper';
import {Habit} from '../../store';

export default function ReorderingHabit({
  habit,
  drag,
  isActive,
}: {
  habit: Habit;
  drag: () => void;
  isActive: boolean;
}) {
  return (
    <TouchableOpacity onPressIn={drag}>
      <List.Item
        title={habit.name}
        style={{paddingVertical: 0}}
        right={() => (
          <List.Icon
            icon={isActive ? 'arrow-up-down' : 'drag-horizontal-variant'}
          />
        )}
      />
    </TouchableOpacity>
  );
}
