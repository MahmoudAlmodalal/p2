import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageTaskRepository, STORAGE_KEY } from '../../src/repository/LocalStorageTaskRepository';

describe('LocalStorageTaskRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('auto-seeds default tasks on first launch', () => {
    const repo = new LocalStorageTaskRepository();
    const tasks = repo.getTasks();
    expect(tasks.length).toBe(4);
    expect(tasks[0].title).toBe('Review project roadmap with team');
    expect(tasks[0].priority).toBe('high');
  });

  it('creates new task with valid data and persists to storage', () => {
    const repo = new LocalStorageTaskRepository();
    const newTask = repo.createTask({
      title: 'Write integration test',
      priority: 'high',
      dueDate: '2026-08-20',
      dueTime: '10:00',
    });

    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe('Write integration test');
    expect(newTask.priority).toBe('high');
    expect(newTask.status).toBe('todo');

    const loadedTasks = repo.getTasks();
    expect(loadedTasks[0].id).toBe(newTask.id);
  });

  it('throws error when creating task with empty title', () => {
    const repo = new LocalStorageTaskRepository();
    expect(() => repo.createTask({ title: '   ' })).toThrow('Task title cannot be empty.');
  });

  it('throws error when creating task with title exceeding 500 characters', () => {
    const repo = new LocalStorageTaskRepository();
    expect(() => repo.createTask({ title: 'a'.repeat(501) })).toThrow('Task title cannot exceed 500 characters.');
  });

  it('toggles task completion status back and forth', () => {
    const repo = new LocalStorageTaskRepository();
    const tasks = repo.getTasks();
    const target = tasks[0]; // status: 'todo'

    const completed = repo.toggleTaskCompletion(target.id);
    expect(completed?.status).toBe('completed');

    const uncompleted = repo.toggleTaskCompletion(target.id);
    expect(uncompleted?.status).toBe('todo');
  });

  it('manages user settings in localStorage', () => {
    const repo = new LocalStorageTaskRepository();
    expect(repo.getSettings().theme).toBe('light');

    const updated = repo.updateSettings({ theme: 'dark' });
    expect(updated.theme).toBe('dark');
    expect(repo.getSettings().theme).toBe('dark');
  });

  it('gracefully handles corrupted JSON in localStorage by resetting or fallback', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json{{');
    const repo = new LocalStorageTaskRepository();
    const tasks = repo.getTasks();
    expect(Array.isArray(tasks)).toBe(true);
  });
});
