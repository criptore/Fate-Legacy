/* =============================================================
   MODULE — THE RIVAL
   Someone else made it out of the solstice the same winter you did,
   and they will be in your life for as long as both of you live.

   Canon gives the motive and the templates: killing an Awakened
   yields part of their soul fragments ("zero if inexperienced or
   [over] a hundred if fully saturated", wiki), Legacy scions and
   fragment-hungry independents feud in the Dream Realm, and duels
   between Awakened happen. The rival is always an original
   character, never a canon one. Everything here is ours.

   State: s.rival = { name, aspect, rank, standing, alive, fate }
   - standing runs from -3 (would kill you) to +3 (would die for you)
   - their rank climbs on its own, roughly in step with yours
   Placeholders in event text: {rival}, {rivalAspect}, {rivalRank}.
   See docs/content/rival.md.
   ============================================================= */
(() => {
  const NAMES = ["Kael Vantrice", "Ines Marrow", "Oren Calloway", "Sable Ruiz", "Tavi Okonkwo",
    "Mirela Hask", "Jun Ashby", "Rook Delacroix", "Petra Vael", "Idris Lorne", "Nadia Corve", "Emre Solace"];
  const BACKGROUNDS = [
    "a Legacy scion with a clan's training and a clan's expectations",
    "an outskirts kid who has never once been given anything",
    "a citadel prodigy who has been told they are special since they were six",
  ];

  const R = s => s.rival;
  const alive = s => !!(s.rival && s.rival.alive);
  const rankName = r => RANKS[Math.min(r, RANKS.length - 1)].common;
  const standingWord = st => st <= -3 ? "would kill you" : st <= -1 ? "rival" : st === 0 ? "wary" : st <= 2 ? "something like a friend" : "would die for you";

  function syncFlags(s) {
    const r = s.rival, f = s.flags;
    const set = (flag, on) => { const i = f.indexOf(flag); if (on && i < 0) f.push(flag); if (!on && i >= 0) f.splice(i, 1); };
    set("rival_alive", alive(s));
    set("rival_hostile", alive(s) && r.standing <= -2);
    set("rival_friend", alive(s) && r.standing >= 2);
    set("rival_ahead", alive(s) && r.rank > s.rank);
  }

  function create(s) {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const others = ASPECTS.filter(a => a.id !== s.aspect);
    s.rival = { name: pick(NAMES), aspect: pick(others).name, background: pick(BACKGROUNDS),
                rank: 1, standing: -1, alive: true, fate: null };
    syncFlags(s);
  }

  /* Not every life has a rival. The first meeting is an ordinary event in
     the Awakened pool, and the rival only exists once it is drawn. */
  Hooks.on("draw", (s, ev) => {
    if (!s.rival && ev.id === "rv_meet") create(s);
    if (s.rival) syncFlags(s);
  });

  /* fx.rival: { standing:+n, kill:true, spare:true, die:"text" } */
  Hooks.on("effects", (s, fx, deltas) => {
    const r = s.rival;
    if (r && fx.rank && r.alive && r.rank <= s.rank && Math.random() < 0.6) r.rank = Math.min(r.rank + 1, 5);
    if (!fx.rival || !r) return;
    if (fx.rival.standing) r.standing = Math.max(-3, Math.min(3, r.standing + fx.rival.standing));
    if (fx.rival.climb && r.alive) r.rank = Math.min(r.rank + 1, 5);
    if (fx.rival.kill && r.alive) {
      r.alive = false; r.fate = `Killed by you, as ${rankName(r.rank)}.`;
      if (!s.flags.includes("killed_rival")) s.flags.push("killed_rival");
    }
    if (fx.rival.die && r.alive) { r.alive = false; r.fate = fx.rival.die; }
    syncFlags(s);
  });

  Hooks.on("text", (str, s) => !str || !s?.rival ? str : str
    .replace(/\{rival\}/g, s.rival.name)
    .replace(/\{rivalAspect\}/g, s.rival.aspect)
    .replace(/\{rivalBackground\}/g, s.rival.background)
    .replace(/\{rivalRank\}/g, rankName(s.rival.rank)));

  /* Choice labels go through the UI, not the engine, so placeholders in
     them are filled here, once per draw. */
  Hooks.on("draw", (s, ev) => {
    if (!s.rival || !ev.id.startsWith("rv_")) return;
    ev._title = ev._title ?? ev.title;
    ev.title = Hooks.reduce("text", ev._title, s);
    for (const c of ev.choices) {
      c._label = c._label ?? c.label;
      c.label = Hooks.reduce("text", c._label, s);
    }
  });

  /* A death's cause is written straight from the check, so fill it here. */
  Hooks.on("death", s => { if (s.rival && s.cause) s.cause = Hooks.reduce("text", s.cause, s); });

  Hooks.on("sheet", S => {
    const r = S.rival; if (!r) return null;
    return `<div class="sheet-section">Rival</div><div class="sheet-line"><span>${r.name}</span><span>${r.alive
      ? `${rankName(r.rank)} · Aspect of ${r.aspect} · ${standingWord(r.standing)}`
      : `Dead. ${r.fate ?? ""}`}</span></div>`;
  });

  Hooks.on("endTiles", S => {
    const r = S.rival; if (!r) return null;
    return [["Your rival", r.alive
      ? `${r.name} outlived you, as ${rankName(r.rank)}. At the end they were ${standingWord(r.standing)}.`
      : `${r.name}. ${r.fate ?? ""}`, "wide"]];
  });

  Pack.add({
    id: "rival",
    achievements: {
      killed_rival: { name:"Only One Of Us", desc:"Killed the rival who had followed you since your first winter as an Awakened." },
      rival_saved: { name:"Saved By A Rival", desc:"Your oldest rival came back for you when nobody else would." },
    },
    events: [
{
  /* A random Awakened event, once per life. About half of the lives that
     reach Awakened meet a rival; the rest never do. */
  id:"rv_meet", once:true, weight:6, days:5,
  requires:{ chapter:["awakened"] },
  title:"Someone Else Who Made It",
  text:"Someone is waiting for you outside the Gate cordon, and it takes you a moment to place them. Then you do: the Gateway, the winter you Awakened. They were a few steps ahead of you on the last stretch, and they have not stopped thinking about it since.\n\nTheir name is {rival}: {rivalBackground}. Their Aspect is {rivalAspect}. They have been asking about you, and they have clearly decided something about you, and it is not friendly.\n\n\"I was ahead of you,\" they say. \"At the end. Remember that.\"",
  choices:[
    { label:"Shake their hand and tell them they were.", effects:{ stats:{ renown:1 }, rival:{ standing:2 } },
      text:"They stare at your hand for a long second, then take it. Something shifts in their face. It is not friendship. It might turn into it." },
    { label:"Tell them the Gateway does not care who was first.", hint:"Cunning. A cool head, in front of the whole cordon.",
      check:{ stat:"cunning", dc:9, dcScale:2 },
      success:{ text:"A few people laugh. {rival} does not, but they nod, slowly, as if filing it away.", effects:{ stats:{ cunning:1, renown:2 } } },
      failure:{ text:"It comes out sharper than you meant. {rival} smiles in a way you will learn to recognise.", effects:{ rival:{ standing:-1 } } } },
    { label:"Ignore them completely.", effects:{ stats:{ willpower:1 }, rival:{ standing:-1 } },
      text:"You fill in your forms as if they are not there. They will not forget that." },
  ]
},
{
  id:"rv_gate", weight:12, cooldown:120, days:30,
  requires:{ chapter:["awakened", "ascended"], flags:{ all:["rival_alive"] } },
  title:"{rival} Got There First",
  text:"The communicator went off for both of you. {rival} was closer, and is already inside the cordon when you arrive, standing over a Nightmare Creature that is not quite dead.\n\n\"Mine,\" they say, without turning round. The thing on the ground disagrees, and starts to get up.",
  variants:[
    "You and {rival} answer the same Gate from opposite ends of the city, and meet in the middle of it, both of you out of breath, with something enormous between you.",
    "{rival} is already {rivalRank} by the time your paths cross again, at a Gate neither of you was sent to. They look at you as if they were expecting you.",
  ],
  choices:[
    { label:"Fight it together.", hint:"Willpower. Two Aspects that have never worked side by side.",
      check:{ stat:"willpower", dc:12, dcScale:2, dcEra:1, fatal:6, fatalKind:"gate",
        fatalText:"It was more than either of you could take alone, and it turns out it was more than both of you could take together.",
        fatalCause:"Killed at a Gate fighting beside your rival." },
      success:{ text:"It goes down between you. Neither of you will say who landed the last blow, which is its own kind of agreement.", effects:{ stats:{ renown:3 }, kill:{ rank:1, size:2 }, rival:{ standing:1 } } },
      failure:{ text:"It goes down, eventually. You both carry each other's blood home.", effects:{ stats:{ vitality:-3 }, kill:{ rank:1, size:1 }, rival:{ standing:1 } } } },
    { label:"Let them have it, and watch how they fight.", hint:"Perception. Learn their Aspect while they are busy.",
      check:{ stat:"perception", dc:12, dcScale:2, dcEra:1 },
      success:{ text:"You learn more about {rivalAspect} in ten minutes than in ten years of rumours. They know you were watching.", effects:{ stats:{ perception:3 }, flags:{ add:["knows_rival"] } } },
      failure:{ text:"You learn that they are better than you hoped.", effects:{ stats:{ willpower:-1 }, rival:{ climb:true } } } },
    { label:"Take the kill out from under them.", hint:"Vitality. Rude. Effective.",
      check:{ stat:"vitality", dc:13, dcScale:2, dcEra:1, fatal:6, fatalKind:"gate",
        fatalText:"You lunge for it. So does it.",
        fatalCause:"Killed at a Gate, stealing a kill from your rival." },
      success:{ text:"The fragments are yours. So is the look on {rival}'s face.", effects:{ stats:{ renown:2 }, kill:{ rank:1, size:2 }, rival:{ standing:-2 } } },
      failure:{ text:"You get in each other's way, and the thing nearly gets you both.", effects:{ stats:{ vitality:-4 }, rival:{ standing:-1 } } } },
  ]
},
{
  id:"rv_news", weight:8, cooldown:200, days:20,
  requires:{ chapter:["awakened", "ascended", "transcendent"], flags:{ all:["rival_alive"] } },
  title:"News Of {rival}",
  text:"You hear about {rival} the way everyone hears about everyone: second-hand, late, and exaggerated.\n\nThey are {rivalRank} now. People say they have been asking about you.",
  choices:[
    { label:"Send them a message. Keep it short.", effects:{ rival:{ standing:1 } },
      text:"\"Still alive,\" you write. Three weeks later the answer comes back: \"Same.\" You keep it." },
    { label:"Train harder. They are not getting further ahead.", effects:{ stats:{ willpower:2, vitality:1 } } },
    { label:"Ask around about what they have been doing.", hint:"Cunning",
      check:{ stat:"cunning", dc:12, dcScale:2 },
      success:{ text:"They have been doing well, and lonely, and they keep a list of everyone who came out of that Gateway with them. Your name is the only one not crossed out.", effects:{ stats:{ cunning:2 }, flags:{ add:["knows_rival"] } } },
      failure:{ text:"What you hear is mostly lies. Some of it is about you.", effects:{ stats:{ renown:-1 } } } },
  ]
},
{
  id:"rv_duel", weight:20, once:true, days:30,
  requires:{ chapter:["awakened", "ascended", "transcendent"], flags:{ all:["rival_alive", "rival_hostile"] } },
  title:"{rival} Comes For You",
  text:"It happens in the Dream Realm, far from any witness, which is how you know they planned it.\n\n{rival} steps out from behind a ruined wall with their Aspect already burning. Killing an Awakened gives you part of their soul fragments, and they have been counting yours for years.\n\n\"Only one of us,\" they say. \"It was always going to be only one of us.\"",
  choices:[
    { label:"Fight to the end.", hint:"Vitality. One of you does not leave.",
      check:{ stat:"vitality", dc:14, dcScale:2, dcEra:1, fatal:4, fatalKind:"murdered",
        fatalText:"They were right. It was only ever going to be one of you.",
        fatalCause:"Killed in the Dream Realm by {rival}, your oldest rival." },
      success:{ text:"It is ugly and long and it ends with {rival} on the ground. Their fragments come to you, and so does everything they never said.", effects:{ stats:{ vitality:-5, renown:3 }, kill:{ rank:1, size:3 }, rival:{ kill:true } } },
      failure:{ text:"You both live. You will both carry what happened here.", effects:{ stats:{ vitality:-8 }, rival:{ standing:1 } } } },
    { label:"Talk them down, here, with their Aspect in your face.", requires:{ flags:{ all:["knows_rival"] } }, hint:"Willpower. You know them better than they think.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:1, fatal:4, fatalKind:"murdered",
        fatalText:"You say the right thing, a second too late.",
        fatalCause:"Killed in the Dream Realm by {rival}, mid-sentence." },
      success:{ text:"You tell them about the list. About the crossed-out names. They lower their hands, slowly, and then they sit down on the broken wall and do not say anything for a very long time. Neither do you.", effects:{ stats:{ willpower:4, renown:2 }, rival:{ standing:4 } } },
      failure:{ text:"They hear you. It does not stop them. You get away with your life and not much else.", effects:{ stats:{ vitality:-7 } } } },
    { label:"Run.", hint:"Cunning. The Dream Realm is very large.",
      check:{ stat:"cunning", dc:13, dcScale:2, dcEra:1, fatal:5, fatalKind:"murdered",
        fatalText:"They know the Dream Realm better than you hoped.",
        fatalCause:"Hunted down in the Dream Realm by {rival}." },
      success:{ text:"You get away. They will try again. You know that now.", effects:{ stats:{ cunning:2, renown:-2 } } },
      failure:{ text:"You get away with a wound that takes a year to close.", effects:{ stats:{ vitality:-6 } } } },
  ]
},
{
  id:"rv_rescue", weight:16, once:true, days:30,
  requires:{ chapter:["awakened", "ascended", "transcendent", "supreme"], flags:{ all:["rival_alive", "rival_friend"] } },
  title:"{rival} Comes Back For You",
  text:"You are pinned down at a Gate that was graded wrong, with something on top of you that should not have fit through it, and the communicator has stopped answering.\n\nThen the wall to your left comes apart, and {rival} walks through the gap with {rivalAspect} roaring around them, and says, \"You owe me,\" and does not wait for an answer.",
  choices:[
    { label:"Get up and fight beside them.", effects:{ stats:{ renown:4, vitality:-2 }, kill:{ rank:2, size:2 }, flags:{ add:["rival_saved"] } },
      text:"Together you finish it in an hour. Afterwards you sit on the rubble and share the last of their water, and neither of you says the word friend, and both of you mean it." },
  ]
},
{
  id:"rv_fall", weight:5, once:true, days:10,
  requires:{ chapter:["ascended", "transcendent", "supreme"], flags:{ all:["rival_alive"] } },
  title:"{rival}",
  text:"The news reaches you in a single line, from someone who did not know what it would mean to you.\n\n{rival} died at a Gate last week. They were {rivalRank}. The Gate was graded two categories too low. They held it long enough for the people behind them to get out.",
  choices:[
    { label:"Go to where it happened.", effects:{ stats:{ willpower:3, tether:1 }, rival:{ die:"Died holding a Gate, so that others could get out." } },
      text:"There is nothing there now but scorched ground. You stand there for an hour, and on the way home you realise you have stopped measuring yourself against anyone." },
    { label:"Raise a glass, and get back to work.", effects:{ stats:{ cunning:1 }, rival:{ die:"Died holding a Gate, so that others could get out." } },
      text:"It is what they would have done. You are fairly sure it is what they would have done." },
  ]
},
    ],
  });
})();
