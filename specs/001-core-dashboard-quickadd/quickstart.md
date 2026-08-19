# Quickstart & Feature Validation Guide

**Feature**: Core Dashboard & Quick Task Capture (`001-core-dashboard-quickadd`)  
**Branch**: `001-core-dashboard-quickadd`  

---

## 1. Prerequisites & Environment Setup

Ensure the following runtimes and tools are installed:
- **Node.js**: `v20+` (Detected: `v22.23.1`)
- **npm**: `10+`

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated tests
npm run test

# Run type check and linting
npm run typecheck
npm run lint
```

---

## 2. Validation Scenarios

### Scenario 1: First Launch & Demo Data Seeding
1. Open the application in a fresh browser session (or clear `localStorage`).
2. **Expected Outcome**:
   - Header displays contextual greeting (e.g., "Good afternoon") and today's date.
   - Summary cards display non-zero counts (seeded tasks loaded).
   - "Today's Focus" list displays today's sample tasks.
   - Overdue count reflects any overdue demo task.

### Scenario 2: Quick Task Creation with Priority and Due Date (P1)
1. In the Quick Add input bar, type `"Prepare presentation deck"`.
2. Click the `High` priority chip (🔴) and click the `Today` date chip.
3. Press `Enter` (or click `Add Task`).
4. **Expected Outcome**:
   - The task is immediately added to the task list and appears in "Today's Focus".
   - Total Tasks and Remaining counters increment by 1 in <50ms.
   - The input field resets, ready for the next task.

### Scenario 3: Task Completion & Live Metrics Update (P2 & P3)
1. In "Today's Focus", click the completion checkbox next to `"Prepare presentation deck"`.
2. **Expected Outcome**:
   - The checkbox toggles to checked with strikethrough/visual completion indicator.
   - Completed Tasks increments by 1.
   - Remaining Tasks decrements by 1.
   - If all today's tasks are completed, the empty state displays `"You're all caught up 🎉"`.

### Scenario 4: Theme Preference Persistence (P4)
1. Click the theme toggle button in the header (switch from Light to Dark mode).
2. Reload the page (`F5` or `Ctrl+R`).
3. **Expected Outcome**:
   - The application immediately renders in Dark mode without flickering.
   - User preference in `localStorage` persists.

### Scenario 5: Offline Operation & Keyboard Navigation
1. Disconnect network / toggle browser DevTools Offline mode.
2. Navigate using keyboard (`Tab`, `Space`, `Enter`):
   - Focus the quick-add input, type a task name, `Tab` to priority chips, select with `Space`/`Enter`, submit with `Enter`.
3. **Expected Outcome**:
   - Task captures and saves completely offline without errors.
