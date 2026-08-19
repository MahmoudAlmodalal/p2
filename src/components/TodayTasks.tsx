import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { Priority, TaskWithComputed } from '../types/task';

export interface TodayTasksProps {
  tasks: TaskWithComputed[];
  onToggle: (id: string) => void;
}

const priorityBadges: Record<
  Priority,
  { label: string; icon: string; className: string }
> = {
  high: {
    label: 'High',
    icon: '🔴',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
  },
  medium: {
    label: 'Medium',
    icon: '🟡',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  low: {
    label: 'Low',
    icon: '🟢',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
};

export const TodayTasks: React.FC<TodayTasksProps> = ({ tasks, onToggle }) => {
  return (
    <section aria-labelledby="today-focus-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          id="today-focus-heading"
          className="text-lg font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2"
        >
          <span>Today's Focus</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
            {tasks.length}
          </span>
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div
          data-testid="empty-today-state"
          className="bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
            You're all caught up 🎉
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            No tasks scheduled for today. Add a new task above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Today's tasks list">
          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const badge = priorityBadges[task.priority] || priorityBadges.medium;

            return (
              <div
                key={task.id}
                role="listitem"
                data-testid={`task-item-${task.id}`}
                className={`flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border rounded-xl transition-all duration-200 shadow-sm ${
                  isCompleted
                    ? 'border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 opacity-70'
                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isCompleted}
                    aria-label={`Mark "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                    onClick={() => onToggle(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                        : 'border-gray-300 dark:border-zinc-600 bg-transparent hover:border-blue-500 dark:hover:border-blue-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <span
                    className={`text-sm transition-all truncate ${
                      isCompleted
                        ? 'line-through text-gray-400 dark:text-zinc-500'
                        : 'text-gray-800 dark:text-zinc-200 font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {task.dueTime && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      {task.dueTime}
                    </span>
                  )}
                  <span
                    aria-label={`Priority ${badge.label}`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${badge.className}`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
