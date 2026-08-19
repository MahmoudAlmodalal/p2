# Storage & Repository Contract

**Feature Branch**: `002-task-list-search-filter`  
**Date**: 2026-08-19  

---

## 1. Repository Interface Specification (`ITaskRepository`)

The task repository acts as the offline-first data boundary. All data access, mutation, undo snapshot restoration, and backup operations MUST adhere to this contract.

```typescript
export interface EditTaskInput {
  title?: string;
  priority?: Priority;
  dueDate?: string | null;
  dueTime?: string | null;
}

export interface ITaskRepository {
  /** Retrieves all tasks in order of creation/insertion */
  getTasks(): Task[];

  /** Creates and persists a new task */
  createTask(input: CreateTaskInput): Task;

  /** Updates an existing task by ID */
  updateTask(id: string, input: EditTaskInput): Task;

  /** Removes a task by ID and returns the removed task and its index */
  deleteTask(id: string): { task: Task; index: number } | null;

  /** Restores a previously deleted task at its original index */
  restoreTask(task: Task, targetIndex?: number): Task;

  /** Toggles completion status of a task */
  toggleTaskCompletion(id: string): Task | null;

  /** Retrieves user settings */
  getSettings(): UserSettings;

  /** Updates user settings */
  updateSettings(settings: Partial<UserSettings>): UserSettings;

  /** Resets storage to initial demo dataset */
  seedDemoData(): Task[];

  /** Exports entire database into a versioned JSON string */
  exportBackup(): string;

  /** Validates and imports a JSON backup string with conflict merging */
  importBackup(jsonString: string): { success: boolean; importedCount: number; error?: string };
}
```

---

## 2. LocalStorage Key and Schema

- **Storage Key**: `quick_tasks_data_v1`
- **Schema Version**: `1`

### Schema Structure:
```json
{
  "version": 1,
  "exportedAt": "2026-08-19T15:00:00.000Z",
  "tasks": [
    {
      "id": "7b7a2d48-8ef7-4f65-8b3a-594217112001",
      "title": "Finalize quarterly budget report",
      "priority": "high",
      "dueDate": "2026-08-19",
      "dueTime": "17:00",
      "status": "todo",
      "createdAt": "2026-08-19T08:00:00.000Z",
      "updatedAt": "2026-08-19T08:00:00.000Z"
    }
  ],
  "settings": {
    "theme": "light"
  }
}
```

---

## 3. Import Validation and Conflict Resolution Contract

1. **Validation Pipeline**:
   - Parse JSON string safely. If parsing fails, return `{ success: false, importedCount: 0, error: 'Malformed JSON payload' }`.
   - Verify `version` is a positive number matching supported schema versions (currently `1`).
   - Verify `tasks` is an `Array`.
   - Validate each task record:
     - `id`: Non-empty string.
     - `title`: Non-empty string (trimmed, max 500 chars).
     - `priority`: Value in `['high', 'medium', 'low']`.
     - `status`: Value in `['inbox', 'todo', 'completed']`.
     - `dueDate`: Matches `^\d{4}-\d{2}-\d{2}$` or is `null`.
     - `dueTime`: Matches `^\d{2}:\d{2}$` or is `null`.
     - `createdAt`: Valid ISO date string.
     - `updatedAt`: Valid ISO date string.
2. **Merge Algorithm**:
   - For incoming tasks, create a map of existing tasks by `id`.
   - If incoming task `id` exists in current storage:
     - Keep incoming task if `incoming.updatedAt >= existing.updatedAt`, otherwise retain existing task.
   - If incoming task `id` does not exist:
     - Insert incoming task into task collection.
   - Persist merged tasks array and return `{ success: true, importedCount: validIncomingTasks.length }`.
