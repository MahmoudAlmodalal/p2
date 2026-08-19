import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../src/App';
import { TaskProvider } from '../../src/context/TaskContext';

describe('Task Completion Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles task completion and reactively updates dashboard metrics', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    // Initial state: Completed = 0, Remaining = 4
    expect(screen.getByTestId('metric-completed')).toHaveTextContent('0');
    expect(screen.getByTestId('metric-remaining')).toHaveTextContent('4');

    // Click checkbox for first today task
    const checkbox = screen.getByRole('checkbox', {
      name: /Mark "Review project roadmap with team" as complete/i,
    });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);

    // Verified completed styling and attribute
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    const taskTitle = screen.getByText('Review project roadmap with team');
    expect(taskTitle).toHaveClass('line-through');

    // Metrics should reactively update: Completed = 1, Remaining = 3
    expect(screen.getByTestId('metric-completed')).toHaveTextContent('1');
    expect(screen.getByTestId('metric-remaining')).toHaveTextContent('3');

    // Toggle back to incomplete
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(taskTitle).not.toHaveClass('line-through');
    expect(screen.getByTestId('metric-completed')).toHaveTextContent('0');
    expect(screen.getByTestId('metric-remaining')).toHaveTextContent('4');
  });
});
