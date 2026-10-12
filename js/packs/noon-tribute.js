/* =============================================================
   SECOND NIGHTMARE — THE NOON TRIBUTE
   An original scenario, built to canon's Second Nightmare format:
   a Seed in the Dream Realm, several challengers, a role assigned
   by the Spell, Creatures of the Fallen and Corrupted ranks, and one
   central conflict with more than one way to resolve it ("there is
   no right or wrong way"). A Nightmare ends in conquest or death.
   Everything named here is ours. See docs/content/noon-tribute.md.
   ============================================================= */
Pack.add({
  id: "noon-tribute",

  nightmares: {
    second: [ { id:"sn_noon", name:"The Noon Tribute", entry:"sn4_1" } ],
  },

  memories: {
    noon_bell: { name:"The Noon Bell's Tongue", type:"Weapon", rank:"Awakened",
      desc:"The clapper of a bell that rang the hour of tribute for three hundred years. It still swings toward whoever is next.",
      stats:{ willpower:2, perception:2 } },
  },

  echoes: {
    siege_warden: { name:"A Warden of the Outer Wall", rank:"Awakened", bound:3,
      desc:"A copy of one of the things that walked the siege lines for three centuries. It still faces outward, toward nothing.",
      stats:{ vitality:3, perception:2 } },
  },

  achievements: {
    ended_the_siege: { name:"Ended the Siege", desc:"Broke a three-hundred-year siege in the Noon Tribute, and nobody else went out of the gate at noon." },
  },

  events: [
{
  id:"sn4_1", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Noon Tribute",
  text:"You wake on a city wall with a spear in your hand and a name on your armour that is not yours. The Spell has made you a soldier of Varrow, a walled city that has been under siege for three hundred years, and it has not told you anything else.\n\nOutside the walls, as far as you can see, the plain is grey and moving. Fallen-ranked things walk the siege lines in a slow circle that never ends. They never attack.\n\nThey do not need to. Every day at noon, the gate opens, and the city sends one citizen out, chosen by lot. The thing that leads the siege takes them, and the circle keeps walking for another day.\n\nFive other challengers woke inside Varrow with you. You can tell them apart from the citizens: they are the only ones who look surprised.",
  choices:[
    { label:"Find the other challengers and agree on a plan before noon.", hint:"Cunning. Six strangers, one city, very little time.",
      check:{ stat:"cunning", dc:15 },
      success:{ text:"By the second bell you have five names and five Aspects, and nobody has tried to kill anybody. Two of them have already noticed that the lottery is rigged. Nobody yet knows by whom.", effects:{ stats:{ cunning:2, renown:2 }, flags:{ add:["noon_allies"] } } },
      failure:{ text:"Two of them will talk to you. The other three have already decided this is the kind of Nightmare where the other challengers are the competition, and they may be right.", effects:{ stats:{ willpower:1 } } },
      effects:{ goto:"sn4_2" } },
    { label:"Climb the outer tower and watch the siege lines.", hint:"Perception. Learn what is out there before it learns you.",
      check:{ stat:"perception", dc:15 },
      success:{ text:"The circle is not random. Every walker is spaced exactly as far from the next as the city's gate is wide. And the thing at the centre, the one that takes the tribute, never once looks at the city. It looks at the clock tower.", effects:{ stats:{ perception:3 }, flags:{ add:["noon_watched"] } } },
      failure:{ text:"You watch for six hours. They walk. That is all you learn, and the noon bell rings while you are still up there.", effects:{ stats:{ vitality:-1 } } },
      effects:{ goto:"sn4_2" } },
    { label:"Volunteer for today's lottery, to see who draws the lots.", hint:"Willpower. The draw is public. So is your face.",
      effects:{ stats:{ willpower:2, renown:1 }, flags:{ add:["noon_volunteered"] }, goto:"sn4_2" } },
  ]
},
{
  id:"sn4_2", scripted:true, once:true, days:20, fixedTime:true,
  title:"The Noon Tribute",
  text:"Twenty days in, and you understand Varrow better than you would like to.\n\nThe lottery is drawn in the clock tower by the city's founder, an old woman called the Keeper of Hours, who has been alive for all three hundred years of the siege and does not seem to find that strange. The citizens love her. She is the reason, they say, that the city still stands.\n\nYesterday the lot fell on a child. One of the other challengers stepped out of the gate in the child's place and did not come back. The siege did not seem to notice the difference, and that frightened you more than anything else here.\n\nThe things outside are getting closer. The circle is a little tighter every day.",
  choices:[
    { label:"Break into the clock tower at night and search the Keeper's rooms.", hint:"Perception. She has had three hundred years to hide things well.",
      check:{ stat:"perception", dc:17, fatal:5, fatalKind:"nightmare",
        fatalText:"The tower is not empty at night. Something that keeps the hours keeps them very carefully, and it does not like being interrupted.",
        fatalCause:"Killed in the clock tower of Varrow, in the dark, by the thing that keeps its hours." },
      success:{ text:"Under the clockwork you find a ledger of every tribute ever sent out, three hundred years of names. And on the first page, in the Keeper's own hand, a promise: one life a day, for as long as Varrow stands. Signed by her, and by something else.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["noon_pact"] } } },
      failure:{ text:"You get as far as the clockwork before you hear it moving above you, and you leave faster than you came, with a cut along your ribs that will take weeks to close.", effects:{ stats:{ vitality:-4 } } },
      effects:{ goto:"sn4_3" } },
    { label:"Go out at night and fight one of the siege walkers.", hint:"Vitality. A Fallen-ranked thing, alone, in the dark.",
      check:{ stat:"vitality", dc:17, fatal:5, fatalKind:"nightmare",
        fatalText:"You reach the circle. The circle closes. It has been waiting three hundred years for someone stupid enough to leave the walls at night.",
        fatalCause:"Torn apart on the siege lines outside Varrow." },
      success:{ text:"It dies slowly and without a sound. When it falls, the walkers on either side of it close the gap at once, as if they had been told to, and keep walking. The circle is a single thing wearing many bodies.", effects:{ stats:{ vitality:-4, renown:4 }, kill:{ rank:2, size:2 }, echo:"siege_warden", flags:{ add:["noon_blooded"] } } },
      failure:{ text:"You wound it and run. It does not follow. Nothing out there has ever needed to follow.", effects:{ stats:{ vitality:-5, willpower:1 } } },
      effects:{ goto:"sn4_3" } },
    { label:"Spend the days with the citizens and learn what they believe.", hint:"Willpower. They will tell you a great deal, if you can stand to hear it.",
      check:{ stat:"willpower", dc:16 },
      success:{ text:"They know. Not all of it, but enough: a tribute for every day of safety, agreed to by their great-great-grandparents, and kept faithfully ever since. They think it is a fair price. Some of them think it is a holy one.", effects:{ stats:{ willpower:3, renown:2 }, flags:{ add:["noon_heard"] } } },
      failure:{ text:"They are kind to you, and they tell you nothing, and on the twentieth day a woman you shared bread with draws the lot and walks out through the gate smiling.", effects:{ stats:{ willpower:-1, vitality:-1 } } },
      effects:{ goto:"sn4_3" } },
  ]
},
{
  id:"sn4_3", scripted:true, once:true, days:3, fixedTime:true,
  title:"The Noon Tribute",
  text:"The conflict is the tribute.\n\nVarrow survives because it feeds the siege one life a day, and the siege survives because Varrow feeds it. The Keeper of Hours made that bargain three hundred years ago with the Corrupted thing at the centre of the circle, and the whole city has been built around keeping it.\n\nTomorrow the circle will be close enough to touch the walls. The Keeper says that has never happened before. She says it the way people say things they have been dreading for a very long time.\n\nAt noon, the gate opens. This is the last noon you can do anything about.",
  choices:[
    { label:"Tear up the pact in front of the Keeper and the whole city.", requires:{ flags:{ all:["noon_pact"] } }, hint:"Cunning. A bargain this old has a weak point. Find it and press.",
      check:{ stat:"cunning", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You tear the page. The pact was not the page. It was the city, and the city does not forgive you for it.",
        fatalCause:"Killed by the people of Varrow, for ending the bargain that kept them alive." },
      success:{ text:"You read the pact aloud from the clock tower, every word, and the second signature with it. The citizens go very quiet. Then the Keeper of Hours, who has drawn ten thousand lots, picks up the last one and draws her own name.\n\nShe walks out of the gate at noon. The circle takes her and stops walking. The things on the plain lie down where they stand, and they do not get up again.", effects:{ stats:{ cunning:4, renown:8 }, memory:"noon_bell", flags:{ add:["ended_the_siege"] }, goto:"sn_resolve" } },
      failure:{ text:"The city turns on you, and then, slowly, on the Keeper. You are not the one who ends it. You only start it. By the time the circle stops walking, half of Varrow is gone, and so is most of your left hand.", effects:{ stats:{ vitality:-8, cunning:2 }, goto:"sn_resolve" } } },
    { label:"Walk out of the gate at noon yourself, and fight what takes the tribute.", hint:"Willpower. A Corrupted thing, at the centre of a circle of its own.",
      check:{ stat:"willpower", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You walk out at noon. The circle takes you, the way it has taken everyone else, and keeps walking.",
        fatalCause:"Taken at noon by the thing at the centre of the siege of Varrow." },
      success:{ text:"It is Corrupted, and old, and it has never once had to fight for its tribute. That turns out to matter. It takes you a full day, and the walls of Varrow are lined with people watching, and when it finally dies the circle stops as if a clock had run down.", effects:{ stats:{ willpower:4, renown:8, vitality:-4 }, kill:{ rank:3, size:1 }, flags:{ add:["ended_the_siege"] }, goto:"sn_resolve" } },
      failure:{ text:"You kill it. You do not walk back in. The other challengers carry you, and it is a week before you can stand, and the Seed resolves around you while you are still lying on the gate road.", effects:{ stats:{ vitality:-10, willpower:2 }, kill:{ rank:3, size:1 }, goto:"sn_resolve" } } },
    { label:"Open the gate for good and lead the whole city out across the plain.", requires:{ flags:{ any:["noon_heard", "noon_allies"] } }, hint:"Willpower. Ten thousand people who have never left the walls.",
      check:{ stat:"willpower", dc:5, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"The gate opens. The circle closes. Ten thousand people learn in one afternoon why their ancestors made the bargain.",
        fatalCause:"Killed on the plain outside Varrow, leading its people out." },
      success:{ text:"You and the other challengers form a column and walk the whole city out at noon, with the siege walking alongside. The circle does not know what to do with ten thousand tributes at once. It hesitates, for the first time in three hundred years, and in that hesitation you get everyone across.\n\nBehind you, Varrow stands empty, and the circle walks around nothing for ever.", effects:{ stats:{ willpower:4, renown:10 }, flags:{ add:["ended_the_siege", "carried_them"] }, goto:"sn_resolve" } },
      failure:{ text:"Most of them make it. You know the number that did not, and you will know it for the rest of your life. The Seed resolves on the far side of the plain, with you on your knees in the grass.", effects:{ stats:{ vitality:-7, willpower:-1, renown:4 }, goto:"sn_resolve" } } },
    { label:"Let the Keeper draw the lot as always, and use the hour to slip out unseen.", hint:"There is no slipping out of a Nightmare. You have to end it.",
      check:{ stat:"cunning", dc:7, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You slip out. The plain is the Nightmare too. The circle notices one small thing walking where it should not, and that is the end of it.",
        fatalCause:"Caught on the plain outside Varrow, trying to leave a Nightmare without ending it." },
      success:{ text:"You get out, and the plain does not end, and you understand at last that there is no outside to a Nightmare. So you turn round, walk back to the circle from behind, and do the one thing nobody inside the walls ever could: you reach the thing at the centre while it is looking at the clock tower.", effects:{ stats:{ cunning:4, renown:6 }, kill:{ rank:3, size:1 }, flags:{ add:["ended_the_siege"] }, goto:"sn_resolve" } },
      failure:{ text:"You are seen. You run back inside before the gate closes, wounded and ashamed, and that night the other challengers end it without you. The Seed resolves anyway; it does not care who did the work.", effects:{ stats:{ vitality:-6, renown:-4 }, goto:"sn_resolve" } } },
  ]
},
  ],
});
