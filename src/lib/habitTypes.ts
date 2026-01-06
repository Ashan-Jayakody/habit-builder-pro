export interface HabitNote {
  date: string;
  note: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completedDates: string[];
  notes: HabitNote[];
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
  { name: 'Teal', value: 'hsl(175, 70%, 45%)' },
  { name: 'Indigo', value: 'hsl(245, 70%, 60%)' },
  { name: 'Rose', value: 'hsl(350, 80%, 65%)' },
  { name: 'Lime', value: 'hsl(85, 70%, 50%)' },
  { name: 'Cyan', value: 'hsl(190, 85%, 50%)' },
  { name: 'Orange', value: 'hsl(35, 90%, 55%)' },
];

export const HABIT_EMOJIS = [
  '🎯', '💪', '📚', '🧘', '🏃', '💧', '🍎', '😴', '✍️', '🎨', '🎵', '🌱',
  '🧠', '💻', '🏋️', '🚴', '🧹', '💰', '🙏', '📝', '🎮', '☕', '🥗', '🚶',
  '🌅', '🛏️', '🦷', '💊', '📱', '🎧', '🧪', '🌿', '🏠', '🐕', '📖', '🎸'
];
