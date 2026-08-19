import React from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { DashboardMetrics } from '../types/task';

export interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: metrics.total,
      icon: Layers,
      color: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-50 dark:bg-slate-900/50',
      border: 'border-slate-200 dark:border-zinc-800',
      badgeBg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: metrics.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300',
    },
    {
      id: 'remaining',
      label: 'Remaining',
      value: metrics.remaining,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-900/40',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: metrics.overdue,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-900/40',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300',
    },
  ];

  return (
    <div
      role="region"
      aria-label="Task Summary Counters"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            data-testid={`metric-${card.id}`}
            className={`p-4 rounded-xl border ${card.border} ${card.bg} transition-all shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.badgeBg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <span
                className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100"
                aria-live="polite"
              >
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
