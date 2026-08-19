import { describe, it, expect } from 'vitest';
import {
  formatLocalDate,
  formatDisplayDate,
  getGreeting,
  computeStatus,
  isOverdue,
  isToday,
} from '../../src/utils/date';
import { Task } from '../../src/types/task';

describe('date utils', () => {
  describe('formatLocalDate', () => {
    it('formats date to YYYY-MM-DD correctly', () => {
      const date = new Date(2026, 7, 19, 14, 30); // Month is 0-indexed (7 = August)
      expect(formatLocalDate(date)).toBe('2026-08-19');
    });
  });

  describe('formatDisplayDate', () => {
    it('formats date into long weekday string', () => {
      const date = new Date(2026, 7, 19, 14, 30);
      expect(formatDisplayDate(date, 'en-US')).toBe('Wednesday, August 19, 2026');
    });
  });

  describe('getGreeting', () => {
    it('returns "Good morning" between 05:00 and 11:59', () => {
      expect(getGreeting(new Date(2026, 7, 19, 5, 0))).toBe('Good morning');
      expect(getGreeting(new Date(2026, 7, 19, 11, 59))).toBe('Good morning');
    });

    it('returns "Good afternoon" between 12:00 and 17:59', () => {
      expect(getGreeting(new Date(2026, 7, 19, 12, 0))).toBe('Good afternoon');
      expect(getGreeting(new Date(2026, 7, 19, 17, 59))).toBe('Good afternoon');
    });

    it('returns "Good evening" between 18:00 and 04:59', () => {
      expect(getGreeting(new Date(2026, 7, 19, 18, 0))).toBe('Good evening');
      expect(getGreeting(new Date(2026, 7, 19, 23, 59))).toBe('Good evening');
      expect(getGreeting(new Date(2026, 7, 19, 4, 59))).toBe('Good evening');
    });
  });

  describe('computeStatus & overdue / today helpers', () => {
    const referenceDate = new Date(2026, 7, 19, 15, 0); // 2026-08-19 15:00

    it('returns "none" for completed tasks regardless of date', () => {
      const task: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-18',
        dueTime: '12:00',
        status: 'completed',
      };
      expect(computeStatus(task, referenceDate)).toBe('none');
    });

    it('returns "none" for tasks without due date', () => {
      const task: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: null,
        dueTime: null,
        status: 'inbox',
      };
      expect(computeStatus(task, referenceDate)).toBe('none');
    });

    it('returns "overdue" for tasks with past date', () => {
      const task: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-18',
        dueTime: null,
        status: 'todo',
      };
      expect(computeStatus(task, referenceDate)).toBe('overdue');
    });

    it('returns "overdue" for tasks with today date and past time', () => {
      const task: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-19',
        dueTime: '14:00', // 14:00 < 15:00
        status: 'todo',
      };
      expect(computeStatus(task, referenceDate)).toBe('overdue');
    });

    it('returns "today" for tasks due today with future time or no time', () => {
      const taskWithFutureTime: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-19',
        dueTime: '16:00', // 16:00 > 15:00
        status: 'todo',
      };
      expect(computeStatus(taskWithFutureTime, referenceDate)).toBe('today');

      const taskWithNoTime: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-19',
        dueTime: null,
        status: 'todo',
      };
      expect(computeStatus(taskWithNoTime, referenceDate)).toBe('today');
      expect(isToday(taskWithNoTime as Task, referenceDate)).toBe(true);
    });

    it('returns "upcoming" for tasks due in the future', () => {
      const task: Pick<Task, 'dueDate' | 'dueTime' | 'status'> = {
        dueDate: '2026-08-20',
        dueTime: null,
        status: 'todo',
      };
      expect(computeStatus(task, referenceDate)).toBe('upcoming');
      expect(isOverdue(task as Task, referenceDate)).toBe(false);
    });
  });
});
