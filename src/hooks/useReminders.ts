import { useEffect, useRef } from 'react';
import { useSettings } from './useSettings';

export function useReminders() {
  const { settings, requestNotificationPermission } = useSettings();
  const timeoutsRef = useRef<number[]>([]);

  // Clear all scheduled timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    clearAllTimeouts();

    if (settings.notificationsPermission !== 'granted') {
      return;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    settings.reminderTimes.forEach((reminder, index) => {
      if (!settings.remindersEnabled[index]) return;

      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderMinutes = hours * 60 + minutes;

      // Calculate next occurrence
      let delayMinutes = reminderMinutes - currentMinutes;
      if (delayMinutes <= 0) {
        delayMinutes += 24 * 60; // Schedule for tomorrow
      }

      const delayMs = delayMinutes * 60 * 1000;

      const timeoutId = window.setTimeout(() => {
        try {
          new Notification(`Time for ${reminder.task}!`, {
            body: 'Stay consistent with your daily discipline.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `jaga-${reminder.task}`,
            requireInteraction: false,
          });
        } catch {
          // Silent fail
        }
      }, delayMs);

      timeoutsRef.current.push(timeoutId);
    });

    return () => clearAllTimeouts();
  }, [settings.notificationsPermission, settings.remindersEnabled, settings.reminderTimes]);

  return { requestNotificationPermission };
}
