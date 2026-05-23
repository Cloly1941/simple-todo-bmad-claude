import "./styles.css";
import { renderActiveTasks } from "./render.js";
import { addTask } from "./tasks.js";

const addTaskForm = document.querySelector(".add-task-form");
const taskTitleInput = document.querySelector("#task-title");

let tasks = [];

renderActiveTasks(tasks);

addTaskForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!taskTitleInput) {
    return;
  }

  const task = addTask(taskTitleInput.value);

  if (!task) {
    return;
  }

  tasks = [...tasks, task];
  renderActiveTasks(tasks);
  taskTitleInput.value = "";
  taskTitleInput.focus();
});
