---
title: 'Show styled loading state before app initialization'
type: 'bugfix'
created: '2026-06-06'
status: 'done'
baseline_commit: 'cbf5fee9350be02260e829e668eee33d3b0bf5fc'
context:
  - '{project-root}/CLAUDE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-design-specification.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** On first page entry, users can briefly see the raw HTML shell before CSS and JavaScript finish loading. The first impression should be intentional instead of showing unfinished markup.

**Approach:** Show an accessible, Warm Minimal loading screen while the app assets initialize, then reveal the styled todo app as soon as initial rendering is complete. Keep the loading state lightweight, local to the static entry point, and avoid adding artificial delay.

## Boundaries & Constraints

**Always:** Preserve the Vite Vanilla JavaScript structure, current task behavior, semantic app shell, localStorage behavior, responsive layout, accessibility affordances, CSS custom-property design system, distinctive font pairing, and existing micro-animations. The loading screen must be styled by critical inline CSS or otherwise available before external CSS/JS loads, so it cannot flash as raw HTML. It must communicate loading with accessible text/status, not only animation.

**Ask First:** Halt before adding dependencies, build plugins, a framework, service worker/PWA behavior, route-level loading architecture, skeleton screens for task rows, or any intentional wait that keeps the loader visible after the app is ready.

**Never:** Do not leave users on a blank page. Do not use JavaScript as the only source of first-paint styling for the loading state. Do not remove or change add, edit, complete, important toggle, delete, validation, persistence, or completed/active list behavior. Do not commit generated `dist/` output unless already tracked.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cold first load | User hard-refreshes or opens the app with assets uncached | A styled loading screen appears immediately instead of raw app HTML | If external CSS is delayed, inline critical loading styles still make the first paint intentional |
| JavaScript delayed | Module script takes longer than HTML parsing | Loading screen stays visible while the app waits for JS initialization | No task controls are shown as usable until initialization reveals the app |
| App initialized | `main.js` loads tasks and performs initial render | Loading screen is hidden/removed and the fully styled app shell is revealed without artificial delay | Initial render should reveal the app in a `finally`-style path if possible so a non-fatal render issue does not trap the page forever |
| No JavaScript | Browser has JavaScript disabled | User sees a clear noscript message instead of an indefinitely misleading interactive loader | Do not promise task functionality without JS |
| Production build | `npm run build` creates `dist/index.html` and assets | Built app retains the loading screen behavior and emits valid production assets | Build failure must be reported and fixed before review |

</frozen-after-approval>

## Code Map

- `index.html` -- Static entry point; should define the first-paint loading markup, critical loader styles, `noscript` fallback, and app shell initial hidden/loading state.
- `src/main.js` -- App initialization, event wiring, task persistence, and rendering; should reveal the app and hide the loader after initial render completes.
- `src/styles.css` -- Existing Warm Minimal design system; should include any non-critical finishing styles/transitions for the loaded state without being required for first-paint loader legibility.
- `src/*.test.js` -- Node test suite pattern run by `npm test`; add focused regression coverage for loader markup and initialization behavior where practical.
- `package.json` -- Provides `npm test`, `npm run build`, and Vite scripts used for verification.

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- Add first-paint loading markup before or near the app shell, plus critical inline styles in `<head>` for the loader and initial app-hidden state -- ensures users see an intentional loading experience before CSS/JS assets finish.
- [x] `index.html` -- Add a `noscript` fallback message that explains JavaScript is required for task interaction -- prevents a misleading infinite loader when JS is disabled.
- [x] `src/main.js` -- After loading tasks and rendering the initial active/completed lists, hide/remove the loader and mark the app shell as ready -- reveals the app only when behavior is initialized.
- [x] `src/styles.css` -- Add any polished loaded-state transition or loader class cleanup needed to match the Warm Minimal tone, using CSS custom properties where the main stylesheet participates -- keeps visual execution consistent with the project standard.
- [x] `src/app-shell.test.js` -- Add lightweight regression tests that verify `index.html` contains accessible loading markup, critical loader styling before body content, a noscript fallback, and that `main.js` contains an explicit loader-dismissal path -- protects against reintroducing raw first paint.

**Acceptance Criteria:**
- Given a cold first load, when the browser parses the page before external assets finish, then the first visible UI is a styled loading state rather than raw todo app HTML.
- Given the app initializes normally, when initial task rendering completes, then the loading state disappears and the todo app is visible and interactive.
- Given JavaScript is disabled, when the page opens, then a clear noscript message is available instead of implying the app is still loading forever.
- Given task functionality is exercised after load, when users add, edit, complete, toggle important, delete, validate empty input, and reload persisted tasks, then behavior remains unchanged.
- Given `npm test` is run, when regression tests execute, then they fail if the loading screen loses accessible markup, critical first-paint styling, or the app reveal path.
- Given `npm run build` is run, when Vite completes, then production assets build successfully with the loading behavior preserved.

## Spec Change Log

## Design Notes

This is a human-approved loading-screen approach. Keep it light: the loader should mask unfinished HTML only while real initialization is happening, not create an artificial splash screen.

Preferred shape:

```html
<body class="is-loading">
  <div class="loading-screen" role="status" aria-live="polite">Loading your tasks…</div>
  <main class="app-shell" aria-labelledby="app-title">...</main>
</body>
```

The critical inline CSS should make `.loading-screen` presentable before external CSS arrives and hide `.app-shell` only during `.is-loading`. The full stylesheet may add refined transitions, but the loader must not depend on it for first-paint legibility.

## Verification

**Commands:**
- `npm test` -- expected: all existing tests and the new app-shell regression tests pass.
- `npm run build` -- expected: Vite builds successfully and preserves the loading behavior.

**Manual checks (if no CLI):**
- Run `npm run dev`, hard-refresh with cache disabled or network throttling, and confirm the first visible state is the styled loader, followed by the normal styled app with all task interactions working.

## Suggested Review Order

**First-paint loading shell**

- Critical inline styles make the loader presentable before external assets.
  [`index.html:7`](../../../index.html#L7)

- Initial loading state hides unfinished app markup immediately.
  [`index.html:104`](../../../index.html#L104)

- Accessible loader communicates progress without exposing inactive controls.
  [`index.html:108`](../../../index.html#L108)

- No-JS fallback prevents an infinite loading promise.
  [`index.html:105`](../../../index.html#L105)

**App reveal behavior**

- Initial render now dismisses loading in a guarded path.
  [`main.js:14`](../../../src/main.js#L14)

- Ready marker reveals app and hides loader after transition.
  [`main.js:143`](../../../src/main.js#L143)

- Loaded-state CSS preserves Warm Minimal polish.
  [`styles.css:76`](../../../src/styles.css#L76)

**Regression coverage**

- App-shell tests protect loader, noscript, and reveal behavior.
  [`app-shell.test.js:10`](../../../src/app-shell.test.js#L10)
