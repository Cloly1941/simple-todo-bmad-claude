import test from "node:test";
import assert from "node:assert/strict";

import { createActiveTaskViewModel, createCompletedTaskViewModel, createEditingTaskViewModel } from "./render.js";

const task = {
  id: "task-1",
  title: "<img src=x onerror=alert(1)> Finish report",
  completed: false,
  important: false,
  createdAt: "2026-05-23T00:00:00.000Z",
  updatedAt: "2026-05-23T00:00:00.000Z",
};

test("createActiveTaskViewModel preserves task title for safe text rendering", () => {
  const viewModel = createActiveTaskViewModel(task);

  assert.equal(viewModel.id, task.id);
  assert.equal(viewModel.title, task.title);
  assert.equal(viewModel.status, "Active");
  assert.equal(viewModel.actionsLabel, `Actions for ${task.title}`);
});

test("createActiveTaskViewModel defines future action controls in logical order", () => {
  const viewModel = createActiveTaskViewModel(task);

  assert.deepEqual(
    viewModel.actions.map((action) => action.action),
    ["complete", "toggle-important", "edit", "delete"],
  );
  assert.deepEqual(
    viewModel.actions.map((action) => action.ariaLabel),
    [
      `Complete task: ${task.title}`,
      `Mark important: ${task.title}`,
      `Edit task: ${task.title}`,
      `Delete task: ${task.title}`,
    ],
  );
});

test("createEditingTaskViewModel exposes edit input, validation, and save/cancel actions", () => {
  const viewModel = createEditingTaskViewModel(task, "Draft <b>report</b>", "Task title can’t be empty.");

  assert.equal(viewModel.id, task.id);
  assert.equal(viewModel.inputValue, "Draft <b>report</b>");
  assert.equal(viewModel.inputId, `edit-title-${task.id}`);
  assert.equal(viewModel.errorId, `edit-title-error-${task.id}`);
  assert.equal(viewModel.errorMessage, "Task title can’t be empty.");
  assert.deepEqual(
    viewModel.actions.map((action) => action.action),
    ["save-edit", "cancel-edit"],
  );
  assert.deepEqual(
    viewModel.actions.map((action) => action.ariaLabel),
    [`Save edited task: ${task.title}`, `Cancel editing task: ${task.title}`],
  );
});

test("createCompletedTaskViewModel exposes completed status with a delete action", () => {
  const viewModel = createCompletedTaskViewModel({ ...task, completed: true });

  assert.equal(viewModel.id, task.id);
  assert.equal(viewModel.title, task.title);
  assert.equal(viewModel.status, "Completed");
  assert.deepEqual(viewModel.actions, [
    { action: "delete", label: "Delete", ariaLabel: `Delete task: ${task.title}` },
  ]);
});
