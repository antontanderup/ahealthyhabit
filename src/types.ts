export type Habit = {
  id: string;
  name: string;
  createdAt: string; // ISO 8601 UTC timestamp
  recordedDates: string[]; // ISO YYYY-MM-DD in device's local timezone, sorted descending
  goals: number[];
};

export type CardStyle = 'default' | 'hero' | 'compact' | 'stats' | 'playful';

export type Settings = {
  sortBy: 'default' | 'custom';
  cardStyle: CardStyle;
};
