---
title: Deadline-first Todo App Product Brief
status: ready-for-prd
created: 2026-05-23
updated: 2026-05-23
---

# Product Brief: Simple Deadline Todo

## Summary

Simple Deadline Todo is a small, deadline-first todo app for individuals managing small project work. It helps users keep their active task list focused by separating tasks that are still current from tasks whose deadline has already passed.

The app is intentionally simple: users create tasks with a date-only deadline, see current tasks in an Active list, and expired tasks automatically move out of Active after their deadline passes.

## Problem

People managing small projects often accumulate task lists that become noisy over time. Once old or missed tasks stay mixed with current work, the list stops answering the most important question: "What still matters now?"

General-purpose todo apps often solve this with many controls — completion states, priorities, filters, tags, edits, recurring tasks, and drag-and-drop organization. For this MVP, those features would add complexity before the core behavior is proven.

## Target User

The primary user is an individual managing small project deadlines. They need a lightweight way to capture project tasks and quickly distinguish current work from expired work without maintaining a complex productivity system.

## Product Promise

Simple Deadline Todo helps users focus on tasks that are still active and relevant, instead of being distracted by stale or expired tasks.

## MVP Scope

The MVP includes:

- Add a task with a title and date-only deadline
- Show tasks whose deadline date has not started in an Active list
- Automatically move tasks into an Expired list on their deadline date
- Show the Expired list collapsed by default
- Delete tasks from storage
- Show the Active empty state: "No active tasks. Add a task with a future deadline."
- Show the Expired empty state: "No expired tasks."
- Store tasks locally in the browser with localStorage

The MVP excludes:

- Done or completed task states
- Editing existing tasks
- Search or filtering
- Priority levels
- Tags or categories
- Recurring tasks
- Drag-and-drop ordering
- Upcoming-deadline warnings or reminders

## Success Criteria

The MVP succeeds if a user can open the app, look at the Active list, and immediately understand which small-project tasks are still current and relevant.

## Key Product Decisions

- Expired tasks are separated from Active tasks and placed in an Expired list.
- The Expired list is collapsed by default so stale work remains accessible without distracting from current work.
- A task becomes expired at the start of its deadline date; this is an intentional strict-focus choice where the deadline date means the task is no longer active.
- Deleting tasks is included in the MVP so users can remove stale or mistaken entries from localStorage.

## Open Questions

No open product questions remain for the MVP brief.
