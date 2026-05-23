export const taskModelFields = ["id", "title", "completed", "important", "createdAt", "updatedAt"];

export function addTask(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return {
    id: createTaskId(),
    title: trimmedTitle,
    completed: false,
    important: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getActiveTasks(tasks) {
  return tasks.filter((task) => !task.completed);
}

function createTaskId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
