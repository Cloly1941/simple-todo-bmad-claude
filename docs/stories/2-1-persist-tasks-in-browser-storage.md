# Story 2.1: Persist Tasks in Browser Storage

Status: review

## Story

As a student or employee,
I want my task list to remain saved in the same browser,
so that I can close or refresh the app without losing my tasks.

## Acceptance Criteria

1. Given the app starts for the first time in a browser with no saved tasks, when the app loads, then it initializes with an empty task array, and no login, signup, backend, or network storage is required.
2. Given the user adds a valid task, when the task array changes, then the full task array is saved to localStorage under the key `smiple-todo.tasks`, and the saved data is JSON using the approved task schema.
3. Given saved tasks exist under `smiple-todo.tasks`, when the user refreshes or reopens the app in the same browser, then the app loads the saved task array, and the saved active tasks are rendered in the Active section.
4. Given localStorage contains missing, invalid, or unreadable task data, when the app loads, then the app fails safely to an empty task array, and the UI remains usable.
5. Given task data is stored locally, when the user uses the MVP, then task data remains on the user's device/browser, and the app does not collect personal data or send task data over the network.

## Tasks / Subtasks

- [x] Implement localStorage task persistence adapter (AC: 1, 2, 4, 5)
  - [x] Expand `src/storage.js` beyond the existing `storageKey` export with `loadTasks()` and `saveTasks(tasks)` functions.
  - [x] Keep the storage key exactly `smiple-todo.tasks`.
  - [x] Store the full task array as JSON, not separate active/completed arrays.
  - [x] Return an empty array when no saved value exists.
  - [x] Return an empty array when JSON parsing fails, the parsed value is not an array, or any saved item does not match the approved task schema.
  - [x] Do not add backend calls, account logic, network storage, analytics, telemetry, service workers, or dependencies.
- [x] Validate saved task shape before trusting storage data (AC: 2, 3, 4)
  - [x] Add a small schema validation helper in `src/storage.js` or reuse an exported helper if introduced in existing source.
  - [x] Require each task to have exactly the approved fields: `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt`.
  - [x] Require `id`, `title`, `createdAt`, and `updatedAt` to be strings, and `completed` and `important` to be booleans.
  - [x] Treat invalid, missing, malformed, or unreadable saved data as no saved tasks rather than partially repairing or mutating it.
- [x] Initialize app state from browser storage (AC: 1, 3, 4)
  - [x] Update `src/main.js` so the single in-memory `tasks` array is initialized from `loadTasks()` instead of always `[]`.
  - [x] Keep `renderActiveTasks(tasks)` on app startup so saved active tasks appear immediately.
  - [x] Preserve the existing Active empty state copy and behavior when storage is empty or invalid.
  - [x] Do not create separate active/completed runtime arrays.
- [x] Persist tasks after successful task mutations (AC: 2, 5)
  - [x] Update the valid add-task submit flow in `src/main.js` so `saveTasks(tasks)` runs after the new task is added to the full array.
  - [x] Do not save on invalid empty-title submissions.
  - [x] Preserve Story 1.2 behavior: valid task creation appends the task, re-renders active tasks, clears the input, and keeps focus on the input.
  - [x] Preserve Story 1.3 inline validation behavior and error focus behavior.
  - [x] Preserve Story 1.4 active task rendering, controls, DOM-safe title rendering, and keyboard focusability.
- [x] Add focused storage tests without new dependencies (AC: 1, 2, 4, 5)
  - [x] Add `src/storage.test.js` using Node's built-in test runner.
  - [x] Test `loadTasks()` returns `[]` when no value exists.
  - [x] Test `saveTasks(tasks)` writes JSON under `smiple-todo.tasks`.
  - [x] Test `loadTasks()` returns saved valid tasks using the approved schema.
  - [x] Test invalid JSON, non-array JSON, and schema-invalid items fail safely to `[]`.
  - [x] Use a lightweight fake storage object or injectable storage boundary if needed; do not add jsdom or a new test framework.
- [x] Verify manually and with scripts (AC: 1-5)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify in the browser that a first-time load shows an empty Active section without errors.
  - [x] Add a valid task, refresh the page, and verify the saved active task still renders in the Active section.
  - [x] Verify localStorage contains JSON under `smiple-todo.tasks` with the approved task schema.
  - [x] Verify invalid empty-title submission still shows the Story 1.3 inline validation and does not save a new task.
  - [x] Verify an HTML-like task title still renders as literal text after refresh, not markup.
  - [x] Manually corrupt `smiple-todo.tasks`, reload, and verify the app safely shows the empty Active state and remains usable.
  - [x] Confirm no network task storage, login, signup, backend, analytics, telemetry, or service worker behavior was introduced.

## Dev Notes

### Current Project State

- Story 1.4 is complete and active task rendering now uses a richer DOM-safe task item structure in `src/render.js`.
- Current `src/storage.js` only exports `storageKey = "smiple-todo.tasks"`; Story 2.1 should implement the actual persistence functions here.
- Current `src/main.js` initializes `let tasks = [];`, renders active tasks immediately, and on valid submit validates the title, calls `addTask(validation.value)`, appends to the in-memory array, renders, clears the input, and keeps focus on the input.
- Current `src/tasks.js` owns task creation and active selection. `addTask(title)` returns a task with the approved schema and `getActiveTasks(tasks)` derives active tasks from the full array.
- Current `src/render.js` derives active tasks via `getActiveTasks(tasks)` and renders task titles with `textContent`; do not bypass this for saved tasks.
- Current tests use Node's built-in runner through `npm test` (`node --test src/**/*.test.js`). Do not add jsdom, Vitest, or other dependencies.
- Current `index.html` already has the add form, inline validation message, Active empty/list elements, and a static Completed empty section. No HTML structure change is expected for this story.

### Story Scope Boundaries

This story is only about local browser persistence for the full task array. It must not implement:

- Editing task titles; Story 2.2 owns that.
- Completing tasks or rendering a dynamic Completed list; Story 2.3 owns that.
- Deleting tasks; Story 2.4 owns that.
- Important task toggling, important sorting, or important styling; Epic 3 owns those.
- Backend, API, database, authentication, cloud sync, analytics, telemetry, service workers, or account-based persistence.
- New dependencies, framework migration, routing, state management libraries, or generated build output edits.

### Architecture Requirements

- Use the existing Vite Vanilla JavaScript app with browser JavaScript, ES modules, and plain CSS.
- Keep source code in the existing `src/` modules.
- Use camelCase for JavaScript variables/functions/object fields and kebab-case for CSS classes/files.
- Keep a single in-memory `tasks` array as the runtime source of truth.
- Continue deriving Active tasks from the task array; do not store separate active/completed arrays.
- Persist the full task array after every successful mutation.
- Follow the state flow: user event → validate input → update tasks → save tasks → render.
- Task objects must continue to use this exact schema:

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

- Store dates as ISO strings. Story 2.1 should not add schema fields.
- The storage key must remain exactly `smiple-todo.tasks`.
- Saved data must be JSON.
- Invalid or unreadable stored data should fail safely to an empty array.

### File-Specific Implementation Guidance

- `src/storage.js`
  - Primary file for persistence logic.
  - Preserve and reuse the existing `storageKey` export.
  - Add `loadTasks()` and `saveTasks(tasks)` exports.
  - Keep JSON parsing/stringifying here rather than spreading localStorage logic through UI code.
  - Prefer a small storage boundary that is easy to test in Node without requiring browser DOM APIs. For example, helper functions can accept a storage-like object internally or use `globalThis.localStorage` behind a safe guard.
  - If `globalThis.localStorage` is unavailable or throws, fail safely for loading and avoid crashing for saving.
  - Validate loaded data before returning it to `main.js`.
- `src/main.js`
  - Import `loadTasks` and `saveTasks` from `src/storage.js`.
  - Initialize `tasks` from `loadTasks()`.
  - Keep `renderActiveTasks(tasks)` on startup.
  - After successful add, update `tasks`, save the full array, render, clear input, and focus the input.
  - Do not save or mutate storage on invalid validation results.
- `src/tasks.js`
  - Avoid schema changes.
  - Keep `addTask(title)` and `getActiveTasks(tasks)` behavior unchanged unless tests reveal a direct story requirement.
- `src/render.js`
  - Avoid persistence logic here.
  - Preserve DOM-safe rendering through DOM APIs and `textContent`.
  - Saved active tasks should render through existing `renderActiveTasks(tasks)`.
- `index.html`
  - No new markup is expected.
  - Preserve Active empty-state copy exactly: “No active tasks yet. Add a task above.”

### UX and Accessibility Requirements

- Persistence should be silent, immediate, and reliable-feeling; do not add disruptive confirmation messages for successful saves.
- On first load or invalid storage, the empty Active state should remain calm and should not appear as an error.
- Saved active tasks should appear in the same accessible task item UI created in Story 1.4.
- Preserve keyboard focus behavior after adding a valid task.
- Preserve visible focus styling and keyboard reachability for task controls.
- Preserve Warm Minimal tone and existing UI styling; this story is not expected to add new visual components.

### Security and Privacy Requirements

- Treat task titles loaded from storage as user input.
- Continue rendering task titles with `textContent`, never `innerHTML`.
- Do not send task data over the network.
- Do not collect personal data.
- Do not add backend, cloud sync, analytics, telemetry, or service worker persistence.
- Do not trust localStorage blindly; validate parsed data before using it.
- Failing safely to an empty array is preferred over throwing, partially rendering corrupted data, or attempting complex migration/repair.

### Previous Story Intelligence

- Story 1.4 established the active task item DOM pattern with `li.task-item`, `data-task-id`, visible Active status, `.task-title`, `.task-actions`, and future action buttons with `data-action="complete"`, `data-action="toggle-important"`, `data-action="edit"`, and `data-action="delete"`.
- Story 1.4 intentionally did not wire completion, importance, edit, or delete mutations. Story 2.1 should not wire them either.
- Story 1.4 added `createActiveTaskViewModel(task)` tests because Node has no DOM by default. Follow that dependency-free testing style for storage.
- Story 1.4 browser verification found only the existing unrelated missing favicon 404.
- Story 1.3 established `validateTaskTitle(title)` and accessible inline validation in `src/main.js`; do not regress invalid submit behavior.
- Story 1.2 established safe active task rendering and the single in-memory `tasks` array; Story 2.1 should initialize that array from storage but keep it as the runtime source of truth.

### Git Intelligence Summary

- Recent commits:
  - `69c36c0 feat(story-1.4): render active tasks with controls`
  - `c7f765d doc: update doc`
  - `230332e Delete .agents directory`
  - `a6b2bb9 feat(story-1.3): add inline task validation`
  - `ce5faa2 feat(story-1.2): add active task creation`
- No recent commit indicates localStorage load/save behavior has been implemented yet.
- Story 1.4 modified `src/render.js`, `src/render.test.js`, and `src/styles.css`.

### Testing Requirements

- Automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification is required because this story changes app startup behavior and persistence across refresh.
- Minimum manual checks:
  - First-time app load with no `smiple-todo.tasks` shows the Active empty state.
  - Adding a valid task writes JSON under `smiple-todo.tasks`.
  - Refreshing or reopening in the same browser reloads and renders saved active tasks.
  - Invalid/corrupt saved data fails safely to an empty task array and the UI remains usable.
  - Empty-title validation still works and does not create or save a task.
  - HTML-like task titles render as literal text after refresh.
  - Browser network panel shows no task-storage network calls.

## Project Structure Notes

- Keep persistence in `src/storage.js` and app wiring in `src/main.js`.
- Do not create `services/`, `api/`, backend folders, framework folders, or alternate state modules.
- Do not edit `node_modules/` or generated build output.
- Do not update dependencies or run forced audit fixes as part of this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L287-L317) — Story 2.1 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L108-L129) — Epic 2 goal, persistence requirements, and state flow.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md) — MVP persistence functional requirements FR-21 through FR-23.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md) — localStorage key, schema, module responsibilities, and state flow.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md) — local-first reliability, accessibility, and UI tone requirements.
- [_bmad-output/implementation-artifacts/1-4-render-active-tasks-clearly-and-safely.md](1-4-render-active-tasks-clearly-and-safely.md) — previous story implementation notes and active task rendering patterns.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` failed in red phase because `src/storage.js` did not export `loadTasks` and `saveTasks`, confirming the new storage tests caught missing persistence behavior.
- `npm test` passed after implementation: 13 tests passing with Node's built-in test runner.
- `npm run build` passed with Vite 5.4.21.
- Browser verification completed at `http://127.0.0.1:5177/` using Chrome DevTools MCP.
- Browser console showed only Vite debug connection messages during verification.

### Completion Notes List

- Implemented `loadTasks()` and `saveTasks(tasks)` in `src/storage.js` using the existing `smiple-todo.tasks` localStorage key.
- Added strict saved-task schema validation so missing, malformed, non-array, schema-invalid, unreadable, or throwing storage data fails safely to an empty task array.
- Updated `src/main.js` to initialize the single runtime `tasks` array from storage, render saved active tasks on startup, and save the full task array after successful valid task creation.
- Preserved invalid submit behavior, input focus behavior, active task rendering, Story 1.4 controls, DOM-safe title rendering, and no-network/no-backend MVP boundaries.
- Added dependency-free Node storage tests covering empty storage, JSON save, valid load, invalid/corrupt data, strict schema rejection, and throwing storage access.
- Verified in browser that first load shows the empty Active state, valid add writes JSON, refresh restores saved active tasks, HTML-like titles remain literal text, corrupt storage fails safely, empty-title validation still works, and no XHR/fetch task storage occurs.

### File List

- `src/main.js`
- `src/storage.js`
- `src/storage.test.js`
- `_bmad-output/implementation-artifacts/2-1-persist-tasks-in-browser-storage.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-05-23: Created Story 2.1 with comprehensive localStorage persistence implementation context.
- 2026-05-23: Implemented Story 2.1 localStorage persistence, storage validation, app startup wiring, tests, build, and browser verification.
