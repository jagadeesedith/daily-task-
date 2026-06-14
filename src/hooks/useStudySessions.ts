import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getWeekStart, getMonthStart, getTodayKey } from '@/utils/dateHelpers';
import type { StudySession } from '@/types';

export function useStudySessions() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('jaga_study_sessions', [
    // Seed data for TNPSC
    { id: '1', type: 'tnpsc', subject: 'History', durationMinutes: 90, notes: 'Indian Freedom Movement', date: '2026-06-14' },
    { id: '2', type: 'tnpsc', subject: 'Polity', durationMinutes: 60, notes: 'Constitution fundamentals', date: '2026-06-13' },
    { id: '3', type: 'tnpsc', subject: 'Geography', durationMinutes: 45, notes: 'Rivers of India', date: '2026-06-12' },
    { id: '4', type: 'tnpsc', subject: 'Economics', durationMinutes: 75, notes: 'GDP and Growth', date: '2026-06-11' },
    { id: '5', type: 'tnpsc', subject: 'Science', durationMinutes: 60, notes: 'Physics basics', date: '2026-06-10' },
    { id: '6', type: 'tnpsc', subject: 'Current Affairs', durationMinutes: 30, notes: 'June news', date: '2026-06-14' },
    // Seed data for Coding
    { id: '7', type: 'coding', subject: 'JavaScript', durationMinutes: 60, notes: 'ES6 features', date: '2026-06-14' },
    { id: '8', type: 'coding', subject: 'React', durationMinutes: 45, notes: 'Hooks review', date: '2026-06-13' },
    { id: '9', type: 'coding', subject: 'Data Structures', durationMinutes: 50, notes: 'Binary trees', date: '2026-06-12' },
  ]);

  const addSession = useCallback((type: 'tnpsc' | 'coding', subject: string, hours: number, minutes: number, notes: string) => {
    const durationMinutes = hours * 60 + minutes;
    const newSession: StudySession = {
      id: Date.now().toString(),
      type,
      subject,
      durationMinutes,
      notes,
      date: getTodayKey(),
    };
    setSessions((prev) => [...prev, newSession]);
  }, [setSessions]);

  const weeklyHours = useMemo(() => {
    const weekStart = getWeekStart();
    const weekSessions = sessions.filter((s) => s.date >= weekStart);
    const tnpscMinutes = weekSessions.filter((s) => s.type === 'tnpsc').reduce((sum, s) => sum + s.durationMinutes, 0);
    const codingMinutes = weekSessions.filter((s) => s.type === 'coding').reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      tnpsc: Number((tnpscMinutes / 60).toFixed(1)),
      coding: Number((codingMinutes / 60).toFixed(1)),
      total: Number(((tnpscMinutes + codingMinutes) / 60).toFixed(1)),
    };
  }, [sessions]);

  const monthlyHours = useMemo(() => {
    const monthStart = getMonthStart();
    const monthSessions = sessions.filter((s) => s.date >= monthStart);
    const tnpscMinutes = monthSessions.filter((s) => s.type === 'tnpsc').reduce((sum, s) => sum + s.durationMinutes, 0);
    const codingMinutes = monthSessions.filter((s) => s.type === 'coding').reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      tnpsc: Number((tnpscMinutes / 60).toFixed(1)),
      coding: Number((codingMinutes / 60).toFixed(1)),
      total: Number(((tnpscMinutes + codingMinutes) / 60).toFixed(1)),
    };
  }, [sessions]);

  const recentSessions = useMemo(() => {
    return [...sessions].reverse().slice(0, 10);
  }, [sessions]);

  const getSessionsByType = useCallback((type: 'tnpsc' | 'coding') => {
    return sessions.filter((s) => s.type === type);
  }, [sessions]);

  return {
    sessions,
    addSession,
    weeklyHours,
    monthlyHours,
    recentSessions,
    getSessionsByType,
  };
}
