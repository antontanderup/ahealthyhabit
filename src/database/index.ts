import * as SQLite from 'expo-sqlite';
import type {Habit} from '../types';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Each function receives the open database and runs inside a transaction.
// The migration runner bumps user_version atomically with the schema change,
// so a crash mid-migration re-runs it on next open.
type Migration = (db: SQLite.SQLiteDatabase) => Promise<void>;

const migrations: Migration[] = [
  // v1: initial schema
  async database => {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
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
    `);
  },
  // v2: track when each habit was created
  async database => {
    await database.execAsync(`
      ALTER TABLE habits ADD COLUMN created_at TEXT NOT NULL DEFAULT '';
      UPDATE habits SET created_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE created_at = '';
    `);
  },
];

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const row = await database.getFirstAsync<{user_version: number}>(
    'PRAGMA user_version',
  );
  let version = row?.user_version ?? 0;
  while (version < migrations.length) {
    const migration = migrations[version];
    await database.withTransactionAsync(async () => {
      await migration(database);
      await database.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
    version++;
  }
}

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  if (!dbPromise) {
    dbPromise = (async () => {
      const database = await SQLite.openDatabaseAsync('ahealthyhabit.db');
      await database.execAsync('PRAGMA foreign_keys = ON');
      await runMigrations(database);
      db = database;
      return db;
    })();
  }
  return dbPromise;
}

type HabitRow = {
  id: string;
  name: string;
  goals: string;
  custom_order: number;
  created_at: string;
};

export async function loadHabits(): Promise<Habit[]> {
  const database = await getDb();
  const habitRows = await database.getAllAsync<HabitRow>(
    'SELECT * FROM habits ORDER BY custom_order ASC',
  );
  const allDateRows = await database.getAllAsync<{habit_id: string; date: string}>(
    'SELECT habit_id, date FROM recorded_dates ORDER BY date DESC',
  );

  const datesByHabitId = new Map<string, string[]>();
  for (const row of allDateRows) {
    const dates = datesByHabitId.get(row.habit_id);
    if (dates) {
      dates.push(row.date);
    } else {
      datesByHabitId.set(row.habit_id, [row.date]);
    }
  }

  return habitRows.map(row => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    goals: JSON.parse(row.goals) as number[],
    recordedDates: datesByHabitId.get(row.id) ?? [],
  }));
}

export async function insertHabit(habit: Habit, order: number): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT INTO habits (id, name, goals, custom_order, created_at) VALUES (?, ?, ?, ?, ?)',
    [habit.id, habit.name, JSON.stringify(habit.goals), order, habit.createdAt],
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
