import * as SQLite from 'expo-sqlite';
import type { Habit } from '../store';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('ahealthyhabit.db');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      goals TEXT NOT NULL DEFAULT '[]',
      custom_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS recorded_dates (
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      PRIMARY KEY (habit_id, date),
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

type HabitRow = {
  id: string;
  name: string;
  goals: string;
  custom_order: number;
};

export async function loadAllData(): Promise<{
  habits: Record<string, Habit>;
  customOrder: string[];
  settings: { sortBy: 'default' | 'custom' };
}> {
  const database = await getDb();
  const habitRows = await database.getAllAsync<HabitRow>(
    'SELECT * FROM habits ORDER BY custom_order ASC',
  );

  const habits: Record<string, Habit> = {};
  const customOrder: string[] = [];

  for (const row of habitRows) {
    const dateRows = await database.getAllAsync<{ date: string }>(
      'SELECT date FROM recorded_dates WHERE habit_id = ? ORDER BY date DESC',
      [row.id],
    );
    habits[row.id] = {
      id: row.id,
      name: row.name,
      goals: JSON.parse(row.goals) as number[],
      recordedDates: dateRows.map(r => r.date),
    };
    customOrder.push(row.id);
  }

  const sortByRow = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'sortBy'",
  );

  return {
    habits,
    customOrder,
    settings: { sortBy: (sortByRow?.value ?? 'default') as 'default' | 'custom' },
  };
}

export async function insertHabit(habit: Habit, order: number): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT INTO habits (id, name, goals, custom_order) VALUES (?, ?, ?, ?)',
    [habit.id, habit.name, JSON.stringify(habit.goals), order],
  );
}

export async function updateHabit(
  id: string,
  name: string,
  goals: number[],
): Promise<void> {
  const database = await getDb();
  await database.runAsync('UPDATE habits SET name = ?, goals = ? WHERE id = ?', [
    name,
    JSON.stringify(goals),
    id,
  ]);
}

export async function deleteHabit(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

export async function addRecordedDate(
  habitId: string,
  date: string,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT OR IGNORE INTO recorded_dates (habit_id, date) VALUES (?, ?)',
    [habitId, date],
  );
}

export async function removeRecordedDate(
  habitId: string,
  date: string,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'DELETE FROM recorded_dates WHERE habit_id = ? AND date = ?',
    [habitId, date],
  );
}

export async function replaceRecordedDates(
  habitId: string,
  dates: string[],
): Promise<void> {
  const database = await getDb();
  await database.withTransactionAsync(async () => {
    await database.runAsync('DELETE FROM recorded_dates WHERE habit_id = ?', [
      habitId,
    ]);
    for (const date of dates) {
      await database.runAsync(
        'INSERT INTO recorded_dates (habit_id, date) VALUES (?, ?)',
        [habitId, date],
      );
    }
  });
}

export async function updateCustomOrder(orderedIds: string[]): Promise<void> {
  const database = await getDb();
  await database.withTransactionAsync(async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await database.runAsync(
        'UPDATE habits SET custom_order = ? WHERE id = ?',
        [i, orderedIds[i]],
      );
    }
  });
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value],
  );
}
