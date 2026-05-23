---
title: PRD: smiple-todo
status: final
created: 2026-05-23
updated: 2026-05-23
---

# PRD: smiple-todo

## 1. Overview

smiple-todo is a lightweight web-based todo application for students and employees who manage study or work tasks and need a simple way to avoid feeling scattered or forgetting important work. The MVP focuses on fast task capture, clear visibility of important tasks, and local-only persistence without requiring an account.

## 2. Problem Statement

Students and employees often receive multiple tasks across study, work, and daily responsibilities. Without a simple tracking system, they can lose track of what matters, forget important tasks, or feel overwhelmed by an unclear task list.

smiple-todo reduces this friction by making it easy to create tasks, keep active work visible, and make important tasks hard to miss.

## 3. Goals

- Help users create tasks quickly and easily.
- Help users avoid forgetting important tasks.
- Keep the app simple enough for first-time use without onboarding or account setup.
- Store task data locally so users can return to their list in the same browser.

## 4. Non-Goals

- User accounts, authentication, or cloud sync.
- Collaboration or task assignment between users.
- Complex project management features such as boards, dependencies, teams, or reporting.
- Native mobile or desktop apps.
- A separate current-task or focus-mode system beyond marking tasks as important.

## 5. Target Users

### Primary Users

- Students tracking homework, study items, assignments, or personal learning tasks.
- Employees tracking assigned work tasks, follow-ups, and personal reminders.

### User Needs

- Capture a task before they forget it.
- See which tasks are still active.
- Edit a task if they typed it incorrectly or need to clarify it.
- Mark tasks as completed when done.
- Identify important tasks so they are not buried in the list.
- Reopen the web app later and still see their saved tasks.

## 6. MVP Scope

The MVP is a local-first web todo app with the following capabilities:

- Add a task.
- View active tasks.
- Edit a task title.
- Mark a task as complete.
- View completed tasks in a separate Completed section.
- Delete a task.
- Mark a task as important.
- Sort important active tasks to the top of the list.
- Highlight important tasks visually.
- Persist tasks locally in the browser.

## 7. Functional Requirements

### Task Capture

- FR-1: The user can create a new task by entering a short task title.
- FR-2: The app prevents empty task titles from being added.
- FR-3: After a task is added, it appears immediately in the active task list.
- FR-4: The task input is cleared after successful task creation.

### Task List

- FR-5: The user can view all active tasks in a clear list.
- FR-6: Each task displays its title and completion state.
- FR-7: Important active tasks are sorted above normal active tasks.
- FR-8: Important tasks are visually highlighted so they remain easy to notice when the list grows.
- FR-9: The user can edit the title of an existing task.
- FR-10: The app prevents edited task titles from being saved as empty.

### Task Completion

- FR-11: The user can mark an active task as completed.
- FR-12: Completed tasks move out of the active task list.
- FR-13: Completed tasks appear in a separate Completed section.
- FR-14: Completed tasks remain saved locally unless the user deletes them.

### Important Tasks

- FR-15: The user can mark a task as important.
- FR-16: The user can remove the important status from a task.
- FR-17: Important active tasks appear above normal active tasks.
- FR-18: Important tasks use a visual treatment that is noticeable but does not make the list feel cluttered.

### Task Removal

- FR-19: The user can delete a task they no longer need.
- FR-20: Deleting a task removes it from local storage.

### Local Persistence

- FR-21: The app stores tasks locally in the browser.
- FR-22: The user can close and reopen the app in the same browser and still see their saved tasks.
- FR-23: The app does not require login, signup, or network-based storage for MVP task persistence.

## 8. User Journeys

### UJ-1: Capture and Remember an Important Task

1. The user opens the web app.
2. The user types a task they need to remember.
3. The user adds the task.
4. The user marks the task as important.
5. The task moves above normal active tasks and is visually highlighted.
6. Later, the user returns to the app and sees the important task still saved.
7. After finishing the task, the user marks it complete.
8. The task moves to the Completed section.

### UJ-2: Correct a Task After Creating It

1. The user notices a task title is unclear or has a typo.
2. The user edits the task title.
3. The corrected title is saved and remains visible in the task list.
4. The corrected title persists after the user reloads or reopens the app in the same browser.

## 9. Success Metrics

- A user can create a task without instructions.
- A user can identify important tasks at a glance.
- A user can close and reopen the web app and still see their saved tasks.
- A user can complete the core flow of add task → mark important → complete task in under one minute.
- A user can find completed tasks without them distracting from active work.

### Counter-Metrics

- The app should not become cluttered with too many controls for the MVP.
- Important tasks should not be so visually noisy that normal task scanning becomes harder.
- The Completed section should not distract users from active tasks.

## 10. Non-Functional Requirements

- NFR-1: The app should load quickly in a modern browser.
- NFR-2: The app should work without a backend server for task data persistence.
- NFR-3: The UI should be simple and readable on common desktop and mobile browser widths.
- NFR-4: Local task data should remain on the user's device/browser.
- NFR-5: The MVP should avoid collecting personal data.

## 11. Open Questions

None for MVP definition.
