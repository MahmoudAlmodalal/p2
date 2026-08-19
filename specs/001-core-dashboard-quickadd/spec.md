# Feature Specification: Core Dashboard & Quick Task Capture

**Feature Branch**: `001-core-dashboard-quickadd`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "PLAN.md only phase 1 + 2"

## Clarifications

### Session 2026-08-19

- Q: What is the primary interaction mechanism for capturing due date, time, and priority in the Phase 2 Quick Add bar? → A: Single-line title input accompanied by inline quick-selector buttons/chips for Date, Time, and Priority (Option A).
- Q: When a task has a due date assigned without an explicit time, at what cutoff time on that date should it transition to Overdue? → A: End of the due date (23:59:59 local time) (Option A).
- Q: How should initial demo/seed data be introduced on a user's first launch? → A: Automatically preload 3–4 sample tasks when local storage is empty on first launch (Option A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Rapid Task Capture (Priority: P1)

As a busy user, I want to quickly capture a task with a title, optional due date/time, and priority level using minimal keystrokes, so that I can record actionable items without breaking my workflow.

**Why this priority**: Fast task entry is the fundamental value proposition of the product. Without quick, reliable capture, the application cannot serve its primary purpose.

**Independent Test**: Can be tested by entering a task title in the Quick Add bar, selecting priority and due date using the inline selector buttons/chips, submitting, and confirming that the task is immediately stored and visible.

**Acceptance Scenarios**:

1. **Given** the user is on the main dashboard, **When** they type "Submit financial report" into the quick-add field and press Enter, **Then** the task is created with default medium priority and appears immediately in the task records.
2. **Given** the user is entering a task, **When** they click or tab to the inline priority chips to select "High" and pick a due date of today, **Then** the task is saved with high-priority visual labeling and appears in Today's focus list.
3. **Given** the user attempts to submit an empty input, **Then** the system prevents submission and indicates that a task title is required.

---

### User Story 2 - Real-Time Dashboard Summary & Focus (Priority: P2)

As a user opening the application, I want to immediately see my task workload summary (Total, Completed, Remaining, Overdue) and today's schedule, so that I understand what requires my immediate attention.

**Why this priority**: Provides instant orientation and answers "What should I do next?" within seconds of opening the application.

**Independent Test**: Can be tested by loading the dashboard with existing tasks across different states and verifying that all 4 summary metrics accurately reflect the counts, and tasks due today are listed in the focus section.

**Acceptance Scenarios**:

1. **Given** tasks exist with various due dates and completion statuses, **When** the user loads the dashboard, **Then** the summary cards display accurate counts for Total, Completed, Remaining, and Overdue tasks.
2. **Given** a task has a due date in the past (or earlier today before 23:59:59 if time was specified) and is not completed, **When** the dashboard renders, **Then** the task is marked with an overdue indicator and the Overdue metric card reflects it.
3. **Given** no tasks are scheduled for today, **When** the user views the Today section, **Then** a friendly empty state message ("You're all caught up 🎉") is displayed.

---

### User Story 3 - Today's Task Completion & Reactive Metrics (Priority: P3)

As a user reviewing today's focus, I want to mark tasks as completed directly from the dashboard and observe immediate metric updates, so that I get quick positive feedback on my progress.

**Why this priority**: Completing tasks and seeing progress reinforces user momentum and keeps task counts accurate in real time.

**Independent Test**: Can be tested by clicking the completion toggle on a task due today and verifying that the item transitions to completed, Remaining decreases, and Completed increases instantly.

**Acceptance Scenarios**:

1. **Given** an uncompleted task in the Today list, **When** the user clicks the completion toggle, **Then** the task visually indicates completion, the Completed count increments by 1, and the Remaining count decrements by 1.
2. **Given** a completed task, **When** the user unchecks the completion toggle, **Then** the task returns to active state and the metrics adjust accordingly.

---

### User Story 4 - Personalized Header & Theme Preference (Priority: P4)

As a user, I want a clean header with a contextual time-based greeting, localized date, and theme toggle (Dark/Light mode) that remembers my preference, so that the app adapts comfortably to my environment.

**Why this priority**: Enhances visual comfort and provides a polished, pleasant daily experience.

**Independent Test**: Can be tested by switching between light and dark themes, reloading the browser, and confirming the theme persists, while checking that the greeting matches the current time of day.

**Acceptance Scenarios**:

1. **Given** the current local time is 9:00 AM, **When** the user visits the dashboard, **Then** the header displays "Good morning" alongside the formatted current date.
2. **Given** the application is in light mode, **When** the user clicks the theme toggle, **Then** the application switches to dark mode and stores this preference across reloads.

---

### Edge Cases

- **Task without due date**: The task is saved into the general inbox/backlog without triggering overdue status or appearing in the Today section.
- **Due date without specific time**: The task remains active throughout the entire calendar day and is evaluated as `Overdue` only after 23:59:59 local time of that date.
- **Due date/time in the past during creation**: The system allows creation but immediately computes the status as Overdue and displays a subtle warning badge.
- **Duplicate task titles**: The system accepts duplicate titles while assigning distinct internal identifiers, optionally showing a non-blocking notification.
- **First-time launch on fresh storage**: System automatically populates 3–4 realistic sample tasks so the user can immediately experience dashboard metrics.
- **Timezone shifts or midnight rollover**: When the date changes while the app remains open, computed statuses (Today, Overdue) dynamically re-evaluate without requiring a manual page refresh.
- **Storage quota or offline access**: The application operates fully without network access and persists all data locally.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a single-line Quick Add input bar on the dashboard for rapid task entry requiring only a task title to submit.
- **FR-002**: System MUST provide inline quick-selector buttons/chips directly alongside the Quick Add input to allow optional selection of Due Date, Due Time, and Priority before submission.
- **FR-003**: System MUST support three distinct priority levels: High (🔴), Medium (🟡), and Low (🟢), each equipped with explicit text labels for accessibility.
- **FR-004**: System MUST maintain core task lifecycle states (`Inbox`, `To Do`, `Completed`) with dynamic computed statuses (`Overdue`, `Today`, `Upcoming`).
- **FR-005**: System MUST automatically evaluate and flag active tasks as `Overdue` whenever their specified due timestamp (or 23:59:59 local time for date-only tasks) is earlier than the current local time.
- **FR-006**: System MUST automatically evaluate and classify active tasks as `Today` whenever their due date falls on the current calendar day in the user's local timezone.
- **FR-007**: System MUST display a real-time summary dashboard featuring four distinct metric counters: Total Tasks, Completed Tasks, Remaining Tasks, and Overdue Tasks.
- **FR-008**: System MUST update all summary metric counters immediately upon task creation, completion state toggle, status change, or deletion.
- **FR-009**: System MUST provide a dedicated "Today's Focus" section displaying tasks due on the current day with instant completion toggles.
- **FR-010**: System MUST render an encouraging empty state message ("You're all caught up 🎉") in the Today section when no active tasks are due today.
- **FR-011**: System MUST display a personalized header featuring a contextual time-of-day greeting (e.g., "Good morning", "Good afternoon", "Good evening") and the localized current date.
- **FR-012**: System MUST provide a theme switcher supporting Light and Dark modes with instant transition.
- **FR-013**: System MUST persist all task records, status states, and user theme preferences locally on the device, ensuring complete functionality offline.
- **FR-014**: System MUST support full keyboard navigation for task entry, enabling users to submit with `Enter` and navigate selectors with `Tab`.
- **FR-015**: System MUST automatically seed 3–4 realistic sample tasks on first launch when local storage is empty to demonstrate active, today, priority, and overdue states.

### Key Entities

- **Task**: Represents an actionable user item. Key attributes include unique identifier, title, optional due date/time, priority level (High/Medium/Low), lifecycle status (Inbox/To Do/Completed), computed status (Today/Overdue/Upcoming), and creation/update timestamps.
- **Dashboard Metrics**: Represents aggregated workload totals (Total, Completed, Remaining, Overdue) calculated dynamically from active and completed tasks.
- **User Settings**: Represents user display preferences including active visual theme (Light or Dark mode).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and save a new task with priority and due date in under 5 seconds.
- **SC-002**: Dashboard summary metrics (Total, Completed, Remaining, Overdue) update within 50 milliseconds following any task creation or completion toggle.
- **SC-003**: 100% of task data and user preferences persist across browser restarts and device reboots without data loss.
- **SC-004**: 100% of priority indicators and interactive controls comply with WCAG 2.1 AA accessibility contrast standards and provide text/ARIA alternatives.
- **SC-005**: All core task capture and dashboard interactions are 100% operable via keyboard alone without requiring mouse interaction.
- **SC-006**: Initial dashboard load and interactive readiness occurs in under 1 second in offline conditions.

## Assumptions

- The application operates in single-user mode using client-side local persistence without mandatory user authentication or cloud accounts.
- Dates and times are displayed according to the user's client system timezone.
- Tasks created without an explicit due date remain in the general backlog and do not count toward Overdue or Today metrics.
- Advanced multi-filter querying, deep full-text search, and batch operations belong to subsequent implementation phases.
