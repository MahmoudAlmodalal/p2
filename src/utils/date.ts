import { ComputedStatus, Task } from '../types/task';

/**
 * Formats a Date object into a local ISO date string (YYYY-MM-DD)
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object into a localized long date string (e.g. "Wednesday, August 19, 2026")
 */
export function formatDisplayDate(date: Date = new Date(), locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Returns contextual greeting based on local hour
 * - 05:00–11:59: Good morning
 * - 12:00–17:59: Good afternoon
 * - 18:00–04:59: Good evening
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  }
  if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

/**
 * Computes the dynamic status of a task ('overdue' | 'today' | 'upcoming' | 'none')
 */
export function computeStatus(
  task: Pick<Task, 'dueDate' | 'dueTime' | 'status'>,
  referenceDate: Date = new Date()
): ComputedStatus {
  if (task.status === 'completed') {
    return 'none';
  }

  if (!task.dueDate) {
    return 'none';
  }

  const todayStr = formatLocalDate(referenceDate);

  if (task.dueDate < todayStr) {
    return 'overdue';
  }

  if (task.dueDate === todayStr) {
    if (task.dueTime) {
      const currentHours = String(referenceDate.getHours()).padStart(2, '0');
      const currentMinutes = String(referenceDate.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      if (currentTimeStr > task.dueTime) {
        return 'overdue';
      }
    }
    return 'today';
  }

  return 'upcoming';
}

/**
 * Checks if an active task is overdue
 */
export function isOverdue(task: Task, referenceDate: Date = new Date()): boolean {
  return computeStatus(task, referenceDate) === 'overdue';
}

/**
 * Checks if an active task is scheduled for today
 */
export function isToday(task: Task, referenceDate: Date = new Date()): boolean {
  return computeStatus(task, referenceDate) === 'today';
}
