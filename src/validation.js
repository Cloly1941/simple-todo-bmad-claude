export const emptyTaskMessage = "Task title can’t be empty.";

export function validateTaskTitle(title) {
  const value = title.trim();

  if (!value) {
    return {
      valid: false,
      value: title,
      message: emptyTaskMessage,
    };
  }

  return {
    valid: true,
    value,
    message: "",
  };
}
