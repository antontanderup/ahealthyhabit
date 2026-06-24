import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Settings, CardStyle} from '../types';

type SettingsStore = {
  sortBy: Settings['sortBy'];
  cardStyle: CardStyle;
  themeColor: string | null;
  changeSortBy: (sortBy: Settings['sortBy']) => void;
  changeCardStyle: (cardStyle: CardStyle) => void;
  changeThemeColor: (color: string | null) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      sortBy: 'default',
      cardStyle: 'default',
      themeColor: null,
      changeSortBy: sortBy => set({sortBy}),
      changeCardStyle: cardStyle => set({cardStyle}),
      changeThemeColor: themeColor => set({themeColor}),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: SettingsStore) => ({
        sortBy: state.sortBy,
        cardStyle: state.cardStyle,
        themeColor: state.themeColor,
      }),
    },
  ),
);
