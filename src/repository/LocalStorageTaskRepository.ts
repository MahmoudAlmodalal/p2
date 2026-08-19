import { CreateTaskInput, StoragePayload, Task } from '../types/task';
import { UserSettings } from '../types/theme';
import { getInitialSeedTasks, ITaskRepository } from './TaskRepository';

export const STORAGE_KEY = 'quick_tasks_data_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export class LocalStorageTaskRepository implements ITaskRepository {
  private memoryFallback: StoragePayload | null = null;

  constructor() {
    this.ensureInitialized();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private readRaw(): StoragePayload | null {
    if (!this.isLocalStorageAvailable()) {
      return this.memoryFallback;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.version === CURRENT_SCHEMA_VERSION && Array.isArray(parsed.tasks)) {
        return parsed as StoragePayload;
      }
      return null;
    } catch {
      return this.memoryFallback;
    }
  }

  private writeRaw(payload: StoragePayload): void {
    if (!this.isLocalStorageAvailable()) {
      this.memoryFallback = payload;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to write to LocalStorage, falling back to memory:', e);
      this.memoryFallback = payload;
    }
  }

  private ensureInitialized(): void {
    const existing = this.readRaw();
    if (!existing) {
      const initialPayload: StoragePayload = {
        version: CURRENT_SCHEMA_VERSION,
        tasks: getInitialSeedTasks(),
        settings: {
          theme: 'light',
        },
      };
      this.writeRaw(initialPayload);
    }
  }

  public getTasks(): Task[] {
    const payload = this.readRaw();
    return payload ? payload.tasks : [];
  }

  public createTask(input: CreateTaskInput): Task {
    const trimmedTitle = input.title?.trim();
    if (!trimmedTitle) {
      throw new Error('Task title cannot be empty.');
    }
    if (trimmedTitle.length > 500) {
      throw new Error('Task title cannot exceed 500 characters.');
    }

    const priority = input.priority || 'medium';
    const dueDate = input.dueDate || null;
    const dueTime = input.dueTime || null;
    const status = dueDate ? 'todo' : 'inbox';
    const now = new Date().toISOString();

    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'task-' + Date.now(),
      title: trimmedTitle,
      priority,
      dueDate,
      dueTime,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const payload = this.readRaw() || {
      version: CURRENT_SCHEMA_VERSION,
      tasks: [],
      settings: { theme: 'light' },
    };

    const updatedTasks = [newTask, ...payload.tasks];
    this.writeRaw({
      ...payload,
      tasks: updatedTasks,
    });

    return newTask;
  }

  public toggleTaskCompletion(id: string): Task | null {
    const payload = this.readRaw();
    if (!payload) return null;

    let updatedTask: Task | null = null;
    const now = new Date().toISOString();

    const updatedTasks = payload.tasks.map((task) => {
      if (task.id === id) {
        const nextStatus = task.status === 'completed' ? (task.dueDate ? 'todo' : 'inbox') : 'completed';
        updatedTask = {
          ...task,
          status: nextStatus,
          updatedAt: now,
        };
        return updatedTask;
      }
      return task;
    });

    if (updatedTask) {
      this.writeRaw({
        ...payload,
        tasks: updatedTasks,
      });
    }

    return updatedTask;
  }

  public getSettings(): UserSettings {
    const payload = this.readRaw();
    return payload?.settings || { theme: 'light' };
  }

  public updateSettings(settings: Partial<UserSettings>): UserSettings {
    const payload = this.readRaw() || {
      version: CURRENT_SCHEMA_VERSION,
      tasks: [],
      settings: { theme: 'light' },
    };

    const nextSettings: UserSettings = {
      ...payload.settings,
      ...settings,
    };

    this.writeRaw({
      ...payload,
      settings: nextSettings,
    });

    return nextSettings;
  }

  public seedDemoData(): Task[] {
    const seedTasks = getInitialSeedTasks();
    const payload = this.readRaw() || {
      version: CURRENT_SCHEMA_VERSION,
      tasks: [],
      settings: { theme: 'light' },
    };

    this.writeRaw({
      ...payload,
      tasks: seedTasks,
    });

    return seedTasks;
  }
}
