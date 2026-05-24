# Story 2.3: Complete Tasks into Completed Section

Status: done

## Story

As a student or employee,
I want to mark a task as completed,
so that finished work leaves my active list but remains available for review.

## Acceptance Criteria

1. Given an active task exists, when the user marks the task as complete, then the task’s `completed` field is set to `true`, and `updatedAt` is refreshed.
2. Given a task has been marked complete, when the task list re-renders, then the task no longer appears in the Active section, and it appears in the Completed section.
3. Given completed tasks exist, when the Completed section renders, then completed tasks are visually secondary but readable, and the section remains below the Active section.
4. Given the app is refreshed or reopened in the same browser, when saved completed tasks are loaded, then completed tasks still appear in the Completed section, and they remain saved unless the user deletes them.
5. Given there are no completed tasks, when the Completed section renders, then it shows the empty state “No completed tasks yet.”, and the empty state does not distract from the Active list.
6. Given a keyboard user navigates task controls, when the complete action receives focus and is activated, then the completion action works by keyboard, and the completed status is communicated without relying only on color or line-through.

## Tasks / Subtasks

- [x] Add completion domain logic and completed selector (AC: 1, 2, 4)
  - [x] Update `src/tasks.js` with `completeTask(tasks, taskId)` or equivalent, returning an updated task array.
  - [x] Set only the matching task’s `completed` field to `true` and refresh only its `updatedAt` timestamp.
  - [x] Preserve `id`, `title`, `important`, and `createdAt` for the completed task.
  - [x] Return the original array or unchanged equivalent when `taskId` is unknown.
  - [x] Add `getCompletedTasks(tasks)` that derives completed tasks from the single task array; do not store a separate completed array.
  - [x] Keep `getActiveTasks(tasks)` deriving only tasks where `completed === false`.
- [x] Render completed tasks dynamically (AC: 2, 3, 5, 6)
  - [x] Extend `src/render.js` with `renderCompletedTasks(tasks)` or a single render orchestration that updates both Active and Completed sections.
  - [x] Use `getCompletedTasks(tasks)` for Completed section data.
  - [x] Render completed task items with DOM-safe text APIs; never use `innerHTML` for task titles.
  - [x] Add completed item semantics/classes such as `task-item task-item--completed` and preserve `data-task-id`.
  - [x] Show completed task status with text such as “Completed” so completion is not communicated by color or line-through alone.
  - [x] Keep completed tasks visually secondary but readable and below Active.
  - [x] Toggle the Completed empty state text “No completed tasks yet.” based on whether completed tasks exist.
- [x] Wire the existing complete action into the app flow (AC: 1, 2, 4, 6)
  - [x] Update `src/main.js` so the existing `data-action="complete"` button marks the selected task complete.
  - [x] After completion, update the runtime `tasks` array, call `saveTasks(tasks)`, and re-render both Active and Completed sections.
  - [x] Clear any active edit UI state if the completed task was being edited or if completion changes make edit state stale.
  - [x] Preserve existing add-task validation, edit mode, valid edit persistence, invalid edit validation, and cancel behavior.
  - [x] Do not implement delete, important toggling, important sorting, or un-complete/reopen behavior in this story.
- [x] Update static markup only where needed for Completed rendering (AC: 2, 3, 5)
  - [x] Add a Completed list container in `index.html`, e.g. `<ul class="task-list" data-completed-list aria-label="Completed tasks"></ul>`.
  - [x] Add a stable marker to the completed empty state, e.g. `data-completed-empty`.
  - [x] Keep the Completed section below the Active section.
  - [x] Do not add navigation, modal flows, filters, counters unless already trivial and useful.
- [x] Add Warm Minimal completed-task styling (AC: 3, 5, 6)
  - [x] Extend `src/styles.css` using the existing design tokens and distinctive font pairing.
  - [x] Use muted text/lower emphasis and optional line-through while maintaining readable contrast.
  - [x] Ensure the completed state uses section placement and visible text/status, not color or line-through alone.
  - [x] Keep touch targets and focus states comfortable at 320–430px mobile widths.
  - [x] Add only subtle interaction animation consistent with existing task item motion and reduced-motion behavior.
- [x] Add focused dependency-free tests (AC: 1, 2, 5, 6)
  - [x] Update `src/tasks.test.js` for `completeTask`: sets `completed`, refreshes `updatedAt`, preserves `createdAt`, leaves non-target tasks unchanged, and handles unknown ids.
  - [x] Add tests for `getCompletedTasks` deriving only completed tasks without mutating state.
  - [x] Update `src/render.test.js` around any completed-task view-model helper introduced, including status text, action availability, and safe title preservation.
  - [x] Keep using Node’s built-in test runner; do not add jsdom, Vitest, React, or other dependencies.
- [x] Verify manually and with scripts (AC: 1-6)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify an active task can be completed by clicking Complete.
  - [x] Verify completed tasks leave Active immediately and appear in Completed immediately.
  - [x] Verify `smiple-todo.tasks` stores the completed task with `completed: true` and refreshed `updatedAt`.
  - [x] Refresh the browser and verify completed tasks still appear in Completed.
  - [x] Verify Active empty state appears if completing the last active task, and Completed empty state hides when completed tasks exist.
  - [x] Verify no completed tasks shows “No completed tasks yet.” on first load or empty completed state.
  - [x] Verify keyboard-only flow can focus and activate Complete with visible focus.
  - [x] Verify completed status is understandable through section placement and text/status, not only color or line-through.
  - [x] Verify HTML-like task titles remain literal text after completion and refresh.
  - [x] Verify existing add valid, add invalid, edit valid, edit invalid, edit cancel, and persisted-load flows are not regressed.
  - [x] Verify mobile widths around 320–430px and desktop width around 1024px+ remain readable without horizontal overflow.

## Dev Notes

### Current Project State

- The current app is a Vite Vanilla JavaScript client-only app using ES modules, plain CSS, and Node’s built-in test runner.
- `src/main.js` currently loads tasks from localStorage, keeps `let tasks = loadTasks();`, renders active tasks on startup, saves after valid add and valid edit, and delegates active-list actions for edit/save/cancel.
- `src/render.js` currently renders only Active tasks with `renderActiveTasks(tasks, editState = {})`; Completed section is static markup in `index.html` and is not data-driven yet.
- `src/tasks.js` currently exports `taskModelFields`, `addTask(title)`, `editTaskTitle(tasks, taskId, title)`, and `getActiveTasks(tasks)`.
- `src/storage.js` already owns `storageKey = "smiple-todo.tasks"`, strict schema validation, safe fallback to `[]`, and full-array JSON persistence.
- `src/validation.js` already owns shared title validation for add/edit. This story does not need new validation logic because completing a task has no title input.
- `src/render.test.js` currently tests pure view-model helpers because Node tests run without a DOM. Follow that pattern for completed rendering contracts.
- `index.html` has the Completed section heading and empty state, but no `data-completed-list` container yet.

### Story Scope Boundaries

This story implements only completing active tasks and rendering persisted completed tasks. It must not implement:

- Deleting active or completed tasks; Story 2.4 owns deletion.
- Important toggling, important sorting, or important styling; Epic 3 owns that.
- Reopening/un-completing a completed task; not required by the MVP stories.
- Completion confirmation dialogs, toast notifications, filters, counters, drag-and-drop, categories, labels, priority levels, routing, or modals.
- Backend, API, database, authentication, cloud sync, analytics, telemetry, service workers, or network task storage.
- Dependency upgrades, forced audit fixes, new test frameworks, generated build output edits, or framework migration.

### Architecture Requirements

- Keep task objects using the approved schema exactly:

```js
{
  id: string,
  title: string,
  completed: boolean,
  important: boolean,
  createdAt: string,
  updatedAt: string
}
```

- Store all tasks as one JSON array under localStorage key `smiple-todo.tasks`.
- Keep the single runtime `tasks` array as the source of truth.
- Follow the existing flow: DOM event → task operation → save full task array → render.
- Derive Active and Completed lists from the task array. Do not persist `activeTasks`, `completedTasks`, or UI-only state.
- Keep task mutations in `src/tasks.js`, persistence in `src/storage.js`, DOM rendering in `src/render.js`, orchestration in `src/main.js`, and visual styling in `src/styles.css`.
- Use camelCase for JavaScript and kebab-case for CSS classes/files.
- Render user-provided task titles with `textContent` or equivalent safe DOM APIs.
- Full re-rendering after completion is acceptable for MVP scale.

### File-Specific Implementation Guidance

- `src/tasks.js`
  - Add `completeTask(tasks, taskId)` beside existing domain operations.
  - Prefer immutable update with `tasks.map(...)`, matching `editTaskTitle` style.
  - Refresh `updatedAt` with a new ISO string only for the matching task.
  - Add `getCompletedTasks(tasks)` as `tasks.filter((task) => task.completed)`.
  - Do not change `addTask`, `editTaskTitle`, or `taskModelFields` except for necessary exports/imports.
- `src/render.js`
  - Keep `renderActiveTasks` behavior for existing Active/edit flows.
  - Add completed rendering without duplicating unsafe title rendering patterns.
  - A helper such as `createCompletedTaskViewModel(task)` is useful for dependency-free tests.
  - Completed items should not expose delete until Story 2.4. Avoid fake or disabled delete controls that imply unsupported behavior.
  - Completed items can have no action buttons in this story unless a minimal structure is needed for consistency.
- `src/main.js`
  - Handle `data-action="complete"` in the existing active-list delegated click listener.
  - Save immediately after completion with `saveTasks(tasks)`.
  - Re-render Active and Completed after completion.
  - Preserve edit/save/cancel action handling exactly; avoid broad rewrites of the event system.
  - If completion is triggered while edit state exists for the same task, clear `editState` before rendering.
- `index.html`
  - Add only stable hooks for dynamic completed rendering: `data-completed-empty` and `data-completed-list`.
  - Keep semantic section heading and Completed placement below Active.
- `src/styles.css`
  - Extend existing `.task-item`, `.task-status`, `.task-list`, and completed-section styles.
  - Use the existing `--color-completed`, `--color-muted-text`, spacing, radius, focus, and animation tokens.

### UX and Accessibility Requirements

- Completing a task must give immediate visible feedback by moving it from Active to Completed.
- The Completed section must remain secondary to Active: below it, muted, readable, and not visually noisy.
- Completed status must be communicated by section placement and visible text/status such as “Completed”; do not rely only on muted color or line-through.
- The existing Complete button is a real button, so keyboard activation should work without custom key handling. Preserve visible focus styles.
- Completed task titles must remain readable and safely rendered.
- The completed empty state must be calm, not error-like, and use exactly “No completed tasks yet.”.
- Mobile layout must keep task content readable and controls tappable without horizontal overflow.
- Keep the Warm Minimal visual direction with elevated execution, CSS custom properties, distinctive font pairing, and subtle micro-animations already present in the project.

### Security and Privacy Requirements

- Treat task titles as user input even after completion or storage reload.
- Never render task titles using raw HTML insertion.
- Verify HTML-like titles such as `<img src=x onerror=alert(1)>` remain literal text after completion and refresh.
- Do not send task data over the network.
- Do not collect personal data.
- Do not add backend, cloud sync, analytics, telemetry, or service worker behavior.

### Previous Story Intelligence

- Story 2.2 implemented immutable `editTaskTitle`, active-row editing state, save/cancel controls, inline edit validation, and persistence for valid edits only.
- Story 2.2 added `CSS.escape` for focus query selectors in `src/main.js`; preserve that safety pattern for any new post-render focus targeting.
- Story 2.2 verified browser behavior with the Vite dev server, including edit persistence, invalid edit validation, cancel, keyboard reachability, HTML-like title safety, and no XHR/fetch storage.
- Story 2.1 implemented `loadTasks()`/`saveTasks(tasks)` and strict localStorage schema validation. Do not recreate storage helpers or introduce new storage keys.
- Story 1.4 established the task action order `complete`, `toggle-important`, `edit`, `delete` and the `data-action`/`data-task-id` pattern. Reuse the existing `complete` action rather than adding another completion entry point.
- Epic 1 retrospective emphasized strict story scope, browser verification for UI acceptance, DOM-safe rendering, and dependency maintenance outside feature stories.

### Git Intelligence Summary

- Recent commits:
  - `6fe5730 feat(story-2.2): edit existing task titles`
  - `b98e46a doc: add epic 1 retrospective`
  - `2234317 feat(story-2.1): persist tasks in browser storage`
  - `69c36c0 feat(story-1.4): render active tasks with controls`
  - `c7f765d doc: update doc`
- The most recent implementation pattern is small module-level changes plus focused Node tests and browser verification.
- Continue the established convention of updating only source/test/story/status files relevant to the current story.

### Testing Requirements

- Automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification is required because this story changes interactive UI, persisted state, and Completed section rendering.
- Minimum manual checks:
  - Complete an active task by mouse and keyboard.
  - Confirm the task leaves Active and appears in Completed immediately.
  - Confirm `completed: true` and refreshed `updatedAt` are saved in `smiple-todo.tasks`.
  - Refresh and confirm completed tasks restore into Completed.
  - Confirm empty states toggle correctly for Active and Completed.
  - Confirm HTML-like task titles are literal text in Completed after refresh.
  - Confirm add and edit flows from previous stories still work.
  - Confirm mobile and desktop layouts remain usable.

## Project Structure Notes

- Keep all application code under `src/` and static app markup in `index.html`.
- Do not create `components/`, `services/`, `api/`, `pages/`, `routes/`, or framework-style folders.
- Do not edit `node_modules/`, `dist/`, or generated build output.
- Do not add dependencies or change package manager/tooling for this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L357-L394) — Story 2.3 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L28-L31) — FR-11 to FR-14 completion requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L83-L89) — task completion functional requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L128-L140) — success metric and counter-metric for completed task visibility.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L211-L249) — task schema, persistence, and validation strategy.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L285-L320) — frontend state-driven rendering and completed section pattern.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L493-L529) — data-action, data-task-id, and single runtime state rules.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L712-L720) — task completion module mapping.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L432-L454) — complete and review user journey.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L529-L537) — Completed Section component requirements.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L664-L670) — completed and important styling constraints.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L739) — responsive and accessibility testing requirements.
- [_bmad-output/implementation-artifacts/2-2-edit-existing-task-titles.md](2-2-edit-existing-task-titles.md) — previous story implementation notes and established edit patterns.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` red: missing `completeTask` and `getCompletedTasks` exports before domain implementation.
- `npm test` green: 19 tests passing after completion domain and selector implementation.
- `npm test` red: missing `createCompletedTaskViewModel` export before completed rendering implementation.
- `npm test` green: 20 tests passing after completed view model and rendering implementation.
- `npm run build` green: Vite production build completed successfully.
- Final `npm test` green: 20 tests passing.
- Final `npm run build` green: Vite production build completed successfully.
- Browser verification: Vite dev server at `http://127.0.0.1:5173/` verified click completion, refresh persistence, localStorage `completed: true` and refreshed `updatedAt`, active/completed empty state toggles, HTML-like title text safety, keyboard activation, no XHR/fetch task storage, and mobile-width layout without horizontal overflow.

### Completion Notes List

- Added immutable task completion through `completeTask`, preserving the approved task schema and refreshing only `updatedAt` for the completed task.
- Added `getCompletedTasks` and dynamic Completed section rendering from the single persisted task array.
- Wired the existing Complete button into the app flow so completed tasks are saved, removed from Active, and shown under Completed immediately and after refresh.
- Added completed-section markup hooks and Warm Minimal completed-task styling with visible “Completed” status text.
- Added dependency-free Node tests for completion domain logic, completed selectors, and completed view-model rendering contracts.

### File List

- `index.html`
- `src/main.js`
- `src/render.js`
- `src/render.test.js`
- `src/styles.css`
- `src/tasks.js`
- `src/tasks.test.js`
- `_bmad-output/implementation-artifacts/2-3-complete-tasks-into-completed-section.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-05-23: Implemented Story 2.3 complete tasks into Completed section and moved story to review.
