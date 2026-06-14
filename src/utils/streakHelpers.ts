import { parseISO, differenceInDays } from 'date-fns';
import type { Streak } from '@/types';

const PRODUCTIVE_THRESHOLD = 6; // 6 out of 7 tasks = ~86%

export function shouldUpdateStreak(
  streak: Streak,
  todayCompleted: number,
  _todayTotal: number
): { shouldUpdate: boolean; newStreak: Streak } {
  const todayKey = new Date().toISOString().split('T')[0];
  
  // Already recorded today
  if (streak.lastCompletedDate === todayKey) {
    return { shouldUpdate: false, newStreak: streak };
  }

  const isProductive = todayCompleted >= PRODUCTIVE_THRESHOLD;
  
  if (!isProductive) {
    return { shouldUpdate: false, newStreak: streak };
  }

  let newCurrent = streak.current;
  
  if (streak.lastCompletedDate) {
    const lastDate = parseISO(streak.lastCompletedDate);
    const today = parseISO(todayKey);
    const daysDiff = differenceInDays(today, lastDate);
    
    if (daysDiff === 1) {
      // Consecutive day
      newCurrent = streak.current + 1;
    } else if (daysDiff > 1) {
      // Streak broken
      newCurrent = 1;
    }
    // daysDiff === 0 would be caught by the early return
  } else {
    // First productive day
    newCurrent = 1;
  }

  const newBest = Math.max(streak.best, newCurrent);
  const newTotal = streak.totalProductiveDays + 1;

  return {
    shouldUpdate: true,
    newStreak: {
      current: newCurrent,
      best: newBest,
      totalProductiveDays: newTotal,
      lastCompletedDate: todayKey,
    },
  };
}

export function getDefaultStreak(): Streak {
  return {
    current: 0,
    best: 0,
    totalProductiveDays: 0,
    lastCompletedDate: null,
  };
}
