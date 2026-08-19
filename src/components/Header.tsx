import React from 'react';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import { ThemeMode } from '../types/theme';
import { getGreeting, formatDisplayDate } from '../utils/date';

export interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, title = 'Quick Tasks' }) => {
  const greeting = getGreeting();
  const displayDate = formatDisplayDate();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
            {title}
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          <span className="font-semibold text-gray-700 dark:text-zinc-300">{greeting}</span> &bull; {displayDate}
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/60 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
