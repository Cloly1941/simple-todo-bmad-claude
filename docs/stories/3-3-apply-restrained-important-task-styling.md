# Story 3.3: Apply Restrained Important Task Styling

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a todo app user,
I want important tasks to stand out without overwhelming the list,
so that I can notice important work while staying calm and focused.

## Acceptance Criteria

1. Given an active task is marked important, when it is displayed, then it uses a restrained Warm Minimal important treatment such as amber highlight, accent border, icon marker, or label.
2. Given an important task is displayed, when the user scans the list, then important status is communicated by more than color alone.
3. Given important and normal tasks appear together, when the user views the Active list, then important tasks are visually distinct from normal tasks while normal tasks remain calm and readable.
4. Given the user removes important status, when the Active list re-renders, then the important visual treatment is removed.
5. Given important tasks are displayed on common mobile and desktop widths, when the list is viewed, then the important treatment remains visible and readable without horizontal overflow.

## Tasks / Subtasks

- [x] Add an important task row state to active task rendering (AC: 1, 2, 3, 4)
  - [x] Update `createActiveTaskItem(task)` in `src/render.js` so important active tasks receive a dedicated modifier class such as `task-item--important`.
  - [x] Add a non-color important indicator in the active task content, such as a short visible label or marker, only when `task.important === true`.
  - [x] Keep task titles rendered with `textContent`; do not introduce HTML string rendering.
  - [x] Do not add important markers/actions to completed task rendering.

- [x] Apply restrained Warm Minimal important styling (AC: 1, 2, 3, 5)
  - [x] Update `src/styles.css` using existing CSS custom properties and add tokens only if they improve clarity.
  - [x] Style `.task-item--important` with a calm amber treatment and subtle accent border/shadow that is more distinct than normal rows but not alarm-like.
  - [x] Ensure the non-color indicator is readable, wraps safely, and does not compete with the task title or controls.
  - [x] Preserve existing focus, hover, reduced-motion, and responsive behavior.
  - [x] Keep normal active tasks calm and readable below important tasks.

- [x] Extend focused tests for render output (AC: 2, 4)
  - [x] Add or update `src/render.test.js` coverage proving important active task view/render data exposes the important visual state needed by the DOM.
  - [x] Prove non-important active tasks do not receive the important marker/state.
  - [x] Preserve existing tests for Important action labels, `aria-pressed`, safe title handling, completed rendering, and editing rendering.

- [x] Verify behavior in the browser (AC: 1, 2, 3, 4, 5)
  - [x] Start the Vite dev server and manually verify important styling after marking/unmarking tasks.
  - [x] Verify important tasks remain sorted above normal tasks from Story 3.2.
  - [x] Verify add, edit, complete, delete, refresh persistence, and HTML-like task title safety still work.
  - [x] Check common mobile and desktop widths for no horizontal overflow and readable important treatment.


### Review Findings

- [x] [Review][Patch] Important task treatment disappears while editing [src/render.js:143]

## Dev Notes

### Current State

- Story 3.1 added binary important toggling and accessible Important action state.
- Story 3.2 updated `getActiveTasks(tasks)` in `src/tasks.js` so active important tasks are derived before normal active tasks while preserving stable order inside each group.
- `src/render.js` currently renders active rows with `className = "task-item"` for every active task and exposes Important action state through `aria-pressed`; it does not yet add a row-level important class or visible non-color marker.
- `src/styles.css` already defines Warm Minimal design tokens, including `--color-important`, and styles the pressed Important button via `.task-action[data-action="toggle-important"][aria-pressed="true"]`.
- Normal active rows currently include a subtle amber gradient by default, so important styling must be visibly distinct from normal rows rather than simply reusing the same background.

### Architecture and Implementation Guardrails

- Keep the app as Vite Vanilla JavaScript with plain CSS; do not add UI libraries, build tooling, routing, backend code, or a new test framework.
- Keep all implementation under `src/` and static markup in `index.html` if needed.
- Preserve the task schema exactly: `id`, `title`, `completed`, `important`, `createdAt`, `updatedAt`.
- Do not change localStorage key or persistence behavior.
- Do not move sorting into `render.js` or `main.js`; important-first active sorting belongs in `src/tasks.js` and is already implemented.
- Use kebab-case CSS class names and camelCase JavaScript identifiers.
- Use CSS custom properties for design-system values; follow the existing Warm Minimal visual system.
- The project instruction requires distinctive font pairing, full CSS custom-property design system usage, subtle micro-animations, and Warm Minimal elevated execution for UI work.

### File-Specific Guidance

- `src/render.js`
  - `createActiveTaskItem(task)` is the expected place to add the active row modifier class and any visible important marker.
  - `createActiveTaskViewModel(task)` already derives Important action label, aria label, and `ariaPressed`; extend it only if render tests need a stable view-model field for the visual state.
  - `createCompletedTaskItem(task)` must remain delete-only and should not gain important styling or important controls.

- `src/styles.css`
  - Add styling near the existing `.task-item` state rules.
  - Important row styling should feel like “pay attention,” not error/urgent danger.
  - Avoid dense icon clusters or multiple priority levels; importance remains binary.
  - Preserve `@media (prefers-reduced-motion: reduce)` behavior.
  - Preserve existing responsive breakpoints at 640px and 768px.

- `src/render.test.js`
  - Extend current view-model/render-related coverage rather than adding a new test setup.
  - Keep tests focused on state/class/marker data and existing accessibility labels; full visual verification is manual browser work.

### Accessibility Requirements

- Important state must not rely on color alone; pair amber styling with a visible label, marker, or equivalent text/indicator.
- Keep Important button accessible state intact with `aria-pressed` and state-specific accessible names.
- All controls must remain keyboard reachable.
- Focus states must remain visible after styling changes.
- Important treatment must remain readable on mobile and desktop widths.

### Regression Requirements

- Marking a normal task important should immediately show important styling and keep/move it in the important group.
- Unmarking an important task should immediately remove important row styling and marker.
- Completed tasks must remain in the Completed section and should not show active important treatment.
- Editing, canceling, saving, completing, deleting, and refresh persistence must continue to work.
- Task titles that look like HTML must remain literal text, not executable markup.

### Testing Requirements

- Run `npm test` after implementation.
- Run `npm run build` after implementation.
- Browser-verify the golden path and regressions because this is UI work.
- Manual checks should include:
  - Add at least two tasks.
  - Mark one important and confirm row treatment plus non-color indicator.
  - Confirm important task remains above normal tasks.
  - Unmark it and confirm treatment is removed.
  - Complete an important task and confirm it moves to Completed without active important styling.
  - Test narrow mobile width and desktop width for readability and no horizontal overflow.

### Previous Story Intelligence

- Story 3.2 deliberately left visual styling to this story; do not treat the pressed Important button styling as sufficient for AC 1–3.
- Story 3.2 confirmed render integration and the `toggle-important` flow already re-render immediately after toggling.
- Story 3.1 browser verification covered mouse toggle, keyboard toggle, localStorage persistence, refresh persistence, no Completed important action, literal rendering for HTML-like titles, and no horizontal overflow; preserve those flows.
- Story 2.4 established delegated `data-action` / `data-task-id` event patterns; do not add parallel click wiring for styling.
- Story 2.2 established edit mode and focus restoration; styling changes must not break editing/cancel/save behavior.

### Git Intelligence Summary

Recent commits show story work is implemented incrementally with focused source and test updates:

- `ac438c1 feat(story-3.2): prioritize important active tasks`
- `09a54e3 feat(story-3.1): toggle important tasks`
- `6067022 feat(story-2.3): complete and delete tasks`
- `6fe5730 feat(story-2.2): edit existing task titles`

Follow that pattern: small targeted updates, tests, browser verification, then move story to review during dev workflow.

### Project Structure Notes

- Expected touched files: `src/render.js`, `src/styles.css`, `src/render.test.js`.
- Possible touched files only if justified: `src/tasks.test.js` for regression coverage, `index.html` if semantic structure must support the marker outside row rendering.
- Avoid touching `src/storage.js`, `src/tasks.js`, and `src/main.js` unless implementation reveals a real integration issue.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#L498-L529] — Story 3.3 requirements and acceptance criteria.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L201-L205] — restrained visual design and important task treatment direction.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L669-L671] — important task styling must use restrained amber treatment plus icon/label/position.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L708-L722] — WCAG 2.1 AA baseline and non-color state communication.
- [Source: _bmad-output/planning-artifacts/architecture.md#L187-L198] — Vite Vanilla, localStorage, task model, plain CSS tokens, semantic controls.
- [Source: _bmad-output/planning-artifacts/architecture.md#L387-L425] — JavaScript, CSS, and file naming conventions.
- [Source: _bmad-output/planning-artifacts/architecture.md#L702-L730] — source mapping for task list and important task implementation.
- [Source: _bmad-output/implementation-artifacts/3-2-prioritize-important-active-tasks.md#L129-L131] — Story 3.3 owns restrained important row styling.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- Red phase: `npm test` failed on new important visual-state render tests before implementation.
- Green phase: `npm test` passed after adding active important row state and marker rendering.
- Final validation: `npm test` passed 31 tests; `npm run build` completed successfully.
- Browser verification: Vite dev server used to verify mark/unmark important styling, important-first order, completed separation, HTML-like title safety, and no horizontal overflow at mobile and desktop widths.

### Completion Notes List

- Resolved code review patch by preserving important visual state and marker while editing important active tasks.
- Added important active row view-model state and a visible `Important` marker so important status is communicated beyond color.
- Applied restrained Warm Minimal important styling with amber border/background/shadow and a compact marker while preserving normal task readability.
- Preserved existing Important button accessible state, safe `textContent` title rendering, completed delete-only rendering, and important-first sorting behavior.
- Added render tests for important visual state and normal-task marker omission.
- Verified tests, production build, and browser behavior across important toggle, sorting, completion, HTML-like titles, and responsive no-overflow checks.

### File List

- `_bmad-output/implementation-artifacts/3-3-apply-restrained-important-task-styling.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/render.js`
- `src/render.test.js`
- `src/styles.css`

### Change Log

- 2026-05-27: Implemented restrained important task styling, visual marker, render tests, browser verification, and moved story to review.

- 2026-05-27: Resolved code review patch for important task edit-state styling and moved story to done.
