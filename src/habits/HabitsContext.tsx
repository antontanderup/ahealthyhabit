import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {isToday} from 'date-fns';
import type {Habit} from '../types';
import * as db from '../database';
import {toLocalISODate, parseLocalDate} from '../utils/dateUtils';

type HabitsContextValue = {
  habits: Habit[];
  addHabit: (name: string, goals?: number[]) => Promise<void>;
  editHabit: (id: string, name: string, goals: number[]) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  toggleDate: (id: string, date: string) => Promise<void>;
  editDates: (id: string, dates: string[]) => Promise<void>;
  markTodayDone: (id: string) => Promise<void>;
  markTodayUndone: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({children}: {children: React.ReactNode}) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    db.loadHabits().then(setHabits);
  }, []);

  const addHabit = useCallback(
    async (name: string, goals: number[] = []) => {
      const id = nanoid();
      const sortedGoals = [...goals].sort((a, b) => a - b);
      const newHabit: Habit = {id, name, goals: sortedGoals, recordedDates: []};
      await db.insertHabit(newHabit, habits.length);
      setHabits(prev => [...prev, newHabit]);
    },
    [habits.length],
  );

  const editHabit = useCallback(
    async (id: string, name: string, goals: number[]) => {
      const sortedGoals = [...goals].sort((a, b) => a - b);
      await db.updateHabit(id, name, sortedGoals);
      setHabits(prev =>
        prev.map(h => (h.id === id ? {...h, name, goals: sortedGoals} : h)),
      );
    },
    [],
  );

  const removeHabit = useCallback(async (id: string) => {
    await db.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const toggleDate = useCallback(
    async (id: string, date: string) => {
      const habit = habits.find(h => h.id === id);
      if (!habit) return;
      if (habit.recordedDates.includes(date)) {
        await db.removeRecordedDate(id, date);
        setHabits(prev =>
          prev.map(h =>
            h.id === id
              ? {...h, recordedDates: h.recordedDates.filter(d => d !== date)}
              : h,
          ),
        );
      } else {
        await db.addRecordedDate(id, date);
        setHabits(prev =>
          prev.map(h =>
            h.id === id
              ? {
                  ...h,
                  recordedDates: [...h.recordedDates, date].sort((a, b) =>
                    b.localeCompare(a),
                  ),
                }
              : h,
          ),
        );
      }
    },
    [habits],
  );

  const editDates = useCallback(async (id: string, dates: string[]) => {
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    await db.replaceRecordedDates(id, sorted);
    setHabits(prev =>
      prev.map(h => (h.id === id ? {...h, recordedDates: sorted} : h)),
    );
  }, []);

  const markTodayDone = useCallback(
    async (id: string) => {
      const today = toLocalISODate(new Date());
      const habit = habits.find(h => h.id === id);
      if (!habit || habit.recordedDates.includes(today)) return;
      await db.addRecordedDate(id, today);
      setHabits(prev =>
        prev.map(h =>
          h.id === id ? {...h, recordedDates: [today, ...h.recordedDates]} : h,
        ),
      );
    },
    [habits],
  );

  const markTodayUndone = useCallback(
    async (id: string) => {
      const habit = habits.find(h => h.id === id);
      if (!habit || habit.recordedDates.length === 0) return;
      const first = habit.recordedDates[0];
      if (!isToday(parseLocalDate(first))) return;
      await db.removeRecordedDate(id, first);
      setHabits(prev =>
        prev.map(h =>
          h.id === id ? {...h, recordedDates: h.recordedDates.slice(1)} : h,
        ),
      );
    },
    [habits],
  );

  const reorder = useCallback(async (orderedIds: string[]) => {
    await db.updateCustomOrder(orderedIds);
    setHabits(prev => {
      const byId = new Map(prev.map(h => [h.id, h]));
      return orderedIds
        .map(id => byId.get(id))
        .filter((h): h is Habit => h !== undefined);
    });
  }, []);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        editHabit,
        removeHabit,
        toggleDate,
        editDates,
        markTodayDone,
        markTodayUndone,
        reorder,
      }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextValue {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
}
