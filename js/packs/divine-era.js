/* =============================================================
   THE DIVINE ERA
   What a true god does with forever. The Sixth Nightmare pack makes
   the Divine rank reachable and gives it two events and one ending;
   this pack gives a Divine life variety and a second way to end.

   Canon is nearly silent here: Divine is "a true god whose essence
   encompasses all of existence, being woven into the universal
   laws", and no human has ever reached it. So everything below is
   ours, kept deliberately small and human, and it stays clear of
   the novel's late-story revelations about the Spell and what lies
   beyond the last Nightmare. See docs/content/divine-era.md.

   Needs a Divine life to exist, so it does nothing until the Sixth
   Nightmare pack is in the game.
   ============================================================= */
Pack.add({
  id: "divine-era",

  achievements: {
    watched_over: { name:"Someone Was Watching", desc:"As a god, stood unseen beside a seventeen-year-old in their First Nightmare." },
    went_beyond: { name:"Beyond The Edge", desc:"Ended a Divine life by walking past the edge of the Dream Realm, to see what nobody has seen." },
  },

  events: [
{
  id:"dv_aspirant", chapter:"divine", weight:22, cooldown:30, days:200,
  title:"A First Nightmare, From Outside",
  text:"A seventeen-year-old somewhere in the waking world has just been infected. You feel it the way you feel every beginning now.\n\nTonight they will fall asleep and wake inside their First Nightmare, alone, with one creature and one conflict made to fit them exactly. You remember yours. You remember being sure you would die.\n\nYou could be there. Not to help. The Spell would not allow that, and it would not be their trial any more. Just there.",
  variants:[
    "Another First Nightmare is beginning, in a city on the coast, for a boy who has spent the whole week pretending he is not afraid.\n\nYou remember pretending.",
    "A girl from the outskirts has drawn her First Nightmare tonight. Very few people from the outskirts survive it. You were one of the ones who did, once, a very long time ago, and she will never know that.",
  ],
  choices:[
    { label:"Stand beside them, unseen, for the whole of it.", effects:{ stats:{ willpower:6, tether:2 }, flags:{ add:["watched_over"] } },
      text:"They never know you are there. They make every choice on their own, and some of the choices are wrong. When they come out the other side, shaking and alive, you are the only one in the world who saw how brave they were." },
    { label:"Let it be. Every Aspirant faces the dark alone. That is the point.", effects:{ stats:{ willpower:4, essence:6 } } },
  ]
},
{
  id:"dv_mortal", chapter:"divine", weight:14, cooldown:60, days:400,
  title:"A Small Life",
  text:"You could do this. Fold yourself down to the size of a person, forget most of what you are for a while, and live one ordinary life somewhere in the Dream Realm's human settlements. Eighty years. A trade. A house. Neighbours who think you are a little strange.\n\nThe law you wrote would keep working without you. It does not need you to be watching.",
  choices:[
    { label:"Do it. Live one small life, all the way through.", effects:{ stats:{ tether:6, willpower:8, renown:-10 } },
      text:"You are a cooper in a river town for eighty-one years. You marry. You are bad at it, then better. When the small life ends, you come back to being a god, and you find that you are a slightly different one." },
    { label:"No. You have been small before. You know how it ends.", effects:{ stats:{ essence:8 } } },
  ]
},
{
  id:"dv_lesser", chapter:"divine", weight:14, cooldown:50, days:600,
  title:"A Lesser God Asks",
  text:"A Sacred comes to you. She was a Sovereign once, and before that a Saint, and before that a seventeen-year-old from a citadel ward, and she has been a lesser god for nine thousand years.\n\nShe has found the last door, the Sixth Seed. She wants to know what is inside it, and whether she should go.",
  choices:[
    { label:"Tell her the truth: what it cost, and what it made of you.", effects:{ stats:{ renown:10, willpower:4 } },
      text:"She listens to all of it. Then she thanks you, and goes home, and you never find out whether she went in. You decide that this is the right way for it to be." },
    { label:"Tell her nothing. The Sixth Nightmare should be met with no warning, as you met it.", effects:{ stats:{ cunning:4, essence:6 } } },
    { label:"Tell her not to go.", effects:{ stats:{ tether:2, renown:4 } },
      text:"She does not go. She lives another forty thousand years as a lesser god, and is, by every account, a good one. You will never know if you were right." },
  ]
},
{
  id:"dv_edge", chapter:"divine", weight:10, cooldown:80, days:800,
  title:"The Edge",
  text:"The Dream Realm has an edge. You have walked most of it now. Beyond it is something that is not darkness and not light, and nothing you have ever been has a word for it.\n\nYou could step over. You do not know what is there. That is the first time in a very long time you have not known something, and you find that you have missed the feeling.",
  choices:[
    { label:"Not yet. Turn back, and keep the law a while longer.", effects:{ stats:{ willpower:6, essence:6 } } },
    { label:"Step over the edge, and find out.", hint:"This ends the life you are playing.",
      effects:{ flags:{ add:["went_beyond"] }, death:{ kind:"beyond", text:"You stepped past the edge of the Dream Realm, into whatever is beyond it, to see what nobody has seen. The law you wrote keeps working. Whatever you found out there, you found it as yourself." } } },
  ]
},
  ],
});
