/* =============================================================
   MODULE — THE HALL OF PAST LIVES
   Every life you finish is remembered on this device, and the next
   one is lived in the same world, after it.

   Not reincarnation: the next character is somebody else. They grow
   up hearing the legend of the one before, they can find the notes
   that one left about the Nightmare that killed them, and they may
   meet the organization that one founded, still standing.

   Canon decides what can be inherited. Memories vanish when their
   owner dies (wiki, Memories) and a destroyed Echo is gone, so no
   item crosses between lives. Stories, written notes and institutions
   can, and that is all this module passes on.

   Storage: localStorage "fatelegacy.hall", newest first, at most 40.
   State:   s.legacy = the past life this one has heard of
            s.legacyNotes = id of the Nightmare their notes describe
   See docs/content/legacy.md.
   ============================================================= */
(() => {
  const KEY = "fatelegacy.hall", MAX = 40;
  let override = null;   // tools/ can inject a hall without a browser

  function read() {
    if (override) return override;
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; }
  }
  function write(list) {
    if (override) { override = list.slice(0, MAX); return; }
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch {}
  }

  const originName = id => ORIGINS.find(o => o.id === id)?.name ?? "somewhere";
  /* "A Citadel Ward" -> "a Citadel Ward", for the middle of a sentence. */
  const inSentence = t => t.replace(/^(A|The) /, m => m.toLowerCase());
  const rankCommon = r => RANKS[Math.min(r, RANKS.length - 1)].common;

  /* A past life is worth a legend if it climbed, founded something, or died
     somewhere people tell stories about. */
  function notability(e) {
    return e.rank * 3 + (e.trials ?? 0) * 2 + (e.org ? 3 : 0) + (e.trial ? 1 : 0) + Math.min(3, Math.floor(e.age / 100));
  }

  /* ---------- recording a finished life ---------- */
  Hooks.on("death", s => {
    if (s.hallId) return;
    s.hallId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const entry = {
      id: s.hallId, at: Date.now(),
      origin: s.origin, rank: s.rank, age: Engine.years(s),
      aspect: ASPECTS.find(a => a.id === s.aspect)?.name ?? null,
      cause: s.cause, kind: s.causeKind,
      trials: (s.trials ?? []).length,
      /* The Nightmare that killed them, if one did: their notes describe it. */
      trial: s.causeKind === "nightmare" && s.currentTrial && s.currentTrial.tier !== "first"
        ? { id: s.currentTrial.id, name: s.currentTrial.name } : null,
      org: s.org && !s.org.gone ? { name: s.org.name, kind: s.org.kind, size: s.org.size } : null,
      epithet: globalThis.Chronicle?.epithet(s) ?? null,
      heir: s.legacy?.id ?? null,
    };
    write([entry, ...read()]);
    render();
  });

  /* ---------- the next life hears of it ---------- */
  Hooks.on("newRun", s => {
    const recent = read().slice(0, 10).filter(e => e.rank >= 1 || e.trial);
    if (!recent.length) return;
    const best = recent.sort((a, b) => notability(b) - notability(a))[0];
    s.legacy = best;
    s.flags.push("legacy_legend");
    if (best.trial) s.flags.push("legacy_notes");
    if (best.org && best.org.size >= 2) s.flags.push("legacy_org");
  });

  /* Causes are written to the dead in the second person, so the legend uses
     its own words for how they ended. */
  const ENDED = { nightmare: "went into a Nightmare and did not come out", gate: "died at a Gate",
    dream_realm: "died in the Dream Realm", hollow: "came back Hollow", lost: "was Lost",
    murdered: "was murdered by another Awakened", war: "fell in the war of the Domains",
    chain: "died in the Chain of Nightmares", age: "died of old age, which almost nobody does",
    wounds: "died of their wounds", woven: "wove themselves into the law of the world",
    beyond: "stepped over the edge of the Dream Realm" };

  const pastName = e => e.epithet ? `the ${rankCommon(e.rank)} remembered as ${e.epithet}` : `a ${rankCommon(e.rank)}`;

  Hooks.on("text", (str, s) => !str || !s?.legacy ? str : str
    .replace(/\{past\}/g, pastName(s.legacy))
    .replace(/\{pastRank\}/g, rankCommon(s.legacy.rank))
    .replace(/\{pastAge\}/g, String(s.legacy.age))
    .replace(/\{pastOrigin\}/g, inSentence(originName(s.legacy.origin)))
    .replace(/\{pastAspect\}/g, s.legacy.aspect ?? "something nobody remembers")
    .replace(/\{pastCause\}/g, ENDED[s.legacy.kind] ?? "died")
    .replace(/\{pastTrial\}/g, s.legacy.trial?.name ?? "a Nightmare")
    .replace(/\{pastOrg\}/g, s.legacy.org?.name ?? "their company"));

  /* Titles and labels are not run through the text hook by the UI. */
  Hooks.on("draw", (s, ev) => {
    if (!s.legacy || !ev.id.startsWith("hall_")) return;
    ev._title = ev._title ?? ev.title;
    ev.title = Hooks.reduce("text", ev._title, s);
    for (const c of ev.choices) { c._label = c._label ?? c.label; c.label = Hooks.reduce("text", c._label, s); }
  });

  /* fx.legacyNotes: you read them, and they help inside that Nightmare. */
  Hooks.on("effects", (s, fx) => { if (fx.legacyNotes && s.legacy?.trial) s.legacyNotes = s.legacy.trial.id; });

  Hooks.on("checkMods", s =>
    s.legacyNotes && s.currentTrial?.id === s.legacyNotes ? { label: "Their notes", value: 3 } : null);

  /* Conquering the Nightmare that killed the one before you. */
  Hooks.on("choose", s => {
    if (s.legacyNotes && (s.trials ?? []).some(t => t.id === s.legacyNotes) && !s.flags.includes("finished_their_work"))
      s.flags.push("finished_their_work");
  });

  /* ---------- UI ---------- */
  let home = null;
  const esc = v => String(v ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  function render() {
    if (!home) return;
    const list = read();
    if (!list.length) { home.innerHTML = ""; return; }
    const deepest = Math.max(...list.map(e => e.rank));
    const rows = list.slice(0, 8).map(e => `
      <li><b>${esc(RANKS[e.rank].name)}</b>
        <span>${esc(e.epithet ? `Remembered as ${e.epithet}. ` : "")}${esc(originName(e.origin))}, ${e.age} years${e.aspect ? `, ${esc(e.aspect)}` : ""}.
        <i>${esc(e.cause)}</i></span></li>`).join("");
    home.innerHTML = `<section class="hall">
      <h3 class="end-section-title">Hall of Past Lives</h3>
      <p class="hall-sum">${list.length} ${list.length === 1 ? "life" : "lives"} remembered · deepest rank: ${esc(RANKS[deepest].name)}.
        The next life will grow up hearing about the most remarkable of the last ten.</p>
      <ol class="hall-list">${rows}</ol>
      <button class="btn btn-ghost" type="button" id="hall-clear">Forget them all</button>
    </section>`;
    home.querySelector("#hall-clear").onclick = () => {
      if (!confirm("Forget every past life? The next one will grow up hearing about none of them.")) return;
      write([]);
      try { localStorage.removeItem(KEY); } catch {}
      render();
    };
  }

  Hooks.on("home", container => {
    home = document.createElement("div");
    container.appendChild(home);
    render();
    if (document.getElementById("hall-style")) return;
    const st = document.createElement("style");
    st.id = "hall-style";
    st.textContent = `
      .hall{margin-top:28px;text-align:left}
      .hall-sum{font-size:13px;color:var(--ink-faint);margin:0 0 10px}
      .hall-list{list-style:none;margin:0 0 12px;padding:0}
      .hall-list li{display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--line);font-size:14px;line-height:1.45}
      .hall-list b{flex:0 0 6.5em;font:12px/1.9 ui-sans-serif,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
      .hall-list span{flex:1;min-width:0}
      .hall-list i{display:block;color:var(--ink-faint)}`;
    document.head.appendChild(st);
  });

  Hooks.on("sheet", S => S.legacy
    ? `<div class="sheet-section">Who came before</div><div class="sheet-line"><span>${esc(rankCommon(S.legacy.rank))}</span><span>${esc(originName(S.legacy.origin))}, ${S.legacy.age} years. ${esc(S.legacy.cause)}${S.legacyNotes ? " · you carry their notes" : ""}</span></div>`
    : null);

  globalThis.LegacyHall = { read, setHall: list => { override = list; }, notability };

  Pack.add({
    id: "legacy",
    achievements: {
      finished_their_work: { name: "Finished What They Started", desc: "Conquered the Nightmare that killed the one who came before you, with their notes in your hand." },
      kept_their_name: { name: "Kept Their Name", desc: "Took up the work of the order a past life founded." },
    },
    events: [
{
  id: "hall_legend", weight: 30, once: true, days: 10,
  requires: { chapter: ["awakened", "ascended"], flags: { all: ["legacy_legend"] } },
  title: "A Story You Grew Up On",
  text: "Every Awakened in this city knows the story. You heard it first when you were nine: {past}, raised in {pastOrigin}, Aspect of {pastAspect}, who lived {pastAge} years and then {pastCause}.\n\nTonight an old Master at the next table is telling it to a pair of Sleepers, and getting it wrong.",
  choices: [
    { label: "Correct him. You know how it really went.", hint: "Perception. A story you have heard so many times you can see the gaps in it.",
      check: { stat: "perception", dc: 10, dcScale: 2 },
      success: { text: "You tell it properly, with the parts nobody likes. The Sleepers listen as if their lives depend on it, which, in a few years, they might.", effects: { stats: { perception: 1, renown: 2 } } },
      failure: { text: "You get halfway and realise your version is no truer than his. The story has been told too many times to belong to anyone.", effects: { stats: { willpower: 1 } } } },
    { label: "Learn from how it ended.", hint: "Cunning. Not the glory: the mistake.",
      effects: { stats: { cunning: 1, vitality: 1 } },
      text: "You do not need the glory. You need the mistake, and you think you can see it: the moment {pastRank} decided to go on when they should have gone back. You will not make that one. You will make your own." },
    { label: "It is just a story.", effects: { stats: { willpower: 1 } },
      text: "You finish your drink and leave them to it. Your life is not going to be a sequel to anyone's." },
  ],
},
{
  id: "hall_notes", weight: 24, once: true, days: 20,
  requires: { chapter: ["awakened", "ascended", "transcendent"], flags: { all: ["legacy_notes"] } },
  title: "A Bundle Of Notes",
  text: "The archivist hands you a bundle tied with Gate wire. \"Nobody has asked for these in years.\"\n\nThey are the notes {past} wrote before entering {pastTrial}: what the Spell's whispers said, which roles the challengers woke in, what they meant to try. The last page is blank. They never came back to write it.",
  choices: [
    { label: "Read every page, twice.", hint: "Their notes will help you if the Spell ever sends you into the same Nightmare.",
      effects: { stats: { perception: 1 }, legacyNotes: true },
      text: "You read until the archive closes, then copy out the pages that matter. If the Spell ever opens {pastTrial} for you, you will walk in knowing what they knew, and what killed them." },
    { label: "Add a page of your own, and give them back.", effects: { stats: { willpower: 2, renown: 1 } },
      text: "On the blank last page you write: Someone read this. Then you tie the wire again and hand it back, for whoever comes next." },
  ],
},
{
  id: "hall_org", weight: 20, once: true, days: 30,
  requires: { chapter: ["awakened", "ascended", "transcendent"], flags: { all: ["legacy_org"], none: ["has_org"] } },
  title: "{pastOrg} Still Stands",
  text: "Their banner hangs in a hall near the Gate district. {pastOrg} was founded by {past}, and it outlived its founder, which is the only test an organization really has.\n\nThe current captain has heard about you. She wants to know if you would wear the colours.",
  choices: [
    { label: "Join them.", effects: { stats: { vitality: 1, renown: 2 }, flags: { add: ["kept_their_name"] } },
      text: "They give you the founder's old post on the wall. It is a small thing, and you are surprised by how much it weighs." },
    { label: "Ask to read the founder's papers instead.", hint: "Cunning. They may not want an outsider reading them.",
      check: { stat: "cunning", dc: 11, dcScale: 2 },
      success: { text: "Ledgers, orders, a hundred small decisions about who to send where. You learn more about leading people from one evening with them than from a year at the Academy.", effects: { stats: { cunning: 2, willpower: 1 } } },
      failure: { text: "The captain closes the cabinet. \"Members only.\" Fair enough.", effects: { stats: { renown: -1 } } } },
    { label: "Thank her, and walk your own road.", effects: { stats: { willpower: 1 } },
      text: "You leave the banner where it is. Somebody built that. You would rather build your own." },
  ],
},
    ],
  });
})();
