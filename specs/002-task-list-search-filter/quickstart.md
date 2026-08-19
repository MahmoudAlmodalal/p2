# Quickstart & Verification Guide: Task List, Search, Filters & Resilience

**Feature Branch**: `002-task-list-search-filter`  
**Date**: 2026-08-19  

---

## 1. Prerequisites & Environment Setup

- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` v9+

### Setup Commands
```bash
# Install dependencies
npm install

# Verify existing test suite passes
npm run test
```

### Starting the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in a modern web browser.

---

## 2. End-to-End Verification Scenarios

### Scenario 1: Search & Multi-Filter Validation
1. **Live Search**:
   - Press `/` anywhere on the page to focus the search bar.
   - Type `"roadmap"` into the search input.
   - **Expected Result**: Only the task titled *"Review project roadmap with team"* is visible in the list.
   - Press `Escape`.
   - **Expected Result**: Search input clears, blurs, and all tasks return to view.
2. **Multi-Criteria Filter**:
   - Click the **"High"** priority filter chip.
   - Click the **"Overdue"** status filter chip.
   - **Expected Result**: Only tasks that have High priority AND are Overdue (e.g. *"Send client proposal draft"*) are displayed.
3. **Reset Filters**:
   - Click **"Clear All Filters"**.
   - **Expected Result**: All filter chips reset to "All", search query is cleared, and all tasks reappear.

---

### Scenario 2: Task Editing & In-Place Updates
1. Click the **Edit (✏️)** button on any task item.
2. Modify the title to `"Updated task title"`, change priority to **"High"**, and set due date to **"Today"**.
3. Click **"Save Changes"** (or press `Enter`).
4. **Expected Result**:
   - The modal closes immediately.
   - The task list and Today focus section show the updated title and 🔴 High badge.
   - Summary cards reflect the new priority/date distributions immediately without page reload.

---

### Scenario 3: Safe Deletion & 5-Second Undo Grace Period
1. Click the **Delete (🗑️)** button on a task.
2. **Expected Result**: A confirmation dialog opens asking to confirm permanent deletion.
3. Click **"Cancel"** (or press `Escape`).
4. **Expected Result**: Modal closes and task remains intact.
5. Click **Delete (🗑️)** again and click **"Delete Task"**.
6. **Expected Result**:
   - Task disappears from the list immediately.
   - Total and remaining metric counts decrement.
   - An Undo snackbar appears at the bottom with a 5-second countdown timer.
7. Click **"Undo"** before the 5-second timer expires.
8. **Expected Result**: The deleted task is restored to its exact previous state and position; metric counts increment back.

---

### Scenario 4: Global Keyboard Navigation (WCAG 2.1 AA)
1. Press `N` anywhere on the page outside of an input.
   - **Expected Result**: Focus jumps directly to the task creation input in QuickAdd.
2. Press `Tab` and `Shift+Tab` across interactive elements.
   - **Expected Result**: A distinct high-contrast blue focus ring (`ring-2 ring-blue-500`) highlights each active button, chip, and input.
3. Press `/` -> **Expected Result**: Search bar receives focus and text is highlighted.
4. Press `Escape` -> **Expected Result**: Search bar clears and blurs.

---

### Scenario 5: Data Backup Export & Schema-Validated Import
1. Click **"Backup & Data"** (or Settings icon in header).
2. Click **"Export Backup (JSON)"**.
   - **Expected Result**: A file named `quick-tasks-backup-YYYY-MM-DD.json` downloads containing all current tasks and settings.
3. Delete all tasks or reset demo data.
4. Click **"Import Backup"** and select the downloaded `.json` file.
   - **Expected Result**: The system validates schema, restores all tasks, and shows a success toast: `"Imported X tasks successfully"`.
5. Upload an invalid/corrupted file (e.g. plain text or malformed JSON).
   - **Expected Result**: System rejects the import with an error message `"Invalid backup file format"` without corrupting or deleting current tasks.

---

## 3. Automated Test Execution

Run the complete test suite:
```bash
npm run test
```

Run test suite in watch mode:
```bash
npm run test:watch
```

Verify TypeScript types and build integrity:
```bash
npm run typecheck
npm run build
```
