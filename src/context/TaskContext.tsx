import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { CreateTaskInput, DashboardMetrics, Task, TaskWithComputed } from '../types/task';
import { ThemeMode, UserSettings } from '../types/theme';
import { ITaskRepository } from '../repository/TaskRepository';
import { LocalStorageTaskRepository } from '../repository/LocalStorageTaskRepository';
import { computeStatus, formatLocalDate } from '../utils/date';

export interface TaskContextType {
  tasks: TaskWithComputed[];
  metrics: DashboardMetrics;
  todayTasks: TaskWithComputed[];
  settings: UserSettings;
  addTask: (input: CreateTaskInput) => Task;
  toggleTask: (id: string) => void;
  setTheme: (theme: ThemeMode) => void;
  resetDemoData: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
  repository?: ITaskRepository;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
  repository = new LocalStorageTaskRepository(),
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => repository.getTasks());
  const [settings, setSettings] = useState<UserSettings>(() => repository.getSettings());

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const addTask = useCallback((input: CreateTaskInput) => {
    const newTask = repository.createTask(input);
    setTasks(repository.getTasks());
    return newTask;
  }, [repository]);

  const toggleTask = useCallback((id: string) => {
    repository.toggleTaskCompletion(id);
    setTasks(repository.getTasks());
  }, [repository]);

  const setTheme = useCallback((theme: ThemeMode) => {
    const updated = repository.updateSettings({ theme });
    setSettings(updated);
  }, [repository]);

  const resetDemoData = useCallback(() => {
    const seeded = repository.seedDemoData();
    setTasks(seeded);
  }, [repository]);

  const tasksWithComputed: TaskWithComputed[] = useMemo(() => {
    const now = new Date();
    return tasks.map((task) => ({
      ...task,
      computedStatus: computeStatus(task, now),
    }));
  }, [tasks]);

  const metrics: DashboardMetrics = useMemo(() => {
    const total = tasksWithComputed.length;
    const completed = tasksWithComputed.filter((t) => t.status === 'completed').length;
    const remaining = tasksWithComputed.filter((t) => t.status !== 'completed').length;
    const overdue = tasksWithComputed.filter((t) => t.computedStatus === 'overdue').length;

    return {
      total,
      completed,
      remaining,
      overdue,
    };
  }, [tasksWithComputed]);

  const todayTasks: TaskWithComputed[] = useMemo(() => {
    const todayStr = formatLocalDate(new Date());
    return tasksWithComputed.filter((t) => t.dueDate === todayStr);
  }, [tasksWithComputed]);

  const value: TaskContextType = {
    tasks: tasksWithComputed,
    metrics,
    todayTasks,
    settings,
    addTask,
    toggleTask,
    setTheme,
    resetDemoData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const useTheme = () => {
  const { settings, setTheme } = useTasks();
  const toggleTheme = useCallback(() => {
    setTheme(settings.theme === 'light' ? 'dark' : 'light');
  }, [settings.theme, setTheme]);

  return {
    theme: settings.theme,
    setTheme,
    toggleTheme,
  };
};
