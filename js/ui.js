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
    endAchv:$("end-achv"), endStats:$("end-stats"),
    linkBug:$("link-bug"), linkFeedback:$("link-feedback"),
    themeToggle:$("theme-toggle"),
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
    return `<span class="rune rune-aspect" title="${escape(aspect.name)} — ${escape(aspect.desc)}">
      <span class="rune-glyph">✧</span>
      <span class="rune-name">${escape(aspect.name)}</span>
      <span class="rune-label">Aspect</span>
    </span>`;
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
    el.flawLine.textContent = flaw ? `Flaw — ${flaw.name}: ${flaw.desc}` : "";
  }

  /* ---------- event ---------- */
  function renderEvent(ev) {
    EV = ev;
    el.outcome.hidden = true;
    el.outcome.className = "outcome";
    el.title.textContent = ev.title ?? "";
    el.text.textContent = ev.text ?? "";
    el.choices.innerHTML = "";

    ev.choices.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "btn";
      const ok = Engine.choiceAvailable(S, c);
      b.disabled = !ok;
      b.innerHTML = escape(c.label) + (c.hint ? `<span class="choice-hint">${escape(c.hint)}</span>` : "");
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
      parts.push(`<div class="choice-hint">${r.die} + ${label} ${r.stat} vs ${r.dc} — ${out.ok ? "success" : "failure"}</div>`);
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
    if (S.aspectGrade === "Ascended" || S.aspectGrade === "Transcendent")
      items.push({ name:`${S.aspectGrade}-Grade Aspect`, desc:"The Spell's appraisal of the First Nightmare ranked this Aspect far above the ordinary." });
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
    const lines = [
      kind === "bug"
        ? "**What happened?**\n(describe here — what you expected vs what you saw)\n"
        : "**Your thoughts?**\n(what worked, what didn't, what you'd want more of)\n",
      "---",
      `- Final rank: ${r.name} (${r.common})`,
      `- Cause: ${S.cause ?? "—"}`,
      `- Age at end: ${Engine.years(S)}`,
      `- Origin: ${origin ? origin.name : "—"}`,
      `- Aspect / Flaw: ${aspect ? aspect.name : "—"} / ${flaw ? flaw.name : "—"}`,
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
    const tiles = [
      ["Age at death", Engine.years(S).toLocaleString() + " years"],
      ["Final rank", S.rank === 0 && S.chapter === "aspirant" ? "Aspirant (never Awakened)" : `${r.name} (${r.common})`],
      ["Born", origin ? origin.name : "—"],
      ["Decisions made", S.eventCount ?? S.history.length],
      ["Soul fragments", Math.round(S.fragments ?? 0).toLocaleString()],
      ["Solstice region", S.region ?? "Never reached"],
      ["Aspect", aspect ? `${aspect.name}${S.aspectGrade ? ` · ${S.aspectGrade} grade` : ""} — ${aspect.desc}` : "—", "wide"],
      ["Flaw", flaw ? `${flaw.name} — ${flaw.desc}` : "Never paid for", "wide"],
      ["Memories", S.memories.length ? S.memories.map(m => MEMORIES[m].name).join(", ") : "None", "wide"],
    ];
    el.endStats.innerHTML = tiles.map(([k, v, wide]) =>
      `<div class="stat-tile${wide ? " wide" : ""}"><b>${escape(k)}</b><span>${escape(String(v))}</span></div>`).join("");

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
    if (S.aspectGrade) h += line("Spell's appraisal", `${S.aspectGrade} grade Aspect`);
    if (S.region) h += line("Solstice", S.region);
    h += `<div class="sheet-section">Attributes</div>`;
    h += `<div class="rune-strip">${STATS.map(d => runeHTML(d, S.stats[d.id] ?? 0)).join("")}${aspectRuneHTML(a)}</div>`;
    h += `<div class="sheet-section">Aspect</div>`;
    h += a ? line(a.name, a.desc) : line("—", "Not yet Awakened");
    h += `<div class="sheet-section">Flaw</div>`;
    h += f ? line(f.name, f.desc) : line("—", "Not yet Awakened");
    if (S.memories.length) {
      h += `<div class="sheet-section">Memories</div>`;
      for (const m of S.memories) h += line(MEMORIES[m].name, MEMORIES[m].desc);
    }
    el.sheetBody.innerHTML = h;
    el.sheet.hidden = false;
  }

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
    S = state;
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

  el.expand.onclick = () => {
    const open = el.panel.hidden;
    el.panel.hidden = !open;
    el.expand.setAttribute("aria-expanded", String(open));
    el.expandLabel.textContent = open ? "Fewer runes ▴" : "More runes ▾";
  };

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
})();
