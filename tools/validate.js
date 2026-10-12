/* Walks the event graph and reports structural faults.
   The one that matters most: a scripted node whose choice leads nowhere.
   When that happens the chain silently breaks, the player is dropped back
   into the ambient pool, and a whole act becomes unreachable — with no
   error anywhere. Run this after every content change. */
// Loads every script index.html loads, so content packs are checked too.
const { load, scripts } = require("./load");
const ctx = load();
const { EVENTS, NIGHTMARES, SOLSTICE, MEMORIES } = ctx;

const byId = new Map(EVENTS.map(e => [e.id, e]));
const problems = [];
const P = (sev, id, msg) => problems.push({ sev, id, msg });

// every pack and module index.html loads must exist, and every pack must
// have registered itself (a pack that throws halfway would leave half its
// content in the game).
for (const f of scripts())
  if (!require("fs").existsSync(require("path").join(__dirname, "..", f))) P("ERROR", f, "index.html loads a file that does not exist");
for (const f of scripts().filter(f => f.startsWith("js/packs/")))
  if (!ctx.Pack.loaded.includes(f.slice(9, -3))) P("ERROR", f, "pack file did not call Pack.add with an id matching its file name");

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
        // A failure that kills is a way out too: a Nightmare ends in conquest or death.
        const fOK = c.failure?.effects && (c.failure.effects.goto || c.failure.effects.chapter || c.failure.effects.rank || c.failure.effects.death);
        if (!sOK || !fOK) P("ERROR", e.id, `choice ${i} has a check whose ${!sOK ? "success" : "failure"} branch leads nowhere`);
      }
    }
    for (const fx of [c.effects, c.success?.effects, c.failure?.effects])
      if (fx?.memory && !MEMORIES[fx.memory]) P("ERROR", e.id, `choice ${i} awards unknown memory "${fx.memory}"`);
    for (const fx of [c.effects, c.success?.effects, c.failure?.effects])
      if (fx?.lineage && !ctx.LINEAGES.some(l => l.id === fx.lineage)) P("ERROR", e.id, `choice ${i} grants unknown lineage "${fx.lineage}"`);
  });
}

// A Flaw's `affinity` flags are what tie it to the player's behaviour. A flag
// that no choice ever grants is dead weight: that Flaw can only ever be drawn
// on its base weight, which breaks "Flaws are never random".
const granted = new Set();
for (const e of EVENTS) for (const c of e.choices || [])
  for (const fx of [c.effects, c.success?.effects, c.failure?.effects]) for (const f of fx?.flags?.add || []) granted.add(f);

// Sharper version of the same rule. `awardFlaw` fires once, on the First
// Nightmare's resolution node, so a flag the player cannot possibly hold by
// then is inert for the Flaw draw no matter how many later events grant it.
// This walks forward from the Aspirant act through the First Nightmares and
// collects only what is reachable before that point.
function flagsGrantedBeforeFlaw() {
  const queue = EVENTS.filter(e => e.chapter === "aspirant").map(e => e.id);
  const seen = new Set(), out = new Set();
  while (queue.length) {
    const id = queue.pop();
    if (seen.has(id) || !byId.has(id)) continue;
    seen.add(id);
    for (const c of byId.get(id).choices || [])
      for (const fx of [c.effects, c.success?.effects, c.failure?.effects]) {
        if (!fx) continue;
        for (const f of fx.flags?.add || []) out.add(f);
        if (fx.goto) queue.push(fx.goto);
        // the only chapter hop that still precedes the Flaw is into a First
        // Nightmare; `chapter` transitions all land after it, so stop there.
        if (fx.nightmare === "first") for (const n of NIGHTMARES.first) queue.push(n.entry);
      }
  }
  return out;
}
const earlyFlags = flagsGrantedBeforeFlaw();
for (const f of ctx.FLAWS) for (const tag of f.affinity || []) {
  if (!granted.has(tag)) P("ERROR", f.id, `affinity flag "${tag}" is never granted by any choice`);
  else if (!earlyFlags.has(tag))
    P("ERROR", f.id, `affinity flag "${tag}" is only reachable after the Flaw is awarded, so it can never steer the draw`);
}

// Catalogue integrity for the things effects can name.
for (const e of EVENTS) for (const [i, c] of (e.choices || []).entries())
  for (const fx of [c.effects, c.success?.effects, c.failure?.effects])
    if (fx?.echo && !ctx.ECHOES[fx.echo]) P("ERROR", e.id, `choice ${i} binds unknown echo "${fx.echo}"`);
for (const [id, m] of Object.entries(MEMORIES)) {
  if (!m.type) P("WARN", id, "memory has no `type` (canon: Armor/Charm/Utility/Garment/Weapon/Lineage)");
  if (!m.rank) P("WARN", id, "memory has no `rank` (canon: Memories sit on the Soul Rank ladder)");
}
for (const [id, e] of Object.entries(ctx.ECHOES)) {
  if (!e.rank) P("WARN", id, "echo has no `rank`");
  if (e.bound == null) P("WARN", id, "echo has no `bound` essence cost — it would be free to hold");
}
const rankIds = new Set(ctx.ASPECT_RANKS.map(r => r.id));
for (const [id, m] of Object.entries(MEMORIES))
  if (m.rank && !rankIds.has(m.rank)) P("ERROR", id, `memory rank "${m.rank}" is not one of the seven Soul Ranks`);
for (const [id, e] of Object.entries(ctx.ECHOES))
  if (e.rank && !rankIds.has(e.rank)) P("ERROR", id, `echo rank "${e.rank}" is not one of the seven Soul Ranks`);

// A `fatal:1` check kills on EVERY miss, because a miss means margin <= -1
// and so does the fatal threshold. Any `failure` prose on such a choice can
// never be shown. Vitality is exempt: heal() makes it fractional, so a
// vitality margin can land between -1 and 0.
for (const e of EVENTS)
  for (const [i, c] of (e.choices || []).entries())
    if (c.check?.fatal === 1 && c.failure && c.check.stat !== "vitality")
      P("WARN", e.id, `choice ${i} has fatal:1 on an integer stat, so its failure branch is unreachable prose`);

// `dcSelf` measures the challenger against their own stat, so the odds of a
// fatal miss are FIXED — a high stat does not make it safer. That is the
// point for a once-in-a-life personal trial, but on a RECURRING event it
// compounds to certain death over a long lifespan, and silently caps how far
// any run can get. This caught st_war and sv_chain, which between them were
// killing every Saint before the Fourth Nightmare could come up.
for (const e of EVENTS) {
  if (e.once || e.scripted) continue;
  for (const [i, c] of (e.choices || []).entries())
    if (c.check?.dcSelf && c.check.fatal != null)
      P("ERROR", e.id, `choice ${i} pairs dcSelf with fatal on a recurring event — a fixed death chance that repeats forever`);
}

// `variants` share the event's choices, so they must be real alternate
// texts: an array of non-empty strings, none identical to `text`. A one-off
// event gains nothing from them.
for (const e of EVENTS) {
  if (e.variants == null) continue;
  if (!Array.isArray(e.variants) || !e.variants.length) { P("ERROR", e.id, "variants must be a non-empty array"); continue; }
  e.variants.forEach((v, i) => {
    if (typeof v !== "string" || !v.trim()) P("ERROR", e.id, `variant ${i} is empty`);
    else if (v === e.text) P("WARN", e.id, `variant ${i} repeats the main text`);
  });
  if (e.once) P("WARN", e.id, "variants on a once-only event will never be seen");
}

// A Memory or Echo that no choice ever awards is dead content: it exists in
// the catalogue, shows up in no run, and quietly rots out of sync with the
// rest of the file. This caught six unreachable Echoes the first time it ran.
const awarded = { memory:new Set(), echo:new Set() };
for (const e of EVENTS) for (const c of e.choices || [])
  for (const fx of [c.effects, c.success?.effects, c.failure?.effects]) {
    if (fx?.memory) awarded.memory.add(fx.memory);
    if (fx?.echo) awarded.echo.add(fx.echo);
  }
for (const id of Object.keys(MEMORIES))
  if (!awarded.memory.has(id)) P("WARN", id, "memory is in the catalogue but no choice ever awards it");
for (const id of Object.keys(ctx.ECHOES))
  if (!awarded.echo.has(id)) P("WARN", id, "echo is in the catalogue but no choice ever binds it");

// `requires` naming something that does not exist silently makes the event
// unreachable rather than erroring, which is the worst of both worlds.
const ids = { aspect:new Set(ctx.ASPECTS.map(a => a.id)), flaw:new Set(ctx.FLAWS.map(f => f.id)),
              lineage:new Set(ctx.LINEAGES.map(l => l.id)), aspectRank:new Set(ctx.ASPECT_RANKS.map(r => r.id)) };
function checkReq(id, where, req) {
  if (!req) return;
  for (const k of ["aspect", "flaw", "lineage", "aspectRank"])
    for (const val of req[k] ?? [])
      if (!ids[k].has(val)) P("ERROR", id, `${where} requires unknown ${k} "${val}"`);
  if (req.soulClass?.min != null && req.soulClass.min >= ctx.CLASSES.length)
    P("ERROR", id, `${where} requires soulClass.min ${req.soulClass.min}, above the top Class`);
}
for (const e of EVENTS) {
  checkReq(e.id, "event", e.requires);
  (e.choices || []).forEach((c, i) => checkReq(e.id, `choice ${i}`, c.requires));
}

// A node where every choice is gated behind `requires` can lock the run: the
// UI disables them all and there is nothing left to click.
for (const e of EVENTS) {
  const open = (e.choices || []).filter(c => !c.requires);
  if ((e.choices || []).length && !open.length)
    P("ERROR", e.id, "every choice is gated behind `requires` — a run reaching this node can stall with nothing to click");
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
  if (repeatable.length) continue;
  // ...unless every event in the chapter always leads somewhere else, in
  // which case the pool is never drawn from twice and cannot starve. The
  // Aspirant act is exactly this: a two-event chain into the First Nightmare.
  const transient = EVENTS.filter(e => e.chapter === ch)
    .every(e => (e.choices || []).every(c => exits(c).length));
  if (!transient) P("WARN", ch, "chapter has no repeatable event — its pool will starve");
}

const errs = problems.filter(p => p.sev === "ERROR");
for (const p of problems) console.log(`${p.sev === "ERROR" ? "✗" : "!"} ${p.sev.padEnd(5)} ${String(p.id).padEnd(16)} ${p.msg}`);
console.log(`\n${EVENTS.length} events, ${errs.length} errors, ${problems.length - errs.length} warnings`);
process.exit(errs.length ? 1 : 0);
