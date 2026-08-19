# Implementation Plan: Core Dashboard & Quick Task Capture

**Branch**: `001-core-dashboard-quickadd` | **Date**: 2026-08-19 | **Spec**: [spec.md](file:///home/mahmoud/Desktop/p2/specs/001-core-dashboard-quickadd/spec.md)

**Input**: Feature specification from `/specs/001-core-dashboard-quickadd/spec.md`

## Summary

Build the core foundation for Quick Tasks (Phases 1 & 2): a minimalist, high-performance web application providing rapid task capture via an inline Quick Add bar with priority/due date chips, a real-time reactive dashboard with 4 metric counters (Total, Completed, Remaining, Overdue), a "Today's Focus" list with instant completion toggles, a contextual time-based greeting header with theme toggle (Light/Dark), and an offline-first LocalStorage repository with automatic first-launch seed data.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22.x  

**Primary Dependencies**: React 18+, Vite 5+, Tailwind CSS 3+, Lucide React  

**Storage**: Browser LocalStorage (`LocalStorageTaskRepository` implementing `ITaskRepository` with versioned JSON schema validation)  

**Testing**: Vitest, React Testing Library, @testing-library/jest-dom, jsdom  

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge), 100% offline-capable  

**Project Type**: Single-Page Web Application (SPA / React Frontend)  

**Performance Goals**:
- Task capture and save in <5 seconds (SC-001)
- Reactive dashboard metric updates within 50ms upon task creation/toggle (SC-002)
- Offline initial load and interactive readiness in <1 second (SC-006)

**Constraints**:
- Single-user client-side persistence without external server dependencies (FR-013)
- Strict WCAG 2.1 AA contrast and non-color-exclusive priority labels (🔴 High / 🟡 Medium / 🟢 Low) (FR-003, SC-004)
- 100% keyboard navigable task creation and controls (FR-014, SC-005)

**Scale/Scope**: Phase 1 (Data architecture & persistence) + Phase 2 (Dashboard, Quick Add, Today's Focus, Theme)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Planned architecture leverages native React Context + `useReducer` and standard browser APIs (`Intl`, `Date`, `LocalStorage`), avoiding unnecessary external state libraries and heavy dependencies.
- **Testing**: Test suite covers unit tests for date calculation/status derivation (`src/utils/date.ts`), storage repository contracts (`LocalStorageTaskRepository.ts`), and integration tests for Quick Add, metric recalculation, and theme persistence.
- **UX**: Header greeting, localized date, empty states ("You're all caught up 🎉"), accessible priority tags, and keyboard workflows (`Enter`, `Tab`, `Space`) are fully specified.
- **Performance**: Concrete benchmarks (<50ms metric updates, <1s offline load) are established with zero runtime styling overhead via Tailwind CSS.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-dashboard-quickadd/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── storage-contract.md
│   └── ui-contracts.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Header.tsx              # Contextual greeting, localized date, theme toggle
│   ├── SummaryCards.tsx        # 4 live metric cards (Total, Completed, Remaining, Overdue)
│   ├── QuickAdd.tsx            # Single-line input with inline priority & date chips
│   └── TodayTasks.tsx          # Today's focus section with instant checkboxes & empty state
├── context/
│   └── TaskContext.tsx         # React Context + useReducer for reactive task state
├── repository/
│   ├── TaskRepository.ts       # ITaskRepository interface & seed data definition
│   └── LocalStorageTaskRepository.ts # LocalStorage implementation with schema validation
├── types/
│   ├── task.ts                 # Domain models (Task, Priority, TaskStatus, ComputedStatus)
│   └── theme.ts                # Theme types (light / dark)
├── utils/
│   └── date.ts                 # Intl/Date helpers for status computation & greetings
├── App.tsx                     # Main layout mounting Header, SummaryCards, QuickAdd, TodayTasks
├── main.tsx                    # Entry point mounting TaskProvider & React root
└── index.css                   # Tailwind CSS directives & theme design tokens

tests/
├── unit/
│   ├── date.test.ts            # Unit tests for overdue/today computation & greetings
│   └── repository.test.ts      # Unit tests for LocalStorage persistence & seeding
└── integration/
    ├── QuickAdd.test.tsx       # Integration tests for task creation workflow
    ├── DashboardMetrics.test.tsx # Integration tests for metric count reactivity (<50ms)
    └── ThemeToggle.test.tsx    # Integration tests for theme switching and persistence
```

**Structure Decision**: Single project web application structure (`src/` and `tests/`) optimized for Vite + React + TypeScript with strict separation between data persistence (`repository/`), state management (`context/`), and presentation (`components/`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *None* | Architecture strictly aligns with Constitution Principles (standard React primitives, no redundant dependencies). | N/A |
