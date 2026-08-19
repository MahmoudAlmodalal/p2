# Storage & Repository Contract

**Feature**: Core Dashboard & Quick Task Capture (`001-core-dashboard-quickadd`)  
**Contract Version**: 1.0.0  

---

## 1. Storage Repository Interface (`ITaskRepository`)

Defines the contract for persistent CRUD operations, seeding, and preference management.

```typescript
export interface CreateTaskInput {
  title: string;
  priority?: Priority;       // Default: 'medium'
  dueDate?: string | null;   // Format: YYYY-MM-DD
  dueTime?: string | null;   // Format: HH:mm
}

export interface ITaskRepository {
  /**
   * Loads all tasks from persistent storage.
   * Auto-seeds sample data on first launch if storage is empty.
   */
  getTasks(): Task[];

  /**
   * Saves a new task into persistent storage.
   * Throws Error if validation fails.
   */
  createTask(input: CreateTaskInput): Task;

  /**
   * Toggles completion status of an existing task.
   * Returns updated task or null if not found.
   */
  toggleTaskCompletion(id: string): Task | null;

  /**
   * Loads user settings from storage.
   */
  getSettings(): UserSettings;

  /**
   * Updates user settings in storage.
   */
  updateSettings(settings: Partial<UserSettings>): UserSettings;

  /**
   * Seeds demo tasks into storage.
   */
  seedDemoData(): Task[];
}
```

---

## 2. Storage Key & Serialization Format

- **LocalStorage Key**: `quick_tasks_data_v1`
- **Schema Payload**:
  ```json
  {
    "version": 1,
    "tasks": [
      {
        "id": "uuid-1",
        "title": "Prepare quarterly review slides",
        "priority": "high",
        "dueDate": "2026-08-19",
        "dueTime": "14:00",
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

## 3. Seed Data Specification (First Launch)

When storage key is absent, the repository preloads:
1. **Task 1 (Today / High Priority)**:
   - Title: `Review project roadmap with team`
   - Priority: `high`
   - Due Date: Current day
   - Status: `todo`
2. **Task 2 (Today / Medium Priority)**:
   - Title: `Submit weekly status update`
   - Priority: `medium`
   - Due Date: Current day
   - Status: `todo`
3. **Task 3 (Overdue / High Priority)**:
   - Title: `Send client proposal draft`
   - Priority: `high`
   - Due Date: Yesterday
   - Status: `todo`
4. **Task 4 (Inbox / Low Priority)**:
   - Title: `Explore new icon libraries`
   - Priority: `low`
   - Due Date: `null`
   - Status: `inbox`
