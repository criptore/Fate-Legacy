/* =============================================================
   THIRD NIGHTMARE — THE FLEET THAT NEVER LANDS
   An original scenario, built to canon's Third Nightmare format
   (Tomb of Ariel): many challengers scattered across a much larger
   world, years of time passing inside the Seed, a Great-ranked
   power at the centre, several valid resolutions, and survivors
   returned "to the exact moment they had entered the Seed".
   A Nightmare ends in conquest or death. Everything named here is
   ours. See docs/content/fleet-never-lands.md.
   ============================================================= */
Pack.add({
  id: "fleet-never-lands",

  nightmares: {
    third: [ { id:"tn_fleet", name:"The Fleet That Never Lands", entry:"tn3_1" } ],
  },

  memories: {
    shoreless_chart: { name:"The Shoreless Chart", type:"Utility", rank:"Ascended",
      desc:"A sea chart a thousand years in the making. Every coast on it is crossed out except one, and that one is drawn in your hand.",
      stats:{ perception:4, cunning:2 } },
  },

  echoes: {
    shepherd_calf: { name:"The Shepherd's Calf", rank:"Ascended", bound:4,
      desc:"A copy of the youngest thing that swam beneath the fleet. It circles you as if you were a ship that might stray.",
      stats:{ vitality:4, willpower:2 } },
  },

  achievements: {
    made_landfall: { name:"Made Landfall", desc:"Brought a fleet that had sailed for a thousand years to a shore, in the Third Nightmare." },
  },

  events: [
{
  id:"tn3_1", scripted:true, once:true, days:30, fixedTime:true,
  title:"The Fleet That Never Lands",
  text:"You wake on the deck of a ship with salt in your mouth and a rope burn across both palms. The Spell has made you a navigator's mate on the *Long Patience*, flagship of a fleet of ten thousand ships.\n\nThe fleet has been at sea for a thousand years. Nobody on board has ever seen land. They are sailing for a shore their ancestors promised them, and they sing about it every night.\n\nUnder the water, something enormous keeps pace with the fleet. The crews call it the Shepherd. It is Great-ranked, and when a ship drifts too far from the others, the Shepherd turns it back. Gently, the first time.\n\nSomewhere among the ten thousand ships are the other challengers. The sea is very wide, and a fleet this size is a nation.",
  choices:[
    { label:"Study the navigators' charts and find out where the fleet is really going.", hint:"Perception. A thousand years of charts, in a dozen dead handwritings.",
      check:{ stat:"perception", dc:20 },
      success:{ text:"Every chart in the flagship's library marks the promised shore in a different place. Every one of those places has been crossed out, by a later hand, after the fleet reached it and found open water. The newest chart has no shore on it at all.", effects:{ stats:{ perception:4 }, flags:{ add:["fleet_charts"] } } },
      failure:{ text:"You read for a year. The charts contradict each other so thoroughly that you start to wonder if that is the point.", effects:{ stats:{ perception:1, willpower:-1 } } },
      effects:{ goto:"tn3_2" } },
    { label:"Take a boat and row from ship to ship until you find the other challengers.", hint:"Cunning. You need to know who else is out here, and what they want.",
      check:{ stat:"cunning", dc:20, fatal:6, fatalKind:"nightmare",
        fatalText:"You row too far out between two ships. The Shepherd turns you back, the way it turns everything back, and a rowing boat is very small.",
        fatalCause:"Turned back by the Shepherd, in a rowing boat, between two ships of the Fleet That Never Lands." },
      success:{ text:"It takes three years. You find five of them, on five different ships, and each has been made something different by the Spell: a captain, a cook, a priest of the shore, a prisoner, a child. Together, you know more about the fleet than anyone in it.", effects:{ stats:{ cunning:4, renown:3 }, flags:{ add:["fleet_allies"] } } },
      failure:{ text:"You find two. A third finds you first, and makes it clear that this Nightmare will have one conqueror, and it will be them.", effects:{ stats:{ vitality:-4, cunning:1 } } },
      effects:{ goto:"tn3_2" } },
    { label:"Dive at night and get close enough to the Shepherd to see what it is.", hint:"Willpower. It is Great-ranked, and it is everywhere beneath you.",
      check:{ stat:"willpower", dc:20, fatal:6, fatalKind:"nightmare",
        fatalText:"You get close enough to see it. It gets close enough to see you.",
        fatalCause:"Drowned beneath the Fleet That Never Lands, close enough to see the Shepherd." },
      success:{ text:"It is not one creature. It is a herd of them, old and young, and the old ones are scarred all along their backs, as if from a thousand years of pushing ships away from something.", effects:{ stats:{ willpower:4 }, flags:{ add:["fleet_herd"] } } },
      failure:{ text:"You see an eye the size of a sail before the cold drives you up. You do not sleep for a week afterwards.", effects:{ stats:{ vitality:-3, willpower:1 } } },
      effects:{ goto:"tn3_2" } },
  ]
},
{
  id:"tn3_2", scripted:true, once:true, days:30, fixedTime:true,
  title:"The Fleet That Never Lands",
  text:"Years pass inside the Seed. You marry, or you do not. You bury people. The fleet sails on.\n\nThen, in the eleventh year, a ship at the edge of the fleet reports a smudge on the horizon. Not land. Weather: a wall of dark cloud that does not move with the wind, and the sea under it is the wrong colour.\n\nThe Shepherd turns the fleet away from it, as it has done before, many times, though nobody alive remembers.\n\nYou understand at last. The fleet is not sailing toward anything. It is running from that, and has been for a thousand years. The promised shore is a song they sing so they do not have to look behind them.",
  choices:[
    { label:"Sail a single ship into the storm to see what is inside it.", hint:"Vitality. Whatever is in there has been chasing a nation for a thousand years.",
      check:{ stat:"vitality", dc:25, fatal:6, fatalKind:"nightmare",
        fatalText:"The ship goes into the dark, and the dark does not give it back.",
        fatalCause:"Lost in the storm behind the Fleet That Never Lands." },
      success:{ text:"Inside the storm is the shore. The promised land, exactly as the songs describe it, and it is rotting. Something Defiled lives in its soil and has been reaching for the fleet for a thousand years. You kill one of its servants on the beach, and it bleeds black.", effects:{ stats:{ vitality:-5, renown:6 }, kill:{ rank:4, size:1 }, flags:{ add:["fleet_shore"] } } },
      failure:{ text:"You turn back before the cloud closes over you. Half the crew does not make it home, and the half that does will not speak of what they heard.", effects:{ stats:{ vitality:-7, willpower:2 } } },
      effects:{ goto:"tn3_3" } },
    { label:"Call a council of all ten thousand captains and tell them the truth.", hint:"Willpower. A thousand years of song against one sentence.",
      /* Deliberately high: by a Third Seed, Willpower averages ~39, and
         talking ten thousand captains out of a thousand-year song should
         fail about half the time. */
      check:{ stat:"willpower", dc:44, fatal:6, fatalKind:"nightmare",
        fatalText:"The captains listen, and then they vote, and the vote is to throw the person who said it over the side so that the song can go on.",
        fatalCause:"Thrown overboard by the captains of the Fleet That Never Lands for telling them the truth." },
      success:{ text:"They do not believe you. Then the edge ships report the storm again, and they do. For the first time in a thousand years, the fleet stops singing.", effects:{ stats:{ willpower:4, renown:6 }, flags:{ add:["fleet_council"] } } },
      failure:{ text:"They vote you off the flagship. You spend a year as a deckhand on a fishing boat at the edge of the fleet, watching the storm get closer.", effects:{ stats:{ renown:-3, willpower:2 } } },
      effects:{ goto:"tn3_3" } },
    { label:"Hunt one of the young Shepherds and take its strength.", hint:"Vitality. A Fallen calf, with the herd somewhere close.",
      check:{ stat:"vitality", dc:24, fatal:6, fatalKind:"nightmare",
        fatalText:"The calf is young. Its mother is not.",
        fatalCause:"Killed by the Shepherd herd beneath the Fleet That Never Lands." },
      success:{ text:"You kill it, and the whole herd goes still beneath the fleet for a full day, in what you can only call mourning. Its Echo comes to you that night, and it circles you as if you were a ship.", effects:{ stats:{ vitality:-4, renown:4 }, kill:{ rank:2, size:2 }, echo:"shepherd_calf", flags:{ add:["fleet_calf"] } } },
      failure:{ text:"You wound it. The herd closes around it, and the fleet rides a swell for three days that capsizes forty ships. You know whose fault that was.", effects:{ stats:{ vitality:-6, renown:-3 } } },
      effects:{ goto:"tn3_3" } },
  ]
},
{
  id:"tn3_3", scripted:true, once:true, days:60, fixedTime:true,
  title:"The Fleet That Never Lands",
  text:"The conflict is the flight.\n\nFor a thousand years the fleet has run from a Defiled shore, and the Shepherd herd has kept it running, turning back every ship that drifted toward the storm. Now the storm is faster than the fleet. It will catch them within the year.\n\nThe other challengers have each decided what this Nightmare is about. One wants to kill the Shepherd and let the fleet choose its own way. One wants to sail into the storm and burn the shore clean. One has stopped talking, and is building something in the flagship's hold.\n\nThere will be no next year to decide in.",
  choices:[
    { label:"Lead the whole fleet into the storm and take the shore back.", requires:{ flags:{ any:["fleet_shore", "fleet_council"] } }, hint:"Willpower. Ten thousand ships, a thousand years of fear, one order.",
      check:{ stat:"willpower", dc:6, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"The fleet follows you into the dark. The shore is waiting for it, and it has been waiting a very long time.",
        fatalCause:"Killed on the Defiled shore, leading the Fleet That Never Lands to landfall." },
      success:{ text:"Ten thousand ships turn at once, which no living sailor has ever seen, and go into the storm under every scrap of sail they have. The fighting on the beach lasts a season. When it is over, the soil is clean, and the fleet's children walk on land for the first time in a thousand years.\n\nThe Shepherd herd follows you in, and then, for the first time, swims away.", effects:{ stats:{ willpower:5, renown:12 }, kill:{ rank:4, size:2 }, memory:"shoreless_chart", flags:{ add:["made_landfall", "carried_them"] }, goto:"tn_resolve" } },
      failure:{ text:"You take the shore. It costs a third of the fleet, and it costs you most of what you were when you came aboard. The Seed resolves on the beach, with the tide coming in red.", effects:{ stats:{ vitality:-10, willpower:2, renown:6 }, flags:{ add:["made_landfall"] }, goto:"tn_resolve" } } },
    { label:"Kill the Shepherd, and let the fleet decide where to sail.", hint:"Vitality. The eldest of the herd, Great-ranked, in its own sea.",
      check:{ stat:"vitality", dc:6, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You go into the water with the oldest thing in it. Only one of you comes back up, and it is not you.",
        fatalCause:"Killed by the Shepherd beneath the Fleet That Never Lands." },
      success:{ text:"The eldest Shepherd dies in a sea turned white with foam, and the fleet is free for the first time in a thousand years. It does not run. It turns, slowly, all ten thousand ships, and faces the storm, and decides for itself.\n\nWhat it decides happens after the Seed lets you go. You never learn the ending, and you find that you can live with that.", effects:{ stats:{ vitality:-6, renown:10 }, kill:{ rank:4, size:1 }, flags:{ add:["freed_the_fleet"] }, goto:"tn_resolve" } },
      failure:{ text:"It dies. You nearly do. The fleet is free and terrified and very far from anything, and the Seed resolves while you are still being pulled from the water.", effects:{ stats:{ vitality:-11, willpower:2 }, kill:{ rank:4, size:1 }, goto:"tn_resolve" } } },
    { label:"Help the silent challenger finish what they are building in the hold.", requires:{ flags:{ any:["fleet_allies", "fleet_charts"] } }, hint:"Cunning. A chart of a shore that does not exist yet.",
      check:{ stat:"cunning", dc:6, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"The thing in the hold is a lie the size of a ship, and the fleet sees through it in a day. A fleet that has been lied to for a thousand years does not take it well a second time.",
        fatalCause:"Killed by the crews of the Fleet That Never Lands, who had been lied to once too often." },
      success:{ text:"It is a chart. A real one, drawn from every crossed-out coast in a thousand years of navigation, and it shows one place nobody ever looked, because the songs said the shore was ahead and this one lies behind them, beyond the storm, on the far side.\n\nThe fleet sails around the dark for a year, the long way, and finds a coast that is clean. The other challenger gives you the chart when it is done. You find you are holding it when the Seed lets you go.", effects:{ stats:{ cunning:5, perception:3, renown:10 }, memory:"shoreless_chart", flags:{ add:["made_landfall"] }, goto:"tn_resolve" } },
      failure:{ text:"The chart is close enough. Most of the fleet reaches the far coast. Most of the fleet is not all of it, and the challenger who drew it stays behind to turn the stragglers, and does not come back.", effects:{ stats:{ vitality:-7, cunning:2, renown:4 }, goto:"tn_resolve" } } },
    { label:"Take a fast ship and sail away from all of it, alone.", hint:"There is no edge to a Nightmare's sea. It ends with the conflict or with you.",
      check:{ stat:"cunning", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You sail for a year and the horizon never changes. The storm finds a single ship far more easily than a fleet.",
        fatalCause:"Lost at sea alone, trying to sail out of the Fleet That Never Lands." },
      success:{ text:"You sail for a year and the horizon never changes, and somewhere in that year you understand. So you turn round, sail back, and come at the storm from the side nobody has ever seen it from. What lives in the shore was always looking ahead, toward the fleet. It never looked behind.", effects:{ stats:{ cunning:4, renown:6 }, kill:{ rank:4, size:1 }, flags:{ add:["made_landfall"] }, goto:"tn_resolve" } },
      failure:{ text:"You come back in time to see the others end it without you. The Seed resolves anyway, and you take the rank it gives you with the taste of salt and shame.", effects:{ stats:{ vitality:-6, renown:-5 }, goto:"tn_resolve" } } },
  ]
},
  ],

  /* Canon: survivors of a Third Nightmare are returned "to the exact moment
     they had entered the Seed". Years pass inside this one, so say so. */
  patch() {
    Hooks.on("choose", (s, ev) => {
      if (ev.id === "tn3_3" && !s.dead && s.pending === "tn_resolve") s.fleetReturned = true;
    });
    Hooks.on("text", (str, s) => s?.fleetReturned && str?.startsWith("Transcendent.\n\n")
      ? "Eleven years at sea, and the Seed returns you to the moment you entered it. Your hands still remember the ropes.\n\n" + str
      : str);
    Hooks.on("draw", (s, ev) => { if (ev.id !== "tn_resolve") s.fleetReturned = false; });
  },
});
