import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getWeekStart, getTodayKey } from '@/utils/dateHelpers';
import type { YouTubeLog } from '@/types';

export function useYouTubeLog() {
  const [logs, setLogs] = useLocalStorage<YouTubeLog[]>('jaga_youtube_log', [
    { id: '1', type: 'live', completed: true, duration: 90, date: '2026-06-14' },
    { id: '2', type: 'shorts', completed: true, duration: 60, date: '2026-06-14' },
    { id: '3', type: 'live', completed: true, duration: 120, date: '2026-06-13' },
    { id: '4', type: 'shorts', completed: true, duration: 45, date: '2026-06-13' },
    { id: '5', type: 'live', completed: true, duration: 60, date: '2026-06-12' },
    { id: '6', type: 'shorts', completed: false, duration: 30, date: '2026-06-12' },
    { id: '7', type: 'live', completed: true, duration: 105, date: '2026-06-11' },
    { id: '8', type: 'shorts', completed: true, duration: 75, date: '2026-06-11' },
  ]);

  const toggleLog = useCallback((logId: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, completed: !log.completed } : log
      )
    );
  }, [setLogs]);

  const addLog = useCallback((type: 'live' | 'shorts', duration: number) => {
    const newLog: YouTubeLog = {
      id: Date.now().toString(),
      type,
      completed: true,
      duration,
      date: getTodayKey(),
    };
    setLogs((prev) => [...prev, newLog]);
  }, [setLogs]);

  const weeklyStats = useMemo(() => {
    const weekStart = getWeekStart();
    const weekLogs = logs.filter((l) => l.date >= weekStart);
    const liveCompleted = weekLogs.filter((l) => l.type === 'live' && l.completed).length;
    const shortsCompleted = weekLogs.filter((l) => l.type === 'shorts' && l.completed).length;
    const totalLiveMinutes = weekLogs
      .filter((l) => l.type === 'live' && l.completed)
      .reduce((sum, l) => sum + (l.duration || 0), 0);
    const totalShortsMinutes = weekLogs
      .filter((l) => l.type === 'shorts' && l.completed)
      .reduce((sum, l) => sum + (l.duration || 0), 0);
    
    return {
      liveCompleted,
      shortsCompleted,
      totalLiveHours: Number((totalLiveMinutes / 60).toFixed(1)),
      totalShortsHours: Number((totalShortsMinutes / 60).toFixed(1)),
      totalHours: Number(((totalLiveMinutes + totalShortsMinutes) / 60).toFixed(1)),
    };
  }, [logs]);

  const recentLogs = useMemo(() => {
    return [...logs].reverse().slice(0, 7);
  }, [logs]);

  const todayStatus = useMemo(() => {
    const today = getTodayKey();
    const todayLogs = logs.filter((l) => l.date === today);
    return {
      liveDone: todayLogs.some((l) => l.type === 'live' && l.completed),
      shortsDone: todayLogs.some((l) => l.type === 'shorts' && l.completed),
    };
  }, [logs]);

  return {
    logs,
    toggleLog,
    addLog,
    weeklyStats,
    recentLogs,
    todayStatus,
  };
}
