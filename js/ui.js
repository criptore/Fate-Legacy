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
    rank:$("hud-rank"), age:$("hud-age"), life:$("hud-life"), meters:$("hud-meters"),
    title:$("event-title"), text:$("event-text"), outcome:$("outcome"), choices:$("choices"),
    sheet:$("sheet"), sheetBody:$("sheet-body"),
    btnSheet:$("btn-sheet"), btnSheetClose:$("btn-sheet-close"),
    btnQuit:$("btn-quit"), btnAgain:$("btn-again"),
    endTitle:$("end-title"), endCause:$("end-cause"), endStats:$("end-stats"),
  };

  let S = null;         // current run state
  let EV = null;        // event on screen

  /* ---------- screens ---------- */
  function show(name) {
    for (const k of ["home","origin","game","end"]) el[k].hidden = (k !== name);
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

    const span = Engine.lifespanYears(S);
    el.age.textContent = span == null
      ? `Age ${Engine.years(S).toLocaleString()} · unbound`
      : `Age ${Engine.years(S).toLocaleString()} / ${span.toLocaleString()}`;
    el.life.style.width = (Engine.lifeRemaining(S) * 100).toFixed(1) + "%";

    el.meters.innerHTML = "";
    for (const d of STATS.filter(x => x.hud)) {
      const m = document.createElement("span");
      m.className = "meter";
      m.title = d.desc;
      m.innerHTML = `${d.short}<b>${Math.floor(S.stats[d.id] ?? 0)}</b>`;
      el.meters.appendChild(m);
    }
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
  function end() {
    show("end");
    const r = Engine.rank(S);
    const KIND = { nightmare:"Died in a Nightmare", gate:"Died at a Gate", dream_realm:"Died in the Dream Realm",
      hollow:"Hollow", lost:"Lost", murdered:"Murdered", war:"Killed in the war of the Domains",
      chain:"Killed by the Chain of Nightmares", age:"Died of the years", wounds:"Died of wounds",
      ascension:"Unmade on the Path" };
    el.endTitle.textContent = KIND[S.causeKind] ?? `Died ${r.common}`;
    el.endCause.textContent = S.cause ?? "The story ends here.";
    const origin = Engine.ORIGINS().find(o => o.id === S.origin);
    const rows = [
      ["Age at death", Engine.years(S).toLocaleString() + " years"],
      ["Final rank", S.rank === 0 && S.chapter === "aspirant" ? "Aspirant (never Awakened)" : `${r.name} (${r.common})`],
      ["Born", origin ? origin.name : "—"],
      ["Aspect", S.aspect ? ASPECTS.find(a => a.id === S.aspect).name + (S.aspectGrade ? ` · ${S.aspectGrade} grade` : "") : "—"],
      ["Flaw", S.flaw ? FLAWS.find(f => f.id === S.flaw).name : "Never paid for"],
      ["Solstice", S.region ?? "Never reached the Dream Realm"],
      ["Trials conquered", (S.trials ?? []).length ? S.trials.map(t => t.name).join(", ") : "None"],
      ["Memories", S.memories.length ? S.memories.map(m => MEMORIES[m].name).join(", ") : "None"],
      ["Soul fragments", Math.round(S.fragments ?? 0).toLocaleString()],
      ["Decisions", S.eventCount ?? S.history.length],
    ];
    el.endStats.innerHTML = rows.map(([k, v]) => `<div><span>${escape(k)}</span><span>${escape(String(v))}</span></div>`).join("");
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
    for (const d of STATS) h += line(d.name, String(Math.floor(S.stats[d.id] ?? 0)));
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
