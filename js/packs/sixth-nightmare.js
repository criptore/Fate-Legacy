/* =============================================================
   THE SIXTH NIGHTMARE — THE UNWRITTEN LAW
   Canon: "the Sixth Nightmare is the final Nightmare"; conquering it
   makes one Divine, "a true god whose essence encompasses all of
   existence, being woven into the universal laws" (wiki: Paths of
   Ascension). Human rank names stop before it: Divine "has no human
   name because no one has reached it".

   Canon says nothing about what the Sixth contains. Ours: a world
   with one law of existence missing, and the trial is to become
   that law. Until v0.5.0 the game reached Sacred and stopped: "Look
   for the Sixth" set a flag and led nowhere, and the Divine rank had
   no events at all. This pack adds the offer, the Nightmare, and a
   way for a Divine life to end. See docs/content/sixth-nightmare.md.
   ============================================================= */
Pack.add({
  id: "sixth-nightmare",

  nightmares: {
    sixth: [ { id:"sx_unwritten", name:"The Unwritten Law", entry:"sx_1" } ],
  },

  achievements: {
    divine: { name:"Divine", desc:"Conquered the Sixth Nightmare, the last one, and became a true god. There is no human word for what you are." },
    wrote_a_law: { name:"Author of a Law", desc:"Ended a Divine life by weaving yourself into the laws of existence." },
  },

  events: [
/* ---------- the offer ---------- */
{
  /* Not `once`: "Not yet" has to lead somewhere (see docs/development.md). */
  id:"sx_offer", chapter:"sacred", weight:20, cooldown:30, days:300,
  requires:{ flags:{ all:["seeking_sixth"], none:["declined_sixth"] }, stats:{ willpower:{ min:70 }, essence:{ min:70 } } },
  title:"The Last Door",
  text:"You have looked for it for millennia, and in the end it is not hidden at all. It is a Seed at the bottom of the Dream Realm, below the deepest Death Zone, below the dead gods' bones, in a place where the light behaves as if it is being watched.\n\nThe Sixth Nightmare. The last one. Nobody in the records of any cycle has come back from it with a name anyone wrote down.\n\nWhat waits beyond it is not a rank. It is the end of ranks. A god in the true sense, woven into the laws that make the world a world.",
  choices:[
    { label:"Enter the Seed and face the Sixth Nightmare.", hint:"The last trial there is. Almost certain death.",
      effects:{ nightmare:"sixth" } },
    { label:"Not yet. You have time. You have nothing but time.", effects:{ stats:{ willpower:4, essence:4 } } },
    { label:"Never. Stay a lesser god, and look after what you can reach.", effects:{ stats:{ renown:10, tether:2 }, flags:{ add:["declined_sixth"] } } },
  ]
},

/* ---------- the Nightmare ---------- */
{
  id:"sx_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Unwritten Law",
  text:"There is a world inside the Seed, and something is wrong with it, and it takes you a long time to see what.\n\nNothing here ends.\n\nThe sun has been setting for longer than your species has existed, and it has not set. A wave has been breaking on the same beach for an age, and it has not broken. A woman in a village by the sea has been dying for ten thousand years, and every person she ever loved is standing around her bed, unable to grieve, unable to leave, because the law that lets things end was never written into this world.\n\nThe Sixth Nightmare is not a monster or a riddle. It is a world with one law missing, and you are the only thing in it that knows what the law should say.",
  choices:[
    { label:"Sit with the dying woman, and understand what an ending is for.", hint:"Perception. You have watched a great many things end. Have you ever looked?",
      check:{ stat:"perception", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You sit with her, and look, and the world that cannot end closes around you too. You are still sitting there.",
        fatalCause:"Held for ever at a deathbed in the Sixth Nightmare, in a world where nothing ends." },
      success:{ text:"You sit with her for a thousand years. At the end of them you understand: an ending is not a loss. It is what lets everything before it have a shape. Without it, her whole life is a sentence that never reaches its full stop.", effects:{ stats:{ perception:8 }, flags:{ add:["sx_understood"] }, goto:"sx_2" } },
      failure:{ text:"You understand most of it, and the part you do not understand you take on trust. It is enough to stand up.", effects:{ stats:{ perception:3, tether:-2 }, goto:"sx_2" } } },
    { label:"Try to end one small thing by force, to prove it can be done.", hint:"Willpower. A wave that has never broken.",
      check:{ stat:"willpower", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You push the wave with everything a lesser god has. It does not break. You do.",
        fatalCause:"Broken against an unbreaking wave in the Sixth Nightmare." },
      success:{ text:"You put the whole weight of your Domain against a single wave, and after a century it breaks, and the sound of it falling onto the sand is the first ending this world has ever heard. Everything in the world turns to listen.", effects:{ stats:{ willpower:8 }, flags:{ add:["sx_forced"] }, goto:"sx_2" } },
      failure:{ text:"The wave half breaks. It hangs there, half fallen, for ever. It is enough to know it can be done.", effects:{ stats:{ willpower:3, tether:-2 }, goto:"sx_2" } } },
  ]
},
{
  id:"sx_2", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Unwritten Law",
  text:"The world knows what you are now. It has been waiting for someone like you for as long as it has existed, which is to say for ever, because nothing here ever stopped.\n\nTo write a law into existence, you have to become it. Not command it. Not enforce it. Be it, everywhere, in every sunset and every breaking wave and every deathbed, for as long as there is anything at all.\n\nWhoever you were will not survive that intact. The only question the Sixth Nightmare asks is what kind of law you will be.",
  choices:[
    { label:"Become a gentle law: let things end only when they are finished.", hint:"Willpower. Mercy, written into the world.",
      check:{ stat:"willpower", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You try to decide, for every thing in the world, when it is finished. There are too many things. You dissolve into the deciding.",
        fatalCause:"Dissolved into the Sixth Nightmare, trying to judge when everything was finished." },
      success:{ text:"The sun sets. The woman by the sea closes her eyes, and the people around her bed weep, and then, after a while, go home.\n\nYou are in all of it. You will be in all of it for ever. And somehow, at the centre of the law, there is still someone who remembers being afraid of the dark.", effects:{ goto:"sx_resolve", flags:{ add:["sx_gentle"] } } },
      failure:{ text:"The law you become is a little crueler than you meant. Things end slightly before they are ready. You will notice that in every sunset for the rest of time.", effects:{ goto:"sx_resolve", stats:{ tether:-4 } } } },
    { label:"Become an exact law: everything ends, all of it, in its time, without exception.", hint:"Cunning. A law with no judgment in it cannot be wrong.",
      check:{ stat:"cunning", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You write the law exactly, without exception. It has no exception for you either, and you were the first thing it reached.",
        fatalCause:"Ended by the law you wrote in the Sixth Nightmare. It had no exceptions." },
      success:{ text:"You write it the way you once wrote a battle plan: no exceptions, no favourites, every ending at its proper time. The world lets out a breath it has held since it began.\n\nThe law is perfect. You are mostly the law now, and only a little bit you, and the little bit is enough to be glad.", effects:{ goto:"sx_resolve", flags:{ add:["sx_exact"] } } },
      failure:{ text:"The law works. It has one exception in it, and the exception is you, and you will never be sure whether that is a flaw or a mercy.", effects:{ goto:"sx_resolve", stats:{ tether:-4 } } } },
  ]
},
{
  id:"sx_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Divine",
  text:"The Seed lets you go, and there is nothing to go back to that is the right size for you any more.\n\nDivine. A true god, woven into the laws that make the world a world. There is no human name for this rank, because no one ever reached it to need one.\n\nYou can feel every ending in existence the way you once felt your own pulse.",
  choices:[
    { label:"Accept it.", effects:{ rank:1, chapter:"divine", stats:{ essence:40, willpower:20, renown:40 }, flags:{ add:["divine"] }, conquered:true, goto:"dv_first" } },
  ]
},

/* ---------- a Divine life ---------- */
{
  id:"dv_first", chapter:"divine", weight:60, once:true, days:10,
  title:"What Is A God For",
  text:"You are a god. The Dream Realm bends a little around you wherever you stand. Lesser gods avoid your gaze. The Spell, for the first time since it took you at seventeen, has nothing to say to you at all.\n\nThere is nobody to report to, and no rank above you, and no Nightmare left. For the first time in your existence, every choice is entirely yours.",
  choices:[
    { label:"Watch over the people who are still climbing.", effects:{ stats:{ renown:20, tether:4 }, flags:{ add:["divine_watcher"] } } },
    { label:"Go to the edges of the Dream Realm and see what nobody has seen.", effects:{ stats:{ perception:12, essence:10 }, flags:{ add:["divine_wanderer"] } } },
    { label:"Do nothing at all for a thousand years, and find out who you are now.", effects:{ stats:{ willpower:12 }, flags:{ add:["divine_still"] } } },
  ]
},
{
  id:"dv_ages", chapter:"divine", weight:30, cooldown:20, days:300,
  title:"Ages",
  text:"Civilisations rise in the Dream Realm, and fall, and rise again somewhere else. Some of them pray to you, under names you never chose. Some of them have never heard of you.\n\nThe Spell takes another generation of seventeen-year-olds. Most of them die in their First Nightmare. You feel every one of those endings, because that is what you are now.",
  variants:[
    "A Sovereign you once knew as an Awakened child conquers her Fifth Nightmare, and comes to find you, and asks what it is like. You find that you do not know how to answer in words.",
    "Somewhere very far down in the Dream Realm, something old stirs, notices you, and goes back to sleep. You are not sure which of you was more relieved.",
  ],
  choices:[
    { label:"Answer a prayer, quietly, without saying who you are.", effects:{ stats:{ renown:6, tether:2 } } },
    { label:"Let the ages go by, and keep the law.", effects:{ stats:{ willpower:6, essence:6 } } },
    { label:"Weave yourself fully into the law, and let the person you were come to an end.", hint:"This ends the life you are playing.",
      effects:{ flags:{ add:["wrote_a_law"] }, death:{ kind:"woven", text:"You let go of the last of the person you were, and become entirely the law you wrote. Somewhere, every sunset is a little kinder for it. Nobody will ever know your name, and that was the point." } } },
  ]
},
  ],

  patch() {
    /* Divine is the most impressive thing a life can do, so its achievement
       goes first on the end screen (ACHIEVEMENTS is shown in key order). */
    const rest = Object.entries(ACHIEVEMENTS).filter(([k]) => k !== "divine");
    for (const [k] of rest) delete ACHIEVEMENTS[k];
    for (const [k, v] of rest) ACHIEVEMENTS[k] = v;
  },
});
