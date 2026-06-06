---
title: 'Fix add and edit control alignment'
type: 'bugfix'
created: '2026-06-06'
status: 'done'
route: 'one-shot'
---

# Fix add and edit control alignment

## Intent

**Problem:** The Add form input and Add button did not sit on the same visual center line, and the edit-state input had the same mismatch with the Save and Cancel controls.

**Approach:** Normalize the affected CSS layout so desktop/tablet controls share the same row height and alignment while preserving the Warm Minimal visual tone and mobile stacking behavior.

## Suggested Review Order

**Add task alignment**

- Start with the shared input focus behavior that stopped vertical jumping.
  [styles.css:176](../../../src/styles.css#L176)

- Confirm the Add button now centers its label in the matched control height.
  [styles.css:202](../../../src/styles.css#L202)

- Check the add row stretches controls evenly from tablet width upward.
  [styles.css:539](../../../src/styles.css#L539)

**Edit task alignment**

- Confirm task action labels center inside their buttons.
  [styles.css:431](../../../src/styles.css#L431)

- Check edit rows gain a third column at tablet width for Save/Cancel alignment.
  [styles.css:557](../../../src/styles.css#L557)

- Verify edit action buttons match the edit input height.
  [styles.css:567](../../../src/styles.css#L567)
