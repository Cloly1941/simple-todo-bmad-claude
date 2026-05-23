# Story 2.2: Edit Existing Task Titles

Status: done

## Story

As a student or employee,
I want to edit a task title after creating it,
so that I can correct mistakes or clarify what the task means.

## Acceptance Criteria

1. Given an active task exists, when the user chooses to edit the task, then the task title becomes editable, and the current title is available for editing without being lost.
2. Given the user enters a non-empty edited title, when the user saves the edit, then the task title is updated with the trimmed value, and `updatedAt` is refreshed.
3. Given a valid edit is saved, when the task list re-renders, then the updated title remains visible in the task list, and the updated task array is persisted to localStorage.
4. Given the user tries to save an empty or whitespace-only edited title, when validation runs, then the edit is not saved, and an inline validation message appears near the edit field.
5. Given an edited title validation error appears, when the user corrects the title and saves again, then the edit is saved successfully, and the validation message is cleared.
6. Given the user is editing by keyboard, when the edit controls are used, then Save and Cancel actions are keyboard reachable, and keyboard focus remains understandable during and after editing.

## Tasks / Subtasks

- [x] Add task title edit operation to task domain logic (AC: 2, 3)
  - [x] Update `src/tasks.js` with an `editTaskTitle(tasks, taskId, title)` or equivalent operation that returns an updated task array.
  - [x] Reuse the existing title validation/trimming rule from `src/validation.js`; do not create a competing rule.
  - [x] Update only the matching task's `title` and `updatedAt` when the edited title is valid.
  - [x] Preserve the approved task schema exactly: `id`, `title`, `completed`, `important`, `createdAt`, `updatedAt`.
  - [x] Do not mutate task records in place if existing patterns can keep updates immutable and easy to test.
- [x] Render an active task editing state (AC: 1, 4, 5, 6)
  - [x] Extend `src/render.js` so one active task can render as editing without replacing the overall task-list pattern.
  - [x] Preserve `li.task-item` and `data-task-id` for task identity.
  - [x] Replace the visible title for the editing task with an editable text input containing the current title.
  - [x] Add Save and Cancel controls as real `button` elements with clear accessible names.
  - [x] Add an inline edit validation message near the edit input that uses the existing copy: “Task title can’t be empty.”
  - [x] Preserve DOM-safe rendering for all non-editing task titles with `textContent`, not `innerHTML`.
- [x] Wire edit interactions in the existing app flow (AC: 1-6)
  - [x] Update `src/main.js` to handle `data-action="edit"` by entering edit mode for the selected task.
  - [x] Handle Save by validating the edit title, updating the task array, calling `saveTasks(tasks)`, re-rendering, and leaving edit mode.
  - [x] Handle Cancel by leaving edit mode without changing the task title, `updatedAt`, or localStorage.
  - [x] Do not save on invalid edit attempts.
  - [x] Keep the add-task form validation and persistence behavior from Stories 1.3 and 2.1 unchanged.
  - [x] Do not implement complete, delete, important toggle, dynamic Completed rendering, or important sorting in this story.
- [x] Preserve persistence behavior from Story 2.1 (AC: 3)
  - [x] Ensure valid edits save the full task array to localStorage under `smiple-todo.tasks`.
  - [x] Ensure refresh/reopen loads the edited title from storage.
  - [x] Keep invalid, missing, malformed, or unreadable stored data failing safely to an empty array.
  - [x] Do not add backend, network storage, account, analytics, telemetry, or service worker behavior.
- [x] Add focused tests without new dependencies (AC: 2, 3, 4, 5)
  - [x] Add or update Node tests for the task edit operation in `src/tasks.test.js`.
  - [x] Cover valid edit trimming, `updatedAt` refresh, unchanged `createdAt`, unchanged non-target tasks, and invalid empty/whitespace title rejection.
  - [x] Add render contract tests around any pure edit-mode view model helper if one is introduced.
  - [x] Keep using Node's built-in test runner; do not add jsdom, Vitest, React, or other dependencies.
- [x] Verify manually and with scripts (AC: 1-6)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify a saved active task can enter edit mode.
  - [x] Verify the edit input starts with the current title and does not lose the title when entering edit mode.
  - [x] Save a valid edited title, confirm it is trimmed, visible immediately, and persists after refresh.
  - [x] Try an empty or whitespace-only edit, confirm the title is unchanged, localStorage is not updated for that invalid attempt, and inline validation appears near the edit input.
  - [x] Correct the invalid edit and save successfully, confirming validation clears.
  - [x] Verify Cancel exits edit mode without changing the title or persistence.
  - [x] Verify keyboard flow reaches Edit, edit input, Save, and Cancel with visible focus and understandable focus movement.
  - [x] Verify HTML-like edited titles render as literal text after save and refresh.
  - [x] Verify add-task empty validation, valid add persistence, existing active controls, mobile width around 320–430px, and desktop width around 1024px+ are not regressed.

### Review Findings

- [x] [Review][Patch] Escape task id before using it in focus query selectors [src/main.js:98]

## Dev Notes

### Current Project State

- Story 2.1 is already implemented in the current codebase and story file, although `sprint-status.yaml` was stale before this story creation. Current source already includes `src/storage.js` with `storageKey`, `loadTasks(storage = globalThis.localStorage)`, and `saveTasks(tasks, storage = globalThis.localStorage)`.
- Current `src/main.js` imports `loadTasks` and `saveTasks`, initializes `let tasks = loadTasks();`, renders active tasks on startup, validates add-form submissions, saves the full task array after valid adds, and preserves add-input focus.
- Current `src/tasks.js` exports `taskModelFields`, `addTask(title)`, and `getActiveTasks(tasks)`. `addTask` trims titles, returns `null` for whitespace-only input, creates the approved schema, and uses ISO timestamps.
- Current `src/render.js` renders active tasks through `renderActiveTasks(tasks)`, derives active tasks via `getActiveTasks(tasks)`, preserves `li.task-item` and `data-task-id`, and creates action buttons with `data-action="complete"`, `data-action="toggle-important"`, `data-action="edit"`, and `data-action="delete"`.
- Current `src/validation.js` exports `emptyTaskMessage = "Task title can’t be empty."` and `validateTaskTitle(title)`. Edit validation must use this same helper/copy.
- Current tests use Node's built-in runner via `npm test` (`node --test src/**/*.test.js`). Existing dependency-free tests cover tasks, validation, render view-model behavior, and storage.

### Story Scope Boundaries

This story implements only editing existing active task titles. It must not implement:

- Completing tasks or moving them to Completed; Story 2.3 owns that.
- Deleting tasks; Story 2.4 owns that.
- Important task toggling, important sorting, or important styling; Epic 3 owns those.
- Dynamic Completed-section rendering beyond preserving existing static empty state.
- Backend, API, database, authentication, cloud sync, analytics, telemetry, service workers, routing, framework migration, or state-management libraries.
- Dependency upgrades, forced audit fixes, or generated build output edits.

### Architecture Requirements

- Use the existing Vite Vanilla JavaScript app with browser JavaScript, ES modules, and plain CSS.
- Keep source code in existing `src/` modules; do not create `components/`, `services/`, `api/`, `pages/`, or framework-style folders.
- Use camelCase for JavaScript variables/functions/object fields and kebab-case for CSS classes/files.
- Keep the single in-memory `tasks` array as the runtime source of truth.
- Follow the existing state flow: user event → validate input → update tasks → save tasks → render.
- Store all tasks as one JSON task array under localStorage key `smiple-todo.tasks`.
- Do not store separate active/completed arrays and do not store UI-only edit state in persisted task records.
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

- Store dates as ISO strings. A valid edit must refresh `updatedAt` and must not change `createdAt`.
- Treat task titles as user input whether they came from the add form, edit input, or localStorage.
- Render task titles using DOM APIs and `textContent`; never inject user-provided text with `innerHTML`.

### File-Specific Implementation Guidance

- `src/tasks.js`
  - Add the edit title operation here because task domain operations belong in this module.
  - Prefer returning a new task array with only the target task changed.
  - If task id is not found, return the original array or an unchanged equivalent without throwing.
  - Invalid edit input should not update the array; use a clear return shape or caller-visible signal so `main.js` can keep the edit UI open and show validation.
- `src/render.js`
  - Keep normal active task rendering for non-editing tasks.
  - Accept enough render state to identify the currently editing task and any edit validation message.
  - Keep existing action order and accessible labels for normal rows unless edit mode replaces that row's actions with Save/Cancel.
  - Use real labels or accessible names for edit input, Save, and Cancel controls.
  - Keep title wrapping and task row layout responsive; editing controls must not cause horizontal overflow.
- `src/main.js`
  - Own edit mode UI state, such as the current editing task id and validation message. Do not persist edit UI state.
  - Use event delegation on the active list if practical, matching the existing `data-action` pattern.
  - On entering edit mode, re-render and move focus to the edit input when possible.
  - On invalid Save, keep edit mode open, preserve the user's typed value, show inline validation, and keep focus understandable.
  - On valid Save, update `tasks`, call `saveTasks(tasks)`, clear edit mode, re-render, and ensure the updated title is visible.
  - On Cancel, clear edit mode and re-render without saving.
- `src/storage.js`
  - No new storage keys are needed.
  - Preserve strict schema validation and safe fallback behavior.
- `src/styles.css`
  - Extend existing Warm Minimal tokens and task styles for edit input, Save/Cancel actions, and inline edit validation.
  - Preserve distinctive font pairing, visible focus states, mobile-first layout, and subtle task interaction polish.
- `index.html`
  - No new static markup is expected for task row edit state; task rows should remain rendered by `src/render.js`.

### UX and Accessibility Requirements

- Editing must happen in context inside the task item; do not use modal navigation for MVP editing.
- The edit input must start with the current title so the user can correct it without retyping from memory.
- Save and Cancel must be keyboard reachable and use real buttons.
- Validation message must appear near the edit input, use the shared short copy, and be programmatically associated with the edit input.
- Invalid edit save must not clear the user's typed value.
- Focus must remain understandable: entering edit mode should focus the edit input; invalid save should keep the user near the edit input/message; valid save or cancel should return the user to a sensible place in the task row or list.
- Successful edit feedback is the updated title appearing immediately and persisting after refresh; no toast or modal is required.
- Secondary edit controls should be visible and accessible but should not visually overpower the task title or primary Add button.
- Preserve mobile usability: edit input and Save/Cancel controls must remain tappable and avoid horizontal overflow at 320–430px widths.

### Security and Privacy Requirements

- Do not trust edited titles or stored titles; treat them as user input.
- Use `validateTaskTitle(title)` to trim and reject empty/whitespace-only edits.
- Use `textContent` or equivalent safe DOM APIs when rendering edited titles.
- Verify HTML-like edited titles such as `<img src=x onerror=alert(1)>` render as literal text after save and refresh.
- Do not send task data over the network.
- Do not collect personal data.
- Do not add backend, cloud sync, analytics, telemetry, or service worker persistence.

### Previous Story Intelligence

- Story 2.1 implemented `loadTasks()` and `saveTasks(tasks)` in `src/storage.js`, strict saved-task schema validation, startup loading from storage, and save-after-valid-add behavior in `src/main.js`.
- Story 2.1 verified first load, valid add persistence, refresh restore, corrupt storage safe fallback, empty-title validation, HTML-like title text safety, and no XHR/fetch task storage.
- Story 1.4 established the active task row structure and future action buttons. Reuse the existing `data-action="edit"` button rather than adding a competing edit entry point.
- Story 1.4 used a pure `createActiveTaskViewModel(task)` helper for Node tests because Node has no DOM. Use the same dependency-free pattern if edit render contracts need testing.
- Epic 1 retrospective emphasized strict story scope, browser verification for UI acceptance, DOM-safe rendering for all user text, and dependency maintenance outside feature stories.

### Git Intelligence Summary

- Recent commits:
  - `b98e46a doc: add epic 1 retrospective`
  - `2234317 feat(story-2.1): persist tasks in browser storage`
  - `69c36c0 feat(story-1.4): render active tasks with controls`
  - `c7f765d doc: update doc`
  - `230332e Delete .agents directory`
- The current repository already contains Story 2.1 implementation code and tests. Do not recreate storage from scratch or duplicate persistence helpers.
- There were no unstaged Git changes at story creation time except the files created/updated by this create-story workflow.

### Testing Requirements

- Automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification is required because this story changes interactive task UI, focus behavior, validation behavior, and persistence after editing.
- Minimum manual checks:
  - App starts with Vite dev server.
  - Saved active tasks load from `smiple-todo.tasks` and can be edited.
  - Edit input contains current title on entry.
  - Valid save trims the title, refreshes `updatedAt`, updates the visible row, persists to localStorage, and survives refresh.
  - Empty/whitespace-only save keeps edit mode open, preserves typed value, shows inline validation near the edit input, and does not persist the invalid title.
  - Correcting invalid input then saving clears validation and persists the corrected title.
  - Cancel exits edit mode without changing the title or localStorage.
  - Keyboard-only flow can reach Edit, edit input, Save, and Cancel with visible focus.
  - HTML-like edited title renders as literal text after save and refresh.
  - Existing add valid, add invalid, active empty state, persisted load, corrupt storage fallback, and existing task controls are not regressed.
  - Mobile widths around 320–430px have no horizontal overflow and keep edit controls tappable.
  - Desktop width around 1024px+ remains centered and readable.

## Project Structure Notes

- Keep task domain changes in `src/tasks.js`, persistence in `src/storage.js`, rendering in `src/render.js`, orchestration in `src/main.js`, validation in `src/validation.js`, and styling in `src/styles.css`.
- Do not create alternate render roots, duplicate task arrays, separate persisted active/completed lists, or UI-state fields on task objects.
- Do not edit `node_modules/` or generated build output.
- Do not update dependencies or run forced audit fixes as part of this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L320-L356) — Story 2.2 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L74-L82) — FR-9 and FR-10 edit title requirements.
- [_bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md](../planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md#L121-L127) — user journey for correcting a task after creating it.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L211-L249) — task schema, localStorage persistence, and validation strategy.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L285-L320) — frontend rendering and state-driven update pattern.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L493-L529) — `data-action`, `data-task-id`, and single runtime state source rules.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L741-L780) — local persistence flow and module responsibilities.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L510-L518) — task item edit state and action accessibility.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L550-L558) — inline validation message behavior.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L624-L637) — add/edit validation consistency.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L708-L764) — responsive and accessibility requirements.
- [_bmad-output/implementation-artifacts/2-1-persist-tasks-in-browser-storage.md](2-1-persist-tasks-in-browser-storage.md) — previous story implementation notes and persistence patterns.
- [_bmad-output/implementation-artifacts/epic-1-retro-2026-05-23.md](epic-1-retro-2026-05-23.md) — retrospective lessons for Epic 2 readiness.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` red: missing `editTaskTitle` export before domain implementation.
- `npm test` red: missing `createEditingTaskViewModel` export before render implementation.
- `npm test` green: 16 tests passing after domain, render, and main-flow implementation.
- `npm run build` green: Vite production build completed successfully.
- Browser verification: Vite dev server at `http://127.0.0.1:5178/` verified edit entry, valid save, invalid validation, correction, cancel, refresh persistence, HTML-like title text safety, keyboard reachability, no XHR/fetch storage, and mobile-width layout.
- Browser console showed only the known unrelated 404 resource messages during dev-server verification.

### Completion Notes List

- Added immutable task title editing through `editTaskTitle`, preserving schema and refreshing only `updatedAt` on valid edits.
- Added active-row edit rendering with current-title input, Save/Cancel buttons, associated inline validation, and DOM-safe title output.
- Wired delegated edit, save, and cancel interactions in the existing main flow, including localStorage persistence for valid edits only.
- Added Warm Minimal editing-state styles without introducing dependencies or out-of-scope task actions.
- Verified acceptance criteria with automated tests, production build, and browser checks.

### File List

- `src/tasks.js`
- `src/tasks.test.js`
- `src/render.js`
- `src/render.test.js`
- `src/main.js`
- `src/styles.css`
- `_bmad-output/implementation-artifacts/2-2-edit-existing-task-titles.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-05-23: Implemented Story 2.2 edit existing task titles and moved story to review.
