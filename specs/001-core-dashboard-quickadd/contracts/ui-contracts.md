# UI Component & State Store Contracts

**Feature**: Core Dashboard & Quick Task Capture (`001-core-dashboard-quickadd`)  
**Contract Version**: 1.0.0  

---

## 1. Task Store Context Contract (`TaskContextType`)

```typescript
export interface TaskContextType {
  tasks: TaskWithComputed[];
  metrics: DashboardMetrics;
  todayTasks: TaskWithComputed[];
  settings: UserSettings;
  
  // Actions
  addTask: (input: CreateTaskInput) => Task;
  toggleTask: (id: string) => void;
  setTheme: (theme: ThemeMode) => void;
}
```

---

## 2. Component Interface Contracts

### 2.1 `Header` Component
```typescript
export interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}
```
- **Behavior**:
  - Computes time-based greeting:
    - 05:00–11:59 $\rightarrow$ `"Good morning"`
    - 12:00–17:59 $\rightarrow$ `"Good afternoon"`
    - 18:00–04:59 $\rightarrow$ `"Good evening"`
  - Renders formatted localized date (e.g., `"Wednesday, August 19, 2026"`).
  - Provides accessible theme toggle button with ARIA attributes.

### 2.2 `SummaryCards` Component
```typescript
export interface SummaryCardsProps {
  metrics: DashboardMetrics;
}
```
- **Behavior**:
  - Displays 4 metric cards: **Total**, **Completed**, **Remaining**, **Overdue**.
  - Accessible role and live region attributes for screen readers.

### 2.3 `QuickAdd` Component
```typescript
export interface QuickAddProps {
  onAdd: (input: CreateTaskInput) => void;
}
```
- **Behavior**:
  - Single-line title input (`required`, auto-focused or keyboard accessible with `Enter` submission).
  - Inline interactive chips/selectors:
    - Due Date selector (Quick buttons: `Today`, `Tomorrow`, or custom date picker).
    - Due Time selector (Optional time input).
    - Priority selector chips: `🔴 High`, `🟡 Medium`, `🟢 Low` (Default: `Medium`).
  - Validation: Prevents submission on empty/whitespace title, resets fields after successful submission.

### 2.4 `TodayTasks` Component
```typescript
export interface TodayTasksProps {
  tasks: TaskWithComputed[];
  onToggle: (id: string) => void;
}
```
- **Behavior**:
  - Displays all tasks where `computedStatus === 'today'`.
  - Checkbox toggle with instant visual feedback.
  - Empty state displays `"You're all caught up 🎉"` when list is empty.
