import {
  createSlice,
  configureStore,
  PayloadAction,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import type {Settings} from '../types';
import * as db from '../database';

type SettingsState = {
  settings: Settings;
};

const initialState: SettingsState = {
  settings: {sortBy: 'default'},
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    hydrateSettings(state, action: PayloadAction<Settings>) {
      state.settings = action.payload;
    },
    changeSortBy(state, action: PayloadAction<Settings['sortBy']>) {
      state.settings.sortBy = action.payload;
    },
  },
});

export const {hydrateSettings, changeSortBy} = settingsSlice.actions;

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: changeSortBy,
  effect: async action => {
    await db.setSetting('sortBy', action.payload);
  },
});

export const store = configureStore({
  reducer: settingsSlice.reducer,
  middleware: getDefault =>
    getDefault().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
