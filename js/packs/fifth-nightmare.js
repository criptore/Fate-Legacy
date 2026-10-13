/* =============================================================
   THE FIFTH NIGHTMARE — APOTHEOSIS
   Until v0.5.0 the Fifth Nightmare was a single roll, and its
   failure sent a Sovereign home alive, which broke the rule that a
   Nightmare ends in conquest or death. This pack turns it into the
   two trials canon describes:

   - "Two trials, one personal and one collective; failing either
     means death." (wiki: Fifth Nightmare)
   - The first is faced alone and is "meant to unmake them as humans
     and rebuild them in the image of deities ... by forcing each
     challenger to face their own Domain". (wiki)
   - Success is Apotheosis: "a lesser deity and a minor god, but
     still something fundamentally different from a mortal" (ch.
     ~2266), and "the Spell does not care whether the challenger
     remains themselves". (wiki)
   - "No Awakened from the current cycle of the Nightmare Spell had
     ever returned from it." (wiki: Nightmares)
   - A Sacred human almost certainly cannot set foot on Earth. (wiki)

   What the trials contain is ours. See docs/content/fifth-nightmare.md.
   ============================================================= */
Pack.add({
  id: "fifth-nightmare",

  nightmares: {
    fifth: [ { id:"fv_apotheosis", name:"The Fifth Nightmare", entry:"fv_1" } ],
  },

  achievements: {
    still_yourself: { name:"Still Yourself", desc:"Came back from Apotheosis as the same person who went in. The Spell does not require that, and almost nobody manages it." },
  },

  events: [
{
  id:"fv_1", scripted:true, once:true, days:30, fixedTime:true,
  title:"The Fifth Nightmare: Alone",
  text:"There is no world in the Seed. There is your Domain.\n\nEverything you have spread your soul across: the land, the cities, the people who swore to you, the Citadels, every road you made safe. It is all here, laid out around you like a body you have never seen from the outside. And it is looking at you.\n\nIt speaks with all of their voices at once. It says that it does not need you any more. It says that a god is a Domain with nobody inside it, and that the small, tired person at its centre is the last thing standing between it and what it is meant to become.\n\nIt is right about that. The trial is whether you let it be right.",
  choices:[
    { label:"Hold on to yourself, and make the Domain carry you as you are.", hint:"Willpower. A person, insisting on being a person, against a world.",
      check:{ stat:"willpower", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You hold on for a very long time. The Domain is patient, and much larger than you, and in the end there is nobody inside it any more.",
        fatalCause:"Unmade in the first trial of the Fifth Nightmare. The Domain went on without anyone in it." },
      success:{ text:"You do not let go. The Domain presses on you for what feels like a thousand years, and you stay exactly the size you are, and slowly it understands that it will have to become a god with someone in it.\n\nIt is not happy about that. It accepts it.", effects:{ stats:{ willpower:6 }, flags:{ add:["fifth_held"] }, goto:"fv_2" } },
      failure:{ text:"You hold on to most of yourself. Not all. Something small and human is gone when the trial ends, and you cannot remember what it was, only that you used to have it.", effects:{ stats:{ willpower:2, tether:-4 }, flags:{ add:["fifth_changed"] }, goto:"fv_2" } } },
    { label:"Let it unmake you, and keep one thing back: a single memory, hidden where it will not look.", hint:"Cunning. Lose everything except one thing, on purpose.",
      check:{ stat:"cunning", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"It finds the memory. Of course it does. It is made of you, and it knows where you hide things.",
        fatalCause:"Unmade in the first trial of the Fifth Nightmare, down to the last hidden memory." },
      success:{ text:"The Domain takes you apart, piece by piece, and rebuilds something vast in your place. It does not find the memory. When the rebuilding is finished, the memory is still there, very small, at the centre of a god, and the god remembers whose it is.", effects:{ stats:{ cunning:6 }, flags:{ add:["fifth_held"] }, goto:"fv_2" } },
      failure:{ text:"It finds most of what you hid. What is left is enough to know your own name. It is not enough to know why it mattered.", effects:{ stats:{ cunning:2, tether:-4 }, flags:{ add:["fifth_changed"] }, goto:"fv_2" } } },
    { label:"Look past the Domain for what you were before you ever had one.", hint:"Perception. Somewhere under all of this is a seventeen-year-old who was afraid of the dark.",
      check:{ stat:"perception", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You look for the person you were before. They are not there. They have not been there for a very long time.",
        fatalCause:"Unmade in the first trial of the Fifth Nightmare, looking for someone who was already gone." },
      success:{ text:"You find them: an Aspirant on the night before their First Nightmare, terrified, with no idea what is coming. You stay with them in the dark until they stop shaking. When you look up, the Domain has gone quiet, the way a room does when someone says the true thing.", effects:{ stats:{ perception:6 }, flags:{ add:["fifth_held"] }, goto:"fv_2" } },
      failure:{ text:"You find a version of them, half-remembered and mostly invented. It is enough to get you through. You will never be sure it was really you.", effects:{ stats:{ perception:2, tether:-4 }, flags:{ add:["fifth_changed"] }, goto:"fv_2" } } },
  ]
},
{
  id:"fv_2", scripted:true, once:true, days:30, fixedTime:true,
  title:"The Fifth Nightmare: Together",
  text:"The second trial is not yours alone.\n\nLike every Nightmare, it is a piece of the past, rebuilt. You are standing on a road that runs from one edge of the Seed to the other, and the road is full of people: a whole civilisation from a cycle of the Spell older than yours, walking out of a world that is ending. Some of them were Supremes once. Some are only voices. In that age nobody could carry the rest, and the conflict at the heart of this Nightmare cannot be resolved by one person alone.\n\nThe road ends at a door. The door opens for everyone, or for no one. And the world around the road keeps pulling at you. A soul as wide as yours is now could simply sink into it and stop being anyone.",
  choices:[
    { label:"Lead them. Walk at the front and make them follow you to the door.", hint:"Willpower. A whole lost age, walking behind you.",
      check:{ stat:"willpower", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"They follow you for a while. Then the road gets long, and they stop, one by one, and so in the end do you.",
        fatalCause:"Lost on the road of the Fifth Nightmare, swallowed by the world it was rebuilt from." },
      success:{ text:"You walk at the front for longer than the Seed has words for. Some of them fall away. Most of them do not. When you reach the door it is already opening. They go through first, into whatever the Spell makes of them. You go through last.", effects:{ stats:{ willpower:6, renown:20 }, flags:{ add:["fifth_led"] }, goto:"fv_resolve" } },
      failure:{ text:"You reach the door with a third of them. It opens. It turns out a third was enough, and it turns out you will carry the other two thirds with you, in some form, for ever.", effects:{ stats:{ willpower:2, renown:10, tether:-3 }, flags:{ add:["fifth_changed"] }, goto:"fv_resolve" } } },
    { label:"Carry the ones who cannot walk, as many as you can hold.", hint:"Vitality. A god's body is the first thing it has to spend.",
      check:{ stat:"vitality", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You pick up one more than you can carry. You do not put any of them down.",
        fatalCause:"Died on the road of the Fifth Nightmare, carrying the people who could not walk." },
      success:{ text:"You carry them in your arms and on your back and inside your Domain, which turns out to be very large indeed. The door opens for all of you. Some of the ones you carried thank you. Some of them were never going to be able to.", effects:{ stats:{ vitality:6, renown:18 }, flags:{ add:["fifth_led", "carried_them"] }, goto:"fv_resolve" } },
      failure:{ text:"You reach the door carrying half of them. The other half you had to set down on the road, and you remember every face, in the order you set them down.", effects:{ stats:{ vitality:-6, renown:10, tether:-3 }, flags:{ add:["fifth_changed"] }, goto:"fv_resolve" } } },
    { label:"Teach them to walk without you, so the door opens for them, not for you.", hint:"Cunning. The trial is collective. Make it truly so.",
      check:{ stat:"cunning", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"They learn. They walk to the door without you, exactly as you hoped, and it opens for them, and closes.",
        fatalCause:"Left behind on the road of the Fifth Nightmare, after everyone else had gone through." },
      success:{ text:"It takes an age. Then a woman who was a Supreme in that lost age stands up on her own and starts walking, and another follows her, and the road fills with people who are walking for their own reasons. You walk somewhere in the middle, unremarkable, and the door opens for everyone at once.", effects:{ stats:{ cunning:6, renown:22 }, flags:{ add:["fifth_led"] }, goto:"fv_resolve" } },
      failure:{ text:"Most of them learn. A few never will, and you carry those in the end after all, the slow way.", effects:{ stats:{ cunning:2, renown:12, tether:-3 }, flags:{ add:["fifth_changed"] }, goto:"fv_resolve" } } },
  ]
},
{
  id:"fv_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Apotheosis",
  text:"The door closes behind you, and on the other side of it you are not human any more.\n\nThe Spell facilitates Apotheosis faster than anything you have ever experienced, and you do not get to steer it. A Spirit. A lesser god, a minor deity, as the old records put it, but something fundamentally different from a mortal, whose soul can encompass the whole world.\n\nThe waking world, your old world, will not hold you now. Its laws reject what you have become. You can look at it from the edge of the Dream Realm, the way you might look at a house you grew up in, through a window, from outside.\n\nNobody from this cycle of the Spell has ever come back from the Fifth Nightmare. Now one has.",
  choices:[
    { label:"Accept Apotheosis.", effects:{ rank:1, chapter:"sacred", stats:{ essence:20, renown:30, tether:-8 }, flags:{ add:["apotheosis"] }, conquered:true } },
  ]
},
  ],

  patch() {
    /* The offer stays where it is, in sv_fifth. Only the "Enter" choice is
       rewired from a single roll to the real Nightmare. */
    const offer = Pack.byId("sv_fifth");
    if (offer) offer.choices[0] = {
      label: "Enter the Seed and face the Fifth Nightmare.",
      hint: "Two trials. One alone, one together. Failing either is death.",
      effects: { nightmare: "fifth" },
    };
    /* Came out of both trials whole: the rarest thing in the game. */
    Hooks.on("choose", (s, ev) => {
      if (ev.id === "fv_resolve" && !s.flags.includes("fifth_changed") && !s.flags.includes("still_yourself"))
        s.flags.push("still_yourself");
    });
    Hooks.on("text", (str, s) => s?.current === "fv_resolve" && s.flags?.includes("fifth_changed") && str?.startsWith("The door closes")
      ? str + "\n\nSomething came through the door. It has your history and your Aspect and the shape of your intentions. Whether it is you is a question the Spell was never designed to answer."
      : s?.current === "fv_resolve" && str?.startsWith("The door closes")
        ? str + "\n\nAnd, against every expectation the Spell had of you, it is still you."
        : str);
  },
});
