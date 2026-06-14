export interface TaskItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  completed: boolean;
  completedAt: string | null;
}

export interface Streak {
  current: number;
  best: number;
  totalProductiveDays: number;
  lastCompletedDate: string | null;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface StudySession {
  id: string;
  type: 'tnpsc' | 'coding';
  subject: string;
  durationMinutes: number;
  notes: string;
  date: string;
}

export interface YouTubeLog {
  id: string;
  type: 'live' | 'shorts';
  completed: boolean;
  duration?: number;
  date: string;
}

export interface ReminderTime {
  task: string;
  time: string;
}

export interface AppSettings {
  remindersEnabled: boolean[];
  notificationsPermission: 'granted' | 'denied' | 'default';
  reminderTimes: ReminderTime[];
}

export interface DailyScore {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}
