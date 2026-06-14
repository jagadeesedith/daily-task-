import {
  Dumbbell,
  Scale,
  BookOpen,
  Code2,
  Video,
  Scissors,
  Moon,
  LayoutDashboard,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { TaskItem, ReminderTime } from '@/types';
import type { LucideIcon } from 'lucide-react';

export const DEFAULT_TASKS: Omit<TaskItem, 'completed' | 'completedAt'>[] = [
  {
    id: 'exercise',
    name: 'Exercise',
    subtitle: 'Morning workout',
    icon: 'Dumbbell',
    iconColor: '#FF6B35',
  },
  {
    id: 'weight',
    name: 'Weight Measurement',
    subtitle: 'Track daily weight',
    icon: 'Scale',
    iconColor: '#8B5CF6',
  },
  {
    id: 'tnpsc',
    name: 'TNPSC Study',
    subtitle: '2 hours target',
    icon: 'BookOpen',
    iconColor: '#3B82F6',
  },
  {
    id: 'coding',
    name: 'Coding Practice',
    subtitle: '1 hour target',
    icon: 'Code2',
    iconColor: '#10B981',
  },
  {
    id: 'youtube-live',
    name: 'YouTube Live',
    subtitle: '1.5 hours target',
    icon: 'Video',
    iconColor: '#EF4444',
  },
  {
    id: 'shorts-editing',
    name: 'YouTube Shorts Editing',
    subtitle: '1 hour target',
    icon: 'Scissors',
    iconColor: '#F59E0B',
  },
  {
    id: 'sleep',
    name: 'Sleep Before 11 PM',
    subtitle: 'Sleep discipline',
    icon: 'Moon',
    iconColor: '#6366F1',
  },
];

export const REMINDER_TIMES: ReminderTime[] = [
  { task: 'Exercise', time: '10:00' },
  { task: 'TNPSC Study', time: '10:20' },
  { task: 'Coding Practice', time: '13:30' },
  { task: 'YouTube Live', time: '14:30' },
  { task: 'Shorts Editing', time: '16:00' },
  { task: 'Sleep Reminder', time: '22:30' },
];

export const TNPSC_SUBJECTS = ['History', 'Polity', 'Geography', 'Economics', 'Science', 'Current Affairs'];
export const CODING_TOPICS = ['JavaScript', 'React', 'Python', 'Data Structures', 'Algorithms', 'HTML/CSS'];

export const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell,
  Scale,
  BookOpen,
  Code2,
  Video,
  Scissors,
  Moon,
  LayoutDashboard,
  BarChart3,
  Settings,
};

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/stats', label: 'Statistics', icon: BarChart3 },
  { path: '/weight', label: 'Weight', icon: Scale },
  { path: '/study', label: 'Study', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const COLORS = {
  background: '#050505',
  surface: '#0F0F0F',
  surfaceHighlight: '#1A1A1A',
  border: '#2A2A2A',
  borderActive: '#3A3A3A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',
  accent: '#CCFF00',
  accentHover: '#B8E600',
  success: '#22C55E',
  successGlow: 'rgba(34,197,94,0.15)',
  danger: '#EF4444',
  chartLine: '#CCFF00',
  chartFill: 'rgba(204,255,0,0.1)',
};
