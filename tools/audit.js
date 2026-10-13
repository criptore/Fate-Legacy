/* Semantic content audit — an authoring aid, not part of the game.

   validate.js proves the event graph is wired correctly. It cannot tell
   whether a choice's *text* agrees with its mechanics. This asks a small
   judgment model (TypeSafe Jev) three narrow questions per choice and reports
   the disagreements for a human to review:

     stat     which attribute does the action really lean on? (choice)
              vs. the check.stat / hint the choice declares
     outcome  does success.text read as success, failure.text as failure? (noul)
     flaw     does an action that grants a Flaw-affinity flag actually fit
              that Flaw's theme? (noul)  — canon: "Flaws are never random"

   Advisory only: exits 0 unless --strict. Needs TYPESAFE_API_KEY (env or a
   git-ignored .env at the repo root). Results are cached in .audit-cache.json
   (git-ignored), so re-runs only pay for content that changed.

     node tools/audit.js                 all checks
     node tools/audit.js --only stat     one check (stat | outcome | flaw)
     node tools/audit.js --limit 5       first N jobs (one per checked choice / per choice+Flaw), cheap trial
     node tools/audit.js --strict        exit 1 if anything is flagged */
const fs = require("fs"), vm = require("vm"), path = require("path"), crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";
const CACHE_FILE = path.join(ROOT, ".audit-cache.json");
const CONCURRENCY = 4;

/* Thresholds are starting points, meant to be tuned against reviewed output. */
const STAT_TOP_P = 0.6;      // flag a stat only if the model is this sure of a different one...
const STAT_RANK = 2;         // ...AND the declared stat is outside its top N (willpower/vitality overlap)
const SUCCESS_MIN = 0.35;    // success text: P(reads as success) below this is a real polarity error
const FAILURE_MAX = 0.65;    // failure text: P(reads as success) above this is a real polarity error
const FLAW_MIN = 0.3;        // P(action fits the Flaw's theme) at least this

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const only = opt("--only");
const limit = opt("--limit") ? Number(opt("--limit")) : Infinity;
if (only && !["stat", "outcome", "flaw"].includes(only)) { console.error(`--only must be stat, outcome or flaw (got "${only}")`); process.exit(2); }
if (limit !== Infinity && !(Number.isInteger(limit) && limit > 0)) { console.error("--limit must be a positive integer"); process.exit(2); }

/* ---------- credentials ---------- */
function loadKey() {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY;
  try {
    const m = fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^TYPESAFE_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  return null;
}
const KEY = loadKey();
if (!KEY) { console.error("TYPESAFE_API_KEY is not set (env or .env at the repo root)."); process.exit(2); }

/* ---------- content ---------- */
const ctx = require("./load").load();   // packs and modules included
const { EVENTS, FLAWS, STATS } = ctx;

const CHECK_STATS = ["vitality", "willpower", "perception", "cunning"];
/* The in-game descriptions are flavour text; the judge needs edges. Willpower
   and Vitality in particular overlap ("endurance"), so say which is which. */
const STAT_CRITERIA = {
  vitality: "Physical toughness: taking blows, surviving injury or exhaustion of the body, brute physical action.",
  willpower: "Mental and soul resolve: resisting fear, corruption or coercion, holding to a decision under pressure, refusing to break.",
  perception: "Noticing and understanding: observing, investigating, reading a place or a pattern, spotting what is hidden.",
  cunning: "Leverage over people and situations: deception, negotiation, planning, misdirection, exploiting others' rules.",
};
const flawsByFlag = {};
for (const f of FLAWS) for (const tag of f.affinity || []) (flawsByFlag[tag] ||= []).push(f);

/* ---------- API ---------- */
const cache = (() => { try { return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")); } catch { return {}; } })();
const saveCache = () => { fs.writeFileSync(CACHE_FILE + ".tmp", JSON.stringify(cache)); fs.renameSync(CACHE_FILE + ".tmp", CACHE_FILE); };
let tokens = 0, calls = 0, hits = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function ask(state, questions) {
  const body = JSON.stringify({ state, model: MODEL, questions });
  const hash = crypto.createHash("sha256").update(body).digest("hex");
  if (cache[hash]) { hits++; return cache[hash]; }
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST", body, signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      });
    } catch (err) {                                   // network error or timeout
      if (attempt < 5) { await sleep(1000 * 2 ** attempt); continue; }
      throw new Error(`network: ${err.message}`);
    }
    if (res.ok) {
      const j = await res.json();
      for (const [id, q] of Object.entries(questions)) {   // never cache a malformed answer
        const a = j.answers?.[id];
        if (!a || (q.type === "noul" ? typeof a.noul !== "number" : !a.probabilities)) throw new Error(`malformed answer for "${id}"`);
      }
      calls++; tokens += (j.usage?.input_tokens ?? 0) + (j.usage?.output_tokens ?? 0);
      return (cache[hash] = j.answers);
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 1000 * 2 ** attempt;
      await sleep(wait); continue;
    }
    const detail = (await res.text()).replace(KEY, "[redacted]").slice(0, 200);
    throw new Error(`HTTP ${res.status}${res.status === 401 ? " (bad API key)" : ""}: ${detail}`);
  }
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let next = 0, failure = null;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (!failure && next < items.length) {
      const i = next++;
      try { out[i] = await fn(items[i]); } catch (err) { failure ||= err; }
    }
  }));
  if (failure) throw failure;
  return out;
}

/* ---------- build the work list ---------- */
const flagged = [];
const note = (kind, e, ci, msg) => flagged.push({ kind, id: e.id, choice: ci, msg });
const short = (s, n = 60) => String(s).replace(/\s+/g, " ").slice(0, n);

const jobs = [];
for (const e of EVENTS) (e.choices || []).forEach((c, ci) => {
  if (c.check && CHECK_STATS.includes(c.check.stat) && (!only || only === "stat" || only === "outcome"))
    jobs.push({ type: "check", e, c, ci });
  if (!only || only === "flaw") {
    const tags = new Set();
    for (const fx of [c.effects, c.success?.effects, c.failure?.effects])
      for (const t of fx?.flags?.add || []) if (flawsByFlag[t]) tags.add(t);
    for (const tag of tags) for (const f of flawsByFlag[tag]) jobs.push({ type: "flaw", e, c, ci, tag, f });
  }
});
const work = jobs.slice(0, limit);

async function run(job) {
  const { e, c, ci } = job;
  if (job.type === "check") {
    const state = {
      situation: e.text, action: c.label,
      success_text: c.success?.text ?? null, failure_text: c.failure?.text ?? null,
    };
    const questions = {};
    if (!only || only === "stat") questions.stat = {
      type: "choice",
      instructions: "Which attribute does the protagonist's `action` mainly rely on to work, given the `situation`?",
      criteria: STAT_CRITERIA,
    };
    if ((!only || only === "outcome") && c.success?.text) questions.success_reads_as_success = {
      type: "noul",
      instructions: "Does `success_text` describe the protagonist's action working out in their favour?",
    };
    if ((!only || only === "outcome") && c.failure?.text) questions.failure_reads_as_success = {
      type: "noul",
      instructions: "Does `failure_text` describe the protagonist's action working out in their favour?",
    };
    const a = await ask(state, questions);
    const declared = c.check.stat;
    if (a.stat) {
      const ranked = Object.entries(a.stat.probabilities).sort((x, y) => y[1] - x[1]);
      const [top, topP] = ranked[0];
      const declaredRank = ranked.findIndex(([k]) => k === declared);
      if (top !== declared && topP >= STAT_TOP_P && declaredRank >= STAT_RANK)
        note("stat", e, ci, `declares ${declared} (p=${(a.stat.probabilities[declared] ?? 0).toFixed(2)}), text reads as ${top} (p=${topP.toFixed(2)}) — "${short(c.label)}"`);
    }
    if (a.success_reads_as_success && a.success_reads_as_success.noul < SUCCESS_MIN)
      note("outcome", e, ci, `success text reads as failure (p=${a.success_reads_as_success.noul.toFixed(2)}) — "${short(c.success.text)}"`);
    if (a.failure_reads_as_success && a.failure_reads_as_success.noul > FAILURE_MAX)
      note("outcome", e, ci, `failure text reads as success (p=${a.failure_reads_as_success.noul.toFixed(2)}) — "${short(c.failure.text)}"`);
  } else {
    const state = {
      situation: e.text, action: c.label,
      outcome_text: [c.success?.text, c.failure?.text].filter(Boolean).join("\n\n") || null,
      flaw: { name: job.f.name, meaning: job.f.desc },
    };
    const a = await ask(state, { fits: {
      type: "noul",
      instructions: "Is the protagonist's `action` (with its `outcome_text`) the kind of behaviour that would plausibly lead a person to be cursed with this `flaw`, i.e. does the flaw's meaning grow out of what they did?",
    } });
    if (a.fits.noul < FLAW_MIN)
      note("flaw", e, ci, `grants "${job.tag}" toward ${job.f.name} but the action does not read that way (p=${a.fits.noul.toFixed(2)}) — "${short(c.label)}"`);
  }
}

(async () => {
  console.log(`Auditing ${work.length} jobs (${jobs.length} available)…`);
  try { await pool(work, run); }
  catch (err) { saveCache(); console.error(`\naudit aborted: ${err.message}`); process.exit(2); }
  saveCache();
  for (const kind of ["stat", "outcome", "flaw"]) {
    const rows = flagged.filter(f => f.kind === kind);
    if (!rows.length) continue;
    console.log(`\n── ${kind} (${rows.length}) ──`);
    for (const r of rows) console.log(`  ${r.id}[${r.choice}]  ${r.msg}`);
  }
  console.log(`\n${work.length} jobs, ${flagged.length} flagged. ${calls} API calls (${tokens} tokens), ${hits} cache hits.`);
  if (flag("--strict") && flagged.length) process.exit(1);
})();
