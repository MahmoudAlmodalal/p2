import React from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { QuickAdd } from './components/QuickAdd';
import { TodayTasks } from './components/TodayTasks';
import { useTasks, useTheme } from './context/TaskContext';

export const App: React.FC = () => {
  const { metrics, todayTasks, addTask, toggleTask } = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        
        <SummaryCards metrics={metrics} />

        <section aria-labelledby="quick-add-section-heading">
          <h2 id="quick-add-section-heading" className="sr-only">
            Capture New Task
          </h2>
          <QuickAdd onAdd={addTask} />
        </section>

        <TodayTasks tasks={todayTasks} onToggle={toggleTask} />
      </div>
    </div>
  );
};

export default App;
