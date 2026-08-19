import React, { useState, useRef } from 'react';
import { Plus, Calendar, Clock, X } from 'lucide-react';
import { CreateTaskInput, Priority } from '../types/task';
import { formatLocalDate } from '../utils/date';

export interface QuickAddProps {
  onAdd: (input: CreateTaskInput) => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const todayStr = formatLocalDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatLocalDate(tomorrow);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd({
      title: trimmed,
      priority,
      dueDate: dueDate || null,
      dueTime: dueDate && dueTime ? dueTime : null,
    });

    setTitle('');
    setPriority('medium');
    setDueDate('');
    setDueTime('');
    setShowDatePicker(false);
    inputRef.current?.focus();
  };

  const handleSetToday = () => {
    setDueDate(todayStr);
  };

  const handleSetTomorrow = () => {
    setDueDate(tomorrowStr);
  };

  const handleClearDate = () => {
    setDueDate('');
    setDueTime('');
    setShowDatePicker(false);
  };

  const priorityOptions: { value: Priority; label: string; icon: string; activeClass: string; inactiveClass: string }[] = [
    {
      value: 'high',
      label: 'High',
      icon: '🔴',
      activeClass: 'bg-red-100 text-red-800 border-red-400 dark:bg-red-950/60 dark:text-red-300 dark:border-red-600 font-semibold',
      inactiveClass: 'bg-transparent text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800',
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: '🟡',
      activeClass: 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-600 font-semibold',
      inactiveClass: 'bg-transparent text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800',
    },
    {
      value: 'low',
      label: 'Low',
      icon: '🟢',
      activeClass: 'bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600 font-semibold',
      inactiveClass: 'bg-transparent text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800',
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Quick task creation"
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm transition-all focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
    >
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done? Press Enter to add..."
          aria-label="Task title"
          maxLength={500}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="flex-1 bg-transparent text-gray-900 dark:text-zinc-100 text-base placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          aria-label="Add task"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/80 text-xs">
        {/* Priority Selector */}
        <div
          role="radiogroup"
          aria-label="Priority"
          className="flex items-center gap-1.5"
        >
          <span className="text-gray-500 dark:text-zinc-400 font-medium mr-1">Priority:</span>
          {priorityOptions.map((opt) => {
            const isSelected = priority === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${opt.label} priority`}
                onClick={() => setPriority(opt.value)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected ? opt.activeClass : opt.inactiveClass
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Due Date & Time Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-500 dark:text-zinc-400 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Due:
          </span>

          <button
            type="button"
            onClick={handleSetToday}
            className={`px-2.5 py-1 rounded-md border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              dueDate === todayStr
                ? 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-600 font-semibold'
                : 'bg-transparent text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            Today
          </button>

          <button
            type="button"
            onClick={handleSetTomorrow}
            className={`px-2.5 py-1 rounded-md border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              dueDate === tomorrowStr
                ? 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-600 font-semibold'
                : 'bg-transparent text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            Tomorrow
          </button>

          {showDatePicker ? (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Custom due date"
                className="px-2 py-0.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  aria-label="Custom due time"
                  className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleClearDate}
                aria-label="Clear custom date"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              {dueDate && dueDate !== todayStr && dueDate !== tomorrowStr ? dueDate : 'Custom...'}
            </button>
          )}

          {dueDate && !showDatePicker && (
            <button
              type="button"
              onClick={handleClearDate}
              aria-label="Clear date selection"
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
