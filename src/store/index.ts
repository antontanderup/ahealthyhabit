import {
  createSlice,
  configureStore,
  PayloadAction,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import {isToday} from 'date-fns';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {toLocalISODate} from '../utils/dateUtils';
import * as db from '../database';

export type Habit = {
  name: string;
  id: string;
  recordedDates: string[]; // ISO YYYY-MM-DD in local timezone
  goals: number[];
};

type Settings = {
  sortBy: 'default' | 'custom';
};

type HabitsState = {
  habits: Record<string, Habit>;
  customOrder: string[];
  settings: Settings;
};

const initialState: HabitsState = {
  habits: {},
  customOrder: [],
  settings: {sortBy: 'default'},
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    hydrate(
      state,
      action: PayloadAction<{
        habits: Record<string, Habit>;
        customOrder: string[];
        settings: Settings;
      }>,
    ) {
      state.habits = action.payload.habits;
      state.customOrder = action.payload.customOrder;
      state.settings = action.payload.settings;
    },
    addHabit: {
      reducer(state, action: PayloadAction<Habit>) {
        state.habits[action.payload.id] = action.payload;
        state.customOrder.push(action.payload.id);
      },
      prepare(name: string, goals: number[] = []) {
        return {payload: {name, id: nanoid(), recordedDates: [], goals}};
      },
    },
    editHabit(
      state,
      action: PayloadAction<{id: string; name: string; goals: number[]}>,
    ) {
      const habit = state.habits[action.payload.id];
      habit.name = action.payload.name;
      habit.goals = [...action.payload.goals].sort((a, b) => a - b);
    },
    toggleDate(state, action: PayloadAction<{id: string; date: string}>) {
      const habit = state.habits[action.payload.id];
      const dateString = toLocalISODate(new Date(action.payload.date));
      if (habit.recordedDates.includes(dateString)) {
        habit.recordedDates = habit.recordedDates.filter(d => d !== dateString);
      } else {
        habit.recordedDates.push(dateString);
        habit.recordedDates.sort((a, b) => b.localeCompare(a));
      }
    },
    editDates(
      state,
      action: PayloadAction<{id: string; dates: string[]}>,
    ) {
      const habit = state.habits[action.payload.id];
      habit.recordedDates = [...action.payload.dates].sort((a, b) =>
        b.localeCompare(a),
      );
    },
    removeHabit(state, action: PayloadAction<string>) {
      delete state.habits[action.payload];
      state.customOrder = state.customOrder.filter(id => id !== action.payload);
    },
    markTodayDone(state, action: PayloadAction<string>) {
      state.habits[action.payload].recordedDates.unshift(
        toLocalISODate(new Date()),
      );
    },
    markTodayUndone(state, action: PayloadAction<string>) {
      const habit = state.habits[action.payload];
      if (
        habit.recordedDates.length > 0 &&
        isToday(new Date(habit.recordedDates[0]))
      ) {
        habit.recordedDates.splice(0, 1);
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
  hydrate,
  addHabit,
  toggleDate,
  removeHabit,
  markTodayDone,
  markTodayUndone,
  editHabit,
  reorderCustomOrder,
  changeSortBy,
  editDates,
} = habitsSlice.actions;

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addHabit,
  effect: async (action, {getState}) => {
    const state = getState() as RootState;
    const order = state.customOrder.length - 1;
    await db.insertHabit(action.payload, order);
  },
});

listenerMiddleware.startListening({
  actionCreator: editHabit,
  effect: async action => {
    await db.updateHabit(
      action.payload.id,
      action.payload.name,
      action.payload.goals,
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: removeHabit,
  effect: async action => {
    await db.deleteHabit(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: markTodayDone,
  effect: async action => {
    await db.addRecordedDate(action.payload, toLocalISODate(new Date()));
  },
});

listenerMiddleware.startListening({
  actionCreator: markTodayUndone,
  effect: async (action, {getOriginalState}) => {
    const prevState = getOriginalState() as RootState;
    const prevDate = prevState.habits[action.payload]?.recordedDates[0];
    if (prevDate && isToday(new Date(prevDate))) {
      await db.removeRecordedDate(action.payload, prevDate);
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: toggleDate,
  effect: async (action, {getOriginalState}) => {
    const date = toLocalISODate(new Date(action.payload.date));
    const prevState = getOriginalState() as RootState;
    const hadDate =
      prevState.habits[action.payload.id]?.recordedDates.includes(date);
    if (hadDate) {
      await db.removeRecordedDate(action.payload.id, date);
    } else {
      await db.addRecordedDate(action.payload.id, date);
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: editDates,
  effect: async action => {
    await db.replaceRecordedDates(action.payload.id, action.payload.dates);
  },
});

listenerMiddleware.startListening({
  actionCreator: reorderCustomOrder,
  effect: async action => {
    await db.updateCustomOrder(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: changeSortBy,
  effect: async action => {
    await db.setSetting('sortBy', action.payload);
  },
});

export const store = configureStore({
  reducer: habitsSlice.reducer,
  middleware: getDefault =>
    getDefault().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
