import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Settings, CardStyle} from '../types';

type SettingsStore = {
  sortBy: Settings['sortBy'];
  cardStyle: CardStyle;
  changeSortBy: (sortBy: Settings['sortBy']) => void;
  changeCardStyle: (cardStyle: CardStyle) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      sortBy: 'default',
      cardStyle: 'playful',
      changeSortBy: sortBy => set({sortBy}),
      changeCardStyle: cardStyle => set({cardStyle}),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: SettingsStore) => ({
        sortBy: state.sortBy,
        cardStyle: state.cardStyle,
      }),
    },
  ),
);
