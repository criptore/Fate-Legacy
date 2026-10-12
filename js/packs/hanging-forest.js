/* =============================================================
   SOLSTICE REGION — THE HANGING FOREST
   An original Dream Realm region, built to the pattern canon gives
   (Forgotten Shore, Dark City): one landscape, one dominant hazard,
   a Gateway a long way from where Sleepers land, and creatures of
   the Dormant and Awakened ranks only (no Death Zone ranks for a
   Sleeper's first solstice). Ends at sl_return, like every region.
   Everything named here is ours. See docs/content/hanging-forest.md.
   ============================================================= */
Pack.add({
  id: "hanging-forest",

  solstice: [
    { id:"sol_hanging", name:"The Hanging Forest", entry:"hf_1",
      blurb:"A forest that grows downward from a ceiling of stone, and the ground is a very long way below it." },
  ],

  memories: {
    rootsilk: { name:"Rootsilk Line", type:"Utility", rank:"Dormant",
      desc:"A coil of the pale thread the forest grows between its branches. It holds anything, and it always knows which way is down.",
      stats:{ vitality:1, perception:2 } },
  },

  echoes: {
    canopy_crawler: { name:"A Canopy Crawler", rank:"Dormant", bound:1,
      desc:"A copy of a long-legged thing that lived upside down its whole life. It still walks on the underside of things, when it can.",
      stats:{ perception:2, cunning:1 } },
  },

  achievements: {
    climbed_down: { name:"All The Way Down", desc:"Climbed down the Hanging Forest on your first solstice, branch by branch, to the Gateway at the bottom." },
  },

  events: [
{
  id:"hf_1", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Hanging Forest",
  text:"You wake lying on your back in a bed of leaves, looking down.\n\nIt takes your stomach a long moment to agree with your eyes. The leaves are not on the ground. You are lying in the crown of a tree that grows downward, from a ceiling of grey stone that stretches in every direction like a sky. Thousands of trees hang from it, trunks pointing at the earth, branches spread beneath you like the floors of a building with no walls.\n\nFar below, so far that it is blue with distance, is the ground. Somewhere down there is the Gateway.\n\nYou can hear other Sleepers waking in the canopy around you. One of them is screaming. One of them has already started to climb.",
  choices:[
    { label:"Call out and gather the others before anyone climbs.", hint:"Willpower. Frightened people, a very long drop.",
      check:{ stat:"willpower", dc:8 },
      success:{ text:"Six of them answer, and you get them all onto the same branch before anyone falls. A girl from a citadel ward has already worked out that the pale threads between the branches will hold weight.", effects:{ stats:{ willpower:2, renown:2 }, flags:{ add:["hf_band"] } } },
      failure:{ text:"Two answer. The rest are too frightened to hear you, and the one who was screaming stops, which is worse.", effects:{ stats:{ willpower:-1 } } },
      effects:{ goto:"hf_2" } },
    { label:"Climb down alone, right now, before the forest wakes up.",
      effects:{ stats:{ vitality:1, cunning:1 }, flags:{ add:["hf_alone"] }, goto:"hf_2" } },
    { label:"Lie still and watch how the forest moves before you touch it.", hint:"Perception",
      check:{ stat:"perception", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"You lie still for an hour. Something that lives on the underside of the branch you are lying on decides that stillness means food.",
        fatalCause:"Taken from beneath, in the crown of the Hanging Forest." },
      success:{ text:"The pale threads between the branches are not spider silk. The forest grows them, and things travel along their undersides, upside down, long-legged and patient. They only strike at what shakes the threads. Climb on the bark, never the silk.", effects:{ stats:{ perception:3 }, flags:{ add:["hf_silk"] } } },
      failure:{ text:"You watch until your nerve gives out, and learn only that some of the branches are moving when there is no wind.", effects:{ stats:{ willpower:-1 } } },
      effects:{ goto:"hf_2" } },
  ]
},
{
  id:"hf_2", scripted:true, once:true, days:5, fixedTime:true,
  title:"The Hanging Forest",
  text:"Five days of climbing, and the ground is still blue with distance.\n\nYou sleep tied to branches. You drink the water that collects in the cupped leaves. The light comes from nowhere in particular and never quite changes.\n\nToday the trunk you have been following ends. Below it is a gap of open air, a hundred feet wide, and on the other side the next tree begins. The only way across is a rope of pale forest silk, and something long-legged is hanging from the underside of it, very still, in the middle.",
  choices:[
    { label:"Cross on the silk, slowly, and hope it does not feel you.", hint:"Vitality. A hundred feet, hand over hand.",
      check:{ stat:"vitality", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"Halfway across, the silk twitches. Then the thing under it turns over.",
        fatalCause:"Pulled from the silk over the gap in the Hanging Forest." },
      success:{ text:"You cross with your heart in your teeth. The thing under the silk never moves. When you reach the far trunk you cut a length of the silk to take with you, and it coils into your hand as if it had been waiting.", effects:{ stats:{ vitality:1, perception:1 }, memory:"rootsilk", flags:{ add:["hf_crossed"] } } },
      failure:{ text:"You get across with skinned palms and a cramp in both forearms that lasts three days.", effects:{ stats:{ vitality:-2 } } },
      effects:{ goto:"hf_3" } },
    { label:"Kill the thing on the silk first, while it is still asleep.", hint:"Vitality. A Dormant Beast, on its own rope, upside down.",
      check:{ stat:"vitality", dc:12, fatal:2, fatalKind:"dream_realm",
        fatalText:"It was not asleep.",
        fatalCause:"Killed by a canopy crawler in the Hanging Forest." },
      success:{ text:"You reach it along the top of the silk and drive a sharpened branch into it where its legs join, and it falls without a sound into the blue. That night its Echo comes to you, and hangs upside down from the branch above your head, keeping watch.", effects:{ stats:{ vitality:-2, renown:2 }, kill:{ rank:0, size:2 }, echo:"canopy_crawler", flags:{ add:["blooded"] } } },
      failure:{ text:"You wound it, and it drops away into the blue, and you spend the rest of the day expecting it to climb back up.", effects:{ stats:{ vitality:-3 } } },
      effects:{ goto:"hf_3" } },
    { label:"Climb the long way round, over the bark, the way the forest taught you.", requires:{ flags:{ all:["hf_silk"] } }, hint:"Perception. Slower, and nothing on the bark has ever noticed anyone.",
      effects:{ stats:{ perception:2, cunning:1 }, flags:{ add:["hf_bark"] }, goto:"hf_3" } },
  ]
},
{
  id:"hf_3", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Gateway",
  text:"The lowest branches of the lowest trees do not reach the ground. They stop sixty feet above it, over a meadow of grey grass, and in the middle of the meadow stands the Gateway: a ring of white stone, humming.\n\nThe meadow is full of things that cannot climb. They are Awakened-ranked, low and heavy, and they have been waiting a very long time for something to drop.\n\nForty Sleepers are hanging in the branches above the meadow, looking down, and nobody wants to be first.",
  choices:[
    { label:"Drop and run for the Gateway.", hint:"Vitality. Sixty feet down, then a sprint.",
      check:{ stat:"vitality", dc:12, fatal:2, fatalKind:"dream_realm",
        fatalText:"You land well. You run well. The meadow is wider than it looked from above.",
        fatalCause:"Caught in the meadow below the Hanging Forest, short of the Gateway." },
      success:{ text:"You drop, roll, and run, and the grey grass erupts behind you as the meadow wakes. The Gateway takes you mid-stride.", effects:{ stats:{ vitality:-1, renown:3 }, flags:{ add:["climbed_down"] }, goto:"sl_return" } },
      failure:{ text:"You make the Gateway with something's teeth in your coat, and leave the coat behind.", effects:{ stats:{ vitality:-4 }, flags:{ add:["climbed_down"] }, goto:"sl_return" } } },
    { label:"Lower everyone down on forest silk, right beside the Gateway.", requires:{ flags:{ any:["hf_crossed", "hf_band"] } }, hint:"Cunning. A rope, a branch, and forty people who have to trust you.",
      check:{ stat:"cunning", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"The silk holds. The branch it is tied to does not.",
        fatalCause:"Fell with the silk rope above the Gateway of the Hanging Forest." },
      success:{ text:"You find a branch that hangs almost over the Gateway and rig a line of silk from it. One by one, forty Sleepers slide down into the white ring before the things in the meadow work out what is happening. You go last.", effects:{ stats:{ cunning:2, renown:5 }, flags:{ add:["climbed_down", "carried_them"] }, goto:"sl_return" } },
      failure:{ text:"Thirty get down before the meadow notices. You are thirty-first, and the last ten feet are a fall.", effects:{ stats:{ vitality:-3, renown:2 }, flags:{ add:["climbed_down"] }, goto:"sl_return" } } },
    { label:"Wait for someone else to drop first, and run while the meadow is busy.", hint:"Cunning. Not proud. Alive.",
      check:{ stat:"cunning", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"Everyone else has the same idea. When somebody finally drops, they all drop at once, and so does the meadow.",
        fatalCause:"Killed in the rush below the Hanging Forest." },
      success:{ text:"A boy drops first, and runs, and makes it. In the moment the meadow turns toward him, you drop and run the other way round the ring. You do not look back at what happens to the ones behind you.", effects:{ stats:{ cunning:3 }, flags:{ add:["left_them"] }, goto:"sl_return" } },
      failure:{ text:"You wait too long. When you finally go, the meadow is awake and furious, and you reach the Gateway on three good limbs.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
  ]
},
  ],
});
