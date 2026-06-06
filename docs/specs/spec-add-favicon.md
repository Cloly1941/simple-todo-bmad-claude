---
title: 'Add favicon to browser tab'
type: 'feature'
created: '2026-06-06'
status: 'done'
route: 'one-shot'
---

# Add favicon to browser tab

## Intent

**Problem:** smiple-todo did not define a custom favicon, so the browser tab lacked a recognizable app marker.

**Approach:** Add a Warm Minimal SVG favicon under Vite's public asset directory and reference it from the document head so browsers can display it on the tab.

## Suggested Review Order

- The document head declares the browser-tab icon entry point.
  [index.html:6](../../index.html#L6)

- The SVG favicon uses the app's warm palette and todo-check motif.
  [favicon.svg:1](../../public/favicon.svg#L1)
