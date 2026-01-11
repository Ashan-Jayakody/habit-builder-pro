import { useState, useEffect, useCallback } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { Habit } from '@/lib/habitTypes';

const MOMENTUM_STORAGE_KEY = 'momentum-bank-data';

interface MomentumData {
  momentumPoints: number;
  currentStreak: number;
  lastCheckDate: string | null;
  freezesUsed: number;
}

export const useMomentumBank = (habits: Habit[], isHabitCompletedOnDate: (habit: Habit, date: Date) => boolean) => {
  const [momentumData, setMomentumData] = useState<MomentumData>(() => {
    const stored = localStorage.getItem(MOMENTUM_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { momentumPoints: 0, currentStreak: 0, lastCheckDate: null, freezesUsed: 0 };
      }
    }
    return { momentumPoints: 0, currentStreak: 0, lastCheckDate: null, freezesUsed: 0 };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(momentumData));
  }, [momentumData]);

  // Check for missed days and apply freeze logic
  const checkMissedDays = useCallback(() => {
    if (habits.length === 0) return;

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterday = subDays(today, 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    // If we already checked today, skip
    if (momentumData.lastCheckDate === todayStr) return;

    // Check if all habits were completed yesterday
    const allCompletedYesterday = habits.every(h => isHabitCompletedOnDate(h, yesterday));

    setMomentumData(prev => {
      // First time setup or coming back after a while
      if (!prev.lastCheckDate) {
        return { ...prev, lastCheckDate: todayStr };
      }

      const lastCheck = parseISO(prev.lastCheckDate);
      const daysSinceLastCheck = Math.floor((today.getTime() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));

      // If more than 1 day has passed, we need to check for missed days
      if (daysSinceLastCheck > 1) {
        // Multiple days missed - apply freeze for each missed day
        let newPoints = prev.momentumPoints;
        let newStreak = prev.currentStreak;
        let newFreezesUsed = prev.freezesUsed;

        for (let i = 1; i < daysSinceLastCheck; i++) {
          if (newPoints >= 50) {
            newPoints -= 50;
            newFreezesUsed++;
          } else {
            newStreak = 0;
            break;
          }
        }

        return {
          momentumPoints: newPoints,
          currentStreak: newStreak,
          lastCheckDate: todayStr,
          freezesUsed: newFreezesUsed,
        };
      }

      // Check yesterday specifically
      if (daysSinceLastCheck === 1 && !allCompletedYesterday) {
        // Missed yesterday - apply freeze or reset
        if (prev.momentumPoints >= 50) {
          return {
            momentumPoints: prev.momentumPoints - 50,
            currentStreak: prev.currentStreak, // Keep streak alive
            lastCheckDate: todayStr,
            freezesUsed: prev.freezesUsed + 1,
          };
        } else {
          return {
            momentumPoints: prev.momentumPoints,
            currentStreak: 0, // Reset streak
            lastCheckDate: todayStr,
            freezesUsed: prev.freezesUsed,
          };
        }
      }

      return { ...prev, lastCheckDate: todayStr };
    });
  }, [habits, isHabitCompletedOnDate, momentumData.lastCheckDate]);

  // Run missed day check on mount and when habits change
  useEffect(() => {
    checkMissedDays();
  }, [checkMissedDays]);

  // Award points when a habit is completed
  const awardPoints = useCallback((points: number = 10) => {
    setMomentumData(prev => ({
      ...prev,
      momentumPoints: prev.momentumPoints + points,
    }));
  }, []);

  // Update streak when all habits are completed for the day
  const updateStreak = useCallback((allCompleted: boolean) => {
    if (allCompleted) {
      setMomentumData(prev => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
      }));
    }
  }, []);

  // Reset momentum data
  const resetMomentum = useCallback(() => {
    setMomentumData({ momentumPoints: 0, currentStreak: 0, lastCheckDate: null, freezesUsed: 0 });
  }, []);

  // Calculate freeze potential (how many days can be frozen)
  const freezePotential = Math.floor(momentumData.momentumPoints / 50);

  return {
    momentumPoints: momentumData.momentumPoints,
    currentStreak: momentumData.currentStreak,
    freezesUsed: momentumData.freezesUsed,
    freezePotential,
    awardPoints,
    updateStreak,
    resetMomentum,
  };
};
