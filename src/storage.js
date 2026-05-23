export const storageKey = "smiple-todo.tasks";

const taskFields = ["id", "title", "completed", "important", "createdAt", "updatedAt"];

export function loadTasks(storage = globalThis.localStorage) {
  try {
    const savedTasks = storage?.getItem(storageKey);

    if (!savedTasks) {
      return [];
    }

    const tasks = JSON.parse(savedTasks);

    if (!Array.isArray(tasks) || !tasks.every(isTask)) {
      return [];
    }

    return tasks;
  } catch {
    return [];
  }
}

export function saveTasks(tasks, storage = globalThis.localStorage) {
  try {
    storage?.setItem(storageKey, JSON.stringify(tasks));
  } catch {
    return;
  }
}

function isTask(task) {
  if (!task || typeof task !== "object" || Array.isArray(task)) {
    return false;
  }

  const keys = Object.keys(task);

  return (
    keys.length === taskFields.length &&
    taskFields.every((field) => keys.includes(field)) &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.important === "boolean" &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}
