/* =============================================================
   FATE LEGACY — HOOKS AND CONTENT PACKS
   Loaded first. Two small registries that let a scenario or a
   feature live in its own file instead of inside data.js,
   engine.js and ui.js, so that separate pull requests never edit
   the same lines.

   - Pack.add({...})  : content (events, Nightmares, regions,
                        Memories, Echoes, achievements, origins).
   - Hooks.on(name,f) : behaviour. engine.js and ui.js call the
                        named hooks below at fixed points.

   Engine hooks (no DOM):
     newRun(s)                      after a life is created
     draw(s, ev)                    after an event is mounted
     effects(s, fx, deltas)         inside applyEffects, for custom keys
     choose(s, ev, choice, out)     after a choice resolves
     checkMods(s, choice) -> [{label, value}]   added to a check's roll
     death(s)                       once, when the life ends
     text(str, s) -> str            every event and outcome text
   UI hooks (browser only):
     choiceBar(S, ev) -> Element[]  above the choices
     sheet(S) -> html[]             appended to the Status page
     endTiles(S) -> [k, v, wide][]  extra end-screen tiles
     endExtra(S) -> Element[]       below the end-screen tiles
     home(container)                the home screen, on boot
   ============================================================= */
const Hooks = (() => {
  const map = {};
  return {
    on(name, fn) { (map[name] ??= []).push(fn); },
    emit(name, ...args) { for (const f of map[name] ?? []) f(...args); },
    collect(name, ...args) {
      const out = [];
      for (const f of map[name] ?? []) {
        const r = f(...args);
        if (r == null) continue;
        if (Array.isArray(r)) out.push(...r); else out.push(r);
      }
      return out;
    },
    reduce(name, value, ...args) {
      for (const f of map[name] ?? []) value = f(value, ...args);
      return value;
    },
  };
})();

const Pack = (() => {
  const loaded = [];
  /* Patches run after every pack has been added, in load order, so a pack
     can rewire an event that lives in data.js or in another pack. */
  const patches = [];
  function add(p) {
    loaded.push(p.id);
    for (const e of p.events ?? []) EVENTS.push(e);
    for (const [tier, list] of Object.entries(p.nightmares ?? {}))
      (NIGHTMARES[tier] ??= []).push(...list);
    for (const r of p.solstice ?? []) SOLSTICE.push(r);
    Object.assign(MEMORIES, p.memories ?? {});
    Object.assign(ECHOES, p.echoes ?? {});
    Object.assign(ACHIEVEMENTS, p.achievements ?? {});
    for (const o of p.origins ?? []) ORIGINS.push(o);
    if (p.patch) { if (done) p.patch(); else patches.push(p.patch); }
  }
  /* engine.js calls this once, after every content pack has run. A module
     loaded after the engine gets its patch applied straight away. */
  let done = false;
  function finish() { done = true; while (patches.length) patches.shift()(); }
  const byId = id => EVENTS.find(e => e.id === id);
  return { add, finish, loaded, byId };
})();
