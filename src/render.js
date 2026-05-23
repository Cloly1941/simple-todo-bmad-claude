import { getActiveTasks } from "./tasks.js";

export function getAppRoot() {
  return document.querySelector(".app-shell");
}

export function renderActiveTasks(tasks) {
  const activeList = document.querySelector("[data-active-list]");
  const activeEmptyState = document.querySelector("[data-active-empty]");

  if (!activeList || !activeEmptyState) {
    return;
  }

  const activeTasks = getActiveTasks(tasks);
  activeList.replaceChildren(...activeTasks.map(createActiveTaskItem));
  activeEmptyState.hidden = activeTasks.length > 0;
  activeList.hidden = activeTasks.length === 0;
}

function createActiveTaskItem(task) {
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.taskId = task.id;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = "Active";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  item.append(status, title);

  return item;
}
