import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, configureStore, PayloadAction, getDefaultMiddleware } from '@reduxjs/toolkit'
import { isToday } from 'date-fns';
import 'react-native-get-random-values'
import { nanoid } from 'nanoid';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

type HabbitDate = string;

export type Habbit = {
  name: string;
  id: string;
  recordedDates: HabbitDate[],
  goals?: number[],
};

const habbitsSlice = createSlice({
  name: 'habbits',
  initialState: {
    habbits: {} as { [key: string]: Habbit },
  },
  reducers: {
    addHabbit: {
      reducer: (state, action: PayloadAction<Habbit>) => {
        state.habbits[action.payload.id] = action.payload;
      },
      prepare: (name: string, goals?: Habbit['goals']) => {
        const id = nanoid();
        return { payload: { name, id, recordedDates: [], goals: goals || [] } }
      }
    },
    editHabbit(state, action: PayloadAction<{id: string, name: string, goals: number[]}>) {
      const habbit = state.habbits[action.payload.id];
      habbit.name = action.payload.name;
      habbit.goals = action.payload.goals;
      habbit.goals.sort((a, b) => {
        return a - b;
      });
    },
    removeHabbit(state, action: PayloadAction<string>) {
      delete state.habbits[action.payload];
    },
    markTodayDone(state, action: PayloadAction<string>) {
      state.habbits[action.payload].recordedDates.unshift(new Date().toDateString())
    },
    markTodayUndone(state, action: PayloadAction<string>) {
      const today = state.habbits[action.payload];
      const latestDate = Date.parse(today.recordedDates[0]);
      if (isToday(latestDate)) {
        today.recordedDates.splice(0, 1);
      }
    }
  }
})

export const { addHabbit, removeHabbit, markTodayDone, markTodayUndone, editHabbit } = habbitsSlice.actions;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, habbitsSlice.reducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;