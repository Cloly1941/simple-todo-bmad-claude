import { getActiveTasks, getCompletedTasks } from "./tasks.js";

export function getAppRoot() {
  return document.querySelector(".app-shell");
}

export function renderActiveTasks(tasks, editState = {}) {
  const activeList = document.querySelector("[data-active-list]");
  const activeEmptyState = document.querySelector("[data-active-empty]");

  if (!activeList || !activeEmptyState) {
    return;
  }

  const activeTasks = getActiveTasks(tasks);
  activeList.replaceChildren(
    ...activeTasks.map((task) =>
      task.id === editState.taskId ? createEditingTaskItem(task, editState) : createActiveTaskItem(task),
    ),
  );
  activeEmptyState.hidden = activeTasks.length > 0;
  activeList.hidden = activeTasks.length === 0;
}

export function renderCompletedTasks(tasks) {
  const completedList = document.querySelector("[data-completed-list]");
  const completedEmptyState = document.querySelector("[data-completed-empty]");

  if (!completedList || !completedEmptyState) {
    return;
  }

  const completedTasks = getCompletedTasks(tasks);
  completedList.replaceChildren(...completedTasks.map((task) => createCompletedTaskItem(task)));
  completedEmptyState.hidden = completedTasks.length > 0;
  completedList.hidden = completedTasks.length === 0;
}

export function createActiveTaskItem(task) {
  const viewModel = createActiveTaskViewModel(task);
  const item = document.createElement("li");
  item.className = viewModel.isImportant ? "task-item task-item--important" : "task-item";
  item.dataset.taskId = viewModel.id;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = viewModel.status;

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = viewModel.title;

  if (viewModel.importantLabel) {
    const marker = document.createElement("span");
    marker.className = "task-important-marker";
    marker.textContent = viewModel.importantLabel;
    content.append(marker);
  }

  content.append(title);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.setAttribute("aria-label", viewModel.actionsLabel);

  actions.append(...viewModel.actions.map((action) => createTaskAction(action)));

  item.append(status, content, actions);

  return item;
}

export function createActiveTaskViewModel(task) {
  return {
    id: task.id,
    title: task.title,
    status: "Active",
    isImportant: task.important,
    importantLabel: task.important ? "Important" : "",
    actionsLabel: `Actions for ${task.title}`,
    actions: [
      { action: "complete", label: "Complete", ariaLabel: `Complete task: ${task.title}` },
      {
        action: "toggle-important",
        label: task.important ? "Unmark" : "Important",
        ariaLabel: task.important ? `Remove important: ${task.title}` : `Mark important: ${task.title}`,
        ariaPressed: task.important ? "true" : "false",
      },
      { action: "edit", label: "Edit", ariaLabel: `Edit task: ${task.title}` },
      { action: "delete", label: "Delete", ariaLabel: `Delete task: ${task.title}` },
    ],
  };
}

export function createEditingTaskViewModel(task, inputValue = task.title, errorMessage = "") {
  return {
    id: task.id,
    isImportant: task.important,
    importantLabel: task.important ? "Important" : "",
    status: "Editing",
    inputId: `edit-title-${task.id}`,
    errorId: `edit-title-error-${task.id}`,
    inputValue,
    errorMessage,
    actionsLabel: `Edit actions for ${task.title}`,
    actions: [
      { action: "save-edit", label: "Save", ariaLabel: `Save edited task: ${task.title}` },
      { action: "cancel-edit", label: "Cancel", ariaLabel: `Cancel editing task: ${task.title}` },
    ],
  };
}

export function createCompletedTaskViewModel(task) {
  return {
    id: task.id,
    title: task.title,
    status: "Completed",
    actions: [{ action: "delete", label: "Delete", ariaLabel: `Delete task: ${task.title}` }],
  };
}

function createCompletedTaskItem(task) {
  const viewModel = createCompletedTaskViewModel(task);
  const item = document.createElement("li");
  item.className = "task-item task-item--completed";
  item.dataset.taskId = viewModel.id;

  const status = document.createElement("span");
  status.className = "task-status task-status--completed";
  status.textContent = viewModel.status;

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("span");
  title.className = "task-title task-title--completed";
  title.textContent = viewModel.title;

  content.append(title);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(...viewModel.actions.map((action) => createTaskAction(action)));

  item.append(status, content, actions);

  return item;
}

function createEditingTaskItem(task, editState) {
  const viewModel = createEditingTaskViewModel(task, editState.value ?? task.title, editState.errorMessage ?? "");
  const item = document.createElement("li");
  item.className = viewModel.isImportant ? "task-item task-item--important task-item--editing" : "task-item task-item--editing";
  item.dataset.taskId = viewModel.id;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = viewModel.status;

  const content = document.createElement("div");
  content.className = "task-content task-content--editing";

  if (viewModel.importantLabel) {
    const marker = document.createElement("span");
    marker.className = "task-important-marker";
    marker.textContent = viewModel.importantLabel;
    content.append(marker);
  }

  const label = document.createElement("label");
  label.className = "edit-task-label";
  label.htmlFor = viewModel.inputId;
  label.textContent = "Edit task title";

  const input = document.createElement("input");
  input.className = "task-input edit-task-input";
  input.id = viewModel.inputId;
  input.name = "edit-title";
  input.value = viewModel.inputValue;
  input.setAttribute("aria-describedby", viewModel.errorId);

  const error = document.createElement("p");
  error.className = "validation-message edit-validation-message";
  error.id = viewModel.errorId;
  error.textContent = viewModel.errorMessage;
  error.hidden = !viewModel.errorMessage;

  if (viewModel.errorMessage) {
    input.setAttribute("aria-invalid", "true");
  }

  content.append(label, input, error);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.setAttribute("aria-label", viewModel.actionsLabel);
  actions.append(...viewModel.actions.map((action) => createTaskAction(action)));

  item.append(status, content, actions);

  return item;
}

function createTaskAction({ action, label, ariaLabel, ariaPressed }) {
  const button = document.createElement("button");
  button.className = "task-action";
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("aria-label", ariaLabel);

  if (ariaPressed) {
    button.setAttribute("aria-pressed", ariaPressed);
  }

  button.textContent = label;
  return button;
}
