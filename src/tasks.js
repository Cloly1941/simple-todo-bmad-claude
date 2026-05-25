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

export function editTaskTitle(tasks, taskId, title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle || !tasks.some((task) => task.id === taskId)) {
    return tasks;
  }

  const timestamp = new Date().toISOString();

  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          title: trimmedTitle,
          updatedAt: timestamp,
        }
      : task,
  );
}

export function completeTask(tasks, taskId) {
  if (!tasks.some((task) => task.id === taskId)) {
    return tasks;
  }

  const timestamp = new Date().toISOString();

  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          completed: true,
          updatedAt: timestamp,
        }
      : task,
  );
}

export function toggleTaskImportant(tasks, taskId) {
  if (!tasks.some((task) => task.id === taskId)) {
    return tasks;
  }

  const timestamp = new Date().toISOString();

  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          important: !task.important,
          updatedAt: timestamp,
        }
      : task,
  );
}

export function deleteTask(tasks, taskId) {
  if (!tasks.some((task) => task.id === taskId)) {
    return tasks;
  }

  return tasks.filter((task) => task.id !== taskId);
}

export function getActiveTasks(tasks) {
  const activeTasks = tasks.filter((task) => !task.completed);
  return [...activeTasks.filter((task) => task.important), ...activeTasks.filter((task) => !task.important)];
}

export function getCompletedTasks(tasks) {
  return tasks.filter((task) => task.completed);
}

function createTaskId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
