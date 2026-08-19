import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../src/App';
import { TaskProvider } from '../../src/context/TaskContext';
import { LocalStorageTaskRepository } from '../../src/repository/LocalStorageTaskRepository';

describe('Dashboard Metrics & Focus Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays accurate initial seed counts in SummaryCards', () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    // Initial seed has 4 tasks:
    // Task 1: today, high, todo
    // Task 2: today, medium, todo
    // Task 3: yesterday (overdue), high, todo
    // Task 4: inbox, low
    // Total = 4, Completed = 0, Remaining = 4, Overdue = 1
    const totalMetric = screen.getByTestId('metric-total');
    expect(totalMetric).toHaveTextContent('4');

    const completedMetric = screen.getByTestId('metric-completed');
    expect(completedMetric).toHaveTextContent('0');

    const remainingMetric = screen.getByTestId('metric-remaining');
    expect(remainingMetric).toHaveTextContent('4');

    const overdueMetric = screen.getByTestId('metric-overdue');
    expect(overdueMetric).toHaveTextContent('1');
  });

  it('renders today tasks in Today Focus section', () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    expect(screen.getByText('Review project roadmap with team')).toBeInTheDocument();
    expect(screen.getByText('Submit weekly status update')).toBeInTheDocument();
  });

  it('dynamically increments Total and Remaining metrics upon adding a task', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const input = screen.getByPlaceholderText(/What needs to be done/i);
    await user.click(screen.getByRole('button', { name: /^Today$/i }));
    await user.type(input, 'New critical task{Enter}');

    expect(screen.getByTestId('metric-total')).toHaveTextContent('5');
    expect(screen.getByTestId('metric-remaining')).toHaveTextContent('5');
    expect(screen.getByText('New critical task')).toBeInTheDocument();
  });

  it('shows empty state when no tasks are scheduled for today', () => {
    const repo = new LocalStorageTaskRepository();
    localStorage.setItem(
      'quick_tasks_data_v1',
      JSON.stringify({
        version: 1,
        tasks: [],
        settings: { theme: 'light' },
      })
    );

    render(
      <TaskProvider repository={repo}>
        <App />
      </TaskProvider>
    );

    expect(screen.getByTestId('empty-today-state')).toBeInTheDocument();
    expect(screen.getByText(/You're all caught up/i)).toBeInTheDocument();
  });
});
