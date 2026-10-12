/* =============================================================
   FOURTH NIGHTMARE — THE CROWN NOBODY WEARS
   An original scenario. Canon says almost nothing about how a
   Fourth Nightmare is built, only what it makes of you: "A Supreme
   is someone who expands their soul to dominate a portion of the
   world", and "the power of a Supreme is not personal ... it is a
   domain", spread through territory and people. So this Nightmare
   is a test of exactly that: a land that will become your Domain,
   or bury you. A Nightmare ends in conquest or death.
   Everything named here is ours. See docs/content/crown-nobody-wears.md.
   ============================================================= */
Pack.add({
  id: "crown-nobody-wears",

  nightmares: {
    fourth: [ { id:"qn_crown", name:"The Crown Nobody Wears", entry:"qn2_1" } ],
  },

  memories: {
    regent_seal: { name:"The Eighth Seal", type:"Charm", rank:"Supreme",
      desc:"The seal of a Regent who was never appointed. It fits no hand but yours, and every hand that has held it since has sworn to you.",
      stats:{ willpower:4, cunning:3, renown:4 } },
  },

  achievements: {
    crowned_by_consent: { name:"Crowned by Consent", desc:"Became a Sovereign by giving the crown of a Nightmare's kingdom to its people, and was given it back." },
  },

  events: [
{
  id:"qn2_1", scripted:true, once:true, days:20, fixedTime:true,
  title:"The Crown Nobody Wears",
  text:"Nobody else came through the Seed. You are alone in a kingdom the size of a continent.\n\nEvery city in it, every village and every farmhouse, is built facing the same way: toward a mountain at the centre of the world, and a throne on top of the mountain that has stood empty for nine thousand years.\n\nSeven Regents rule in the throne's name. They are Cursed-ranked, and old, and each of them governs a seventh of the land with perfect, tireless care. The people love them. The people also pray, every night, for the king who has not come.\n\nThe Spell says nothing. It does not need to. You know what a Fourth Nightmare is for. It is asking whether this land will become yours.",
  choices:[
    { label:"Climb the mountain and sit on the throne on the first day.", hint:"Willpower. Nine thousand years of waiting, and one chair.",
      check:{ stat:"willpower", dc:6, dcSelf:true },
      success:{ text:"You sit. The throne is cold, and the whole continent feels it. Every face in every city turns toward the mountain at once. The Regents arrive by nightfall, all seven, and kneel, and you understand from the way they kneel that they are waiting for you to make a mistake.", effects:{ stats:{ willpower:4, renown:4 }, flags:{ add:["crown_sat"] } } },
      failure:{ text:"You sit, and the throne does not accept you. It is not dramatic. It simply goes on being empty with you in it, and the Regents, when they arrive, are very polite about it.", effects:{ stats:{ willpower:-2, vitality:-3 } } },
      effects:{ goto:"qn2_2" } },
    { label:"Spend years walking the land and living among the people.", hint:"Perception. A Domain is made of people. Learn who they are.",
      check:{ stat:"perception", dc:5, dcSelf:true },
      success:{ text:"You walk for twenty years. You learn that the people are not waiting for a conqueror. They are waiting for someone who will stay. Every king in their songs was someone who came, and stayed, and was buried here.", effects:{ stats:{ perception:4, willpower:2 }, flags:{ add:["crown_walked"] } } },
      failure:{ text:"You walk for twenty years and remain a stranger the whole time. They are kind to strangers here. They are kind to them the way you are kind to weather.", effects:{ stats:{ perception:1 } } },
      effects:{ goto:"qn2_2" } },
    { label:"Challenge one of the seven Regents and take its seventh of the land.", hint:"Vitality. A Cursed-ranked thing, in its own territory.",
      check:{ stat:"vitality", dc:6, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"The Regent does not fight you. Its seventh of the land does: every road, every river and every person in it, all at once.",
        fatalCause:"Killed by a Regent of the Crown Nobody Wears, on its own ground." },
      success:{ text:"You kill the Regent of the eastern seventh after a battle that lasts a season. As it dies, it laughs, and says you are the second to do this. Then its body breaks apart into something you recognise: the shape of a human soul, stretched across a seventh of the world until it tore.", effects:{ stats:{ vitality:-6, renown:6 }, kill:{ rank:5, size:1 }, flags:{ add:["crown_regent"] } } },
      failure:{ text:"You wound it, and it withdraws into its land, and its land closes around it like a fist. You leave the eastern seventh on foot, and it lets you, which is worse.", effects:{ stats:{ vitality:-8, willpower:1 } } },
      effects:{ goto:"qn2_2" } },
  ]
},
{
  id:"qn2_2", scripted:true, once:true, days:40, fixedTime:true,
  title:"The Crown Nobody Wears",
  text:"A century passes. You learn the truth, slowly, the way you learn everything here.\n\nThe seven Regents were one person. A challenger, nine thousand years ago, who came through this Seed and tried to take the whole continent at once: to make every road and every life an extension of their own will. The land was too large. Their soul tore into seven pieces, and each piece went on ruling a seventh, faithfully, for ever, waiting for the throne to be filled by someone who would not tear.\n\nThat is the conflict. Not the Regents. The size of the thing you are trying to become.\n\nThe Regents have stopped being polite. If you are going to fail the way their maker did, they would like it to happen soon.",
  choices:[
    { label:"Take the land by force, one seventh at a time, and hold it together by will.", hint:"Willpower. The way the first challenger tried. You must not tear.",
      check:{ stat:"willpower", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You take the fourth seventh, and feel yourself begin to stretch, and you cannot stop. There are eight Regents now.",
        fatalCause:"Torn apart by the Crown Nobody Wears, and became its eighth Regent." },
      success:{ text:"You take the whole continent, seventh by seventh, over three hundred years, and you do not tear. When the last Regent kneels, it does not die. It folds back into you, all seven do, and you feel the first challenger's long faithful centuries settle into your soul like a weight you can carry.\n\nThe throne is warm. The Seed lets you go.\n\nThere have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ willpower:10, essence:14, renown:20 }, memory:"regent_seal", flags:{ add:["fourth"] }, conquered:true } },
      failure:{ text:"You hold. Barely. A seventh of you will always be standing on that mountain, keeping a land that no longer exists, and you will feel it there for the rest of your very long life.\n\nThe Seed lets you go. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ willpower:4, essence:8, renown:16, vitality:-10 }, flags:{ add:["fourth"] }, conquered:true } } },
    { label:"Govern the land through its people, one city at a time, until they choose you.", requires:{ flags:{ any:["crown_walked", "crown_sat"] } }, hint:"Cunning. A Domain made of loyalty, not of will.",
      check:{ stat:"cunning", dc:8, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"A city chooses you, then another. The Regents cannot allow a Domain that is not built the way theirs was. They come for you together.",
        fatalCause:"Killed by all seven Regents of the Crown Nobody Wears at once." },
      success:{ text:"It takes four hundred years. City by city, the people of the continent stop praying for a king and start bringing you their problems. One morning the Regents arrive at the mountain, all seven, and do not kneel. They sit down beside the throne, and rest, for the first time in nine thousand years.\n\nThe Seed lets you go. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ cunning:8, essence:14, renown:22 }, memory:"regent_seal", flags:{ add:["fourth"] }, conquered:true } },
      failure:{ text:"Half the continent chooses you. The other half chooses the Regents. The war that follows lasts sixty years, and you win it, and you never forgive yourself for how.\n\nThe Seed lets you go. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ cunning:3, essence:8, renown:12, vitality:-8 }, flags:{ add:["fourth"] }, conquered:true } } },
    { label:"Refuse the crown. Give the throne to the people and see what they do with it.", requires:{ flags:{ all:["crown_walked"] } }, hint:"Willpower. Everything you have climbed for, given away on purpose.",
      check:{ stat:"willpower", dc:10, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"The people take the throne. They do not know what to do with it, and neither do the Regents, and a continent that has faced one way for nine thousand years turns on itself.",
        fatalCause:"Killed in the collapse of the Crown Nobody Wears, after giving it away." },
      success:{ text:"You carry the throne down the mountain with your own hands and set it in the market square of the smallest town on the continent. Then you go home with the people who live there.\n\nNobody sits in it. Everybody touches it on the way past. In a hundred years the whole continent is facing the market square instead of the mountain, and in two hundred the people of the land come and ask you, very formally, to be the one who keeps the square safe.\n\nYou say yes. The Seed lets you go, with a Domain that was given to you rather than taken. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ willpower:10, essence:16, renown:26 }, memory:"regent_seal", flags:{ add:["fourth", "crowned_by_consent"] }, conquered:true } },
      failure:{ text:"Most of the land follows the throne down the mountain. The Regents do not. You spend a century keeping the peace between the two, and the Seed lets you go mid-sentence, in the middle of an argument you were winning.\n\nThere have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ willpower:4, essence:8, renown:14, vitality:-6 }, flags:{ add:["fourth"] }, conquered:true } } },
  ]
},
  ],
});
