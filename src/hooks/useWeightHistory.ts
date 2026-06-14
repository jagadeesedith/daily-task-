import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTodayKey, getLast30Days } from '@/utils/dateHelpers';
import type { WeightEntry } from '@/types';

export function useWeightHistory() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>('jaga_weight_history', [
    // Seed with 30 days of realistic data
    { date: '2026-05-16', weight: 74.2 },
    { date: '2026-05-17', weight: 74.0 },
    { date: '2026-05-18', weight: 73.8 },
    { date: '2026-05-19', weight: 73.9 },
    { date: '2026-05-20', weight: 73.5 },
    { date: '2026-05-21', weight: 73.6 },
    { date: '2026-05-22', weight: 73.3 },
    { date: '2026-05-23', weight: 73.4 },
    { date: '2026-05-24', weight: 73.1 },
    { date: '2026-05-25', weight: 73.0 },
    { date: '2026-05-26', weight: 73.2 },
    { date: '2026-05-27', weight: 72.9 },
    { date: '2026-05-28', weight: 72.8 },
    { date: '2026-05-29', weight: 72.7 },
    { date: '2026-05-30', weight: 72.5 },
    { date: '2026-05-31', weight: 72.6 },
    { date: '2026-06-01', weight: 72.4 },
    { date: '2026-06-02', weight: 72.3 },
    { date: '2026-06-03', weight: 72.5 },
    { date: '2026-06-04', weight: 72.2 },
    { date: '2026-06-05', weight: 72.1 },
    { date: '2026-06-06', weight: 72.0 },
    { date: '2026-06-07', weight: 71.9 },
    { date: '2026-06-08', weight: 72.0 },
    { date: '2026-06-09', weight: 71.8 },
    { date: '2026-06-10', weight: 71.7 },
    { date: '2026-06-11', weight: 71.6 },
    { date: '2026-06-12', weight: 71.5 },
    { date: '2026-06-13', weight: 71.4 },
    { date: '2026-06-14', weight: 71.3 },
  ]);

  const addEntry = useCallback((weight: number) => {
    const todayKey = getTodayKey();
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== todayKey);
      return [...filtered, { date: todayKey, weight }];
    });
  }, [setEntries]);

  const chartData = useMemo(() => {
    const last30 = getLast30Days();
    const entryMap = new Map(entries.map((e) => [e.date, e.weight]));
    return last30.map((day) => ({
      ...day,
      weight: entryMap.get(day.date) ?? null,
    }));
  }, [entries]);

  const recentEntries = useMemo(() => {
    return [...entries].reverse().slice(0, 7);
  }, [entries]);

  const latestWeight = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[entries.length - 1].weight;
  }, [entries]);

  const weightTrend = useMemo(() => {
    if (entries.length < 7) return null;
    const current = entries[entries.length - 1].weight;
    const weekAgo = entries[entries.length - 7].weight;
    return {
      change: Number((current - weekAgo).toFixed(1)),
      isLoss: current < weekAgo,
    };
  }, [entries]);

  const hasTodayEntry = useMemo(() => {
    return entries.some((e) => e.date === getTodayKey());
  }, [entries]);

  return {
    entries,
    addEntry,
    chartData,
    recentEntries,
    latestWeight,
    weightTrend,
    hasTodayEntry,
  };
}
