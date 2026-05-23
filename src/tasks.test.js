import test from "node:test";
import assert from "node:assert/strict";

import { addTask, editTaskTitle, getActiveTasks, taskModelFields } from "./tasks.js";

test("addTask creates a trimmed active task with the approved schema", () => {
  const task = addTask("  Finish assignment  ");

  assert.deepEqual(Object.keys(task), taskModelFields);
  assert.equal(task.title, "Finish assignment");
  assert.equal(task.completed, false);
  assert.equal(task.important, false);
  assert.equal(typeof task.id, "string");
  assert.ok(task.id.length > 0);
  assert.doesNotThrow(() => new Date(task.createdAt).toISOString());
  assert.doesNotThrow(() => new Date(task.updatedAt).toISOString());
  assert.equal(task.createdAt, task.updatedAt);
});

test("addTask returns null for whitespace-only titles without throwing", () => {
  assert.equal(addTask("   "), null);
});

test("getActiveTasks derives only incomplete tasks without mutating state", () => {
  const activeTask = addTask("Read notes");
  const completedTask = { ...addTask("Submit quiz"), completed: true };
  const tasks = [activeTask, completedTask];

  assert.deepEqual(getActiveTasks(tasks), [activeTask]);
  assert.equal(tasks.length, 2);
});

test("editTaskTitle trims and updates only the matching task title and updatedAt", () => {
  const targetTask = {
    id: "task-1",
    title: "Draft report",
    completed: false,
    important: false,
    createdAt: "2026-05-23T00:00:00.000Z",
    updatedAt: "2026-05-23T00:00:00.000Z",
  };
  const otherTask = {
    id: "task-2",
    title: "Read notes",
    completed: false,
    important: false,
    createdAt: "2026-05-23T00:00:01.000Z",
    updatedAt: "2026-05-23T00:00:01.000Z",
  };
  const tasks = [targetTask, otherTask];

  const editedTasks = editTaskTitle(tasks, "task-1", "  Final report  ");

  assert.equal(editedTasks[0].title, "Final report");
  assert.equal(editedTasks[0].createdAt, targetTask.createdAt);
  assert.notEqual(editedTasks[0].updatedAt, targetTask.updatedAt);
  assert.deepEqual(Object.keys(editedTasks[0]), taskModelFields);
  assert.equal(editedTasks[1], otherTask);
  assert.equal(tasks[0], targetTask);
});

test("editTaskTitle leaves tasks unchanged for empty titles or unknown ids", () => {
  const task = addTask("Draft report");
  const tasks = [task];

  assert.equal(editTaskTitle(tasks, "missing", "Final report"), tasks);
  assert.equal(editTaskTitle(tasks, task.id, "   "), tasks);
});
