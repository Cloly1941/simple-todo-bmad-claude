---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/briefs/brief-smiple-todo-2026-05-23/brief.md
workflowType: 'architecture'
project_name: 'smiple-todo'
user_name: 'Cloly'
date: '2026-05-23'
status: 'in-progress'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The PRD defines 23 functional requirements across five groups:

- Task capture: create a task, prevent empty titles, immediately show the task, and clear the input after creation.
- Task list: show active tasks, display titles and completion state, sort important active tasks above normal tasks, visually highlight important tasks, and support editing task titles.
- Task completion: mark active tasks as completed, move completed tasks out of Active, show them in a separate Completed section, and keep completed tasks saved locally.
- Important tasks: mark/unmark tasks as important, sort important active tasks first, and apply a noticeable but restrained visual treatment.
- Task removal and persistence: delete tasks and store all task state locally in the browser.

Architecturally, this is a small client-side state management app. The main technical responsibilities are state modeling, localStorage persistence, deterministic rendering, task sorting, validation, and DOM event handling.

**Non-Functional Requirements:**

The key NFRs are:

- Fast loading in a modern browser.
- No backend server required for task data persistence.
- Simple, readable UI across desktop and mobile browser widths.
- Local task data remains on the user's browser/device.
- MVP avoids collecting personal data.

From the UX spec, additional technical expectations include:

- Responsive single-column layout.
- Mobile-first CSS.
- WCAG 2.1 AA as the practical accessibility baseline.
- Keyboard support for add, edit, complete, important toggle, and delete.
- Semantic HTML and accessible labels for controls.
- Local persistence should feel immediate and reliable.

**Scale & Complexity:**

- Primary domain: client-side web application.
- Complexity level: low.
- Estimated architectural components: 5–7 small modules or logical areas:
  - Task model/state
  - Persistence adapter
  - Rendering layer
  - Event/controller layer
  - Validation helpers
  - Sorting/derived selectors
  - CSS design system/layout styles

The project has no real-time collaboration, authentication, backend API, multi-tenancy, regulatory compliance, payment, external integration, or complex data model requirements.

### Technical Constraints & Dependencies

Known constraints:

- Web-based MVP.
- Local-first browser persistence.
- No login, backend, cloud sync, or account system.
- UX spec recommends implementation with plain HTML, CSS, and JavaScript.
- Lightweight custom design system using CSS tokens.
- Responsive UI must support common desktop and mobile widths.
- Important task state is binary: important or not important.
- Completed state is separate from active state.
- PRD final overrides the older deadline-first brief where they conflict.

Recommended dependency posture:

- Avoid framework dependencies for MVP unless the user explicitly wants one.
- Avoid build tooling unless needed later.
- Prefer a simple static app structure that can run directly in the browser or via a lightweight local server.

### Cross-Cutting Concerns Identified

- State consistency: all task actions must update in-memory state, rendered UI, and localStorage consistently.
- Persistence reliability: localStorage reads/writes need a clear schema and safe default behavior for first load.
- Validation: empty or whitespace-only task titles must be rejected for both add and edit flows.
- Accessibility: controls need semantic elements, keyboard reachability, focus states, and accessible names.
- Responsive behavior: layout and task controls must remain usable on narrow screens.
- Visual hierarchy: important tasks must sort first and stand out without creating visual noise.
- Simplicity: architecture should remain small enough for AI agents and learners to implement consistently.

## Starter Template Evaluation

### Primary Technology Domain

The project is a client-side web application based on the PRD and UX specification.

The MVP does not require backend services, authentication, routing, server rendering, or a database. It only needs static assets, browser JavaScript, responsive CSS, DOM rendering, and localStorage persistence.

### Starter Options Considered

**No starter / hand-written static files**

This would use plain `index.html`, `styles.css`, and `script.js` without build tooling. It is the smallest possible setup and can work for the MVP. However, it provides no development server, module ergonomics, or convenient project scaffolding.

**Vite Vanilla JavaScript**

Vite provides a minimal modern frontend starter with a development server, fast reload, ES module support, and a simple build command. The vanilla template keeps the project lightweight and avoids framework overhead.

This fits the project well because smiple-todo is intentionally small, local-first, and suitable for plain HTML/CSS/JavaScript.

**Framework starters such as React/Vue/Svelte**

These would work technically, but they add unnecessary framework decisions and component abstractions for this MVP. The UX requirements do not require framework-level complexity.

### Selected Starter: Vite Vanilla JavaScript

**Rationale for Selection:**

Vite Vanilla JavaScript provides the best balance between simplicity and developer experience. It keeps implementation close to plain HTML/CSS/JavaScript while still providing a modern local development workflow.

It supports the UX architecture requirements without introducing unnecessary dependencies, routing, backend services, or state management libraries.

**Initialization Command:**

```bash
npm create vite@latest smiple-todo -- --template vanilla
```

Alternative package managers may be used if preferred:

```bash
pnpm create vite smiple-todo --template vanilla
yarn create vite smiple-todo --template vanilla
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- JavaScript in the browser.
- ES modules for code organization.
- Node/npm used only for development tooling and build commands.

**Styling Solution:**

- Plain CSS.
- Compatible with the UX spec’s lightweight custom CSS design system and tokens.

**Build Tooling:**

- Vite dev server for local development.
- Vite production build for static assets.

**Testing Framework:**

- No testing framework included by default.
- If tests are needed later, a lightweight test setup can be added intentionally rather than included upfront.

**Code Organization:**

- Static HTML entry point.
- JavaScript modules for task state, persistence, rendering, and event handling.
- CSS organized around design tokens, layout, components, and responsive rules.

**Development Experience:**

- Local dev server.
- Fast browser refresh during development.
- Simple production build output.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Use a client-only architecture with no backend.
- Use Vite Vanilla JavaScript as the starter foundation.
- Store task data in browser `localStorage`.
- Model task state explicitly in JavaScript and render from state.
- Use plain CSS with design tokens for the Warm Minimal visual direction.

**Important Decisions (Shape Architecture):**

- Separate task state, persistence, rendering, and event handling into small modules.
- Use deterministic sorting: active important tasks first, then normal active tasks.
- Treat completed tasks as persisted task records with `completed: true`.
- Use lightweight inline validation for empty task titles.
- Use semantic HTML and keyboard-accessible controls.

**Deferred Decisions (Post-MVP):**

- Backend API, authentication, and cloud sync.
- Database choice.
- Multi-device synchronization.
- Analytics or telemetry.
- Automated test framework.
- PWA/service worker support.
- Advanced deployment/CI setup.

These are deferred because the PRD explicitly defines a local-first MVP without accounts, backend storage, or complex product features.

### Data Architecture

Task data will be modeled as an array of task objects stored in memory and persisted to `localStorage`.

Recommended task shape:

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

**Decisions:**

- `id` should be generated client-side.
- `title` stores the user-visible task text.
- `completed` determines whether the task appears in Active or Completed.
- `important` determines visual treatment and active-list sorting.
- `createdAt` and `updatedAt` support stable ordering and future debugging.
- No deadline, expired, priority level, tag, or account fields are included for MVP.

**Persistence Strategy:**

- Use one localStorage key, e.g. `smiple-todo.tasks`.
- On app load, read tasks from localStorage.
- If no saved data exists, start with an empty array.
- After each successful task mutation, write the full task array back to localStorage.
- If stored data is invalid or unreadable, fail safely to an empty array for MVP.

**Validation Strategy:**

- Trim task titles before create/save.
- Reject empty or whitespace-only titles.
- Keep validation close to the input or edit field.

### Authentication & Security

The MVP has no authentication or authorization.

**Decisions:**

- No login, signup, session, tokens, or user accounts.
- No backend security middleware.
- No network task storage.
- All task data stays in the user's browser localStorage.

**Security Considerations:**

- Treat task title as user input.
- Render task titles using text content APIs rather than injecting raw HTML.
- Avoid `innerHTML` for user-provided task titles to prevent XSS.
- Do not collect personal data or send task data over the network.

### API & Communication Patterns

The MVP has no external API and no backend communication.

**Decisions:**

- No REST, GraphQL, WebSocket, or server communication.
- Internal app communication happens through JavaScript functions and DOM event handlers.
- State changes follow a simple flow: user event → validate → update state → persist → render.

**Error Handling:**

- User-facing errors are limited to validation errors for empty task titles.
- localStorage read/write failures may be handled with safe defaults or non-blocking UI feedback if needed.
- Errors should not introduce modal-heavy flows.

### Frontend Architecture

The frontend will use Vite Vanilla JavaScript with plain CSS.

**Module Boundaries:**

- `state` or `tasks`: owns task array operations such as add, edit, complete, delete, toggle important.
- `storage`: owns localStorage read/write.
- `render`: turns task state into DOM output.
- `events` or `main`: wires DOM events to task operations.
- `validation`: normalizes and validates task titles.
- `styles`: defines CSS tokens, layout, components, responsive behavior, and accessibility states.

**Rendering Pattern:**

Use state-driven rendering:

1. Load tasks from storage.
2. Render UI from current task state.
3. On user action, update state through task operations.
4. Persist updated state.
5. Re-render affected UI or full app view.

For this MVP, full re-rendering after each mutation is acceptable because the task list is small and complexity should stay low.

**Sorting Pattern:**

Active tasks should render before completed tasks.

Within Active:

1. Important tasks first.
2. Normal tasks after.
3. Preserve stable ordering within each group, likely by `createdAt`.

Completed tasks should appear in the Completed section and remain visually secondary.

### Infrastructure & Deployment

The app should be deployable as static assets.

**Decisions:**

- Use Vite build output as static files.
- No server runtime required for production.
- Hosting can be any static host such as GitHub Pages, Netlify, Vercel static hosting, or similar.
- Environment configuration is not required for MVP.
- Monitoring/logging infrastructure is not required for MVP.

### Decision Impact Analysis

**Implementation Sequence:**

1. Initialize Vite Vanilla JavaScript project.
2. Create semantic HTML shell matching the UX spec.
3. Add CSS tokens and Warm Minimal layout styles.
4. Implement task model and localStorage persistence.
5. Implement render function for Active and Completed sections.
6. Wire add, edit, complete, important toggle, and delete events.
7. Add validation and accessibility labels/focus states.
8. Verify responsive layout and keyboard flows.

**Cross-Component Dependencies:**

- Task rendering depends on the task data model.
- localStorage persistence depends on a stable task schema.
- Important sorting depends on the `important` boolean.
- Completed section depends on the `completed` boolean.
- Validation is shared by add and edit flows.
- Accessibility requirements affect HTML structure, controls, render output, and CSS focus states.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**

The project has no backend, database, or API, so the main consistency risks are frontend implementation choices. AI agents could otherwise make different choices for:

- Task object schema and field names.
- localStorage key and persistence behavior.
- File/module naming.
- Function naming and responsibility boundaries.
- State update flow.
- Sorting behavior for important and completed tasks.
- DOM rendering safety.
- CSS class naming and design token naming.
- Validation behavior and error message placement.

### Naming Patterns

**Database Naming Conventions:**

No database is used for the MVP.

**API Naming Conventions:**

No external or backend API is used for the MVP.

**Code Naming Conventions:**

Use JavaScript `camelCase` for variables, functions, object fields, and module exports.

Examples:

```js
const taskTitle = "Submit assignment";
const activeTasks = getActiveTasks(tasks);
const importantTasks = getImportantTasks(tasks);
```

Use descriptive function names based on user intent:

- `addTask(title)`
- `editTask(taskId, title)`
- `deleteTask(taskId)`
- `toggleTaskImportant(taskId)`
- `completeTask(taskId)`
- `getActiveTasks(tasks)`
- `getCompletedTasks(tasks)`
- `validateTaskTitle(title)`

Use kebab-case for CSS classes:

```css
.task-item {}
.task-item--important {}
.task-item--completed {}
.task-actions {}
.validation-message {}
```

Use lower-case kebab-case for file names:

- `main.js`
- `tasks.js`
- `storage.js`
- `render.js`
- `validation.js`
- `styles.css`

### Structure Patterns

**Project Organization:**

Use a small Vite Vanilla structure:

```text
smiple-todo/
  index.html
  package.json
  src/
    main.js
    tasks.js
    storage.js
    render.js
    validation.js
    styles.css
```

Responsibilities:

- `main.js`: app initialization and event wiring.
- `tasks.js`: task operations and selectors.
- `storage.js`: localStorage read/write.
- `render.js`: DOM rendering and DOM-safe output.
- `validation.js`: task title validation.
- `styles.css`: design tokens, layout, components, responsive and focus styles.

Do not create framework-style folders such as `components/`, `services/`, `pages/`, or `routes/` unless the project later grows beyond MVP scope.

**File Structure Patterns:**

Keep all MVP source files under `src/`.

Avoid splitting files prematurely. New files should only be added when they clarify a real architectural responsibility.

### Format Patterns

**API Response Formats:**

No API response format is needed for MVP.

**Data Exchange Formats:**

Task objects must use this shape:

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

Rules:

- Use camelCase field names.
- Store dates as ISO strings.
- Store booleans as `true` or `false`.
- Store all tasks under one localStorage key: `smiple-todo.tasks`.
- Persist the task array as JSON.
- Do not store derived lists such as activeTasks or completedTasks; derive them from the task array.

### Communication Patterns

**Event System Patterns:**

No custom event bus is needed.

DOM events should be wired in `main.js` or through functions called by `main.js`.

Use event delegation for task list actions if it keeps the render/event flow simple and consistent.

Action identifiers in the DOM should use stable `data-action` values:

```html
<button data-action="complete">Complete</button>
<button data-action="toggle-important">Important</button>
<button data-action="edit">Edit</button>
<button data-action="delete">Delete</button>
```

Task identity in DOM should use `data-task-id`.

**State Management Patterns:**

Use a single in-memory `tasks` array as the source of truth during runtime.

State update flow:

```text
user event → validate input → update tasks → save tasks → render
```

Rules:

- Do not update the DOM as the source of truth.
- Do not store separate active/completed arrays.
- Do not mutate task objects from multiple modules in inconsistent ways.
- Task operations should return updated task arrays or clearly update the central state in one place.

### Process Patterns

**Error Handling Patterns:**

Validation errors:

- Empty or whitespace-only task titles should produce inline validation near the relevant input.
- Validation should not clear the user's typed value.
- Add and edit flows should share the same title validation rule.

Storage errors:

- If localStorage read fails or contains invalid JSON, start with an empty task array.
- If localStorage write fails, keep the in-memory state and optionally show a non-blocking message if implemented.
- Do not introduce modal-heavy error handling for MVP.

Security errors:

- Never render task titles with raw HTML insertion.
- Use text-safe DOM APIs for user-provided task titles.

**Loading State Patterns:**

No loading state is required for normal MVP operation because all data is local and synchronous.

If a loading state is added later, it should not block initial rendering longer than necessary.

### Enforcement Guidelines

**All AI Agents MUST:**

- Use the task schema exactly as documented.
- Use `smiple-todo.tasks` as the localStorage key.
- Use camelCase for JavaScript and kebab-case for CSS classes/files.
- Keep task state as the runtime source of truth.
- Follow the flow: event → validate → update state → persist → render.
- Derive Active and Completed lists from the task array.
- Sort important active tasks before normal active tasks.
- Render user-provided task titles safely without `innerHTML`.
- Keep the MVP client-only with no backend, auth, database, or API.

**Pattern Enforcement:**

- Architecture reviews should compare implementation against this section.
- Any new module must have a clear responsibility not already covered by existing modules.
- Any schema change must update PRD/architecture/stories before implementation proceeds.

### Pattern Examples

**Good Examples:**

```js
const STORAGE_KEY = "smiple-todo.tasks";

function validateTaskTitle(title) {
  const value = title.trim();
  return value.length > 0 ? { valid: true, value } : { valid: false, value };
}
```

```js
const activeTasks = tasks
  .filter((task) => !task.completed)
  .sort((a, b) => Number(b.important) - Number(a.important));
```

**Anti-Patterns:**

```js
taskList.innerHTML = userTaskTitle;
```

```js
localStorage.setItem("todos", JSON.stringify(activeTasks));
localStorage.setItem("completed", JSON.stringify(completedTasks));
```

```js
{
  text: "Task title",
  done: false,
  priority: "high"
}
```

The examples above are anti-patterns because they either create XSS risk, split persisted state into competing sources of truth, or drift from the approved MVP schema.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
smiple-todo/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── README.md
├── public/
│   └── vite.svg
└── src/
    ├── main.js
    ├── tasks.js
    ├── storage.js
    ├── render.js
    ├── validation.js
    └── styles.css
```

Notes:

- `package-lock.json` is present when npm is used.
- `vite.config.js` may be optional for a default Vite app, but can exist if configuration is needed.
- `public/vite.svg` may be generated by the starter and can be removed later if unused.
- No `components/`, `pages/`, `services/`, or `routes/` folders are needed for MVP.

### Architectural Boundaries

**API Boundaries:**

There is no backend API boundary in the MVP. All behavior runs in the browser.

**Component Boundaries:**

The app uses simple DOM-rendered UI rather than framework components.

Logical UI boundaries:

- App shell: `index.html` and `src/styles.css`
- Add task form: HTML structure in `index.html`, event wiring in `src/main.js`
- Active task list: rendered by `src/render.js`
- Completed task section: rendered by `src/render.js`
- Task actions: wired by `src/main.js`, applied through `src/tasks.js`

**Service Boundaries:**

There are no external services.

Internal service-like boundaries:

- `src/tasks.js`: task domain operations and selectors.
- `src/storage.js`: persistence adapter for localStorage.
- `src/validation.js`: shared title validation.
- `src/render.js`: DOM output only.
- `src/main.js`: application orchestration.

**Data Boundaries:**

The task array is the single runtime data source.

Data ownership:

- `src/tasks.js` defines valid task operations.
- `src/storage.js` owns serialization and localStorage access.
- `src/render.js` receives task data but should not mutate task records.
- `src/main.js` coordinates reading, updating, saving, and rendering.

### Requirements to Structure Mapping

**Task Capture**

Related requirements: FR-1 to FR-4.

- HTML form: `index.html`
- Event handling: `src/main.js`
- Validation: `src/validation.js`
- Task creation: `src/tasks.js`
- Persistence: `src/storage.js`
- Render update: `src/render.js`

**Task List**

Related requirements: FR-5 to FR-10.

- Active list container: `index.html`
- Active list rendering: `src/render.js`
- Important sorting selector: `src/tasks.js`
- Edit action wiring: `src/main.js`
- Edit validation: `src/validation.js`
- Styling: `src/styles.css`

**Task Completion**

Related requirements: FR-11 to FR-14.

- Complete action wiring: `src/main.js`
- Complete operation: `src/tasks.js`
- Completed section rendering: `src/render.js`
- Completed styling: `src/styles.css`
- Persistence: `src/storage.js`

**Important Tasks**

Related requirements: FR-15 to FR-18.

- Important toggle wiring: `src/main.js`
- Important toggle operation: `src/tasks.js`
- Active important-first sorting: `src/tasks.js`
- Important rendering/styling: `src/render.js`, `src/styles.css`

**Task Removal**

Related requirements: FR-19 to FR-20.

- Delete action wiring: `src/main.js`
- Delete operation: `src/tasks.js`
- Persistence removal through full-array save: `src/storage.js`
- Render update: `src/render.js`

**Local Persistence**

Related requirements: FR-21 to FR-23.

- localStorage key and JSON persistence: `src/storage.js`
- Initial load: `src/main.js`
- Save after mutation: `src/main.js`

### Integration Points

**Internal Communication:**

The internal flow is:

```text
DOM event
→ main.js
→ validation.js if input is involved
→ tasks.js for state operation
→ storage.js to persist
→ render.js to update visible UI
```

No module should bypass this flow for task mutations.

**External Integrations:**

There are no external integrations in the MVP.

**Data Flow:**

```text
localStorage
→ storage.loadTasks()
→ main.js runtime tasks state
→ render.renderApp(tasks)
→ user action
→ tasks operation
→ storage.saveTasks(tasks)
→ render.renderApp(tasks)
```

### File Organization Patterns

**Configuration Files:**

- `package.json`: npm scripts and dependencies.
- `package-lock.json`: npm dependency lockfile.
- `vite.config.js`: optional Vite configuration if needed.
- `.gitignore`: excludes dependencies and build output.

**Source Organization:**

All application code lives in `src/`.

- `main.js` should stay small and coordinate modules.
- `tasks.js` should contain pure or mostly pure task operations.
- `storage.js` should isolate localStorage behavior.
- `render.js` should isolate DOM creation and updates.
- `validation.js` should provide reusable validation.
- `styles.css` should contain design tokens, base styles, layout, components, responsive rules, and focus states.

**Test Organization:**

No test framework is selected for MVP.

If tests are added later, use one of these patterns consistently:

```text
src/
  tasks.test.js
  validation.test.js
```

or

```text
tests/
  tasks.test.js
  validation.test.js
```

The first tests should target `tasks.js` and `validation.js` because they contain the most isolated logic.

**Asset Organization:**

- Static starter assets may live in `public/`.
- MVP does not require image assets.
- Remove unused starter assets during implementation if they are not referenced.

### Development Workflow Integration

**Development Server Structure:**

Vite serves `index.html` and source modules during local development.

Expected scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Build Process Structure:**

Vite builds static production assets from `index.html` and `src/` into `dist/`.

**Deployment Structure:**

The `dist/` folder can be deployed to any static hosting provider. No server runtime, environment variables, or backend deployment is required for MVP.
