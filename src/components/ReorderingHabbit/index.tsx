import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {List} from 'react-native-paper';
import {Habbit} from '../../store';

export default ({
  habbit,
  drag,
  isActive,
}: {
  habbit: Habbit;
  drag: () => void;
  isActive: boolean;
}) => {
  return (
    <TouchableOpacity onPressIn={drag}>
      <List.Item
        title={habbit.name}
        style={{paddingVertical: 0}}
        right={() => (
          <List.Icon
            icon={isActive ? 'arrow-up-down' : 'drag-horizontal-variant'}
          />
        )}
      />
    </TouchableOpacity>
  );
};
