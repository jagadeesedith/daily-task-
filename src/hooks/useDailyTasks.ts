import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_TASKS } from '@/utils/constants';
import { getTodayKey, formatDisplayDate } from '@/utils/dateHelpers';
import type { TaskItem } from '@/types';

function createDefaultTasksForDate(): TaskItem[] {
  return DEFAULT_TASKS.map((task) => ({
    ...task,
    completed: false,
    completedAt: null,
  }));
}

export function useDailyTasks() {
  const todayKey = getTodayKey();
  const storageKey = `jaga_tasks_${todayKey}`;
  
  const [tasks, setTasks] = useLocalStorage<TaskItem[]>(storageKey, createDefaultTasksForDate());
  const [dailyScores, setDailyScores] = useLocalStorage<{ date: string; completed: number; total: number; percentage: number }[]>(
    'jaga_daily_scores',
    []
  );
  const [newDayToast, setNewDayToast] = useState(false);

  // Check for new day on mount
  useEffect(() => {
    const lastVisit = localStorage.getItem('jaga_last_visit_date');
    if (lastVisit && lastVisit !== todayKey) {
      setNewDayToast(true);
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => setNewDayToast(false), 3000);
      return () => clearTimeout(timer);
    }
    localStorage.setItem('jaga_last_visit_date', todayKey);
  }, [todayKey]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          const now = new Date().toISOString();
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? now : null,
          };
        }
        return task;
      });
      
      // Update daily score
      const completed = updated.filter((t) => t.completed).length;
      const total = updated.length;
      const percentage = Math.round((completed / total) * 100);
      
      setDailyScores((prevScores) => {
        const existingIndex = prevScores.findIndex((s) => s.date === todayKey);
        const newScore = { date: todayKey, completed, total, percentage };
        if (existingIndex >= 0) {
          const newScores = [...prevScores];
          newScores[existingIndex] = newScore;
          return newScores;
        }
        return [...prevScores, newScore];
      });
      
      return updated;
    });
  }, [setTasks, setDailyScores, todayKey]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllComplete = completedCount === totalCount && totalCount > 0;

  const dismissNewDayToast = useCallback(() => {
    setNewDayToast(false);
  }, []);

  return {
    tasks,
    toggleTask,
    completedCount,
    totalCount,
    percentage,
    isAllComplete,
    displayDate: formatDisplayDate(),
    newDayToast,
    dismissNewDayToast,
    dailyScores,
  };
}
