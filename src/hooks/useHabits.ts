import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitStats, HabitNote, Goal } from '@/lib/habitTypes';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'habits-tracker-data';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch {
        setHabits([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    const todayStr = new Date().toISOString().split('T')[0]; // Format: "2025-01-07"

    const pendingCount = habits.filter(h => {
      return !h.completedDates.includes(todayStr);
    }).length;

    // C. Save to Native Storage (so Android can see it!)
    const saveToNative = async () => {
        await Preferences.set({
            key: 'pending_count',
            value: pendingCount.toString()
        });
    };
    saveToNative();
    
  }, [habits]);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'notes'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      notes: [],
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const toggleHabitCompletion = useCallback((id: string, date: Date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      const isCompleted = habit.completedDates.includes(dateStr);
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== dateStr)
          : [...habit.completedDates, dateStr],
      };
    }));
  }, []);

  const isHabitCompletedOnDate = useCallback((habit: Habit, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completedDates.includes(dateStr);
  }, []);

  const addNote = useCallback((habitId: string, date: Date, note: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      const existingNotes = habit.notes || [];
      const existingIndex = existingNotes.findIndex(n => n.date === dateStr);
      
      if (existingIndex >= 0) {
        const updatedNotes = [...existingNotes];
        if (note.trim()) {
          updatedNotes[existingIndex] = { date: dateStr, note: note.trim() };
        } else {
          updatedNotes.splice(existingIndex, 1);
        }
        return { ...habit, notes: updatedNotes };
      } else if (note.trim()) {
        return { ...habit, notes: [...existingNotes, { date: dateStr, note: note.trim() }] };
      }
      return habit;
    }));
  }, []);

  const getNoteForDate = useCallback((habit: Habit, date: Date): string => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const notes = habit.notes || [];
    const found = notes.find(n => n.date === dateStr);
    return found?.note || '';
  }, []);

  const getHabitStats = useCallback((habit: Habit): HabitStats => {
    const today = new Date();
    const sortedDates = habit.completedDates
      .map(d => parseISO(d))
      .sort((a, b) => b.getTime() - a.getTime());

    // Current streak
    let currentStreak = 0;
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(today.getTime() - 86400000), 'yyyy-MM-dd');
    
    if (habit.completedDates.includes(todayStr) || habit.completedDates.includes(yesterdayStr)) {
      const startDate = habit.completedDates.includes(todayStr) ? today : new Date(today.getTime() - 86400000);
      let checkDate = startDate;
      while (habit.completedDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = [...habit.completedDates].sort();
    
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = parseISO(allDates[i - 1]);
        const currDate = parseISO(allDates[i]);
        if (differenceInDays(currDate, prevDate) === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Completion rate (last 30 days)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);
    const createdDate = parseISO(habit.createdAt);
    const startDate = isAfter(thirtyDaysAgo, createdDate) ? thirtyDaysAgo : createdDate;
    const daysToCount = Math.max(1, differenceInDays(today, startDate) + 1);
    const completionsInPeriod = habit.completedDates.filter(d => {
      const date = parseISO(d);
      return (isAfter(date, startDate) || isEqual(date, startDate)) && (isBefore(date, today) || isEqual(date, today));
    }).length;
    const completionRate = Math.round((completionsInPeriod / daysToCount) * 100);

    return {
      currentStreak,
      longestStreak,
      completionRate,
      totalCompletions: habit.completedDates.length,
    };
  }, []);

  const getWeeklyData = useCallback((habit: Habit, date: Date = new Date()) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => ({
      date: day,
      dayName: format(day, 'EEE'),
      isCompleted: isHabitCompletedOnDate(habit, day),
    }));
  }, [isHabitCompletedOnDate]);

  const getMonthlyData = useCallback((habit: Habit, date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => ({
      date: day,
      dayNumber: format(day, 'd'),
      isCompleted: isHabitCompletedOnDate(habit, day),
    }));
  }, [isHabitCompletedOnDate]);

  // Goal logic
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('goals-tracker-data');
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        setGoals([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals-tracker-data', JSON.stringify(goals));
  }, [goals]);

  const addGoal = useCallback((name: string, targetDate: Date) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetDate: targetDate.toISOString(),
      createdAt: new Date().toISOString(),
      logs: [],
      completedDays: [],
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const toggleGoalDay = useCallback((goalId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const isCompleted = goal.completedDays.includes(dateStr);
      return {
        ...goal,
        completedDays: isCompleted
          ? goal.completedDays.filter(d => d !== dateStr)
          : [...goal.completedDays, dateStr],
      };
    }));
  }, []);

  const addGoalLog = useCallback((goalId: string, date: Date, note: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const existingLogs = goal.logs || [];
      const existingIndex = existingLogs.findIndex(l => l.date === dateStr);
      
      if (existingIndex >= 0) {
        const updatedLogs = [...existingLogs];
        updatedLogs[existingIndex] = { date: dateStr, note };
        return { ...goal, logs: updatedLogs };
      } else {
        return { ...goal, logs: [...existingLogs, { date: dateStr, note }] };
      }
    }));
  }, []);

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOnDate,
    getHabitStats,
    getWeeklyData,
    getMonthlyData,
    addNote,
    getNoteForDate,
    goals,
    addGoal,
    deleteGoal,
    toggleGoalDay,
    addGoalLog,
  };
};
