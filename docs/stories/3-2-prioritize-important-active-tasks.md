# Story 3.2: Prioritize Important Active Tasks

Status: done

## Story

As a student or employee,
I want important active tasks to appear above normal active tasks,
so that important work is not buried in my list.

## Acceptance Criteria

1. Given the Active list contains both important and normal tasks, when the Active list renders, then important active tasks appear above normal active tasks, and normal active tasks remain visible below them.
2. Given active tasks are sorted by importance, when tasks within the same importance group are rendered, then their order remains stable based on the existing task order or creation order, and sorting does not modify the persisted task schema.
3. Given a normal active task is marked important, when the Active list re-renders, then the task moves into the important group above normal active tasks, and the change is visible immediately.
4. Given an important active task is unmarked, when the Active list re-renders, then the task moves back into the normal active group, and the change is visible immediately.
5. Given completed tasks exist, when important active tasks are sorted, then completed tasks remain in the Completed section, and completed tasks do not appear in the Active list.

## Tasks / Subtasks

- [x] Add stable important-first active task derivation (AC: 1, 2, 5)
  - [x] Update `getActiveTasks(tasks)` in `src/tasks.js` so it still filters out completed tasks first.
  - [x] Return important active tasks before normal active tasks.
  - [x] Preserve relative order within each importance group using the existing task array order; do not add new persisted fields or mutate the input array.
  - [x] Keep `getCompletedTasks(tasks)` unchanged so completed tasks remain derived only by `completed: true`.
- [x] Preserve render integration through existing selector usage (AC: 1, 3, 4, 5)
  - [x] Keep `renderActiveTasks(tasks, editState)` in `src/render.js` using `getActiveTasks(tasks)` as its source.
  - [x] Do not add a second sorting pass in `render.js` or `main.js`; sorting belongs in the task selector.
  - [x] Confirm the existing `toggle-important` handler in `src/main.js` still saves, clears edit state, and calls `renderTasks()` immediately after toggling.
  - [x] Preserve Active empty-state and Completed section rendering behavior.
- [x] Add focused tests for important-first sorting (AC: 1, 2, 5)
  - [x] Add a `src/tasks.test.js` case proving mixed active tasks render with important tasks first and normal tasks below.
  - [x] Add assertions that stable order is preserved within important and normal groups.
  - [x] Add assertions that the original tasks array order and task object schema are not mutated by `getActiveTasks`.
  - [x] Add a case proving completed tasks are excluded from `getActiveTasks` even if `important: true`.
- [x] Verify immediate user-visible movement after toggling (AC: 3, 4)
  - [x] Use the existing app flow to create or seed mixed active tasks.
  - [x] Mark a normal task important and verify it moves into the important group immediately.
  - [x] Unmark an important task and verify it moves back below remaining important tasks immediately.
  - [x] Verify completed tasks remain only in the Completed section during sorting.
- [x] Regression-check existing task behaviors (AC: all)
  - [x] Run the full test suite.
  - [x] Run the production build.
  - [x] Browser-verify add, edit, complete, important toggle, delete, refresh persistence, and HTML-like title safety still work.

## Dev Notes

### Technical Requirements

- This story is a selector/rendering-order change only. Do not introduce priority levels, tags, labels, deadlines, urgency scales, or any schema additions.
- The approved task schema remains exactly: `id`, `title`, `completed`, `important`, `createdAt`, `updatedAt`.
- Important state remains binary and is already toggled by `toggleTaskImportant(tasks, taskId)`.
- Active sorting must be deterministic: important active tasks first, normal active tasks after, stable order inside each group.
- Use the runtime task array as source of truth; persist the full task array only after actual mutations such as toggling, not after selector derivation.
- Do not mutate input arrays in selectors. `getActiveTasks(tasks)` must return a derived array while preserving `tasks` order and object schema.
- Do not change localStorage key, storage shape, or storage validation.
- Do not render task titles with `innerHTML`; existing safe `textContent` behavior must remain intact.

### Current Implementation State

- `src/tasks.js`
  - `taskModelFields` already includes `important` in the approved schema.
  - `toggleTaskImportant(tasks, taskId)` already flips only the matching task’s `important` boolean and refreshes `updatedAt`.
  - `getActiveTasks(tasks)` currently only returns `tasks.filter((task) => !task.completed)`, so it does not prioritize important tasks yet.
  - `getCompletedTasks(tasks)` currently returns `tasks.filter((task) => task.completed)` and should remain completed-section-only.
- `src/render.js`
  - `renderActiveTasks(tasks, editState)` already gets its render input from `getActiveTasks(tasks)` and maps those tasks into active or editing list items.
  - Active task view models already expose `aria-pressed` and state-specific labels for the Important action.
  - Completed task view models remain delete-only and should not gain important actions in this story.
- `src/main.js`
  - The existing Active-list delegated click listener handles `data-action="toggle-important"` by calling `toggleTaskImportant`, `saveTasks(tasks)`, clearing `editState`, and `renderTasks()`.
  - Because `renderTasks()` calls `renderActiveTasks(tasks, editState)`, updating `getActiveTasks` should make toggle movement immediate without new event wiring.
- `src/tasks.test.js`
  - Existing tests cover active/completed derivation, toggle important directions, unknown ids, immutable delete, edit, complete, and schema preservation.
  - Extend these tests rather than adding a new testing framework.

### Architecture Compliance

- Follow the architecture module boundaries:
  - `src/tasks.js` owns task array operations and derived selectors.
  - `src/render.js` turns derived task state into DOM output.
  - `src/main.js` wires DOM events to task operations.
  - `src/storage.js` owns localStorage and should not change for this story.
- Follow the documented rendering flow: event → validate/update state → persist → render.
- Active tasks must render before completed tasks; completed tasks must stay in the Completed section.
- Within Active, sort by:
  1. Important tasks first.
  2. Normal tasks after.
  3. Stable ordering within each group, preferably by existing array order because the array already reflects creation/order history.
- Keep the MVP client-only: no backend, auth, database, APIs, analytics, telemetry, service workers, or new dependencies.

### File Structure Requirements

Expected update files:

- `src/tasks.js`
- `src/tasks.test.js`
- `_bmad-output/implementation-artifacts/3-2-prioritize-important-active-tasks.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

Files to inspect but likely not edit:

- `src/render.js`
- `src/main.js`
- `src/render.test.js`
- `src/storage.js`

No new source files are expected. Do not create framework-style folders such as `components/`, `services/`, `api/`, `pages/`, or `routes/`.

### Testing Requirements

- Unit tests:
  - Add focused Node tests in `src/tasks.test.js` for stable important-first active sorting.
  - Assert important active tasks sort before normal active tasks.
  - Assert stable order inside each group.
  - Assert completed tasks are excluded from Active even if important.
  - Assert `getActiveTasks` does not mutate the original `tasks` array and does not change task object schema.
- Full automated checks:
  - Run `npm test`.
  - Run `npm run build`.
- Browser verification:
  - Start the Vite dev server and use the app in a browser.
  - Verify adding several tasks, marking/unmarking important, immediate movement between groups, completing tasks, deleting tasks, and refresh persistence.
  - Verify HTML-like task titles remain literal text after sorting and toggling.
  - Check a narrow mobile viewport and a desktop viewport for no horizontal overflow or broken control layout.

### UX and Accessibility Requirements

- Sorting should make important work easier to find without changing the calm Warm Minimal visual treatment in this story.
- Story 3.3 owns restrained important row styling; do not overbuild visual markers here.
- Existing Important button accessible state must remain intact: state-specific label and `aria-pressed`.
- Keyboard users must still be able to tab to task controls and toggle importance using native button behavior.
- Focus indicators, action order, and tappable control sizing should not regress.
- Normal active tasks must remain visible and scannable below important active tasks.

### Security and Privacy Requirements

- Treat task titles as untrusted user input.
- Preserve safe DOM rendering with `textContent`; do not use raw HTML insertion for task titles.
- Do not send task data over the network.
- Do not add personal data collection, analytics, telemetry, backend sync, or cloud storage.

### Previous Story Intelligence

- Story 3.1 implemented binary important toggle behavior in `src/tasks.js`, Active-list event wiring in `src/main.js`, accessible Important action state in `src/render.js`, restrained pressed styling in `src/styles.css`, and tests in `src/tasks.test.js` / `src/render.test.js`.
- Story 3.1 explicitly verified "no important sorting" because sorting was deferred to Story 3.2. Replace that expected behavior with important-first sorting now.
- Story 3.1 completion notes confirmed browser verification for mouse toggle, keyboard toggle, localStorage persistence, refresh persistence, no Completed important action, literal rendering for HTML-like titles, and no horizontal overflow. Preserve those flows.
- Story 2.4 established immutable delete behavior and delegated `data-action`/`data-task-id` event patterns. Do not add parallel event wiring for sorting.
- Story 2.3 established separate Active and Completed derivation/rendering. Sorting important active tasks must not move completed tasks back into Active.
- Story 2.2 established edit mode, inline edit validation, and `CSS.escape` focus restoration. Sorting must not break editing/cancel/save behavior.
- Story 2.1 established strict localStorage schema validation. Do not introduce new persisted fields or storage keys.

### Git Intelligence Summary

Recent commits:

- `09a54e3 feat(story-3.1): toggle important tasks`
- `ca5e24b doc: add epic 2 retrospective`
- `6067022 feat(story-2.3): complete and delete tasks`
- `6fe5730 feat(story-2.2): edit existing task titles`
- `b98e46a doc: add epic 1 retrospective`

Actionable patterns:

- Recent feature stories use small targeted updates in `src/tasks.js`, `src/main.js`, `src/render.js`, and colocated Node tests.
- For this story, the implementation should be even narrower: selector logic and selector tests should be sufficient unless browser verification reveals a render integration issue.
- Continue dependency-free tests and do not mix dependency/tooling maintenance into feature work.

### Latest Technical Information

No web research is required for this story. The implementation uses existing project technology only: Vite Vanilla JavaScript, browser DOM APIs, localStorage, plain CSS, and Node’s built-in test runner. No new library, external API, backend service, or dependency version decision is needed.

## Project Structure Notes

- Keep application code under `src/` and static app markup in `index.html`.
- Keep BMad story/status artifacts under `_bmad-output/implementation-artifacts/`.
- Do not edit `node_modules/`, `dist/`, or generated build output.
- Do not add dependencies or change package manager/tooling for this story.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L465-L497) — Story 3.2 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L498-L529) — Story 3.3 owns important visual treatment after sorting.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L212-L245) — task schema, important field, and persistence strategy.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L286-L320) — frontend module boundaries and important-first sorting pattern.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L560-L569) — mandatory AI-agent guardrails including active/completed derivation and safe rendering.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L591-L595) — architecture example for filtering and important-first sorting.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L702-L730) — source file mapping for task list and important tasks.
- [_bmad-output/implementation-artifacts/3-1-toggle-important-status-on-tasks.md](3-1-toggle-important-status-on-tasks.md) — previous story implementation notes and completion learnings.

## Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- Red phase: `npm test` failed on the new stable important-first `getActiveTasks` test before implementation.
- Green phase: `npm test` passed after updating `getActiveTasks` to derive important active tasks first.
- Final `npm test`: 28 tests passed.
- Final `npm run build`: Vite production build passed.
- Browser verification used Vite dev server at `http://127.0.0.1:5173/`.
- Browser console showed one generic 404 resource error during verification; no story functionality errors were observed.

### Completion Notes List

- Added stable important-first active task derivation in `getActiveTasks(tasks)` while keeping completed tasks excluded from Active.
- Preserved stable task order inside important and normal groups using the existing task array order.
- Preserved the approved task schema and avoided mutating the persisted task array during selector derivation.
- Confirmed existing render integration and `toggle-important` flow make task movement visible immediately without adding sort logic to `render.js` or `main.js`.
- Added focused Node test coverage for important-first sorting, stable group order, completed important exclusion, schema preservation, and no mutation.
- Browser-verified sorting, mark/unmark movement, completed section separation, add/edit/complete/delete regressions, refresh persistence, literal HTML-like title rendering, and mobile/desktop no-overflow behavior.

### File List

- `src/tasks.js`
- `src/tasks.test.js`
- `_bmad-output/implementation-artifacts/3-2-prioritize-important-active-tasks.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-05-25: Implemented stable important-first active task sorting and moved story to review.
