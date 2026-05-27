# Story 3.4: Finalize Responsive and Accessible Task Interactions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a todo app user,
I want the todo app to work comfortably with keyboard, touch, and assistive technology,
so that I can manage tasks reliably across desktop and mobile contexts.

## Acceptance Criteria

1. Given the app is used on common mobile and desktop widths, when task rows and controls render, then task titles remain readable and controls remain comfortably tappable without requiring fragile gestures.
2. Given the user navigates only by keyboard, when they move through add, edit, complete, important toggle, delete, save, and cancel controls, then all controls are reachable and activatable and focus order follows the visual/task workflow.
3. Given any interactive control receives focus, when the focused state is visible, then the focus indicator is clear and meets the Warm Minimal visual style.
4. Given assistive technology reads task controls, when add, complete, important, edit, delete, save, cancel, and validation elements are encountered, then each has a clear accessible name or association and stateful controls communicate their current state where applicable.
5. Given validation, important status, and completed status are shown, when the user scans or uses assistive technology, then each status remains understandable through text, section placement, icon/label, or accessible state.

## Tasks / Subtasks

- [x] Audit and refine responsive task interaction layout (AC: 1, 3)
  - [x] Verify `src/styles.css` keeps the single-column mobile-first layout usable at 320px, 375–430px, tablet, and desktop widths.
  - [x] Ensure task action buttons remain comfortable touch targets; target at least 44px height where practical without making rows feel cluttered.
  - [x] Ensure long task titles, important markers, edit inputs, validation text, and wrapped action buttons do not cause horizontal overflow.
  - [x] Preserve existing Warm Minimal visual direction, CSS custom properties, distinctive font pairing, and subtle motion/reduced-motion behavior.

- [x] Strengthen keyboard focus and edit-flow continuity (AC: 2, 3)
  - [x] Verify keyboard-only flow for add, complete, important toggle, edit, save, cancel, and delete.
  - [x] Preserve existing focus restoration in `src/main.js`: invalid add returns focus to the add input, successful add returns focus to the add input, entering edit focuses the edit input, invalid edit returns focus to edit input, save/cancel restores focus to the Edit action.
  - [x] If a task is completed or deleted while focused, ensure the UI remains usable and focus does not become confusing or trapped.
  - [x] Keep delegated `data-action` / `data-task-id` event handling; do not add parallel event wiring.

- [x] Strengthen accessible names, state, and associations (AC: 4, 5)
  - [x] Verify `index.html` add-task form labels and validation associations remain correct.
  - [x] Verify `src/render.js` action buttons keep task-specific accessible names for complete, important, edit, delete, save, and cancel.
  - [x] Verify Important action retains `aria-pressed` and state-specific labels.
  - [x] Verify validation errors use `aria-invalid` plus associated descriptive text for add and edit flows.
  - [x] Ensure important and completed status are not conveyed by color alone: important uses marker/action state/list position, completed uses Completed section/status text plus visual treatment.

- [x] Add focused regression tests for accessibility data (AC: 4, 5)
  - [x] Extend existing tests rather than adding a new framework.
  - [x] Add or update `src/render.test.js` assertions for clear task-specific accessible names and stateful important controls.
  - [x] Add or update tests for editing view-model accessibility fields and validation association data where practical.
  - [x] Preserve existing safe text rendering and completed delete-only tests.

- [x] Browser-verify responsive and accessible interaction behavior (AC: 1, 2, 3, 4, 5)
  - [x] Start the Vite dev server and verify desktop and mobile widths.
  - [x] Keyboard-test add, edit, complete, important toggle, delete, save, and cancel.
  - [x] Verify visible focus indicator on input, Add button, task action buttons, edit input, Save, and Cancel.
  - [x] Verify touch/mobile layout has no horizontal overflow and action buttons remain tappable.
  - [x] Verify HTML-like task titles remain literal text after interaction cycles.

## Dev Notes

### Current State

- The app is a Vite Vanilla JavaScript single-page todo app with `index.html`, `src/main.js`, `src/render.js`, `src/tasks.js`, `src/storage.js`, `src/validation.js`, and `src/styles.css`.
- `index.html` already uses a semantic `<main>`, section headings, labelled add-task input, helper text, validation message, and `aria-label` on Active/Completed task lists.
- `src/main.js` uses delegated click handlers for Active and Completed lists and preserves focus for add/edit flows with `focusEditInput(taskId)` and `focusTaskAction(taskId, "edit")`.
- `src/render.js` currently renders task titles via `textContent`, creates task-specific accessible action labels, exposes important state with `aria-pressed`, and keeps completed tasks delete-only.
- `src/styles.css` already has Warm Minimal CSS tokens, focus-visible outlines, mobile-first layout, action wrapping, reduced-motion handling, and breakpoints at 640px and 768px.
- Story 3.4 is final polish, not a rewrite: focus on responsive and accessible interaction gaps while preserving all established task behavior.

### Architecture and Implementation Guardrails

- Keep the project as Vite Vanilla JavaScript with plain CSS. Do not add a UI framework, router, backend, database, dependency, or new test runner.
- Keep module boundaries:
  - `src/main.js`: orchestration, event handling, persistence calls, focus management.
  - `src/render.js`: DOM-safe rendering and view-model data only; do not mutate task records.
  - `src/styles.css`: design tokens, layout, responsive behavior, component states, focus styles.
  - `src/tasks.js`: task domain operations/selectors; avoid changes unless a true domain bug is found.
- Preserve the task schema exactly: `id`, `title`, `completed`, `important`, `createdAt`, `updatedAt`.
- Preserve localStorage behavior and key.
- Preserve important-first active sorting from Story 3.2 and important styling from Story 3.3.
- Use camelCase for JavaScript and kebab-case for CSS classes/files.
- Use CSS custom properties for design-system values; keep Warm Minimal elevated visual execution.
- Do not introduce hidden gesture-only actions, menus, multi-level priority, modal-heavy flows, or dense icon-only controls.

### File-Specific Guidance

- `index.html`
  - Current add form label and `aria-describedby` exist; only change if validation association or semantics need a clear improvement.
  - Keep the single-page structure: Add Task, Active, Completed.

- `src/main.js`
  - Current focus behavior is concentrated in `focusEditInput`, `focusTaskAction`, `showTaskTitleError`, and `clearTaskTitleError`.
  - Be careful with `CSS.escape(taskId)` selectors; preserve them to support arbitrary generated IDs safely.
  - Do not duplicate active/completed click handlers outside delegated list handlers.

- `src/render.js`
  - Existing active action order is Complete → Important/Unmark → Edit → Delete; preserve logical visual/keyboard order unless a direct accessibility issue requires change.
  - Existing edit actions are Save → Cancel; preserve this order.
  - Completed tasks must remain completed-styled and delete-only.
  - Preserve `textContent` for user-provided task titles and marker/status text.

- `src/styles.css`
  - Existing `.task-action` min-height is `2.75rem`, which is approximately 44px at default browser font size; preserve or improve this touch target.
  - Existing `.task-actions` wraps controls; do not force a layout that creates overflow on narrow screens.
  - Existing focus styles use `--color-focus`; strengthen only if needed while maintaining Warm Minimal tone.
  - Verify combined states such as important + editing, completed rows, validation errors, and focused task actions.

### Accessibility Requirements

- Target WCAG 2.1 AA as a practical baseline.
- All controls must be reachable and usable by keyboard.
- Focus states must be visible for inputs, Add button, task action buttons, edit input, Save, and Cancel.
- Action buttons need clear accessible names that include the task title where applicable.
- Important controls must expose current state via `aria-pressed` and state-specific labels.
- Validation must be associated with the relevant input and not rely only on color.
- Important status must not rely on color alone; completed status must not rely only on color or line-through.
- Touch targets should be comfortable, ideally at least 44x44px where practical.

### Regression Requirements

- Add task flow must still validate empty titles, add valid tasks, clear the input, persist data, re-render immediately, and return focus to the input.
- Edit flow must still focus edit input, reject empty edits inline, save valid edits, cancel safely, and restore understandable focus.
- Complete, important toggle, delete, and completed-delete flows must still persist and re-render immediately.
- Active important tasks must remain sorted above normal active tasks.
- Important active styling and marker must remain present, including while editing important tasks.
- Completed tasks must remain visually secondary, readable, and separate from Active.
- HTML-like task titles must remain literal text, not executable markup.
- No horizontal overflow at common mobile widths.

### Testing Requirements

- Run `npm test` after implementation.
- Run `npm run build` after implementation.
- Browser verification is required because this story is interaction/accessibility/responsive UI work.
- Manual browser checks should include:
  - 320px, 375–430px, and 1024px+ viewport widths.
  - Keyboard-only add, invalid add, edit, invalid edit, save, cancel, complete, important toggle, delete, and completed delete.
  - Visible focus states across all controls.
  - Long task title wrapping and HTML-like literal title rendering.
  - Important marker/state and Completed section/status communication.

### Previous Story Intelligence

- Story 3.3 added `task-item--important`, visible `Important` marker, important edit-state preservation, and tests for active/editing important view-model data.
- Story 3.3 code review found that important treatment could disappear during editing; it was fixed by carrying important view-model state into `createEditingTaskViewModel` and adding the marker in `createEditingTaskItem`. Do not regress this.
- Story 3.2 established important-first sorting in `getActiveTasks(tasks)`; do not add sorting in `render.js` or `main.js`.
- Story 3.1 established binary Important button behavior and `aria-pressed`; preserve state-specific labels and accessible state.
- Story 2.4 established delete through delegated `data-action` / `data-task-id` handlers; do not add parallel wiring.
- Story 2.2 established edit focus restoration and `CSS.escape`; preserve focus safety.

### Git Intelligence Summary

Recent commits show incremental story work with focused source/test changes:

- `bc7e8d5 feat(story-3.3): style important tasks`
- `ac438c1 feat(story-3.2): prioritize important active tasks`
- `09a54e3 feat(story-3.1): toggle important tasks`
- `6067022 feat(story-2.3): complete and delete tasks`
- `6fe5730 feat(story-2.2): edit existing task titles`

Follow the same pattern: make targeted changes, add focused tests, run full validation, browser-verify real interaction behavior, then move to review.

### Project Structure Notes

- Expected touched files: `src/styles.css`, `src/render.js`, `src/render.test.js`, and possibly `src/main.js` if focus behavior needs improvement.
- Possible touched file: `index.html` only if add-form validation semantics need a concrete improvement.
- Avoid touching `src/tasks.js`, `src/storage.js`, and `src/validation.js` unless a real regression is discovered.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#L531-L566] — Story 3.4 requirements and acceptance criteria.
- [Source: _bmad-output/planning-artifacts/epics.md#L77-L103] — UX design requirements for responsive layout, touch controls, keyboard reachability, focus states, accessible labels, and non-color status communication.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L677-L706] — mobile-first responsive strategy and common viewport expectations.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L708-L740] — WCAG/accessibility testing requirements.
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#L759-L764] — accessible interaction patterns and focus preservation.
- [Source: _bmad-output/planning-artifacts/architecture.md#L46-L50] — mobile-first CSS, WCAG baseline, keyboard support, semantic labels.
- [Source: _bmad-output/planning-artifacts/architecture.md#L660-L676] — file responsibility mapping.
- [Source: _bmad-output/planning-artifacts/architecture.md#L686-L689] — render/main module boundaries.
- [Source: docs/stories/3-3-apply-restrained-important-task-styling.md] — previous story completion and review finding resolution.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- Red phase: `npm test` failed on new accessibility view-model assertions before implementation.
- Green phase: `npm test` passed after adding descriptive status data, important marker identifiers, conditional edit validation descriptions, focus-visible refinement, and mobile action wrapping.
- Final validation: `npm test` passed 34 tests; `npm run build` completed successfully.
- Browser verification: Vite dev server used to verify invalid add focus/error association, HTML-like literal titles, important toggle state, invalid edit association, cancel focus restoration, completed movement, visible focus states, and no horizontal overflow at mobile and desktop widths.

### Completion Notes List

- Refined focus-visible styling with a clearer Warm Minimal outline and soft focus halo for inputs and controls.
- Preserved mobile-first responsive layout while improving narrow-width action wrapping and maintaining practical 44px touch targets.
- Added accessible status descriptions for active, editing, and completed task states, plus stable important marker identifiers.
- Kept task-specific action labels, Important `aria-pressed`, safe `textContent` rendering, delegated action handling, and existing focus restoration behavior intact.
- Added focused render tests for status descriptions, important marker identifiers, and edit validation association data.
- Verified tests, production build, keyboard/touch flows, validation behavior, literal HTML-like titles, and responsive no-overflow behavior in the browser.

### File List

- `_bmad-output/implementation-artifacts/3-4-finalize-responsive-and-accessible-task-interactions.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/render.js`
- `src/render.test.js`
- `src/styles.css`

### Change Log

- 2026-05-27: Implemented responsive and accessible task interaction refinements, added focused accessibility regression tests, completed browser verification, and moved story to review.
