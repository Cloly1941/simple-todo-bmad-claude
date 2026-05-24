# Story 2.4: Delete Tasks from the App

Status: done

## Story

As a student or employee,
I want to delete tasks I no longer need,
so that my active and completed lists stay clean.

## Acceptance Criteria

1. Given an active task exists, when the user deletes the task, then the task is removed from the task array, and it no longer appears in the Active section.
2. Given a completed task exists, when the user deletes the task, then the task is removed from the task array, and it no longer appears in the Completed section.
3. Given a task is deleted, when the task array is saved, then the deleted task is removed from localStorage persistence, and refreshing or reopening the app does not restore the deleted task.
4. Given a delete action is available, when the user navigates by keyboard, then the delete action is reachable and activatable by keyboard, and the control has an accessible name that identifies it as a delete action.
5. Given deleting a task makes a section empty, when the section re-renders, then the appropriate empty state appears, and the rest of the app remains usable.

## Tasks / Subtasks

- [x] Add deletion domain logic (AC: 1, 2, 3)
  - [x] Add `deleteTask(tasks, taskId)` in `src/tasks.js` beside `completeTask` and `editTaskTitle`.
  - [x] Return a new array without the matching task when `taskId` exists.
  - [x] Return the original array when `taskId` is unknown, matching the existing `editTaskTitle` and `completeTask` unknown-id pattern.
  - [x] Preserve the approved task schema for all remaining tasks; do not mutate task objects.
  - [x] Do not add archived, soft-delete, trash, undo, restore, or deleted-at fields.
- [x] Wire delete actions for active and completed tasks (AC: 1, 2, 3, 4, 5)
  - [x] Import `deleteTask` in `src/main.js`.
  - [x] Handle `data-action="delete"` in the existing delegated Active-list click listener.
  - [x] Add a delegated click listener for `[data-completed-list]` that handles `data-action="delete"` for completed tasks.
  - [x] After deletion, update the runtime `tasks` array, call `saveTasks(tasks)`, clear stale `editState` when needed, and call `renderTasks()`.
  - [x] Preserve existing add, edit, cancel, save-edit, complete, and empty-state flows.
  - [x] Do not implement confirmation dialogs, undo toasts, bulk delete, clear completed, filters, counters, or keyboard shortcuts in this story.
- [x] Render delete controls for completed tasks (AC: 2, 4)
  - [x] Extend `createCompletedTaskViewModel(task)` in `src/render.js` so completed tasks expose a delete action with a clear accessible name such as `Delete task: ${task.title}`.
  - [x] Update `createCompletedTaskItem(task)` to render a `.task-actions` container using the existing `createTaskAction` helper rather than duplicating button creation.
  - [x] Keep completed task titles rendered with `textContent` only.
  - [x] Preserve `task-item task-item--completed`, `task-status task-status--completed`, and `data-task-id` on completed task items.
- [x] Keep deletion UX calm, accessible, and Warm Minimal (AC: 4, 5)
  - [x] Reuse the existing `.task-action` focus, hover, touch-target, and wrapping behavior for delete controls.
  - [x] If adding delete-specific styling, keep it restrained; default delete controls should not visually overpower the task title or look alarm-like.
  - [x] Ensure keyboard users can tab to Delete in both Active and Completed sections and activate it with the native button behavior.
  - [x] Ensure deleting the final active task shows “No active tasks yet. Add a task above.” and deleting the final completed task shows “No completed tasks yet.”.
- [x] Add focused dependency-free tests (AC: 1, 2, 3, 4, 5)
  - [x] Update `src/tasks.test.js` to cover `deleteTask`: removes only the matching task, returns original array for unknown ids, preserves remaining task object identity/schema, and does not mutate the input array.
  - [x] Update `src/render.test.js` so completed-task view-model tests expect a delete action with `data-action` intent and accessible label.
  - [x] Keep using Node’s built-in test runner; do not add jsdom, Vitest, React, or other dependencies.
- [x] Verify manually and with scripts (AC: 1-5)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify deleting an active task by mouse removes it from Active immediately.
  - [x] Complete a task, then verify deleting it from Completed removes it immediately.
  - [x] Verify `smiple-todo.tasks` no longer contains deleted active or completed tasks.
  - [x] Refresh the browser and verify deleted tasks do not reappear.
  - [x] Verify empty states toggle correctly when deleting the last active task and the last completed task.
  - [x] Verify keyboard-only flow can focus and activate Delete in both sections with visible focus.
  - [x] Verify HTML-like task titles remain literal text before deletion and do not create unsafe HTML.
  - [x] Verify existing add valid, add invalid, edit valid, edit invalid, edit cancel, completion, completed persistence, and completed rendering flows are not regressed.
  - [x] Verify mobile widths around 320–430px and desktop width around 1024px+ remain readable without horizontal overflow.

## Dev Notes

### Current Project State

- The app is a Vite Vanilla JavaScript client-only app using ES modules, plain CSS, and Node’s built-in test runner.
- `src/main.js` loads tasks from `loadTasks()`, keeps `let tasks = loadTasks();`, and uses `renderTasks()` as the central render orchestration.
- `src/main.js` currently delegates clicks from `[data-active-list]` for `complete`, `edit`, `cancel-edit`, and `save-edit`. The Active task view model already includes a `delete` action, but the action is not wired yet.
- `src/render.js` renders Active tasks with actions from `createActiveTaskViewModel(task)`. Active actions currently appear in this order: `complete`, `toggle-important`, `edit`, `delete`.
- `src/render.js` renders Completed tasks with `createCompletedTaskItem(task)`, but completed task view models currently expose `actions: []`, so completed tasks have no delete control yet.
- `src/tasks.js` exports `taskModelFields`, `addTask(title)`, `editTaskTitle(tasks, taskId, title)`, `completeTask(tasks, taskId)`, `getActiveTasks(tasks)`, and `getCompletedTasks(tasks)`.
- `src/storage.js` already owns `storageKey = "smiple-todo.tasks"`, schema validation, safe load fallback, and full-array JSON persistence. Reuse it; do not add another storage key or persistence layer.
- `index.html` already has Active and Completed list containers and empty-state markers: `[data-active-list]`, `[data-active-empty]`, `[data-completed-list]`, and `[data-completed-empty]`.
- `src/styles.css` already defines the Warm Minimal design system, `.task-actions`, `.task-action`, focus states, responsive wrapping, completed task styling, and reduced-motion behavior.

### Story Scope Boundaries

This story implements only task deletion from Active and Completed lists. It must not implement:

- Confirmation modals, alert dialogs, toast notifications, undo, restore, trash/archive, soft delete, clear-completed, bulk delete, filters, counters, routing, or keyboard shortcuts.
- Important toggling, important sorting, or important styling; Epic 3 owns those stories.
- Reopening/un-completing completed tasks.
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
- Render user-provided task titles with `textContent` or equivalent safe DOM APIs; never use `innerHTML` for task titles.
- Full re-rendering after deletion is acceptable for MVP scale.

### File-Specific Implementation Guidance

- `src/tasks.js`
  - Add `deleteTask(tasks, taskId)` near existing task operations.
  - Prefer `tasks.filter((task) => task.id !== taskId)` after checking whether the id exists, so unknown ids can return the original array reference like existing operations.
  - Do not refresh `updatedAt` for remaining tasks; deletion removes a record rather than modifying surviving records.
  - Do not change `taskModelFields`, `addTask`, `editTaskTitle`, `completeTask`, `getActiveTasks`, or `getCompletedTasks` except for necessary exports/imports.
- `src/render.js`
  - Reuse `createTaskAction({ action, label, ariaLabel })` for completed delete buttons; do not duplicate button creation.
  - Keep Active action order unchanged for this story.
  - Update `createCompletedTaskViewModel(task)` to include only the completed delete action. Do not add edit, complete, important, reopen, or fake disabled actions for completed tasks.
  - Completed delete action should be a real `<button type="button">` via the existing helper and should identify the task in its accessible name.
- `src/main.js`
  - Handle Active delete in the existing `[data-active-list]` delegated listener.
  - Add Completed delete handling to `[data-completed-list]` because completed items are rendered in a separate list.
  - Use `actionButton?.closest("[data-task-id]")` and `taskItem.dataset.taskId`, matching the Active listener pattern.
  - After deletion, clear `editState` if it references the deleted task. Clearing `editState = {}` for all deletes is acceptable and simpler.
  - Save immediately after deletion with `saveTasks(tasks)` and render both lists through `renderTasks()`.
  - If an unknown id somehow reaches the handler, `deleteTask` should return the original array; saving the unchanged array is acceptable but not required.
- `src/styles.css`
  - Prefer existing `.task-action` styles. Add delete-specific styles only if needed for clarity and keep them understated.
  - Preserve the Warm Minimal tone, distinctive font pairing, CSS custom properties, task interaction animation, focus visibility, and mobile wrapping.
- `index.html`
  - No markup changes are expected unless implementation reveals a missing stable hook. Do not add new sections, modals, counters, or navigation.

### UX and Accessibility Requirements

- Delete must give immediate visible feedback by removing the task from its current section.
- Delete controls must be keyboard reachable and natively activatable because they are real buttons.
- Accessible names must identify the action and task, e.g. `Delete task: ${task.title}`.
- Deleting a task must not rely on color-only feedback; the item’s removal and section empty-state changes are the feedback.
- Completed section remains below Active and visually secondary.
- The UI should remain calm: destructive styling, if any, should not dominate the task row.
- Mobile layout must keep task content readable and controls tappable without horizontal overflow.

### Security and Privacy Requirements

- Treat task titles as user input in both Active and Completed sections.
- Never render task titles using raw HTML insertion.
- Verify HTML-like titles such as `<img src=x onerror=alert(1)>` remain literal text before deletion and after refresh for surviving tasks.
- Do not send task data over the network.
- Do not collect personal data.
- Do not add backend, cloud sync, analytics, telemetry, or service worker behavior.

### Previous Story Intelligence

- Story 2.3 added immutable `completeTask`, `getCompletedTasks`, dynamic Completed rendering, completed empty-state toggling, and completed visual treatment.
- Story 2.3 intentionally left completed task actions empty because Story 2.4 owns deletion. Now extend that completed rendering path rather than creating a separate completed-items implementation.
- Story 2.3 verified completion persistence, completed section rendering after refresh, keyboard activation, HTML-like title safety, and mobile layout. Preserve those behaviors.
- Story 2.2 implemented immutable `editTaskTitle`, active-row editing state, save/cancel controls, inline edit validation, and persistence for valid edits only. Deleting while an edit state exists must not leave stale edit UI state.
- Story 2.2 added `CSS.escape` for post-render focus selectors in `src/main.js`; preserve that safety pattern for any focus work. This story does not require post-delete focus targeting.
- Story 2.1 implemented `loadTasks()`/`saveTasks(tasks)` and strict localStorage schema validation. Do not recreate storage helpers or introduce new storage keys.
- Story 1.4 established the task action order `complete`, `toggle-important`, `edit`, `delete` and the `data-action`/`data-task-id` pattern. Reuse the existing `delete` action rather than adding another deletion entry point.
- Epic 1 retrospective emphasized strict story scope, browser verification for UI acceptance, DOM-safe rendering, and dependency maintenance outside feature stories.

### Git Intelligence Summary

- Recent commits:
  - `6fe5730 feat(story-2.2): edit existing task titles`
  - `b98e46a doc: add epic 1 retrospective`
  - `2234317 feat(story-2.1): persist tasks in browser storage`
  - `69c36c0 feat(story-1.4): render active tasks with controls`
  - `c7f765d doc: update doc`
- Recent implementation pattern: small module-level changes in `src/main.js`, `src/render.js`, `src/tasks.js`, focused Node tests beside source files, plus browser verification for interactive UI stories.
- Continue the convention of updating only source/test/story/status files relevant to the current story.

### Testing Requirements

- Automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification is required because this story changes interactive UI, persisted state, Active rendering, and Completed rendering.
- Minimum manual checks:
  - Delete an active task by mouse and keyboard.
  - Complete a task, then delete it from Completed by mouse and keyboard.
  - Confirm deleted tasks are removed from `smiple-todo.tasks` and do not return after refresh.
  - Confirm Active and Completed empty states toggle correctly after deletion.
  - Confirm existing add, validation, edit, completion, completed persistence, and safe title rendering flows still work.
  - Confirm mobile widths around 320–430px and desktop width around 1024px+ remain usable.

## Project Structure Notes

- Keep all application code under `src/` and static app markup in `index.html`.
- Do not create `components/`, `services/`, `api/`, `pages/`, `routes/`, or framework-style folders.
- Do not edit `node_modules/`, `dist/`, or generated build output.
- Do not add dependencies or change package manager/tooling for this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L395-L426) — Story 2.4 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L36-L37) — FR-19 to FR-20 deletion requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L97-L100) — task removal functional requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L142-L148) — local-only and no personal data NFRs.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L211-L249) — task schema, persistence, and validation strategy.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L492-L529) — data-action, data-task-id, and single runtime state rules.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L731-L738) — task removal module mapping.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L590-L621) — button hierarchy and immediate feedback patterns for Delete.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L739) — responsive and accessibility testing requirements.
- [_bmad-output/implementation-artifacts/2-3-complete-tasks-into-completed-section.md](2-3-complete-tasks-into-completed-section.md) — previous story implementation notes and completed rendering patterns.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` red: missing `deleteTask` export and completed view model delete action before implementation.
- `npm test` green: 22 tests passing after domain deletion and completed delete view-model implementation.
- `npm run build` green: Vite production build completed successfully.
- Browser verification: Vite dev server at `http://127.0.0.1:5173/` driven through headless Chrome DevTools Protocol verified active deletion, completed deletion, localStorage removal, refresh persistence, active/completed empty states, keyboard focus/activation, HTML-like title safety, and mobile/desktop no-overflow checks.

### Completion Notes List

- Added immutable task deletion through `deleteTask`, preserving remaining task records and returning the original array for unknown ids.
- Wired existing Active delete actions and new Completed delete actions through delegated event handlers that save the full task array and re-render both sections.
- Added completed-task delete controls using the existing task action button helper and accessible task-specific labels.
- Added focused Node tests for deletion domain logic and completed delete view-model contracts.
- Verified automated tests, production build, and browser behavior for mouse, keyboard, persistence, empty states, safe text rendering, and responsive layout.

### File List

- `src/main.js`
- `src/render.js`
- `src/render.test.js`
- `src/tasks.js`
- `src/tasks.test.js`
- `_bmad-output/implementation-artifacts/2-4-delete-tasks-from-the-app.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-05-24: Created Story 2.4 context for deleting active and completed tasks.
- 2026-05-24: Implemented Story 2.4 delete task behavior and moved story to review.
