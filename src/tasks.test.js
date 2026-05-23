import test from "node:test";
import assert from "node:assert/strict";

import { addTask, getActiveTasks, taskModelFields } from "./tasks.js";

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
