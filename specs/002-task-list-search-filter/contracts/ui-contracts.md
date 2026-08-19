# UI Component & Interaction Contracts

**Feature Branch**: `002-task-list-search-filter`  
**Date**: 2026-08-19  

---

## 1. Component Interfaces & Props

### `SearchBar`
Search input with real-time query filtering, clear button, and shortcut badge.

```typescript
export interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}
```
- **A11y Contract**: `aria-label="Search tasks"`, `role="search"`, keyboard shortcut hint `[/]` visible.
- **Interactions**: Esc clears search and blurs input; typing invokes `onQueryChange` immediately.

---

### `FilterBar`
Multi-dimensional filter chip group with sort selector and clear button.

```typescript
export interface FilterBarProps {
  filters: FilterOptions;
  sort: SortOption;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}
```
- **A11y Contract**: Filter chip groups use `role="group"` with `aria-label` describing category. Active chips use `aria-pressed="true"`.
- **Interactions**: Clicking an active chip toggles or sets that filter dimension; clicking "Clear All Filters" invokes `onClearFilters`.

---

### `TaskItem`
Individual task presentation with in-place toggle, badges, edit trigger, and delete trigger.

```typescript
export interface TaskItemProps {
  task: TaskWithComputed;
  onToggle: (id: string) => void;
  onEdit: (task: TaskWithComputed) => void;
  onDelete: (id: string) => void;
}
```
- **A11y Contract**:
  - Checkbox: `<input type="checkbox" checked={task.status === 'completed'} aria-label={...} />`
  - Priority badge: `<span aria-label="Priority: High" role="status">🔴 High</span>`
  - Overdue badge: `<span aria-label="Overdue task warning" role="alert">⚠️ Overdue</span>`
  - Action buttons: `aria-label="Edit task: {title}"`, `aria-label="Delete task: {title}"`
- **Visual Feedback**:
  - Completed: Line-through text animation (`line-through text-gray-400 dark:text-zinc-500 opacity-75`).
  - Overdue: High-contrast red badge (`bg-red-100 text-red-700 border-red-300 dark:bg-red-950/80 dark:text-red-300`).

---

### `TaskList`
Container displaying filtered & sorted tasks, handling empty states.

```typescript
export interface TaskListProps {
  tasks: TaskWithComputed[];
  onToggle: (id: string) => void;
  onEdit: (task: TaskWithComputed) => void;
  onDelete: (id: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}
```
- **Empty State Contract**:
  - If tasks length is 0 and `hasActiveFilters === true`: Displays `"No tasks found matching your filters."` with a primary button `"Clear All Filters"`.
  - If tasks length is 0 and no filters active: Displays `"No tasks yet. Create one above to get started!"`.

---

### `EditTaskModal`
Accessible dialog for modifying task title, priority, due date, and due time.

```typescript
export interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onSave: (id: string, updates: EditTaskInput) => void;
  onClose: () => void;
}
```
- **A11y Contract**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="edit-modal-title"`. Focus trapped inside modal; `Escape` closes modal; focus returned to calling element on close.

---

### `DeleteConfirmModal`
Accessible dialog to confirm task deletion before proceeding.

```typescript
export interface DeleteConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```
- **A11y Contract**: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby="delete-dialog-title"`, `aria-describedby="delete-dialog-desc"`. Cancel button is initial focused element to prevent accidental confirmation.

---

### `Toast / UndoSnackbar`
Transient notification informing the user of task deletion with a 5-second countdown & "Undo" action.

```typescript
export interface ToastNotification {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}
```
- **A11y Contract**: `role="status"`, `aria-live="polite"`.

---

## 2. Global Keyboard Shortcuts Contract

| Key Combination | Scope | Action |
|---|---|---|
| `/` | Global (outside inputs) | Focuses Search input and selects all query text |
| `N` | Global (outside inputs) | Focuses QuickAdd task title input |
| `Escape` | Global | 1. Closes open modal (Edit/Delete/Backup)<br/>2. If search input is focused: clears query and blurs |
| `Tab` / `Shift+Tab` | Interactive elements | Predictable visual focus outline (`ring-2 ring-blue-500`) |
| `Enter` | QuickAdd Input / Modal Save | Submits task creation or saves task edits |
| `Space` | Checkboxes / Filter chips | Toggles checkbox state or activates filter chip |
