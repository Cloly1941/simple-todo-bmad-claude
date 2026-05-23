import test from "node:test";
import assert from "node:assert/strict";

import { loadTasks, saveTasks, storageKey } from "./storage.js";

const validTask = {
  id: "task-1",
  title: "Finish assignment",
  completed: false,
  important: false,
  createdAt: "2026-05-23T00:00:00.000Z",
  updatedAt: "2026-05-23T00:00:00.000Z",
};

function createStorage(initialEntries = {}) {
  const entries = new Map(Object.entries(initialEntries));

  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null;
    },
    setItem(key, value) {
      entries.set(key, String(value));
    },
    entries,
  };
}

test("loadTasks returns an empty array when no saved tasks exist", () => {
  const storage = createStorage();

  assert.deepEqual(loadTasks(storage), []);
});

test("saveTasks writes the full task array as JSON under the shared storage key", () => {
  const storage = createStorage();

  saveTasks([validTask], storage);

  assert.equal(storage.entries.has(storageKey), true);
  assert.deepEqual(JSON.parse(storage.entries.get(storageKey)), [validTask]);
});

test("loadTasks returns saved tasks when every item matches the approved schema", () => {
  const storage = createStorage({
    [storageKey]: JSON.stringify([validTask]),
  });

  assert.deepEqual(loadTasks(storage), [validTask]);
});

test("loadTasks fails safely to an empty array for unreadable or invalid data", () => {
  assert.deepEqual(loadTasks(createStorage({ [storageKey]: "not-json" })), []);
  assert.deepEqual(loadTasks(createStorage({ [storageKey]: JSON.stringify({ tasks: [validTask] }) })), []);
  assert.deepEqual(loadTasks(createStorage({ [storageKey]: JSON.stringify([{ ...validTask, completed: "false" }]) })), []);
  assert.deepEqual(loadTasks(createStorage({ [storageKey]: JSON.stringify([{ ...validTask, extra: true }]) })), []);
});

test("storage functions fail safely when storage access throws", () => {
  const throwingStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };

  assert.deepEqual(loadTasks(throwingStorage), []);
  assert.doesNotThrow(() => saveTasks([validTask], throwingStorage));
});
