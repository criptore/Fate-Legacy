/* Loads the game the way the browser does: every <script src="js/..."> in
   index.html, in order, minus the DOM-only files. So a content pack or a
   module added in its own pull request is picked up by validate.js and
   sim.js without anyone editing a list here. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
const SKIP = new Set(["js/ui.js", "js/save.js"]);

function scripts() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  return [...html.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !SKIP.has(f));
}

const EXPORTS = ["Hooks", "Pack", "Engine", "EVENTS", "NIGHTMARES", "SOLSTICE", "MEMORIES", "ECHOES",
  "ASPECTS", "FLAWS", "RANKS", "LINEAGES", "CLASSES", "ASPECT_RANKS", "ACHIEVEMENTS", "ORIGINS", "STATS"];

function load(extra = {}) {
  const ctx = { console, ...extra };
  vm.createContext(ctx);
  const src = scripts().map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n;\n") +
    "\n" + EXPORTS.map(n => `globalThis.${n}=${n};`).join("");
  vm.runInContext(src, ctx);
  return ctx;
}

module.exports = { load, scripts };
