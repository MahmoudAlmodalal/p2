import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../src/App';
import { TaskProvider } from '../../src/context/TaskContext';
import { STORAGE_KEY } from '../../src/repository/LocalStorageTaskRepository';

describe('Header & Theme Toggle Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders greeting, date, and allows toggling light/dark mode with persistence', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    // Contextual greeting should be present
    expect(screen.getByText(/Good (morning|afternoon|evening)/i)).toBeInTheDocument();

    const themeToggleBtn = screen.getByRole('button', { name: /Switch to dark mode/i });
    expect(themeToggleBtn).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to Dark Mode
    await user.click(themeToggleBtn);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument();

    // Check localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.settings?.theme).toBe('dark');

    // Toggle back to Light Mode
    await user.click(screen.getByRole('button', { name: /Switch to light mode/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    const savedAfter = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(savedAfter.settings?.theme).toBe('light');
  });
});
