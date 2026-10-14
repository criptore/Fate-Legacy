/* =============================================================
   FATE LEGACY — ENGINE
   Pure state machine. Knows nothing about the DOM.
   ============================================================= */
const Engine = (() => {

  /* Every content pack has run by now (they load between data.js and this
     file), so their patches to existing events can be applied. */
  Pack.finish();

  const DAYS_PER_YEAR = 365;
  const START_AGE = 17;

  /* ---------- helpers ---------- */
  const rank = s => RANKS[s.rank];
  const statDef = id => STATS.find(x => x.id === id);
  const years = s => Math.floor(s.ageDays / DAYS_PER_YEAR);
  const shown = v => Math.round(v * 10) / 10;

  function statMax(id, s) {
    const d = statDef(id);
    if (!d) return Infinity;
    /* Canon, on Divine Aspect holders: "Unlike all other Awakened, there was
       no limit to the capacity to store essence." Ours is not literally no
       limit — an unbounded number would break the HUD and the balance — but
       it is far above everyone else's. */
    if (id === "essence" && s && s.aspectRank === "Divine") return 240;
    return d.max;
  }

  function clampStat(id, v, s) {
    const d = statDef(id);
    if (!d) return v;
    return Math.max(d.min, Math.min(statMax(id, s), v));
  }

  function roll(sides) { return 1 + Math.floor(Math.random() * sides); }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- run creation ---------- */
  function newRun(originId) {
    const o = ORIGINS.find(x => x.id === originId) || ORIGINS[0];
    const s = {
      rank: 0,
      chapter: "aspirant",
      origin: o.id,
      ageDays: START_AGE * DAYS_PER_YEAR,
      /* Canon: Aspirants "are given Attributes and start off with a Dormant Rank
         Aspect without the Flaw or Aspect Ability" — so the Aspect exists from
         infection. The Flaw is only granted on surviving the First Nightmare,
         "in exchange for the power received". (wiki: Awakened / Aspect) */
      stats: { vitality:8, willpower:5, perception:5, cunning:5, essence:0, renown:0, tether:10 },
      appraisal: 0,    // Spell's judgement of the First Nightmare
      fragments: 0,    // soul fragments, 2^(rankDiff) per kill
      soulCores: 1,    // "the average nightmare spell carrier has only one Soul Core"
      flags: [],
      memories: [],
      aspect: null,
      aspectRank: "Dormant",   // canon: Aspect Rank uses the Soul Rank ladder
      flaw: null,
      lineage: null,           // third axis; canon says it does not touch the Aspect
      soulClass: 0,            // index into CLASSES. Everyone starts a Beast.
      echoes: [],              // canon: a reward in its own right, not a Memory
      seen: {},        // id -> times seen
      lastSeen: {},    // id -> ageDays at last draw
      current: null,   // id of the event on screen
      pending: null,   // id forced as next (scripted chains)
      history: [],     // rolling window of recent ids (for future 'this reminds you of' callbacks)
      eventCount: 0,   // true lifetime tally
      dead: false,
      cause: null,
      causeKind: null,
    };
    for (const [id, d] of Object.entries(o.stats)) s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d, s);
    for (const f of o.flags ?? []) s.flags.push(f);
    /* Order matters only for readability — these two deliberately do not
       consult one another. Canon: "Possessing a lineage of a certain divine
       creature doesn't mean their aspect has to be related to it as well." */
    awardLineage(s);
    awardAspect(s);
    Hooks.emit("newRun", s);
    return s;
  }

  /* ---------- lifespan ---------- */
  function lifespanYears(s) {
    const r = rank(s);
    return r.lifespan;                 // null = no natural limit
  }

  function lifeRemaining(s) {
    const span = lifespanYears(s);
    if (span == null) return 1;        // Divine: bar stays full
    return Math.max(0, 1 - years(s) / span);
  }

  /* Advance the clock. `base` is in days at Sleeper scale;
     ambient events stretch with rank, story beats do not. */
  function advance(s, base, fixedTime) {
    const mult = fixedTime ? 1 : rank(s).timeScale;
    const days = Math.round(base * mult);
    s.ageDays += days;
    heal(s, days);
    drainDivine(s, days);
    checkLifespan(s);
  }

  /* Wounds close over time, up to the best condition this character has ever
     been in. Training raises the ceiling; a bad Gate does not permanently
     lower it. Story beats (fixedTime) still pass real days, so you do heal
     between the nodes of a Nightmare — just very little. */
  /* Canon on Divine Aspects: "their immense power came at the cost of rapidly
     depleting essence." So the bonus is not free — it bleeds, and a Divine
     Aspect holder has to keep killing to stay topped up.

     The per-event cap is a mechanical necessity, not canon: `days` is already
     multiplied by the rank's timeScale, so a single Saint-scale decision spans
     thousands of days and an uncapped per-day rate would empty the Core in one
     event. Ours: at most three points of Essence per decision. */
  function drainDivine(s, days) {
    if (s.dead || s.aspectRank !== "Divine") return;
    const loss = Math.min(days * 0.004, 3);
    s.stats.essence = clampStat("essence", s.stats.essence - loss, s);
  }

  function heal(s, days) {
    if (s.dead) return;
    s.vitCap = Math.max(s.vitCap ?? 0, s.stats.vitality);
    const room = s.vitCap - s.stats.vitality;
    if (room <= 0) return;
    s.stats.vitality = clampStat("vitality", s.stats.vitality + Math.min(room, days / 50), s);
  }

  function checkLifespan(s) {
    const span = lifespanYears(s);
    if (span != null && years(s) >= span) {
      kill(s, `Your Soul Core could carry you no further. You died at ${years(s)}, ${rank(s).common} to the end — which almost nobody manages.`, "age");
    }
  }

  function kill(s, cause, kind) {
    if (s.dead) return;
    s.dead = true; s.cause = cause; s.causeKind = kind || "unknown";
    s.diedIn = s.chapter;
    Hooks.emit("death", s);
  }

  /* ---------- requirement checking ---------- */
  function meets(s, req) {
    if (!req) return true;
    if (req.chapter && !req.chapter.includes(s.chapter)) return false;
    if (req.rank) {
      if (req.rank.min != null && s.rank < req.rank.min) return false;
      if (req.rank.max != null && s.rank > req.rank.max) return false;
    }
    if (req.flags) {
      const has = f => s.flags.includes(f);
      if (req.flags.all && !req.flags.all.every(has)) return false;
      if (req.flags.none && req.flags.none.some(has)) return false;
      if (req.flags.any && !req.flags.any.some(has)) return false;
    }
    if (req.stats) {
      for (const [id, r] of Object.entries(req.stats)) {
        const v = s.stats[id] ?? 0;
        if (r.min != null && v < r.min) return false;
        if (r.max != null && v > r.max) return false;
      }
    }
    if (req.aspect && (!s.aspect || !req.aspect.includes(s.aspect))) return false;
    if (req.flaw && (!s.flaw || !req.flaw.includes(s.flaw))) return false;
    if (req.lineage && (!s.lineage || !req.lineage.includes(s.lineage))) return false;
    if (req.aspectRank && !req.aspectRank.includes(s.aspectRank)) return false;
    if (req.org) {
      const n = orgSize(s);
      if (req.org.min != null && n < req.org.min) return false;
      if (req.org.max != null && n > req.org.max) return false;
    }
    if (req.soulClass) {
      const c = s.soulClass ?? 0;
      if (req.soulClass.min != null && c < req.soulClass.min) return false;
      if (req.soulClass.max != null && c > req.soulClass.max) return false;
    }
    return true;
  }

  function eligible(s, ev) {
    if (ev.scripted) return false;
    if (ev.chapter && ev.chapter !== s.chapter) return false;
    if (ev.once && s.seen[ev.id]) return false;
    if (ev.cooldown != null && s.lastSeen[ev.id] != null) {
      // cooldown is in Sleeper-scale days, stretched by rank like everything else
      if (s.ageDays - s.lastSeen[ev.id] < ev.cooldown * rank(s).timeScale) return false;
    }
    return meets(s, ev.requires);
  }

  /* ---------- event selection ---------- */
  function nextEvent(s) {
    if (s.pending) {
      const forced = EVENTS.find(e => e.id === s.pending);
      s.pending = null;
      if (forced) return forced;
    }
    const pool = EVENTS.filter(e => eligible(s, e));
    if (!pool.length) return null;

    const total = pool.reduce((n, e) => n + (e.weight ?? 10), 0);
    let r = Math.random() * total;
    for (const e of pool) {
      r -= (e.weight ?? 10);
      if (r <= 0) return e;
    }
    return pool[pool.length - 1];
  }

  /* Draw and mount the next event, paying its time cost first. */
  function draw(s) {
    let ev = nextEvent(s);
    // Nothing eligible right now: drift forward and look again. Only a run
    // that stays empty until the lifespan runs out actually ends here.
    for (let tries = 0; !ev && tries < 40; tries++) {
      advance(s, DAYS_PER_YEAR, false);
      if (s.dead) return null;
      ev = nextEvent(s);
    }
    if (!ev) {
      kill(s, `Nothing came for you. You lived to ${years(s)} in a world that had run out of use for you.`, "age");
      return null;
    }
    advance(s, ev.days ?? 0, ev.fixedTime);
    if (s.dead) return null;

    s.current = ev.id;
    pickVariant(s, ev);
    s.seen[ev.id] = (s.seen[ev.id] ?? 0) + 1;
    s.lastSeen[ev.id] = s.ageDays;
    s.history.push(ev.id);
    s.eventCount++;
    if (s.history.length > 60) s.history.shift();
    Hooks.emit("draw", s, ev);
    return ev;
  }

  /* ---------- text variants ----------
     A recurring event (Gate duty above all) may carry `variants`: alternate
     opening texts that sit alongside `text` and share its choices. A tester
     got the same Gate text three times in one run (issue #3). The pick never
     repeats the previous one for that event, and is stored on the state so
     resuming a save shows the same text that was on screen. */
  function pickVariant(s, ev) {
    const n = 1 + (ev.variants?.length ?? 0);
    s.lastVariant ??= {};
    let i = 0;
    if (n > 1) {
      const prev = s.lastVariant[ev.id];
      i = Math.floor(Math.random() * n);
      if (i === prev) i = (i + 1 + Math.floor(Math.random() * (n - 1))) % n;
      s.lastVariant[ev.id] = i;
    }
    s.currentVariant = i;
  }

  function eventText(s, ev) {
    const i = s.current === ev.id ? (s.currentVariant ?? 0) : 0;
    return Hooks.reduce("text", i > 0 ? (ev.variants?.[i - 1] ?? ev.text) : ev.text, s);
  }

  /* ---------- effects ---------- */
  function applyEffects(s, fx) {
    const deltas = [];
    if (!fx) return deltas;

    if (fx.stats) {
      for (const [id, d] of Object.entries(fx.stats)) {
        const before = s.stats[id] ?? 0;
        const after = clampStat(id, before + d, s);
        s.stats[id] = after;
        if (after !== before) deltas.push({ id, d: after - before });
      }
    }
    if (fx.flags) {
      for (const f of fx.flags.add ?? []) if (!s.flags.includes(f)) s.flags.push(f);
      for (const f of fx.flags.remove ?? []) s.flags = s.flags.filter(x => x !== f);
    }
    if (fx.memory && !s.memories.includes(fx.memory)) {
      s.memories.push(fx.memory);
      const m = MEMORIES[fx.memory];
      if (m && m.stats) {
        for (const [id, d] of Object.entries(m.stats)) {
          s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d, s);
          deltas.push({ id, d });
        }
      }
    }
    /* Canon: an Echo is "a magical copy of a slain Nightmare Creature" that
       "do[es] not possess a soul" and is "created from Soul Essence" — so
       binding one ties up Essence permanently. Canon sets no cap on how many
       a person may hold, so that cost is the only thing limiting a hoard. */
    if (fx.echo && ECHOES[fx.echo] && !s.echoes.includes(fx.echo)) {
      const e = ECHOES[fx.echo];
      s.echoes.push(fx.echo);
      applyStatBlock(s, e.stats, deltas);
      s.stats.essence = clampStat("essence", s.stats.essence - (e.bound ?? 0), s);
      deltas.push({ id:"essence", d:-(e.bound ?? 0) });
    }
    if (fx.org) applyOrg(s, fx.org);
    Hooks.emit("effects", s, fx, deltas);
    if (fx.lineage) rewriteLineage(s, fx.lineage, deltas);
    if (fx.awardFlaw) awardFlaw(s, deltas);
    /* Canon: "First Nightmares are unique because each of them is tailored
       individually" — so a fresh scenario is drawn every run, and the same is
       true of where the solstice puts a Sleeper down in the Dream Realm. */
    if (fx.nightmare) {
      /* Entering a Nightmare only stages it. It is not a trial "conquered"
         until the matching _resolve node fires `conquered:true` below — a
         run that dies inside the Hollow Choir must not show up on the end
         screen as having beaten the Hollow Choir. */
      const sc = pickRandom(NIGHTMARES[fx.nightmare]);
      s.currentTrial = { tier: fx.nightmare, id: sc.id, name: sc.name };
      s.pending = sc.entry;
    }
    if (fx.conquered && s.currentTrial) {
      s.trials = s.trials || [];
      s.trials.push(s.currentTrial);
      s.currentTrial = null;
    }
    if (fx.solstice) {
      const r = pickRandom(SOLSTICE);
      s.region = r.name;
      s.pending = r.entry;
    }
    if (fx.appraisal) s.appraisal += fx.appraisal;
    if (fx.kill) deltas.push(...harvest(s, fx.kill));
    if (fx.rank) {
      s.rank = Math.min(RANKS.length - 1, s.rank + fx.rank);
      /* Canon: each rank shifts the balance away from the waking world.
         Masters leave a tether behind; Saints are miniature Gateways;
         Supremes are tied to the Dream Realm instead of Earth. */
      s.stats.tether = clampStat("tether", s.stats.tether - rank(s).tetherLoss, s);
    }
    if (fx.chapter) s.chapter = fx.chapter;
    if (fx.days) advance(s, fx.days, false);
    if (fx.goto) s.pending = fx.goto;
    if (fx.death) kill(s, typeof fx.death === "string" ? fx.death : fx.death.text,
                       typeof fx.death === "string" ? "killed" : fx.death.kind);

    if (s.stats.vitality < 1 && !s.dead) {
      kill(s, `Your body gave out at ${years(s)}. The Core outlived it by a few seconds.`, "wounds");
    }
    return deltas;
  }

  function applyStatBlock(s, block, deltas) {
    for (const [id, d] of Object.entries(block ?? {})) {
      s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d, s);
      if (deltas) deltas.push({ id, d });
    }
  }

  /* ---------- saves from before v0.4.0 ----------
     v0.4.0 removed five lineages. A save still carrying one would show
     "Lineage: —" while keeping its stats, and a Weave could not take it
     back. The stats were already earned, so they stay; only the id is
     mapped onto the nearest lineage that still exists. */
  const LINEAGE_RENAMED = { flame:"sun", salt_queen:"thin", long_sleeper:"thin", cartographer:"thin", unmade_smith:"thin" };
  function migrate(s) {
    const to = LINEAGE_RENAMED[s.lineage];
    if (!to) return s;
    s.lineage = to;
    if (to === "thin") s.flags = s.flags.filter(f => f !== "divine_lineage");
    else if (!s.flags.includes("hidden_lineage")) s.flags.push("hidden_lineage");
    s.flags = s.flags.filter(f => f !== "fallen_clan");
    return s;
  }

  /* ---------- your organization (issue #10) ----------
     Canon gives the templates: an Awakened company like the First
     Evacuation Army's Irregulars, a Saint's own order and Citadel like the
     Lord of Shadows', a lesser clan's stronghold that grew into Ravenheart.
     It also gives the threat: "The great clans have been suppressing the
     Transcendence of independent Awakened for decades" (ch. 1229).
     The organization itself, its name and every number are ours.

     `org:{ found:"company" }` starts one if you have none; `kind` upgrades
     it as you climb; `grow:n` changes its size (members, in rough hundreds).
     At size 0 it is gone, and stays gone. */
  const ORG_KINDS = ["company", "order", "refuge"];
  const ORG_NAMES = [
    "the Lantern Company", "the Second Watch", "the Salt Road Company", "the Long Night Watch",
    "the Hollow Bell", "the Grey Banner", "the Ninth Gate Company", "the Quiet Hand",
    "the Ash Road", "the Unslept",
  ];
  function orgSize(s) { return s.org && !s.org.gone ? s.org.size : 0; }

  function applyOrg(s, o) {
    if (o.found && (!s.org || s.org.gone)) {
      s.org = { name: pickRandom(ORG_NAMES), kind: o.found, size: 1, peak: 1, founded: years(s) };
      if (!s.flags.includes("has_org")) s.flags.push("has_org");
      s.flags = s.flags.filter(f => f !== "org_gone");
    }
    if (!s.org || s.org.gone) return;
    if (o.kind && ORG_KINDS.indexOf(o.kind) > ORG_KINDS.indexOf(s.org.kind)) s.org.kind = o.kind;
    if (o.grow) {
      s.org.size = Math.max(0, Math.min(12, s.org.size + o.grow));
      s.org.peak = Math.max(s.org.peak, s.org.size);
      if (s.org.peak >= 6 && !s.flags.includes("great_order")) s.flags.push("great_order");
    }
    if (o.sworn) s.org.sworn = o.sworn;
    if (s.org.size === 0) {
      s.org.gone = true;
      s.flags = s.flags.filter(f => f !== "has_org");
      if (!s.flags.includes("org_gone")) s.flags.push("org_gone");
    }
  }

  /* Lineage: inherited, so it is drawn from where you were born and from
     nothing else. Canon calls lineage a hereditary Attribute, "especially
     true for Great Clans whose scions inherited the same lineage Attribute",
     and is explicit that carrying the lineage of a divine creature says
     nothing about what your Aspect will be. This function therefore never
     looks at s.aspect, and awardAspect never looks at s.lineage. */
  function awardLineage(s, deltas) {
    /* `eventOnly` lineages (the Weaver) are never inherited at birth. */
    const pool = LINEAGES.filter(l => !l.eventOnly).map(l => ({ l, w: l.weight?.[s.origin] ?? 1 }));
    const l = weighted(pool).l;
    s.lineage = l.id;
    applyStatBlock(s, l.stats, deltas);
    for (const f of l.flags ?? []) if (!s.flags.includes(f)) s.flags.push(f);
  }

  /* `lineage:"id"` in effects: the new lineage devours the old one. Its
     stats and flags are taken back first, then the new one's are applied.
     Canon precedent: [Blood Weave] devoured the Shadow God's ichor
     (ch. 551). The old id is kept for the end screen. */
  function rewriteLineage(s, id, deltas) {
    const next = LINEAGES.find(l => l.id === id);
    if (!next || s.lineage === id) return;
    const old = LINEAGES.find(l => l.id === s.lineage);
    if (old) {
      applyStatBlock(s, Object.fromEntries(Object.entries(old.stats ?? {}).map(([k, v]) => [k, -v])), deltas);
      if (s.stats.vitality < 1) s.stats.vitality = 1;
      s.flags = s.flags.filter(f => !(old.flags ?? []).includes(f));
      s.lineageBefore = old.id;
    }
    s.lineage = next.id;
    applyStatBlock(s, next.stats, deltas);
    for (const f of next.flags ?? []) if (!s.flags.includes(f)) s.flags.push(f);
  }

  /* Aspect: drawn at infection, weighted by origin. Dormant rank, no ability
     and no Flaw yet — exactly as the Spell hands it to an Aspirant. */
  function awardAspect(s) {
    const pool = ASPECTS.map(a => ({ a, w: (a.origins ?? []).includes(s.origin) ? 30 : 10 }));
    s.aspect = weighted(pool).a.id;
  }

  /* Flaw: granted only on surviving the First Nightmare. Canon says Flaws are
     "never random" but "deeply connected to the individuals cursed by them",
     so we weight heavily toward what the player actually did in there. */
  function awardFlaw(s, deltas) {
    const pool = FLAWS.map(f => {
      let w = 4;
      for (const tag of f.affinity ?? []) if (s.flags.includes(tag)) w += 25;
      if (f.aspect && f.aspect === s.aspect) w += 20;
      return { f, w };
    });
    const f = weighted(pool).f;
    s.flaw = f.id;
    applyStatBlock(s, f.stats, deltas);

    /* The Aspect's own stat block lands here, with the Flaw, not at
       infection. Canon: Aspirants carry "a Dormant Rank Aspect without the
       Flaw or Aspect Ability" and are "given Flaw in exchange for the power",
       so power and price arrive together. Until v0.3.5 this block was never
       applied at all: every Aspect was flavour text and the Flaw was a pure
       penalty (issue #3). */
    const aspect = ASPECTS.find(a => a.id === s.aspect);
    if (aspect) applyStatBlock(s, aspect.stats, deltas);

    /* The Spell appraises the trial and ranks the Aspect on it. Canon: "The
       Aspect can rank up after the trial is over, depending on the appraisal
       the Spell gives", "Aspect Rank is not fixed and can evolve depend[ing]
       on one's feat", and the rank itself is "Same as Soul Rank" — the same
       seven-rung ladder, not a separate grade track. Canon also ties the
       appraisal to deviation: "The Spell's appraisals were tied to how far
       one deviated from their destined path", which is why an outskirts
       survivor is graded more generously than a clan scion.

       Where the ladder is cut — and everything above Transcendent — is ours.
       Canon never says how a Divine Aspect comes about, only that it exists
       and that the wiki knows of exactly three holders. So the top three
       rungs need an extraordinary trial AND a rare draw, and the draw is
       deliberately NOT gated on lineage: canon says the two are unrelated. */
    /* An origin may set its own `deviation` (origins added by content packs
       do); the three original ones keep their values. */
    const deviation = ORIGINS.find(o => o.id === s.origin)?.deviation ??
      (s.origin === "outskirts" ? 2 : s.origin === "clan" ? -1 : 0);
    const graded = s.appraisal + deviation;
    let rankIndex = graded >= 8 ? 3 : graded >= 5 ? 2 : graded >= 2 ? 1 : 0;
    if (rankIndex === 3) {
      /* Only a trial already good enough for Transcendent is even considered,
         and then it is mostly a matter of luck. Tuned against tools/sim.js so
         that a Divine Aspect stays about as rare as canon implies. */
      const r = Math.random();
      if (graded >= 13 && r < 0.008) rankIndex = 6;       // Divine  ~0.04% of survivors
      else if (graded >= 13 && r < 0.05) rankIndex = 5;   // Sacred  ~0.2%
      else if (graded >= 11 && r < 0.12) rankIndex = 4;   // Supreme ~1%
    }
    const def = ASPECT_RANKS[rankIndex];
    s.aspectRank = def.id;
    applyStatBlock(s, def.bonus, deltas);
    if (rankIndex >= 4 && !s.flags.includes("high_aspect")) s.flags.push("high_aspect");
    if (rankIndex === 6 && !s.flags.includes("divine_aspect")) s.flags.push("divine_aspect");
  }

  /* Class is a second axis, separate from Soul Rank: canon grades Nightmare
     Creatures as Beast (1 core), Monster (2), Demon (3), Devil (4), Tyrant
     (5), Terror (6), Titan (7).

     Canon says "Human souls are not meant to have many cores or sustain
     them", that some Awakened can nonetheless "form multiple soul cores
     similar to Nightmare Creatures", and that for a Divine Aspect holder
     "the birth of a new core brings immense pain". It stops short of stating
     that an ordinary human is capped at one core forever — that cap is OUR
     inference, and so is every fragment threshold in CLASSES. */
  function maxClassFor(s) {
    /* Divine Aspect: canon says such a soul sustains more than one core, and
       sets no ceiling on it. Anyone else: ours — one extra core, ever. */
    return s.aspectRank === "Divine" ? CLASSES.length - 1 : 1;
  }

  function maybeFormCore(s, deltas) {
    const next = CLASSES[s.soulClass + 1];
    if (!next || s.soulClass + 1 > maxClassFor(s)) return;
    if (s.fragments < next.fragments) return;
    s.soulClass++;
    s.soulCores = next.cores;
    /* The pain is canon ("the birth of a new core brings immense pain"); the
       numbers are ours, and it hurts an ordinary soul more, because canon
       says a human soul is "not meant to have many cores or sustain them". */
    const divine = s.aspectRank === "Divine";
    applyStatBlock(s, divine ? { vitality: -6, essence: 10, willpower: 2 }
                             : { vitality: -12, essence: 6 }, deltas);
    if (!s.flags.includes("formed_core")) s.flags.push("formed_core");
    s.classUps = (s.classUps ?? 0) + 1;
  }

  /* Soul fragments from a kill. Canon formula from the wiki FAQ:
     2^(ranks above your own) * (number of soul cores). Killing upward is
     exponentially profitable, which is why everyone does something suicidal
     eventually. */
  function harvest(s, kill) {
    const diff = (kill.rank ?? s.rank) - s.rank;
    const gained = Math.pow(2, diff) * (kill.cores ?? 1) * (kill.size ?? 1);
    s.fragments += gained;
    const essence = Math.max(1, Math.round(gained / 3));
    const deltas = [];
    applyStatBlock(s, { essence }, deltas);
    maybeFormCore(s, deltas);
    return deltas;
  }

  function weighted(pool) {
    const total = pool.reduce((n, x) => n + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x; }
    return pool[pool.length - 1];
  }

  /* ---------- Memories and Echoes in a fight ----------
     Canon has Memories summoned and Echoes commanded in battle; until
     v0.4.0 both were only permanent stat bonuses here (issue #9). Now:

     - A Weapon Memory adds +1 to a dangerous check (cap +2).
     - Armor and Garment Memories soak 2 Vitality off a failed check's
       damage each (cap 4).
     - A bound Echo fights beside you: one d4 on a dangerous check, however
       many you hold (more Echoes do not mean more dice; it keeps a hoard
       from turning every check into a formality).
     - An Echo can die in your place: a fatal miss on a dangerous check
       destroys your strongest Echo instead, and you take the ordinary
       failure. The Echo's bonus is lost with it, and the Essence it was
       made of is spent, not refunded.

     "Dangerous" means a check that can kill and is a fight: Gates,
     Nightmares, the Dream Realm, war. Personal trials (`dcSelf`) take
     none of this: they are measured against you alone, which is also what
     keeps the Fourth and Fifth Nightmares the spike they are meant to be.
     All numbers are ours. */
  const COMBAT_KINDS = ["gate", "nightmare", "dream_realm", "war", "chain", "murdered"];
  const AID = { weaponEach: 1, weaponCap: 2, soakEach: 2, soakCap: 4, echoDie: 4 };

  function isCombat(c) {
    return !!(c.check && c.check.fatal != null && !c.check.dcSelf &&
      COMBAT_KINDS.includes(c.check.fatalKind ?? "killed"));
  }

  function countMemories(s, types) {
    return s.memories.filter(m => types.includes(MEMORIES[m]?.type)).length;
  }

  function weaponBonus(s) { return Math.min(AID.weaponCap, AID.weaponEach * countMemories(s, ["Weapon"])); }
  function armorSoak(s)   { return Math.min(AID.soakCap, AID.soakEach * countMemories(s, ["Armor", "Garment"])); }

  /* What a check would add before the die is rolled. tools/sim.js prices
     choices with it, so it has to stay deterministic: the Echo die is
     reported as a die, not rolled. */
  function checkAid(s, c) {
    if (!isCombat(c)) return { weapon: 0, echoDie: 0 };
    return { weapon: weaponBonus(s), echoDie: (s.echoes?.length ?? 0) > 0 ? AID.echoDie : 0 };
  }

  function strongestEcho(s) {
    return [...(s.echoes ?? [])].sort((a, b) => (ECHOES[b].bound ?? 0) - (ECHOES[a].bound ?? 0))[0];
  }

  function loseEcho(s, id, deltas) {
    s.echoes = s.echoes.filter(e => e !== id);
    const neg = Object.fromEntries(Object.entries(ECHOES[id].stats ?? {}).map(([k, v]) => [k, -v]));
    applyStatBlock(s, neg, deltas);
    /* The Echo died so that you would not: losing its Vitality bonus must
       not be what kills you a moment later. */
    if (s.stats.vitality < 1) s.stats.vitality = 1;
    s.echoesLost = (s.echoesLost ?? 0) + 1;
  }

  /* A failure branch's Vitality loss, after armor. Never turns a loss into a
     gain, and never touches the check's own deaths. */
  function soaked(s, fx) {
    const soak = armorSoak(s);
    const v = fx?.stats?.vitality;
    if (!soak || v == null || v >= 0) return { fx, soak: 0 };
    const nv = Math.min(0, v + soak);
    return { fx: { ...fx, stats: { ...fx.stats, vitality: nv } }, soak: nv - v };
  }

  /* ---------- resolving a choice ---------- */
  /* The "era" term of a check's difficulty: how far the world has worsened
     around you, one step per 20 years lived. Uncapped, that was right for an
     Awakened (140 years, 7 steps) and absurd above it: a 5,000-year-old
     Sovereign was 260 steps in, and a dcEra:2 check came out at DC 500+
     (issue #48). The cap is a Master's natural lifespan in steps (320 / 20),
     so Awakened, Master and Saint play exactly as before (checked with
     tools/sim.js) and the highest ranks stop drifting into impossible
     numbers. The 20 and the cap are ours, not canon. */
  const ERA_CAP = 16;
  function eraOf(s) {
    return Math.min(ERA_CAP, Math.floor(years(s) / 20));
  }

  function choose(s, ev, index) {
    const out = resolveChoice(s, ev, index);
    if (out.text) out.text = Hooks.reduce("text", out.text, s);
    Hooks.emit("choose", s, ev, ev.choices[index], out);
    return out;
  }

  function resolveChoice(s, ev, index) {
    const c = ev.choices[index];
    const out = { text: null, ok: null, deltas: [] };

    if (c.check) {
      const aid = checkAid(s, c);
      const echoRoll = aid.echoDie ? roll(aid.echoDie) : 0;
      const r = roll(10);
      const stat = s.stats[c.check.stat] ?? 0;
      /* Recurring duties scale with rank: a Master is not sent to the Gates an
         Awakened is sent to. Without this, a high stat makes a fixed-DC event
         mathematically unkillable, and the run stops being a life and starts
         being a spreadsheet. */
      /* Two pressures raise the bar. Rank, because a Master is not sent to an
         Awakened's Gates. And era: canon has Obel theorising that every
         Ascension thickens the Gates worldwide, so the longer you live the
         worse the world you live in gets. An Awakened who refuses to climb
         does not get to coast to a peaceful old age. */
      const era = eraOf(s);
      /* dcSelf: the trial is measured against the challenger, not against a
         fixed bar. Canon uses this for the personal trials — the Fifth
         Nightmare has "a personal trial tailored specifically to the
         challenger" — and mechanically it is what stops a high stat from
         turning the late game into a formality. Being strong stops being
         the same thing as being safe. */
      const dc = c.check.dcSelf
        ? (s.stats[c.check.stat] ?? 0) + c.check.dc
        : c.check.dc + (c.check.dcScale ?? 0) * s.rank + (c.check.dcEra ?? 0) * era;
      /* Modules may add to a roll (an Aspect Ability, an ally). Each mod is
         {label, value} and is shown on the roll line. */
      const mods = Hooks.collect("checkMods", s, c);
      const modSum = mods.reduce((n, m) => n + (m.value ?? 0), 0);
      const margin = (r + stat + aid.weapon + echoRoll + modSum) - dc;
      out.ok = margin >= 0;
      out.rollInfo = { die: r, stat, dc, statId: c.check.stat, margin,
                       weapon: aid.weapon, echoDie: aid.echoDie, echoRoll, mods };

      // A catastrophic miss is fatal. This is where the game's lethality lives.
      if (!out.ok && c.check.fatal != null && margin <= -c.check.fatal) {
        const shield = isCombat(c) ? strongestEcho(s) : null;
        if (!shield) {
          out.fatal = true;
          out.text = c.check.fatalText ?? "It goes as badly as it can go.";
          kill(s, c.check.fatalCause ?? out.text, c.check.fatalKind ?? "killed");
          return out;
        }
        out.echoLost = shield;   // lost below, after the failure lands
      }
      const branch = out.ok ? c.success : c.failure;
      if (branch) {
        let fx = branch.effects;
        if (!out.ok && isCombat(c)) { const a = soaked(s, fx); fx = a.fx; out.soaked = a.soak; }
        out.text = branch.text ?? null;
        if (out.echoLost) out.text = `${ECHOES[out.echoLost].name} steps into what was meant for you, and is unmade.` + (out.text ? `\n\n${out.text}` : "");
        out.deltas.push(...applyEffects(s, fx));
      } else if (out.echoLost) {
        out.text = `${ECHOES[out.echoLost].name} steps into what was meant for you, and is unmade.`;
      }
      /* The Echo goes after the ordinary failure has landed, so its own
         stat bonus is never what kills you (loseEcho keeps Vitality >= 1). */
      if (out.echoLost && !s.dead) loseEcho(s, out.echoLost, out.deltas);
    }
    out.deltas.push(...applyEffects(s, c.effects));
    if (!c.check && c.text) out.text = c.text;   // a plain choice may narrate its outcome
    return out;
  }

  function choiceAvailable(s, c) { return meets(s, c.requires); }

  return {
    newRun, draw, choose, choiceAvailable, applyEffects, harvest, ORIGINS: () => ORIGINS,
    checkAid, isCombat, weaponBonus, armorSoak, orgSize, migrate, AID,
    soulClass: s => CLASSES[s.soulClass ?? 0],
    maxClassFor,
    rank, years, lifeRemaining, lifespanYears, statDef, shown, eventText, era: eraOf,
    DAYS_PER_YEAR,
    eventById: id => EVENTS.find(e => e.id === id),
  };
})();
