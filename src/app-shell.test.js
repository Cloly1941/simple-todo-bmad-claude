import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const indexHtml = readFileSync(resolve(projectRoot, "index.html"), "utf8");
const mainJs = readFileSync(resolve(projectRoot, "src/main.js"), "utf8");

test("index.html includes accessible first-paint loading markup", () => {
  assert.match(indexHtml, /<body class="is-loading">/);
  assert.match(indexHtml, /class="loading-screen"[^>]*data-loading-screen[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(indexHtml, /aria-label="Loading your tasks"/);
  assert.match(indexHtml, /Loading your local todo list\.\.\./);
});

test("index.html places critical loading styles before body content", () => {
  const styleIndex = indexHtml.indexOf("<style>");
  const bodyIndex = indexHtml.indexOf("<body");

  assert.ok(styleIndex > -1, "critical inline style block is present");
  assert.ok(styleIndex < bodyIndex, "critical styles appear before body content");
  assert.match(indexHtml, /body\.is-loading \.app-shell/);
  assert.match(indexHtml, /\.loading-screen/);
  assert.match(indexHtml, /@keyframes loading-turn/);
  assert.match(indexHtml, /prefers-reduced-motion: reduce\)\s*{\s*\.loading-mark { animation: none; }/);
});

test("index.html includes a noscript fallback for disabled JavaScript", () => {
  assert.match(indexHtml, /<noscript>/);
  assert.match(indexHtml, /JavaScript is required to load, save, and interact with your tasks/);
  assert.match(indexHtml, /body\.is-loading \.loading-screen,\s*body\.is-loading \.app-shell\s*{\s*display: none;/s);
});

test("main.js reveals the app and dismisses the loader after initial render", () => {
  assert.match(mainJs, /try\s*{\s*renderTasks\(\);\s*}\s*finally\s*{\s*markAppReady\(\);\s*}/s);
  assert.match(mainJs, /document\.body\.classList\.remove\("is-loading"\)/);
  assert.match(mainJs, /document\.body\.classList\.add\("is-ready"\)/);
  assert.match(mainJs, /\[data-loading-screen\]/);
  assert.match(mainJs, /\[data-app-shell\]/);
  assert.match(mainJs, /addEventListener\("transitionend", hideLoadingScreen, { once: true }\)/);
  assert.match(mainJs, /setTimeout\(hideLoadingScreen, 260\)/);
});
