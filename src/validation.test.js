import test from "node:test";
import assert from "node:assert/strict";

import { emptyTaskMessage, validateTaskTitle } from "./validation.js";

test("validateTaskTitle rejects an empty title with the shared message", () => {
  assert.deepEqual(validateTaskTitle(""), {
    valid: false,
    value: "",
    message: emptyTaskMessage,
  });
});

test("validateTaskTitle rejects whitespace-only titles without discarding typed value", () => {
  assert.deepEqual(validateTaskTitle("   "), {
    valid: false,
    value: "   ",
    message: emptyTaskMessage,
  });
});

test("validateTaskTitle accepts valid titles and returns the trimmed value", () => {
  assert.deepEqual(validateTaskTitle("  Read chapter 4  "), {
    valid: true,
    value: "Read chapter 4",
    message: "",
  });
});
