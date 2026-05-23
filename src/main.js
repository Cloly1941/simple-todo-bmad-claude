import "./styles.css";
import { renderActiveTasks } from "./render.js";
import { loadTasks, saveTasks } from "./storage.js";
import { addTask, editTaskTitle } from "./tasks.js";
import { validateTaskTitle } from "./validation.js";

const addTaskForm = document.querySelector(".add-task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskTitleError = document.querySelector("#task-title-error");

let tasks = loadTasks();
let editState = {};

renderTasks();

addTaskForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!taskTitleInput) {
    return;
  }

  const validation = validateTaskTitle(taskTitleInput.value);

  if (!validation.valid) {
    showTaskTitleError(validation.message);
    taskTitleInput.focus();
    return;
  }

  clearTaskTitleError();

  const task = addTask(validation.value);

  if (!task) {
    return;
  }

  tasks = [...tasks, task];
  saveTasks(tasks);
  editState = {};
  renderTasks();
  taskTitleInput.value = "";
  taskTitleInput.focus();
});

document.querySelector("[data-active-list]")?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const taskItem = actionButton?.closest("[data-task-id]");

  if (!actionButton || !taskItem) {
    return;
  }

  const taskId = taskItem.dataset.taskId;

  if (actionButton.dataset.action === "edit") {
    editState = { taskId };
    renderTasks();
    focusEditInput(taskId);
    return;
  }

  if (actionButton.dataset.action === "cancel-edit") {
    editState = {};
    renderTasks();
    focusTaskAction(taskId, "edit");
    return;
  }

  if (actionButton.dataset.action === "save-edit") {
    const editInput = taskItem.querySelector(".edit-task-input");

    if (!editInput) {
      return;
    }

    const validation = validateTaskTitle(editInput.value);

    if (!validation.valid) {
      editState = { taskId, value: validation.value, errorMessage: validation.message };
      renderTasks();
      focusEditInput(taskId);
      return;
    }

    tasks = editTaskTitle(tasks, taskId, validation.value);
    saveTasks(tasks);
    editState = {};
    renderTasks();
    focusTaskAction(taskId, "edit");
  }
});

function renderTasks() {
  renderActiveTasks(tasks, editState);
}

function focusEditInput(taskId) {
  document.querySelector(`[data-task-id="${CSS.escape(taskId)}"] .edit-task-input`)?.focus();
}

function focusTaskAction(taskId, action) {
  document.querySelector(`[data-task-id="${CSS.escape(taskId)}"] [data-action="${action}"]`)?.focus();
}

function showTaskTitleError(message) {
  taskTitleInput?.setAttribute("aria-invalid", "true");
  taskTitleInput?.setAttribute("aria-describedby", "task-helper task-title-error");

  if (taskTitleError) {
    taskTitleError.textContent = message;
    taskTitleError.hidden = false;
  }
}

function clearTaskTitleError() {
  taskTitleInput?.removeAttribute("aria-invalid");
  taskTitleInput?.setAttribute("aria-describedby", "task-helper");

  if (taskTitleError) {
    taskTitleError.hidden = true;
  }
}
