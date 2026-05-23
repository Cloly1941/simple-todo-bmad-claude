---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-smiple-todo-2026-05-23/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# smiple-todo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for smiple-todo, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The user can create a new task by entering a short task title.
FR2: The app prevents empty task titles from being added.
FR3: After a task is added, it appears immediately in the active task list.
FR4: The task input is cleared after successful task creation.
FR5: The user can view all active tasks in a clear list.
FR6: Each task displays its title and completion state.
FR7: Important active tasks are sorted above normal active tasks.
FR8: Important tasks are visually highlighted so they remain easy to notice when the list grows.
FR9: The user can edit the title of an existing task.
FR10: The app prevents edited task titles from being saved as empty.
FR11: The user can mark an active task as completed.
FR12: Completed tasks move out of the active task list.
FR13: Completed tasks appear in a separate Completed section.
FR14: Completed tasks remain saved locally unless the user deletes them.
FR15: The user can mark a task as important.
FR16: The user can remove the important status from a task.
FR17: Important active tasks appear above normal active tasks.
FR18: Important tasks use a visual treatment that is noticeable but does not make the list feel cluttered.
FR19: The user can delete a task they no longer need.
FR20: Deleting a task removes it from local storage.
FR21: The app stores tasks locally in the browser.
FR22: The user can close and reopen the app in the same browser and still see their saved tasks.
FR23: The app does not require login, signup, or network-based storage for MVP task persistence.

### NonFunctional Requirements

NFR1: The app should load quickly in a modern browser.
NFR2: The app should work without a backend server for task data persistence.
NFR3: The UI should be simple and readable on common desktop and mobile browser widths.
NFR4: Local task data should remain on the user's device/browser.
NFR5: The MVP should avoid collecting personal data.

### Additional Requirements

- Initialize the project with Vite Vanilla JavaScript as the first implementation story.
- Keep the MVP client-only with no backend, authentication, database, account system, or network task storage.
- Use plain JavaScript in the browser with ES modules.
- Use plain CSS compatible with a lightweight custom design system and tokens.
- Organize the app around small modules: `main.js`, `tasks.js`, `storage.js`, `render.js`, `validation.js`, and `styles.css`.
- Use the task object schema: `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt`.
- Store all tasks as a single JSON task array under the localStorage key `smiple-todo.tasks`.
- Load saved tasks from localStorage on app start, defaulting safely to an empty array when no valid saved data exists.
- Persist the full task array after every successful mutation.
- Keep a single in-memory task array as the runtime source of truth.
- Follow the state update flow: user event → validate input → update tasks → save tasks → render.
- Derive Active and Completed lists from the task array rather than storing separate lists.
- Sort active tasks with important tasks first, preserving stable ordering within groups where practical.
- Trim task titles before create and edit saves; reject empty or whitespace-only titles.
- Render task titles with text-safe DOM APIs and avoid raw HTML insertion for user-provided content.
- Use semantic HTML and keyboard-accessible controls.
- Use stable DOM action identifiers such as `data-action="complete"`, `data-action="toggle-important"`, `data-action="edit"`, and `data-action="delete"`, plus `data-task-id` for task identity.
- Use camelCase for JavaScript variables, functions, object fields, and module exports.
- Use kebab-case for CSS classes and file names.
- Deployable output should be static Vite build assets with no server runtime or environment configuration required for MVP.
- Avoid framework dependencies, routing, backend APIs, analytics, telemetry, PWA/service worker work, and automated test framework setup unless intentionally added later.

### UX Design Requirements

UX-DR1: Implement a focused single-page layout where the add-task form, Active list, and Completed section are immediately understandable without onboarding.
UX-DR2: Use a calm, light Warm Minimal visual direction with generous spacing, rounded controls, and restrained emphasis.
UX-DR3: Define CSS design tokens for background, surface, text, muted text, border, primary action, important highlight, completed state, error state, spacing, typography, radius, and focus states.
UX-DR4: Use a readable centered content column on wider screens, approximately 640–720px wide, rather than stretching the task list across the full viewport.
UX-DR5: Implement mobile-first responsive CSS so the layout remains usable on common desktop and mobile browser widths.
UX-DR6: Ensure controls remain comfortable for touch users on narrow screens, including wrapping or concise labels/icons where needed.
UX-DR7: Keep the task title visually dominant in each task row/card while task controls remain secondary but discoverable.
UX-DR8: Implement an Add Task Form with accessible label, keyboard-reachable Add button, focused and invalid states, inline validation, and immediate Active-list update on valid submit.
UX-DR9: Implement a Task Item pattern with completion control, task title, important control, edit action, delete action, optional important marker, and states for active, important, editing, completed, validation error, hover, and focus.
UX-DR10: Implement an Active Task List with a clear heading, task items, optional useful task count, empty state, and immediate updates after add, edit, complete, delete, or important toggle actions.
UX-DR11: Implement a Completed Section below Active with a clear heading, muted but readable completed task styling, empty state, and deletion support if task deletion is available for completed tasks.
UX-DR12: Implement Empty States with plain helpful text, including “No active tasks yet. Add a task above.” for Active and “No completed tasks yet.” for Completed.
UX-DR13: Implement Inline Validation Message behavior with short copy such as “Task title can’t be empty.”, associated with the relevant input, not relying on color alone, and clearing when valid input is provided.
UX-DR14: Prevent empty or whitespace-only titles on both add and edit flows without resetting the user's typed value.
UX-DR15: Provide immediate feedback for task creation, editing, importance toggling, completion, and deletion through visible state changes rather than heavy modal flows.
UX-DR16: Show important status through both list position and visual treatment, such as amber highlight, accent border, icon marker, or label, without relying on color alone.
UX-DR17: Use important-task styling that communicates “pay attention” without creating alarm or visual noise.
UX-DR18: Move completed tasks out of Active and into Completed as the primary completion feedback.
UX-DR19: Style completed tasks as visually secondary using muted text, lower emphasis, and optional line-through while keeping text accessible and readable.
UX-DR20: Target WCAG 2.1 AA as the practical accessibility baseline.
UX-DR21: Ensure all controls are reachable and usable by keyboard, including add, edit, complete, important toggle, and delete.
UX-DR22: Provide visible focus states for input and all buttons.
UX-DR23: Use accessible names/labels for add, complete, important, edit, delete, and validation messages.
UX-DR24: Ensure completion state does not rely only on color or line-through; section placement and accessible labels should clarify status.
UX-DR25: Use semantic structure and headings for the main content, Active section, and Completed section.
UX-DR26: Preserve keyboard focus during editing so keyboard users do not lose context.
UX-DR27: Avoid hidden core actions, complex menus, gesture-only actions, dense rows with too many equally weighted controls, and multi-level priority systems.

### FR Coverage Map

FR1: Epic 1 - Create a task with a short title
FR2: Epic 1 - Prevent empty task creation
FR3: Epic 1 - Show new task immediately in Active
FR4: Epic 1 - Clear input after task creation
FR5: Epic 1 - View active tasks clearly
FR6: Epic 1 - Display task title and completion state
FR7: Epic 3 - Sort important active tasks above normal tasks
FR8: Epic 3 - Visually highlight important tasks
FR9: Epic 2 - Edit existing task title
FR10: Epic 2 - Prevent empty edited task title
FR11: Epic 2 - Mark active task completed
FR12: Epic 2 - Move completed task out of Active
FR13: Epic 2 - Show completed tasks separately
FR14: Epic 2 - Keep completed tasks saved locally
FR15: Epic 3 - Mark task as important
FR16: Epic 3 - Remove important status
FR17: Epic 3 - Important active tasks appear above normal active tasks
FR18: Epic 3 - Important visual treatment stays noticeable but calm
FR19: Epic 2 - Delete task
FR20: Epic 2 - Delete task from local storage
FR21: Epic 2 - Store tasks locally in browser
FR22: Epic 2 - Persist tasks across close/reopen in same browser
FR23: Epic 2 - No login/signup/network storage required

## Epic List

### Epic 1: App Foundation & Fast Task Capture
Users can open the app, add valid tasks quickly, see active tasks immediately, and have a usable visual/layout foundation.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 2: Persistent Task Management
Users can return to the same browser and continue managing saved tasks, including editing, completing, deleting, and reviewing completed work.
**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR19, FR20, FR21, FR22, FR23

### Epic 3: Important Task Visibility & UX Polish
Users can mark important work, see it prioritized clearly, and use the app comfortably across desktop/mobile with accessible controls.
**FRs covered:** FR7, FR8, FR15, FR16, FR17, FR18

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: App Foundation & Fast Task Capture

Users can open the app, add valid tasks quickly, see active tasks immediately, and have a usable visual/layout foundation.

### Story 1.1: Initialize Static Todo App Shell

As a student or employee,
I want to open a simple todo app page with a clear task-management layout,
So that I immediately understand where to add tasks and where active/completed work will appear.

**Acceptance Criteria:**

**Given** the project has not yet been initialized
**When** the developer sets up the app
**Then** the project uses Vite Vanilla JavaScript with the expected static frontend structure
**And** the app can be started locally with a Vite dev server.

**Given** the user opens the app
**When** the page loads
**Then** the page shows a semantic main app shell with an app title, add-task area, Active section, and Completed section
**And** the Active and Completed sections have clear headings.

**Given** there are no tasks yet
**When** the page loads
**Then** the Active section shows an empty state
**And** the Completed section shows an empty state.

**Given** the app shell is visible
**When** the user views it on common desktop and mobile widths
**Then** the layout remains readable and centered appropriately
**And** the interface uses the Warm Minimal visual foundation with plain CSS tokens for colors, spacing, typography, radius, and focus states.

**Given** the app shell includes form controls
**When** a keyboard user tabs through the page
**Then** the add-task input and Add button are reachable in a logical order
**And** visible focus styles are present.

### Story 1.2: Add Valid Tasks to Active List

As a student or employee,
I want to enter a task title and add it to my active list,
So that I can capture work before I forget it.

**Acceptance Criteria:**

**Given** the app is open
**When** the user enters a non-empty task title and submits the add-task form
**Then** a new task is created with `id`, `title`, `completed`, `important`, `createdAt`, and `updatedAt` fields
**And** the task title is trimmed before being stored.

**Given** a valid task is submitted
**When** the task is created
**Then** it appears immediately in the Active section
**And** it is shown as not completed by default.

**Given** a valid task is submitted
**When** the Active section updates
**Then** the task input is cleared
**And** the Active empty state is no longer shown.

**Given** multiple valid tasks have been added
**When** the Active list is rendered
**Then** all active tasks are visible in a clear list
**And** each task displays its title and completion state.

**Given** a task title contains user-entered text
**When** the task is rendered
**Then** the title is displayed using DOM-safe text rendering
**And** user-provided title text is not inserted as raw HTML.

### Story 1.3: Prevent Empty Task Creation with Inline Validation

As a student or employee,
I want the app to reject empty task titles with a clear inline message,
So that I understand what to fix without losing my flow.

**Acceptance Criteria:**

**Given** the app is open
**When** the user submits an empty task title
**Then** no task is created
**And** an inline validation message appears near the add-task input.

**Given** the user enters only whitespace
**When** the user submits the add-task form
**Then** no task is created
**And** the validation message explains that the task title cannot be empty.

**Given** an invalid task title was submitted
**When** validation fails
**Then** the user's typed value is not reset
**And** the user can correct the title and submit again.

**Given** the validation message is visible
**When** the user enters a valid task title and submits
**Then** the task is created successfully
**And** the validation message is cleared.

**Given** the validation message is shown
**When** assistive technology reads the form
**Then** the message is programmatically associated with the relevant input
**And** the error state does not rely on color alone.

### Story 1.4: Render Active Tasks Clearly and Safely

As a student or employee,
I want active tasks to be shown in a readable list with clear controls,
So that I can scan what still needs attention.

**Acceptance Criteria:**

**Given** active tasks exist
**When** the Active section renders
**Then** each active task appears as a readable task item
**And** the task title remains the visually dominant element.

**Given** an active task is displayed
**When** the user views the task row
**Then** the task shows its completion state
**And** available task controls are visible or discoverable without complex menus or gestures.

**Given** active tasks are displayed
**When** the user navigates by keyboard
**Then** each task control can receive focus in a logical order
**And** visible focus styling is present.

**Given** the Active list is empty
**When** there are no active tasks
**Then** the Active empty state reads “No active tasks yet. Add a task above.”
**And** the empty state does not appear as an error.

**Given** the page is viewed on a narrow mobile width
**When** active task rows are displayed
**Then** task content remains readable
**And** controls remain tappable without making the row feel cluttered.

## Epic 2: Persistent Task Management

Users can return to the same browser and continue managing saved tasks, including editing, completing, deleting, and reviewing completed work.

### Story 2.1: Persist Tasks in Browser Storage

As a student or employee,
I want my task list to remain saved in the same browser,
So that I can close or refresh the app without losing my tasks.

**Acceptance Criteria:**

**Given** the app starts for the first time in a browser with no saved tasks
**When** the app loads
**Then** it initializes with an empty task array
**And** no login, signup, backend, or network storage is required.

**Given** the user adds a valid task
**When** the task array changes
**Then** the full task array is saved to localStorage under the key `smiple-todo.tasks`
**And** the saved data is JSON using the approved task schema.

**Given** saved tasks exist under `smiple-todo.tasks`
**When** the user refreshes or reopens the app in the same browser
**Then** the app loads the saved task array
**And** the saved active tasks are rendered in the Active section.

**Given** localStorage contains missing, invalid, or unreadable task data
**When** the app loads
**Then** the app fails safely to an empty task array
**And** the UI remains usable.

**Given** task data is stored locally
**When** the user uses the MVP
**Then** task data remains on the user's device/browser
**And** the app does not collect personal data or send task data over the network.

### Story 2.2: Edit Existing Task Titles

As a student or employee,
I want to edit a task title after creating it,
So that I can correct mistakes or clarify what the task means.

**Acceptance Criteria:**

**Given** an active task exists
**When** the user chooses to edit the task
**Then** the task title becomes editable
**And** the current title is available for editing without being lost.

**Given** the user enters a non-empty edited title
**When** the user saves the edit
**Then** the task title is updated with the trimmed value
**And** `updatedAt` is refreshed.

**Given** a valid edit is saved
**When** the task list re-renders
**Then** the updated title remains visible in the task list
**And** the updated task array is persisted to localStorage.

**Given** the user tries to save an empty or whitespace-only edited title
**When** validation runs
**Then** the edit is not saved
**And** an inline validation message appears near the edit field.

**Given** an edited title validation error appears
**When** the user corrects the title and saves again
**Then** the edit is saved successfully
**And** the validation message is cleared.

**Given** the user is editing by keyboard
**When** the edit controls are used
**Then** Save and Cancel actions are keyboard reachable
**And** keyboard focus remains understandable during and after editing.

### Story 2.3: Complete Tasks into Completed Section

As a student or employee,
I want to mark a task as completed,
So that finished work leaves my active list but remains available for review.

**Acceptance Criteria:**

**Given** an active task exists
**When** the user marks the task as complete
**Then** the task’s `completed` field is set to `true`
**And** `updatedAt` is refreshed.

**Given** a task has been marked complete
**When** the task list re-renders
**Then** the task no longer appears in the Active section
**And** it appears in the Completed section.

**Given** completed tasks exist
**When** the Completed section renders
**Then** completed tasks are visually secondary but readable
**And** the section remains below the Active section.

**Given** the app is refreshed or reopened in the same browser
**When** saved completed tasks are loaded
**Then** completed tasks still appear in the Completed section
**And** they remain saved unless the user deletes them.

**Given** there are no completed tasks
**When** the Completed section renders
**Then** it shows the empty state “No completed tasks yet.”
**And** the empty state does not distract from the Active list.

**Given** a keyboard user navigates task controls
**When** the complete action receives focus and is activated
**Then** the completion action works by keyboard
**And** the completed status is communicated without relying only on color or line-through.

### Story 2.4: Delete Tasks from the App

As a student or employee,
I want to delete tasks I no longer need,
So that my active and completed lists stay clean.

**Acceptance Criteria:**

**Given** an active task exists
**When** the user deletes the task
**Then** the task is removed from the task array
**And** it no longer appears in the Active section.

**Given** a completed task exists
**When** the user deletes the task
**Then** the task is removed from the task array
**And** it no longer appears in the Completed section.

**Given** a task is deleted
**When** the task array is saved
**Then** the deleted task is removed from localStorage persistence
**And** refreshing or reopening the app does not restore the deleted task.

**Given** a delete action is available
**When** the user navigates by keyboard
**Then** the delete action is reachable and activatable by keyboard
**And** the control has an accessible name that identifies it as a delete action.

**Given** deleting a task makes a section empty
**When** the section re-renders
**Then** the appropriate empty state appears
**And** the rest of the app remains usable.

## Epic 3: Important Task Visibility & UX Polish

Users can mark important work, see it prioritized clearly, and use the app comfortably across desktop/mobile with accessible controls.

### Story 3.1: Toggle Important Status on Tasks

As a student or employee,
I want to mark and unmark a task as important,
So that important work is identified separately from normal tasks.

**Acceptance Criteria:**

**Given** an active task exists
**When** the user marks the task as important
**Then** the task’s `important` field is set to `true`
**And** `updatedAt` is refreshed.

**Given** an important active task exists
**When** the user removes important status
**Then** the task’s `important` field is set to `false`
**And** `updatedAt` is refreshed.

**Given** important status changes
**When** the task array is saved
**Then** the updated `important` value is persisted to localStorage
**And** refreshing or reopening the app preserves the status.

**Given** the important action is available
**When** a keyboard user focuses and activates it
**Then** important status toggles successfully
**And** the control exposes the current important state with an accessible name or state.

**Given** the MVP only supports binary importance
**When** the user marks a task important
**Then** the app does not introduce priority levels, labels, categories, or urgency scales.

### Story 3.2: Prioritize Important Active Tasks

As a student or employee,
I want important active tasks to appear above normal active tasks,
So that important work is not buried in my list.

**Acceptance Criteria:**

**Given** the Active list contains both important and normal tasks
**When** the Active list renders
**Then** important active tasks appear above normal active tasks
**And** normal active tasks remain visible below them.

**Given** active tasks are sorted by importance
**When** tasks within the same importance group are rendered
**Then** their order remains stable based on the existing task order or creation order
**And** sorting does not modify the persisted task schema.

**Given** a normal active task is marked important
**When** the Active list re-renders
**Then** the task moves into the important group above normal active tasks
**And** the change is visible immediately.

**Given** an important active task is unmarked
**When** the Active list re-renders
**Then** the task moves back into the normal active group
**And** the change is visible immediately.

**Given** completed tasks exist
**When** important active tasks are sorted
**Then** completed tasks remain in the Completed section
**And** completed tasks do not appear in the Active list.

### Story 3.3: Apply Restrained Important Task Styling

As a student or employee,
I want important tasks to stand out without overwhelming the list,
So that I can notice important work while staying calm and focused.

**Acceptance Criteria:**

**Given** an active task is marked important
**When** the task renders in the Active list
**Then** it uses a restrained Warm Minimal important treatment such as amber highlight, accent border, icon marker, or label
**And** the treatment is noticeable without looking like an error or urgent alarm.

**Given** an important task is displayed
**When** the user scans the list
**Then** important status is communicated by more than color alone
**And** the task remains readable.

**Given** important and normal tasks appear together
**When** the Active list renders
**Then** important tasks are visually distinct from normal tasks
**And** normal tasks remain easy to scan.

**Given** the user removes important status
**When** the task re-renders
**Then** the important visual treatment is removed
**And** the task returns to normal active styling.

**Given** the app is viewed on desktop and mobile widths
**When** important tasks are displayed
**Then** the important treatment remains visible and readable
**And** it does not make task rows feel cluttered.

### Story 3.4: Finalize Responsive and Accessible Task Interactions

As a student or employee,
I want the todo app to work comfortably with keyboard, touch, and assistive technology,
So that I can manage tasks reliably across common devices and interaction styles.

**Acceptance Criteria:**

**Given** the user views the app on a narrow mobile width
**When** task rows and controls render
**Then** task titles remain readable
**And** controls remain comfortably tappable without requiring fragile gestures.

**Given** the user views the app on a wider desktop width
**When** the page renders
**Then** the app remains centered in a readable column
**And** task rows do not stretch uncomfortably across the viewport.

**Given** the user navigates only by keyboard
**When** they move through add, edit, complete, important toggle, delete, save, and cancel controls
**Then** all controls are reachable and activatable
**And** focus order follows the visual/task workflow.

**Given** any interactive control receives focus
**When** the focused state is visible
**Then** the focus indicator is clear and meets the Warm Minimal visual style
**And** it is not hidden by hover or active states.

**Given** assistive technology reads task controls
**When** add, complete, important, edit, delete, save, cancel, and validation elements are encountered
**Then** each has a clear accessible name or association
**And** stateful controls communicate their current state where applicable.

**Given** validation, important status, and completed status are shown
**When** the user relies on more than color perception
**Then** each status remains understandable through text, section placement, icon/label, or accessible state
**And** the UI targets WCAG 2.1 AA as the practical accessibility baseline.

