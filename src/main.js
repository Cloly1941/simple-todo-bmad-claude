import "./styles.css";
import { renderActiveTasks } from "./render.js";
import { loadTasks, saveTasks } from "./storage.js";
import { addTask } from "./tasks.js";
import { validateTaskTitle } from "./validation.js";

const addTaskForm = document.querySelector(".add-task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskTitleError = document.querySelector("#task-title-error");

let tasks = loadTasks();

renderActiveTasks(tasks);

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
  renderActiveTasks(tasks);
  taskTitleInput.value = "";
  taskTitleInput.focus();
});

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
