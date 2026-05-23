# Story 1.2: Add Valid Tasks to Active List

Status: done

## Story

As a student or employee,
I want to enter a task title and add it to my active list,
so that I can capture work before I forget it.

## Acceptance Criteria

1. Given the app is open, when the user enters a non-empty task title and submits the add-task form, then a new task is created with `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt` fields, and the task title is trimmed before being stored.
2. Given a valid task is submitted, when the task is created, then it appears immediately in the Active section, and it is shown as not completed by default.
3. Given a valid task is submitted, when the Active section updates, then the task input is cleared, and the Active empty state is no longer shown.
4. Given multiple valid tasks have been added, when the Active list is rendered, then all active tasks are visible in a clear list, and each task displays its title and completion state.
5. Given a task title contains user-entered text, when the task is rendered, then the title is displayed using DOM-safe text rendering, and user-provided title text is not inserted as raw HTML.

## Tasks / Subtasks

- [x] Implement task creation in the existing app flow (AC: 1, 2)
  - [x] Update `src/tasks.js` to export an `addTask(title)` operation or equivalent task factory that returns a task with exactly `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt`.
  - [x] Trim the title before storing it.
  - [x] Set new tasks to `completed: false` and `important: false` by default.
  - [x] Generate `id` client-side without adding dependencies.
- [x] Wire the existing add-task form to runtime state (AC: 1, 2, 3)
  - [x] Update `src/main.js` so form submit prevents page reload, reads `#task-title`, creates a task, updates the single in-memory `tasks` array, and re-renders.
  - [x] Clear the input only after successful valid creation.
  - [x] Do not implement empty-title inline validation messaging in this story; that belongs to Story 1.3.
- [x] Render active tasks from state (AC: 2, 3, 4, 5)
  - [x] Update `index.html` only as needed to provide stable Active-list container hooks, such as a list element and empty-state element.
  - [x] Update `src/render.js` to render active tasks into the Active section from the task array.
  - [x] Hide or remove the Active empty state when at least one active task exists.
  - [x] Ensure each task visibly communicates its incomplete/active status.
  - [x] Use DOM creation and `textContent` for user-provided task titles; do not use `innerHTML` with task data.
- [x] Preserve the existing Story 1.1 shell behavior (AC: 2, 3, 4)
  - [x] Keep the Warm Minimal shell, centered responsive layout, add-task area, Active section, and Completed section intact.
  - [x] Keep Completed as an empty section in this story; completion behavior is not in scope until Story 2.3.
  - [x] Keep keyboard reachability and visible focus styles for the add input and Add button.
- [x] Add minimal task-item styling consistent with the existing design (AC: 4)
  - [x] Extend `src/styles.css` with readable active task list/item styles.
  - [x] Keep the task title visually dominant and controls minimal; do not add edit, complete, delete, or important controls in this story unless only a non-functional status label is needed for AC clarity.
  - [x] Preserve mobile readability and avoid horizontal overflow.
- [x] Verify manually and with build (AC: 1-5)
  - [x] Run the Vite dev server and add one valid task.
  - [x] Confirm the task appears immediately in Active and the input clears.
  - [x] Add multiple valid tasks and confirm all are visible.
  - [x] Add a title containing HTML-like text such as `<img src=x onerror=alert(1)>` and confirm it renders as text, not markup.
  - [x] Confirm the Active empty state disappears after a task is added and Completed remains unchanged.
  - [x] Confirm keyboard submit works from the input and focus styles remain visible.
  - [x] Run `npm run build` successfully.

### Review Findings

- [x] [Review][Patch] Guard submit wiring against missing input before mutating it [src/main.js:22] — `taskTitleInput?.value` is guarded when reading, but `taskTitleInput.value = ""` and `taskTitleInput.focus()` are unconditional. If the input selector ever fails while the form exists, submitting the form throws instead of failing safely.

## Dev Notes

### Current Project State

- Story 1.1 is complete and accepted as done. It created the Vite Vanilla JavaScript shell with `index.html`, `package.json`, `package-lock.json`, and source modules under `src/`.
- Current runtime behavior in `src/main.js` only imports `styles.css` and prevents the add form from reloading the page. Real task creation is not implemented yet.
- Current module placeholders:
  - `src/tasks.js` exports `taskModelFields` with the approved fields.
  - `src/storage.js` exports `storageKey = "smiple-todo.tasks"`; persistence is not in scope for this story.
  - `src/render.js` exports `getAppRoot()` only.
  - `src/validation.js` exports `emptyTaskMessage`; empty-title validation behavior is Story 1.3.
- The existing static shell already contains the app title, add form, Active section, Completed section, empty-state copy, Warm Minimal CSS tokens, responsive centered layout, and visible focus styles. Extend these files; do not replace the shell wholesale.

### Story Scope Boundaries

This story implements only valid task creation and active-list rendering. It must not implement:

- Inline empty-title validation messages or invalid input states; Story 1.3 owns this.
- localStorage load/save behavior; Story 2.1 owns persistence.
- Editing task titles; Story 2.2 owns editing.
- Completing tasks or moving tasks to Completed; Story 2.3 owns completion.
- Deleting tasks; Story 2.4 owns deletion.
- Important toggling, important sorting, or important styling; Epic 3 owns importance.
- Backend, API, authentication, cloud sync, analytics, telemetry, service workers, framework migration, or automated test framework setup.

### Architecture Requirements

- Use the existing Vite Vanilla JavaScript app with browser JavaScript, ES modules, and plain CSS.
- Keep the MVP client-only with no backend, authentication, database, API, cloud sync, analytics, or network task storage.
- Keep source code in the existing files under `src/`: `main.js`, `tasks.js`, `storage.js`, `render.js`, `validation.js`, and `styles.css`.
- Use camelCase for JavaScript variables/functions/object fields and kebab-case for CSS classes/files.
- Keep a single in-memory `tasks` array as the runtime source of truth for this story.
- Follow the flow for this story: user event → create/update state → render. Persistence and validation will be added in later stories.
- Task objects must use this exact schema:

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

- Store dates as ISO strings. For a newly created task, `createdAt` and `updatedAt` may be the same timestamp.
- Do not store or render separate persisted active/completed arrays. Active tasks should be derived from `tasks.filter((task) => !task.completed)`.

### File-Specific Implementation Guidance

- `index.html`
  - Add stable hooks for rendering active tasks. Prefer semantic list markup such as a `<ul>` or `<div role="list">` inside the existing Active section.
  - Preserve the existing empty-state copy: “No active tasks yet. Add a task above.”
  - Preserve the Completed section and its empty state: “No completed tasks yet.”
- `src/main.js`
  - Own app initialization and event wiring.
  - Keep the add-form submit handler here.
  - Maintain the runtime `tasks` array here or in a clearly centralized module; avoid competing state sources.
  - After a successful valid submit, update state, call render, and clear the input.
- `src/tasks.js`
  - Own task creation and selectors.
  - Build on the existing `taskModelFields` export if useful; do not create a conflicting schema.
  - Recommended exports: `addTask(title)` and `getActiveTasks(tasks)`.
- `src/render.js`
  - Own DOM output for the Active list.
  - Use `document.createElement`, attributes, and `textContent` for task titles.
  - Do not use `innerHTML` with user-provided title text.
  - Do not mutate task records while rendering.
- `src/styles.css`
  - Add minimal `.task-list`, `.task-item`, `.task-title`, and status styling that matches the existing Warm Minimal tokens.
  - Keep task rows readable on 320px+ mobile widths.
- `src/storage.js`
  - Leave persistence behavior unimplemented unless needed as a placeholder import. Story 2.1 will use `storageKey = "smiple-todo.tasks"`.
- `src/validation.js`
  - Do not build the full validation UI yet. For this story, valid submissions are the path under test. If trimming results in an empty string, safely do nothing and leave the typed value for Story 1.3 behavior.

### UX and Accessibility Requirements

- The add-task form remains accessible with a visible label, keyboard-reachable Add button, and visible focus states.
- Active tasks should render in a clear list below the Active heading.
- Task title should be the dominant text in each rendered item.
- Each active task should communicate completion state as not completed. Because completion controls are out of scope, use a simple non-interactive text/status treatment if needed.
- Do not hide core interactions behind complex menus or gestures.
- Keep the Warm Minimal visual direction: calm light surfaces, generous spacing, rounded controls, restrained emphasis.
- The layout must remain readable and centered at desktop widths and usable at narrow mobile widths.

### Security Requirements

- Treat task titles as user input.
- Never insert task titles through raw HTML.
- The verification step must include an HTML-like task title to prove the rendered output is text-safe.
- Do not send task data over the network.

### Previous Story Intelligence

- Story 1.1 established that UI changes must be manually verified in the browser, not only via build.
- Story 1.1 intentionally left `tasks.js`, `storage.js`, `render.js`, and `validation.js` as minimal placeholders. This story should fill only the task-creation and active-rendering responsibilities, not future feature behavior.
- Story 1.1 noted moderate Vite audit findings. Do not run `npm audit fix --force` or upgrade Vite as part of this story; dependency maintenance is outside scope.
- Story 1.1 used Vite 5.4.21 successfully for `npm run build`.
- The last git commit is only `f6514dc init prj`; rely on current files and Story 1.1 notes for implementation patterns.

### Testing Requirements

- Manual browser verification is required because this story changes interactive UI behavior.
- Minimum manual checks:
  - App starts with Vite dev server.
  - Page loads without console errors.
  - Submitting a valid title from the add form creates one active task immediately.
  - The stored/rendered title is trimmed.
  - The input clears after valid creation.
  - Multiple valid tasks remain visible in Active.
  - Active empty state is hidden once active tasks exist.
  - Completed empty state remains visible and unchanged.
  - An HTML-like task title renders as literal text.
  - Keyboard submission from the input works.
  - Mobile width around 320–430px remains readable.
  - Desktop width around 1024px+ remains centered/readable.
- Run `npm run build` and resolve any failures without bypassing checks.
- No automated test framework is required for this story.

## Project Structure Notes

- The current project already matches the approved structure. Do not create `components/`, `pages/`, `services/`, `routes/`, backend folders, or framework-specific directories.
- Update existing files instead of creating alternate task modules or duplicate render roots.
- `node_modules/` exists locally but must not be edited.

## References

- [\_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L184-L214) — Story 1.2 source requirements and acceptance criteria.
- [\_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L1-L92) — requirements inventory, architecture constraints, UX requirements, and FR coverage.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L121-L178) — Vite Vanilla JavaScript starter decision and expected development scripts.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L211-L249) — approved task schema and localStorage strategy.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L281-L334) — frontend architecture, state-driven rendering, and flow.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L384-L425) — naming conventions.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L426-L461) — project organization and file responsibilities.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L548-L576) — DOM event and state management patterns.
- [\_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L617-L646) — complete project directory structure.
- [\_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L640-L704) — screen structure, task entry flow, empty states, and responsive layout.
- [\_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L749) — accessibility requirements.
- [\_bmad-output/implementation-artifacts/1-1-initialize-static-todo-app-shell.md](1-1-initialize-static-todo-app-shell.md) — previous story implementation notes and file list.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` initially failed before implementation because `addTask` was not exported, confirming the red test state.
- `npm test` passed after implementation: 3 tests passing with Node's built-in test runner.
- `npm run build` passed with Vite 5.4.21.
- Browser verification completed at `http://127.0.0.1:5174/` using Chrome DevTools MCP.
- Browser console showed only a `favicon.ico` 404, unrelated to story functionality.

### Completion Notes List

- Implemented `addTask(title)` with trimmed titles, approved task schema, default active/non-important state, ISO timestamps, and dependency-free client-side IDs.
- Added `getActiveTasks(tasks)` selector and Node unit tests for task creation, whitespace handling, and active task derivation.
- Wired the existing add-task form to a single in-memory task array; valid submits render immediately, clear the input, and keep focus in the input.
- Added semantic Active-list render hooks and DOM-safe rendering via created elements and `textContent`.
- Applied frontend-design direction to HTML/CSS work with CSS variables, distinctive serif/display typography, cohesive warm editorial palette, bold button treatment, task item animation, and responsive no-overflow layout.
- Verified valid add, multiple tasks, keyboard submit, input clearing, hidden Active empty state, unchanged Completed empty state, HTML-like title rendered as text, desktop layout, and mobile no-overflow behavior.

### File List

- `index.html`
- `package.json`
- `src/main.js`
- `src/render.js`
- `src/styles.css`
- `src/tasks.js`
- `src/tasks.test.js`

### Change Log

- 2026-05-23: Implemented Story 1.2 valid task creation, Active-list rendering, frontend-design styling, tests, build, and browser verification.
- 2026-05-23: Addressed code review findings by reverting unrelated `.gitignore` additions and guarding add-form input access.
