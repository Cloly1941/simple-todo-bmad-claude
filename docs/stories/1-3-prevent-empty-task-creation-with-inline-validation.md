# Story 1.3: Prevent Empty Task Creation with Inline Validation

Status: done

## Story

As a student or employee,
I want the app to reject empty task titles with a clear inline message,
so that I understand what to fix without losing my flow.

## Acceptance Criteria

1. Given the app is open, when the user submits an empty task title, then no task is created, and an inline validation message appears near the add-task input.
2. Given the user enters only whitespace, when the user submits the add-task form, then no task is created, and the validation message explains that the task title cannot be empty.
3. Given an invalid task title was submitted, when validation fails, then the user's typed value is not reset, and the user can correct the title and submit again.
4. Given the validation message is visible, when the user enters a valid task title and submits, then the task is created successfully, and the validation message is cleared.
5. Given the validation message is shown, when assistive technology reads the form, then the message is programmatically associated with the relevant input, and the error state does not rely on color alone.

## Tasks / Subtasks

- [x] Implement shared add-title validation behavior (AC: 1, 2, 3, 4)
  - [x] Update `src/validation.js` to export a small title validation helper, such as `validateTaskTitle(title)`, that trims input and returns enough information for callers to distinguish valid from invalid values.
  - [x] Keep the existing `emptyTaskMessage = "Task title can’t be empty."` copy as the user-facing validation message.
  - [x] Do not duplicate trimming rules inconsistently between `validation.js` and `tasks.js`; title normalization must remain equivalent to task creation behavior.
- [x] Wire invalid add-task submits to inline validation (AC: 1, 2, 3)
  - [x] Update `src/main.js` so empty and whitespace-only submits do not append to the `tasks` array and do not call `renderActiveTasks` as a successful mutation.
  - [x] Preserve the user's typed value after invalid submission, including whitespace-only text, so they can correct it without losing flow.
  - [x] Keep the input focused after invalid submission.
  - [x] Preserve successful valid task creation behavior from Story 1.2: create task, append to the single in-memory `tasks` array, render Active, clear input, and keep focus usable.
- [x] Add accessible inline validation markup to the existing add form (AC: 1, 5)
  - [x] Update `index.html` only as needed to add a validation message element near the task input.
  - [x] Associate the task input with both helper and validation text using `aria-describedby` when appropriate.
  - [x] Add an invalid/error state to the input using `aria-invalid` only when validation is failing.
  - [x] Ensure the validation message is hidden by default and becomes available to assistive technology when visible.
- [x] Style validation states using the existing Warm Minimal design system (AC: 1, 2, 5)
  - [x] Extend `src/styles.css` with `.validation-message` and invalid input styling that uses existing error/focus tokens.
  - [x] Ensure the error state does not rely on color alone; include visible message text and input association.
  - [x] Preserve distinctive typography, CSS custom properties, task micro-animations, responsive layout, and visible focus styles required by the project UI standard.
- [x] Add or update lightweight tests for validation logic (AC: 1, 2, 4)
  - [x] Add `src/validation.test.js` or extend existing tests to cover empty string, whitespace-only string, and valid title behavior.
  - [x] Keep tests on Node's built-in test runner pattern already used by `src/tasks.test.js`; do not introduce a new test framework.
- [x] Verify manually and with scripts (AC: 1-5)
  - [x] Run `npm test` and resolve failures.
  - [x] Run `npm run build` and resolve failures.
  - [x] Start the Vite dev server and verify in the browser that empty submit shows the inline message and creates no task.
  - [x] Verify whitespace-only submit shows “Task title can’t be empty.”, preserves the typed value, and creates no task.
  - [x] Verify correcting the invalid input to a valid title creates the task, clears the validation message, clears the input, and renders the task in Active.
  - [x] Verify the input exposes the validation state through `aria-invalid` and an associated message when invalid.
  - [x] Verify keyboard submission still works and visible focus styling remains clear.
  - [x] Verify the app remains readable at narrow mobile widths around 320–430px and desktop widths around 1024px+.

## Dev Notes

### Current Project State

- Story 1.2 is complete and current sprint status has it in review. It implemented valid task creation, Active-list rendering, frontend-design styling, Node tests, Vite build, and browser verification.
- Current `src/main.js` imports `renderActiveTasks` and `addTask`, maintains a single in-memory `tasks` array, renders on startup, and handles `.add-task-form` submit.
- Current invalid behavior in `src/main.js`: it calls `addTask(taskTitleInput.value)`, and if `addTask` returns `null`, the handler returns without creating a task, clearing input, or showing validation. Story 1.3 adds only the missing inline validation and accessible invalid state.
- Current `src/validation.js` only exports `emptyTaskMessage = "Task title can’t be empty."`. Build on this file for validation behavior instead of adding validation logic directly to unrelated modules.
- Current `src/tasks.js` exports `addTask(title)`, `getActiveTasks(tasks)`, and `taskModelFields`. `addTask` trims the title, returns `null` for whitespace-only titles, and creates task objects with exactly `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt`.
- Current `src/render.js` safely renders active tasks using DOM creation and `textContent`; it hides the Active empty state when active tasks exist. This story should not change task item responsibilities unless required for validation integration.
- Current `index.html` has the add-task form, `#task-title` input, helper text `#task-helper`, Add button, Active list hooks, and Completed empty section. The likely HTML change is adding a validation message element near the input and associating it with the input.
- Current `src/styles.css` already defines `--color-error`, focus styles, Warm Minimal tokens, responsive layout, and task item animations. Extend these patterns rather than replacing the visual system.
- `package.json` already has `npm test` using Node's built-in runner: `node --test src/**/*.test.js`, plus `npm run build` using Vite.

### Story Scope Boundaries

This story implements only add-form empty-title validation. It must not implement:

- Editing task titles or edit validation; Story 2.2 owns editing.
- localStorage load/save behavior; Story 2.1 owns persistence.
- Completing tasks or moving tasks to Completed; Story 2.3 owns completion.
- Deleting tasks; Story 2.4 owns deletion.
- Important toggling, sorting, or styling; Epic 3 owns importance.
- New task row controls; Story 1.4 and later task-management stories own richer controls.
- Backend, API, authentication, cloud sync, analytics, telemetry, service workers, framework migration, or broad dependency upgrades.

### Architecture Requirements

- Use the existing Vite Vanilla JavaScript app with browser JavaScript, ES modules, and plain CSS.
- Keep the MVP client-only with no backend, authentication, database, API, cloud sync, analytics, or network task storage.
- Keep source code in the existing files under `src/`: `main.js`, `tasks.js`, `storage.js`, `render.js`, `validation.js`, and `styles.css`. A new `src/validation.test.js` is acceptable because `package.json` already supports `src/**/*.test.js`.
- Use camelCase for JavaScript variables/functions/object fields and kebab-case for CSS classes/files.
- Preserve the single in-memory `tasks` array as the runtime source of truth.
- Continue the flow for this stage: user event → validate input → update state on valid submit → render. Persistence remains out of scope until Story 2.1.
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

- Store dates as ISO strings. Do not change task schema or introduce derived active/completed arrays.
- Do not use `innerHTML` with user-provided task title text.

### File-Specific Implementation Guidance

- `index.html`
  - Add a validation message element close to the add-task input, preferably inside the existing `.add-task-form` after the input row or near `#task-helper`.
  - Preserve existing text and structure unless needed for accessibility.
  - Keep the Active empty-state copy: “No active tasks yet. Add a task above.”
  - Keep the Completed empty-state copy: “No completed tasks yet.”
  - Associate `#task-title` with helper and validation descriptions. When invalid, `aria-invalid="true"` should be present or set by JavaScript; when valid/neutral it should be absent or `false`.
- `src/validation.js`
  - Own reusable add/edit title validation rules, even though this story only wires the add form.
  - Continue exporting `emptyTaskMessage`.
  - Recommended helper shape: return `{ valid: true, value: trimmedTitle }` for valid input and `{ valid: false, value: originalOrTrimmedValue, message: emptyTaskMessage }` for invalid input. Pick the simplest shape that keeps callers clear and tests easy.
- `src/main.js`
  - Own form submit behavior and validation UI state toggling.
  - On invalid submit: prevent reload, do not create a task, do not clear the input, show validation, mark the input invalid, and keep focus in the input.
  - On valid submit: clear validation, create task using the existing `addTask`, append to `tasks`, render Active, clear input, and keep focus behavior from Story 1.2.
  - Avoid separate state sources for validation beyond simple DOM state on the existing form/input/message.
- `src/render.js`
  - No task-rendering change should be required for this story. Preserve DOM-safe task title rendering.
- `src/styles.css`
  - Add validation styles consistent with existing tokens and focus/invalid states.
  - Use the existing `--color-error` token.
  - Keep mobile-first behavior and avoid fixed widths that cause horizontal overflow.
- `src/tasks.js`
  - Avoid schema changes. If validation helper is used inside `addTask`, ensure existing Story 1.2 tests still pass.
- `src/storage.js`
  - Leave persistence behavior unimplemented; Story 2.1 owns localStorage.

### UX and Accessibility Requirements

- Inline validation must be lightweight, close to the add input, and concise.
- The validation message copy should be: “Task title can’t be empty.”
- Invalid submissions must not reset the user's typed value.
- The user must be able to correct the title and submit again without leaving context.
- The input, Add button, and validation state must remain keyboard usable.
- The validation message must be programmatically associated with the relevant input and not rely on color alone.
- Preserve visible focus states for input and button.
- Preserve the Warm Minimal tone: calm light surfaces, rounded controls, readable spacing, and restrained error treatment.

### Security Requirements

- Treat task titles as user input.
- Continue rendering task titles through DOM-safe text rendering only.
- Do not send task data over the network.
- Do not add third-party dependencies for validation.

### Previous Story Intelligence

- Story 1.2 established a single in-memory `tasks` array in `src/main.js` and an `addTask(title)` operation in `src/tasks.js` that already rejects whitespace-only titles by returning `null`.
- Story 1.2 intentionally did not implement empty-title inline validation. Its current invalid-submit behavior is a safe no-op without user feedback; this story fills that exact gap.
- Story 1.2 added `npm test` with Node's built-in test runner and `src/tasks.test.js`. Follow that test style for validation logic.
- Story 1.2 browser verification used Vite and Chrome DevTools. UI validation in this story must also be manually verified in the browser, not only through tests/build.
- Story 1.2 review found a missing-input guard in `src/main.js`; keep that defensive selector handling intact and do not reintroduce unconditional access to possibly missing elements.
- Story 1.2 applied the project UI standard: frontend-design direction, CSS variables, distinctive font pairing, subtle task interactions, and Warm Minimal visual execution. Preserve and extend it.

### Git Intelligence Summary

- Recent commits:
  - `ce5faa2 feat(story-1.2): add active task creation`
  - `f6514dc init prj`
- The current codebase already includes Story 1.2 implementation files and tests. Avoid reverting or duplicating those patterns.
- No recent commit indicates localStorage, editing, completion, deletion, or importance behavior has been implemented yet.

### Testing Requirements

- Automated tests:
  - Run `npm test`.
  - Cover validation helper behavior for empty, whitespace-only, and valid titles.
  - Ensure existing `src/tasks.test.js` still passes.
- Build:
  - Run `npm run build` successfully.
- Manual browser verification is required because this story changes interactive UI behavior.
- Minimum manual checks:
  - App starts with Vite dev server.
  - Page loads without relevant console errors.
  - Empty submit creates no task and shows inline validation near the add input.
  - Whitespace-only submit creates no task, preserves the typed value, and shows “Task title can’t be empty.”
  - Validation message is associated with the input and invalid state is exposed to assistive technology.
  - Correcting to a valid title creates the task successfully, clears the validation message, clears the input, and renders the task in Active.
  - Keyboard submission from the input works before and after an invalid attempt.
  - Existing valid task creation behavior from Story 1.2 is not regressed.
  - Mobile width around 320–430px remains readable with no horizontal overflow.
  - Desktop width around 1024px+ remains centered/readable.

## Project Structure Notes

- The current project matches the approved Vite Vanilla structure. Do not create `components/`, `pages/`, `services/`, `routes/`, backend folders, or framework-specific directories.
- Update existing files instead of creating alternate form, task, or validation modules.
- A focused `src/validation.test.js` is acceptable and consistent with the existing test script.
- `node_modules/` exists locally but must not be edited.
- Do not update dependencies or run forced audit fixes as part of this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L216-L247) — Story 1.3 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L14-L103) — requirements inventory, architecture constraints, UX design requirements, accessibility, and validation requirements.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L245-L249) — trim and reject empty task titles.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L513-L529) — single runtime state source and state update flow.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L530-L550) — validation and security error handling patterns.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L782-L822) — source organization and test organization guidance.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L549-L557) — inline validation component requirements.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L623-L637) — add-form validation behavior.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L763) — WCAG, keyboard, label, validation, and semantic accessibility requirements.
- [_bmad-output/implementation-artifacts/1-2-add-valid-tasks-to-active-list.md](1-2-add-valid-tasks-to-active-list.md) — previous story implementation notes, testing, review finding, and file patterns.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm test` initially failed in red phase because `validateTaskTitle` was not exported, confirming the new validation tests were meaningful.
- `npm test` passed after implementation: 6 tests passing with Node's built-in test runner.
- `npm run build` passed with Vite 5.4.21.
- Browser verification completed at `http://127.0.0.1:5175/` using Chrome DevTools MCP.
- Browser console showed only a `favicon.ico` 404, unrelated to story functionality.

### Completion Notes List

- Implemented shared `validateTaskTitle(title)` validation with trimmed valid values, invalid empty/whitespace handling, and the existing shared inline error message.
- Added Node unit tests for empty, whitespace-only, and valid title validation.
- Wired add-form invalid submits to show inline validation without creating tasks, clearing typed input, or losing focus.
- Added accessible validation association by applying `aria-invalid` and adding the validation message to `aria-describedby` only while the error is visible.
- Preserved valid task creation behavior from Story 1.2: valid titles create trimmed active tasks, clear the input, hide validation, and render Active immediately.
- Styled inline validation with the existing Warm Minimal CSS token system, visible message text, non-color-only error indicator, and a subtle validation nudge animation.
- Verified empty submit, whitespace-only submit, correction to valid task, keyboard submit, ARIA state, no horizontal overflow at mobile width, and centered desktop layout.

### File List

- `index.html`
- `src/main.js`
- `src/styles.css`
- `src/validation.js`
- `src/validation.test.js`

### Change Log

- 2026-05-23: Implemented Story 1.3 inline empty-title validation, validation tests, accessible error state, build, and browser verification.
