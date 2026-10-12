/* =============================================================
   MODULE — ASPECT ABILITIES
   Canon gives an Aspect a ladder of Abilities: a Dormant Ability
   from the First Nightmare, an Awakened one, an Ascended one from
   the Second Nightmare ("Ascension grants a third Aspect Ability"),
   and a Transformation at Transcendence (wiki: Aspect Ability,
   Category:Master). Advanced abilities cost Soul Essence; canon
   gives no per-ability numbers.

   Here, each unlocked Ability is a button above the choices. Arming
   one costs Essence when the next roll in that event is made, and
   adds to that roll: its full bonus if the roll uses one of the
   Aspect's own attributes, +1 otherwise. Personal trials (`dcSelf`)
   measure you, Aspect included, so they only take +1. One Ability
   per event. Names, bonuses and costs are ours; none copies a canon
   character's Ability. See docs/content/aspect-abilities.md.
   ============================================================= */
(() => {
  const TIERS = [
    { id:"dormant",   rank:0, label:"Dormant",        bonus:2, cost:1 },
    { id:"awakened",  rank:1, label:"Awakened",       bonus:3, cost:1 },
    { id:"ascended",  rank:2, label:"Ascended",       bonus:4, cost:2 },
    { id:"transform", rank:3, label:"Transformation", bonus:6, cost:4 },
  ];

  /* Four names per Aspect, one per tier. */
  const NAMES = {
    shadow:  ["Unlit Step", "Second Silhouette", "Where The Light Isn't", "The Long Dusk"],
    ember:   ["Banked Coal", "Kindling Hand", "Wildfire Pulse", "Pyre-Shape"],
    thorn:   ["Barbed Skin", "Bloodbriar", "Thicket Wall", "The Bramble Crown"],
    echo:    ["Half-Heard", "The Moment Before", "Rewound Breath", "Choir Of What Was"],
    tide:    ["Undertow", "Ebb and Return", "Riptide Stance", "The Drowned Moon"],
    iron:    ["Hard Grain", "Anvil Stance", "Unbending", "Living Bulwark"],
    lantern: ["Lamplight", "Shown Plainly", "Revelation", "The Bright Witness"],
    quarry:  ["Scent-Break", "False Trail", "The Hunter's Blind Spot", "Prey Ascendant"],
    salt:    ["Preserve", "Brine Ward", "Keeping Hand", "The White Shore"],
    ledger:  ["Tally", "What Is Owed", "Settling Accounts", "The Final Column"],
    hearth:  ["Warm Room", "Gathering Calm", "Hearthguard", "The Open Door"],
    gate:    ["Ajar", "Threshold", "Held Open", "The Door In Your Chest"],
    harrow:  ["Turned Earth", "Unburied", "Furrow-Line", "The Ploughed Field"],
    verdict: ["Decided", "Sentence", "Final Word", "The Closing Gavel"],
  };

  const aspectOf = s => ASPECTS.find(a => a.id === s.aspect);

  /* Canon: no Ability before the Flaw. Aspirants carry an Aspect "without the
     Flaw or Aspect Ability". */
  function unlocked(s) {
    if (!s.aspect || !s.flaw) return [];
    return TIERS.filter(t => s.rank >= t.rank).map((t, i) => ({ ...t, name: NAMES[s.aspect]?.[i] ?? `${t.label} Ability` }));
  }

  function bonusFor(s, tier, c) {
    if (c.check?.dcSelf) return 1;
    const own = Object.keys(aspectOf(s)?.stats ?? {});
    return own.includes(c.check?.stat) ? tier.bonus : 1;
  }

  Hooks.on("draw", s => { s.armed = null; });

  Hooks.on("checkMods", (s, c) => {
    if (!s.armed) return null;
    const tier = unlocked(s).find(t => t.id === s.armed);
    s.armed = null;
    if (!tier || (s.stats.essence ?? 0) < tier.cost) return null;
    s.stats.essence -= tier.cost;
    s.abilityUses = (s.abilityUses ?? 0) + 1;
    return { label: tier.name, value: bonusFor(s, tier, c) };
  });

  /* ---------- UI ---------- */
  Hooks.on("choiceBar", (S, ev) => {
    if (S.dead || !ev.choices.some(c => c.check)) return null;
    const list = unlocked(S);
    if (!list.length) return null;
    const bar = document.createElement("div");
    bar.className = "ability-bar";
    const own = Object.keys(aspectOf(S)?.stats ?? {}).map(id => Engine.statDef(id)?.short ?? id).join("/");
    const head = document.createElement("div");
    head.className = "ability-head";
    head.textContent = `Aspect Abilities · full bonus on ${own} rolls`;
    bar.appendChild(head);
    for (const t of list) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ability" + (S.armed === t.id ? " armed" : "");
      const afford = (S.stats.essence ?? 0) >= t.cost;
      b.disabled = !afford;
      b.innerHTML = `<span class="ability-name">${t.name}</span><span class="ability-meta">${t.label} · +${t.bonus} · ${t.cost} ESS</span>`;
      b.onclick = () => {
        S.armed = S.armed === t.id ? null : t.id;
        for (const x of bar.querySelectorAll(".ability")) x.classList.remove("armed");
        if (S.armed) b.classList.add("armed");
      };
      bar.appendChild(b);
    }
    return bar;
  });

  Hooks.on("sheet", S => {
    const list = unlocked(S);
    if (!list.length) return null;
    return `<div class="sheet-section">Aspect Abilities</div>` + list.map(t =>
      `<div class="sheet-line"><span>${t.name}</span><span>${t.label} · +${t.bonus} on your Aspect's rolls (+1 otherwise) · ${t.cost} ESS</span></div>`).join("");
  });

  Hooks.on("endTiles", S => S.abilityUses ? [["Aspect Abilities used", S.abilityUses]] : null);

  /* Styles live with the module; injected once the page exists. */
  Hooks.on("home", () => {
    if (document.getElementById("ability-style")) return;
    const st = document.createElement("style");
    st.id = "ability-style";
    st.textContent = `
      .ability-bar{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
      .ability-head{width:100%;font:11px/1.4 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-2,var(--ink-faint))}
      .ability{flex:1 1 140px;text-align:left;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:transparent;color:var(--ink);cursor:pointer;font:13px/1.3 ui-sans-serif,system-ui,sans-serif}
      .ability:disabled{opacity:.4;cursor:not-allowed}
      .ability.armed{border-color:var(--accent-2,var(--accent));box-shadow:0 0 0 1px var(--accent-2,var(--accent)) inset}
      .ability-name{display:block;font-weight:600}
      .ability-meta{display:block;font-size:11px;color:var(--ink-faint);margin-top:2px}`;
    document.head.appendChild(st);
  });
})();
