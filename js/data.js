/* =============================================================
   FATE LEGACY — CONTENT
   Data only. No logic. Every balance number below is annotated
   with the canon it comes from (wiki page or novel chapter).
   ============================================================= */

/* -------------------------------------------------------------
   SOUL RANKS

   Ladder (wiki: Paths of Ascension):
     Aspirant  -> First Nightmare  -> Sleeper   (Dormant, Aspect + Flaw)
     Sleeper   -> winter solstice, Dream Realm, and back -> Awakened
     Awakened  -> Second Nightmare -> Master    (Ascended)
     Master    -> Third Nightmare  -> Saint     (Transcendent)
     Saint     -> Fourth Nightmare -> Sovereign (Supreme)
     Sovereign -> Fifth Nightmare  -> Sacred    (godhood / Apotheosis)
     Sacred    -> Sixth Nightmare  -> Divine

   lifespan  : years. Canon states only that Awakened "have longer
               lifespans than humans, but the exact amount was
               unknown" — the numbers are ours.
   timeScale : how far apart decisions sit at this rank.
   tetherLoss: canon — each rank shifts the balance away from the
               waking world. Masters leave a tether behind, Saints
               are miniature Gateways, Supremes are tied to the
               Dream Realm instead of Earth. (wiki: Nightmare Spell)
------------------------------------------------------------- */
const RANKS = [
  { id:"dormant",      name:"Dormant",      common:"Sleeper",   lifespan:85,    timeScale:1,    tetherLoss:0 },
  { id:"awakened",     name:"Awakened",     common:"Awakened",  lifespan:140,   timeScale:12,    tetherLoss:1 },
  { id:"ascended",     name:"Ascended",     common:"Master",    lifespan:320,   timeScale:34,   tetherLoss:2 },
  { id:"transcendent", name:"Transcendent", common:"Saint",     lifespan:900,   timeScale:90,   tetherLoss:3 },
  { id:"supreme",      name:"Supreme",      common:"Sovereign", lifespan:6000,  timeScale:520,  tetherLoss:4 },
  { id:"sacred",       name:"Sacred",       common:"Sacred",    lifespan:40000, timeScale:1200, tetherLoss:0 },
  { id:"divine",       name:"Divine",       common:"Divine",    lifespan:null,  timeScale:6000, tetherLoss:0 },
];

const STATS = [
  { id:"vitality",   name:"Vitality",     short:"VIT", hud:true,  min:0, max:99, desc:"Body and blood. At zero you die." },
  { id:"willpower",  name:"Willpower",    short:"WIL", hud:true,  min:0, max:99, desc:"The soul's spine. Governs Nightmare survival." },
  { id:"perception", name:"Perception",   short:"PER", hud:true,  min:0, max:99, desc:"What you notice before it notices you." },
  { id:"cunning",    name:"Cunning",      short:"CUN", hud:false, min:0, max:99, desc:"Leverage over people and situations." },
  { id:"essence",    name:"Soul Essence", short:"ESS", hud:true,  min:0, max:99, desc:"Drawn from your Soul Core. Everything costs it." },
  { id:"renown",     name:"Renown",       short:"REN", hud:false, min:0, max:99, desc:"What the Awakened world thinks it knows about you." },
  { id:"tether",     name:"Tether",       short:"TET", hud:false, min:0, max:20, desc:"What still holds you to the waking world. It thins as you climb." },
];

/* -------------------------------------------------------------
   ORIGINS
   Canon: "Very few people from the outskirts survive the First
   Nightmare" (ch. 1977). Great Clan scions inherit lineage
   Attributes, and in recent years many "challenged the First
   Nightmare by simply requesting it from the great clans" with
   full support behind them. So where you were born is, bluntly,
   the difficulty setting.
------------------------------------------------------------- */
const ORIGINS = [
  /* Underfed, untrained, uninformed — the three things the First Nightmare
     punishes. Hard living buys willpower and cunning and nothing else, and it
     does not come close to covering the difference. */
  { id:"outskirts", name:"The Outskirts",
    desc:"No clan, no training, no one coming, and never quite enough food. Very few from the outskirts survive the First Nightmare.",
    stats:{ cunning:3, willpower:2, perception:1, vitality:-2, renown:-3 }, flags:["outskirts"] },
  { id:"citadel", name:"A Citadel Ward",
    desc:"Fed, schooled, and told what the Spell is before it takes you. The ordinary road.",
    stats:{ vitality:1, willpower:1, perception:1, renown:1 }, flags:["citadel"] },
  /* Canon: in recent years many have "challenged the First Nightmare by simply
     requesting it from the great clans, rather than waiting to be infected by
     the Spell. Many even survived." This is what that support is worth. */
  { id:"clan", name:"A Great Clan",
    desc:"You asked the Spell for this. Your family has a lineage Attribute, a training hall, and expectations.",
    stats:{ willpower:3, essence:3, vitality:2, perception:2, renown:5, cunning:-1 }, flags:["clan","obligated"] },
];

/* -------------------------------------------------------------
   ASPECTS
   Canon: "An Aspect [is a] confluence of one's innate affinities
   and choices"; "One's Aspect was their own, existing outside of
   the Spell"; "Each Awakened had a unique Aspect." An Aspirant
   already carries a Dormant-rank Aspect before the First
   Nightmare — without ability and without Flaw.
   `origins` biases the draw, because affinity is not random.
------------------------------------------------------------- */
const ASPECTS = [
  { id:"shadow",   name:"Shadow",   desc:"You are never quite where the light says you are.",       stats:{ perception:2, cunning:2 }, origins:["outskirts"] },
  { id:"ember",    name:"Ember",    desc:"Something in you burns, and does not ask permission.",    stats:{ vitality:2, essence:2 }, origins:["clan"] },
  { id:"thorn",    name:"Thorn",    desc:"What wounds you grows back sharper.",                     stats:{ vitality:3, willpower:1 }, origins:["outskirts"] },
  { id:"echo",     name:"Echo",     desc:"You hear what has already happened, a moment before it does.", stats:{ perception:3, willpower:1 }, origins:["citadel"] },
  { id:"tide",     name:"Tide",     desc:"You give ground, and take it back with interest.",        stats:{ willpower:2, essence:2 }, origins:["citadel"] },
  { id:"iron",     name:"Iron",     desc:"You do not bend. It is not always a virtue.",             stats:{ vitality:3, essence:1 }, origins:["clan"] },
  { id:"lantern",  name:"Lantern",  desc:"You show people things. Not always what they wanted shown.", stats:{ perception:2, renown:2 }, origins:["citadel"] },
  { id:"quarry",   name:"Quarry",   desc:"You are better at being hunted than most things are at hunting.", stats:{ cunning:3, vitality:1 }, origins:["outskirts"] },
];

/* -------------------------------------------------------------
   FLAWS
   Canon: "Flaws are never random; they are deeply connected to
   the individuals cursed by them and are tied to something
   fundamental about those people... A Flaw might directly oppose
   the core of a person's identity."
   So `affinity` lists the flags — the things you actually did in
   the First Nightmare — that make a Flaw likely to be the one
   the Spell chooses for you.
------------------------------------------------------------- */
const FLAWS = [
  { id:"sleepless", name:"The Sleepless", desc:"Rest never fully takes. You wake tired, always.",
    stats:{ vitality:-2 }, affinity:["fought_sleep","ran_first"] },
  { id:"tether",    name:"The Tether",    desc:"Someone from your old life still has a claim on you, and the Spell knows it.",
    stats:{ willpower:-2 }, affinity:["said_goodbye","came_back_for_them"] },
  { id:"hunger",    name:"The Hunger",    desc:"Your Core drinks more than it should, and is never satisfied.",
    stats:{ essence:-3 }, affinity:["greedy","took_the_spoil"] },
  { id:"debt",      name:"The Debt",      desc:"You took something in there that has not been paid for.",
    stats:{ renown:-2, essence:-1 }, affinity:["greedy","struck_first"] },
  { id:"silence",   name:"The Silence",   desc:"Your Aspect answers slowly, and sometimes not at all.",
    stats:{ essence:-2 }, affinity:["hid","outsmarted_it"] },
  { id:"mark",      name:"The Mark",      desc:"Nightmare Creatures find you interesting. This is not a compliment.",
    stats:{ perception:-1, vitality:-2 }, affinity:["walked_toward","faced_it"] },
  { id:"witness",   name:"The Witness",   desc:"You cannot look away from a death you could have prevented.",
    stats:{ willpower:-1, vitality:-2 }, affinity:["left_them","abandoned"] },
  { id:"echoing",   name:"The Echoing",   desc:"Every place you have bled calls you back to it.",
    stats:{ perception:-2 }, affinity:["cracked","broke"] },
];

/* -------------------------------------------------------------
   NIGHTMARE CATALOGUE

   Canon constraints that shape every scenario below:
   - First Nightmares are "tailored individually" to the Aspirant,
     which is why a fresh one is drawn every run.
   - In a First Nightmare "only a single Creature can appear...
     usually a Beast or Monster. Rarely, a Demon mixed in, and
     never anything stronger than a Devil."
   - "Each Nightmare contains a central conflict that has to be
     resolved for the Nightmare to end."
   - Failure is death, and "every Aspirant who fails their First
     Nightmare becomes a miniature Gate, allowing a single
     Nightmare Creature to enter the waking world."
   - From the Second Nightmare on, they are born in the Dream
     Realm, not in a person, and "any number of Awakened can
     attempt to conquer" the same Seed — so you are never alone.
   - "Those who had conquered a Nightmare of a particular Rank
     could not enter any Seed of the same Rank again." One shot.

   None of the scenarios below appear in the novel. They are
   built to sit inside these rules.
------------------------------------------------------------- */
const NIGHTMARES = {
  first: [
    { id:"fn_choir",   name:"The Hollow Choir",    entry:"fnc_1", creature:"Monster" },
    { id:"fn_tide",    name:"The Nine-Tenths Tide",entry:"fnt_1", creature:"Beast" },
    { id:"fn_debt",    name:"The Debt Collector",  entry:"fnd_1", creature:"Demon" },
  ],
  second: [
    { id:"sn_lantern", name:"The Lantern March",   entry:"sn1_1" },
    { id:"sn_orchard", name:"The Iron Orchard",    entry:"sn2_1" },
  ],
  third:  [ { id:"tn_assembly", name:"The Assembly of Mouths", entry:"tn1_1" } ],
  fourth: [ { id:"qn_quiet",    name:"The Quiet Between Stars", entry:"qn1_1" } ],
};

/* -------------------------------------------------------------
   SOLSTICE DESTINATIONS
   Canon: Sleepers are transported to the Dream Realm on the day
   of the winter solstice, arriving in a region of it, and only
   become Awakened by returning through a Gateway alive. Canon
   regions include the Forgotten Shore, the Dark City, the Hollow
   Mountains, the Nightmare Desert and Godgrave. The two below
   are new, built to the same pattern: a ruin, a hostile ecology,
   and a Gateway that is a long way from where you land.
------------------------------------------------------------- */
const SOLSTICE = [
  { id:"sol_saltglass", name:"The Saltglass Flats", entry:"sg_1",
    blurb:"A dry sea turned to green glass, and something under it that remembers being water." },
  { id:"sol_ledger",    name:"The Ledger",          entry:"lg_1",
    blurb:"A city of shelves. Everything that ever died here was written down, and the writing is still being done." },
];

const MEMORIES = {
  choir_bell:  { name:"Cracked Bell",       desc:"It rings in a register that makes Nightmare Creatures hesitate.", stats:{ perception:2, willpower:1 } },
  tide_scale:  { name:"Scale of the Ninth", desc:"Cold, and slightly heavier than it should be.",                   stats:{ vitality:3 } },
  debt_coin:   { name:"Settled Coin",       desc:"Payment for something you would rather not have sold.",           stats:{ cunning:2, essence:2 } },
  salt_lens:   { name:"Saltglass Lens",     desc:"Ground from the flats. Shows what a place used to be.",           stats:{ perception:3 } },
  ledger_page: { name:"Torn Ledger Page",   desc:"Your name is on it, in a hand you do not recognise.",             stats:{ willpower:2, essence:1 } },
};

const EVENTS = [

/* ===================================================================
   ACT I — ASPIRANT
   Canon: the Spell "infects young people, usually around sixteen to
   eighteen years old", and they "automatically challenge the First
   Nightmare when they first fall asleep after having been infected".
   You do not choose to go in. You only choose how you arrive.
=================================================================== */
{
  id:"as_opening", chapter:"aspirant", once:true, weight:100, days:0, fixedTime:true,
  title:"Infected",
  text:"It starts as tiredness, the way it always does.\n\nA week of it. Then a fortnight, and you are falling asleep standing up, and everyone around you has gone very careful and very quiet, because they have all seen this before and they all know what comes next.\n\nYou will fall asleep. When you do, the First Nightmare takes you. Nobody chooses the hour and nobody is ever ready.",
  choices:[
    { label:"Spend what's left of the time learning what's coming.", hint:"Perception",
      check:{ stat:"perception", dc:7 },
      success:{ text:"Three things worth knowing, from a survivor who owes your family nothing and tells you anyway.\n\nThe Nightmare has one creature in it. It has one conflict in it. And whatever you take out of it, you keep.", effects:{ stats:{ perception:2, willpower:2 }, flags:{ add:["forewarned"] } } },
      failure:{ text:"Everything you find is rumour, and half of it is wrong in ways you will only discover later.", effects:{ stats:{ perception:1 } } },
      effects:{ goto:"as_lastnight" } },
    { label:"Say goodbye properly.",
      effects:{ stats:{ willpower:2, vitality:1 }, flags:{ add:["said_goodbye"] }, goto:"as_lastnight" } },
    { label:"Fight the sleep. Stay standing.", hint:"Nobody has ever won this.",
      effects:{ stats:{ vitality:-2, willpower:3 }, flags:{ add:["fought_sleep"] }, goto:"as_lastnight" } },
  ]
},
{
  id:"as_lastnight", chapter:"aspirant", scripted:true, once:true, days:3, fixedTime:true,
  title:"The Last Waking Hour",
  text:"In the end it takes you sitting down, mid-sentence, in the middle of an ordinary afternoon.\n\nThe Spell is not cruel about it. It is not anything about it. It is, as the researchers keep insisting, less a creature than a function.",
  choices:[
    { label:"Go under.", effects:{ nightmare:"first" } },
  ]
},

/* ===================================================================
   FIRST NIGHTMARE A — THE HOLLOW CHOIR
   Single creature: a Monster. Central conflict: the choir cannot
   stop singing, and something in the dark is counting the voices.
=================================================================== */
{
  id:"fnc_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Hollow Choir",
  text:"You are standing in the nave of a church the size of a city, and eight hundred people are singing.\n\nThey have been singing for a long time. You can tell from their faces. The song has no end written into it and none of them can stop, and at the back of the nave, in the dark past the last row, something is counting the voices.\n\nWhen the count comes up short, it comes forward to find out why.\n\nYou are the eight hundred and first. Nobody is looking at you.",
  choices:[
    { label:"Join the singing. Be a voice, not a stranger.", hint:"Willpower",
      check:{ stat:"willpower", dc:9, fatal:1, fatalKind:"nightmare",
        fatalText:"You open your mouth and the song goes into you instead of out.\n\nBy the third hour you have forgotten why you were counting the hours. By the ninth you are simply one of the voices, and you will be one of the voices for as long as the Nightmare stands.",
        fatalCause:"Absorbed into the Hollow Choir. Your body woke as something else." },
      success:{ text:"You find the line and you hold it. The count stays whole and the thing at the back of the nave stays where it is.\n\nAnd because you are singing, nobody minds you walking while you do it.", effects:{ stats:{ willpower:2, perception:1 }, flags:{ add:["hid"] }, appraisal:1 } },
      failure:{ text:"You are half a beat behind for one bar. One bar is enough. Somewhere behind you, the counting stops.", effects:{ stats:{ willpower:-1 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnc_2" } },
    { label:"Don't sing. Walk the aisle and look for the reason.", hint:"Perception. Conspicuous.",
      check:{ stat:"perception", dc:10, fatal:1, fatalKind:"nightmare",
        fatalText:"You are the only silent thing in a building made of sound, and it finds you the way a hand finds a splinter.",
        fatalCause:"Taken in the nave of the Hollow Choir, mid-step." },
      success:{ text:"Eight hundred singers and not one of them is breathing. You look up, and the vaulting is not stone — it is a throat, and the church is what it looks like from inside.", effects:{ stats:{ perception:3, willpower:1 }, flags:{ add:["outsmarted_it"] }, appraisal:2 } },
      failure:{ text:"You learn nothing except that the floor is sticky and the count has faltered.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnc_2" } },
  ]
},
{
  id:"fnc_2", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Hollow Choir",
  text:"There is a woman in the fourth row who is not singing.\n\nShe is mouthing the words, exactly, perfectly, and producing nothing, and she has clearly been doing it for years. When you draw level with her she does not turn her head. She says, without any sound at all:\n\n\"It counts voices. Not people. Give it one more than it expects and it will spend an hour looking for the extra.\"",
  choices:[
    { label:"Take her advice. Find a way to make an extra voice.", hint:"Cunning",
      check:{ stat:"cunning", dc:10, fatal:1, fatalKind:"nightmare",
        fatalText:"Your trick makes a sound like a trick. The counting stops instantly, and then it is very close, and then it is not counting any more.",
        fatalCause:"Killed in the nave of the Hollow Choir." },
      success:{ text:"The bell in the side chapel is cracked and half-buried, and cracked is what you need — it does not ring a note, it rings a person.\n\nBehind you, something begins a very careful recount.", effects:{ stats:{ cunning:3 }, memory:"choir_bell", flags:{ add:["outsmarted_it"] }, appraisal:3 } },
      failure:{ text:"You get the bell free. It rings once, thinly, and does not fool anything at all.", effects:{ stats:{ vitality:-2, cunning:1 } } },
      effects:{ goto:"fnc_3" } },
    { label:"Take her with you. She has been in here long enough.",
      effects:{ stats:{ willpower:2, vitality:-2 }, flags:{ add:["came_back_for_them"] }, appraisal:2, goto:"fnc_3" } },
    { label:"Leave her. She chose the fourth row a long time ago.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["left_them"] }, goto:"fnc_3" } },
  ]
},
{
  id:"fnc_3", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Hollow Choir",
  text:"The conflict at the heart of it is not the thing in the dark. It is the song.\n\nThe song is what feeds it. Eight hundred voices, held in place by the fact that nobody dares be the first to stop. And you understand, with the total unearned clarity this place hands out, that if the singing ends the Nightmare ends with it.\n\nThe organ loft is forty feet up and the stair is in full view of the nave.",
  choices:[
    { label:"Climb, and cut the song.", hint:"Vitality. Everything sees you do it.",
      check:{ stat:"vitality", dc:11, fatal:1, fatalKind:"nightmare",
        fatalText:"You make it most of the way up the stair. Most of the way is not a category the Nightmare recognises.",
        fatalCause:"Fell from the organ loft of the Hollow Choir with the song still going." },
      success:{ text:"You cut it. Eight hundred mouths close at once and the silence lands like a physical blow, and in the enormous quiet that follows you hear something at the back of the nave stop existing.\n\nThe church comes down. You do not.", effects:{ stats:{ willpower:3, renown:1 }, flags:{ add:["faced_it"] }, appraisal:4, goto:"fn_resolve" } },
      failure:{ text:"You cut it, badly, and half the choir keeps going, and what comes out of the dark is only half-dead when it reaches you.", effects:{ stats:{ vitality:-4, willpower:2 }, appraisal:2, goto:"fn_resolve" } } },
    { label:"Don't. Find the door and leave the choir singing.", hint:"Survival is the whole task.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["hid"] }, appraisal:0, goto:"fn_resolve" } },
  ]
},

/* ===================================================================
   FIRST NIGHTMARE B — THE NINE-TENTHS TIDE
   Single creature: a Beast. Central conflict: the tide is nine parts
   out of ten of the way in, and has been for a hundred years.
=================================================================== */
{
  id:"fnt_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Nine-Tenths Tide",
  text:"A fishing town, at night, and the sea is standing up.\n\nNot a wave — a wall, nine parts of the way to the rooftops, held there, breathing. It has been held there long enough that people have built stairs against it and hung lamps from it and learned to live in its shadow.\n\nSomething enormous swims inside it, unhurried, doing laps. Everyone here knows exactly how long the laps take.",
  choices:[
    { label:"Ask how long the tide has been up.", hint:"They will tell a stranger anything.",
      effects:{ stats:{ perception:2 }, flags:{ add:["asked"] }, appraisal:1, goto:"fnt_2" } },
    { label:"Get up on the wall and look into the water.", hint:"Willpower",
      check:{ stat:"willpower", dc:10, fatal:1, fatalKind:"nightmare",
        fatalText:"It is doing laps. It has been doing laps for a century. It notices you the way you would notice a change in the weather, and it adjusts its course by a very small amount.",
        fatalCause:"Taken off the sea wall by the thing in the Nine-Tenths Tide." },
      success:{ text:"You see it pass. Long, pale, patient, and old enough that the town has built a religion out of the timing of it.\n\nYou also see, near the bottom, the thing it is circling: a bell-shaped hollow in the water where the tide is not moving at all.", effects:{ stats:{ willpower:2, perception:2 }, flags:{ add:["walked_toward"] }, appraisal:3 } },
      failure:{ text:"You look too long and something in the salt gets into your head. You are sick for a day and dream of laps.", effects:{ stats:{ vitality:-2, perception:1 } } },
      effects:{ goto:"fnt_2" } },
  ]
},
{
  id:"fnt_2", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Nine-Tenths Tide",
  text:"The town's arrangement is simple and has held for three generations.\n\nEvery so often, at a time the tide-watchers calculate, someone walks out onto the last stair and does not come back, and the wall stays up, and everyone else keeps their houses and their children and their evenings.\n\nTonight the calculation has come up with a name. She is fourteen. Her family are being very calm about it in the way people are calm when calm is all they have left.",
  choices:[
    { label:"Go in her place.", hint:"Willpower. It is not a metaphor.",
      check:{ stat:"willpower", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"The last stair goes down into the wall and the wall is exactly as cold as you expected and the thing inside it is exactly as fast.",
        fatalCause:"Walked into the Nine-Tenths Tide and did not come out." },
      success:{ text:"You go down the last stair into standing water and something vast comes at you out of the dark — and stops.\n\nIt stops because you are not what it was sent. The arrangement has a shape and you are the wrong shape, and for the first time in a hundred years the ritual does not resolve.\n\nThe wall shudders. Behind you, the whole town starts screaming at once.", effects:{ stats:{ willpower:4, vitality:-3 }, flags:{ add:["came_back_for_them"] }, appraisal:5 } },
      failure:{ text:"You go down. You come back up. You are missing something you cannot name and the girl is still standing there.", effects:{ stats:{ vitality:-3, willpower:1 }, flags:{ add:["cracked"] } } },
      effects:{ goto:"fnt_3" } },
    { label:"Let it happen. Watch, and learn the mechanism.", hint:"Perception. Cold work.",
      check:{ stat:"perception", dc:9 },
      success:{ text:"She walks out. The wall takes her. And in the four seconds it takes, you see exactly where the tide's grip is anchored — a bell-shaped hollow, low, near the seabed, where the water does not move.", effects:{ stats:{ perception:3, cunning:2 }, flags:{ add:["left_them"] }, appraisal:2 } },
      failure:{ text:"She walks out. The wall takes her. You learn nothing except what your own face feels like while it happens.", effects:{ stats:{ willpower:-2 }, flags:{ add:["left_them","cracked"] } } },
      effects:{ goto:"fnt_3" } },
  ]
},
{
  id:"fnt_3", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Nine-Tenths Tide",
  text:"The conflict is the arrangement itself.\n\nThe beast is not holding the tide up. The town is — with the payments, with the timing, with three generations of agreeing to it. The wall stands because everybody keeps their side of a bargain nobody alive remembers making.\n\nBreak the bargain and the sea comes down. On the town. On you.",
  choices:[
    { label:"Break it. Go down to the hollow and cut the anchor.", hint:"Vitality",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"You reach the hollow. You are still reaching for the anchor when the laps stop being laps.",
        fatalCause:"Drowned at the anchor of the Nine-Tenths Tide." },
      success:{ text:"A hundred years of held water goes where water goes.\n\nYou come up out of it somehow, on a roof, in the dark, with a cold scale the size of your hand in your fist and a town underwater below you and the Nightmare quietly ending all around.", effects:{ stats:{ vitality:-3, willpower:3 }, memory:"tide_scale", flags:{ add:["faced_it"] }, appraisal:4, goto:"fn_resolve" } },
      failure:{ text:"You cut it and the sea comes down before you are clear. You survive on luck and one lungful of air.", effects:{ stats:{ vitality:-5 }, appraisal:2, goto:"fn_resolve" } } },
    { label:"Leave the arrangement standing. Walk inland until the Nightmare ends.",
      effects:{ stats:{ cunning:1, willpower:-1 }, flags:{ add:["left_them"] }, appraisal:0, goto:"fn_resolve" } },
  ]
},

/* ===================================================================
   FIRST NIGHTMARE C — THE DEBT COLLECTOR
   Single creature: a Demon. Canon allows this, rarely, and never
   anything above a Devil. Central conflict: the ledger must balance.
=================================================================== */
{
  id:"fnd_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Debt Collector",
  text:"A market town on a hot afternoon, and everyone is politely pretending not to look at the man in the square.\n\nHe is well-dressed and unhurried and he has a book. When he opens it and reads a name, the person with that name walks over to him, apologising, and settles up. Nobody has ever seen what settling up involves. The books close on it.\n\nYou are new here, and you are not in the book yet, and he has already noticed that.",
  choices:[
    { label:"Get out of the square before he opens it again.", hint:"Cunning",
      check:{ stat:"cunning", dc:9, fatal:1, fatalKind:"nightmare",
        fatalText:"He does not chase. He simply reads a name, and it is close enough to yours, and your feet make the decision without consulting you.",
        fatalCause:"Settled up in the market square." },
      success:{ text:"You are three streets away before the page turns. Behind you somebody apologises, at length, and then stops.", effects:{ stats:{ cunning:2 }, flags:{ add:["ran_first","hid"] }, appraisal:1 } },
      failure:{ text:"You get as far as the arch. He does not look up, but the pen does move.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnd_2" } },
    { label:"Walk up and ask what you owe.", hint:"Willpower. Nobody does this.",
      check:{ stat:"willpower", dc:11, fatal:1, fatalKind:"nightmare",
        fatalText:"He is delighted. He tells you, in detail, and the telling is the settlement.",
        fatalCause:"Read out of the Collector's book, in full." },
      success:{ text:"He looks up for the first time all afternoon.\n\n\"Nothing,\" he says, and sounds genuinely put out about it. \"You are not from the ledger. That is not the same as being owed nothing, but it is not my department.\"\n\nHe turns the book toward you, briefly. You see how it works.", effects:{ stats:{ willpower:3, perception:2 }, flags:{ add:["walked_toward"] }, appraisal:4 } },
      failure:{ text:"He writes something small in a margin and returns to his work. You have been noted.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnd_2" } },
  ]
},
{
  id:"fnd_2", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Debt Collector",
  text:"The town explains itself over one evening, the way towns do.\n\nEverything anyone here has ever been given is written in the book. Not bought — given. Kindnesses. Rescues. Years of somebody's patience. The Collector's function is to make sure that nothing in this world is received for free, and the town has been running a deficit for four hundred years.\n\nA boy who fed you at the inn tells you this with the particular cheerfulness of someone who knows his own entry is nearly full.",
  choices:[
    { label:"Pay his debt for him.", hint:"You have nothing to pay with. That is the point.",
      check:{ stat:"willpower", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"You offer. He accepts. It turns out you did have something to pay with after all, and he takes all of it.",
        fatalCause:"Paid another's entry in the Collector's book, in full." },
      success:{ text:"The Collector considers you for a long moment, then makes two small marks, and the boy's page goes blank.\n\n\"An outstanding balance,\" he says, \"in your favour. I dislike those.\"", effects:{ stats:{ willpower:3, renown:1 }, memory:"debt_coin", flags:{ add:["came_back_for_them"] }, appraisal:4 } },
      failure:{ text:"He hears you out with enormous courtesy and declines. The boy's entry is settled the next morning.", effects:{ stats:{ willpower:-1 }, flags:{ add:["left_them"] } } },
      effects:{ goto:"fnd_3" } },
    { label:"Steal the book.", hint:"Cunning. Obviously.",
      check:{ stat:"cunning", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"You get both hands on it. The book is not a possession of his. The book is the part of him he keeps outside.",
        fatalCause:"Killed reaching for the Collector's ledger." },
      success:{ text:"It is lighter than it looks, and every page is your handwriting.", effects:{ stats:{ cunning:4 }, memory:"debt_coin", flags:{ add:["struck_first","greedy"] }, appraisal:3 } },
      failure:{ text:"You get a page. One page. It costs you a hand's worth of blood and most of your dignity.", effects:{ stats:{ vitality:-3, cunning:2 }, flags:{ add:["greedy"] } } },
      effects:{ goto:"fnd_3" } },
    { label:"Do nothing. It is not your town.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["left_them"] }, goto:"fnd_3" } },
  ]
},
{
  id:"fnd_3", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Debt Collector",
  text:"The conflict is the deficit.\n\nFour hundred years of unearned kindness, compounding, and a creature whose entire nature is that the sum must come out even. It cannot be killed into balancing. It can only be balanced.\n\nThere is one entry large enough to close the gap, and it is the town's founding: the gift of the place itself, never paid for, held on the first page in handwriting older than the language.",
  choices:[
    { label:"Settle the first page. Sign it yourself.", hint:"Willpower. You do not own what you are signing away.",
      check:{ stat:"willpower", dc:13, fatal:1, fatalKind:"nightmare",
        fatalText:"The signature takes. So does everything behind it.",
        fatalCause:"Signed the first page of the Collector's ledger and was collected." },
      success:{ text:"You sign. The book balances. The Collector closes it with the small satisfaction of a man finishing a long shift, tips his hat to you, and is not there any more.\n\nThe town does not notice. The Nightmare ends anyway.", effects:{ stats:{ willpower:4, cunning:1 }, flags:{ add:["faced_it"] }, appraisal:5, goto:"fn_resolve" } },
      failure:{ text:"You sign and the page takes more than the ink. You are still standing when it ends, but less of you is.", effects:{ stats:{ vitality:-5, willpower:2 }, flags:{ add:["cracked"] }, appraisal:3, goto:"fn_resolve" } } },
    { label:"Let it run. Wait out the Nightmare somewhere it isn't reading.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["hid"] }, appraisal:0, goto:"fn_resolve" } },
  ]
},

/* ===================================================================
   RESOLUTION OF THE FIRST NIGHTMARE
   Canon: on success the Aspirant becomes a Sleeper — Dormant rank,
   Aspect Ability awakened, "and is given Flaw in exchange for the
   power he/she received". The Aspect's rank depends on "the
   appraisal the Spell gives".
=================================================================== */
{
  id:"fn_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Appraisal",
  text:"You wake on the floor of a room in the waking world with your heart going like a hammer and the taste of somewhere else still in your mouth.\n\nYou are alive, which puts you in a minority.\n\nThere is a weight under your ribs that was not there before — small, cold, turning. And the Spell is writing on the inside of your eyes: a judgement of what you did in there, an ability you did not have yesterday, and the price it has decided to charge you for it.",
  choices:[
    { label:"Read the price.",
      effects:{ awardFlaw:true, flags:{ add:["sleeper"] }, chapter:"sleeper" } },
  ]
},

/* ===================================================================
   ACT II — SLEEPER
   Canon: a Sleeper has an Aspect and a Flaw but "ha[s] not yet
   established a connection with the Dream Realm" — they are
   "destined to be transported there on the day of the winter
   solstice". Only "once a Sleeper returns from the Dream Realm for
   the first time" do they become Awakened.
   This whole act is a second death gate, and in the novel it is
   the deadlier one: of seven Sleepers sent to one region, three
   died before they even reached it.
=================================================================== */
{
  id:"sl_after", chapter:"sleeper", once:true, weight:100, days:20, fixedTime:true,
  title:"Sleeper",
  text:"They have a word for what you are now and it is not a flattering one.\n\nA Sleeper carries a Soul Core and an Aspect and a Flaw, and cannot do very much with any of them, and is not yet Awakened — because the Spell is not finished. On the winter solstice it will take you to the Dream Realm, put you down somewhere in it, and wait to see whether you find your way back out through a Gateway.\n\nMost of what happens to Sleepers happens then. You have until winter.",
  choices:[
    { label:"Train. Every hour of it.", effects:{ stats:{ vitality:3, willpower:2 }, flags:{ add:["trained"] } } },
    { label:"Find someone who has come back, and listen.", hint:"Cunning",
      check:{ stat:"cunning", dc:9 },
      success:{ text:"\"Three rules,\" he says. \"Don't be alone at night. Don't take the direct road. And when you find the Gateway, do not wait for anyone.\"\n\nHe is not proud of the third one. He says it first every time.", effects:{ stats:{ perception:3, cunning:2 }, flags:{ add:["forewarned"] } } },
      failure:{ text:"The ones who came back do not enjoy talking about it, and the ones who enjoy talking about it did not come back.", effects:{ stats:{ perception:1 } } } },
    { label:"Take the clan's offer of preparation.", requires:{ flags:{ all:["clan"] } },
      hint:"It will be remembered.",
      effects:{ stats:{ essence:3, willpower:2, vitality:2 }, flags:{ add:["indebted"] } } },
  ]
},
{
  id:"sl_solstice", chapter:"sleeper", once:true, weight:200, days:180, fixedTime:true,
  requires:{ flags:{ none:["went_solstice"] } },
  title:"Winter Solstice",
  text:"It happens to every Sleeper in the world on the same night, at the same moment, wherever they are and whatever they are doing.\n\nThere is no ceremony. There is a cold like a door opening.",
  choices:[
    { label:"Go.", effects:{ flags:{ add:["went_solstice"] }, solstice:true } },
  ]
},

/* -------------------------------------------------------------------
   SOLSTICE REGION A — THE SALTGLASS FLATS
------------------------------------------------------------------- */
{
  id:"sg_1", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Saltglass Flats",
  text:"You arrive standing, which is more than some manage.\n\nIt is a sea that was told to stop. Green glass to the horizon in frozen swells, ringing faintly underfoot, and beneath the surface — down there, distinct, unhurried — shapes are still swimming.\n\nThere are four others within sight. None of them are people you know. All of you have arrived at the same wrong place at the same wrong time, and every one of you is doing the same arithmetic about the others.",
  choices:[
    { label:"Band together. Five is better than one.",
      effects:{ stats:{ willpower:1, renown:1 }, flags:{ add:["banded"] }, goto:"sg_2" } },
    { label:"Go alone, now, before anyone decides anything.",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["solo_shore"] }, goto:"sg_2" } },
    { label:"Follow one of them at a distance and see what they know.", hint:"Perception",
      check:{ stat:"perception", dc:9 },
      success:{ text:"She walks the ridges, never the troughs, never in a straight line. By evening you understand: the things under the glass track vibration, and a straight line is a drumbeat.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["learned_the_walk"] } } },
      failure:{ text:"You lose her inside an hour and spend the rest of the day proving you cannot navigate.", effects:{ stats:{ vitality:-2 } } },
      effects:{ goto:"sg_2" } },
  ]
},
{
  id:"sg_2", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Saltglass Flats",
  text:"On the third day the glass thins.\n\nYou can see them properly now, gliding along beneath your boots with the lazy confidence of things that have never needed to hurry. The surface holds. The surface has held for a very long time. The surface is nine inches thick and one of the others has started testing it with a hammer, to see.",
  choices:[
    { label:"Stop him.", hint:"Willpower",
      check:{ stat:"willpower", dc:10, fatal:1, fatalKind:"dream_realm",
        fatalText:"He swings anyway. The glass does not break so much as decide to stop being glass, and the two of you go down into it together.",
        fatalCause:"Went through the Saltglass Flats. Whatever was under it had been waiting a long time." },
      success:{ text:"You get the hammer off him. He calls you several things. Two days later, when the surface starts singing under a different group's feet a mile east, he does not call you any of them again.", effects:{ stats:{ willpower:2, renown:2 } } },
      failure:{ text:"He swings. The crack runs forty feet and stops. Everyone stands very still for about a minute, and then everyone walks away from each other for good.", effects:{ stats:{ vitality:-2 }, flags:{ add:["scattered"] } } },
      effects:{ goto:"sg_3" } },
    { label:"Let him. Be a long way off when he does it.", hint:"Cunning",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["left_them"] }, goto:"sg_3" } },
    { label:"Take the hammer and break it yourself, on your terms.", hint:"Perception. There is a reason to.",
      check:{ stat:"perception", dc:11, fatal:1, fatalKind:"dream_realm",
        fatalText:"You were right about the lens. You were wrong about how fast the thing under it could move.",
        fatalCause:"Killed harvesting saltglass, one inch from being right." },
      success:{ text:"A hand's width of the flats, cut clean and ground on your sleeve, and when you hold it up the dead sea shows you what it was before it stopped: a coastline, a harbour, and the Gateway standing where the harbour mouth used to be.", effects:{ stats:{ perception:2 }, memory:"salt_lens", flags:{ add:["greedy","knows_the_way"] } } },
      failure:{ text:"You get a shard and a deep cut and no revelation whatsoever.", effects:{ stats:{ vitality:-3 } } },
      effects:{ goto:"sg_3" } },
  ]
},
{
  id:"sg_3", scripted:true, once:true, days:9, fixedTime:true,
  title:"The Gateway",
  text:"The Gateway stands in the middle of the flats with nothing around it, the way they always do.\n\nAnd there is a queue. Not a formal one — a scatter of Sleepers, twenty or so, all arrived at the same conclusion at roughly the same time, all watching each other, because a Gateway takes one at a time and the walk to it is across open glass, and the things underneath have finally worked out that the drumming above them is food.",
  choices:[
    { label:"Go first. Straight across, fast.", hint:"Vitality. Nobody will forget it.",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"dream_realm",
        fatalText:"You are eleven strides from it when the glass goes soft.",
        fatalCause:"Taken through the Saltglass, eleven strides from the Gateway." },
      success:{ text:"You run and the whole plain sings under you and something enormous comes up through the surface at your heels and misses.\n\nThe Gateway takes you mid-stride.", effects:{ stats:{ vitality:-2, renown:3, willpower:2 }, flags:{ add:["went_first"] }, kill:{ rank:0, size:1 }, goto:"sl_return" } },
      failure:{ text:"You go and you are not fast enough and you are dragged the last twenty feet by two strangers who will not survive the week.", effects:{ stats:{ vitality:-5 }, flags:{ add:["owed"] }, goto:"sl_return" } } },
    { label:"Wait. Let someone else find out how thin it is.", hint:"Cunning. Cold, and correct.",
      check:{ stat:"cunning", dc:10, fatal:1, fatalKind:"dream_realm",
        fatalText:"You wait too long. By the time the crowd thins, so has the glass, and the last stretch is not crossable by anyone.",
        fatalCause:"Stranded on the Saltglass Flats after the surface failed." },
      success:{ text:"Four go before you. Two arrive. You walk the path their weight has already tested, and you walk it slowly, and you are not what anything is looking at.", effects:{ stats:{ cunning:3, perception:1 }, flags:{ add:["left_them"] }, goto:"sl_return" } },
      failure:{ text:"You leave it late. The crossing costs you most of what you had left.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
    { label:"Go with the others, all at once. Spread the noise.", requires:{ flags:{ all:["banded"] } },
      hint:"Willpower",
      check:{ stat:"willpower", dc:10, fatal:1, fatalKind:"dream_realm",
        fatalText:"Twenty sets of footsteps is not less noise. It is a dinner bell.",
        fatalCause:"Killed in the rush for the Saltglass Gateway." },
      success:{ text:"Twenty of you go at once and the things below cannot choose. Fourteen make it. That is a very good number and everyone who lives will know it.", effects:{ stats:{ renown:4, willpower:2 }, flags:{ add:["crew_bond"] }, goto:"sl_return" } },
      failure:{ text:"Twenty go. Nine arrive. You are one of the nine and you will be doing the arithmetic on that for a century.", effects:{ stats:{ vitality:-3, willpower:-1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
  ]
},

/* -------------------------------------------------------------------
   SOLSTICE REGION B — THE LEDGER
------------------------------------------------------------------- */
{
  id:"lg_1", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Ledger",
  text:"A city of shelves.\n\nStreets of them, four storeys high, running to a vanishing point in every direction, and every shelf packed with bound volumes in a hand that does not tire. There is no sky. There is a ceiling, very far up, and the light comes from the writing.\n\nSomething is still writing. You can hear it two streets over — a dry, continuous, patient sound, moving.",
  choices:[
    { label:"Read a volume.", hint:"Perception",
      check:{ stat:"perception", dc:9, fatal:1, fatalKind:"dream_realm",
        fatalText:"It is an account of a death in this city. It is very detailed. It is dated four hours from now and the name is yours, and reading it is what fixes it.",
        fatalCause:"Read your own entry in the Ledger." },
      success:{ text:"It is an inventory of a death — every detail of it, dispassionate, complete, down to what the light was doing.\n\nEvery volume on this shelf is the same death, recorded again. The city is not a library. It is one enormous act of remembering, and it has not finished.", effects:{ stats:{ perception:3, willpower:1 }, flags:{ add:["read_it"] } } },
      failure:{ text:"The writing crawls. You put it back and your hands are not steady.", effects:{ stats:{ willpower:-1 } } },
      effects:{ goto:"lg_2" } },
    { label:"Don't touch anything. Find high ground and map the streets.",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["mapped"] }, goto:"lg_2" } },
  ]
},
{
  id:"lg_2", scripted:true, once:true, days:7, fixedTime:true,
  title:"The Ledger",
  text:"The Scribe is three streets away and has been for four days, which means it is moving at exactly your speed.\n\nYou have seen it once, at a junction, from behind: tall, stooped, entirely occupied. It does not hunt. It writes down what happens. The problem is that in this place the writing and the happening are the same act, and it is currently working its way through a chapter about you.",
  choices:[
    { label:"Get ahead of it. Reach the shelf it is writing toward and tear the page out.", hint:"Cunning",
      check:{ stat:"cunning", dc:12, fatal:1, fatalKind:"dream_realm",
        fatalText:"You find the page. It is a description of someone tearing out a page, and of what happens to them immediately afterwards.",
        fatalCause:"Written into the Ledger while trying to write yourself out of it." },
      success:{ text:"You get there first. The page is blank, waiting, and you take it, and behind you the dry sound stops for the first time in four days.\n\nIt has to start the chapter again. That is your entire head start.", effects:{ stats:{ cunning:3 }, memory:"ledger_page", flags:{ add:["greedy","bought_time"] } } },
      failure:{ text:"You reach the shelf. The chapter is already written. You read the next four days of your life and they are survivable, barely, and knowing does not help.", effects:{ stats:{ vitality:-3, willpower:1 } } },
      effects:{ goto:"lg_3" } },
    { label:"Stop being interesting. Do nothing worth recording.", hint:"Willpower. For six days.",
      check:{ stat:"willpower", dc:11, fatal:1, fatalKind:"dream_realm",
        fatalText:"On the fifth day you break and run, and running is the most legible thing a person can do here.",
        fatalCause:"Recorded in full in the Ledger." },
      success:{ text:"Six days of sitting still in a dead city while the only sound in the world grinds slowly past your street and away.\n\nYou come out of it thinner, and something in you has been permanently rearranged, and the Scribe has moved on to somebody more eventful.", effects:{ stats:{ willpower:4, vitality:-2 }, flags:{ add:["hid","unremarkable"] } } },
      failure:{ text:"You last four days. The fourth night is noisy.", effects:{ stats:{ vitality:-3, willpower:1 } } },
      effects:{ goto:"lg_3" } },
  ]
},
{
  id:"lg_3", scripted:true, once:true, days:8, fixedTime:true,
  title:"The Gateway",
  text:"The Gateway is in the central rotunda, and the central rotunda is where the Scribe keeps its finished work.\n\nThe volumes here are different — closed, clasped, stacked to the ceiling in their thousands. Sleepers. Every one of them a full account, beginning to end, of somebody who arrived in this city on a winter solstice and did not get out of the rotunda.\n\nThe Gateway is on the far side. The Scribe is in the room.",
  choices:[
    { label:"Walk across. Do not hurry, do not hide.", hint:"Willpower. It writes what it sees.",
      check:{ stat:"willpower", dc:12, fatal:1, fatalKind:"dream_realm",
        fatalText:"It looks up. That is all it does. Somewhere on a shelf behind you, a volume finishes itself and is closed and clasped.",
        fatalCause:"Bound and shelved in the rotunda of the Ledger." },
      success:{ text:"You walk the length of the rotunda at the pace of a man crossing a room, past a thing the height of a house, and it writes down that a person crossed a room.\n\nThe Gateway is warm. Nothing else here has been.", effects:{ stats:{ willpower:4, renown:2 }, flags:{ add:["walked_toward"] }, goto:"sl_return" } },
      failure:{ text:"Halfway across your nerve goes and the last thirty feet are done at a dead sprint. It writes all of it.", effects:{ stats:{ vitality:-4, willpower:1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
    { label:"Burn a shelf. Give it something else to record.", hint:"Cunning. Vandalism as strategy.",
      check:{ stat:"cunning", dc:13, fatal:1, fatalKind:"dream_realm",
        fatalText:"It turns out the city does not object to fire. It objects to you.",
        fatalCause:"Killed setting fire to the Ledger." },
      success:{ text:"Four hundred finished lives go up at once and the Scribe crosses the rotunda faster than anything that size should be able to, and does not look at you even once.\n\nYou are through the Gateway before the second shelf catches.", effects:{ stats:{ cunning:4, renown:1 }, flags:{ add:["struck_first"] }, goto:"sl_return" } },
      failure:{ text:"The fire takes badly and slowly and buys you about ninety seconds. Ninety seconds is, just barely, enough.", effects:{ stats:{ vitality:-4, cunning:2 }, goto:"sl_return" } } },
    { label:"Wait for it to leave the rotunda. It has to, eventually.", hint:"Perception",
      check:{ stat:"perception", dc:11, fatal:1, fatalKind:"dream_realm",
        fatalText:"It does not have to. That was the assumption, and the city has a whole shelf of people who made it.",
        fatalCause:"Starved in the stacks of the Ledger, waiting." },
      success:{ text:"It leaves on the ninth day, through a door you had not noticed, and does not come back for eleven hours. You need four.", effects:{ stats:{ perception:3, cunning:1 }, goto:"sl_return" } },
      failure:{ text:"It leaves on the fourteenth day and you are in no state to be quick about it.", effects:{ stats:{ vitality:-5 }, goto:"sl_return" } } },
  ]
},

/* -------------------------------------------------------------------
   RETURN — a Sleeper who comes back through a Gateway is Awakened.
------------------------------------------------------------------- */
{
  id:"sl_return", scripted:true, once:true, days:0, fixedTime:true,
  title:"Awakened",
  text:"You come out on the other side of a Gateway in the waking world, on your knees, on concrete, in the cold.\n\nSomething finishes turning under your ribs. The Spell writes a single line across the inside of your eyes and the word it uses is one you have heard your whole life and never once expected to be applied to you.\n\nYou can feel your own soul essence now. You could not, yesterday. You have a second Aspect Ability and no idea yet what it does.\n\nAnd you have about a hundred and forty years, which sounds like a great many until you meet somebody who has already used three hundred.",
  choices:[
    { label:"Stand up.",
      effects:{ rank:1, chapter:"awakened", stats:{ essence:4, renown:2 } } },
  ]
},

/* ===================================================================
   ACT III — AWAKENED
   Canon: "Every Awakened technically has a duty to respond when a
   Gate opens near their location. They are given a special
   communicator for this purpose. In exchange for all the privileges
   they receive, they are expected to protect this world."
   Gate duty is not optional, it recurs forever, and "Gates had ranks
   of their own, and any type of Creature could potentially step
   through". This is where most Awakened die, and the reason the
   lifespan number on their file is close to meaningless.
=================================================================== */
{
  id:"aw_gate", chapter:"awakened", weight:46, cooldown:30, days:45,
  title:"The Communicator",
  text:"It goes off at four in the morning, because they always do.\n\nA Gate has opened eleven miles out. You are the nearest Awakened, which is the entire basis on which this works. There is no version of the arrangement where you get to decide it is somebody else's night.",
  choices:[
    { label:"Answer it. Standard sweep.", hint:"Perception. Find out what came through before it finds you.",
      check:{ stat:"perception", dc:10, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"The classification was wrong. They are wrong perhaps one time in forty, and the one time is always somebody's last.",
        fatalCause:"Killed answering a Gate that had been graded two ranks too low." },
      success:{ text:"A Beast, dormant-ranked, disoriented and already dying in the wrong air. It takes twenty minutes and a great deal of caution and you are home before the sun.", effects:{ stats:{ renown:1 }, kill:{ rank:0, size:2 } } },
      failure:{ text:"You find it late, and close, and the fight is short and one-sided in a direction you did not choose.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Answer it, and go in hard.", hint:"Vitality. Bigger risk, bigger core.",
      check:{ stat:"vitality", dc:12, dcScale:2, dcEra:2, fatal:4, fatalKind:"gate",
        fatalText:"You commit to the charge on the assumption that you are the fastest thing in the field. You are not.",
        fatalCause:"Killed charging a Gate creature above your rank." },
      success:{ text:"It is Awakened-ranked and it is faster than you and you take it anyway, and the fragments that come out of it are worth four ordinary nights.", effects:{ stats:{ vitality:-2, renown:3 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"You put it down. It puts most of you down first.", effects:{ stats:{ vitality:-5, renown:1 }, kill:{ rank:1, size:1 } } } },
    { label:"Don't answer.", hint:"There is a word for Awakened who do this.",
      effects:{ stats:{ renown:-5, willpower:-1 }, flags:{ add:["shirked"] } } },
  ]
},
{
  id:"aw_bad_gate", chapter:"awakened", weight:14, cooldown:180, days:60,
  title:"A Gate of the Fourth Category",
  text:"This one is not a stray beast in a field.\n\nIt has been open for six hours before anyone noticed, in a district of ninety thousand people, and what came through it has had six hours to decide what it wants. Three Awakened went in ahead of you. The communicator has stopped hearing from two of them.",
  choices:[
    { label:"Go in after them.", hint:"Willpower. This is what the privileges were for.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:4, fatalKind:"gate",
        fatalText:"You find the second one's body about a hundred metres in, and then you find what did it, and it has had six hours and you have had none.",
        fatalCause:"Killed inside a Gate of the fourth category." },
      success:{ text:"You get one of them out. Not two. The thing that had them is Fallen-ranked and old and it does not follow you into the light, which tells you something about it that you will think about for years.", effects:{ stats:{ renown:6, vitality:-4, willpower:2 }, kill:{ rank:2, size:1 }, flags:{ add:["went_back_in"] } } },
      failure:{ text:"You get nobody out. You get yourself out, barely, and the district is evacuated by morning and the Gate burns for a week.", effects:{ stats:{ vitality:-6, willpower:1, renown:-1 }, flags:{ add:["cracked"] } } } },
    { label:"Hold the perimeter and wait for a Master.", hint:"Correct. Nobody will thank you.",
      effects:{ stats:{ perception:2, renown:-2 }, flags:{ add:["held_back"] } } },
  ]
},
{
  id:"aw_hollow", chapter:"awakened", weight:9, cooldown:200, days:40,
  requires:{ rank:{ max:1 }, stats:{ essence:{ min:4 } } },
  title:"Something Reaches For The Soul, Not The Body",
  text:"Canon is blunt about this: only Awakened below the Master rank can become Hollow or Lost. Above that the soul is too well anchored. Below it, there are things in the Dream Realm that do not bother with the body at all.\n\nYou meet one on an ordinary sweep, in an ordinary ruin, and it goes straight past your guard to the part of you that does the guarding.",
  choices:[
    { label:"Hold the Soul Sea shut.", hint:"Willpower. Nothing else will help here.",
      check:{ stat:"willpower", dc:13, dcScale:2, dcEra:2, fatal:3, fatalKind:"hollow",
        fatalText:"It goes in. What walks out of the ruin has your face and your hands and your gait, and none of the rest of it, and it will be three days before anyone realises.",
        fatalCause:"Hollow. Your soul was destroyed; the body was found walking." },
      success:{ text:"You hold. It is the single hardest thing you have ever done and it takes nine seconds.", effects:{ stats:{ willpower:4, essence:-3 }, flags:{ add:["held_the_sea"] } } },
      failure:{ text:"You hold most of it. Something small and load-bearing is gone and you will not find out what until you need it.", effects:{ stats:{ willpower:-2, perception:-1 }, flags:{ add:["cracked"] } } } },
    { label:"Break the connection. Cut yourself loose and run.", hint:"Cunning. Your body is on the other side.",
      check:{ stat:"cunning", dc:12, dcScale:2, dcEra:2, fatal:3, fatalKind:"lost",
        fatalText:"You cut loose. You cut too much. Your body is in the waking world and you are not in it, and there is no Gateway on this side that will take a soul without one.",
        fatalCause:"Lost. Your body died in the waking world; the rest of you is still in the Dream Realm." },
      success:{ text:"You break it and run and you do not stop running until you are through a Gateway and on your knees on concrete, whole, and shaking.", effects:{ stats:{ cunning:3, vitality:-2 } } },
      failure:{ text:"You get out with most of yourself.", effects:{ stats:{ vitality:-3, essence:-2 } } } },
  ]
},
{
  id:"aw_work", chapter:"awakened", weight:20, cooldown:50, days:120,
  title:"Between Gates",
  text:"There is a life around the duty, if you build one. Most do. Most of them are dead inside forty years anyway, but the ones who last are the ones who used the quiet.",
  choices:[
    { label:"Drill the body until it stops arguing.", effects:{ stats:{ vitality:3, essence:1 } } },
    { label:"Sit with the Core and learn its temper.", effects:{ stats:{ essence:3, willpower:1 } } },
    { label:"Learn the city. People are a resource and you have a Flaw to hide.", effects:{ stats:{ cunning:3, renown:1 } } },
  ]
},
{
  id:"aw_flaw", chapter:"awakened", weight:16, cooldown:150, days:60,
  requires:{ flags:{ none:["flaw_worked"] } },
  title:"The Price",
  text:"Canon is specific about Flaws: they are never random, they are tied to something fundamental about the person carrying them, and they present an insurmountable challenge — but, like a mountain, one that can be worked around rather than overcome.\n\nYours picks a bad moment, because that is what fundamental means.",
  choices:[
    { label:"Cover it. Nobody needs to know what you are carrying.", hint:"Cunning",
      check:{ stat:"cunning", dc:11, dcScale:2, dcEra:2 },
      success:{ text:"You cover it. The cost is knowing exactly how thin the margin was.", effects:{ stats:{ cunning:2, willpower:1 } } },
      failure:{ text:"They know. By the end of the month, everyone who matters knows, and a known Flaw is a handle.", effects:{ stats:{ renown:-4 }, flags:{ add:["flaw_known"] } } } },
    { label:"Work around it. Build a life shaped to its edges.", hint:"Willpower. Years of it.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2 },
      success:{ text:"You spend a decade building around your own weakness like a river around a stone. It has not gone anywhere. You simply do not walk into it any more.", effects:{ stats:{ willpower:4, essence:2 }, flags:{ add:["flaw_worked"] }, days:60 } },
      failure:{ text:"You learn only that it goes deeper than you thought and further back.", effects:{ stats:{ willpower:-1, vitality:-2 } } } },
  ]
},
{
  id:"aw_duel", chapter:"awakened", weight:11, cooldown:220, days:80,
  requires:{ stats:{ renown:{ min:8 } } },
  title:"Another Awakened",
  text:"Killing a Nightmare Creature gives you a portion of what it accumulated. Killing another Awakened gives you a portion of theirs, and theirs is human, and human cores are saturated in a way beasts' are not.\n\nEveryone knows this. Almost nobody says it out loud. And somebody has decided that your core is the convenient one.",
  choices:[
    { label:"Meet them.", hint:"Cunning. Fights between Awakened are decided before they start.",
      check:{ stat:"cunning", dc:13, dcScale:2, dcEra:2, fatal:4, fatalKind:"murdered",
        fatalText:"They chose the ground, the hour and the witnesses. You attended.",
        fatalCause:"Killed by another Awakened for the contents of your Soul Core." },
      success:{ text:"You choose the ground instead. It is over in four seconds and you are the one who walks away carrying two cores' worth of fragments.", effects:{ stats:{ renown:4, vitality:-2 }, kill:{ rank:1, cores:1, size:4 }, flags:{ add:["killed_awakened"] } } },
      failure:{ text:"You live. You are carried out, and the story that goes round is not the one you would have chosen.", effects:{ stats:{ vitality:-5, renown:-2 } } } },
    { label:"Leave the city. Start again somewhere with fewer people who know your name.",
      effects:{ stats:{ renown:-6, cunning:2, perception:1 }, flags:{ add:["ghosted"] } } },
  ]
},
{
  id:"aw_second", chapter:"awakened", weight:26, once:true, days:90,
  requires:{ stats:{ willpower:{ min:14 }, essence:{ min:10 } } },
  title:"A Seed Is Growing",
  text:"Word comes through the clans first and everyone else about a week later: a Seed of Nightmare is maturing in the Dream Realm, and while it grows, anyone may challenge it.\n\nThe Second Nightmare is not tailored to you. It is bigger, longer and harder than the first, populated by Creatures of the Awakened and Fallen ranks, and the unlucky meet something Corrupted. Conquering it makes you a Master — three hundred years, another Aspect Ability, and a place in a category of person that most Awakened only ever see from a distance.\n\nAnd you may only ever do it once. Conquer a Nightmare of a given Rank and no Seed of that Rank will ever open to you again.",
  choices:[
    { label:"Go.", effects:{ nightmare:"second" } },
    { label:"Not yet. There will be other Seeds.", effects:{ stats:{ willpower:1 }, days:200 } },
    { label:"Never. A hundred and forty years is a life.", effects:{ stats:{ willpower:2, tether:2 }, flags:{ add:["declined_second"] } } },
  ]
},

/* -------------------------------------------------------------------
   SECOND NIGHTMARE A — THE LANTERN MARCH
------------------------------------------------------------------- */
{
  id:"sn1_1", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Lantern March",
  text:"You arrive in a column of forty thousand people walking through the dark, each carrying a lit lantern, and they have been walking for longer than any of them can account for.\n\nThe rule is the first thing anyone tells you, before your name: the light must not go out. Not yours, not anyone's. When a lantern goes out, the thing that walks alongside the column comes in to collect what is left, and the column closes up over the gap and keeps walking.\n\nThere are nine other challengers in here with you. You can tell them apart from the marchers immediately, because they are the ones looking around.",
  choices:[
    { label:"Find the other challengers. Nine is a warband.",
      effects:{ stats:{ renown:2, willpower:1 }, flags:{ add:["warband"] }, goto:"sn1_2" } },
    { label:"Walk with the marchers. Learn the rule properly before you break it.", hint:"Perception",
      check:{ stat:"perception", dc:12, fatal:4, fatalKind:"nightmare",
        fatalText:"You are studying the lantern when it gutters, which is the exact moment the column teaches you that the rule is not about your lantern.",
        fatalCause:"Collected from the Lantern March." },
      success:{ text:"The lanterns are not lit from oil. They are lit from the marcher. That is why the column is silent, and that is why it has been walking so long: they are burning down at exactly the rate the road requires.", effects:{ stats:{ perception:4, willpower:1 }, flags:{ add:["knows_the_rule"] } } },
      failure:{ text:"You learn the rule the way most do — from the noise, one row over.", effects:{ stats:{ vitality:-3 } } },
      effects:{ goto:"sn1_2" } },
  ]
},
{
  id:"sn1_2", scripted:true, once:true, days:5, fixedTime:true,
  title:"The Lantern March",
  text:"The thing beside the column has a shape, and once you have seen it you cannot go back to not having seen it.\n\nFallen-ranked at least. It matches the column's pace exactly and has done for centuries, and it does not need to hurry, because sooner or later every lantern goes out.\n\nTwo of the other challengers have decided the answer is to put it down. They are asking who is coming.",
  choices:[
    { label:"Go with them.", hint:"Vitality. Ten Awakened against one Fallen.",
      check:{ stat:"vitality", dc:15, fatal:4, fatalKind:"nightmare",
        fatalText:"Ten Awakened against one Fallen is not a fight. It is an arithmetic lesson delivered at speed.",
        fatalCause:"Killed attacking the Fallen alongside the Lantern March." },
      success:{ text:"Six of the ten come back. It does not. The fragments that come out of a Fallen core split nine ways are still the best night's work of your life so far.", effects:{ stats:{ vitality:-5, renown:5 }, kill:{ rank:2, size:2 }, flags:{ add:["blooded"] } } },
      failure:{ text:"Three come back. You are one of them and you are not sure why.", effects:{ stats:{ vitality:-6, willpower:1 }, flags:{ add:["cracked"] } } },
      effects:{ goto:"sn1_3" } },
    { label:"Let them try. Use the noise.", hint:"Cunning",
      effects:{ stats:{ cunning:3, perception:1 }, flags:{ add:["left_them"] }, goto:"sn1_3" } },
    { label:"Talk them out of it. The creature is not the conflict.", hint:"Willpower",
      check:{ stat:"willpower", dc:13 },
      success:{ text:"You get seven of the nine to listen. Two go anyway. Neither comes back, and after that the seven listen to everything you say.", effects:{ stats:{ renown:4, willpower:2 }, flags:{ add:["led"] } } },
      failure:{ text:"They go. Most of them do not come back and the ones who do blame you for the delay.", effects:{ stats:{ renown:-3 } } },
      effects:{ goto:"sn1_3" } },
  ]
},
{
  id:"sn1_3", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Lantern March",
  text:"The conflict is the road.\n\nThere is no destination. There has never been a destination. Forty thousand people are burning themselves down to light a march to nowhere, and they keep walking because the alternative — stopping, all at once, in the dark, together — is the one thing the rule exists to prevent.\n\nStop the column and the Nightmare resolves. Stop the column and forty thousand lanterns go out at the same moment, in front of the thing that collects them.",
  choices:[
    { label:"Stop it. Stand in the road.", hint:"Willpower. Everything in here will be looking at you.",
      check:{ stat:"willpower", dc:17, fatal:4, fatalKind:"nightmare",
        fatalText:"You stand in the road and the column walks into you and over you and closes up above you, and keeps walking.",
        fatalCause:"Trampled to nothing in the Lantern March." },
      success:{ text:"You stand in the road and you do not move and the first rank stops because there is nowhere else to put their feet.\n\nIt takes eleven minutes for the whole column to come to a halt. Forty thousand lanterns go out. The thing beside the road comes in, and finds that there is nothing left to collect, because a marcher who has stopped burning is not a marcher any more.\n\nThe Nightmare comes apart around you like a held breath.", effects:{ stats:{ willpower:5, renown:8 }, flags:{ add:["stopped_the_march"] }, goto:"sn_resolve" } },
      failure:{ text:"You stop about nine hundred of them. It is enough to break the rhythm and not enough to end it, and what happens next happens to the nine hundred.", effects:{ stats:{ vitality:-6, willpower:2, renown:2 }, goto:"sn_resolve" } } },
    { label:"Put your own lantern out and see what it does.", hint:"Cunning. Nobody has ever volunteered.",
      check:{ stat:"cunning", dc:15, fatal:4, fatalKind:"nightmare",
        fatalText:"It comes in to collect and it is thorough and it is not remotely interested in your reasoning.",
        fatalCause:"Collected from the Lantern March, by choice." },
      success:{ text:"It comes for you and finds a thing that is not burning, has never been burning, and does not belong to the road at all — and for one long moment the entire arrangement has to decide what you are.\n\nThat moment is the crack in it.", effects:{ stats:{ cunning:5, willpower:3, renown:5 }, kill:{ rank:2, size:1 }, goto:"sn_resolve" } },
      failure:{ text:"It comes for you. You are not what it expected and it takes a great deal of you finding that out.", effects:{ stats:{ vitality:-8 }, goto:"sn_resolve" } } },
  ]
},

/* -------------------------------------------------------------------
   SECOND NIGHTMARE B — THE IRON ORCHARD
------------------------------------------------------------------- */
{
  id:"sn2_1", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Iron Orchard",
  text:"Twelve thousand trees in rows to the horizon, and every one of them is a weapon.\n\nBlades growing out of black wood like fruit — swords, spears, things without names — ripening, falling, rusting into the soil to feed the next crop. The orchard is tended. You can see the tenders working the far rows, and they are not people, and they are extremely good at it.\n\nSeven other challengers came through with you. Two are already arming themselves.",
  choices:[
    { label:"Arm yourself. Obviously.", hint:"Perception. Choose carefully.",
      check:{ stat:"perception", dc:12, fatal:4, fatalKind:"nightmare",
        fatalText:"The blade you pick is ripe. Ripe means it has finished growing and started wanting.",
        fatalCause:"Killed by a ripe blade in the Iron Orchard." },
      success:{ text:"You take an unripe one, half-formed, still soft at the tang — useless as a weapon and utterly inert. The two who took ripe ones are dead before the second day.", effects:{ stats:{ perception:3, cunning:2 }, flags:{ add:["unripe_blade"] } } },
      failure:{ text:"You take a good one. It is a very good one. It is also awake, and the argument about who is holding whom takes three days to settle.", effects:{ stats:{ vitality:-4, willpower:2 } } },
      effects:{ goto:"sn2_2" } },
    { label:"Touch nothing. Walk the rows and watch the tenders.",
      effects:{ stats:{ perception:2, willpower:2 }, flags:{ add:["watched"] }, goto:"sn2_2" } },
  ]
},
{
  id:"sn2_2", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Iron Orchard",
  text:"The tenders are Awakened-ranked, and there are a great many of them, and they are not hostile until you pick something.\n\nThey prune. They graft. They walk the rows with an air of enormous patience and they bury things at the roots, and on the fourth day you get close enough to see what the things are.\n\nChallengers. Previous ones. The orchard is fed on people who came here to take a weapon out of it.",
  choices:[
    { label:"Dig one up. Find out how long this has been running.", hint:"Willpower",
      check:{ stat:"willpower", dc:14, fatal:4, fatalKind:"nightmare",
        fatalText:"The tenders take exception. There are more of them than there is of you by a factor you did not have time to estimate.",
        fatalCause:"Buried at the roots of the Iron Orchard." },
      success:{ text:"Armour of a make that has not existed for six hundred years. And under that, another. And under that, another.\n\nThe orchard has had a very long time and a very steady supply.", effects:{ stats:{ willpower:3, perception:2 }, flags:{ add:["knows_the_orchard"] }, kill:{ rank:1, size:2 } } },
      failure:{ text:"You get halfway down and have to fight your way back out of your own hole.", effects:{ stats:{ vitality:-5 } } },
      effects:{ goto:"sn2_3" } },
    { label:"Kill a tender and take its tools.", hint:"Vitality. They are not the conflict, but they are in the way.",
      check:{ stat:"vitality", dc:14, fatal:4, fatalKind:"nightmare",
        fatalText:"One tender is manageable. The orchard does not send one.",
        fatalCause:"Killed by the tenders of the Iron Orchard." },
      success:{ text:"It comes apart like a thing that has never been fought before, which it may not have been. The shears it was using cut orchard-wood, and orchard-wood is the only thing here that does.", effects:{ stats:{ vitality:-3, renown:2 }, kill:{ rank:1, size:3 }, flags:{ add:["has_shears"] } } },
      failure:{ text:"You kill it. Four more arrive while you are still deciding whether to be pleased.", effects:{ stats:{ vitality:-6 }, kill:{ rank:1, size:1 } } },
      effects:{ goto:"sn2_3" } },
  ]
},
{
  id:"sn2_3", scripted:true, once:true, days:7, fixedTime:true,
  title:"The Iron Orchard",
  text:"The conflict is the harvest.\n\nAt the centre of the orchard is the first tree, and everything else is a cutting from it, and it is fruiting continuously into a world that has no war left to use any of it. It has been producing weapons for an empty field for longer than the language has had a word for the practice.\n\nCut it and the orchard dies. Cutting it requires standing at the centre of twelve thousand armed trees for as long as it takes.",
  choices:[
    { label:"Cut it, with the shears.", requires:{ flags:{ all:["has_shears"] } }, hint:"Willpower. The right tool for once.",
      check:{ stat:"willpower", dc:14, fatal:4, fatalKind:"nightmare",
        fatalText:"The shears work perfectly. The orchard simply has more time than you do.",
        fatalCause:"Killed at the first tree of the Iron Orchard." },
      success:{ text:"It takes six hours and everything you have, and when the first tree comes down twelve thousand others go with it in a sound like the end of an argument.", effects:{ stats:{ willpower:4, renown:6, vitality:-3 }, kill:{ rank:2, size:2 }, goto:"sn_resolve" } },
      failure:{ text:"You cut it. It falls the wrong way, and most of the orchard falls with it, and you are somewhere underneath.", effects:{ stats:{ vitality:-7, willpower:2 }, goto:"sn_resolve" } } },
    { label:"Burn it. You do not need to be precise.", hint:"Vitality. Slower and much worse.",
      check:{ stat:"vitality", dc:16, fatal:4, fatalKind:"nightmare",
        fatalText:"Iron does not burn well. You have a great deal of time to reflect on this.",
        fatalCause:"Killed trying to burn the Iron Orchard." },
      success:{ text:"It takes eleven days and it works, in the end, because everything works in the end if you are willing to still be standing there.", effects:{ stats:{ vitality:-6, willpower:4, renown:4 }, kill:{ rank:2, size:1 }, goto:"sn_resolve" } },
      failure:{ text:"It half-burns. Half is enough for the Nightmare to lose coherence, and not enough for anyone to call it conquered cleanly.", effects:{ stats:{ vitality:-8 }, goto:"sn_resolve" } } },
    { label:"Leave. A Seed can be abandoned; only conquest is once-in-a-life.",
      effects:{ stats:{ willpower:-1, renown:-3 }, flags:{ add:["fled_second"] }, chapter:"awakened" } },
  ]
},
{
  id:"sn_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Master",
  text:"The Seed resolves and spits you back into the Dream Realm, and the Spell writes one line, and the line is a rank.\n\nAscended. Master, in the older language. Another Aspect Ability, a Soul Core of a different quality altogether, and three hundred and twenty years instead of a hundred and forty.\n\nSomething else has changed, and it takes you a week to name it: you no longer need to be asleep. You can walk into the Dream Realm on your own feet now, leaving a tether behind you in the waking world, like a man leaving a rope down a well.",
  choices:[
    { label:"Go up.", effects:{ rank:1, chapter:"ascended", stats:{ essence:5, renown:6 } } },
  ]
},

/* ===================================================================
   ACT IV — MASTER
   Canon: only a few dozen Saints exist in the world, and that is not
   an accident of difficulty alone. The Sovereigns have spent decades
   "suppressing the Transcendence of independent Awakened", because
   Obel's theory is that every Ascension increases the number and
   intensity of Nightmare Gates. An unaffiliated Master who starts
   looking like Saint material becomes a political problem.
=================================================================== */
{
  id:"ms_long", chapter:"ascended", weight:30, cooldown:12, days:40,
  title:"The Long View",
  text:"You had not understood, as an Awakened, what the older ones meant about time going strange.\n\nYou sit down with a problem and stand up with a decade gone. Nothing was wasted. It is simply that a Master's life is measured on a longer ruler and the small years stop leaving marks.",
  choices:[
    { label:"Deepen the Core.", effects:{ stats:{ essence:4, willpower:2 } } },
    { label:"Build something that outlasts you.", effects:{ stats:{ renown:5, cunning:3 } } },
    { label:"Go down to the waking world and remember why you started.", effects:{ stats:{ vitality:2, willpower:2, tether:2 } } },
  ]
},
{
  id:"ms_gate", chapter:"ascended", weight:26, cooldown:20, days:50,
  title:"The Duty Does Not Stop",
  text:"A Master answers the Gates that Awakened cannot. That is the whole of the promotion, from the outside: harder Gates, fewer colleagues, and a communicator that now only rings for the bad ones.",
  choices:[
    { label:"Take it.", hint:"Willpower",
      check:{ stat:"willpower", dc:15, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Corrupted came through. They are not supposed to come through. The grading system has a category for what happened next and it is used about twice a century.",
        fatalCause:"Killed by a Corrupted that stepped through a Gate it should not have fit." },
      success:{ text:"Fallen-ranked, entrenched, and three days of work. You close it and the district never learns how close it was.", effects:{ stats:{ vitality:-3, renown:4 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"You close it. It costs you a year of recovery and a piece of your left side.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Send others. You have people now.",
      effects:{ stats:{ renown:-2, cunning:2 }, flags:{ add:["sent_others"] } } },
  ]
},
{
  id:"ms_suppression", chapter:"ascended", weight:22, once:true, days:200,
  requires:{ stats:{ renown:{ min:14 } }, flags:{ none:["clan"] } },
  title:"A Quiet Word From Very High Up",
  text:"You are unaffiliated, you are visibly on the road to Transcendence, and somebody has finally decided that is a problem worth solving.\n\nThe emissary is polite. The offer is a Legacy Clan's full backing, in exchange for the Third Nightmare happening on their timetable, which is to say later, which is to say — reading between the extremely well-mannered lines — never.\n\nThe Sovereigns have been managing the number of new Saints for decades. Every Ascension, the theory runs, thickens the Gates. You are being managed.",
  choices:[
    { label:"Accept. A patron is worth more than a principle.",
      effects:{ stats:{ renown:8, essence:4 }, flags:{ add:["clan_owned"] } } },
    { label:"Refuse politely, and start moving quietly.", hint:"Cunning",
      check:{ stat:"cunning", dc:16, fatal:5, fatalKind:"murdered",
        fatalText:"They are decades ahead of you at this. They have been doing it since before you were infected.",
        fatalCause:"Removed. The record says a Gate; the record is not correct." },
      success:{ text:"You spend forty years being smaller than you are. It works. When you finally move, nobody who matters is looking at you.", effects:{ stats:{ cunning:5, renown:-6 }, flags:{ add:["went_quiet"] }, days:120 } },
      failure:{ text:"They notice. Nothing happens for eleven years, and then a great deal happens at once, and you spend a century rebuilding.", effects:{ stats:{ renown:-10, vitality:-4 } } } },
    { label:"Refuse, publicly, and dare them.",
      effects:{ stats:{ renown:6, willpower:3 }, flags:{ add:["defiant","watched"] } } },
  ]
},
{
  id:"ms_ancient", chapter:"ascended", weight:8, once:true, days:300,
  requires:{ stats:{ essence:{ min:30 }, willpower:{ min:26 } } },
  title:"The Ancient Path",
  text:"Canon leaves a door open that almost nobody uses: the Path of Ascension could reach Transcendence without conquering a Third Nightmare.\n\nThe Spell is training wheels. It is a fast, harrowing, streamlined road, and it exists because the older methods — soul-refining techniques, patiently applied over centuries — were mostly lost. Mostly.\n\nYou have found a fragment of one. It will take two hundred years and it may not work.",
  choices:[
    { label:"Take the slow road.", hint:"Willpower. Two centuries of it.",
      check:{ stat:"willpower", dc:22, fatal:7, fatalKind:"ascension",
        fatalText:"Reforming a soul core by hand, without the Spell holding the shape, goes wrong somewhere in the second century. There is no dramatic moment. You simply do not finish.",
        fatalCause:"Unmade attempting the ancient soul-refining path." },
      success:{ text:"Two hundred and ten years, alone, refining essence by hand.\n\nYou come out of it Transcendent without the Spell ever having graded you, which is a thing perhaps four people alive can say, and none of them advertise it.", effects:{ rank:1, chapter:"transcendent", stats:{ essence:8, willpower:6, renown:2 }, flags:{ add:["ancient_path"] } } },
      failure:{ text:"A hundred and forty years in, the technique's fragment runs out. What you have is not nothing. It is not Transcendence either.", effects:{ stats:{ essence:6, willpower:4 }, days:200 } } },
    { label:"Leave it. The Spell's road is faster for a reason.", effects:{ stats:{ cunning:2 } } },
  ]
},
{
  id:"ms_third", chapter:"ascended", weight:24, once:true, days:250,
  requires:{ stats:{ willpower:{ min:24 }, essence:{ min:20 } }, flags:{ none:["clan_owned"] } },
  title:"A Third Seed",
  text:"There are a few dozen Saints in the world. That is the whole population, across every clan and citadel and quadrant, and each of them is a force that reshapes the map around wherever they happen to stand.\n\nA Third Seed is maturing. Conquer it and you are Transcendent — nine hundred years, a Transformation, and a place on a list short enough to memorise.\n\nAlmost everyone who tries this is already the best Master anyone has ever seen, and most of them do not come back.",
  choices:[
    { label:"Go.", effects:{ nightmare:"third" } },
    { label:"Wait for a better Seed and a better century.", effects:{ stats:{ willpower:2 }, days:400 } },
  ]
},
{
  id:"tn1_1", scripted:true, once:true, days:4, fixedTime:true,
  title:"The Assembly of Mouths",
  text:"A parliament, in session, in a chamber the size of a weather system.\n\nEvery seat is occupied by something that is mostly a mouth. They are debating. They have been debating for an age of the world, and the motion under discussion is what the Dream Realm is for, and the debate is binding — whatever the Assembly concludes, the region outside becomes.\n\nOutside, through the windows, the landscape is changing every few minutes as the argument swings.\n\nThere are three other challengers. Two are Saints' students. One is something you cannot read at all.",
  choices:[
    { label:"Take the floor.", hint:"Willpower. You are not a member.",
      check:{ stat:"willpower", dc:4, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"Speaking out of turn is a procedural matter. The Assembly resolves procedural matters by consuming them.",
        fatalCause:"Consumed by the Assembly of Mouths for speaking out of turn." },
      success:{ text:"You speak. Eleven thousand mouths stop at once, which has not happened in the history of the chamber, and for the length of one sentence the landscape outside holds perfectly still.", effects:{ stats:{ willpower:5, renown:6 }, flags:{ add:["spoke"] } } },
      failure:{ text:"You are shouted down and something takes an arm as a point of order.", effects:{ stats:{ vitality:-6, willpower:2 } } },
      effects:{ goto:"tn1_2" } },
    { label:"Find who tabled the motion.", hint:"Perception",
      check:{ stat:"perception", dc:4, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You find the bench it was tabled from. It is occupied, and it has been waiting for someone to come and ask.",
        fatalCause:"Killed in the back benches of the Assembly of Mouths." },
      success:{ text:"Nobody tabled it. The motion tabled itself, and the Assembly grew up around the need to argue it, and every mouth in here was once a challenger who tried to answer.", effects:{ stats:{ perception:5, cunning:3 }, flags:{ add:["knows_the_motion"] } } },
      failure:{ text:"You spend four months in the galleries and learn only the standing orders.", effects:{ stats:{ vitality:-4, perception:2 } } },
      effects:{ goto:"tn1_2" } },
  ]
},
{
  id:"tn1_2", scripted:true, once:true, days:9, fixedTime:true,
  title:"The Assembly of Mouths",
  text:"The conflict is the motion, and the motion cannot be won, because winning it would end the Assembly and the Assembly is what is doing the arguing.\n\nThe only resolution is to answer the question in a way that does not require the chamber. And the chamber is listening, now, because you are the first thing in an age to say something it had not already said to itself.",
  choices:[
    { label:"Answer it. Properly. Once.", hint:"Willpower. There is no second attempt.",
      check:{ stat:"willpower", dc:6, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"Your answer is heard, considered, and found to be a contribution to the debate rather than an end to it. The Assembly welcomes new members.",
        fatalCause:"Seated. You are the eleven thousand and first mouth of the Assembly." },
      success:{ text:"You give it an answer that does not need a chamber to hold it, and eleven thousand mouths close, and stay closed.\n\nOutside, the landscape stops changing and settles into being one thing, at last, forever.\n\nThe Spell writes a word on the inside of your eyes and the word is not one it uses often.", effects:{ stats:{ willpower:6, renown:12 }, flags:{ add:["answered"] }, goto:"tn_resolve" } },
      failure:{ text:"Your answer holds for nine hundred seconds. Nine hundred seconds is, by the standards of this chamber, a landslide.", effects:{ stats:{ vitality:-8, willpower:4, renown:6 }, goto:"tn_resolve" } } },
    { label:"Withdraw. A Seed can be abandoned.",
      effects:{ stats:{ renown:-4, willpower:-1 }, flags:{ add:["fled_third"] }, chapter:"ascended" } },
  ]
},
{
  id:"tn_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Saint",
  text:"Transcendent.\n\nThe old word for it is Saint, and there are a few dozen of those, and as of this moment you are one of them.\n\nNine hundred years. A Transformation Aspect Ability you have not yet dared use. And a change in what you are that you notice first in a small way: you no longer need a Gateway. You are one. You can step between the worlds where you stand, and take someone with you if you choose.\n\nSomewhere, three people who have been managing the number of Saints in the world for decades are being informed.",
  choices:[
    { label:"Accept it.", effects:{ rank:1, chapter:"transcendent", stats:{ essence:8, renown:10 } } },
  ]
},

/* ===================================================================
   ACT V — SAINT, AND THE FOURTH DOOR
   Canon: Aster, Song and Vale "returned from the Fourth Nightmare
   wreathed in new authority, becoming the first humans to reach
   Supreme Rank". First. Ever. Reaching Supreme does not make you
   powerful — it makes you the fourth person in the history of the
   species to do it.
=================================================================== */
{
  id:"st_centuries", chapter:"transcendent", weight:30, cooldown:20, days:70,
  title:"Centuries",
  text:"A Saint does not have days. A Saint has projects, and the projects have generations inside them.\n\nYou set something in motion, look up, and everyone who began it with you is three lifetimes gone.",
  choices:[
    { label:"Build an order that will outlive you.", effects:{ stats:{ renown:8, cunning:4 } } },
    { label:"Chase the Aspect to the bottom of itself.", effects:{ stats:{ essence:8, willpower:4 } } },
    { label:"Walk among mortals, unannounced, for a while.", effects:{ stats:{ tether:3, vitality:2, willpower:2 } } },
  ]
},
{
  id:"st_tether", chapter:"transcendent", weight:20, cooldown:25, days:80,
  requires:{ stats:{ tether:{ max:6 } } },
  title:"What Is Left Of The Rope",
  text:"The balance has been shifting since the day you Ascended, and it is not subtle any more.\n\nAn Awakened visits the Dream Realm in their sleep. A Master walks in and leaves a tether behind. A Saint is a Gateway. And past that the balance breaks the other way entirely, and the waking world becomes the visit.\n\nYou have been finding reasons not to go back for eleven years.",
  choices:[
    { label:"Go back. Find the last person who remembers your face.",
      effects:{ stats:{ tether:4, willpower:3, renown:-2 }, flags:{ add:["went_home"] } } },
    { label:"Stop pretending. The Dream Realm is where the work is.",
      effects:{ stats:{ tether:-3, essence:6 }, flags:{ add:["let_go"] } } },
  ]
},
{
  id:"st_fourth", chapter:"transcendent", weight:16, once:true, days:400,
  requires:{ stats:{ willpower:{ min:38 }, essence:{ min:34 } } },
  title:"The Fourth Door",
  text:"Three people have ever done this.\n\nAster, Song and Vale came back from the Fourth Nightmare wreathed in an authority the world had no word for, and then chose to say nothing about it and rule from behind the clans instead. There has not been a fourth. There has not been a serious attempt at a fourth in living memory, and living memory now means yours.\n\nSix thousand years on the other side of it. And a world that will spend every one of them declining to hold you.",
  choices:[
    { label:"Go.", effects:{ nightmare:"fourth" } },
    { label:"Stay. Nine hundred years is a long time to be someone.",
      effects:{ stats:{ willpower:4, tether:2 }, flags:{ add:["chose_to_stay"] } } },
  ]
},
{
  id:"qn1_1", scripted:true, once:true, days:10, fixedTime:true,
  title:"The Quiet Between Stars",
  text:"There is no landscape.\n\nThere is a distance, and things at enormous intervals within it, and the distance is the Nightmare. The conflict is not a creature or a bargain or a debate. It is the interval itself: nothing here can reach anything else, has never been able to, and the whole of this place is the shape that fact has worn into existence over an unimaginable span.\n\nYou are the only thing in it that has ever arrived from somewhere.",
  choices:[
    { label:"Cross it.", hint:"Willpower. There is no other verb available.",
      check:{ stat:"willpower", dc:9, dcSelf:true, fatal:1, fatalKind:"nightmare",
        fatalText:"You go out into the interval. The interval is what happens to things that go out into it.",
        fatalCause:"Lost in the Quiet Between Stars. No body, no Gateway, no record." },
      success:{ text:"You cross it, and crossing it is the answer, because a distance that has been crossed once is no longer the kind of distance this place was built out of.\n\nSomething very old stops being true.\n\nYou come back through with an authority you did not go in with, and the Spell has no word for you, and neither does anyone else. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ essence:14, renown:20, willpower:8 }, flags:{ add:["fourth"] } } },
      failure:{ text:"You do not cross it. You survive it, which nobody has done either, and you come back nine hundred years older in a body that has not aged and a mind that has.", effects:{ stats:{ willpower:6, essence:6, tether:-4 }, flags:{ add:["saw_the_interval"] }, days:600, chapter:"transcendent" } } },
    { label:"Turn around while turning around is still a thing that can be done.",
      effects:{ stats:{ willpower:2, renown:-6 }, flags:{ add:["fled_fourth"] }, chapter:"transcendent" } },
  ]
},

/* ===================================================================
   ACT VI — SOVEREIGN
   Canon: no Awakened of the current cycle has ever returned from the
   Fifth Nightmare. Anvil and Ki Song declined it outright rather
   than leave humanity without Supremes; Asterion called it a far
   greater gamble than the previous four combined, with slim odds,
   and warned that even success does not leave you yourself. The
   loss of self is what destroyed the Sun Realm civilisation.
=================================================================== */
{
  id:"sv_millennia", chapter:"supreme", weight:30, cooldown:14, days:100,
  title:"Millennia",
  text:"The waking world declines you now the way water declines oil — without malice, as a property of what you have become. You visit rarely, briefly, and it costs.\n\nThe rest is the Dream Realm, and the long work, and the occasional century that goes by without your noticing it went.",
  choices:[
    { label:"Hold a Gate no one else can hold.", effects:{ stats:{ renown:12, essence:6, vitality:-2 }, kill:{ rank:5, size:1 } } },
    { label:"Go looking for what makes the Nightmares.", effects:{ stats:{ essence:10, perception:8 } } },
    { label:"Build a landing zone. The waking world will not last forever.", effects:{ stats:{ renown:10, cunning:6 }, flags:{ add:["built_refuge"] } } },
  ]
},
{
  id:"sv_fifth", chapter:"supreme", weight:14, once:true, days:800,
  requires:{ stats:{ willpower:{ min:55 }, essence:{ min:50 } } },
  title:"The Fifth Nightmare",
  text:"Nobody from this cycle of the Spell has ever come back from it.\n\nEverything known about the Fifth is scavenged from the chronicles of civilisations the Spell used up before ours. It is two trials rather than one — a personal trial cut to fit you, and a collective one — and failure in either is death. Beyond it is Apotheosis: godhood, of the lesser kind.\n\nAnvil and Ki Song were offered this door and declined it, on the grounds that humanity could not afford to lose its Supremes. Asterion declined it on the grounds that he had a safer route to divinity and no interest in dying for the scenic one.\n\nAnd the warning underneath all of it: the Spell does not care whether you are still yourself afterwards. The Sun Realm went this way. Its gods ate their own world.",
  choices:[
    { label:"Enter.", hint:"Willpower. The odds are worse than everything you have already survived, combined.",
      check:{ stat:"willpower", dc:10, dcSelf:true, fatal:1, fatalKind:"nightmare",
        fatalText:"The personal trial goes first. It always does.",
        fatalCause:"Unmade in the Fifth Nightmare, like everyone else this cycle." },
      success:{ text:"You conquer both trials and the Spell facilitates Apotheosis in record-breaking time, and the transformation is not something you get to steer.\n\nSomething comes out of it. It has your history and your Aspect and the shape of your intentions.\n\nWhether it is you is a question the Spell was never designed to answer, and there is nobody left alive who knew you well enough to check.", effects:{ rank:1, chapter:"sacred", stats:{ essence:20, renown:30, tether:-8 }, flags:{ add:["apotheosis"] } } },
      failure:{ text:"You survive the personal trial and fail the collective one, and the Nightmare returns what is left of you to the Dream Realm without comment.", effects:{ stats:{ vitality:-13, willpower:4, essence:-10 }, days:1000 } } },
    { label:"Decline, as Anvil and Ki Song declined. Humanity needs Supremes more than it needs a god.",
      effects:{ stats:{ willpower:6, renown:10 }, flags:{ add:["declined_fifth"] } } },
  ]
},
{
  id:"sc_after", chapter:"sacred", weight:30, cooldown:20, days:400,
  title:"Sacred",
  text:"The gap between Supreme and Sacred is wider than the gap between every lower rank combined. It is not a difference of power. It is a difference in the inherent quality of being a thing at all.\n\nForty thousand years, if the arithmetic still applies to you. There is one more door after this one, and beyond that, the last.",
  choices:[
    { label:"Look for the Sixth.", effects:{ stats:{ essence:20, willpower:10 }, flags:{ add:["seeking_sixth"] } } },
    { label:"Stay, and hold the world together for a while.", effects:{ stats:{ renown:20, tether:2 } } },
  ]
},

/* ===================================================================
   THE WORLD GETS WORSE
   Obel's theory, from the wiki: the Ascension of many Awakened is
   what drives "the growing number and intensity of the Nightmare
   Gates". It is also why the Sovereigns suppress new Saints.
   Mechanically this is the load-bearing event of the whole game:
   it has no safe branch, and its difficulty climbs with the years,
   so refusing to ascend is not a survival strategy. It is a slower
   way of choosing the same ending.
=================================================================== */
{
  id:"world_worse", chapter:"awakened", weight:34, cooldown:70, days:70,
  title:"It Is Getting Worse",
  text:"Everyone who has been doing this for more than twenty years says the same thing, and the clans keep denying it, and the numbers keep agreeing with everyone who has been doing this for more than twenty years.\n\nThere are more Gates than there were. They are opening faster and grading higher. The theory nobody will print is that every Ascension thickens them — that the Awakened are the cause, and that the more of you there are and the higher you climb, the worse the world you are climbing in becomes.\n\nThis one has opened directly beneath you, which is new.",
  choices:[
    { label:"Fight it in the open.", hint:"Vitality",
      check:{ stat:"vitality", dc:11, dcScale:2, dcEra:3, fatal:3, fatalKind:"gate",
        fatalText:"It is two grades above what the classification says, because the classifications were written when the world was quieter.",
        fatalCause:"Killed by a Gate that would not have existed twenty years earlier." },
      success:{ text:"You put it down in the street with half a district watching. It takes longer than it would have a decade ago.", effects:{ stats:{ vitality:-3, renown:3 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"You put it down. It takes three days and most of what you had.", effects:{ stats:{ vitality:-5, renown:1 }, kill:{ rank:1, size:1 } } } },
    { label:"Break contact and evacuate the district instead.", hint:"Perception. Fewer die. Not none.",
      check:{ stat:"perception", dc:10, dcScale:2, dcEra:3, fatal:4, fatalKind:"gate",
        fatalText:"You are the last one out of the cordon, which is the correct order and the wrong place to be.",
        fatalCause:"Killed covering an evacuation that was one street too slow." },
      success:{ text:"Eleven thousand people out in four hours. The Gate burns for a week and takes the district with it, and nobody important thanks you.", effects:{ stats:{ renown:2, willpower:2, vitality:-2 } } },
      failure:{ text:"Most of them get out.", effects:{ stats:{ vitality:-4, renown:-2 }, flags:{ add:["cracked"] } } } },
  ]
},
{
  id:"ms_worse", chapter:"ascended", weight:26, cooldown:26, days:90,
  title:"The Numbers Keep Climbing",
  text:"You have been at this long enough now to have your own data, and your own data says the clans are lying by a factor of about three.\n\nA Master closes what an Awakened cannot. Every decade there is more of it, and the grading keeps having to be revised upward, and the revisions keep lagging the reality by about eighteen months. Eighteen months is a great many funerals.",
  choices:[
    { label:"Close it.", hint:"Willpower",
      check:{ stat:"willpower", dc:16, dcScale:3, dcEra:3, fatal:3, fatalKind:"gate",
        fatalText:"Corrupted. In a Gate graded for Fallen. The revision will be published in about eighteen months.",
        fatalCause:"Killed by a Corrupted in a Gate graded two categories too low." },
      success:{ text:"Closed. You are getting very good at this and it is getting very slightly worse than you are getting good.", effects:{ stats:{ vitality:-4, renown:5 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"Closed, eventually, at a price you would not have paid a century ago.", effects:{ stats:{ vitality:-7, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Pull the Awakened out first and take it alone.", hint:"Vitality. Slower, and yours.",
      check:{ stat:"vitality", dc:15, dcScale:3, dcEra:3, fatal:3, fatalKind:"gate",
        fatalText:"Alone means alone. That was the entire point of the decision and it remains the point of it now.",
        fatalCause:"Killed alone in a Gate you had cleared of everyone who might have helped." },
      success:{ text:"Nine Awakened who would have died do not. You are three months healing and would do it again.", effects:{ stats:{ vitality:-6, renown:7, willpower:2 }, kill:{ rank:3, size:1 }, flags:{ add:["carried_them"] } } },
      failure:{ text:"They live. You are a year putting yourself back together.", effects:{ stats:{ vitality:-9, renown:4 } } } },
  ]
},
{
  id:"aw_sanction", chapter:"awakened", weight:22, cooldown:40, days:50,
  requires:{ flags:{ all:["shirked"] } },
  title:"The Privileges Were Not A Gift",
  text:"An Awakened who does not answer is a problem with a file.\n\nThe communicator is not a courtesy. It is the visible half of an arrangement — housing, essence, standing, protection — and the invisible half is that you go when it rings. You have not been going.\n\nThey do not arrest you. They simply stop, one by one, doing the things that were keeping you alive.",
  choices:[
    { label:"Answer everything for a decade. Rebuild the file.", hint:"Vitality. All the worst calls, all at once.",
      check:{ stat:"vitality", dc:13, dcScale:2, dcEra:3, fatal:3, fatalKind:"gate",
        fatalText:"They give you the calls nobody else wants, which is exactly what you asked for.",
        fatalCause:"Killed working off a debt to the people who hand out the Gates." },
      success:{ text:"Ten years of the worst rotations on the board. At the end of it the file is clean and you are not the person who started it.", effects:{ stats:{ renown:6, vitality:-4, willpower:2 }, flags:{ remove:["shirked"] }, kill:{ rank:1, size:3 } } },
      failure:{ text:"You work most of it off.", effects:{ stats:{ renown:2, vitality:-6 } } } },
    { label:"Go independent. Live outside the arrangement.", hint:"Cunning. Nobody is coming when it opens near you.",
      check:{ stat:"cunning", dc:14, dcScale:2, dcEra:3, fatal:4, fatalKind:"gate",
        fatalText:"A Gate opens four streets away and there is no cordon, no support and no one on the other end of anything, because you asked for exactly that.",
        fatalCause:"Killed at an unanswered Gate, independent and alone." },
      success:{ text:"You make it work. It is a thinner, sharper, more watchful life and it is entirely your own.", effects:{ stats:{ cunning:4, renown:-4, perception:2 }, flags:{ add:["independent"] } } },
      failure:{ text:"It half works. You are alive and you are not eating well.", effects:{ stats:{ vitality:-5, renown:-3 } } } },
  ]
},

/* ===================================================================
   THE ACTS ABOVE MASTER NEED TEETH TOO
   Canon: Anvil of Valor and Ki Song "must expand their influence to
   perfect their Domains, but due to limited human Citadels, they
   cannot coexist. This leads to a war between their clans."
   Antarctica is named as the first major battlefield and the clash
   is described as extremely fierce and bloody. A Saint does not get
   nine hundred quiet years; a Saint gets drafted.
=================================================================== */
{
  id:"st_war", chapter:"transcendent", weight:26, cooldown:22, days:90,
  title:"The Clans Cannot Coexist",
  text:"Two Sovereigns are perfecting Domains that require the same Citadels, and there are not enough Citadels, and so one Domain must swallow the other.\n\nThat is the whole of the reasoning and it has been sufficient to start a war across a quadrant. The Southern front opens in Antarctica. Both sides are counting Saints, and there are only a few dozen Saints, and everyone knows the name of every single one.\n\nIncluding yours.",
  choices:[
    { label:"Take a side and fight it.", hint:"Willpower. Saints do not fight anything smaller than each other.",
      check:{ stat:"willpower", dc:5, dcSelf:true, fatal:2, fatalKind:"war",
        fatalText:"You meet another Saint on an ice shelf at the bottom of the world. One of you was always going to be the one who did not leave.",
        fatalCause:"Killed by another Saint in the Southern Quadrant war." },
      success:{ text:"You break a front that a hundred thousand Awakened could not have moved, and the ice will be a different shape for a thousand years.", effects:{ stats:{ renown:12, vitality:-6 }, kill:{ rank:3, cores:1, size:6 }, flags:{ add:["war_saint"] } } },
      failure:{ text:"You hold your section. It costs you a century of recovery and a piece of your Aspect you will not get back.", effects:{ stats:{ vitality:-9, essence:-4, renown:5 } } } },
    { label:"Refuse both sides.", hint:"Cunning. Neutrality is a position, and positions get attacked.",
      check:{ stat:"cunning", dc:5, dcSelf:true, fatal:3, fatalKind:"murdered",
        fatalText:"Neutral is a word for a Saint whose Domain nobody has claimed yet. Both sides reach the same conclusion in the same month.",
        fatalCause:"Removed by both clans at once for refusing to choose." },
      success:{ text:"You keep out of it and make yourself expensive enough to leave alone. It works, at the cost of every alliance you had.", effects:{ stats:{ cunning:6, renown:-8 }, flags:{ add:["neutral"] } } },
      failure:{ text:"They let you sit it out and never forget that you did.", effects:{ stats:{ renown:-12, essence:-3 } } } },
  ]
},
{
  id:"sv_chain", chapter:"supreme", weight:26, cooldown:16, days:200,
  title:"The Chain of Nightmares",
  text:"The Sovereigns gave up on the waking world some time ago, and they were not being cowardly about it.\n\nThe Chain of Nightmares is coming, the arithmetic on it is not in dispute, and the only serious response anyone has proposed is to build a landing zone on the other side — two hundred million people evacuated directly into the Dream Realm, and a place prepared to receive them.\n\nHolding the ground while that happens is what a Supreme is for. It is also what kills them.",
  choices:[
    { label:"Hold the line yourself.", hint:"Willpower. There is nothing above you to call.",
      check:{ stat:"willpower", dc:6, dcSelf:true, fatal:2, fatalKind:"chain",
        fatalText:"Something comes through that has no rank the Spell will name. You are the only thing in the world large enough to be in its way, and being in its way is all you get to do.",
        fatalCause:"Killed holding the line against the Chain of Nightmares." },
      success:{ text:"You hold it. Nobody will ever know how close it was, because everyone who could have measured it was standing behind you.", effects:{ stats:{ renown:20, vitality:-8, essence:6 }, kill:{ rank:6, size:2 } } },
      failure:{ text:"You hold it, and a quadrant does not survive the holding.", effects:{ stats:{ vitality:-14, renown:8 } } } },
    { label:"Spend the years on the landing zone instead.", hint:"Cunning. Somebody has to build the thing.",
      check:{ stat:"cunning", dc:6, dcSelf:true, fatal:4, fatalKind:"chain",
        fatalText:"You are deep in the Dream Realm, far from any front, doing careful work, when the Chain reaches the place you thought was behind the line.",
        fatalCause:"Killed in the Dream Realm building a refuge that was not finished." },
      success:{ text:"A place for two hundred million people, made out of a hostile world by hand, over three centuries. It is the only thing you have ever built that will outlast the species that asked for it.", effects:{ stats:{ renown:16, cunning:8 }, flags:{ add:["built_refuge"] } } },
      failure:{ text:"Most of it gets built. Most of it is not all of it, and the difference has a population.", effects:{ stats:{ renown:6, willpower:-2 } } } },
  ]
},

{
  id:"sl_waiting", chapter:"sleeper", weight:30, cooldown:40, days:60,
  title:"Waiting For Winter",
  text:"The strangest part of being a Sleeper is how ordinary the waiting is.\n\nYou have a Soul Core you cannot really use, an Aspect that answers about half the time, and a Flaw that has already started rearranging your life around itself. And a date in December, and nothing to do until then but get ready in whatever way you think readiness looks like.",
  choices:[
    { label:"Push the body. It is the only part of this you control.", effects:{ stats:{ vitality:2, willpower:1 } } },
    { label:"Learn what the regions of the Dream Realm are called.", effects:{ stats:{ perception:2, cunning:1 } } },
    { label:"Test the Aspect until it answers reliably.", effects:{ stats:{ essence:2, willpower:1 } } },
  ]
},
];
