# Story 3.1: Toggle Important Status on Tasks

Status: done

## Story

As a student or employee,
I want to mark and unmark a task as important,
so that important work is identified separately from normal tasks.

## Acceptance Criteria

1. Given an active task exists, when the user marks the task as important, then the task’s `important` field is set to `true`, and `updatedAt` is refreshed.
2. Given an important active task exists, when the user removes important status, then the task’s `important` field is set to `false`, and `updatedAt` is refreshed.
3. Given important status changes, when the task array is saved, then the updated `important` value is persisted to localStorage, and refreshing or reopening the app preserves the status.
4. Given the important action is available, when a keyboard user focuses and activates it, then important status toggles successfully, and the control exposes the current important state with an accessible name or state.
5. Given the MVP only supports binary importance, when the user marks a task important, then the app does not introduce priority levels, labels, categories, or urgency scales.

## Tasks / Subtasks

- [x] Add important toggle domain logic (AC: 1, 2, 5)
  - [x] Add `toggleTaskImportant(tasks, taskId)` in `src/tasks.js` beside `completeTask`, `deleteTask`, and `editTaskTitle`.
  - [x] Return the original array when `taskId` is unknown, matching existing unknown-id behavior.
  - [x] Return a new task array when the id exists, changing only the matching task.
  - [x] Flip only the matching task’s `important` boolean and refresh only its `updatedAt` timestamp.
  - [x] Preserve `id`, `title`, `completed`, and `createdAt` for the toggled task.
  - [x] Preserve the approved task schema exactly: `id`, `title`, `completed`, `important`, `createdAt`, `updatedAt`.
  - [x] Do not add priority levels, labels, categories, urgency scales, `importantAt`, color fields, or other non-MVP metadata.
- [x] Wire the existing Important action into the app flow (AC: 1, 2, 3, 4)
  - [x] Import `toggleTaskImportant` in `src/main.js`.
  - [x] Handle `data-action="toggle-important"` in the existing `[data-active-list]` delegated click listener.
  - [x] Update the runtime `tasks` array through `toggleTaskImportant(tasks, taskId)`.
  - [x] Save the full task array with `saveTasks(tasks)` after a successful toggle.
  - [x] Re-render Active and Completed sections through the existing `renderTasks()` flow.
  - [x] Clear stale `editState` if toggling while edit state exists would leave confusing UI; keeping `editState = {}` for important toggles is acceptable and consistent with complete/delete simplicity.
  - [x] Do not add a Completed-section important toggle; this story only toggles active tasks.
- [x] Expose current important state in Active task rendering (AC: 4)
  - [x] Update `createActiveTaskViewModel(task)` in `src/render.js` so the Important action label and accessible name reflect current state.
  - [x] For non-important active tasks, expose intent such as label `Important` and aria label `Mark important: ${task.title}`.
  - [x] For important active tasks, expose intent such as label `Important` or `Unmark` and aria label `Remove important: ${task.title}`.
  - [x] Add `aria-pressed="true"`/`"false"` or an equivalent stateful accessible signal on the Important button.
  - [x] Keep task titles rendered with text-safe DOM APIs only.
  - [x] Preserve existing Active action order: `complete`, `toggle-important`, `edit`, `delete`.
- [x] Add minimal visual affordance only if needed for state clarity (AC: 4, 5)
  - [x] If styling changes are added in `src/styles.css`, keep them restrained and Warm Minimal.
  - [x] Styling for this story may distinguish the pressed Important button, but full important task card styling belongs to Story 3.3.
  - [x] Do not implement important-first sorting in this story; Story 3.2 owns sorting.
  - [x] Do not implement amber task-card treatment, important labels/markers on the row, or broad responsive polish beyond what is necessary for the button state; Story 3.3 and Story 3.4 own those.
- [x] Add focused dependency-free tests (AC: 1, 2, 4, 5)
  - [x] Update `src/tasks.test.js` for `toggleTaskImportant`: marks false → true, true → false, refreshes `updatedAt`, preserves `createdAt`, preserves other fields, leaves non-target tasks unchanged, returns original array for unknown ids, and does not mutate input state.
  - [x] Update `src/render.test.js` for Active task view models so Important action exposes the correct accessible name and state for both important and non-important tasks.
  - [x] Keep using Node’s built-in test runner; do not add jsdom, Vitest, React, or any other dependency.
- [x] Verify manually and with scripts (AC: 1-5)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify an active task can be marked important by mouse.
  - [x] Verify the same active task can be unmarked important by mouse.
  - [x] Verify keyboard-only flow can focus and activate the Important control with visible focus.
  - [x] Verify the Important control exposes current pressed/state semantics or an equivalent accessible state.
  - [x] Verify `smiple-todo.tasks` stores the updated `important` boolean and refreshed `updatedAt` after each toggle.
  - [x] Refresh the browser and verify important status is preserved.
  - [x] Verify toggling important does not move tasks yet; important-first sorting belongs to Story 3.2.
  - [x] Verify completed tasks remain in Completed and do not expose an important toggle.
  - [x] Verify existing add valid, add invalid, edit valid, edit invalid, edit cancel, complete, delete active, delete completed, completed persistence, empty states, and safe title rendering are not regressed.
  - [x] Verify HTML-like task titles remain literal text after important toggle and refresh.
  - [x] Verify mobile widths around 320–430px and desktop width around 1024px+ remain readable without horizontal overflow.

## Dev Notes

### Current Project State

- The app is a Vite Vanilla JavaScript client-only app using ES modules, plain CSS, and Node’s built-in test runner.
- `src/tasks.js` currently exports `taskModelFields`, `addTask(title)`, `editTaskTitle(tasks, taskId, title)`, `completeTask(tasks, taskId)`, `deleteTask(tasks, taskId)`, `getActiveTasks(tasks)`, and `getCompletedTasks(tasks)`.
- `src/main.js` loads tasks from `loadTasks()`, keeps one runtime `tasks` array, uses `renderTasks()` as central render orchestration, and delegates Active-list clicks for `complete`, `delete`, `edit`, `cancel-edit`, and `save-edit`.
- `src/render.js` already includes a `toggle-important` action in `createActiveTaskViewModel(task)`, but it is currently only a future action control and is not wired to state changes.
- `src/render.js` renders Active tasks from `getActiveTasks(tasks)` and Completed tasks from `getCompletedTasks(tasks)`.
- Completed tasks currently expose only Delete and should not gain Important controls in this story.
- `src/storage.js` owns `storageKey = "smiple-todo.tasks"`, strict task schema validation, safe load fallback, and full-array JSON persistence.
- `src/styles.css` already defines the Warm Minimal design system, `--color-important`, `.task-actions`, `.task-action`, focus states, responsive wrapping, completed styling, and reduced-motion behavior.
- `index.html` already has stable hooks for `[data-active-list]`, `[data-active-empty]`, `[data-completed-list]`, and `[data-completed-empty]`; no markup change is expected for this story.

### Story Scope Boundaries

This story implements only binary important status toggling for active tasks. It must not implement:

- Important-first sorting; Story 3.2 owns sorting.
- Full important task card styling, amber row treatment, icon marker, or important label; Story 3.3 owns restrained important styling.
- Responsive/accessibility final polish across all interactions beyond the Important control state; Story 3.4 owns final polish.
- Priority levels, labels, categories, urgency scales, due dates, filters, counters, routing, modals, confirmation flows, undo, toast notifications, or keyboard shortcuts.
- Important toggling for completed tasks unless the epic is explicitly changed.
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
- Derive Active and Completed lists from the task array. Do not persist `activeTasks`, `completedTasks`, `importantTasks`, or UI-only state.
- Keep task mutations in `src/tasks.js`, persistence in `src/storage.js`, DOM rendering in `src/render.js`, orchestration in `src/main.js`, and visual styling in `src/styles.css`.
- Use camelCase for JavaScript and kebab-case for CSS classes/files.
- Render user-provided task titles with `textContent` or equivalent safe DOM APIs; never use `innerHTML` for task titles.
- Full re-rendering after toggling important is acceptable for MVP scale.

### File-Specific Implementation Guidance

- `src/tasks.js`
  - Add `toggleTaskImportant(tasks, taskId)` near existing task operations.
  - Prefer the same immutable `tasks.map(...)` pattern used by `editTaskTitle` and `completeTask`.
  - Check id existence first and return the original array for unknown ids.
  - Refresh `updatedAt` with a new ISO string only for the matching task.
  - Do not change `addTask`, `editTaskTitle`, `completeTask`, `deleteTask`, `getActiveTasks`, `getCompletedTasks`, or `taskModelFields` except for necessary exports.
- `src/main.js`
  - Add `toggleTaskImportant` to the existing `tasks.js` import.
  - Handle `data-action="toggle-important"` in the existing Active-list delegated click listener.
  - Save immediately after toggling with `saveTasks(tasks)` and render both lists through `renderTasks()`.
  - Preserve existing handling for complete, delete, edit, cancel-edit, and save-edit.
  - Do not add a new event listener if the existing delegated Active-list listener can handle the action cleanly.
- `src/render.js`
  - Update `createActiveTaskViewModel(task)` to encode important state in the Important action.
  - `createTaskAction` currently accepts `{ action, label, ariaLabel }`; extend it only as needed to support state attributes such as `aria-pressed`.
  - Keep action button creation centralized in `createTaskAction`; do not duplicate button creation for Important.
  - Preserve Active action order and existing labels for Complete, Edit, and Delete.
  - Completed view models should remain delete-only.
- `src/render.test.js`
  - Update the Active view-model tests that currently expect the Important aria label to always be `Mark important: ...`.
  - Add explicit assertions for non-important and important task states.
- `src/tasks.test.js`
  - Add tests for both toggle directions and unknown id behavior.
- `src/styles.css`
  - Prefer existing `.task-action` styles.
  - If adding pressed Important styling, target `[data-action="toggle-important"][aria-pressed="true"]` or equivalent.
  - Keep visual treatment modest; Story 3.3 owns full important row styling.

### UX and Accessibility Requirements

- Important should use a clear control pattern and expose current state to assistive technology.
- Keyboard users must be able to tab to the Important control and activate it using native button behavior.
- The Important action must produce immediate visible or stateful feedback after toggling.
- The MVP supports only binary important/not-important state.
- Color must not be the only way to understand important state; at this story level, accessible button state and label are required even if full visual marker comes later.
- Task title remains the dominant row content; Important remains a secondary action.
- The UI must stay calm and Warm Minimal; avoid alarm-like styling.
- Mobile layout must keep controls tappable and avoid horizontal overflow.

### Security and Privacy Requirements

- Treat task titles as user input in Active and Completed sections.
- Never render task titles using raw HTML insertion.
- Verify HTML-like titles such as `<img src=x onerror=alert(1)>` remain literal text after important toggling and refresh.
- Do not send task data over the network.
- Do not collect personal data.
- Do not add backend, cloud sync, analytics, telemetry, or service worker behavior.

### Previous Story Intelligence

- Story 2.4 added immutable `deleteTask`, Active and Completed delegated delete handling, and completed-task delete controls through the existing task action helper.
- Story 2.4 proved the `data-action` and `data-task-id` pattern scales across task actions. Reuse the existing `toggle-important` action rather than adding another important entry point.
- Story 2.4 verified active deletion, completed deletion, localStorage removal, refresh persistence, empty states, keyboard focus/activation, HTML-like title safety, and mobile/desktop no-overflow checks. Preserve these flows.
- Story 2.3 added immutable `completeTask`, `getCompletedTasks`, dynamic Completed rendering, completed empty-state toggling, and completed visual treatment. Important toggling must not move completed tasks or change Completed rendering.
- Story 2.2 implemented active-row edit state, Save/Cancel controls, inline edit validation, persistence for valid edits only, and `CSS.escape` for post-render focus selectors. Preserve edit mode behavior.
- Story 2.1 implemented `loadTasks()`/`saveTasks(tasks)` and strict localStorage schema validation. Do not recreate storage helpers or introduce new storage keys.
- Epic 2 retrospective identified the existing Important action as visible but intentionally not functional yet. Story 3.1 should wire that action carefully without disturbing add, edit, complete, delete, persistence, or Completed-section behavior.
- Epic 2 retrospective also committed to strict Epic 3 scope, browser verification, dependency-free tests, and dependency maintenance outside feature stories.

### Git Intelligence Summary

Recent commits:

- `ca5e24b doc: add epic 2 retrospective`
- `6067022 feat(story-2.3): complete and delete tasks`
- `6fe5730 feat(story-2.2): edit existing task titles`
- `b98e46a doc: add epic 1 retrospective`
- `2234317 feat(story-2.1): persist tasks in browser storage`

Actionable patterns:

- Recent implementation uses small module-level changes in `src/tasks.js`, `src/main.js`, `src/render.js`, focused Node tests beside source files, and browser verification for interactive UI stories.
- Continue updating only source/test/story/status files relevant to the current story.
- Do not mix dependency maintenance into feature commits.

### Latest Technical Information

No web research was required for this story. The implementation uses existing project technology only: Vite Vanilla JavaScript, browser DOM APIs, localStorage, plain CSS, and Node’s built-in test runner. No new library, external API, backend service, or dependency version decision is needed.

## Project Structure Notes

- Keep all application code under `src/` and static app markup in `index.html`.
- Expected update files: `src/tasks.js`, `src/tasks.test.js`, `src/main.js`, `src/render.js`, `src/render.test.js`, and optionally `src/styles.css`.
- No new source files are expected.
- Do not create `components/`, `services/`, `api/`, `pages/`, `routes/`, or framework-style folders.
- Do not edit `node_modules/`, `dist/`, or generated build output.
- Do not add dependencies or change package manager/tooling for this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L429-L464) — Epic 3 goal and Story 3.1 source requirements.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L465-L529) — Later Epic 3 stories that own sorting and full important styling.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L91-L96) — Important task functional requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L111-L120) — User journey for capture and remember an important task.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L211-L245) — task schema, important field, and persistence strategy.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L286-L320) — frontend architecture and important sorting dependency.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L493-L529) — data-action, data-task-id, and state management patterns.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L510-L518) — Task Item component supports important controls and exposed state.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L591-L608) — button hierarchy and Important action pattern.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L610-L622) — immediate feedback patterns for mark/unmark important.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L708-L739) — responsive and accessibility testing requirements.
- [_bmad-output/implementation-artifacts/2-4-delete-tasks-from-the-app.md](2-4-delete-tasks-from-the-app.md) — previous story implementation notes and established delegated action patterns.
- [_bmad-output/implementation-artifacts/epic-2-retro-2026-05-24.md](epic-2-retro-2026-05-24.md) — Epic 3 readiness, action items, and important-toggle preparation.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` initially failed as expected before `toggleTaskImportant` export existed.
- `npm test` initially failed as expected before Important action view models exposed `ariaPressed` and important-specific labels.
- Final `npm test`: 27 tests passed.
- Final `npm run build`: Vite production build passed.
- Browser verification used Vite dev server at `http://127.0.0.1:5174/`.

### Completion Notes List

- Added immutable `toggleTaskImportant(tasks, taskId)` domain logic that flips only the matching task’s binary `important` field and refreshes only its `updatedAt`.
- Wired the existing Active-list `toggle-important` delegated action to update runtime state, save the full task array, clear edit state, and re-render.
- Updated Active task view models/buttons to expose current important state through `aria-pressed`, state-specific accessible names, and restrained pressed styling.
- Added dependency-free Node tests for important domain behavior and render view-model state.
- Manually verified mouse toggle, keyboard toggle, localStorage persistence, refresh persistence, no important sorting, no Completed important action, literal rendering for HTML-like titles, and no horizontal overflow at mobile/desktop widths.

### File List

- `src/tasks.js`
- `src/tasks.test.js`
- `src/main.js`
- `src/render.js`
- `src/render.test.js`
- `src/styles.css`
- `_bmad-output/implementation-artifacts/3-1-toggle-important-status-on-tasks.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-05-24: Created Story 3.1 context for toggling important status on active tasks.
- 2026-05-24: Implemented binary important toggling for active tasks with persistence, accessibility state, tests, restrained styling, and manual verification.
