# Implementation Plan: Interactive Task List, Search, Filters & Resilience

**Branch**: `002-task-list-search-filter` | **Date**: 2026-08-19 | **Spec**: [specs/002-task-list-search-filter/spec.md](file:///home/mahmoud/Desktop/p2/specs/002-task-list-search-filter/spec.md)

**Input**: Feature specification from `/specs/002-task-list-search-filter/spec.md`

## Summary

Deliver full task lifecycle management, real-time search, multi-criteria filtering, safe deletion with a 5-second undo grace period, global keyboard navigation, and schema-validated JSON backup/restore. The architecture extends the existing React Context and LocalStorage repository with zero additional dependencies, maintaining offline-first operation and WCAG 2.1 AA compliance.

## Technical Context

**Language/Version**: TypeScript 5.5.3, React 18.3.1  
**Primary Dependencies**: React 18.3.1, Tailwind CSS 3.4.10, Lucide React 1.16.0, Vite 5.4.1  
**Storage**: Client-side LocalStorage (`quick_tasks_data_v1`) via `LocalStorageTaskRepository` with in-memory fallback  
**Testing**: Vitest 2.0.5, @testing-library/react 16.0.0, @testing-library/user-event 14.5.2, jsdom 24.1.1  
**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge), 100% offline-capable client-side SPA  
**Project Type**: Single-page web application (React SPA)  
**Performance Goals**:
- Real-time search and multi-criteria filtering response < 50ms for 1,000 tasks
- Task completion toggle and delete UI state update < 16ms (60fps)
- JSON backup export and schema-validated import < 1s for 5,000 tasks  
**Constraints**: 100% offline operation, zero external server dependencies, WCAG 2.1 AA accessibility (keyboard navigation, visible focus rings, color-independent badges), safe deletion undo window (5s)  
**Scale/Scope**: Single user, up to 5,000 tasks in LocalStorage

## Constitution Check

*GATE: Passed before Phase 0 research. Re-evaluated and confirmed post-Phase 1 design.*

- **Code Quality & Simplicity**: Reuses existing `ITaskRepository` and `TaskContext` patterns. Implements native TypeScript predicate filtering, type guards, and keyboard event handlers without adding heavy external dependencies (e.g. no Fuse.js, no Zod, no Mousetrap).
- **Test Evidence**: Automated test strategy covers repository CRUD, deletion undo restoration, search/multi-filter matrix combinations, keyboard shortcuts, modal accessibility, and JSON schema import validation/recovery.
- **Consistent UX**: Matches existing Tailwind design tokens, priority badge color semantics (🔴 High, 🟡 Medium, 🟢 Low), accessible focus rings (`ring-2 ring-blue-500`), and transient toast notifications.
- **Measurable Performance**: Explicit performance targets established (<50ms filter response, <16ms UI updates, <1s backup operations) with in-memory memoized pipelines.

## Project Structure

### Documentation (this feature)

```text
specs/002-task-list-search-filter/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output (Technical decisions & architectural choices)
├── data-model.md        # Phase 1 output (Entities, validation rules, state transitions)
├── quickstart.md        # Phase 1 output (Runnable verification scenarios & test guide)
├── contracts/           # Phase 1 output (Storage repository & UI component contracts)
│   ├── storage-contract.md
│   └── ui-contracts.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository layout)

```text
src/
├── components/
│   ├── Header.tsx              # Application header with theme & backup triggers
│   ├── SummaryCards.tsx        # Dashboard metric summary cards
│   ├── QuickAdd.tsx            # Task capture input bar with shortcuts
│   ├── TodayTasks.tsx          # Today's focus task section
│   ├── SearchBar.tsx           # Real-time search input with shortcut indicator
│   ├── FilterBar.tsx           # Multi-dimensional filter chips and sort controls
│   ├── TaskList.tsx            # Filtered task list container with empty states
│   ├── TaskItem.tsx            # Individual task row with badge, edit, delete, toggle
│   ├── EditTaskModal.tsx       # Accessible modal for editing task details
│   ├── DeleteConfirmModal.tsx  # Accessible modal for delete confirmation
│   ├── BackupModal.tsx         # Modal for exporting and importing JSON backups
│   └── Toast.tsx               # Transient snackbar notification with Undo action
├── context/
│   └── TaskContext.tsx         # Global state store (tasks, filters, search, undo, metrics)
├── hooks/
│   └── useKeyboardShortcuts.ts # Global keyboard shortcut listener (/ , N, Escape)
├── repository/
│   ├── TaskRepository.ts       # ITaskRepository interface & seed generators
│   └── LocalStorageTaskRepository.ts # LocalStorage CRUD, export & schema-validated import
├── types/
│   ├── task.ts                 # Domain models, filter types, backup payload types
│   └── theme.ts                # Theme & settings types
├── utils/
│   ├── date.ts                 # Localized date formatting, greeting & status formulas
│   └── validation.ts           # Schema validation type guard for JSON backup payloads
├── App.tsx                     # Main layout composing header, metrics, quick-add, filters, list
├── index.css                   # Global styles & Tailwind directives
└── main.tsx                    # React DOM root mounting

tests/
├── integration/
│   ├── DashboardMetrics.test.tsx # Metrics calculation & Today view tests
│   ├── QuickAdd.test.tsx         # QuickAdd input & shortcut submission tests
│   ├── TaskCompletion.test.tsx   # Completion toggle tests
│   ├── TaskListManagement.test.tsx # Task list editing, deletion & undo integration tests
│   ├── SearchAndFilter.test.tsx  # Multi-criteria filtering & real-time search tests
│   ├── KeyboardNavigation.test.tsx # Global shortcut & modal focus trapping tests
│   ├── BackupRestore.test.tsx    # JSON export, schema validation & merge tests
│   └── ThemeToggle.test.tsx      # Dark/light theme persistence tests
├── unit/
│   ├── date.test.ts              # Relative date & status derivation unit tests
│   ├── repository.test.ts        # Storage repository CRUD & error handling unit tests
│   └── validation.test.ts        # Backup payload validation type guard tests
└── setup.ts                    # Vitest environment setup
```

**Structure Decision**: Standard React + TypeScript single-project layout extending existing repository and component hierarchy with cohesive, dedicated UI components and domain utilities.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | All features utilize standard React hooks (`useMemo`, `useCallback`, `useContext`) and native browser APIs (LocalStorage, Blob URL) without added framework complexity. | N/A |
