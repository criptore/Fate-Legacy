/* =============================================================
   MODULE — THE CHRONICLE
   Every life writes its own history as it goes: the day you were
   born, the Nightmares you entered and the ones you conquered, the
   Memories and Echoes that came to you, the times you lived by a
   hair, and how it ended. The end screen shows it as a timeline and
   lets you copy or download it as plain text, to keep or to share.

   It reads the state after each choice and writes down what changed,
   so it needs nothing from the packs and records their content too.
   It also gives the life an epithet, the name the world remembers it
   by, chosen from how it was lived.

   State: s.chronicle = [{ y, t }]   (age in years, text)
          s._chron     = snapshot of the last state it compared
   See docs/content/chronicle.md.
   ============================================================= */
(() => {
  const CAP = 120;

  function snap(s) {
    return {
      rank: s.rank, flaw: s.flaw, lineage: s.lineage, region: s.region,
      memories: [...(s.memories ?? [])], echoes: [...(s.echoes ?? [])],
      trials: (s.trials ?? []).length, trial: s.currentTrial?.id ?? null,
      flags: [...(s.flags ?? [])], org: !!s.org, cls: s.soulClass ?? 0,
    };
  }

  function write(s, t) {
    s.chronicle ??= [];
    if (s.chronicle.length >= CAP) s.chronicle.splice(1, 1);   // keep the birth line
    s.chronicle.push({ y: Engine.years(s), t });
  }

  const rankLabel = i => { const r = RANKS[i]; return r.common === r.name ? r.name : `${r.name} (${r.common})`; };
  const lineageName = id => LINEAGES.find(l => l.id === id)?.name ?? id;

  function diff(s, out, ev) {
    const a = s._chron ?? snap(s), b = snap(s);
    /* The Aspect is rolled at birth but only revealed with the Flaw, after
       the First Nightmare, so that is when the chronicle names it. */
    if (b.flaw && !a.flaw) {
      const asp = ASPECTS.find(x => x.id === s.aspect);
      write(s, `The Spell named the Aspect: ${asp?.name ?? "unknown"}. Its price, the Flaw: ${FLAWS.find(f => f.id === b.flaw)?.name ?? b.flaw}.`);
    }
    if (b.region && b.region !== a.region) write(s, `Woke in the Dream Realm, in ${b.region}.`);
    if (b.trial && b.trial !== a.trial) write(s, `Entered a Nightmare: ${s.currentTrial.name}.`);
    if (b.trials > a.trials) for (const t of s.trials.slice(a.trials)) write(s, `Conquered ${t.name}.`);
    if (b.rank > a.rank) for (let r = a.rank + 1; r <= b.rank; r++) write(s, `Became ${rankLabel(r)}.`);
    if (b.lineage !== a.lineage && b.lineage && b.lineage !== "none") write(s, a.lineage
      ? `The blood changed. Lineage rewritten: ${lineageName(b.lineage)}.`
      : `Lineage: ${lineageName(b.lineage)}.`);
    for (const m of b.memories) if (!a.memories.includes(m) && MEMORIES[m]) write(s, `Received a Memory: ${MEMORIES[m].name}.`);
    for (const e of b.echoes) if (!a.echoes.includes(e) && ECHOES[e]) write(s, `Bound an Echo: ${ECHOES[e].name}.`);
    if (out?.echoLost) write(s, `${ECHOES[out.echoLost].name} died in your place.`);
    if (b.cls > a.cls) write(s, `Formed a new Soul Core: ${Engine.soulClass(s).name} Class.`);
    if (b.org && !a.org && s.org) write(s, `Founded ${s.org.name}.`);
    for (const f of b.flags) if (!a.flags.includes(f) && ACHIEVEMENTS[f]) write(s, `${ACHIEVEMENTS[f].name}. ${ACHIEVEMENTS[f].desc}`);
    /* A deadly roll passed by one or two points is the kind of day people
       remember. */
    const ri = out?.rollInfo;
    if (ri && out.ok && ri.margin <= 1 && ev && ev.choices.some(c => c.check?.fatal != null))
      write(s, `Lived through "${ev.title}" by ${ri.margin === 0 ? "nothing at all" : "a single breath"}.`);
    s._chron = b;
  }

  Hooks.on("newRun", s => {
    s.chronicle = [];
    const o = ORIGINS.find(x => x.id === s.origin);
    write(s, `Born${o ? `: ${o.name}` : ""}.${s.lineage && s.lineage !== "none" ? ` Lineage: ${lineageName(s.lineage)}.` : ""}`);
    s._chron = snap(s);
  });

  Hooks.on("choose", (s, ev, c, out) => {
    if (!s.chronicle) {   // a life saved before this module existed
      s.chronicle = [];
      write(s, "The chronicle begins late. What came before was not written down.");
    }
    if (!s.dead) diff(s, out, ev);
  });

  Hooks.on("death", s => {
    if (!s.chronicle) return;
    diff(s, null, null);
    write(s, s.cause ?? "The story ends here.");
  });

  /* ---------- the epithet ---------- */
  const BY_STAT = { vitality: "the Unbroken", willpower: "the Unbending", cunning: "the Quiet Knife",
    perception: "Who Saw It Coming", essence: "the Deep-Souled", renown: "the Well-Known" };
  const BY_KIND = { age: "Who Outlived Everyone", hollow: "the Hollowed", lost: "Who Never Came Back",
    murdered: "the Betrayed", woven: "Author of a Law", beyond: "Who Stepped Over The Edge" };

  function epithet(s) {
    if (BY_KIND[s.causeKind] && s.rank >= 1) return BY_KIND[s.causeKind];
    if ((s.echoesLost ?? 0) >= 2) return "the Many-Times Spared";
    if ((s.trials ?? []).length >= 4) return "Breaker of Nightmares";
    if (s.org && s.org.size >= 4) return "Founder";
    if (s.rank === 0) return s.chapter === "aspirant" ? "Who Never Woke" : "the Sleeper";
    const top = STATS.filter(d => BY_STAT[d.id]).sort((x, y) => (s.stats[y.id] ?? 0) - (s.stats[x.id] ?? 0))[0];
    return BY_STAT[top?.id] ?? "the Remembered";
  }

  function asText(s) {
    const r = RANKS[s.rank];
    const head = [`FATE LEGACY — A CHRONICLE`, `${r.name}, ${epithet(s)}`, ""];
    const lines = (s.chronicle ?? []).map(e => `Age ${String(e.y).padStart(5)}  ${e.t}`);
    return head.concat(lines).join("\n") + "\n";
  }

  /* ---------- UI ---------- */
  Hooks.on("sheet", S => {
    const list = (S.chronicle ?? []).slice(-5);
    if (!list.length) return null;
    return `<div class="sheet-section">Chronicle, lately</div>` + list.map(e =>
      `<div class="sheet-line"><span>Age ${e.y}</span><span>${esc(e.t)}</span></div>`).join("");
  });

  Hooks.on("endTiles", S => S.chronicle ? [["Remembered as", epithet(S)]] : null);

  Hooks.on("endExtra", S => {
    if (!S.chronicle?.length) return null;
    const box = document.createElement("section");
    box.className = "chron";
    box.innerHTML = `<h3 class="end-section-title">Chronicle</h3>
      <ol class="chron-list">${S.chronicle.map(e =>
        `<li><b>${e.y}</b><span>${esc(e.t)}</span></li>`).join("")}</ol>
      <div class="chron-actions">
        <button class="btn" type="button" data-act="copy">Copy as text</button>
        <button class="btn" type="button" data-act="save">Download .txt</button>
      </div>`;
    const text = asText(S);
    box.querySelector('[data-act="copy"]').onclick = async ev => {
      try { await navigator.clipboard.writeText(text); ev.target.textContent = "Copied"; }
      catch { ev.target.textContent = "Copy failed"; }
    };
    box.querySelector('[data-act="save"]').onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = `fate-legacy-chronicle-${Date.now()}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    return box;
  });

  const esc = v => String(v).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  Hooks.on("home", () => {
    if (document.getElementById("chron-style")) return;
    const st = document.createElement("style");
    st.id = "chron-style";
    st.textContent = `
      .chron{text-align:left}
      .chron-list{list-style:none;margin:0 0 12px 6px;padding:0;border-left:1px solid var(--line)}
      .chron-list li{position:relative;display:flex;gap:10px;padding:5px 0 5px 14px;font-size:14px;line-height:1.45;color:var(--ink)}
      .chron-list li::before{content:"";position:absolute;left:-4px;top:12px;width:7px;height:7px;border-radius:50%;background:var(--accent)}
      .chron-list b{flex:0 0 3em;text-align:right;font:12px/1.9 ui-sans-serif,system-ui,sans-serif;color:var(--ink-faint);font-variant-numeric:tabular-nums}
      .chron-list span{flex:1;min-width:0;overflow-wrap:anywhere}
      .chron-actions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
      .chron-actions .btn{flex:1 1 140px;text-align:center}`;
    document.head.appendChild(st);
  });

  /* tools/ can read the text export without a DOM. */
  Pack.add({ id: "chronicle" });
  globalThis.Chronicle = { asText, epithet };
})();
