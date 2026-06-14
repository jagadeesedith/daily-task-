import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { shouldUpdateStreak, getDefaultStreak } from '@/utils/streakHelpers';
import type { Streak } from '@/types';

export function useStreak() {
  const [streak, setStreak] = useLocalStorage<Streak>('jaga_streak', getDefaultStreak());

  const recordProductiveDay = useCallback((todayCompleted: number, todayTotal: number) => {
    const result = shouldUpdateStreak(streak, todayCompleted, todayTotal);
    if (result.shouldUpdate) {
      setStreak(result.newStreak);
    }
    return result.shouldUpdate;
  }, [streak, setStreak]);

  const resetStreak = useCallback(() => {
    setStreak(getDefaultStreak());
  }, [setStreak]);

  return {
    streak,
    recordProductiveDay,
    resetStreak,
  };
}
