import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { REMINDER_TIMES } from '@/utils/constants';
import type { AppSettings } from '@/types';

const DEFAULT_SETTINGS: AppSettings = {
  remindersEnabled: [true, true, true, true, true, true],
  notificationsPermission: 'default',
  reminderTimes: REMINDER_TIMES,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('jaga_settings', DEFAULT_SETTINGS);

  const toggleReminder = useCallback((index: number) => {
    setSettings((prev) => {
      const updated = [...prev.remindersEnabled];
      updated[index] = !updated[index];
      return { ...prev, remindersEnabled: updated };
    });
  }, [setSettings]);

  const setNotificationPermission = useCallback((permission: 'granted' | 'denied' | 'default') => {
    setSettings((prev) => ({ ...prev, notificationsPermission: permission }));
  }, [setSettings]);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setNotificationPermission('denied');
      return 'denied' as const;
    }
    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result as 'granted' | 'denied' | 'default');
      return result as 'granted' | 'denied' | 'default';
    } catch {
      setNotificationPermission('denied');
      return 'denied' as const;
    }
  }, [setNotificationPermission]);

  const exportData = useCallback(() => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('jaga_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jaga-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const resetAllData = useCallback(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('jaga_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return {
    settings,
    toggleReminder,
    setNotificationPermission,
    requestNotificationPermission,
    exportData,
    resetAllData,
  };
}
