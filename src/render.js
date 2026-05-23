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

export function createActiveTaskItem(task) {
  const viewModel = createActiveTaskViewModel(task);
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.taskId = viewModel.id;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = viewModel.status;

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = viewModel.title;

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
    actionsLabel: `Actions for ${task.title}`,
    actions: [
      { action: "complete", label: "Complete", ariaLabel: `Complete task: ${task.title}` },
      { action: "toggle-important", label: "Important", ariaLabel: `Mark important: ${task.title}` },
      { action: "edit", label: "Edit", ariaLabel: `Edit task: ${task.title}` },
      { action: "delete", label: "Delete", ariaLabel: `Delete task: ${task.title}` },
    ],
  };
}

function createTaskAction({ action, label, ariaLabel }) {
  const button = document.createElement("button");
  button.className = "task-action";
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("aria-label", ariaLabel);
  button.textContent = label;
  return button;
}
