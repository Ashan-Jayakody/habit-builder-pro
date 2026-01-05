export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completedDates: string[];
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export type ViewMode = 'today' | 'week' | 'month' | 'report';

export const HABIT_COLORS = [
  { name: 'Coral', value: 'hsl(16, 85%, 60%)' },
  { name: 'Amber', value: 'hsl(28, 95%, 65%)' },
  { name: 'Green', value: 'hsl(142, 70%, 45%)' },
  { name: 'Purple', value: 'hsl(280, 60%, 65%)' },
  { name: 'Blue', value: 'hsl(210, 80%, 55%)' },
  { name: 'Pink', value: 'hsl(340, 75%, 60%)' },
];

export const HABIT_EMOJIS = ['🎯', '💪', '📚', '🧘', '🏃', '💧', '🍎', '😴', '✍️', '🎨', '🎵', '🌱'];
