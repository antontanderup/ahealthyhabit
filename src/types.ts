export type Habit = {
  id: string;
  name: string;
  recordedDates: string[]; // ISO YYYY-MM-DD in device's local timezone, sorted descending
  goals: number[];
};

export type Settings = {
  sortBy: 'default' | 'custom';
};
