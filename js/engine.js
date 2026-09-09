/* =============================================================
   FATE LEGACY — ENGINE
   Pure state machine. Knows nothing about the DOM.
   ============================================================= */
const Engine = (() => {

  const DAYS_PER_YEAR = 365;
  const START_AGE = 17;

  /* ---------- helpers ---------- */
  const rank = s => RANKS[s.rank];
  const statDef = id => STATS.find(x => x.id === id);
  const years = s => Math.floor(s.ageDays / DAYS_PER_YEAR);
  const shown = v => Math.round(v * 10) / 10;

  function clampStat(id, v) {
    const d = statDef(id);
    if (!d) return v;
    return Math.max(d.min, Math.min(d.max, v));
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
      flaw: null,
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
    for (const [id, d] of Object.entries(o.stats)) s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d);
    for (const f of o.flags ?? []) s.flags.push(f);
    awardAspect(s);
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
    checkLifespan(s);
  }

  /* Wounds close over time, up to the best condition this character has ever
     been in. Training raises the ceiling; a bad Gate does not permanently
     lower it. Story beats (fixedTime) still pass real days, so you do heal
     between the nodes of a Nightmare — just very little. */
  function heal(s, days) {
    if (s.dead) return;
    s.vitCap = Math.max(s.vitCap ?? 0, s.stats.vitality);
    const room = s.vitCap - s.stats.vitality;
    if (room <= 0) return;
    s.stats.vitality = clampStat("vitality", s.stats.vitality + Math.min(room, days / 50));
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
    s.seen[ev.id] = (s.seen[ev.id] ?? 0) + 1;
    s.lastSeen[ev.id] = s.ageDays;
    s.history.push(ev.id);
    s.eventCount++;
    if (s.history.length > 60) s.history.shift();
    return ev;
  }

  /* ---------- effects ---------- */
  function applyEffects(s, fx) {
    const deltas = [];
    if (!fx) return deltas;

    if (fx.stats) {
      for (const [id, d] of Object.entries(fx.stats)) {
        const before = s.stats[id] ?? 0;
        const after = clampStat(id, before + d);
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
          s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d);
          deltas.push({ id, d });
        }
      }
    }
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
      s.stats.tether = clampStat("tether", s.stats.tether - rank(s).tetherLoss);
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
      s.stats[id] = clampStat(id, (s.stats[id] ?? 0) + d);
      if (deltas) deltas.push({ id, d });
    }
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

    /* The Spell appraises the trial: a bolder run yields a better Aspect rank.
       ("The Aspect can rank up after the trial is over, depending on the
       appraisal the Spell gives.") */
    const deviation = s.origin === "outskirts" ? 2 : s.origin === "clan" ? -1 : 0;
    const graded = s.appraisal + deviation;
    s.aspectGrade = graded >= 8 ? "Transcendent" : graded >= 5 ? "Ascended"
                  : graded >= 2 ? "Awakened" : "Dormant";
    const bonus = { Dormant:0, Awakened:1, Ascended:3, Transcendent:6 }[s.aspectGrade];
    if (bonus) applyStatBlock(s, { essence: bonus, willpower: Math.ceil(bonus / 2) }, deltas);
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
    return deltas;
  }

  function weighted(pool) {
    const total = pool.reduce((n, x) => n + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x; }
    return pool[pool.length - 1];
  }

  /* ---------- resolving a choice ---------- */
  function choose(s, ev, index) {
    const c = ev.choices[index];
    const out = { text: null, ok: null, deltas: [] };

    if (c.check) {
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
      const era = Math.floor(years(s) / 20);
      /* dcSelf: the trial is measured against the challenger, not against a
         fixed bar. Canon uses this for the personal trials — the Fifth
         Nightmare has "a personal trial tailored specifically to the
         challenger" — and mechanically it is what stops a high stat from
         turning the late game into a formality. Being strong stops being
         the same thing as being safe. */
      const dc = c.check.dcSelf
        ? (s.stats[c.check.stat] ?? 0) + c.check.dc
        : c.check.dc + (c.check.dcScale ?? 0) * s.rank + (c.check.dcEra ?? 0) * era;
      const margin = (r + stat) - dc;
      out.ok = margin >= 0;
      out.rollInfo = { die: r, stat, dc, statId: c.check.stat, margin };

      // A catastrophic miss is fatal. This is where the game's lethality lives.
      if (!out.ok && c.check.fatal != null && margin <= -c.check.fatal) {
        out.fatal = true;
        out.text = c.check.fatalText ?? "It goes as badly as it can go.";
        kill(s, c.check.fatalCause ?? out.text, c.check.fatalKind ?? "killed");
        return out;
      }
      const branch = out.ok ? c.success : c.failure;
      if (branch) {
        out.text = branch.text ?? null;
        out.deltas.push(...applyEffects(s, branch.effects));
      }
    }
    out.deltas.push(...applyEffects(s, c.effects));
    return out;
  }

  function choiceAvailable(s, c) { return meets(s, c.requires); }

  return {
    newRun, draw, choose, choiceAvailable, applyEffects, harvest, ORIGINS: () => ORIGINS,
    rank, years, lifeRemaining, lifespanYears, statDef, shown,
    DAYS_PER_YEAR,
    eventById: id => EVENTS.find(e => e.id === id),
  };
})();
