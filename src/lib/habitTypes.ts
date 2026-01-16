export interface HabitNote {
  date: string;
  note: string;
}

export type HabitPriority = 'low' | 'medium' | 'high';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completedDates: string[];
  frozenDates?: string[];
  notes: HabitNote[];
  priority?: HabitPriority;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export type ViewMode = 'today' | 'week' | 'month' | 'report' | 'goals';

export interface GoalLog {
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  targetDate: string;
  createdAt: string;
  logs: GoalLog[];
  completedDays: string[]; // dates that are "ticked"
}

export const HABIT_COLORS = [
  { name: 'Sky', value: 'hsl(199, 89%, 48%)' },
  { name: 'Sage', value: 'hsl(158, 35%, 55%)' },
  { name: 'Lavender', value: 'hsl(255, 45%, 70%)' },
  { name: 'Mint', value: 'hsl(165, 55%, 60%)' },
  { name: 'Rose', value: 'hsl(350, 65%, 75%)' },
  { name: 'Sand', value: 'hsl(35, 30%, 75%)' },
  { name: 'Slate', value: 'hsl(210, 20%, 65%)' },
  { name: 'Peach', value: 'hsl(20, 70%, 75%)' },
  { name: 'Ocean', value: 'hsl(215, 60%, 55%)' },
  { name: 'Meadow', value: 'hsl(110, 35%, 65%)' },
  { name: 'Mist', value: 'hsl(190, 30%, 70%)' },
  { name: 'Dusk', value: 'hsl(230, 35%, 65%)' },
];

export const HABIT_EMOJIS = [
  '🎯', '💪', '📚', '🧘', '🏃', '💧', '🍎', '😴', '✍️', '🎨', '🎵', '🌱',
  '🧠', '💻', '🏋️', '🚴', '🧹', '💰', '🙏', '📝', '🎮', '☕', '🥗', '🚶',
  '🌅', '🛏️', '🦷', '💊', '📱', '🎧', '🧪', '🌿', '🏠', '🐕', '📖', '🎸'
];
