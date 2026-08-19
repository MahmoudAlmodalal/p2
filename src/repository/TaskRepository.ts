import { CreateTaskInput, Task } from '../types/task';
import { UserSettings } from '../types/theme';
import { formatLocalDate } from '../utils/date';

export interface ITaskRepository {
  getTasks(): Task[];
  createTask(input: CreateTaskInput): Task;
  toggleTaskCompletion(id: string): Task | null;
  getSettings(): UserSettings;
  updateSettings(settings: Partial<UserSettings>): UserSettings;
  seedDemoData(): Task[];
}

/**
 * Generates dynamic initial seed data with relative dates for today/yesterday
 */
export function getInitialSeedTasks(referenceDate: Date = new Date()): Task[] {
  const todayStr = formatLocalDate(referenceDate);
  
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  const nowIso = referenceDate.toISOString();

  return [
    {
      id: 'seed-task-1',
      title: 'Review project roadmap with team',
      priority: 'high',
      dueDate: todayStr,
      dueTime: null,
      status: 'todo',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'seed-task-2',
      title: 'Submit weekly status update',
      priority: 'medium',
      dueDate: todayStr,
      dueTime: null,
      status: 'todo',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'seed-task-3',
      title: 'Send client proposal draft',
      priority: 'high',
      dueDate: yesterdayStr,
      dueTime: null,
      status: 'todo',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'seed-task-4',
      title: 'Explore new icon libraries',
      priority: 'low',
      dueDate: null,
      dueTime: null,
      status: 'inbox',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];
}
