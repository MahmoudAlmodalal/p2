import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QuickAdd } from '../../src/components/QuickAdd';
import { formatLocalDate } from '../../src/utils/date';

describe('QuickAdd Integration', () => {
  it('renders input, priority chips, and submit button', () => {
    const onAdd = vi.fn();
    render(<QuickAdd onAdd={onAdd} />);

    expect(screen.getByPlaceholderText(/What needs to be done/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /High priority/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Medium priority/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Low priority/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add task/i })).toBeInTheDocument();
  });

  it('submits a task on Enter key with selected priority and due date', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<QuickAdd onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/What needs to be done/i);

    // Select High priority
    await user.click(screen.getByRole('radio', { name: /High priority/i }));

    // Select Today due date
    await user.click(screen.getByRole('button', { name: /^Today$/i }));

    // Type and press Enter in input
    await user.type(input, 'Write unit tests{Enter}');

    const todayStr = formatLocalDate(new Date());
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      title: 'Write unit tests',
      priority: 'high',
      dueDate: todayStr,
      dueTime: null,
    });

    // Input should be cleared after submit
    expect(input).toHaveValue('');
  });

  it('submits a task via Add button', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<QuickAdd onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/What needs to be done/i);
    await user.type(input, 'Refactor code');

    const addBtn = screen.getByRole('button', { name: /Add task/i });
    await user.click(addBtn);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      title: 'Refactor code',
      priority: 'medium',
      dueDate: null,
      dueTime: null,
    });
  });

  it('does not submit when title is only whitespace', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<QuickAdd onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/What needs to be done/i);
    await user.type(input, '   {Enter}');

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('allows selecting Tomorrow and custom due time', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<QuickAdd onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/What needs to be done/i);

    await user.click(screen.getByText(/Custom.../i));
    const timeInput = screen.getByLabelText(/Custom due time/i);
    const dateInput = screen.getByLabelText(/Custom due date/i);

    fireEvent.change(dateInput, { target: { value: '2026-08-25' } });
    fireEvent.change(timeInput, { target: { value: '14:00' } });

    await user.type(input, 'Deploy staging{Enter}');

    expect(onAdd).toHaveBeenCalledWith({
      title: 'Deploy staging',
      priority: 'medium',
      dueDate: '2026-08-25',
      dueTime: '14:00',
    });
  });
});
