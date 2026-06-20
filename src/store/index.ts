import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Settings} from '../types';

type SettingsStore = {
  sortBy: Settings['sortBy'];
  changeSortBy: (sortBy: Settings['sortBy']) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      sortBy: 'default',
      changeSortBy: sortBy => set({sortBy}),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
