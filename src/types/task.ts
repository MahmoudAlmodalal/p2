import { UserSettings } from './theme';

export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'inbox' | 'todo' | 'completed';

export type ComputedStatus = 'overdue' | 'today' | 'upcoming' | 'none';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string | null;   // ISO calendar date: YYYY-MM-DD
  dueTime: string | null;   // 24-hour time: HH:mm
  status: TaskStatus;
  createdAt: string;        // ISO UTC timestamp
  updatedAt: string;        // ISO UTC timestamp
}

export interface TaskWithComputed extends Task {
  computedStatus: ComputedStatus;
}

export interface DashboardMetrics {
  total: number;
  completed: number;
  remaining: number;
  overdue: number;
}

export interface CreateTaskInput {
  title: string;
  priority?: Priority;
  dueDate?: string | null;
  dueTime?: string | null;
}

export interface StoragePayload {
  version: number;
  tasks: Task[];
  settings: UserSettings;
}
