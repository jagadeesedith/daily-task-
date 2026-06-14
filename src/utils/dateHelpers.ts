import { format, subDays, isToday, isYesterday, parseISO } from 'date-fns';

export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatDisplayDate(date: Date = new Date()): string {
  return format(date, 'EEEE, MMMM d');
}

export function formatTime(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'h:mm a');
}

export function getLast7Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    days.push({
      date: format(d, 'yyyy-MM-dd'),
      label: format(d, 'EEE')[0],
    });
  }
  return days;
}

export function getLast30Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(), i);
    days.push({
      date: format(d, 'yyyy-MM-dd'),
      label: format(d, 'MMM d'),
    });
  }
  return days;
}

export function isConsecutiveDay(prevDate: string | null, currDate: string): boolean {
  if (!prevDate) return false;
  const prev = parseISO(prevDate);
  const curr = parseISO(currDate);
  return isYesterday(prev) && isToday(curr);
}

export function getWeekStart(date: Date = new Date()): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return format(monday, 'yyyy-MM-dd');
}

export function getMonthStart(date: Date = new Date()): string {
  return format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
}
