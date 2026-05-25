import test from "node:test";
import assert from "node:assert/strict";

import {
  addTask,
  completeTask,
  deleteTask,
  editTaskTitle,
  getActiveTasks,
  getCompletedTasks,
  taskModelFields,
  toggleTaskImportant,
} from "./tasks.js";

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

test("getActiveTasks returns important active tasks first while preserving stable group order", () => {
  const normalFirst = {
    id: "task-1",
    title: "Normal first",
    completed: false,
    important: false,
    createdAt: "2026-05-23T00:00:00.000Z",
    updatedAt: "2026-05-23T00:00:00.000Z",
  };
  const importantFirst = {
    id: "task-2",
    title: "Important first",
    completed: false,
    important: true,
    createdAt: "2026-05-23T00:00:01.000Z",
    updatedAt: "2026-05-23T00:00:01.000Z",
  };
  const normalSecond = {
    id: "task-3",
    title: "Normal second",
    completed: false,
    important: false,
    createdAt: "2026-05-23T00:00:02.000Z",
    updatedAt: "2026-05-23T00:00:02.000Z",
  };
  const importantSecond = {
    id: "task-4",
    title: "Important second",
    completed: false,
    important: true,
    createdAt: "2026-05-23T00:00:03.000Z",
    updatedAt: "2026-05-23T00:00:03.000Z",
  };
  const completedImportant = {
    id: "task-5",
    title: "Completed important",
    completed: true,
    important: true,
    createdAt: "2026-05-23T00:00:04.000Z",
    updatedAt: "2026-05-23T00:00:04.000Z",
  };
  const tasks = [normalFirst, importantFirst, normalSecond, importantSecond, completedImportant];

  const activeTasks = getActiveTasks(tasks);

  assert.deepEqual(activeTasks, [importantFirst, importantSecond, normalFirst, normalSecond]);
  assert.deepEqual(tasks, [normalFirst, importantFirst, normalSecond, importantSecond, completedImportant]);
  assert.deepEqual(activeTasks.map((task) => Object.keys(task)), [
    taskModelFields,
    taskModelFields,
    taskModelFields,
    taskModelFields,
  ]);
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

test("completeTask marks only the matching task completed and refreshes updatedAt", () => {
  const targetTask = {
    id: "task-1",
    title: "Draft report",
    completed: false,
    important: true,
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

  const completedTasks = completeTask(tasks, "task-1");

  assert.equal(completedTasks[0].completed, true);
  assert.equal(completedTasks[0].title, targetTask.title);
  assert.equal(completedTasks[0].important, targetTask.important);
  assert.equal(completedTasks[0].createdAt, targetTask.createdAt);
  assert.notEqual(completedTasks[0].updatedAt, targetTask.updatedAt);
  assert.deepEqual(Object.keys(completedTasks[0]), taskModelFields);
  assert.equal(completedTasks[1], otherTask);
  assert.equal(tasks[0], targetTask);
});

test("completeTask leaves tasks unchanged for unknown ids", () => {
  const task = addTask("Draft report");
  const tasks = [task];

  assert.equal(completeTask(tasks, "missing"), tasks);
});

test("toggleTaskImportant marks only the matching task important and refreshes updatedAt", () => {
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

  const updatedTasks = toggleTaskImportant(tasks, "task-1");

  assert.equal(updatedTasks[0].important, true);
  assert.equal(updatedTasks[0].id, targetTask.id);
  assert.equal(updatedTasks[0].title, targetTask.title);
  assert.equal(updatedTasks[0].completed, targetTask.completed);
  assert.equal(updatedTasks[0].createdAt, targetTask.createdAt);
  assert.notEqual(updatedTasks[0].updatedAt, targetTask.updatedAt);
  assert.deepEqual(Object.keys(updatedTasks[0]), taskModelFields);
  assert.equal(updatedTasks[1], otherTask);
  assert.equal(tasks[0], targetTask);
});

test("toggleTaskImportant unmarks only the matching important task", () => {
  const targetTask = {
    id: "task-1",
    title: "Draft report",
    completed: false,
    important: true,
    createdAt: "2026-05-23T00:00:00.000Z",
    updatedAt: "2026-05-23T00:00:00.000Z",
  };
  const tasks = [targetTask];

  const updatedTasks = toggleTaskImportant(tasks, "task-1");

  assert.equal(updatedTasks[0].important, false);
  assert.equal(updatedTasks[0].createdAt, targetTask.createdAt);
  assert.notEqual(updatedTasks[0].updatedAt, targetTask.updatedAt);
  assert.deepEqual(Object.keys(updatedTasks[0]), taskModelFields);
  assert.equal(tasks[0], targetTask);
});

test("toggleTaskImportant leaves tasks unchanged for unknown ids", () => {
  const task = addTask("Draft report");
  const tasks = [task];

  assert.equal(toggleTaskImportant(tasks, "missing"), tasks);
});

test("getCompletedTasks derives only completed tasks without mutating state", () => {
  const activeTask = addTask("Read notes");
  const completedTask = { ...addTask("Submit quiz"), completed: true };
  const tasks = [activeTask, completedTask];

  assert.deepEqual(getCompletedTasks(tasks), [completedTask]);
  assert.equal(tasks.length, 2);
});

test("deleteTask removes only the matching task without mutating state", () => {
  const targetTask = addTask("Draft report");
  const otherTask = addTask("Read notes");
  const completedTask = { ...addTask("Submit quiz"), completed: true };
  const tasks = [targetTask, otherTask, completedTask];

  const remainingTasks = deleteTask(tasks, targetTask.id);

  assert.deepEqual(remainingTasks, [otherTask, completedTask]);
  assert.equal(remainingTasks[0], otherTask);
  assert.equal(remainingTasks[1], completedTask);
  assert.deepEqual(Object.keys(remainingTasks[0]), taskModelFields);
  assert.deepEqual(Object.keys(remainingTasks[1]), taskModelFields);
  assert.deepEqual(tasks, [targetTask, otherTask, completedTask]);
});

test("deleteTask leaves tasks unchanged for unknown ids", () => {
  const task = addTask("Draft report");
  const tasks = [task];

  assert.equal(deleteTask(tasks, "missing"), tasks);
});
