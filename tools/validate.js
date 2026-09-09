/* Walks the event graph and reports structural faults.
   The one that matters most: a scripted node whose choice leads nowhere.
   When that happens the chain silently breaks, the player is dropped back
   into the ambient pool, and a whole act becomes unreachable — with no
   error anywhere. Run this after every content change. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const B = path.join(__dirname, "..", "js");
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(B, "data.js"), "utf8") +
  "\nglobalThis.EVENTS=EVENTS;globalThis.NIGHTMARES=NIGHTMARES;globalThis.SOLSTICE=SOLSTICE;" +
  "globalThis.MEMORIES=MEMORIES;globalThis.ASPECTS=ASPECTS;globalThis.FLAWS=FLAWS;globalThis.RANKS=RANKS;", ctx);
const { EVENTS, NIGHTMARES, SOLSTICE, MEMORIES } = ctx;

const byId = new Map(EVENTS.map(e => [e.id, e]));
const problems = [];
const P = (sev, id, msg) => problems.push({ sev, id, msg });

// every entry point named by the catalogues must exist
for (const [tier, list] of Object.entries(NIGHTMARES))
  for (const n of list) if (!byId.has(n.entry)) P("ERROR", n.id, `nightmare "${tier}" entry "${n.entry}" does not exist`);
for (const r of SOLSTICE) if (!byId.has(r.entry)) P("ERROR", r.id, `solstice entry "${r.entry}" does not exist`);

const dup = new Set(), seen = new Set();
for (const e of EVENTS) { if (seen.has(e.id)) dup.add(e.id); seen.add(e.id); }
for (const id of dup) P("ERROR", id, "duplicate event id");

function exits(c) {
  const out = [];
  for (const fx of [c.effects, c.success && c.success.effects, c.failure && c.failure.effects]) {
    if (!fx) continue;
    if (fx.goto) out.push({ kind: "goto", to: fx.goto });
    if (fx.chapter) out.push({ kind: "chapter", to: fx.chapter });
    if (fx.rank) out.push({ kind: "rank" });
    if (fx.nightmare) out.push({ kind: "nightmare", to: fx.nightmare });
    if (fx.solstice) out.push({ kind: "solstice" });
    if (fx.death) out.push({ kind: "death" });
  }
  if (c.check && c.check.fatal != null) out.push({ kind: "fatal" });
  return out;
}

for (const e of EVENTS) {
  if (!e.choices || !e.choices.length) { P("ERROR", e.id, "no choices — the run would stall here"); continue; }
  e.choices.forEach((c, i) => {
    const ex = exits(c);
    for (const x of ex) {
      if (x.kind === "goto" && !byId.has(x.to)) P("ERROR", e.id, `choice ${i} goes to "${x.to}", which does not exist`);
      if (x.kind === "nightmare" && !NIGHTMARES[x.to]) P("ERROR", e.id, `choice ${i} opens nightmare tier "${x.to}", which is not in the catalogue`);
    }
    // A scripted node is part of a chain. If a choice inside one has no way
    // onward, the chain breaks and the player falls back to the ambient pool.
    if (e.scripted) {
      const leads = ex.some(x => ["goto", "chapter", "rank", "nightmare", "solstice"].includes(x.kind));
      const kills = ex.every(x => x.kind === "death" || x.kind === "fatal") && ex.length > 0;
      if (!leads && !kills) P("ERROR", e.id, `choice ${i} ("${String(c.label).slice(0, 40)}") is a dead end inside a scripted chain`);
      // A check with success/failure branches must lead onward on BOTH sides.
      if (c.check && !c.effects?.goto && !c.effects?.chapter && !c.effects?.rank) {
        const sOK = c.success?.effects && (c.success.effects.goto || c.success.effects.chapter || c.success.effects.rank);
        const fOK = c.failure?.effects && (c.failure.effects.goto || c.failure.effects.chapter || c.failure.effects.rank);
        if (!sOK || !fOK) P("ERROR", e.id, `choice ${i} has a check whose ${!sOK ? "success" : "failure"} branch leads nowhere`);
      }
    }
    for (const fx of [c.effects, c.success?.effects, c.failure?.effects])
      if (fx?.memory && !MEMORIES[fx.memory]) P("ERROR", e.id, `choice ${i} awards unknown memory "${fx.memory}"`);
  });
}

// every non-scripted event must be reachable: some chapter must lead to it
const chapters = new Set(EVENTS.filter(e => e.chapter).map(e => e.chapter));
const reached = new Set(["aspirant"]);
for (const e of EVENTS) for (const c of e.choices || [])
  for (const fx of [c.effects, c.success?.effects, c.failure?.effects]) if (fx?.chapter) reached.add(fx.chapter);
for (const ch of chapters) if (!reached.has(ch)) P("WARN", ch, "chapter is never entered by any choice");
// and each chapter needs a repeatable event, or its pool starves
for (const ch of chapters) {
  const repeatable = EVENTS.filter(e => e.chapter === ch && !e.scripted && !e.once);
  if (!repeatable.length) P("WARN", ch, "chapter has no repeatable event — its pool will starve");
}

const errs = problems.filter(p => p.sev === "ERROR");
for (const p of problems) console.log(`${p.sev === "ERROR" ? "✗" : "!"} ${p.sev.padEnd(5)} ${String(p.id).padEnd(16)} ${p.msg}`);
console.log(`\n${EVENTS.length} events, ${errs.length} errors, ${problems.length - errs.length} warnings`);
process.exit(errs.length ? 1 : 0);
