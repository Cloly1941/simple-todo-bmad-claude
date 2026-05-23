# Story 1.1: Initialize Static Todo App Shell

Status: done

## Story

As a student or employee,
I want to open a simple todo app page with a clear task-management layout,
so that I immediately understand where to add tasks and where active/completed work will appear.

## Acceptance Criteria

1. Given the project has not yet been initialized, when the developer sets up the app, then the project uses Vite Vanilla JavaScript with the expected static frontend structure and the app can be started locally with a Vite dev server.
2. Given the user opens the app, when the page loads, then the page shows a semantic main app shell with an app title, add-task area, Active section, and Completed section, and the Active and Completed sections have clear headings.
3. Given there are no tasks yet, when the page loads, then the Active section shows an empty state and the Completed section shows an empty state.
4. Given the app shell is visible, when the user views it on common desktop and mobile widths, then the layout remains readable and centered appropriately and the interface uses the Warm Minimal visual foundation with plain CSS tokens for colors, spacing, typography, radius, and focus states.
5. Given the app shell includes form controls, when a keyboard user tabs through the page, then the add-task input and Add button are reachable in a logical order and visible focus styles are present.

## Tasks / Subtasks

- [x] Initialize the Vite Vanilla JavaScript project foundation (AC: 1)
  - [x] Create the expected root files: `index.html`, `package.json`, `package-lock.json`, `.gitignore`, and Vite defaults as generated or needed.
  - [x] Create the expected source folder and files: `src/main.js`, `src/tasks.js`, `src/storage.js`, `src/render.js`, `src/validation.js`, and `src/styles.css`.
  - [x] Ensure `package.json` exposes `dev`, `build`, and `preview` scripts using Vite.
- [x] Build the static app shell in semantic HTML (AC: 2, 3, 5)
  - [x] Use `main` as the primary landmark for the app content.
  - [x] Add an app title and short helper text that make the todo purpose obvious.
  - [x] Add a task creation `form` with an accessible label, text input, and Add button.
  - [x] Add an Active section with a clear heading and the empty text: “No active tasks yet. Add a task above.”
  - [x] Add a Completed section below Active with a clear heading and the empty text: “No completed tasks yet.”
- [x] Establish the Warm Minimal CSS foundation (AC: 4, 5)
  - [x] Define CSS custom properties for background, surface, text, muted text, border, primary action, important highlight, completed state, error state, spacing, typography, radius, and focus states.
  - [x] Implement a mobile-first single-column layout with page padding and a centered content column around 640–720px on wider screens.
  - [x] Style the form, sections, empty states, input, and Add button with calm spacing, rounded controls, readable typography, and visible focus states.
  - [x] Avoid fixed widths that cause horizontal scrolling on narrow screens.
- [x] Add minimal JavaScript bootstrapping without implementing task behavior yet (AC: 1, 2)
  - [x] Import `src/styles.css` from `src/main.js`.
  - [x] Keep `tasks.js`, `storage.js`, `render.js`, and `validation.js` as intentionally small placeholders or minimal exported modules aligned with future responsibilities.
  - [x] Do not implement task creation, localStorage persistence, edit, complete, delete, or important toggling in this story.
- [x] Verify the story manually (AC: 1-5)
  - [x] Run the Vite dev server and open the app in a browser.
  - [x] Confirm the shell renders with title, add-task form, Active section, Completed section, and both empty states.
  - [x] Confirm keyboard tab order reaches the add-task input then Add button with visible focus styles.
  - [x] Confirm layout remains readable at narrow mobile width around 320–430px and desktop width 1024px+.
  - [x] Run the production build successfully.

### Review Findings

- Review step skipped by user decision; story accepted as done.
- Note: Vite dependency resolves to versions with moderate security advisories [`package.json`:11]. `npm audit fix --force` would upgrade Vite across major versions, so resolve this intentionally in a future dependency-maintenance task rather than applying a forced audit fix automatically.

## Dev Notes

### Current Project State

- The repository currently contains BMad workflow artifacts but no initialized Vite application files at the project root. This story should create the app foundation rather than update existing app source files.
- No previous implementation story exists, so there are no prior story learnings or established code patterns beyond the planning artifacts.
- The project is a git repository; use current files and review findings as the source of truth for post-implementation review context.

### Architecture Requirements

- Use Vite Vanilla JavaScript as the starter foundation. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L121-L178)
- Use JavaScript in the browser with ES modules and plain CSS. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L142-L169)
- Keep the MVP client-only: no backend, no authentication, no database, no API, no cloud sync, no analytics, and no network task storage. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L251-L278)
- Expected structure for the MVP app is:

```text
smiple-todo/
  index.html
  package.json
  package-lock.json
  vite.config.js
  .gitignore
  public/
  src/
    main.js
    tasks.js
    storage.js
    render.js
    validation.js
    styles.css
```

Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L617-L646)

- `vite.config.js` is optional for default Vite behavior; do not add custom configuration unless Vite requires it. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L640-L644)
- Do not create framework-style folders such as `components/`, `pages/`, `services/`, or `routes/` for this MVP story. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L454-L460)

### File Responsibility Guardrails

- `src/main.js`: app initialization and event wiring. For this story, it may only import styles and perform minimal bootstrap code.
- `src/tasks.js`: future task operations and selectors. For this story, avoid implementing real task operations beyond a placeholder export if needed.
- `src/storage.js`: future localStorage read/write. For this story, do not implement persistence behavior.
- `src/render.js`: future DOM rendering. For this story, static shell can live in `index.html`; do not create a competing render source of truth.
- `src/validation.js`: future task title validation. For this story, do not implement add/edit validation behavior.
- `src/styles.css`: CSS tokens, base styles, layout, components, responsive rules, and focus states.

Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L445-L452)

### UX Requirements

- Implement a focused single-page layout: title/helper text, add-task form, Active section, Completed section. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L640-L648)
- Use the selected Warm Minimal direction: warm off-white background, light surfaces, rounded input/button styling, soft task/list containers, muted completed styling foundation, minimal decoration, and no dense icon clusters. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L351-L375)
- Use a mobile-first responsive single-column layout with a centered content column around 640–720px on desktop. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L680-L704)
- Empty states must be calm, helpful, and not presented as errors. Use the required copy from the epic for Active and Completed empty states. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L653-L662)
- The task title/list behavior is not implemented in this story, but the shell should visually reserve clear areas for future task rows without adding fake task data.

### Accessibility Requirements

- Target WCAG 2.1 AA as the practical baseline. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L707-L722)
- Use semantic HTML: `main` for app content, `form` for task creation, proper `button` elements, and headings for Active and Completed sections. Source: [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L741-L749)
- The add-task input must have an accessible label. Do not rely only on placeholder text as the label.
- The Add button must be keyboard reachable and have visible focus styling.
- Focus states must be visible for input and button controls.

### Coding Standards

- Use camelCase for JavaScript variables, functions, object fields, and module exports. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L384-L406)
- Use kebab-case for CSS classes and file names. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L407-L425)
- Avoid external framework dependencies. Do not add React, Vue, Svelte, routing, state-management libraries, component libraries, backend tooling, test frameworks, PWA/service worker support, analytics, or telemetry in this story. Source: [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L52-L72)
- Do not use `innerHTML` for user-provided content. This story should not render user task titles yet, but future code must use text-safe DOM APIs. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L262-L267)

### Testing Requirements

- Manual browser verification is required because this story changes the UI shell.
- Verify at minimum:
  - Vite dev server starts successfully.
  - Page renders without console errors.
  - Add-task input and Add button are reachable by keyboard in logical order.
  - Visible focus styles are present.
  - Active and Completed headings and empty states are visible.
  - Layout is readable at mobile widths around 320–430px and desktop width 1024px+.
  - `npm run build` succeeds.
- No automated test framework is required for this story; architecture explicitly defers automated test setup for MVP unless intentionally added later. Source: [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L160-L164)

### Scope Boundaries

This story is only the app shell and project foundation. It must not implement:

- Real task creation or state mutation.
- Empty-title validation behavior beyond static structure for a future validation message if desired.
- localStorage persistence.
- Editing, completing, deleting, or important toggling.
- Important sorting or completed-task movement.
- Backend, API, authentication, database, cloud sync, analytics, telemetry, or service worker behavior.

## References

- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md#L146-L182) — Story 1.1 source requirements and acceptance criteria.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L121-L178) — Vite Vanilla JavaScript starter decision.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L426-L461) — project organization and file naming.
- [_bmad-output/planning-artifacts/architecture.md](../planning-artifacts/architecture.md#L617-L646) — complete project directory structure.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L351-L375) — Warm Minimal visual direction.
- [_bmad-output/planning-artifacts/ux-design-specification.md](../planning-artifacts/ux-design-specification.md#L680-L722) — responsive and accessibility requirements.

## Dev Agent Record

### Agent Model Used

cx/gpt-5.5

### Debug Log References

- `npm install` completed and generated `package-lock.json`; npm reported 2 moderate audit findings, not force-fixed because that would be outside story scope.
- `npm run build` passed with Vite 5.4.21.
- Browser verification completed at `http://127.0.0.1:5173/` using Chrome DevTools MCP.

### Completion Notes List

- Initialized a Vite Vanilla JavaScript app shell with expected npm scripts and source module placeholders.
- Implemented semantic single-page HTML with accessible add-task form, Active section, Completed section, and required empty-state copy.
- Added Warm Minimal mobile-first CSS tokens, centered layout, rounded controls, readable empty states, and visible focus styling.
- Added minimal submit prevention so the static shell remains on-page without implementing task creation behavior.
- Verified build, dev server rendering, console health, keyboard tab order, mobile viewport, and desktop viewport.

### File List

- `.gitignore`
- `index.html`
- `package-lock.json`
- `package.json`
- `src/main.js`
- `src/tasks.js`
- `src/storage.js`
- `src/render.js`
- `src/validation.js`
- `src/styles.css`

### Change Log

- 2026-05-23: Implemented Story 1.1 app foundation and static todo shell; status moved to review.
