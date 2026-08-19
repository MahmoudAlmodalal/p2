# Technical Research & Architecture Decisions

**Feature**: Core Dashboard & Quick Task Capture (`001-core-dashboard-quickadd`)  
**Date**: 2026-08-19  
**Status**: Completed  

---

## 1. Application Framework & Build Tooling

- **Decision**: React 18+ with TypeScript and Vite.
- **Rationale**: 
  - Vite provides sub-second startup, fast HMR, and optimized static asset bundling without complex configuration.
  - React 18 provides declarative, fine-grained component rendering necessary for reactive metrics (<50ms updates).
  - TypeScript ensures strict type safety across domain entities, priority unions, and storage contracts.
- **Alternatives Considered**:
  - *Next.js / Remix*: Rejected because server-side rendering is unnecessary for an offline-first single-user application and introduces server runtime complexity.
  - *Vanilla TypeScript*: Rejected because managing manual DOM re-rendering across dashboard metric cards, focus lists, and inline quick selectors increases boilerplate and potential synchronization bugs.

---

## 2. State Management Architecture

- **Decision**: React Context + `useReducer` with a dedicated Storage Repository subscriber pattern.
- **Rationale**:
  - Aligns with Constitution Principle I (Simplicity & Code Quality) by utilizing native React primitives without additional third-party state libraries.
  - Predictable unidirectional data flow via typed actions (`ADD_TASK`, `TOGGLE_TASK`, `UPDATE_THEME`, `SEED_SAMPLE_DATA`).
  - Automatic synchronous state derivation for summary metric counters (Total, Completed, Remaining, Overdue) guarantees SC-002 (<50ms reactive updates).
- **Alternatives Considered**:
  - *Redux Toolkit*: Rejected due to excessive boilerplate and unnecessary complexity for single-user local state.
  - *Zustand*: Considered viable, but native React Context provides equivalent ergonomics with zero external dependencies.

---

## 3. Styling, Design System & Accessibility (WCAG 2.1 AA)

- **Decision**: Tailwind CSS with CSS variables for Light/Dark themes and semantic HTML.
- **Rationale**:
  - Zero runtime styling overhead ensures high performance and instant theme switching (SC-006).
  - Native support for WCAG 2.1 AA focus rings, high-contrast priority indicators (🔴 High / 🟡 Medium / 🟢 Low with accompanying text labels), and accessible touch/click targets.
  - Lucide-React icons for lightweight, accessible visual affordances.
- **Alternatives Considered**:
  - *Component Libraries (MUI / Chakra UI)*: Rejected due to heavy bundle weight and runtime CSS-in-JS overhead.
  - *Raw CSS Modules*: Rejected because maintaining responsive layouts, dark mode variants, and design token consistency requires significantly more custom CSS code.

---

## 4. Date & Timezone Handling Strategy

- **Decision**: Native JavaScript `Date` and `Intl.DateTimeFormat` encapsulated in `src/utils/date.ts`.
- **Rationale**:
  - Zero external bundle weight.
  - Native `Intl` handles localized date headers, contextual greetings ("Good morning", "Good afternoon", "Good evening"), and timezone offsets reliably.
  - Specific business rule enforcement:
    - Date-only tasks expire at 23:59:59 local time on the given date before transitioning to `Overdue`.
    - Date+Time tasks transition to `Overdue` when `dueTimestamp < now`.
    - Real-time periodic checks (e.g., interval ticker) ensure status transitions without manual page reloads.
- **Alternatives Considered**:
  - *date-fns / dayjs*: Useful if complex calendar math were required, but native methods fully satisfy all requirements for Phase 1 & 2.

---

## 5. Storage Layer & First-Launch Seeding

- **Decision**: `LocalStorageTaskRepository` implementing an `ITaskRepository` interface with JSON schema validation and seed defaults.
- **Rationale**:
  - Synchronous read/write operations provide instant responsiveness and 100% offline resilience (FR-013).
  - Clean separation between storage logic and UI components allows seamless future extension (e.g., IndexedDB or cloud sync if needed in later phases).
  - First-launch detection: if `localStorage` key is missing, automatically hydrate with 3–4 realistic sample tasks (covering active, today, priority, and overdue states per FR-015).
- **Alternatives Considered**:
  - *IndexedDB*: Asynchronous overhead and complex transaction semantics are unnecessary for typical single-user task volumes (<10,000 tasks).
  - *Direct unrestricted localStorage calls in components*: Rejected due to lack of error handling, type validation, and testability.
