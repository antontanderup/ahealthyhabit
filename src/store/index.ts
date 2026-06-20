import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import type {Settings} from '../types';
import * as db from '../database';

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
      storage: createJSONStorage(() => ({
        getItem: (name: string) => db.getSetting(name),
        setItem: (name: string, value: string) => db.setSetting(name, value),
        removeItem: (name: string) => db.removeSetting(name),
      })),
    },
  ),
);
