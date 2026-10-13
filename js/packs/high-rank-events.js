/* =============================================================
   SOVEREIGN AND SACRED: A LIFE WORTH LIVING AT THE TOP
   Until v0.5.0 the Supreme chapter had four events and the Sacred
   chapter two, which is the same shape that stranded a Saint for
   900 years in issue #6. This pack gives both ranks recurring
   content built on what canon says those ranks are:

   - A Sovereign's power is a Domain: "an expression of a function
     of the Aspect", spread "through two mediums: Territory and
     People", tied to Citadels, "fortresses built in the Dream Realm
     around a Gateway". "Within their Domains, they are practically
     invincible." (wiki: Sovereigns)
   - Sovereigns "demand fealty from most Transcendents". (chapter text)
   - The Domain War was fought around Godgrave, a dead god's skeleton
     under ash and twilight. (chapter text / wiki)
   - A Sacred human almost certainly cannot set foot on Earth. (wiki)

   New mechanic (ours): a Sovereign's Domain counts Citadels. Each
   Citadel adds +1 to dangerous checks (up to +3) while you are
   Supreme or above, shown on the roll line as "Domain".
   See docs/content/high-rank-events.md.
   ============================================================= */
Pack.add({
  id: "high-rank-events",

  achievements: {
    great_citadel: { name:"A Great Citadel", desc:"Held three Citadels at once as a Sovereign: a Domain the size of the old Great Clans'." },
  },

  events: [
/* ---------------------------- SOVEREIGN ---------------------------- */
{
  id:"sv_citadel", chapter:"supreme", weight:26, cooldown:16, days:120,
  requires:{ flags:{ none:["domain_full"] } },
  title:"A Citadel Without A Lord",
  text:"A Citadel has come free. Its lord died at a Gate, or went into a Seed and did not come out, and the fortress around its Gateway is standing empty in the Dream Realm, with a few thousand frightened people still living inside the walls.\n\nA Domain grows by territory and by people, and a Citadel is both. Two other powers have already noticed.",
  variants:[
    "Far out in the Dream Realm, past any map the clans keep, an old Citadel has been found: a ruined fortress around a Gateway that still works. Nobody has claimed it yet. Somebody will by the end of the year.",
    "A Citadel's people have sent you a message. Their lord is dead, the Nightmare Creatures are testing the walls, and they would rather belong to you than to whoever else is coming.",
  ],
  choices:[
    { label:"Take it by force, before anyone else can.", hint:"Willpower. A Domain is also a claim, and claims get contested.",
      check:{ stat:"willpower", dc:24, dcScale:4, fatal:6, fatalKind:"war",
        fatalText:"Another Sovereign wanted it too, and got there with more of their Domain behind them.",
        fatalCause:"Killed contesting a Citadel with another Sovereign." },
      success:{ text:"You take it. The people inside watch the change of lords from the walls and say nothing, which is what people do when they are not yet sure what you are.", effects:{ stats:{ renown:8, vitality:-4 }, domain:1 } },
      failure:{ text:"You take it, and it costs you a decade of recovery and most of the goodwill of the people inside.", effects:{ stats:{ vitality:-8, renown:2 }, domain:1 } } },
    { label:"Go and defend its people first, and let them choose you.", hint:"Perception. Find what is testing the walls before it finds them.",
      check:{ stat:"perception", dc:22, dcScale:4, fatal:6, fatalKind:"gate",
        fatalText:"What was testing the walls was older than the Citadel, and it had been waiting for someone like you to come out from behind them.",
        fatalCause:"Killed defending a Citadel that had not yet sworn to you." },
      success:{ text:"You hold the walls for a year. At the end of it the people of the Citadel come to you, all of them, and ask. It is the strongest kind of claim there is.", effects:{ stats:{ renown:10, willpower:3 }, domain:1, kill:{ rank:5, size:1 } } },
      failure:{ text:"You hold the walls. Half of the people inside choose you. The other half leave, and take the Citadel's name with them.", effects:{ stats:{ vitality:-6, renown:3 } } } },
    { label:"Let it go. A Domain is not a collection.", effects:{ stats:{ willpower:3, cunning:2 } } },
  ]
},
{
  id:"sv_fealty", chapter:"supreme", weight:20, cooldown:24, days:150,
  title:"The Saints Come To Swear",
  text:"Sovereigns demand fealty from Saints. That is how the world has worked since there were Sovereigns in it, and now it is how the world works around you.\n\nThree Saints are waiting in the hall of your Citadel. One of them is very young, as Saints go. One is older than you. The third swore to two Saints before you, back when she was a Master, and both of them are dead.",
  choices:[
    { label:"Accept their fealty and give them each a Citadel's defence.", effects:{ stats:{ renown:8, cunning:2 }, flags:{ add:["sworn_saints"] } } },
    { label:"Refuse fealty. Offer them alliance instead, as equals.", hint:"Cunning. A Sovereign who does not demand fealty is a rumour that travels.",
      check:{ stat:"cunning", dc:22, dcScale:4 },
      success:{ text:"Two of them accept, and stay, and are better allies than any sworn Saint would have been. The third leaves, and tells everyone, and within a decade Saints are coming to you from other Domains.", effects:{ stats:{ renown:12, willpower:2 }, flags:{ add:["free_saints"] } } },
      failure:{ text:"They take it as weakness. All three leave, and one of them swears to a Sovereign who would very much like your Citadels.", effects:{ stats:{ renown:-6 } } } },
    { label:"Ask the one who outlived two lords what killed them.", hint:"Perception. She knows. She has never been asked.",
      check:{ stat:"perception", dc:22, dcScale:4 },
      success:{ text:"She tells you, after a long silence. Both of them died the same way: they stopped going to the Gates themselves, and their Citadels forgot what they were for. You will remember that for a very long time.", effects:{ stats:{ perception:4, willpower:4 }, flags:{ add:["knows_the_fall"] } } },
      failure:{ text:"She tells you a story that is mostly true. You will not find out which part is not for several centuries.", effects:{ stats:{ cunning:2 } } } },
  ]
},
{
  id:"sv_godgrave", chapter:"supreme", weight:18, cooldown:30, days:200,
  title:"Godgrave",
  text:"The front of the war between the Domains runs along the bones of a dead god.\n\nGodgrave is a skeleton thousands of kilometres long, under a sky of permanent twilight, on a ground of ash. The clans have fortified its shoulders. In the hollows beneath its ribs there are Citadels nobody has found yet, and Death Zone things that have been there since the god fell.\n\nBoth sides want you on their line. Neither side is asking.",
  choices:[
    { label:"Go down into the Hollows and look for a lost Citadel.", hint:"Willpower. A Death Zone, under a god.",
      check:{ stat:"willpower", dc:26, dcScale:4, fatal:5, fatalKind:"war",
        fatalText:"The Hollows are a Death Zone, and you went in alone, and something Cursed had been waiting under the ribs since before there were Sovereigns.",
        fatalCause:"Killed in the Hollows of Godgrave by something older than the war." },
      success:{ text:"You find one, under the seventh rib: a Citadel of black stone with a working Gateway, empty for an age. You bring it into your Domain, and the war changes shape around you.", effects:{ stats:{ renown:12, vitality:-6 }, domain:1, kill:{ rank:5, size:1 } } },
      failure:{ text:"You find the Citadel and cannot hold it. You come back up into the twilight with nothing but the memory of what lives down there.", effects:{ stats:{ vitality:-10, willpower:3 } } } },
    { label:"Hold a section of the line on the god's shoulder.", hint:"Vitality. Sovereign against Sovereign.",
      check:{ stat:"vitality", dc:26, dcScale:4, fatal:5, fatalKind:"war",
        fatalText:"A rival Sovereign comes for your section in person, inside the reach of their own Domain, where they are practically invincible.",
        fatalCause:"Killed on the shoulder of Godgrave, inside another Sovereign's Domain." },
      success:{ text:"You hold it for forty years. The line does not move, and the people behind it never learn your name, and that is how you know you did it properly.", effects:{ stats:{ renown:14, vitality:-6 }, flags:{ add:["war_saint"] } } },
      failure:{ text:"You hold it, barely. The ash on the god's shoulder is a different colour where you stood.", effects:{ stats:{ vitality:-12, renown:6 } } } },
    { label:"Refuse the war, and spend those years at the Gates instead.", effects:{ stats:{ willpower:4, renown:-4 }, flags:{ add:["neutral"] } } },
  ]
},
{
  id:"sv_waking", chapter:"supreme", weight:14, cooldown:40, days:60,
  title:"A Visit To The Waking World",
  text:"You can still go back. It costs more each time, and the waking world does not like it: lights flicker in the streets you walk down, and people step out of your way without knowing why.\n\nThe city you grew up in is still there. It is almost unrecognisable. The street where you were infected by the Spell is a park now, and there is a small statue in it, of a seventeen-year-old who looks nothing like you did.",
  choices:[
    { label:"Sit in the park for a day and remember.", effects:{ stats:{ tether:3, willpower:3 } } },
    { label:"Find the families of the people who died beside you, long ago, and look after them quietly.", effects:{ stats:{ tether:2, renown:4, essence:-3 }, flags:{ add:["went_home"] } } },
    { label:"Go back to the Dream Realm. There is nothing here that is still yours.", effects:{ stats:{ tether:-2, essence:4 }, flags:{ add:["let_go"] } } },
  ]
},

/* ----------------------------- SACRED ------------------------------ */
{
  id:"sc_earth", chapter:"sacred", weight:22, cooldown:30, days:300,
  title:"The Window",
  text:"You cannot go back to Earth now. Its laws reject what you have become, the way a hand rejects a splinter. You have tried once, and the world bent around you like a wound, and you did not try again.\n\nBut at the edge of the Dream Realm there are places where it is thin, and you can see through. Children walking to school. A woman at a bus stop with your grandmother's face, ten generations on.",
  choices:[
    { label:"Watch, and do nothing. It is enough that they are there.", effects:{ stats:{ willpower:6, tether:1 } } },
    { label:"Reach through the thin place, very gently, and leave a warning before the next Gate opens.", hint:"Cunning. The world will try to push you out.",
      check:{ stat:"cunning", dc:30, dcScale:4 },
      success:{ text:"A dream, in a hundred minds at once, the night before the Gate. In the morning a whole district has left the city for no reason any of them can explain. The Gate opens on empty streets.", effects:{ stats:{ renown:10, essence:-6 }, flags:{ add:["carried_them"] } } },
      failure:{ text:"The world pushes you out before the message is finished. Nobody understands the dream. You feel the Gate open, the next morning, from the other side of the window.", effects:{ stats:{ essence:-8, willpower:-2 } } } },
    { label:"Stop looking. A god who looks back is a god who stays small.", effects:{ stats:{ essence:10, tether:-2 } } },
  ]
},
{
  id:"sc_bones", chapter:"sacred", weight:18, cooldown:40, days:500,
  title:"The Bones Of A Dead God",
  text:"You go back to Godgrave, and this time you understand what you are walking on.\n\nThe skeleton is not just large. It is the same kind of thing you have become, or the same kind of thing you will be if you climb all the way. A god died here, so long ago that the war being fought on its shoulders is a footnote to its silence.\n\nSomewhere in the skull there is a place where the bone is still warm.",
  choices:[
    { label:"Go to the warm place in the skull and listen.", hint:"Perception. What is left of a god is still a god.",
      check:{ stat:"perception", dc:30, dcScale:4, fatal:6, fatalKind:"war",
        fatalText:"What is left of a god is still a god, and it notices you listening.",
        fatalCause:"Unmade by what remains of the god of Godgrave." },
      success:{ text:"It is not alive. It is a memory, the last thought the god had as it died, still turning over in the bone. You will not tell anyone what the thought was. You will think about it every time you are tempted to climb further.", effects:{ stats:{ perception:8, willpower:4 }, flags:{ add:["heard_the_bones"] } } },
      failure:{ text:"You hear only the wind in the eye sockets, and it is enough to make you leave.", effects:{ stats:{ willpower:-3 } } } },
    { label:"Leave it alone. Some silences are not yours to break.", effects:{ stats:{ willpower:5, tether:1 } } },
  ]
},
{
  id:"sc_worship", chapter:"sacred", weight:16, cooldown:40, days:400,
  title:"Prayers",
  text:"Someone has started praying to you.\n\nNot to the Spell, not to the old gods, to you, by a name you were called once as an Awakened and had forgotten. It is a small group, in a Citadel on the edge of the Dream Realm. You can feel their prayers the way you feel a draught.\n\nThere are more of them every year.",
  choices:[
    { label:"Answer them, once, so they know someone is listening.", effects:{ stats:{ renown:16, essence:-6, tether:1 } } },
    { label:"Let them pray. You were a person before you were a god; you know how little a voice from the sky would help.", effects:{ stats:{ willpower:6 } } },
    { label:"Send them a dream telling them to stop, and to look after each other instead.", hint:"Cunning. People who pray do not usually want to be told that.",
      check:{ stat:"cunning", dc:30, dcScale:4 },
      success:{ text:"They stop. A century later the Citadel is the best-run settlement in the region, and nobody in it remembers why the old chapel was converted into a school.", effects:{ stats:{ cunning:6, renown:6 } } },
      failure:{ text:"They take the dream as a sign, and pray twice as hard.", effects:{ stats:{ renown:8, essence:-4 } } } },
  ]
},
  ],

  patch() {
    /* The Domain: citadels held, as a number on the state. */
    Hooks.on("effects", (s, fx, deltas) => {
      if (!fx.domain) return;
      s.domain = Math.max(0, Math.min(3, (s.domain ?? 0) + fx.domain));
      if (s.domain >= 3) {
        for (const f of ["domain_full", "great_citadel"]) if (!s.flags.includes(f)) s.flags.push(f);
      }
    });
    /* "Within their Domains, they are practically invincible": +1 per
       Citadel on a dangerous check, from Supreme up. */
    Hooks.on("checkMods", (s, c) =>
      s.rank >= 4 && s.domain > 0 && Engine.isCombat(c) ? { label:"Domain", value:s.domain } : null);
    Hooks.on("sheet", S => S.domain ? `<div class="sheet-section">Domain</div><div class="sheet-line"><span>Citadels</span><span>${S.domain} · +${S.domain} on dangerous checks</span></div>` : null);
    Hooks.on("endTiles", S => S.domain ? [["Domain", `${S.domain} Citadel${S.domain > 1 ? "s" : ""}`]] : null);
  },
});
