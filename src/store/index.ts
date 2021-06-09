import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createSlice,
  configureStore,
  PayloadAction,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {isToday} from 'date-fns';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

type HabbitDate = string;
type HabbitId = string;

export type Habbit = {
  name: string;
  id: HabbitId;
  recordedDates: HabbitDate[];
  goals?: number[];
};

type Settings = {
  sortBy: 'default' | 'custom';
};

const habbitsSlice = createSlice({
  name: 'habbits',
  initialState: {
    habbits: {} as {[key: string]: Habbit},
    customOrder: [] as HabbitId[],
    settings: {
      sortBy: 'default',
    } as Settings,
  },
  reducers: {
    addHabbit: {
      reducer: (state, action: PayloadAction<Habbit>) => {
        state.habbits[action.payload.id] = action.payload;
        state.customOrder.push(action.payload.id);
      },
      prepare: (name: string, goals?: Habbit['goals']) => {
        const id = nanoid();
        return {payload: {name, id, recordedDates: [], goals: goals || []}};
      },
    },
    editHabbit(
      state,
      action: PayloadAction<{id: string; name: string; goals: number[]}>,
    ) {
      const habbit = state.habbits[action.payload.id];
      habbit.name = action.payload.name;
      habbit.goals = action.payload.goals;
      habbit.goals = habbit.goals.slice().sort((a, b) => {
        return a - b;
      });
    },
    toggleDate(state, action: PayloadAction<{id: string; date: string}>) {
      const habbit = state.habbits[action.payload.id];
      const dateString = new Date(action.payload.date).toDateString();
      if (habbit.recordedDates.includes(dateString)) {
        habbit.recordedDates = habbit.recordedDates.filter(
          date => date !== dateString,
        );
      } else {
        habbit.recordedDates.push(dateString);
        habbit.recordedDates.sort((a, b) => {
          const dateA = new Date(a).valueOf();
          const dateB = new Date(b).valueOf();
          return dateB - dateA;
        });
      }
    },
    removeHabbit(state, action: PayloadAction<string>) {
      delete state.habbits[action.payload];
      state.customOrder = state.customOrder.filter(id => id !== action.payload);
    },
    markTodayDone(state, action: PayloadAction<string>) {
      state.habbits[action.payload].recordedDates.unshift(
        new Date().toDateString(),
      );
    },
    markTodayUndone(state, action: PayloadAction<string>) {
      const today = state.habbits[action.payload];
      const latestDate = Date.parse(today.recordedDates[0]);
      if (isToday(latestDate)) {
        today.recordedDates.splice(0, 1);
      }
    },
    reorderCustomOrder(state, action: PayloadAction<string[]>) {
      state.customOrder = action.payload;
    },
    changeSortBy(state, action: PayloadAction<Settings['sortBy']>) {
      state.settings.sortBy = action.payload;
    },
  },
});

export const {
  addHabbit,
  toggleDate,
  removeHabbit,
  markTodayDone,
  markTodayUndone,
  editHabbit,
  reorderCustomOrder,
  changeSortBy,
} = habbitsSlice.actions;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, habbitsSlice.reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
