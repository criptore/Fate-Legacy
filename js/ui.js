/* =============================================================
   FATE LEGACY — UI
   Owns the DOM. Talks to Engine, never mutates state itself.
   ============================================================= */
(() => {
  const $ = id => document.getElementById(id);
  const el = {
    home:$("screen-home"), origin:$("screen-origin"), game:$("screen-game"), end:$("screen-end"),
    originList:$("origin-list"),
    btnNew:$("btn-new"), btnContinue:$("btn-continue"), saveInfo:$("home-save-info"),
    rank:$("hud-rank"), pips:$("hud-pips"), age:$("hud-age"), life:$("hud-life"),
    runes:$("hud-runes"), runesSecondary:$("hud-runes-secondary"), flawLine:$("hud-flaw"),
    expand:$("hud-expand"), expandLabel:$("hud-expand-label"), panel:$("hud-panel"),
    title:$("event-title"), text:$("event-text"), outcome:$("outcome"), choices:$("choices"),
    sheet:$("sheet"), sheetBody:$("sheet-body"),
    btnSheet:$("btn-sheet"), btnSheetClose:$("btn-sheet-close"),
    btnQuit:$("btn-quit"), btnAgain:$("btn-again"),
    endRankName:$("end-rank-name"), endRankPips:$("end-rank-pips"),
    endTitle:$("end-title"), endCause:$("end-cause"), endRunes:$("end-runes"),
    endAchv:$("end-achv"), endStats:$("end-stats"), endExtra:$("end-extra"), homeExtra:$("home-extra"),
    linkBug:$("link-bug"), linkFeedback:$("link-feedback"),
    themeToggle:$("theme-toggle"),
    guide:$("guide"), guideStep:$("guide-step"), guideTitle:$("guide-title"), guideBody:$("guide-body"),
    guideDots:$("guide-dots"), guideSkip:$("guide-skip"), guideBack:$("guide-back"), guideNext:$("guide-next"),
  };

  const REPO_URL = "https://github.com/criptore/Fate-Legacy";

  let S = null;         // current run state
  let EV = null;        // event on screen

  /* ---------- runes ----------
     The Spell's status page, the way the book describes it: a script only
     the carrier can see, showing what they are made of right now. Each
     stat gets a glyph in a ring that glows the colour of the current rank;
     Aspect gets its own glyph in the memory-gold accent, since it is
     personal rather than rank-conferred. */
  const GLYPH = {
    vitality:"♥", willpower:"◈", perception:"◉", essence:"✦",
    cunning:"◆", renown:"★", tether:"⚓",
  };

  function runeHTML(def, value) {
    return `<span class="rune" title="${escape(def.name)} — ${escape(def.desc)}">
      <span class="rune-glyph">${GLYPH[def.id] ?? "●"}</span>
      <span class="rune-val">${Math.floor(value)}</span>
      <span class="rune-label">${escape(def.short)}</span>
    </span>`;
  }

  function aspectRuneHTML(aspect) {
    if (!aspect) return "";
    return `<span class="rune rune-aspect" data-aspect title="${escape(aspect.name)} — ${escape(aspect.desc)}">
      <span class="rune-glyph">✧</span>
      <span class="rune-name">${escape(aspect.name)}</span>
      <span class="rune-label">Aspect</span>
    </span>`;
  }

  /* A Flaw's mechanical price, spelled out. Player feedback: the poetic
     desc alone ("You move before you decide to. It has saved you twice...")
     can read like a skill rather than a curse. */
  function statBlock(stats) {
    return Object.entries(stats ?? {}).map(([id, v]) =>
      `${v > 0 ? "+" : "−"}${Math.abs(v)} ${Engine.statDef(id)?.short ?? id}`).join(", ");
  }
  function flawCost(f) { const b = statBlock(f.stats); return b ? `Cost: ${b}` : ""; }
  /* Shown only once the Flaw exists: that is when the Aspect's stats apply. */
  function aspectGift(a) { const b = statBlock(a.stats); return b && S && S.flaw ? ` Grants: ${b}.` : ""; }

  /* What a Memory or an Echo actually does (issue #8). Before this the Status
     page listed name, rank and flavour only, and a tester could not tell
     what owning one was for. The fight rules are in engine.js (checkAid). */
  const A = Engine.AID;
  const MEMORY_USE = {
    Weapon:  `+${A.weaponEach} on dangerous checks (up to +${A.weaponCap})`,
    Armor:   `takes ${A.soakEach} Vitality off a failed fight's damage`,
    Garment: `takes ${A.soakEach} Vitality off a failed fight's damage`,
  };
  function memoryEffect(id) {
    const m = MEMORIES[id];
    return [statBlock(m.stats), MEMORY_USE[m.type]].filter(Boolean).join(" · ");
  }
  /* The Weaver's Weave devours the lineage you were born with. */
  function lineageBefore(st) {
    const b = st.lineageBefore && LINEAGES.find(l => l.id === st.lineageBefore);
    return b ? ` (It devoured: ${b.name}.)` : "";
  }

  /* Your organization (issue #10), on the Status page and, with what became
     of it, on the end screen. */
  const ORG_KIND = { company:"a company of Awakened", order:"an order", refuge:"a landing zone in the Dream Realm" };
  function orgLine(o) {
    if (!o) return "";
    if (o.gone) return `${o.name}, ${ORG_KIND[o.kind]}. Gone.`;
    return `${o.name}, ${ORG_KIND[o.kind]} · about ${(o.size * 100).toLocaleString()} people` +
      (o.sworn ? " · sworn to a Great Clan" : " · independent");
  }
  function orgEpilogue(o) {
    if (!o) return "";
    if (o.gone) return `${o.name} did not outlive you. It was gone before you were.`;
    if (o.sworn) return `${o.name} was folded into the clan it swore to within a generation. Its banner still hangs in their hall, under theirs.`;
    if (o.kind === "refuge") return `${o.name} outlived you. People who never learned your name were still landing there centuries later.`;
    if (o.size >= 6) return `${o.name} outlived you by centuries, and argued about what you would have wanted for every one of them.`;
    if (o.size >= 3) return `${o.name} held together for about a generation without you, then split three ways.`;
    return `${o.name} lasted a few years after you, then its last members joined other companies.`;
  }
  function echoEffect(id) {
    const e = ECHOES[id];
    return [statBlock(e.stats), e.bound ? `binds ${e.bound} ESS` : ""].filter(Boolean).join(" · ");
  }

  function renderPips(container, rankIndex) {
    let h = "";
    for (let i = 0; i < RANKS.length; i++) h += `<i class="${i <= rankIndex ? "on" : ""}"></i>`;
    container.innerHTML = h;
  }

  /* ---------- screens ---------- */
  function show(name) {
    for (const k of ["home","origin","game","end"]) el[k].hidden = (k !== name);
    /* A screen switch is a new page as far as the reader is concerned.
       Without this, the end screen can appear scrolled halfway down —
       whatever position a long event happened to leave the page at —
       so a death can render with the rank badge and cause of death
       already scrolled out of view above the fold. */
    window.scrollTo(0, 0);
  }

  /* ---------- HUD ---------- */
  function renderHud() {
    const r = Engine.rank(S);
    document.body.dataset.rank = r.id;
    /* Canon: you are an "Aspirant" until you pass the First Nightmare, a
       "Sleeper" until you return from the Dream Realm, and only then Awakened.
       All three are the Dormant soul rank; only the word changes. */
    el.rank.textContent = S.chapter === "aspirant" ? "Aspirant"
      : (r.common === r.name ? r.name : `${r.name} · ${r.common}`);
    renderPips(el.pips, S.rank);

    const span = Engine.lifespanYears(S);
    el.age.textContent = span == null
      ? `Age ${Engine.years(S).toLocaleString()} · unbound`
      : `Age ${Engine.years(S).toLocaleString()} / ${span.toLocaleString()}`;
    el.life.style.width = (Engine.lifeRemaining(S) * 100).toFixed(1) + "%";

    // Primary runes: always visible while playing — VIT/WIL/PER/ESS, plus
    // Aspect once the Spell has granted one.
    const aspect = S.aspect && ASPECTS.find(a => a.id === S.aspect);
    el.runes.innerHTML = STATS.filter(d => d.hud).map(d => runeHTML(d, S.stats[d.id] ?? 0)).join("")
      + aspectRuneHTML(aspect);

    // Secondary runes: Cunning/Renown/Tether, plus the Flaw's text. Tucked
    // behind the expander so the always-on strip stays short on a phone.
    el.runesSecondary.innerHTML = STATS.filter(d => !d.hud).map(d => runeHTML(d, S.stats[d.id] ?? 0)).join("");
    const flaw = S.flaw && FLAWS.find(f => f.id === S.flaw);
    const lin = S.lineage && LINEAGES.find(l => l.id === S.lineage);
    const cls = Engine.soulClass(S);
    const lines = [];
    /* Aspect first: its rune only carries a hover title, which a phone can
       never show, so this line is the only place mobile players can read it. */
    if (aspect) lines.push(`Aspect — ${aspect.name}${S.aspectRank && S.aspectRank !== "Dormant" ? ` (${S.aspectRank} rank)` : ""}: ${aspect.desc}${aspectGift(aspect)}`);
    if (lin && lin.id !== "none") lines.push(`Lineage — ${lin.name}${lin.divine ? " (divine)" : ""}: ${lin.desc}`);
    if (flaw) lines.push(`Flaw — ${flaw.name}: ${flaw.desc} ${flawCost(flaw)}.`);
    /* Class only earns HUD space once it stops being the default. Everyone
       starts a Beast with one core and almost everyone stays one. */
    if ((S.soulClass ?? 0) > 0) lines.push(`Class — ${cls.name}, ${cls.cores} Soul Cores.`);
    if (S.echoes && S.echoes.length) lines.push(`Echoes — ${S.echoes.map(e => ECHOES[e].name).join(", ")}.`);
    el.flawLine.textContent = lines.join("  ·  ");
  }

  /* ---------- stat hints ----------
     Player feedback: naming the rolled stat under every choice turns a
     decision into "press the button you're best at". Hidden by default, so
     you choose by what your character would do; the roll line after the
     choice still names the stat, so the system stays learnable. Only stat
     names are stripped; flavour after them ("Willpower. Years of it." ->
     "Years of it.") and non-stat hints (costs, warnings) are kept.
     Display preference, kept outside the save like the theme. */
  const HINTS_KEY = "fatelegacy.statHints";
  let showStatHints = false;
  try { showStatHints = localStorage.getItem(HINTS_KEY) === "1"; } catch (e) {}

  function shownHint(c) {
    if (!c.hint || showStatHints) return c.hint;
    // A bare stat name on an unchecked choice advertises what it pays out —
    // the same min-maxing nudge, so it goes too.
    if (!c.check) return STATS.some(d => d.name === c.hint) ? "" : c.hint;
    const name = Engine.statDef(c.check.stat)?.name;
    const names = [name, name && name.split(" ").pop()].filter(Boolean);   // "Soul Essence" / "Essence"
    for (const n of names) {
      if (c.hint === n) return "";
      if (c.hint.startsWith(n + ".")) return c.hint.slice(n.length + 1).trim();
    }
    return c.hint;
  }

  function syncHintToggles() {
    for (const b of document.querySelectorAll(".hint-toggle")) {
      b.textContent = `Stat hints: ${showStatHints ? "on" : "off"}`;
      b.setAttribute("aria-pressed", String(showStatHints));
    }
  }

  function toggleStatHints() {
    showStatHints = !showStatHints;
    try { localStorage.setItem(HINTS_KEY, showStatHints ? "1" : "0"); } catch (e) {}
    syncHintToggles();
    // Re-draw the open choices, but never a resolved event's outcome.
    if (EV && S && !S.dead && el.outcome.hidden && !el.game.hidden) renderEvent(EV);
  }
  for (const b of document.querySelectorAll(".hint-toggle")) b.onclick = toggleStatHints;
  syncHintToggles();

  /* ---------- event ---------- */
  function renderEvent(ev) {
    EV = ev;
    el.outcome.hidden = true;
    el.outcome.className = "outcome";
    el.title.textContent = ev.title ?? "";
    el.text.textContent = Engine.eventText(S, ev) ?? "";
    el.choices.innerHTML = "";
    for (const node of Hooks.collect("choiceBar", S, ev)) el.choices.appendChild(node);

    ev.choices.forEach((c, i) => {
      const ok = Engine.choiceAvailable(S, c);
      /* A choice written for one Aspect or Flaw is hidden from everyone else,
         not greyed out: there are fourteen of each, and a wall of other
         people's options would bury the ones that are yours. */
      const notMine = (c.requires?.aspect && !c.requires.aspect.includes(S.aspect)) ||
                      (c.requires?.flaw && !c.requires.flaw.includes(S.flaw));
      if (notMine) return;
      const b = document.createElement("button");
      b.className = "btn";
      b.disabled = !ok;
      const hint = shownHint(c);
      b.innerHTML = escape(c.label) + (hint ? `<span class="choice-hint">${escape(hint)}</span>` : "");
      if (ok) b.onclick = () => resolve(i);
      el.choices.appendChild(b);
    });
    renderHud();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resolve(i) {
    const out = Engine.choose(S, EV, i);
    Save.write(S);

    const parts = [];
    if (out.rollInfo) {
      const r = out.rollInfo;
      const label = Engine.statDef(r.statId)?.short ?? r.statId;
      const extra = (r.weapon ? ` + Weapon ${r.weapon}` : "") + (r.echoDie ? ` + Echo d${r.echoDie} (${r.echoRoll})` : "") +
        (r.mods ?? []).map(m => ` ${m.value < 0 ? "−" : "+"} ${escape(m.label)} ${Math.abs(m.value)}`).join("");
      parts.push(`<div class="choice-hint">${r.die} + ${label} ${r.stat}${extra} vs ${r.dc} — ${out.ok ? "success" : "failure"}</div>`);
      if (out.soaked) parts.push(`<div class="choice-hint">Armor took ${out.soaked} Vitality of it.</div>`);
    }
    if (out.text) parts.push(escape(out.text).replace(/\n/g, "<br>"));
    if (out.deltas.length) {
      parts.push(`<div class="deltas">` + out.deltas.map(d => {
        const def = Engine.statDef(d.id);
        const v = Math.round(d.d * 10) / 10;
        return `<span class="delta ${d.d > 0 ? "up" : "down"}">${def?.short ?? d.id} ${d.d > 0 ? "+" : ""}${v}</span>`;
      }).join("") + `</div>`);
    }

    el.outcome.innerHTML = parts.join("");
    el.outcome.hidden = !parts.length;
    if (out.ok === false) el.outcome.classList.add("fail");

    el.choices.innerHTML = "";
    const next = document.createElement("button");
    next.className = "btn btn-primary";
    next.textContent = S.dead ? "…" : "Continue";
    next.onclick = step;
    el.choices.appendChild(next);
    renderHud();
  }

  function step() {
    if (S.dead) return end();
    const ev = Engine.draw(S);
    Save.write(S);
    if (!ev || S.dead) return end();
    renderEvent(ev);
  }

  /* ---------- end ---------- */
  const TRIAL_TIER_NAME = { first:"First Nightmare", second:"Second Nightmare", third:"Third Nightmare", fourth:"Fourth Nightmare" };

  function buildAchievements() {
    const items = [];
    for (const t of S.trials ?? [])
      items.push({ name:`Conquered: ${t.name}`, desc:TRIAL_TIER_NAME[t.tier] ?? "Nightmare" });
    const AR = { Ascended:"far above the ordinary", Transcendent:"rare enough to be worth a clan's attention",
      Supreme:"vanishingly rare", Sacred:"a handful in recorded history",
      Divine:"canon knows of three holders, ever — greater potential, and an essence that drains as fast as it fills" };
    if (AR[S.aspectRank])
      items.push({ name:`${S.aspectRank}-Rank Aspect`, desc:`The Spell appraised the First Nightmare and ranked this Aspect ${AR[S.aspectRank]}.` });
    const lin0 = S.lineage && LINEAGES.find(l => l.id === S.lineage);
    if (lin0 && lin0.divine)
      items.push({ name:`Lineage of ${lin0.name}`, desc:"A divine lineage. Canon is explicit that this says nothing about your Aspect — and it did not." });
    if ((S.soulClass ?? 0) > 0) {
      const c = Engine.soulClass(S);
      items.push({ name:`${c.name} Class`, desc:`Formed ${c.cores} Soul Cores. Human souls are not meant to carry more than one.` });
    }
    for (const e of S.echoes ?? [])
      items.push({ name:`Echo: ${ECHOES[e].name}`, desc:ECHOES[e].desc });
    for (const [flag, a] of Object.entries(ACHIEVEMENTS))
      if (S.flags.includes(flag)) items.push(a);
    return items;
  }

  /* Pre-fills a GitHub "new issue" form with this run's details and opens it
     in a new tab. Nothing is transmitted until the player reviews it and
     clicks submit on GitHub's own page — this only builds a URL, it never
     talks to the GitHub API or holds any credential. That also means it
     needs the player to have (and log into) a GitHub account; there is no
     way to collect anonymous feedback from a static site without one. */
  function feedbackURL(kind) {
    const r = Engine.rank(S);
    const origin = Engine.ORIGINS().find(o => o.id === S.origin);
    const aspect = S.aspect && ASPECTS.find(a => a.id === S.aspect);
    const flaw = S.flaw && FLAWS.find(f => f.id === S.flaw);
    const lineage = S.lineage && LINEAGES.find(l => l.id === S.lineage);
    const lines = [
      kind === "bug"
        ? "**What happened?**\n(describe here — what you expected vs what you saw)\n"
        : "**Your thoughts?**\n(what worked, what didn't, what you'd want more of)\n",
      "---",
      `- Final rank: ${r.name} (${r.common})`,
      `- Cause: ${S.cause ?? "—"}`,
      `- Age at end: ${Engine.years(S)}`,
      `- Origin: ${origin ? origin.name : "—"}`,
      `- Aspect / Flaw: ${aspect ? aspect.name : "—"}${S.aspectRank ? ` (${S.aspectRank} rank)` : ""} / ${flaw ? flaw.name : "—"}`,
      `- Lineage: ${lineage ? lineage.name : "—"}`,
      ...(S.org ? [`- Organization: ${orgLine(S.org)}`] : []),
      `- Class: ${Engine.soulClass(S).name} (${Engine.soulClass(S).cores} cores), ${Math.round(S.fragments ?? 0)} fragments`,
      `- Echoes: ${(S.echoes ?? []).map(e => ECHOES[e].name).join(", ") || "none"}`,
      `- Decisions made: ${S.eventCount ?? S.history.length}`,
      kind === "bug" ? `- Browser: ${navigator.userAgent}` : null,
    ].filter(Boolean).join("\n");
    const title = kind === "bug" ? "[Bug] " : "[Feedback] ";
    const params = new URLSearchParams({ labels: kind, title, body: lines });
    return `${REPO_URL}/issues/new?${params.toString()}`;
  }

  function end() {
    show("end");
    const r = Engine.rank(S);
    const KIND = { nightmare:"Died in a Nightmare", gate:"Died at a Gate", dream_realm:"Died in the Dream Realm",
      hollow:"Hollow", lost:"Lost", murdered:"Murdered", war:"Killed in the war of the Domains",
      chain:"Killed by the Chain of Nightmares", age:"Died of the years", wounds:"Died of wounds",
      ascension:"Unmade on the Path" };
    const finalRankLabel = S.rank === 0 && S.chapter === "aspirant" ? "Aspirant" : (r.common === r.name ? r.name : `${r.name} · ${r.common}`);
    el.endRankName.textContent = finalRankLabel;
    renderPips(el.endRankPips, S.rank);
    el.endTitle.textContent = KIND[S.causeKind] ?? `Died ${r.common}`;
    el.endCause.textContent = S.cause ?? "The story ends here.";

    const aspect = S.aspect && ASPECTS.find(a => a.id === S.aspect);
    el.endRunes.innerHTML = STATS.map(d => runeHTML(d, S.stats[d.id] ?? 0)).join("") + aspectRuneHTML(aspect);

    const achievements = buildAchievements();
    el.endAchv.innerHTML = achievements.length
      ? achievements.map(a => `<div class="achv-chip"><b>${escape(a.name)}</b><span>${escape(a.desc)}</span></div>`).join("")
      : `<p class="achv-empty">No notable feats. A life can be that too, and most of them are.</p>`;

    const origin = Engine.ORIGINS().find(o => o.id === S.origin);
    const flaw = S.flaw ? FLAWS.find(f => f.id === S.flaw) : null;
    const lineage = S.lineage ? LINEAGES.find(l => l.id === S.lineage) : null;
    const tiles = [
      ["Age at death", Engine.years(S).toLocaleString() + " years"],
      ["Final rank", S.rank === 0 && S.chapter === "aspirant" ? "Aspirant (never Awakened)" : `${r.name} (${r.common})`],
      ["Born", origin ? origin.name : "—"],
      ["Decisions made", S.eventCount ?? S.history.length],
      ["Soul fragments", Math.round(S.fragments ?? 0).toLocaleString()],
      ["Solstice region", S.region ?? "Never reached"],
      ["Soul Cores", `${Engine.soulClass(S).name} · ${Engine.soulClass(S).cores}`],
      ["Aspect", aspect ? `${aspect.name}${S.aspectRank ? ` · ${S.aspectRank} rank` : ""} — ${aspect.desc}${aspectGift(aspect)}` : "—", "wide"],
      ["Flaw", flaw ? `${flaw.name} — ${flaw.desc} ${flawCost(flaw)}.` : "Never paid for", "wide"],
      ["Lineage", lineage ? `${lineage.name}${lineage.divine ? " · divine" : ""} — ${lineage.desc}${lineageBefore(S)}` : "—", "wide"],
      ["Memories", S.memories.length
        ? S.memories.map(m => `${MEMORIES[m].name} (${MEMORIES[m].rank} ${MEMORIES[m].type}: ${memoryEffect(m)})`).join("; ") : "None", "wide"],
      ["Echoes", (S.echoes ?? []).length
        ? S.echoes.map(e => `${ECHOES[e].name} (${ECHOES[e].rank}: ${echoEffect(e)})`).join("; ") : "None bound", "wide"],
      ...(S.echoesLost ? [["Echoes lost", `${S.echoesLost} died in your place`]] : []),
      ...(S.org ? [["Your organization", orgEpilogue(S.org), "wide"]] : []),
      ...Hooks.collect("endTiles", S),
    ];
    el.endStats.innerHTML = tiles.map(([k, v, wide]) =>
      `<div class="stat-tile${wide ? " wide" : ""}"><b>${escape(k)}</b><span>${escape(String(v))}</span></div>`).join("");
    el.endExtra.innerHTML = "";
    for (const node of Hooks.collect("endExtra", S)) el.endExtra.appendChild(node);

    el.linkBug.href = feedbackURL("bug");
    el.linkFeedback.href = feedbackURL("feedback");

    Save.clear();
  }

  /* ---------- status sheet ---------- */
  function openSheet() {
    const r = Engine.rank(S);
    const a = S.aspect && ASPECTS.find(x => x.id === S.aspect);
    const f = S.flaw && FLAWS.find(x => x.id === S.flaw);
    const line = (k, v) => `<div class="sheet-line"><span>${escape(k)}</span><span>${escape(v)}</span></div>`;

    let h = line("Soul Rank", `${r.name} · ${r.common}`);
    h += line("Age", `${Engine.years(S).toLocaleString()}`);
    h += line("Natural lifespan", r.lifespan == null ? "None" : `${r.lifespan.toLocaleString()} years`);
    const org = Engine.ORIGINS().find(o => o.id === S.origin);
    if (org) h += line("Born", org.name);
    if (S.aspectRank) h += line("Spell's appraisal", `${S.aspectRank}-rank Aspect`);
    const cl = Engine.soulClass(S);
    h += line("Class", `${cl.name} · ${cl.cores} Soul Core${cl.cores > 1 ? "s" : ""}`);
    h += line("Soul fragments", Math.round(S.fragments ?? 0).toLocaleString());
    if (S.region) h += line("Solstice", S.region);
    h += `<div class="sheet-section">Attributes</div>`;
    h += `<div class="rune-strip">${STATS.map(d => runeHTML(d, S.stats[d.id] ?? 0)).join("")}${aspectRuneHTML(a)}</div>`;
    h += `<div class="sheet-section">Aspect</div>`;
    h += a ? line(a.name, a.desc + aspectGift(a)) : line("—", "Not yet Awakened");
    h += `<div class="sheet-section">Flaw</div>`;
    h += f ? line(f.name, `${f.desc} ${flawCost(f)}.`) : line("—", "Not yet Awakened");
    const l = S.lineage && LINEAGES.find(x => x.id === S.lineage);
    h += `<div class="sheet-section">Lineage</div>`;
    h += l ? line(l.name + (l.divine ? " (divine)" : ""), l.desc + lineageBefore(S)) : line("—", "None");
    if (S.org) {
      h += `<div class="sheet-section">Your organization</div>`;
      h += line(S.org.name, orgLine(S.org));
    }
    if (S.echoes && S.echoes.length) {
      h += `<div class="sheet-section">Echoes</div>`;
      h += `<p class="sheet-note">An Echo fights beside you: +d${A.echoDie} on dangerous checks. If a fight would kill you, your strongest Echo dies in your place instead.</p>`;
      for (const e of S.echoes) h += line(`${ECHOES[e].name} · ${ECHOES[e].rank}`, `${ECHOES[e].desc} ${echoEffect(e)}.`);
    }
    if (S.memories.length) {
      h += `<div class="sheet-section">Memories</div>`;
      for (const m of S.memories) h += line(`${MEMORIES[m].name} · ${MEMORIES[m].rank} ${MEMORIES[m].type}`, `${MEMORIES[m].desc} ${memoryEffect(m)}.`);
    }
    h += Hooks.collect("sheet", S).join("");
    el.sheetBody.innerHTML = h;
    el.sheet.hidden = false;
  }

  /* ---------- guide ----------
     First-launch primer, asked for in player feedback: the stat system was
     liked but hard to read. Shown once (flag kept outside the save, like the
     theme, so finishing or abandoning a life never re-triggers it) and
     reopenable from Home and the in-game toolbar. Stat and rank text is
     generated from STATS/RANKS so the guide cannot drift from the data. */
  const GUIDE_KEY = "fatelegacy.guideSeen";
  const GUIDE = [
    { title:"The Spell chose you", body:() => `
      <p>You have been infected by the Nightmare Spell. Until you survive your
      <b>First Nightmare</b> you are only an <em>Aspirant</em>.</p>
      <p>Each game is <b>one life</b>. Survive, Awaken, and climb the
      <b>Soul Ranks</b> for as long as you can — most lives end early, and
      that is part of the story.</p>
      <p>Your <b>Origin</b> is the difficulty setting: the Outskirts are hard,
      a Great Clan is gentle.</p>` },
    { title:"Choices and rolls", body:() => `
      <p>Every event offers choices. Some are plain decisions; others are
      <b>checks</b> against one of your attributes. By default the game
      doesn't tell you which: pick what your character would do, and judge
      from the situation.</p>
      <p class="guide-formula">d10 &nbsp;+&nbsp; attribute &nbsp;≥&nbsp; difficulty</p>
      <p>The result shows the exact roll, e.g. <span class="guide-code">7 + WIL 6 vs 12 — success</span>.
      Missing <b>badly</b> on a dangerous check can kill you outright.</p>
      <p>Prefer to see the attribute before choosing? Turn on <b>Stat hints</b>
      from the home screen or the Status page.</p>
      <p>Greyed-out choices need something you don't have yet. Difficulty rises
      with your rank <i>and</i> with the years you've lived — staying put is
      never perfectly safe.</p>` },
    { title:"Your runes", body:() => `
      <p>Your attributes, as the Spell writes them. Higher is better; changes
      appear in green or red after each choice.</p>
      <div class="guide-runes">${STATS.map(d => `
        <div class="guide-rune">
          <span class="rune"><span class="rune-glyph">${GLYPH[d.id] ?? "●"}</span><span class="rune-label">${escape(d.short)}</span></span>
          <span><b>${escape(d.name)}</b>${d.hud ? "" : ` <span class="guide-tag">More runes</span>`}<br>${escape(d.desc)}</span>
        </div>`).join("")}
      </div>
      <p class="guide-note">Runes tagged <i>More runes</i> sit behind <b>More runes ▾</b> under the HUD.
      Hover a rune (or open Status) to see its meaning again.</p>` },
    { title:"Rank, lifespan, Aspect", body:() => `
      <p>The <b>badge</b> top-left is your Soul Rank, the dots its place on the
      ladder: ${RANKS.map(r => escape(r.common)).join(" → ")}.</p>
      <p>The thin <b>bar</b> under it is your remaining lifespan. Each rank lives
      far longer — but years pass faster the higher you climb, and your
      <b>Tether</b> to the waking world thins.</p>
      <p>You carry an <b>Aspect</b> (your power) from the start; survive the
      First Nightmare and the Spell adds a <b>Flaw</b>, its price: a permanent
      penalty to some runes, shaped by how you played. Tap the gold Aspect
      rune to read both.
      Later you may gain Memories, Echoes, and more Soul Cores.</p>
      <p><b>Memories</b> give permanent bonuses; in a fight a Weapon also helps
      your roll and Armor softens a failed one. An <b>Echo</b> gives bonuses,
      fights beside you (+d${Engine.AID.echoDie} in a fight), and dies in your place once if
      a fight would kill you. Status lists exactly what each one gives.</p>` },
    { title:"Status, saves, the end", body:() => `
      <p><b>Status</b> (bottom of the screen) opens your full Spell status page:
      Aspect, Flaw, Lineage, Memories, Echoes.</p>
      <p>The game <b>saves automatically</b> after every choice — close the tab
      and <i>Continue</i> from the home screen.</p>
      <p>When the life ends you'll see how far you got, what you achieved, and
      links to report a bug or leave feedback. Then begin again: every life
      draws a different Nightmare, Aspect and fate.</p>
      <p class="guide-note">This guide is always available from <b>Guide</b> in the
      toolbar or <b>How to play</b> on the home screen.</p>` },
  ];
  let guidePage = 0;

  function renderGuide() {
    const p = GUIDE[guidePage], last = guidePage === GUIDE.length - 1;
    el.guideStep.textContent = `How to play · ${guidePage + 1} / ${GUIDE.length}`;
    el.guideTitle.textContent = p.title;
    el.guideBody.innerHTML = p.body();
    el.guideDots.innerHTML = GUIDE.map((_, i) => `<i class="${i === guidePage ? "on" : ""}"></i>`).join("");
    el.guideBack.hidden = guidePage === 0;
    el.guideSkip.hidden = last;
    el.guideNext.textContent = last ? "Begin" : "Next";
    el.guideBody.scrollTop = 0;
    el.guide.querySelector(".sheet").scrollTop = 0;
  }

  function openGuide() {
    guidePage = 0;
    renderGuide();
    el.guide.hidden = false;
    el.guideNext.focus();
  }

  function closeGuide() {
    el.guide.hidden = true;
    try { localStorage.setItem(GUIDE_KEY, "1"); } catch (e) {}
  }

  el.guideNext.onclick = () => {
    if (guidePage === GUIDE.length - 1) return closeGuide();
    guidePage++; renderGuide();
  };
  el.guideBack.onclick = () => { if (guidePage > 0) { guidePage--; renderGuide(); } };
  el.guideSkip.onclick = closeGuide;
  el.guide.onclick = e => { if (e.target === el.guide) closeGuide(); };
  addEventListener("keydown", e => {
    if (el.guide.hidden) return;
    if (e.key === "Escape") closeGuide();
    else if (e.key === "ArrowRight") el.guideNext.click();
    else if (e.key === "ArrowLeft") el.guideBack.click();
  });
  $("btn-guide-home").onclick = openGuide;
  $("btn-guide-game").onclick = openGuide;

  /* ---------- boot ---------- */
  function chooseOrigin() {
    show("origin");
    el.originList.innerHTML = "";
    for (const o of Engine.ORIGINS()) {
      const b = document.createElement("button");
      b.className = "btn";
      b.innerHTML = escape(o.name) + `<span class="choice-hint">${escape(o.desc)}</span>`;
      b.onclick = () => startNew(o.id);
      el.originList.appendChild(b);
    }
  }

  function startNew(originId) {
    S = Engine.newRun(originId);
    show("game");
    step();
  }

  function resume(state) {
    S = Engine.migrate(state);
    show("game");
    const ev = S.current && Engine.eventById(S.current);
    if (ev) renderEvent(ev); else step();
  }

  function escape(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  }

  el.btnNew.onclick = () => {
    if (Save.read() && !confirm("Start a new life? Your current one is lost.")) return;
    chooseOrigin();
  };
  el.btnAgain.onclick = chooseOrigin;
  el.btnSheet.onclick = openSheet;
  el.btnSheetClose.onclick = () => el.sheet.hidden = true;
  el.sheet.onclick = e => { if (e.target === el.sheet) el.sheet.hidden = true; };
  el.btnQuit.onclick = () => {
    if (!confirm("Abandon this life?")) return;
    Save.clear(); show("home"); boot();
  };

  function setPanel(open) {
    el.panel.hidden = !open;
    el.expand.setAttribute("aria-expanded", String(open));
    el.expandLabel.textContent = open ? "Fewer runes ▴" : "More runes ▾";
  }
  el.expand.onclick = () => setPanel(el.panel.hidden);
  // Tapping the Aspect rune opens the panel where its text is written out.
  el.runes.onclick = e => { if (e.target.closest("[data-aspect]")) setPanel(true); };

  /* Day mode. Persisted separately from the save — it is a display
     preference, not part of any life. Set in <head> too, so the very
     first paint already matches (see index.html), and re-applied here so
     the toggle works instantly without a reload. */
  function applyTheme(light) {
    document.documentElement.dataset.theme = light ? "light" : "";
    document.querySelector('meta[name="theme-color"]').content = light ? "#f6f3ec" : "#0a0a0f";
    el.themeToggle.textContent = light ? "☀" : "☾";
    try { localStorage.setItem("fatelegacy.theme", light ? "light" : "dark"); } catch (e) {}
  }
  el.themeToggle.onclick = () => applyTheme(document.documentElement.dataset.theme !== "light");
  applyTheme(document.documentElement.dataset.theme === "light");

  /* Flush on the way out — mobile users leave by switching tabs. */
  addEventListener("visibilitychange", () => { if (document.hidden && S && !S.dead) Save.write(S); });
  addEventListener("beforeunload", () => { if (S && !S.dead) Save.write(S); });

  function boot() {
    const box = Save.read();
    if (box && box.state && !box.state.dead) {
      el.btnContinue.hidden = false;
      el.btnContinue.onclick = () => resume(box.state);
      const r = RANKS[box.state.rank];
      el.saveInfo.textContent = `A life in progress — ${r.common}, age ${Math.floor(box.state.ageDays / Engine.DAYS_PER_YEAR).toLocaleString()}.`;
    } else {
      el.btnContinue.hidden = true;
      el.saveInfo.textContent = "";
    }
  }
  boot();
  Hooks.emit("home", el.homeExtra);

  let guideSeen = false;
  try { guideSeen = localStorage.getItem(GUIDE_KEY) === "1"; } catch (e) {}
  if (!guideSeen) openGuide();
})();
