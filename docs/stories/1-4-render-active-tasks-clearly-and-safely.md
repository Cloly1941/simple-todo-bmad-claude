# Story 1.4: Render Active Tasks Clearly and Safely

Status: done

## Story

As a student or employee,
I want active tasks to be shown in a readable list with clear controls,
so that I can scan what still needs attention.

## Acceptance Criteria

1. Given active tasks exist, when the Active section renders, then each active task appears as a readable task item, and the task title remains the visually dominant element.
2. Given an active task is displayed, when the user views the task row, then the task shows its completion state, and available task controls are visible or discoverable without complex menus or gestures.
3. Given active tasks are displayed, when the user navigates by keyboard, then each task control can receive focus in a logical order, and visible focus styling is present.
4. Given the Active list is empty, when there are no active tasks, then the Active empty state reads “No active tasks yet. Add a task above.”, and the empty state does not appear as an error.
5. Given the page is viewed on a narrow mobile width, when active task rows are displayed, then task content remains readable, and controls remain tappable without making the row feel cluttered.

## Tasks / Subtasks

- [x] Upgrade active task item structure for clear task scanning (AC: 1, 2)
  - [x] Update `src/render.js` `createActiveTaskItem(task)` to render a semantic, DOM-safe task item with the title as the dominant text.
  - [x] Keep using `textContent` for `task.title`; do not use `innerHTML` for user-provided task text.
  - [x] Preserve `li.task-item` and `data-task-id` so later stories can wire task actions without replacing the item pattern.
  - [x] Keep the existing “Active” state visible or accessible on each active task.
- [x] Add visible, keyboard-focusable task controls without implementing future mutations (AC: 2, 3)
  - [x] Add clear controls for upcoming task actions using stable action identifiers: `data-action="complete"`, `data-action="toggle-important"`, `data-action="edit"`, and `data-action="delete"`.
  - [x] Give each control a clear accessible name that identifies the target task where useful, such as “Complete task: {title}”.
  - [x] Use real `button` elements so controls are keyboard reachable and activatable by default.
  - [x] Do not wire completion, importance, edit, or delete behavior in `src/main.js`; those are owned by later stories.
- [x] Style active task rows with the existing Warm Minimal design system (AC: 1, 2, 3, 5)
  - [x] Update `src/styles.css` so the task title is visually dominant and controls are secondary but visible.
  - [x] Add or refine task action button styles with visible `:focus-visible`, hover, and active states.
  - [x] Preserve existing CSS custom properties, distinctive font pairing, Warm Minimal tone, and subtle task micro-animation.
  - [x] Ensure narrow widths around 320–430px keep titles readable and controls tappable without horizontal overflow.
- [x] Preserve active-list empty behavior and existing add-task behavior (AC: 4)
  - [x] Keep `renderActiveTasks(tasks)` deriving active tasks through `getActiveTasks(tasks)`.
  - [x] Keep the Active empty state text exactly: “No active tasks yet. Add a task above.”
  - [x] Ensure valid task creation from Story 1.2 and inline validation from Story 1.3 still work unchanged.
- [x] Add focused render tests for safe, accessible active task output (AC: 1, 2, 3, 4)
  - [x] Add lightweight Node tests for `renderActiveTasks` using the existing `node --test src/**/*.test.js` pattern if practical without adding dependencies.
  - [x] If DOM testing is not practical without dependencies, add tests around pure helpers only if new helpers are introduced, and rely on browser verification for DOM behavior.
  - [x] Do not introduce a new test framework or DOM library dependency for this story.
- [x] Verify manually and with scripts (AC: 1-5)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify in the browser that adding a valid task renders a readable active item with visible controls.
  - [x] Verify keyboard tab order reaches the add input, Add button, then each task control in a logical order.
  - [x] Verify visible focus styling on every task control.
  - [x] Verify empty Active state appears only when there are no active tasks and keeps the required copy.
  - [x] Verify task titles containing HTML-like text render as text, not markup.
  - [x] Verify mobile width around 320–430px has no horizontal overflow and controls remain tappable.
  - [x] Verify desktop width around 1024px+ remains centered and readable.

## Dev Notes

### Current Project State

- Story 1.3 is complete and implemented add-form inline validation. Current valid submit flow in `src/main.js` validates title, calls `addTask(validation.value)`, appends to the single in-memory `tasks` array, calls `renderActiveTasks(tasks)`, clears the input, and keeps focus on the input.
- Current `src/render.js` renders active tasks only as `li.task-item` with a text “Active” status span and a `span.task-title`. Story 1.4 should enrich this item structure and keep DOM-safe rendering.
- Current `src/styles.css` already has Warm Minimal tokens, distinctive font pairing (`Georgia` display and `Trebuchet MS` body), task item animation, responsive layout, visible input/button focus styles, and validation styling.
- Current `index.html` already contains the add-task form, associated validation message, Active section, `data-active-empty`, `data-active-list`, and Completed empty section. No structural HTML change is expected unless required for accessibility.
- Current `src/tasks.js` defines the approved task schema and `getActiveTasks(tasks)`. Do not change schema or add future task operations for this story.
- Current `package.json` uses Vite 5.4.x and Node's built-in test runner via `npm test`.

### Story Scope Boundaries

This story is about rendering active tasks clearly and safely. It must not implement:

- Completing tasks or moving them to Completed; Story 2.3 owns that.
- Marking/unmarking important or sorting important tasks; Epic 3 owns that.
- Editing task titles; Story 2.2 owns that.
- Deleting tasks; Story 2.4 owns that.
- localStorage persistence; Story 2.1 owns that.
- Backend, API, authentication, cloud sync, analytics, telemetry, service workers, framework migration, or dependency upgrades.

Controls may be rendered now for clarity and accessibility, but their mutation behavior must remain unimplemented until their owning stories.

### Architecture Requirements

- Use the existing Vite Vanilla JavaScript app with browser JavaScript, ES modules, and plain CSS.
- Keep the MVP client-only with no backend, authentication, database, API, cloud sync, analytics, or network task storage.
- Keep source code in the existing files under `src/`: `main.js`, `tasks.js`, `storage.js`, `render.js`, `validation.js`, and `styles.css`.
- Use camelCase for JavaScript variables/functions/object fields and kebab-case for CSS classes/files.
- Preserve the single in-memory `tasks` array as the runtime source of truth.
- Continue deriving Active tasks from the task array; do not store separate active/completed arrays.
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

- Store dates as ISO strings. Do not add schema fields for UI-only display.
- Never render user-provided task titles through raw HTML insertion.

### File-Specific Implementation Guidance

- `src/render.js`
  - Primary file for this story.
  - Keep `renderActiveTasks(tasks)` responsible for updating `[data-active-list]`, `[data-active-empty]`, and hidden states.
  - Expand `createActiveTaskItem(task)` to create a readable task row/card with DOM APIs.
  - Recommended structure: item container, status/control area, title/content area, action button group.
  - Keep `data-task-id` on the `li` and add `data-action` values on buttons for future stories.
  - Use accessible names for controls and avoid icon-only buttons without labels.
- `src/styles.css`
  - Primary styling file for this story.
  - Refine `.task-item`, `.task-title`, `.task-status`, and add task action styles such as `.task-actions` and `.task-action` if needed.
  - Keep mobile-first behavior and avoid fixed widths that cause horizontal overflow.
  - Keep title wrapping robust with `min-width: 0` and `overflow-wrap: anywhere`.
  - Ensure all task action buttons have visible focus styles, not only hover styles.
- `src/main.js`
  - Avoid wiring task action behavior in this story.
  - Existing add-form validation and valid task creation flow should remain unchanged.
- `src/tasks.js`
  - Avoid schema changes and future operations.
  - Keep `getActiveTasks(tasks)` as the active selector.
- `index.html`
  - Preserve Active empty-state copy and existing form validation markup.
  - No task row markup belongs in `index.html`; active task rows should remain rendered by `src/render.js`.

### UX and Accessibility Requirements

- Task title must remain the visually dominant element in each active task item.
- Controls must be visible or discoverable without complex menus, hidden gestures, hover-only reveal, or modal flows.
- Use semantic `button` controls for task actions.
- Keyboard focus order should follow the visible task row workflow.
- Every interactive control must have a visible focus state.
- Important, completion, edit, and delete controls must have clear accessible names even if their behavior is not wired yet.
- Active empty state is a calm empty state, not an error.
- On narrow mobile widths, task text must remain readable and action controls must remain tappable without horizontal scrolling.
- Preserve Warm Minimal tone: calm warm surfaces, rounded controls, readable spacing, restrained emphasis, and subtle micro-animations.

### Security Requirements

- Treat task titles as user input.
- Continue using DOM creation and `textContent` for task titles.
- Do not add `innerHTML` with task data.
- Do not send task data over the network.
- Do not add third-party dependencies for rendering, icons, or tests.

### Previous Story Intelligence

- Story 1.3 established `validateTaskTitle(title)` in `src/validation.js`, accessible inline validation in `index.html`, and validation UI toggling in `src/main.js`. Do not regress these behaviors while changing task rendering.
- Story 1.3 browser verification used Vite and Chrome DevTools, and only found an unrelated `favicon.ico` 404. This story also requires browser verification because it changes interactive UI.
- Story 1.3 modified `index.html`, `src/main.js`, `src/styles.css`, `src/validation.js`, and `src/validation.test.js`. Story 1.4 should primarily build on `src/render.js` and `src/styles.css`.
- Story 1.2 established safe active task rendering through DOM creation and `textContent`, plus the single in-memory `tasks` array in `src/main.js`. Preserve both.
- Existing tests use Node's built-in runner; do not add a new test framework.

### Git Intelligence Summary

- Recent commits:
  - `c7f765d doc: update doc`
  - `230332e Delete .agents directory`
  - `a6b2bb9 feat(story-1.3): add inline task validation`
  - `ce5faa2 feat(story-1.2): add active task creation`
  - `f6514dc init prj`
- Story 1.3 changed validation-related files only and did not add task controls.
- No recent commit indicates localStorage, edit, complete, delete, or important behavior has been implemented yet.

### Testing Requirements

- Automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification is required because this story changes rendered task controls and responsive interaction.
- Minimum manual checks:
  - App starts with Vite dev server.
  - Page loads without relevant console errors.
  - Valid task creation renders an active task item immediately.
  - Task title is visually dominant and wraps safely for long text.
  - Task controls are visible, keyboard reachable, and show visible focus.
  - HTML-like task title text such as `<img src=x onerror=alert(1)>` renders as literal text.
  - Empty Active state appears with exactly “No active tasks yet. Add a task above.” when there are no active tasks.
  - Story 1.3 invalid empty-title validation still works.
  - Mobile width around 320–430px remains readable with no horizontal overflow.
  - Desktop width around 1024px+ remains centered/readable.

## Project Structure Notes

- The current project matches the approved Vite Vanilla structure. Do not create `components/`, `pages/`, `services/`, `routes/`, backend folders, or framework-specific directories.
- Update existing files instead of creating alternate task-rendering modules.
- Do not edit `node_modules/` or generated build output.
- Do not update dependencies or run forced audit fixes as part of this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L249-L281) — Story 1.4 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L74-L103) — UX design, accessibility, task item, active list, and empty state requirements.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L245-L249) — title validation rules to preserve.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L251-L267) — no auth/backend and DOM-safe title rendering security requirements.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L285-L320) — frontend rendering and sorting patterns.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L494-L512) — stable `data-action` and `data-task-id` event patterns.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L513-L529) — single runtime state source and state update flow.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L617-L687) — project structure and module boundaries.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L509-L527) — Task Item and Active Task List component requirements.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L590-L608) — button hierarchy for secondary, destructive, completion, and important actions.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L763) — responsive and accessibility requirements.
- [_bmad-output/implementation-artifacts/1-3-prevent-empty-task-creation-with-inline-validation.md](1-3-prevent-empty-task-creation-with-inline-validation.md) — previous story implementation notes and established validation behavior.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` initially failed in red phase because `createActiveTaskItem` was not exported, confirming the render tests caught missing Story 1.4 behavior.
- `npm test` then failed because Node's built-in test environment has no DOM; implementation was refactored to expose a pure `createActiveTaskViewModel(task)` helper for dependency-free render contract tests.
- `npm test` passed after implementation: 8 tests passing with Node's built-in test runner.
- `npm run build` passed with Vite 5.4.21.
- Browser verification completed at `http://127.0.0.1:5176/` using Chrome DevTools MCP.
- Browser console showed only a resource 404, consistent with the existing unrelated missing favicon behavior.

### Completion Notes List

- Implemented active task rendering with a richer DOM-safe task item structure that preserves `li.task-item`, `data-task-id`, visible Active status, and title rendering through `textContent`.
- Added visible future action buttons for complete, important, edit, and delete using stable `data-action` values and task-specific accessible names, without wiring mutation behavior.
- Added `createActiveTaskViewModel(task)` and Node tests covering title preservation, active status, action order, and accessible labels without introducing DOM test dependencies.
- Updated Warm Minimal task row styling so task titles remain dominant, controls are secondary but visible, focus states are clear, actions wrap on narrow widths, and touch target height remains comfortable.
- Verified valid task creation still renders immediately, empty Active state behavior remains correct, Story 1.3 validation still works, HTML-like task titles render as literal text, keyboard tab order reaches every task control, and desktop/mobile layouts remain readable without horizontal overflow.

### File List

- `src/render.js`
- `src/render.test.js`
- `src/styles.css`

### Change Log

- 2026-05-23: Implemented Story 1.4 active task item rendering, future action controls, render contract tests, responsive task action styling, build, and browser verification.
