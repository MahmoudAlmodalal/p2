# Phase 0: Research & Technical Decisions

**Feature**: Interactive Task List, Search, Filters & Resilience  
**Branch**: `002-task-list-search-filter`  
**Date**: 2026-08-19  

---

## 1. Search, Multi-Filter & Sort Pipeline

### Context & Problem
The application must support real-time as-you-type search across task titles combined with multiple independent filter dimensions (Status: `All` | `Inbox` | `To Do` | `Completed` | `Overdue`, Priority: `High` | `Medium` | `Low`, Date Range: `Today` | `This Week` | `Overdue`) and multiple sort orders (Due Date, Priority, Title, Creation Date). The search and filter operations must execute in under 50ms for up to 1,000 tasks on client devices without UI lag.

### Decision
- Implement a pure in-memory, memoized filtering and sorting pipeline using React's `useMemo`.
- Query matching: Case-insensitive substring inclusion (`t.title.toLowerCase().includes(query.trim().toLowerCase())`).
- Multi-criteria filter predicates:
  - **Status Filter**:
    - `All`: No status filtering.
    - `Inbox`: `t.status === 'inbox'`.
    - `To Do`: `t.status === 'todo'`.
    - `Completed`: `t.status === 'completed'`.
    - `Overdue`: `t.computedStatus === 'overdue'`.
  - **Priority Filter**: Matches exact priority (`'high'`, `'medium'`, `'low'`) if set, or all priorities if `'all'`.
  - **Date Filter**:
    - `All`: No date filtering.
    - `Today`: `t.dueDate === todayStr`.
    - `This Week`: `t.dueDate >= todayStr && t.dueDate <= endOfWeekStr`.
    - `Overdue`: `t.computedStatus === 'overdue'`.
- Sort comparator: Deterministic sorting functions for `dueDate` (nulls last), `priority` (High > Medium > Low), `title` (localeCompare), and `createdAt` (descending/ascending).

### Rationale
- For client-side dataset sizes between 100 and 5,000 tasks, linear scanning with primitive predicate checks in JavaScript executes in less than 2 milliseconds (well below the 50ms budget).
- Avoiding third-party search libraries (such as Fuse.js or Lunr) keeps bundle size minimal (0 extra KB), avoids indexing overhead on every task edit, and eliminates dependency vulnerabilities.

### Alternatives Considered
- **Web Worker for Filtering**: Offloading filter computation to a web worker. Rejected because message serialization overhead (>5ms) exceeds the direct in-memory array filter cost (<2ms) for <5,000 items.
- **External Full-Text Search Library (Fuse.js)**: Fuzzy searching. Rejected because PRD and spec specify exact substring matching on titles, and fuzzy search introduces ranking unpredictability and bundle bloat.

---

## 2. Safe Deletion & 5-Second Undo Grace Period

### Context & Problem
Deleting a task must require user confirmation or provide a non-destructive undo mechanism. Spec FR-006 & FR-007 require both a confirmation step before removal and a transient 5-second "Undo" snackbar/toast to restore the deleted task and its metrics immediately.

### Decision
- Two-step deletion flow:
  1. **Confirmation Dialog**: Clicking the delete button opens a lightweight accessible modal (`<DeleteConfirmModal />`) asking the user to confirm deletion.
  2. **Undo Snackbar & Repository Snapshot**: When confirmed, the task is removed from the active repository list, and an `UndoRecord` snapshot (containing the full task object and its index/timestamp) is posted to the global notification toast store with a 5000ms timer.
  3. If the user clicks "Undo" before the timer elapses, the repository invokes `restoreTask(snapshot)` which re-inserts the task and updates state.
  4. If the timer elapses or the user dismisses the toast, the undo record is cleared.

### Rationale
- Balances immediate UI responsiveness with zero accidental data loss.
- Removing the item immediately from the active list gives the user immediate visual confirmation of the deletion while the transient toast provides an effortless single-click rollback path.

### Alternatives Considered
- **Soft Deletion with Delayed Purge (Tombstoning)**: Marking task `isDeleted: true` and only permanently removing it after 5 seconds. Rejected because persisting tombstones complicates filter logic, metrics calculations, and LocalStorage sync needlessly. An in-memory snapshot with `restoreTask` is simpler and completely self-contained.
- **Direct delete without confirmation**: Relying purely on the Undo toast. Rejected because FR-006 explicitly requires a confirmation step to prevent accidental triggers on mobile/touch interfaces.

---

## 3. Data Backup, Export & Schema-Validated Import

### Context & Problem
FR-016 and FR-017 require exporting all tasks and user preferences as a structured JSON file and importing previously exported JSON files, validating schemas, handling corruption gracefully, and merging/restoring data safely.

### Decision
- **Export Format**: Standard JSON payload conforming to `BackupPayload`:
  ```json
  {
    "version": 1,
    "exportedAt": "2026-08-19T15:00:00.000Z",
    "tasks": [...],
    "settings": { "theme": "light" }
  }
  ```
- **File Download Mechanism**: Native browser Blob URL (`URL.createObjectURL(new Blob([json], { type: 'application/json' }))`) triggered via a virtual anchor link `quick-tasks-backup-YYYY-MM-DD.json`.
- **Import Validation**:
  - Runtime TypeScript type-guard validator function `validateBackupPayload(data: unknown): data is BackupPayload`.
  - Validates `version === 1`, `tasks` is an array of valid `Task` objects (validating non-empty `id`, valid `title`, valid `priority` enum, valid ISO dates), and valid `settings`.
  - Merging strategy: Upserts tasks by `id`. If an existing task has the same `id`, updates it if the incoming `updatedAt` is greater or equal; otherwise appends new tasks.
  - Error handling: Returns descriptive validation error strings without mutating current storage if the JSON is malformed or invalid.

### Rationale
- Native Blob downloads and JSON parsing require zero external dependencies.
- Strict schema validation prevents corrupted data from breaking LocalStorage and causing application boot failure.

### Alternatives Considered
- **Zod / Yup Schema Validation**: Adding Zod library. Rejected to comply with Principle I (Simplicity & avoiding unnecessary dependencies); a custom 40-line type guard function is lightweight, zero-dependency, and handles all schema validation edge cases.

---

## 4. Keyboard Navigation & Accessibility (WCAG 2.1 AA)

### Context & Problem
FR-013 and FR-014 require global keyboard shortcuts (`/` for search, `N` for new task, `Escape` for dismissal/blur/closing modals), logical tab ordering, visible focus rings, and screen-reader accessibility without relying on color alone.

### Decision
- Implement a centralized `useKeyboardShortcuts` hook in the root application layout:
  - Checks `document.activeElement` to ignore `/` and `N` when the user is actively typing inside an `<input>`, `<textarea>`, or content-editable element.
  - Pressing `/` focuses the search bar input and selects existing text (`input.select()`).
  - Pressing `N` focuses the quick-add title input.
  - Pressing `Escape` closes any open modal dialog (edit modal, delete confirmation modal), or clears and blurs the search input if focused.
- Accessible Badges: Priority badges combine explicit Unicode/SVG symbols with text labels (`High`, `Medium`, `Low`) and `aria-label` attributes. Overdue badges include alert icons with `aria-label="Overdue task"`.
- Focus Trapping: Modals implement focus traps using `tab` cycle management and return focus to the trigger button on modal close.

### Rationale
- Meets WCAG 2.1 AA requirements (Guideline 2.1 Keyboard Accessible, Guideline 1.4.1 Use of Color).
- Standard keyboard bindings match popular productivity tools (GitHub, Linear, Slack), providing an intuitive power-user workflow.

### Alternatives Considered
- **Third-party keyboard libraries (Mousetrap, react-hotkeys)**: Rejected because native `keydown` window event listener with simple key matching is <30 lines of code and has zero overhead.

---

## 5. Dynamic Timezone & Midnight Crossing

### Context & Problem
FR-019 requires dynamic recomputation of relative statuses (`Today`, `Overdue`, `Upcoming`) when crossing midnight or upon local timezone changes without requiring page reload.

### Decision
- In `TaskContext`, maintain a reactive `referenceTime` state initialized to `new Date()`.
- Set up a dynamic timer that triggers an update every 60 seconds and computes exact time until the next local midnight to dispatch a tick on midnight boundary.
- Also listen to window `focus` and `visibilitychange` events to immediately update `referenceTime` when the user returns to the tab.

### Rationale
- Lightweight (one single timer), ensures zero stale overdue or today tags while the app is kept open in a background tab.

### Alternatives Considered
- **Polling every 100ms**: Rejected due to unnecessary CPU/battery consumption on mobile devices.
- **Calculating `new Date()` inside every render without state**: Does not trigger a React re-render when the clock ticks over midnight if no user interaction occurs. A state-driven reference date ensures automatic UI re-render.
