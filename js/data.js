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
  { id:"salt",     name:"Salt",     desc:"You keep things. Nothing you have held ever quite finishes rotting.",  stats:{ vitality:2, willpower:2 }, origins:["outskirts"] },
  { id:"ledger",   name:"Ledger",   desc:"You remember what is owed, in both directions, exactly.",             stats:{ cunning:2, perception:2 }, origins:["citadel"] },
  { id:"hearth",   name:"Hearth",   desc:"People are calmer near you, and it costs you something each time.",   stats:{ willpower:2, renown:2 }, origins:["citadel"] },
  { id:"gate",     name:"Gate",     desc:"Doorways take slightly longer to close behind you than they should.",  stats:{ essence:3 }, origins:["clan"] },
  { id:"harrow",   name:"Harrow",   desc:"You turn ground over. What was buried in you does not stay buried.",   stats:{ vitality:2, cunning:2 }, origins:["outskirts"] },
  { id:"verdict",  name:"Verdict",  desc:"When you decide a thing is finished, it has an unsettling tendency to be.", stats:{ willpower:3, renown:1 }, origins:["clan"] },
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
  { id:"unasked",   name:"The Unasked",   desc:"You cannot ask for help. The words are there and they do not come out.",
    stats:{ renown:-3 }, affinity:["ran_first","hid"] },
  { id:"ledgered",  name:"The Ledgered",  desc:"You keep an exact account of every debt, including the ones nobody is collecting.",
    stats:{ willpower:-2, cunning:-1 }, affinity:["took_the_spoil","asked"] },
  { id:"forewarned",name:"The Forewarned",desc:"You know slightly too much about how you are likely to die, and it is always in the room.",
    stats:{ perception:-1, willpower:-2 }, affinity:["forewarned","noticed"] },
  { id:"unhoused",  name:"The Unhoused",  desc:"Nowhere holds you. You have not slept in the same place twice since.",
    stats:{ vitality:-1, essence:-2 }, affinity:["said_goodbye","abandoned"] },
  { id:"first",     name:"The First",     desc:"You move before you decide to. It has saved you twice and cost you more.",
    stats:{ perception:-3 }, affinity:["struck_first","walked_toward"] },
  { id:"unspent",   name:"The Unspent",   desc:"Your Aspect holds back a portion of itself, always, and will not say why.",
    stats:{ essence:-2, willpower:-1 }, affinity:["faced_it","came_back_for_them"] },
];

/* -------------------------------------------------------------
   LINEAGE
   Canon, and easy to get wrong: a lineage is a *hereditary*
   Attribute, "especially true for Great Clans whose scions
   inherited the same lineage Attribute" (wiki: Legacy Clans), and
   a Divine Lineage is the inherited lineage of a divine creature.

   The trap: Divine Lineage and Divine Aspect are two different
   things, and the wiki is explicit that they are unrelated —
   "Possessing a lineage of a certain divine creature doesn't mean
   their aspect has to be related to it as well." Every documented
   case bears that out: Mordret carried the lineage of the War God
   with an Aspect about reflections; Sunny the lineage of the
   Weaver with an Aspect tied to the Shadow God; Nephis the lineage
   of the Sun God with an Aspect tied to the Nephilim.

   So in this game lineage is a THIRD INDEPENDENT AXIS. It biases
   nothing about your Aspect and your Aspect biases nothing about
   it (see `awardAspect` and `awardLineage` in engine.js, which
   deliberately do not consult one another).

   Canon (wiki: Divine Lineage) ties each Great Clan to a god: Valor
   carries the War God's lineage, the House of Night the Storm God's
   (ch. 2603: taken from a Memory, and some of the founders died
   taking it), Song the Beast God's (Ki Song earned the Lineage
   Memory after Awakening; ch. 1924 she gives its blood to Seishan),
   and Immortal Flame the Sun God's (ch. 577). So the clan lineages
   below ARE the divine ones (issue #4). Canon's set is closed: six
   gods and the Weaver, the Demon of Fate. All seven are in the game,
   and nothing else divine is.

   Four of them belong, in canon, to one named character or a dead
   line. A player drawing one is therefore framed as an unknown branch,
   never as that character. These framings are OURS, not canon:
   - Sun God: Immortal Flame fell, and Nephis is its last KNOWN carrier.
     Yours is a branch that left before the fall and kept quiet.
   - Heart God: Asterion is its sole KNOWN inheritor (ch. 1613).
     Yours is a branch he does not know about.
   - Shadow God: canon calls it unclaimed (ch. 1613); Sunny's drop was
     devoured by [Blood Weave] (ch. 551). Yours is a trace that reached
     your family some other way, nobody knows how.
   - Weaver: "Why have the gods forbidden us seven to sire offspring?"
     (ch. 1752). So it is NEVER inherited at birth (`eventOnly`). It can
     only arrive by the event `ev_weave`, where a Weave of its lineage
     devours the one you were born with, the way [Blood Weave] devoured
     the Shadow God's ichor. It is the rarest of the seven.

   Every stat number and every weight here is ours. The weights are out
   of roughly 100 per origin; measured rates are in docs/balance.md.
------------------------------------------------------------- */
const LINEAGES = [
  { id:"none",   name:"No Lineage", short:"—",
    desc:"Nothing in the blood. Like almost everyone.",
    stats:{}, flags:["no_lineage"], weight:{ outskirts:72, citadel:62, clan:6 } },
  { id:"thin",   name:"A Thin Lineage", short:"Thin",
    desc:"Something four generations back, diluted almost to nothing, and still faintly there.",
    stats:{ willpower:1, perception:1 }, weight:{ outskirts:26, citadel:30, clan:12 } },
  /* Canon: the lesser Legacy Clans (Aegis Rose, Dagonet, Han Li, Maharana,
     Pandavar, Sorrow, White Feather...) pass down a hereditary Attribute of
     their own, and some serve a Great Clan. Which clan is left unnamed: the
     player's family is not one of the novel's. */
  { id:"legacy", name:"A Legacy Clan", short:"Legacy",
    desc:"A lesser Legacy Clan, sworn to one of the Great ones. The Attribute is real, and so is the oath that came with it.",
    stats:{ vitality:1, willpower:1, perception:1 }, flags:["legacy_clan"], weight:{ outskirts:1, citadel:5, clan:24 } },
  { id:"valor",  name:"Valor · the War God", short:"Valor", divine:true,
    desc:"The Great Clan born from the Lineage of War. The god is long dead; the blood still makes you very hard to move.",
    stats:{ vitality:3, willpower:2, essence:1 }, flags:["divine_lineage", "clan_lineage"], weight:{ outskirts:0.2, citadel:1, clan:20 } },
  { id:"song",   name:"Song · the Beast God", short:"Song", divine:true,
    desc:"Ki Song's clan, and the Beast God's blood she won for it. Your family hears the shape of a room before it walks in.",
    stats:{ perception:3, willpower:1, essence:1, renown:1 }, flags:["divine_lineage", "clan_lineage"], weight:{ outskirts:0.2, citadel:1, clan:20 } },
  { id:"night",  name:"House of Night · the Storm God", short:"Night", divine:true,
    desc:"The Great Clan born from the Lineage of Storm. The founders took it from a Memory, and not all of them lived through taking it.",
    stats:{ cunning:3, perception:1, essence:1, willpower:1 }, flags:["divine_lineage", "clan_lineage"], weight:{ outskirts:0.2, citadel:1, clan:18 } },
  { id:"sun",    name:"the Sun God", short:"Sun", divine:true,
    desc:"Immortal Flame's lineage, from a branch that left the clan before it fell and never said so. The fire in your blood is the reason you keep quiet.",
    stats:{ essence:3, willpower:2, vitality:1 }, flags:["divine_lineage", "hidden_lineage"], weight:{ outskirts:0.15, citadel:0.2, clan:0.6 } },
  { id:"heart",  name:"the Heart God", short:"Heart", divine:true,
    desc:"Asterion is supposed to be its only heir. Your family is a branch nobody wrote down, and you would very much like it to stay that way.",
    stats:{ cunning:2, willpower:2, renown:1, essence:1 }, flags:["divine_lineage", "hidden_lineage"], weight:{ outskirts:0.08, citadel:0.15, clan:0.3 } },
  { id:"shadow", name:"the Shadow God", short:"Shadow", divine:true,
    desc:"The lineage nobody claimed. A trace of it reached your family somehow, and the shadows have stood a little closer to you ever since.",
    stats:{ perception:3, cunning:2, essence:1 }, flags:["divine_lineage", "hidden_lineage"], weight:{ outskirts:0.12, citadel:0.12, clan:0.12 } },
  { id:"weaver", name:"the Weaver · Demon of Fate", short:"Weaver", divine:true, eventOnly:true,
    desc:"A Weave of the lineage the gods forbade. It was not born in you: it ate the blood you were born with and took its place.",
    stats:{ essence:4, cunning:3, perception:2, willpower:2 }, flags:["divine_lineage", "weaver"] },
];

/* -------------------------------------------------------------
   ASPECT RANK
   Canon: the Spell's status page lists "Aspect Rank" as "Same as
   Soul Rank", and there are seven Soul Ranks — Dormant, Awakened,
   Ascended, Transcendent, Supreme, Sacred, Divine. So an Aspect
   rank is not a separate four-step grade; it is the same ladder.
   Canon also says "Aspect Rank is not fixed and can evolve
   depend[ing] on one's feat."

   A DIVINE Aspect is therefore simply an Aspect at the top of that
   ladder — and canon treats it as near-unique: the wiki lists
   exactly three holders, ever. Canon says a Divine Aspect
   "bestowed far greater potential on an Awakened. However, their
   immense power came at the cost of rapidly depleting essence",
   and that such a soul can carry more than one Soul Core, with
   "no limit to the capacity to store essence".

   Canon does NOT say how a Divine Aspect comes about. The gate in
   `awardFlaw` — an extraordinary appraisal plus a rare draw — is
   ours, as are all the bonus numbers below. It is deliberately not
   gated on lineage, because canon says the two are unrelated.
------------------------------------------------------------- */
const ASPECT_RANKS = [
  { id:"Dormant",      bonus:{},                                 note:"The rank every Aspirant starts with." },
  { id:"Awakened",     bonus:{ essence:1, willpower:1 },          note:"An ordinary appraisal." },
  { id:"Ascended",     bonus:{ essence:3, willpower:2 },          note:"The Spell thought well of you." },
  { id:"Transcendent", bonus:{ essence:6, willpower:3 },          note:"Rare. The trial was far off your destined path." },
  { id:"Supreme",      bonus:{ essence:9, willpower:4, perception:2 }, note:"Vanishingly rare." },
  { id:"Sacred",       bonus:{ essence:12, willpower:5, perception:3 }, note:"A handful in recorded history." },
  { id:"Divine",       bonus:{ essence:16, willpower:6, perception:4, cunning:2 },
    note:"Canon names three holders, ever. Greater potential, and an essence that drains as fast as it fills." },
];

/* -------------------------------------------------------------
   CLASS — separate axis from Soul Rank
   Canon (wiki: Nightmare Creature) grades Creatures on TWO
   independent axes. Rank is soul quality: Dormant, Awakened,
   Fallen, Corrupted, Great, Cursed, Unholy. Class is the number of
   Soul Cores: "Beast (1 core), Monster (2 cores), Demon (3 cores),
   Devil (4 cores), Tyrant (5 cores), Terror (6 cores), Titan (7
   cores)."

   Canon on humans is softer than fan summaries suggest. The wiki
   says "Human souls are not meant to have many cores or sustain
   them", and that some Awakened have "the ability to form multiple
   soul cores similar to Nightmare Creatures" — a Divine Aspect
   being the documented case, where "the birth of a new core brings
   immense pain". It does NOT flatly state that every ordinary
   human is capped at one core forever. That cap is OUR inference,
   and the fragment thresholds below are entirely ours.
------------------------------------------------------------- */
/* The fragment figures are calibrated against tools/sim.js, not taken from
   anywhere: a whole skilled life in this game banks roughly 40 fragments,
   130 at the extreme, because `harvest` follows the canon 2^(ranks above
   you) formula and most kills are at or below your own rank. Thresholds in
   the thousands — which is what fan summaries of the Class ladder quote —
   would make every rung above Beast unreachable and the whole axis dead
   content. */
const CLASSES = [
  { id:"beast",   name:"Beast",   cores:1, fragments:0 },
  { id:"monster", name:"Monster", cores:2, fragments:70 },
  { id:"demon",   name:"Demon",   cores:3, fragments:110 },
  { id:"devil",   name:"Devil",   cores:4, fragments:160 },
  { id:"tyrant",  name:"Tyrant",  cores:5, fragments:220 },
  { id:"terror",  name:"Terror",  cores:6, fragments:290 },
  { id:"titan",   name:"Titan",   cores:7, fragments:370 },
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
    { id:"fn_ward",    name:"The Quiet Ward",      entry:"fnm_1", creature:"Monster" },
    { id:"fn_leash",   name:"The Long Leash",      entry:"fnk_1", creature:"Beast" },
  ],
  second: [
    { id:"sn_lantern", name:"The Lantern March",   entry:"sn1_1" },
    { id:"sn_orchard", name:"The Iron Orchard",    entry:"sn2_1" },
    { id:"sn_court",   name:"The Court of Uncounted Debts", entry:"sn3_1" },
  ],
  third:  [ { id:"tn_assembly",  name:"The Assembly of Mouths", entry:"tn1_1" },
            { id:"tn_continent", name:"The Quiet Continent",    entry:"tn2_1" } ],
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
  { id:"sol_belfry",    name:"The Ruined Belfry",   entry:"rb_1",
    blurb:"A city of towers strung with bells the size of houses, and something nested in the belfries that answers when one rings." },
  { id:"sol_vaults",    name:"The Harvest Vaults",  entry:"hv_1",
    blurb:"A storehouse without end, still being filled, and the machinery has started taking inventory of you." },
];

/* -------------------------------------------------------------
   MEMORIES
   Canon: "Memory is a magical item tied to the essence of a Dream
   Realm inhabitant." The wiki's type list is Armor, Charm, Utility,
   Garment, Weapon, Lineage Memory and Shard Memory, and Memories
   sit on the same Soul Rank ladder as Aspects. A Memory's tier
   reflects the Class — the soul-core count — of the creature it
   came off: the wiki's worked example is "a Memory of an Awakened
   Tyrant (who possessed five Soul Cores)".

   `rank` and `type` below are therefore canon-shaped; which
   specific Memory drops from which of our invented scenarios, and
   every stat number, is ours. Canon sets no limit on how many a
   person may carry, so neither do we.

   NOTE: an Echo is NOT a type of Memory. The Spell's status page
   lists Memories and Echoes as two separate rewards, so they are
   two separate catalogues here. See ECHOES below.
------------------------------------------------------------- */
const MEMORIES = {
  choir_bell:  { name:"Cracked Bell",       type:"Utility", rank:"Dormant",
    desc:"It rings in a register that makes Nightmare Creatures hesitate.", stats:{ perception:2, willpower:1 } },
  tide_scale:  { name:"Scale of the Ninth", type:"Armor",   rank:"Dormant",
    desc:"Cold, and slightly heavier than it should be.",                   stats:{ vitality:3 } },
  debt_coin:   { name:"Settled Coin",       type:"Charm",   rank:"Dormant",
    desc:"Payment for something you would rather not have sold.",           stats:{ cunning:2, essence:2 } },
  salt_lens:   { name:"Saltglass Lens",     type:"Utility", rank:"Dormant",
    desc:"Ground from the flats. Shows what a place used to be.",           stats:{ perception:3 } },
  ledger_page: { name:"Torn Ledger Page",   type:"Charm",   rank:"Dormant",
    desc:"Your name is on it, in a hand you do not recognise.",             stats:{ willpower:2, essence:1 } },
  orchard_shears:{ name:"Orchard Shears",   type:"Weapon",  rank:"Awakened",
    desc:"They cut the only wood in the Dream Realm that cuts back.",       stats:{ vitality:2, cunning:2 } },
  lantern_wick: { name:"Unburnt Wick",      type:"Charm",   rank:"Awakened",
    desc:"It has never been lit. It is the only thing from that road that has not.", stats:{ willpower:3, essence:1 } },
  assembly_tooth:{ name:"Tooth of the Assembly", type:"Weapon", rank:"Ascended",
    desc:"One of nine hundred. It still forms the beginning of a word when you hold it.", stats:{ essence:4, willpower:2 } },
  interval_glass:{ name:"Interval Glass",   type:"Utility", rank:"Transcendent",
    desc:"A lens ground from the quiet between two stars. Looking through it costs you a little of the year.", stats:{ perception:5, essence:3 } },
  /* Canon lists "Lineage Memory" as a type in its own right: an item that
     "can impart Awakened with unique qualities" and is "hereditary... passed
     down through a bloodline". This one is handed over, not looted. */
  clan_signet:  { name:"Clan Signet",       type:"Lineage", rank:"Awakened",
    desc:"Your family's Attribute, worn where people can see whose it is.",  stats:{ renown:4, willpower:1 } },
  /* Canon: a Soul Shard is "a physical manifestation of a broken Soul Core
     that contains remnant Soul Essence". "Shard" is not a Memory type, so the
     item that holds one is typed as a Charm. */
  frost_rope:   { name:"Frost-Cored Rope",  type:"Utility", rank:"Dormant",
    desc:"Cut from the belfry bridges. Does not fray, and does not fully thaw.", stats:{ vitality:3 } },
  cold_manifest:{ name:"Cold Manifest Leaf", type:"Charm",   rank:"Dormant",
    desc:"A stocktaker's page, still filling itself in.",                        stats:{ cunning:2, perception:1 } },
  ward_needle:  { name:"Spent Glass Vial",  type:"Charm",  rank:"Dormant",
    desc:"Warm, as if just used. It was not used on you.",                  stats:{ willpower:2 } },
  leash_link:   { name:"Rusted Link",       type:"Charm",  rank:"Dormant",
    desc:"Snapped clean through. It had been ready to give for years.",     stats:{ vitality:2, willpower:1 } },
  struck_the_ledger:{ name:"The Founding Entry", type:"Lineage", rank:"Ascended",
    desc:"One page, torn from under a judge's seat. Six centuries were a description of it.", stats:{ cunning:3, renown:2 } },
  /* Handed to you by your own order (issue #10). Canon: making a Memory is
     rare even among Valor's enchanters, so your people commission it. */
  order_seal:   { name:"The Order's Seal",  type:"Charm",  rank:"Ascended",
    desc:"Commissioned from a clan enchanter, paid for with the first soul shards your people ever pooled.", stats:{ willpower:2, renown:2 } },
  core_shard:   { name:"Shard of a Broken Core", type:"Charm", rank:"Ascended",
    desc:"Somebody else's Soul Core, in pieces, still holding a little of what they had.", stats:{ essence:5 } },
};

/* -------------------------------------------------------------
   ECHOES
   Canon: "Echoes are a magical copy of a slain Nightmare
   Creature... do not possess a soul... created from Soul Essence."
   The Spell's status page lists Memories and Echoes side by side
   as the two rewards a trial can pay out, so an Echo is a sibling
   of a Memory, not a subtype of one.

   Canon is silent on how many Echoes one may hold and on whether
   Echoes have ranks of their own. Ours, therefore: an Echo sits on
   the Soul Rank ladder like a Memory, and binding one ties up
   Essence permanently, because canon says it is *made* of Essence.
   That upkeep is what stops a long run from simply hoarding them.
------------------------------------------------------------- */
const ECHOES = {
  choir_voice:  { name:"The Eight Hundred and First", rank:"Dormant", bound:1,
    desc:"A copy of one voice out of a choir that could not stop. It sings only when you are not listening.",
    stats:{ willpower:2, perception:1 } },
  tide_swimmer: { name:"The Thing That Did Laps",     rank:"Dormant", bound:2,
    desc:"Pale, patient, and a hundredth of the size it was. It circles you at a fixed distance.",
    stats:{ vitality:3, perception:1 } },
  collector:    { name:"The Collector's Clerk",       rank:"Awakened", bound:2,
    desc:"Not the Demon — the function it performed. It keeps an account of what you are owed.",
    stats:{ cunning:3, renown:1 } },
  tender:       { name:"An Orchard Tender",           rank:"Awakened", bound:2,
    desc:"It prunes. Given nothing to prune it stands where you left it, indefinitely, patiently.",
    stats:{ vitality:2, cunning:2 } },
  fallen_shade: { name:"Shade of a Fallen",           rank:"Ascended", bound:4,
    desc:"A copy of something that walked beside a column of forty thousand people for centuries.",
    stats:{ vitality:4, willpower:3 } },
  ward_listener:{ name:"What Listened At The Doors",  rank:"Dormant", bound:2,
    desc:"A copy of something that only ever reacted to sound. It turns its head when you speak and has no face to turn.",
    stats:{ perception:3, willpower:1 } },
  leash_beast:  { name:"The Thing On The Chain",      rank:"Dormant", bound:2,
    desc:"A copy of something that spent forty years holding itself back. It still does.",
    stats:{ vitality:3, willpower:1 } },
  bailiff:      { name:"A Bailiff of the Court",      rank:"Ascended", bound:4,
    desc:"Robed in old dockets. It collects, on the hour, whatever you point it at.",
    stats:{ vitality:3, cunning:2 } },
  keeper:       { name:"The Keeper's Last Certainty", rank:"Transcendent", bound:7,
    desc:"A copy of a thing that maintained a sleeping continent alone for a thousand years, and never once doubted it.",
    stats:{ willpower:6, essence:2, perception:2 } },
  mouth:        { name:"One Mouth of Nine Hundred",   rank:"Transcendent", bound:6,
    desc:"It answers questions. The answers are correct and are not always survivable.",
    stats:{ perception:5, essence:3, willpower:2 } },
};

/* -------------------------------------------------------------
   ACHIEVEMENTS
   Purely presentational: a curated subset of flags worth showing
   on the end screen as a feat, rather than every flag a run can
   pick up. Keyed by the flag that unlocks it. Ordered roughly by
   how dramatic the feat is — the end screen shows them in this
   order, most impressive first.
------------------------------------------------------------- */
const ACHIEVEMENTS = {
  apotheosis:        { name:"Apotheosis",         desc:"Conquered the Fifth Nightmare and became a lesser god. No one from this cycle of the Spell had ever returned from it before." },
  fourth:             { name:"The Fourth",         desc:"Crossed the Quiet Between Stars. Only three humans had ever reached Supreme before you." },
  ancient_path:       { name:"The Old Road",       desc:"Reached Transcendence without a Third Nightmare, by a soul-refining technique the Spell did not teach you." },
  war_saint:          { name:"Broke a Front",      desc:"Broke a battle line in the war between Domains that a hundred thousand Awakened could not move." },
  built_refuge:       { name:"Landing Zone",       desc:"Built a refuge in the Dream Realm for two hundred million people." },
  answered:           { name:"Silenced the Assembly", desc:"Gave the Assembly of Mouths an answer that did not need a chamber to hold it." },
  stopped_the_march:  { name:"Stopped the March",  desc:"Stood in the road until forty thousand lanterns went out, and the Nightmare had nothing left to collect." },
  saw_the_interval:   { name:"Saw the Interval",   desc:"Failed to cross the Quiet Between Stars, kept going anyway, and crossed it on the second attempt." },
  great_order:        { name:"Founder",            desc:"Built an organization of Awakened large enough that the Great Clans had to count it." },
  weaver:             { name:"The Forbidden Thread", desc:"A Weave of the Demon of Fate's lineage devoured the one you were born with. The gods forbade the Weaver heirs; you happened anyway." },
  went_quiet:         { name:"Went Quiet",         desc:"Vanished from Sovereign attention for forty years, on purpose, and came back unnoticed." },
  neutral:            { name:"Neutral Ground",     desc:"Refused both Domains during their war, and survived refusing them." },
  killed_awakened:    { name:"Blood Price",        desc:"Killed another Awakened for the contents of their Soul Core." },
  carried_them:       { name:"Carried Them Out",   desc:"Pulled allies from a Gate that should have killed everyone in it." },
  held_the_sea:       { name:"Held the Soul Sea",  desc:"Held a soul-eating Nightmare Creature out of your own Core, by will alone." },
  came_back_for_them: { name:"Went Back",          desc:"Turned back inside a Nightmare for someone you could have left." },
  faced_it:           { name:"Faced It",           desc:"Looked the First Nightmare's fear in the eye without flinching." },
  outsmarted_it:      { name:"Outwitted the Nightmare", desc:"Beat the First Nightmare on wit rather than force." },
  walked_toward:      { name:"Walked Toward It",   desc:"Walked toward the thing in the dark, on purpose, in your First Nightmare." },
  blooded:            { name:"Bloodied",           desc:"Helped bring down a Fallen-ranked Nightmare Creature as an Awakened." },
  went_first:         { name:"First Across",       desc:"Crossed the Saltglass Flats first, alone, with everyone else watching." },
  led:                { name:"Led Them",           desc:"Talked eight Awakened out of a fight that would have killed most of them." },
  declined_fifth:     { name:"Chose Humanity",     desc:"Declined the Fifth Nightmare, as Anvil and Ki Song once did." },
  seeking_sixth:      { name:"Seeking the Sixth",  desc:"Sacred, and still looking for the last door." },
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
    { label:"Fall asleep and let the First Nightmare take you.", effects:{ nightmare:"first" } },
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
      check:{ stat:"willpower", dc:9, fatal:2, fatalKind:"nightmare",
        fatalText:"You open your mouth and the song goes into you instead of out.\n\nBy the third hour you have forgotten why you were counting the hours. By the ninth you are simply one of the voices, and you will be one of the voices for as long as the Nightmare stands.",
        fatalCause:"Absorbed into the Hollow Choir. Your body woke as something else." },
      success:{ text:"You find the line and you hold it. The count stays whole and the thing at the back of the nave stays where it is.\n\nAnd because you are singing, nobody minds you walking while you do it.", effects:{ stats:{ willpower:2, perception:1 }, flags:{ add:["hid"] }, appraisal:1 } },
      failure:{ text:"You are half a beat behind for one bar. One bar is enough. Somewhere behind you, the counting stops.", effects:{ stats:{ willpower:-1 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnc_2" } },
    { label:"Don't sing. Walk the aisle and look for the reason.", hint:"Perception. Conspicuous.",
      check:{ stat:"perception", dc:10, fatal:2, fatalKind:"nightmare",
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
      check:{ stat:"cunning", dc:10, fatal:2, fatalKind:"nightmare",
        fatalText:"Your trick makes a sound like a trick. The counting stops instantly, and then it is very close, and then it is not counting any more.",
        fatalCause:"Killed in the nave of the Hollow Choir." },
      success:{ text:"The bell in the side chapel is cracked and half-buried, and cracked is what you need — it does not ring a note, it rings a person.\n\nBehind you, something begins a very careful recount.", effects:{ stats:{ cunning:3 }, memory:"choir_bell", flags:{ add:["outsmarted_it","took_the_spoil"] }, appraisal:3 } },
      failure:{ text:"You get the bell free. It rings once, thinly, and does not fool anything at all.", effects:{ stats:{ vitality:-2, cunning:1 } } },
      effects:{ goto:"fnc_3" } },
    { label:"Take her with you. She has been in here long enough.",
      effects:{ stats:{ willpower:2, vitality:-2 }, flags:{ add:["came_back_for_them"] }, appraisal:2, goto:"fnc_3" } },
    { label:"Leave her. She chose the fourth row a long time ago.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["left_them","abandoned"] }, goto:"fnc_3" } },
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
      success:{ text:"You cut it. Eight hundred mouths close at once and the silence lands like a physical blow, and in the enormous quiet that follows you hear something at the back of the nave stop existing.\n\nThe church comes down. You do not.", effects:{ stats:{ willpower:3, renown:1 }, echo:"choir_voice", flags:{ add:["faced_it"] }, appraisal:4, goto:"fn_resolve" } },
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
      check:{ stat:"willpower", dc:10, fatal:2, fatalKind:"nightmare",
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
      check:{ stat:"willpower", dc:12, fatal:2, fatalKind:"nightmare",
        fatalText:"The last stair goes down into the wall and the wall is exactly as cold as you expected and the thing inside it is exactly as fast.",
        fatalCause:"Walked into the Nine-Tenths Tide and did not come out." },
      success:{ text:"You go down the last stair into standing water and something vast comes at you out of the dark — and stops.\n\nIt stops because you are not what it was sent. The arrangement has a shape and you are the wrong shape, and for the first time in a hundred years the ritual does not resolve.\n\nThe wall shudders. Behind you, the whole town starts screaming at once.", effects:{ stats:{ willpower:4, vitality:-3 }, flags:{ add:["came_back_for_them"] }, appraisal:5 } },
      failure:{ text:"You go down. You come back up. You are missing something you cannot name and the girl is still standing there.", effects:{ stats:{ vitality:-3, willpower:1 }, flags:{ add:["cracked","broke"] } } },
      effects:{ goto:"fnt_3" } },
    { label:"Let it happen. Watch, and learn the mechanism.", hint:"Perception. Cold work.",
      check:{ stat:"perception", dc:9 },
      success:{ text:"She walks out. The wall takes her. And in the four seconds it takes, you see exactly where the tide's grip is anchored — a bell-shaped hollow, low, near the seabed, where the water does not move.", effects:{ stats:{ perception:3, cunning:2 }, flags:{ add:["left_them"] }, appraisal:2 } },
      failure:{ text:"She walks out. The wall takes her. You learn nothing except what your own face feels like while it happens.", effects:{ stats:{ willpower:-2 }, flags:{ add:["left_them","abandoned","cracked"] } } },
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
      success:{ text:"A hundred years of held water goes where water goes.\n\nYou come up out of it somehow, on a roof, in the dark, with a cold scale the size of your hand in your fist and a town underwater below you and the Nightmare quietly ending all around.", effects:{ stats:{ vitality:-3, willpower:3 }, memory:"tide_scale", echo:"tide_swimmer", flags:{ add:["faced_it","took_the_spoil"] }, appraisal:4, goto:"fn_resolve" } },
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
      check:{ stat:"cunning", dc:9, fatal:2, fatalKind:"nightmare",
        fatalText:"He does not chase. He simply reads a name, and it is close enough to yours, and your feet make the decision without consulting you.",
        fatalCause:"Settled up in the market square." },
      success:{ text:"You are three streets away before the page turns. Behind you somebody apologises, at length, and then stops.", effects:{ stats:{ cunning:2 }, flags:{ add:["ran_first","hid"] }, appraisal:1 } },
      failure:{ text:"You get as far as the arch. He does not look up, but the pen does move.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnd_2" } },
    { label:"Walk up and ask what you owe.", hint:"Willpower. Nobody does this.",
      check:{ stat:"willpower", dc:11, fatal:2, fatalKind:"nightmare",
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
      check:{ stat:"willpower", dc:12, fatal:2, fatalKind:"nightmare",
        fatalText:"You offer. He accepts. It turns out you did have something to pay with after all, and he takes all of it.",
        fatalCause:"Paid another's entry in the Collector's book, in full." },
      success:{ text:"The Collector considers you for a long moment, then makes two small marks, and the boy's page goes blank.\n\n\"An outstanding balance,\" he says, \"in your favour. I dislike those.\"", effects:{ stats:{ willpower:3, renown:1 }, memory:"debt_coin", flags:{ add:["came_back_for_them"] }, appraisal:4 } },
      failure:{ text:"He hears you out with enormous courtesy and declines. The boy's entry is settled the next morning.", effects:{ stats:{ willpower:-1 }, flags:{ add:["left_them"] } } },
      effects:{ goto:"fnd_3" } },
    { label:"Steal the book.", hint:"Cunning. Obviously.",
      check:{ stat:"cunning", dc:12, fatal:2, fatalKind:"nightmare",
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
      check:{ stat:"willpower", dc:13, fatal:2, fatalKind:"nightmare",
        fatalText:"The signature takes. So does everything behind it.",
        fatalCause:"Signed the first page of the Collector's ledger and was collected." },
      success:{ text:"You sign. The book balances. The Collector closes it with the small satisfaction of a man finishing a long shift, tips his hat to you, and is not there any more.\n\nThe town does not notice. The Nightmare ends anyway.", effects:{ stats:{ willpower:4, cunning:1 }, echo:"collector", flags:{ add:["faced_it"] }, appraisal:5, goto:"fn_resolve" } },
      failure:{ text:"You sign and the page takes more than the ink. You are still standing when it ends, but less of you is.", effects:{ stats:{ vitality:-5, willpower:2 }, flags:{ add:["cracked"] }, appraisal:3, goto:"fn_resolve" } } },
    { label:"Do nothing. Hide somewhere it isn't reading and wait.",
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
    { label:"Read your Flaw: the price the Spell sets.",
      effects:{ awardFlaw:true, flags:{ add:["sleeper"] }, chapter:"sleeper", conquered:true } },
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
    { label:"Sleep through the solstice and go to the Dream Realm.", effects:{ flags:{ add:["went_solstice"] }, solstice:true } },
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
      check:{ stat:"willpower", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"He swings anyway. The glass does not break so much as decide to stop being glass, and the two of you go down into it together.",
        fatalCause:"Went through the Saltglass Flats. Whatever was under it had been waiting a long time." },
      success:{ text:"You get the hammer off him. He calls you several things. Two days later, when the surface starts singing under a different group's feet a mile east, he does not call you any of them again.", effects:{ stats:{ willpower:2, renown:2 } } },
      failure:{ text:"He swings. The crack runs forty feet and stops. Everyone stands very still for about a minute, and then everyone walks away from each other for good.", effects:{ stats:{ vitality:-2 }, flags:{ add:["scattered"] } } },
      effects:{ goto:"sg_3" } },
    { label:"Let him. Be a long way off when he does it.", hint:"Cunning",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["left_them"] }, goto:"sg_3" } },
    { label:"Take the hammer and break it yourself, on your terms.", hint:"Perception. There is a reason to.",
      check:{ stat:"perception", dc:11, fatal:2, fatalKind:"dream_realm",
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
      check:{ stat:"cunning", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"You wait too long. By the time the crowd thins, so has the glass, and the last stretch is not crossable by anyone.",
        fatalCause:"Stranded on the Saltglass Flats after the surface failed." },
      success:{ text:"Four go before you. Two arrive. You walk the path their weight has already tested, and you walk it slowly, and you are not what anything is looking at.", effects:{ stats:{ cunning:3, perception:1 }, flags:{ add:["left_them"] }, goto:"sl_return" } },
      failure:{ text:"You leave it late. The crossing costs you most of what you had left.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
    { label:"Go with the others, all at once, and hold formation when it starts.", requires:{ flags:{ all:["banded"] } },
      hint:"Willpower. The plan is theirs; the holding is yours.",
      check:{ stat:"willpower", dc:10, fatal:2, fatalKind:"dream_realm",
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
    { label:"Open one of the books and read it.", hint:"Perception",
      check:{ stat:"perception", dc:9, fatal:2, fatalKind:"dream_realm",
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
      check:{ stat:"cunning", dc:12, fatal:2, fatalKind:"dream_realm",
        fatalText:"You find the page. It is a description of someone tearing out a page, and of what happens to them immediately afterwards.",
        fatalCause:"Written into the Ledger while trying to write yourself out of it." },
      success:{ text:"You get there first. The page is blank, waiting, and you take it, and behind you the dry sound stops for the first time in four days.\n\nIt has to start the chapter again. That is your entire head start.", effects:{ stats:{ cunning:3 }, memory:"ledger_page", flags:{ add:["greedy","bought_time"] } } },
      failure:{ text:"You reach the shelf. The chapter is already written. You read the next four days of your life and they are survivable, barely, and knowing does not help.", effects:{ stats:{ vitality:-3, willpower:1 } } },
      effects:{ goto:"lg_3" } },
    { label:"Stop being interesting. Do nothing worth recording.", hint:"Willpower. For six days.",
      check:{ stat:"willpower", dc:11, fatal:2, fatalKind:"dream_realm",
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
      check:{ stat:"willpower", dc:12, fatal:2, fatalKind:"dream_realm",
        fatalText:"It looks up. That is all it does. Somewhere on a shelf behind you, a volume finishes itself and is closed and clasped.",
        fatalCause:"Bound and shelved in the rotunda of the Ledger." },
      success:{ text:"You walk the length of the rotunda at the pace of a man crossing a room, past a thing the height of a house, and it writes down that a person crossed a room.\n\nThe Gateway is warm. Nothing else here has been.", effects:{ stats:{ willpower:4, renown:2 }, flags:{ add:["walked_toward"] }, goto:"sl_return" } },
      failure:{ text:"Halfway across your nerve goes and the last thirty feet are done at a dead sprint. It writes all of it.", effects:{ stats:{ vitality:-4, willpower:1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
    { label:"Burn a shelf. Give it something else to record.", hint:"Cunning. Vandalism as strategy.",
      check:{ stat:"cunning", dc:13, fatal:2, fatalKind:"dream_realm",
        fatalText:"It turns out the city does not object to fire. It objects to you.",
        fatalCause:"Killed setting fire to the Ledger." },
      success:{ text:"Four hundred finished lives go up at once and the Scribe crosses the rotunda faster than anything that size should be able to, and does not look at you even once.\n\nYou are through the Gateway before the second shelf catches.", effects:{ stats:{ cunning:4, renown:1 }, flags:{ add:["struck_first"] }, goto:"sl_return" } },
      failure:{ text:"The fire takes badly and slowly and buys you about ninety seconds.\n\nNinety seconds is, just barely, enough — and you spend most of it burning, because you were standing in the part of the rotunda that caught.", effects:{ stats:{ vitality:-4, cunning:2 }, goto:"sl_return" } } },
    { label:"Wait for it to leave the rotunda. It has to, eventually.", hint:"Perception",
      check:{ stat:"perception", dc:11, fatal:2, fatalKind:"dream_realm",
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
    { label:"Stand up. You are Awakened.",
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
  variants:[
    "Your communicator buzzes in the middle of dinner.\n\nA Gate has opened by the old rail yards, and you are the closest Awakened on the list. The rule is simple: the nearest one goes. Tonight that is you.",
    "A Gate has torn open in a parking lot across the city. The police have already cleared the street. Now they are standing at the tape, waiting for an Awakened to arrive.\n\nThe dispatcher reads your name off the screen.",
    "The alert comes in the afternoon, in broad daylight: a small Gate, two districts over, graded low.\n\nLow grades are usually right. You have learned not to bet your life on \"usually\".",
    "It is your third call this month. The Gate is on the coast road, close to a school that was evacuated an hour ago.\n\nNobody asks if you are tired. That is not how the duty works.",
  ],
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
    /* One choice per Aspect, shown only to its holder (issue #3). */
    { label:"Stay out of the light and reach it before it knows you are there.", requires:{ aspect:["shadow"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It never sees you. The fight lasts as long as one step.", effects:{ stats:{ renown:2, perception:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Burn it down before it finds its footing.", requires:{ aspect:["ember"] }, hint:"Essence. Your Aspect.",
      check:{ stat:"essence", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It burns. You keep burning a little longer than you needed to.", effects:{ stats:{ renown:2, essence:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Let it hit you. Every wound makes your Aspect sharper.", requires:{ aspect:["thorn"] }, hint:"Vitality. Your Aspect.",
      check:{ stat:"vitality", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It tears you open and you close sharper each time. By the end it is the one bleeding.", effects:{ stats:{ renown:2, vitality:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Listen for what it will do, a moment before it does it.", requires:{ aspect:["echo"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"You hear every move a heartbeat early, and you are never where it strikes.", effects:{ stats:{ renown:2, perception:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Give ground until it overreaches, then take it all back.", requires:{ aspect:["tide"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"You retreat until it is stretched thin, then come back over it like the tide.", effects:{ stats:{ renown:2, willpower:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Plant yourself in front of the Gate and let it break on you.", requires:{ aspect:["iron"] }, hint:"Vitality. Your Aspect.",
      check:{ stat:"vitality", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It hits you like a wall, and you are the wall.", effects:{ stats:{ renown:2, vitality:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Light up the whole area so everyone can see where it is.", requires:{ aspect:["lantern"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"Once everyone can see it, it has nowhere to hide and no chance.", effects:{ stats:{ renown:2, perception:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Let it hunt you, and lead it exactly where you want it.", requires:{ aspect:["quarry"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It chases you for an hour, straight into the place you picked.", effects:{ stats:{ renown:2, cunning:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Hold the ground. Whatever it touches, you keep.", requires:{ aspect:["salt"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"You do not give up an inch, and the ground you held stays held.", effects:{ stats:{ renown:2, willpower:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Check what it is and what it is owed, then plan exactly that much force.", requires:{ aspect:["ledger"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"You plan for exactly what came through, and exactly that much is enough.", effects:{ stats:{ renown:2, cunning:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Calm the crowd and get everyone out first, then turn to face it.", requires:{ aspect:["hearth"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"Nobody panics, nobody gets trampled, and the thing finds an empty street and you.", effects:{ stats:{ renown:2, willpower:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Take hold of the Gate itself and keep it from opening any wider.", requires:{ aspect:["gate"] }, hint:"Essence. Your Aspect.",
      check:{ stat:"essence", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"The Gate fights you, then closes on your terms, and cuts the thing in half doing it.", effects:{ stats:{ renown:2, essence:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Dig in. Turn the ground over and fight it on terrain you made.", requires:{ aspect:["harrow"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"It comes at you across ground you turned over, and the ground is on your side.", effects:{ stats:{ renown:2, cunning:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
    { label:"Decide that it ends here, and say so out loud.", requires:{ aspect:["verdict"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:9, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"Your Aspect does what it always does. The thing on the other side of the Gate was ready for exactly that.",
        fatalCause:"Killed at a Gate by a creature that had met your kind of power before." },
      success:{ text:"You say it ends here. It ends there.", effects:{ stats:{ renown:2, willpower:1 }, kill:{ rank:1, size:2 } } },
      failure:{ text:"Your Aspect gets you through it, barely, and you pay for the part it did not cover.", effects:{ stats:{ vitality:-3 } } } },
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
    { label:"Hold your Soul Sea shut by will alone.", hint:"Willpower. Nothing else will help here.",
      check:{ stat:"willpower", dc:13, dcScale:2, dcEra:2, fatal:3, fatalKind:"hollow",
        fatalText:"It goes in. What walks out of the ruin has your face and your hands and your gait, and none of the rest of it, and it will be three days before anyone realises.",
        fatalCause:"Hollow. Your soul was destroyed; the body was found walking." },
      success:{ text:"You hold. It is the single hardest thing you have ever done and it takes nine seconds.", effects:{ stats:{ willpower:4, essence:-3 }, flags:{ add:["held_the_sea"] } } },
      failure:{ text:"You hold most of it. Something small and load-bearing is gone and you will not find out what until you need it.", effects:{ stats:{ willpower:-2, perception:-1 }, flags:{ add:["cracked"] } } } },
    { label:"Cut yourself loose. Sever the part it has hold of and run.", hint:"Willpower. Cheaper than holding, and it costs you a piece.",
      check:{ stat:"willpower", dc:12, dcScale:2, dcEra:2, fatal:3, fatalKind:"lost",
        fatalText:"You cut loose. You cut too much. Your body is in the waking world and you are not in it, and there is no Gateway on this side that will take a soul without one.",
        fatalCause:"Lost. Your body died in the waking world; the rest of you is still in the Dream Realm." },
      success:{ text:"You cut, and it comes away, and you do not stop running until you are through a Gateway and on your knees on concrete.\n\nYou are out. You are also, permanently, slightly less than you were when you went in.", effects:{ stats:{ willpower:2, essence:-2, tether:-1 } } },
      failure:{ text:"You cut badly and it keeps a handful of what it was holding.", effects:{ stats:{ vitality:-3, essence:-3 } } } },
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
  text:"Your Flaw was not chosen at random. It is tied to who you are, and you cannot get rid of it. You can only learn to live around it, the way a road goes around a mountain.\n\nToday it shows up at a bad moment, in front of people who matter.",
  choices:[
    { label:"Cover it. Nobody needs to know what you are carrying.", hint:"Cunning",
      check:{ stat:"cunning", dc:11, dcScale:2, dcEra:2 },
      success:{ text:"You cover it. The cost is knowing exactly how thin the margin was.", effects:{ stats:{ cunning:2, willpower:1 } } },
      failure:{ text:"They know. By the end of the month, everyone who matters knows, and a known Flaw is a handle.", effects:{ stats:{ renown:-4 }, flags:{ add:["flaw_known"] } } } },
    { label:"Work around it. Build a life shaped to its edges.", hint:"Willpower. Years of it.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2 },
      success:{ text:"You spend a decade building around your own weakness like a river around a stone. It has not gone anywhere. You simply do not walk into it any more.", effects:{ stats:{ willpower:4, essence:2 }, flags:{ add:["flaw_worked"] }, days:60 } },
      failure:{ text:"You learn only that it goes deeper than you thought and further back.", effects:{ stats:{ willpower:-1, vitality:-2 } } } },
    /* One choice per Flaw, shown only to its holder (issue #3): the Flaw
       becomes something you can work with, not only a penalty. */
    { label:"Take the night watches nobody else can stay awake for.", requires:{ flaw:["sleepless"] },
      effects:{ stats:{ renown:3, vitality:-2 }, flags:{ add:["flaw_used"] } }, text:"You never sleep properly anyway. Three years of night watches later, half the district knows your name." },
    { label:"Go and see the person whose claim on you the Spell can feel.", requires:{ flaw:["tether"] },
      effects:{ stats:{ willpower:3, tether:2, essence:-1 }, flags:{ add:["flaw_used"] } }, text:"You sit in their kitchen for an afternoon. The claim does not go away, but you stop fighting it." },
    { label:"Feed it properly for once: hunt until your Core stops asking.", requires:{ flaw:["hunger"] },
      effects:{ stats:{ essence:4, vitality:-3 }, flags:{ add:["flaw_used"] } }, text:"You hunt for a month. The Core goes quiet, for a while, and you come back thinner." },
    { label:"Pay something back on purpose, before it gets collected.", requires:{ flaw:["debt"] },
      effects:{ stats:{ renown:3, essence:-2 }, flags:{ add:["flaw_used"] } }, text:"You hand over something you would rather have kept. The debt is a little smaller, and so is your Core." },
    { label:"Train without your Aspect until its silences stop mattering.", requires:{ flaw:["silence"] },
      effects:{ stats:{ cunning:2, willpower:2, essence:-1 }, flags:{ add:["flaw_used"] } }, text:"A year of fighting with only your hands and your head. When your Aspect goes quiet now, you barely notice." },
    { label:"Use it as bait: let the Creatures come to you, somewhere you chose.", requires:{ flaw:["mark"] }, hint:"Perception",
      check:{ stat:"perception", dc:12, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"They come, the way they always do. More of them than you planned for.",
        fatalCause:"Killed by Nightmare Creatures drawn to the Mark you used as bait." },
      success:{ text:"They come, the way they always do, but this time to the ground you picked.", effects:{ stats:{ renown:2 }, kill:{ rank:1, size:2 }, flags:{ add:["flaw_used"] } } },
      failure:{ text:"It does not work this time. The Flaw is exactly as large as it was.", effects:{ stats:{ vitality:-2, willpower:-1 } } } },
    { label:"Stand watch in a ward where people are dying, and do not look away.", requires:{ flaw:["witness"] },
      effects:{ stats:{ willpower:3, renown:2, vitality:-2 }, flags:{ add:["flaw_used"] } }, text:"You cannot look away from a death you could prevent, so you prevent eleven of them." },
    { label:"Go back to where you bled first, and finish what started there.", requires:{ flaw:["echoing"] }, hint:"Willpower",
      check:{ stat:"willpower", dc:13, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"The place you bled first had been waiting for you to come back.",
        fatalCause:"Killed returning to where the Echoing Flaw kept calling." },
      success:{ text:"The place calls you back, so you answer, on your terms. It calls a little more quietly afterwards.", effects:{ stats:{ renown:2 }, kill:{ rank:1, size:2 }, flags:{ add:["flaw_used"] } } },
      failure:{ text:"It does not work this time. The Flaw is exactly as large as it was.", effects:{ stats:{ vitality:-2, willpower:-1 } } } },
    { label:"Do alone the job that should have taken three people.", requires:{ flaw:["unasked"] }, hint:"Cunning",
      check:{ stat:"cunning", dc:13, dcScale:2, dcEra:2 },
      success:{ text:"You cannot ask for help, so you do not. It takes three times as long and it gets done.", effects:{ stats:{ cunning:3, willpower:1 }, flags:{ add:["flaw_used"] } } },
      failure:{ text:"It does not work this time. The Flaw is exactly as large as it was.", effects:{ stats:{ vitality:-2, willpower:-1 } } } },
    { label:"Collect every debt in your book at once.", requires:{ flaw:["ledgered"] },
      effects:{ stats:{ renown:2, cunning:2, tether:-1 }, flags:{ add:["flaw_used"] } }, text:"Every name, every favour, all in one month. People are careful with you afterwards." },
    { label:"Arrange your life around the death you keep seeing.", requires:{ flaw:["forewarned"] },
      effects:{ stats:{ perception:3, willpower:-1 }, flags:{ add:["flaw_used"] } }, text:"You change your routes, your habits and your friends. The death is still in the room, but further from the door." },
    { label:"Stop fighting it. Keep moving and answer Gates anywhere.", requires:{ flaw:["unhoused"] },
      effects:{ stats:{ renown:3, tether:-2 }, flags:{ add:["flaw_used"] } }, text:"Nowhere holds you, so you go everywhere. Every district on the coast has seen you once." },
    { label:"Drill the reflex until it moves first in the right direction.", requires:{ flaw:["first"] },
      effects:{ stats:{ perception:2, vitality:1, willpower:1 }, flags:{ add:["flaw_used"] } }, text:"You will always move before you decide. After two years of drills, the move is usually the right one." },
    { label:"Push your Aspect to its limit and see what it is holding back.", requires:{ flaw:["unspent"] }, hint:"Essence",
      check:{ stat:"essence", dc:13, dcScale:2, dcEra:2 },
      success:{ text:"It still holds a part back. But you have seen the edge of that part now, and you can lean on it.", effects:{ stats:{ essence:3, willpower:1 }, flags:{ add:["flaw_used"] } } },
      failure:{ text:"It does not work this time. The Flaw is exactly as large as it was.", effects:{ stats:{ vitality:-2, willpower:-1 } } } },
  ]
},
{
  id:"aw_duel", chapter:"awakened", weight:11, cooldown:220, days:80,
  requires:{ stats:{ renown:{ min:8 } } },
  title:"Another Awakened",
  text:"Killing a Nightmare Creature gives you a portion of what it accumulated. Killing another Awakened gives you a portion of theirs, and theirs is human, and human cores are saturated in a way beasts' are not.\n\nEveryone knows this. Almost nobody says it out loud. And somebody has decided that your core is the convenient one.",
  choices:[
    { label:"Accept the duel and fight them.", hint:"Cunning. Fights between Awakened are decided before they start.",
      check:{ stat:"cunning", dc:13, dcScale:2, dcEra:2, fatal:4, fatalKind:"murdered",
        fatalText:"They chose the ground, the hour and the witnesses. You attended.",
        fatalCause:"Killed by another Awakened for the contents of your Soul Core." },
      success:{ text:"You choose the ground instead. It is over in four seconds and you are the one who walks away carrying two cores' worth of fragments.", effects:{ stats:{ renown:4, vitality:-2 }, kill:{ rank:1, cores:1, size:4 }, memory:"core_shard", flags:{ add:["killed_awakened"] } } },
      failure:{ text:"You live. You are carried out, and the story that goes round is not the one you would have chosen.", effects:{ stats:{ vitality:-5, renown:-2 } } } },
    { label:"Leave the city. Start again somewhere with fewer people who know your name.",
      effects:{ stats:{ renown:-6, cunning:2, perception:1 }, flags:{ add:["ghosted"] } } },
  ]
},
{
  /* Not `once`: "Not yet. There will be other Seeds." has to be true, or a
     player who waits is stranded at Awakened with only Gate duty left (a
     tester reported exactly that as an endless loop). The cooldown spaces
     the Seeds out; "Never" is the only permanent refusal. Conquering moves
     you out of the awakened chapter, so it cannot re-offer after that. */
  id:"aw_second", chapter:"awakened", weight:26, cooldown:150, days:90,
  requires:{ stats:{ willpower:{ min:14 }, essence:{ min:10 } }, flags:{ none:["declined_second"] } },
  title:"A Seed Is Growing",
  text:"Word comes through the clans first and everyone else about a week later: a Seed of Nightmare is maturing in the Dream Realm, and while it grows, anyone may challenge it.\n\nThe Second Nightmare is not tailored to you. It is bigger, longer and harder than the first, populated by Creatures of the Awakened and Fallen ranks, and the unlucky meet something Corrupted. Conquering it makes you a Master — three hundred years, another Aspect Ability, and a place in a category of person that most Awakened only ever see from a distance.\n\nAnd you may only ever do it once. Conquer a Nightmare of a given Rank and no Seed of that Rank will ever open to you again.",
  choices:[
    { label:"Enter the Seed and face the Second Nightmare.", effects:{ nightmare:"second" } },
    { label:"Not this Seed. Wait for another one.", effects:{ stats:{ willpower:1 }, days:200 } },
    { label:"Never. Stay Awakened for the rest of your life.", effects:{ stats:{ willpower:2, tether:2 }, flags:{ add:["declined_second"] } } },
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
      success:{ text:"Six of the ten come back. It does not. The fragments that come out of a Fallen core split nine ways are still the best night's work of your life so far.", effects:{ stats:{ vitality:-5, renown:5 }, kill:{ rank:2, size:2 }, echo:"fallen_shade", flags:{ add:["blooded"] } } },
      failure:{ text:"Three come back. You are one of them and you are not sure why.", effects:{ stats:{ vitality:-6, willpower:1 }, flags:{ add:["cracked"] } } },
      effects:{ goto:"sn1_3" } },
    { label:"Let them try. Use the noise.", hint:"Cunning",
      effects:{ stats:{ cunning:3, perception:1 }, flags:{ add:["left_them"] }, goto:"sn1_3" } },
    { label:"Talk them out of it. The creature is not the conflict.", hint:"Cunning",
      check:{ stat:"cunning", dc:13 },
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
      check:{ stat:"willpower", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You stand in the road and the column walks into you and over you and closes up above you, and keeps walking.",
        fatalCause:"Trampled to nothing in the Lantern March." },
      success:{ text:"You stand in the road and you do not move and the first rank stops because there is nowhere else to put their feet.\n\nIt takes eleven minutes for the whole column to come to a halt. Forty thousand lanterns go out. The thing beside the road comes in, and finds that there is nothing left to collect, because a marcher who has stopped burning is not a marcher any more.\n\nThe Nightmare comes apart around you like a held breath.", effects:{ stats:{ willpower:5, renown:8 }, flags:{ add:["stopped_the_march"] }, goto:"sn_resolve" } },
      failure:{ text:"You stop about nine hundred of them. It is enough to break the rhythm and not enough to end it, and what happens next happens to the nine hundred.", effects:{ stats:{ vitality:-6, willpower:2, renown:2 }, goto:"sn_resolve" } } },
    { label:"Put your own lantern out and see what it does.", hint:"Cunning. Nobody has ever volunteered.",
      check:{ stat:"cunning", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"It comes in to collect and it is thorough and it is not remotely interested in your reasoning.",
        fatalCause:"Collected from the Lantern March, by choice." },
      success:{ text:"It comes for you and finds a thing that is not burning, has never been burning, and does not belong to the road at all — and for one long moment the entire arrangement has to decide what you are.\n\nThat moment is the crack in it.", effects:{ stats:{ cunning:5, willpower:3, renown:5 }, kill:{ rank:2, size:1 }, memory:"lantern_wick", goto:"sn_resolve" } },
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
    { label:"Dig one up. Find out how long this has been running.", hint:"Perception. Pick a grave the tenders have finished with.",
      check:{ stat:"perception", dc:14, fatal:4, fatalKind:"nightmare",
        fatalText:"The tenders take exception. There are more of them than there is of you by a factor you did not have time to estimate.",
        fatalCause:"Buried at the roots of the Iron Orchard." },
      success:{ text:"Armour of a make that has not existed for six hundred years. And under that, another. And under that, another.\n\nThe orchard has had a very long time and a very steady supply.", effects:{ stats:{ perception:3, cunning:2 }, flags:{ add:["knows_the_orchard"] }, kill:{ rank:1, size:2 } } },
      failure:{ text:"You get halfway down and have to fight your way back out of your own hole.", effects:{ stats:{ vitality:-5 } } },
      effects:{ goto:"sn2_3" } },
    { label:"Kill a tender and take its tools.", hint:"Vitality. They are not the conflict, but they are in the way.",
      check:{ stat:"vitality", dc:14, fatal:4, fatalKind:"nightmare",
        fatalText:"One tender is manageable. The orchard does not send one.",
        fatalCause:"Killed by the tenders of the Iron Orchard." },
      success:{ text:"It comes apart like a thing that has never been fought before, which it may not have been. The shears it was using cut orchard-wood, and orchard-wood is the only thing here that does.", effects:{ stats:{ vitality:-3, renown:2 }, kill:{ rank:1, size:3 }, memory:"orchard_shears", echo:"tender", flags:{ add:["has_shears"] } } },
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
      check:{ stat:"willpower", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"The shears work perfectly. The orchard simply has more time than you do.",
        fatalCause:"Killed at the first tree of the Iron Orchard." },
      success:{ text:"It takes six hours and everything you have, and when the first tree comes down twelve thousand others go with it in a sound like the end of an argument.", effects:{ stats:{ willpower:4, renown:6, vitality:-3 }, kill:{ rank:2, size:2 }, goto:"sn_resolve" } },
      failure:{ text:"You cut it. It falls the wrong way, and most of the orchard falls with it, and you are somewhere underneath.", effects:{ stats:{ vitality:-7, willpower:2 }, goto:"sn_resolve" } } },
    { label:"Burn it. You do not need to be precise.", hint:"Vitality. Slower and much worse.",
      check:{ stat:"vitality", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"Iron does not burn well. You have a great deal of time to reflect on this.",
        fatalCause:"Killed trying to burn the Iron Orchard." },
      success:{ text:"It takes eleven days and it works, in the end, because everything works in the end if you are willing to still be standing there.", effects:{ stats:{ vitality:-6, willpower:4, renown:4 }, kill:{ rank:2, size:1 }, goto:"sn_resolve" } },
      failure:{ text:"It half-burns. Half is enough for the Nightmare to lose coherence, and not enough for anyone to call it conquered cleanly.\n\nYou are eleven days in the smoke and you come out of it with your lungs ruined and a hand you will never fully close again.", effects:{ stats:{ vitality:-8 }, goto:"sn_resolve" } } },
  ]
},
{
  id:"sn_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Master",
  text:"The Seed resolves and spits you back into the Dream Realm, and the Spell writes one line, and the line is a rank.\n\nAscended. Master, in the older language. Another Aspect Ability, a Soul Core of a different quality altogether, and three hundred and twenty years instead of a hundred and forty.\n\nSomething else has changed, and it takes you a week to name it: you no longer need to be asleep. You can walk into the Dream Realm on your own feet now, leaving a tether behind you in the waking world, like a man leaving a rope down a well.",
  choices:[
    { label:"Accept the Ascension and become a Master.", effects:{ rank:1, chapter:"ascended", stats:{ essence:5, renown:6 }, conquered:true } },
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
    { label:"Spend the decades strengthening your Soul Core.", effects:{ stats:{ essence:4, willpower:2 } } },
    { label:"Found a company of Awakened under your name, or grow the one you have.", effects:{ stats:{ renown:5, cunning:3 }, org:{ found:"company", grow:1 } } },
    { label:"Go down to the waking world and remember why you started.", effects:{ stats:{ vitality:2, willpower:2, tether:2 } } },
  ]
},
{
  id:"ms_gate", chapter:"ascended", weight:26, cooldown:20, days:50,
  title:"The Duty Does Not Stop",
  text:"A Master answers the Gates that Awakened cannot. That is the whole of the promotion, from the outside: harder Gates, fewer colleagues, and a communicator that now only rings for the bad ones.",
  variants:[
    "Two Awakened teams went into this Gate yesterday. One came back.\n\nThe request reaches you by name. When the ordinary response fails, they call a Master, and today the Master on call is you.",
    "The Gate opened inside a hospital basement. It is graded high enough that no Awakened is allowed near it.\n\nYour communicator lights up with a single word: yours.",
  ],
  choices:[
    { label:"Go to the Gate yourself and close it.", hint:"Willpower",
      check:{ stat:"willpower", dc:15, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Corrupted came through. They are not supposed to come through. The grading system has a category for what happened next and it is used about twice a century.",
        fatalCause:"Killed by a Corrupted that stepped through a Gate it should not have fit." },
      success:{ text:"Fallen-ranked, entrenched, and three days of work. You close it and the district never learns how close it was.", effects:{ stats:{ vitality:-3, renown:4 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"You close it. It costs you a year of recovery and a piece of your left side.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    /* One choice per Aspect, shown only to its holder (issue #3). */
    { label:"Go in through the Gate's own shadow, where nothing is looking.", requires:{ aspect:["shadow"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It never sees you. The fight lasts as long as one step.", effects:{ stats:{ vitality:-2, renown:4, perception:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Pour Essence into the fire and burn the Gate's whole nest out.", requires:{ aspect:["ember"] }, hint:"Essence. Your Aspect.",
      check:{ stat:"essence", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It burns. You keep burning a little longer than you needed to.", effects:{ stats:{ vitality:-2, renown:4, essence:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Wade in and let it wound you, again and again, until you are sharper than it.", requires:{ aspect:["thorn"] }, hint:"Vitality. Your Aspect.",
      check:{ stat:"vitality", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It tears you open and you close sharper each time. By the end it is the one bleeding.", effects:{ stats:{ vitality:-1, renown:4 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Listen ahead through the whole fight and never be where its blows land.", requires:{ aspect:["echo"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"You hear every move a heartbeat early, and you are never where it strikes.", effects:{ stats:{ vitality:-2, renown:4, perception:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Fall back across the district, then come back in all at once.", requires:{ aspect:["tide"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"You retreat until it is stretched thin, then come back over it like the tide.", effects:{ stats:{ vitality:-2, renown:4, willpower:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Stand in the breach and do not move, whatever comes through.", requires:{ aspect:["iron"] }, hint:"Vitality. Your Aspect.",
      check:{ stat:"vitality", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It hits you like a wall, and you are the wall.", effects:{ stats:{ vitality:-1, renown:4 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Light the inside of the Gate so the whole team can see what they are fighting.", requires:{ aspect:["lantern"] }, hint:"Perception. Your Aspect.",
      check:{ stat:"perception", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"Once everyone can see it, it has nowhere to hide and no chance.", effects:{ stats:{ vitality:-2, renown:4, perception:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Make yourself the bait and run it into a trap you set an hour ago.", requires:{ aspect:["quarry"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It chases you for an hour, straight into the place you picked.", effects:{ stats:{ vitality:-2, renown:4, cunning:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Hold the ground at the Gate's mouth and refuse to give an inch of it back.", requires:{ aspect:["salt"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"You do not give up an inch, and the ground you held stays held.", effects:{ stats:{ vitality:-2, renown:4, willpower:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Read the records of every Gate like this one and plan the fight to the minute.", requires:{ aspect:["ledger"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"You plan for exactly what came through, and exactly that much is enough.", effects:{ stats:{ vitality:-2, renown:4, cunning:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Keep a whole district calm while the team works, then go in last.", requires:{ aspect:["hearth"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"Nobody panics, nobody gets trampled, and the thing finds an empty street and you.", effects:{ stats:{ vitality:-2, renown:4, willpower:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Grip the Gate with your Aspect and squeeze it shut while it is still pouring out.", requires:{ aspect:["gate"] }, hint:"Essence. Your Aspect.",
      check:{ stat:"essence", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"The Gate fights you, then closes on your terms, and cuts the thing in half doing it.", effects:{ stats:{ vitality:-2, renown:4, essence:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Turn the whole district into broken ground and fight it there.", requires:{ aspect:["harrow"] }, hint:"Cunning. Your Aspect.",
      check:{ stat:"cunning", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"It comes at you across ground you turned over, and the ground is on your side.", effects:{ stats:{ vitality:-2, renown:4, cunning:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Say it ends here, in front of everyone, and make it true.", requires:{ aspect:["verdict"] }, hint:"Willpower. Your Aspect.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:5, fatalKind:"gate",
        fatalText:"A Master's Aspect is known by now, and something on the other side had studied it.",
        fatalCause:"Killed at a Gate by a creature that had been waiting for exactly your Aspect." },
      success:{ text:"You say it ends here. It ends there.", effects:{ stats:{ vitality:-2, renown:4, willpower:1 }, kill:{ rank:3, size:2 } } },
      failure:{ text:"It works, but not cleanly. You close the Gate and spend a year healing from the parts that did not go to plan.", effects:{ stats:{ vitality:-6, renown:2 }, kill:{ rank:3, size:1 } } } },
    { label:"Send other Awakened in instead of going yourself.",
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
  id:"ms_ancient", chapter:"ascended", weight:5, once:true, days:300,
  requires:{ stats:{ essence:{ min:34 }, willpower:{ min:30 } } },
  title:"The Ancient Path",
  text:"Canon leaves a door open that almost nobody uses: the Path of Ascension could reach Transcendence without conquering a Third Nightmare.\n\nThe Spell is training wheels. It is a fast, harrowing, streamlined road, and it exists because the older methods — soul-refining techniques, patiently applied over centuries — were mostly lost. Mostly.\n\nYou have found a fragment of one. It will take two hundred years and it may not work.",
  choices:[
    { label:"Take the slow road.", hint:"Willpower. Two centuries of it.",
      check:{ stat:"willpower", dc:28, fatal:7, fatalKind:"ascension",
        fatalText:"Reforming a soul core by hand, without the Spell holding the shape, goes wrong somewhere in the second century. There is no dramatic moment. You simply do not finish.",
        fatalCause:"Unmade attempting the ancient soul-refining path." },
      success:{ text:"Two hundred and ten years, alone, refining essence by hand.\n\nYou come out of it Transcendent without the Spell ever having graded you, which is a thing perhaps four people alive can say, and none of them advertise it.", effects:{ rank:1, chapter:"transcendent", stats:{ essence:8, willpower:6, renown:2 }, flags:{ add:["ancient_path"] } } },
      failure:{ text:"A hundred and forty years in, the technique's fragment runs out. What you have is not nothing. It is not Transcendence either.", effects:{ stats:{ essence:6, willpower:4 }, days:200 } } },
    { label:"Leave it. The Spell's road is faster for a reason.", effects:{ stats:{ cunning:2 } } },
  ]
},
{
  /* Same reasoning as aw_second: "Wait for a better Seed" must lead to one. */
  /* Issue #7: Saints are rare in canon ("hundreds attempted the Third
     Nightmare in recent decades, but only a few dozen humans returned"), so
     a Third Seed is not offered to any Master who merely survived: it takes
     a name (Renown) as well as strength, and comes round more slowly. */
  id:"ms_third", chapter:"ascended", weight:18, cooldown:220, days:250,
  requires:{ stats:{ willpower:{ min:26 }, essence:{ min:22 }, renown:{ min:16 } }, flags:{ none:["clan_owned"] } },
  title:"A Third Seed",
  text:"There are a few dozen Saints in the world. That is the whole population, across every clan and citadel and quadrant, and each of them is a force that reshapes the map around wherever they happen to stand.\n\nA Third Seed is maturing. Conquer it and you are Transcendent — nine hundred years, a Transformation, and a place on a list short enough to memorise.\n\nAlmost everyone who tries this is already the best Master anyone has ever seen, and most of them do not come back.",
  choices:[
    { label:"Enter the Seed and face the Third Nightmare.", effects:{ nightmare:"third" } },
    { label:"Not this Seed. Wait decades for another one.", effects:{ stats:{ willpower:2 }, days:400 } },
  ]
},
{
  id:"tn1_1", scripted:true, once:true, days:4, fixedTime:true,
  title:"The Assembly of Mouths",
  text:"A parliament, in session, in a chamber the size of a weather system.\n\nEvery seat is occupied by something that is mostly a mouth. They are debating. They have been debating for an age of the world, and the motion under discussion is what the Dream Realm is for, and the debate is binding — whatever the Assembly concludes, the region outside becomes.\n\nOutside, through the windows, the landscape is changing every few minutes as the argument swings.\n\nThere are three other challengers. Two are Saints' students. One is something you cannot read at all.",
  choices:[
    { label:"Stand up and speak in the Assembly, uninvited.", hint:"Willpower. You are not a member.",
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
    { label:"Give the Assembly your answer to the motion. You only get one.", hint:"Willpower. There is no second attempt.",
      check:{ stat:"willpower", dc:7, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"Your answer is heard, considered, and found to be a contribution to the debate rather than an end to it. The Assembly welcomes new members.",
        fatalCause:"Seated. You are the eleven thousand and first mouth of the Assembly." },
      success:{ text:"You give it an answer that does not need a chamber to hold it, and eleven thousand mouths close, and stay closed.\n\nOutside, the landscape stops changing and settles into being one thing, at last, forever.\n\nThe Spell writes a word on the inside of your eyes and the word is not one it uses often.", effects:{ stats:{ willpower:6, renown:12 }, memory:"assembly_tooth", echo:"mouth", flags:{ add:["answered"] }, goto:"tn_resolve" } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"Your answer held for nine hundred seconds, and then the Assembly moved to the next item. You are the eleven thousand and first mouth of the Assembly." } } } },
  ]
},
{
  id:"tn_resolve", scripted:true, once:true, days:0, fixedTime:true,
  title:"Saint",
  text:"Transcendent.\n\nThe old word for it is Saint, and there are a few dozen of those, and as of this moment you are one of them.\n\nNine hundred years. A Transformation Aspect Ability you have not yet dared use. And a change in what you are that you notice first in a small way: you no longer need a Gateway. You are one. You can step between the worlds where you stand, and take someone with you if you choose.\n\nSomewhere, three people who have been managing the number of Saints in the world for decades are being informed.",
  choices:[
    { label:"Accept Transcendence and become a Saint.", effects:{ rank:1, chapter:"transcendent", stats:{ essence:8, renown:10 }, conquered:true } },
  ]
},

{
  /* The only way to the Weaver's lineage (see LINEAGES). It needs a
     lineage to devour, so a life with "No Lineage" can never see it, and
     it is the lowest-weight event in the game. Rates: docs/balance.md. */
  id:"ev_weave", weight:0.006, once:true, days:20,
  requires:{ chapter:["awakened", "ascended", "transcendent", "supreme"], flags:{ none:["no_lineage", "weaver"] } },
  title:"A Thread That Should Not Exist",
  text:"The creature you killed at the Gate leaves no Soul Shard. It leaves a thread: one fine, dark strand lying across the ground, which the Spell refuses to name.\n\nWhen you pick it up it goes into your hand, and from your hand into your blood, and you can feel it reach the lineage you were born with and start to eat it.\n\nThe gods forbade the Weaver heirs. This is not an heir. It is a piece of the Weaver's lineage, loose in the world, looking for blood to replace.",
  choices:[
    { label:"Let it finish. Let it replace the blood you were born with.", effects:{ lineage:"weaver", stats:{ vitality:-4 }, flags:{ add:["weaver"] } },
      text:"It takes a week. When it is done, the Attribute your family gave you is gone, and something older is in its place: the lineage of the Demon of Fate, which no living thing was ever supposed to carry." },
    { label:"Burn it out of your blood before it finishes.", hint:"Willpower. It does not want to leave.",
      check:{ stat:"willpower", dc:14, dcScale:2 },
      success:{ text:"You burn it out. Your own lineage is still there, a little scarred. You will wonder about the thread for the rest of your life.", effects:{ stats:{ willpower:3, vitality:-2 } } },
      failure:{ text:"You cannot burn it out. It finishes anyway, and the lineage you were born with is gone.", effects:{ lineage:"weaver", stats:{ vitality:-6 }, flags:{ add:["weaver"] } } } },
  ]
},
/* ===================================================================
   YOUR ORGANIZATION (issue #10)
   Only drawn once you have founded one (Master: "Found a company",
   Saint: "Build an order", Sovereign: "Build a landing zone").
   Canon templates: the Irregulars of the First Evacuation Army, the
   Lord of Shadows' Citadel, Ravenheart growing out of a lesser clan's
   stronghold. Canon threat: "The great clans have been suppressing
   the Transcendence of independent Awakened for decades" (ch. 1229).
   Members are mostly Awakened, so they can still become Lost: canon
   says "Only Awakened below the Master rank can become Hollow or
   Lost" (ch. 367). Lost: the body dies in the waking world and the
   soul is stranded in the Dream Realm until it reaches Master. Everything else here is ours.
=================================================================== */
{
  id:"org_recruit", weight:16, cooldown:60, days:40,
  requires:{ chapter:["ascended", "transcendent", "supreme"], org:{ min:1 } },
  title:"People Want In",
  text:"Word has got around that you take people in. There are forty of them at the gate this morning: Awakened from the outskirts, a clan's third son, two Sleepers who should not even be here yet.",
  variants:[
    "A team of Awakened whose company was wiped out at a Gate is asking to join yours. All of them, together, or none.",
    "Your people have been recruiting without asking you. The new faces outnumber the old ones at dinner.",
  ],
  choices:[
    { label:"Take anyone willing to answer a Gate.", effects:{ stats:{ renown:2 }, org:{ grow:2 } },
      text:"The ranks swell. Not all of them will be worth it, and every one of them now carries your name." },
    { label:"Test them yourself and take only the best.", hint:"Perception. You are looking for what they hide.",
      check:{ stat:"perception", dc:14, dcScale:2, dcEra:1 },
      success:{ text:"You take nine. Each of them would have been somebody's best. Now they are yours.", effects:{ stats:{ renown:3, cunning:1 }, org:{ grow:1 } } },
      failure:{ text:"You take the wrong nine. You find out which ones over the next decade.", effects:{ stats:{ renown:-1 }, org:{ grow:1 } } } },
    { label:"Close the doors for now. You cannot train what you already have.", effects:{ stats:{ willpower:1, cunning:1 } } },
  ]
},
{
  id:"org_lost", weight:9, cooldown:120, days:30,
  requires:{ chapter:["ascended", "transcendent", "supreme"], org:{ min:1 } },
  title:"One Of Yours Is Lost",
  text:"One of your Awakened was asleep in the Dream Realm when their body died in the waking world: a collapsed building, a stray Gate, nothing anyone could have stopped.\n\nThey are Lost. Their soul is still out there, alive, and it cannot come home. An Awakened who is Lost stays in the Dream Realm unless they ever become a Master, and almost none of them do.",
  choices:[
    { label:"Send a team into the Dream Realm to find them and bring them in.", hint:"Perception. The Dream Realm is very large.",
      check:{ stat:"perception", dc:15, dcScale:2, dcEra:1 },
      success:{ text:"Your people find them three regions away, half-starved and still fighting. They cannot go home, but they are not alone: they become your company's first outpost on the far side.", effects:{ stats:{ renown:3, willpower:2 }, flags:{ add:["came_back_for_them"] } } },
      failure:{ text:"The team searches for a season and comes back without them. Nobody says the name at dinner any more.", effects:{ stats:{ willpower:-2 }, org:{ grow:-1 } } } },
    { label:"Mark them as Lost and spend your people on the living.", effects:{ stats:{ willpower:-1, renown:-1 }, org:{ grow:-1 } },
      text:"It is the sensible decision. Your people watch you make it, and none of them say anything, which is its own kind of answer." },
  ]
},
{
  id:"org_clan", weight:14, once:true, days:60,
  requires:{ chapter:["ascended", "transcendent"], org:{ min:2 }, flags:{ none:["clan_owned"] } },
  title:"A Great Clan Notices",
  text:"Your organization has grown large enough to be counted, and the Great Clans count everything.\n\nThe envoy is very polite. Swear your people to the clan, and they will be fed, armed and protected. Stay independent, and nobody can promise what happens to an independent company in a world where the clans have been holding independents down for decades.",
  choices:[
    { label:"Swear your people to the clan.", effects:{ stats:{ renown:4, essence:3 }, org:{ grow:1, sworn:true }, flags:{ add:["org_sworn"] } },
      text:"Your banner goes up under theirs. Your people eat better. You no longer decide where they go." },
    { label:"Refuse, and keep your people independent.", hint:"Cunning. Being too expensive to swallow is a skill.",
      check:{ stat:"cunning", dc:16, dcScale:2, dcEra:1 },
      success:{ text:"You make yourself too useful to attack and too awkward to buy. The envoy leaves. The clan does not forget.", effects:{ stats:{ renown:4, cunning:2 }, flags:{ add:["stayed_independent"] } } },
      failure:{ text:"Nobody attacks you. Half your people are simply offered better terms elsewhere, one at a time, and take them.", effects:{ stats:{ renown:-2 }, org:{ grow:-2 } } } },
    { label:"Disband before they make you choose.", effects:{ stats:{ willpower:2, renown:-3 }, org:{ grow:-12 } },
      text:"You send them home with what you can give them. It is the only way to keep them out of a war they cannot win." },
  ]
},
{
  id:"org_gate", weight:16, cooldown:50, days:40,
  requires:{ chapter:["ascended", "transcendent", "supreme"], org:{ min:1 } },
  title:"Send Your People",
  text:"A Gate has opened in a region your organization has promised to cover. It is too big for one Awakened and too small for you.\n\nThis is what your people are for. It is also how you lose them.",
  choices:[
    { label:"Send a team in and run it from outside.", hint:"Cunning. Choose who goes, and where they stand.",
      check:{ stat:"cunning", dc:13, dcScale:2, dcEra:2 },
      success:{ text:"They go in, they close it, they all come out. Your people talk about this one for years.", effects:{ stats:{ renown:3 }, kill:{ rank:2, size:2 }, org:{ grow:1 } } },
      failure:{ text:"They close it. Not all of them come out.", effects:{ stats:{ renown:-1, willpower:-1 }, org:{ grow:-1 } } } },
    { label:"Lead them in yourself.", hint:"Willpower",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:2, fatal:6, fatalKind:"gate",
        fatalText:"You lead them in. Your people lead themselves out, without you.",
        fatalCause:"Killed at a Gate, leading your own people through it." },
      success:{ text:"You go in first and come out last, and everyone between you comes home.", effects:{ stats:{ renown:4, vitality:-2 }, kill:{ rank:2, size:2 } } },
      failure:{ text:"You get them out. You carry two of them.", effects:{ stats:{ vitality:-4 }, org:{ grow:-1 } } } },
    { label:"Keep them home. This one is not worth it.", effects:{ stats:{ renown:-2 } } },
  ]
},
{
  id:"org_payoff", weight:10, cooldown:150, days:40,
  requires:{ chapter:["ascended", "transcendent", "supreme"], org:{ min:3 } },
  title:"What Your People Give Back",
  text:"Your organization is large enough now to look after itself, and, for once, after you.\n\nThe quartermaster has a list of what can be spared.",
  choices:[
    { label:"Take a tithe of soul shards to feed your Core.", effects:{ stats:{ essence:4, renown:-1 } },
      text:"They bring you a share of every Gate's shards for a decade. Your Core is fuller. Your people noticed." },
    { label:"Let them carry your name further.", effects:{ stats:{ renown:5 } },
      text:"They go where you cannot be, and say whose they are." },
    { label:"Accept the Memory they commissioned for you.", effects:{ memory:"order_seal", stats:{ willpower:1 } },
      text:"Your people pooled their soul shards for years and paid a clan enchanter to make you a Memory. Very few people can make one at all." },
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
  variants:[
    "Someone thanks you, in a street in a Citadel, for something you did for their great-grandmother. You remember her. You do not remember the street being here.\n\nThe century turns while you are deciding what to do with the next one.",
    "A Saint's calendar has no weeks in it. It has wars, Seeds and successions, and a great deal of quiet in between.\n\nThe quiet has come round again, and it will last longer than most people's lives.",
  ],
  choices:[
    { label:"Build an order that will outlive you, or turn your company into one.", effects:{ stats:{ renown:8, cunning:4 }, org:{ found:"order", kind:"order", grow:2 } } },
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
    { label:"Enter the Seed and face the Fourth Nightmare.", effects:{ nightmare:"fourth" } },
    { label:"Refuse it for good, and live out your life as a Saint.",
      effects:{ stats:{ willpower:4, tether:2 }, flags:{ add:["chose_to_stay"] } } },
  ]
},
{
  id:"qn1_1", scripted:true, once:true, days:10, fixedTime:true,
  title:"The Quiet Between Stars",
  text:"There is no landscape.\n\nThere is a distance, and things at enormous intervals within it, and the distance is the Nightmare. The conflict is not a creature or a bargain or a debate. It is the interval itself: nothing here can reach anything else, has never been able to, and the whole of this place is the shape that fact has worn into existence over an unimaginable span.\n\nYou are the only thing in it that has ever arrived from somewhere.",
  choices:[
    { label:"Walk out into the interval and try to cross it.", hint:"Willpower. There is no other verb available.",
      check:{ stat:"willpower", dc:9, dcSelf:true, fatal:2, fatalKind:"nightmare",
        fatalText:"You go out into the interval. The interval is what happens to things that go out into it.",
        fatalCause:"Lost in the Quiet Between Stars. No body, no Gateway, no record." },
      success:{ text:"You cross it, and crossing it is the answer, because a distance that has been crossed once is no longer the kind of distance this place was built out of.\n\nSomething very old stops being true.\n\nYou come back through with an authority you did not go in with, and the Spell has no word for you, and neither does anyone else. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ essence:14, renown:20, willpower:8 }, flags:{ add:["fourth"] }, conquered:true } },
      failure:{ text:"You do not cross it. You do not die of it either, not yet, and that is the only distinction the interval recognises.\n\nThere is no way back. There was never going to be: a Nightmare ends when it is conquered or when you are.", effects:{ stats:{ willpower:3, tether:-4 }, goto:"qn1_2" } } },
  ]
},
/* Until v0.4.0 a failed crossing, or turning around, sent a Saint home alive
   and un-ascended, which breaks the rule that a Nightmare ends in conquest or
   death (the same exit was removed from the Second Nightmares in v0.3.4).
   It also stranded the life: st_fourth is `once`, so a tester spent the rest
   of a 900-year life alternating two events (issue #6). The second attempt
   below is the only one there is. */
{
  id:"qn1_2", scripted:true, once:true, days:30, fixedTime:true,
  title:"The Quiet Between Stars",
  text:"The road you took into the interval is still under you, and it does not end, and it has started to feel like it was never going to.\n\nYou have been walking for what your body insists is a month. Your Soul Core says nine hundred years. They are both right, here.\n\nYou get one more attempt at this, the way a falling thing gets one more breath.",
  choices:[
    { label:"Keep walking, and stop expecting the far side.", hint:"Willpower. The distance is only a distance if you are waiting for it to end.",
      check:{ stat:"willpower", dc:8, dcSelf:true, fatalKind:"nightmare" },
      success:{ text:"You stop waiting for the far side, and the far side is where you are.\n\nYou come back through with an authority you did not go in with, carrying a lens ground out of the quiet you crossed. There have been three. You are the fourth, and the only one of the four who was turned back once first.", effects:{ rank:1, chapter:"supreme", stats:{ essence:14, renown:20, willpower:6 }, memory:"interval_glass", flags:{ add:["fourth", "saw_the_interval"] }, conquered:true } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"Lost on the road through the Quiet Between Stars. It did not end, and in the end neither did the walking; only you did." } } } },
    { label:"Look for what is at the other end of the interval.", hint:"Perception. Something is that far away for a reason.",
      check:{ stat:"perception", dc:8, dcSelf:true, fatalKind:"nightmare" },
      success:{ text:"There is something at the far end, very small and very old, and the whole distance is the shape of it keeping away from everything. You see it, and a thing that has been seen is no longer infinitely far.\n\nYou come back through with an authority you did not go in with, carrying a lens ground out of the quiet you crossed. There have been three. You are the fourth.", effects:{ rank:1, chapter:"supreme", stats:{ essence:14, renown:20, perception:6 }, memory:"interval_glass", flags:{ add:["fourth", "saw_the_interval"] }, conquered:true } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"Lost in the Quiet Between Stars, looking for its far end. No body, no Gateway, no record." } } } },
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
    { label:"Build a landing zone. The waking world will not last forever.", effects:{ stats:{ renown:10, cunning:6 }, flags:{ add:["built_refuge"] }, org:{ found:"refuge", kind:"refuge", grow:3 } } },
  ]
},
{
  id:"sv_fifth", chapter:"supreme", weight:14, once:true, days:800,
  requires:{ stats:{ willpower:{ min:55 }, essence:{ min:50 } } },
  title:"The Fifth Nightmare",
  text:"Nobody from this cycle of the Spell has ever come back from it.\n\nEverything known about the Fifth is scavenged from the chronicles of civilisations the Spell used up before ours. It is two trials rather than one — a personal trial cut to fit you, and a collective one — and failure in either is death. Beyond it is Apotheosis: godhood, of the lesser kind.\n\nAnvil and Ki Song were offered this door and declined it, on the grounds that humanity could not afford to lose its Supremes. Asterion declined it on the grounds that he had a safer route to divinity and no interest in dying for the scenic one.\n\nAnd the warning underneath all of it: the Spell does not care whether you are still yourself afterwards. The Sun Realm went this way. Its gods ate their own world.",
  choices:[
    { label:"Enter the Seed and face the Fifth Nightmare.", hint:"Willpower. The odds are worse than everything you have already survived, combined.",
      check:{ stat:"willpower", dc:10, dcSelf:true, fatal:2, fatalKind:"nightmare",
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
  variants:[
    "The veterans keep saying it: there are more Gates every year, and they are getting stronger. The clans say that is not true. The numbers say it is.\n\nSome believe every Ascension makes the Gates worse, so the more Awakened climb, the more dangerous the world becomes.\n\nTonight a Gate opens in the middle of your own street, with no warning at all.",
    "Ten years ago, a Gate inside the city walls was rare enough to make the news. Now it barely gets a headline.\n\nThis one opens in a crowded market at noon, a few hundred metres from where you are standing.",
  ],
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
      failure:{ text:"Most of them get out.\n\nMost is a number. You will be given the exact one at the inquiry, and asked to account for the difference, and you will not be able to.", effects:{ stats:{ vitality:-4, renown:-2 }, flags:{ add:["cracked"] } } } },
  ]
},
{
  id:"ms_worse", chapter:"ascended", weight:26, cooldown:26, days:90,
  title:"The Numbers Keep Climbing",
  text:"You have been at this long enough now to have your own data, and your own data says the clans are lying by a factor of about three.\n\nA Master closes what an Awakened cannot. Every decade there is more of it, and the grading keeps having to be revised upward, and the revisions keep lagging the reality by about eighteen months. Eighteen months is a great many funerals.",
  choices:[
    { label:"Go in and close it with the Awakened beside you.", hint:"Willpower",
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
  id:"st_war", chapter:"transcendent", weight:26, once:true, days:90,
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
  id:"sv_chain", chapter:"supreme", weight:26, once:true, days:200,
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


/* ===================================================================
   FIRST NIGHTMARE — THE QUIET WARD
   Single creature: a Monster. Central conflict: the ward keeps
   everyone sedated to ration whose suffering reaches it, and the
   Nightmare only ends if the rationing does.
=================================================================== */
{
  id:"fnm_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Quiet Ward",
  text:"Forty beds, and forty people breathing in the same slow rhythm, and an orderly working down the row with a needle and a small tin tray.\n\nHe is not unkind about it. He checks names against a clipboard, taps the crook of each elbow, and moves on, and behind him the ward gets quieter by exactly one voice at a time.\n\nSomewhere past the ward doors, something is listening for the sound the sedative is meant to prevent. Your bed is the last one he has not reached.",
  choices:[
    { label:"Take the needle, and hold yourself just under the surface.", hint:"Willpower",
      check:{ stat:"willpower", dc:9, fatal:2, fatalKind:"nightmare",
        fatalText:"The dose is measured for people who intend to stay under it. You do not, and your body cannot tell the difference between resisting and drowning.",
        fatalCause:"Sedated past waking in the Quiet Ward." },
      success:{ text:"You let it in and hold yourself just below the surface, heavy-limbed, half-gone, aware enough to count the orderly's footsteps as he finishes his round.\n\nNobody in forty beds is worth noticing tonight, including you.", effects:{ stats:{ vitality:1 }, flags:{ add:["hid"] }, appraisal:1 } },
      failure:{ text:"It takes you further than you meant to go. You lose an hour you cannot account for, and you surface to a ward that has gotten quieter in a way that has nothing to do with sleep.", effects:{ stats:{ vitality:-1 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnm_2" } },
    { label:"Palm the dose. Let him think the bed went under.", hint:"Cunning. He counts vials at the end of the round.",
      check:{ stat:"cunning", dc:10, fatal:2, fatalKind:"nightmare",
        fatalText:"You are the one bed still awake in a room built entirely around nobody being awake, and it does not need to search for you. You have already done the finding for it.",
        fatalCause:"Found awake in the Quiet Ward." },
      success:{ text:"You palm the dose and watch the room instead of the ceiling. The orderly's round has a shape to it — not random, not medical. He is working from a list, and the list is not about who is sick.", effects:{ stats:{ willpower:2, perception:1 }, flags:{ add:["walked_toward"] }, appraisal:2 } },
      failure:{ text:"You stay awake, but badly — sweating, obvious, the last uncovered bed in a room of covered ones. The orderly clocks you and writes something down.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnm_2" } },
  ]
},
{
  id:"fnm_2", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Quiet Ward",
  text:"The woman in the corner bed is off the list. She has been off it for a week, because the dose stopped working on her three days ago and nobody has found one strong enough to replace it.\n\nShe is not screaming yet. She is close. An aide changing her linens tells you, in the flat voice of someone reciting a policy rather than a tragedy, that the sedative is not for comfort — it is for quiet, and quiet is what keeps whatever is past the doors from coming to collect a name off the list at random instead of in the order the ward has agreed on.\n\n\"She'll wake the whole floor when it goes,\" the aide says. \"We've been dreading her bed for a week.\"",
  choices:[
    { label:"Give her your dose. Let her sleep instead of you.", hint:"Willpower. You will be the one awake when it fails.",
      check:{ stat:"willpower", dc:11, fatal:2, fatalKind:"nightmare",
        fatalText:"You are quiet enough for one more night to pass through you instead of her. It is not a trade the ward has a name for, and neither, it turns out, do you survive being uncounted.",
        fatalCause:"Left off the list in the Quiet Ward." },
      success:{ text:"She goes under, properly, for the first time in a week, and the small sound she has been holding back for days does not happen.\n\nYou lie in the dark afterward, wide awake, waiting to find out what an unlisted bed costs, and the tin tray on the aide's cart is one vial lighter than it was an hour ago.", effects:{ stats:{ willpower:2 }, memory:"ward_needle", flags:{ add:["came_back_for_them"] }, appraisal:3 } },
      failure:{ text:"You give her the dose and it is not enough, and you are awake and empty-handed when it stops being enough.", effects:{ stats:{ vitality:-3, willpower:1 }, flags:{ add:["cracked"] } } },
      effects:{ goto:"fnm_3" } },
    { label:"Find out exactly what is listening, and how close.", hint:"Perception. Cold work.",
      check:{ stat:"perception", dc:10, fatal:2, fatalKind:"nightmare",
        fatalText:"You get close enough to the ward doors to understand the mechanism, and understanding it is not the same as being ready for what is already on your side of them.",
        fatalCause:"Taken at the ward doors of the Quiet Ward." },
      success:{ text:"Past the doors there is no corridor at all — only a long dark throat-shaped room that answers to sound the way a struck bell answers to a hammer, and does not care whose voice it was.\n\nThe list is not protection. It is triage. Somebody, a long time ago, decided the ward could afford to lose one voice a week instead of all forty at once.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["outsmarted_it"] }, appraisal:2 } },
      failure:{ text:"You get as far as the doors and no further. You learn nothing except how cold the handle is, and the corner bed starts to stir behind you.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnm_3" } },
    { label:"Leave her. It is not your ward and not your list.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["left_them","abandoned"] }, goto:"fnm_3" } },
  ]
},
{
  id:"fnm_3", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Quiet Ward",
  text:"The conflict is the list.\n\nThe ward is not being protected from the thing past the doors. It is being fed to it, one measured voice at a time, forever, because forty small quiet losses are easier to schedule than one loud one. The sedative does not save anyone. It only decides the order.\n\nThe tray still has enough left in it to put every bed under at once, or none of them.",
  choices:[
    { label:"Wake every bed at once. Give it more than it can take.", hint:"Vitality. You will be on your feet through all of it.",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"You reach the last bed before it reaches you. The margin is not as generous as it needed to be.",
        fatalCause:"Caught in the Quiet Ward with the whole floor awake and screaming." },
      success:{ text:"Forty voices land on it at once, and for the first time in however long this has run, the list means nothing — there is no order left to keep.\n\nWhatever was past the doors goes quiet the way a struck bell goes quiet, all at once, from the inside.", effects:{ stats:{ willpower:3, renown:1 }, echo:"ward_listener", flags:{ add:["faced_it"] }, appraisal:5, goto:"fn_resolve" } },
      failure:{ text:"You wake them. It comes for the noise before the noise finishes arriving, and it very nearly finishes with you.", effects:{ stats:{ vitality:-4, willpower:1 }, appraisal:3, goto:"fn_resolve" } } },
    { label:"Leave the tray alone. Let the ward keep its order.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["hid"] }, appraisal:0, goto:"fn_resolve" } },
  ]
},

/* ===================================================================
   FIRST NIGHTMARE — THE LONG LEASH
   Single creature: a Beast. Central conflict: a forty-year chain is
   kept fed on strangers to justify keeping something the town is now
   too afraid to let go.
=================================================================== */
{
  id:"fnk_1", scripted:true, once:true, days:0, fixedTime:true,
  title:"The Long Leash",
  text:"The chain runs from a stake as thick as a ship's mast to somewhere inside the treeline, and it has been taut for as long as anyone in the village can remember being alive.\n\nThey feed it strangers. They are apologetic but not ashamed about this — it has kept the woods off them for forty years, they say, and forty years is a number that argues for itself.\n\nTonight's stranger is you, and nobody here is pretending otherwise.",
  choices:[
    { label:"Get close and study the chain before anyone stops you.", hint:"Perception",
      check:{ stat:"perception", dc:9, fatal:2, fatalKind:"nightmare",
        fatalText:"You get close enough to see the metal clearly. You do not get far enough back before the slack you noticed stops being slack.",
        fatalCause:"Taken at the stake of the Long Leash." },
      success:{ text:"One link, low down, near the collar, is rusted through to a shell of itself. It has been that way for years. Someone checks it, regularly, and puts it back exactly as they found it.", effects:{ stats:{ perception:3 }, flags:{ add:["outsmarted_it"] }, appraisal:2 } },
      failure:{ text:"You get close enough to see the chain move on its own, once, and you do not get a clean look at anything after that.", effects:{ stats:{ vitality:-2 }, flags:{ add:["noticed"] } } },
      effects:{ goto:"fnk_2" } },
    { label:"Ask the villagers why they still feed it.", hint:"Cunning. They will only tell a stranger so much.",
      check:{ stat:"cunning", dc:10, fatal:2, fatalKind:"nightmare",
        fatalText:"You ask the wrong person the right question, and the village decides the fastest way to end the conversation is to hand you to the woods early.",
        fatalCause:"Handed over early at the Long Leash." },
      success:{ text:"An old woman, three drinks past careful, admits nobody has seen anything come out of those woods in over a decade. \"We keep feeding it,\" she says, \"because we stopped being sure which of us it's really for.\"", effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["asked"] }, appraisal:1 } },
      failure:{ text:"The village closes around the question like water around a dropped stone. Nobody answers you, and everybody remembers you asked.", effects:{ stats:{ vitality:-1 }, flags:{ add:["asked","noticed"] } } },
      effects:{ goto:"fnk_2" } },
  ]
},
{
  id:"fnk_2", scripted:true, once:true, days:2, fixedTime:true,
  title:"The Long Leash",
  text:"They walk you out at dusk, the whole procession polite and unhurried, and a boy no older than fourteen falls into step beside you and says he'll go instead. He says his family has less to lose than most. He has clearly rehearsed this.\n\nNobody stops him from offering. Nobody stops you from letting him.",
  choices:[
    { label:"Go in his place.", hint:"Willpower. It is not a metaphor.",
      check:{ stat:"willpower", dc:11, fatal:2, fatalKind:"nightmare",
        fatalText:"You reach the stake. The chain reaches you a moment before you finish deciding you were wrong to come.",
        fatalCause:"Taken at the stake of the Long Leash in another's place." },
      success:{ text:"You go to the end of the chain and it comes at you full length and stops, inches short, straining against a collar grown so deep into old scar it is no longer clear which is which.\n\nIt is not muzzled by the iron. It is holding itself.", effects:{ stats:{ willpower:2, perception:1 }, flags:{ add:["came_back_for_them"] }, appraisal:3 } },
      failure:{ text:"You go to the stake and the chain finds more reach in it than anyone accounted for. You come back with less of yourself than you brought.", effects:{ stats:{ vitality:-3 }, flags:{ add:["cracked"] } } },
      effects:{ goto:"fnk_3" } },
    { label:"Let him go. Watch how the ritual actually plays out.", hint:"Perception. Cold work.",
      check:{ stat:"perception", dc:10 },
      success:{ text:"He walks to the stake. The chain could reach him twice over and does not, not once — it strains sideways, away from him, toward the treeline it is meant to be guarding against.\n\nIt has never been trying to eat what they feed it.", effects:{ stats:{ perception:3 }, flags:{ add:["left_them","abandoned"] }, appraisal:1 } },
      failure:{ text:"He walks to the stake and you watch it happen and learn nothing except what your own silence sounds like.", effects:{ stats:{ willpower:-2 }, flags:{ add:["left_them","abandoned","cracked"] } } },
      effects:{ goto:"fnk_3" } },
  ]
},
{
  id:"fnk_3", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Long Leash",
  text:"The conflict is the chain, not the woods.\n\nWhatever the village was originally guarding against is forty years gone, if it was ever more than a hard winter and a bad story. What is left is a captured thing, starved thin to keep it desperate enough to look like a threat worth feeding, held by a village too frightened of what letting go might mean to check whether there is still anything to be frightened of.\n\nThe weak link is exactly where you found it, and exactly as far as the chain will let you reach.",
  choices:[
    { label:"Break the chain yourself. Let it go.", hint:"Vitality",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"nightmare",
        fatalText:"You get both hands on the weak link. It gives before you are braced for what is on the other end of it.",
        fatalCause:"Killed breaking the chain at the Long Leash." },
      success:{ text:"The link snaps clean and the chain drops, and the thing on the end of it does not lunge for you. It simply stops straining, looks at the open treeline for a long moment, and goes.\n\nThe stake stands empty behind it. Nothing comes to take its place.", effects:{ stats:{ vitality:2, willpower:2 }, memory:"leash_link", echo:"leash_beast", flags:{ add:["faced_it"] }, appraisal:5, goto:"fn_resolve" } },
      failure:{ text:"The link gives and so does most of your grip on the situation. You come away from the stake alive and considerably worse for it.", effects:{ stats:{ vitality:-4 }, appraisal:3, goto:"fn_resolve" } } },
    { label:"Leave the chain standing. Let the village keep its arrangement.",
      effects:{ stats:{ cunning:1 }, flags:{ add:["hid"] }, appraisal:0, goto:"fn_resolve" } },
  ]
},


/* -------------------------------------------------------------------
   SECOND NIGHTMARE — THE COURT OF UNCOUNTED DEBTS
------------------------------------------------------------------- */
{
  id:"sn3_1", scripted:true, once:true, days:3, fixedTime:true,
  title:"The Court of Uncounted Debts",
  text:"The building is a courthouse the size of a city district, and it has been in session for six hundred years without once adjourning. Clerks with too many hands file paper that never stops arriving. Somewhere above the bench a bell rings once an hour, and each time it rings, somebody in the public gallery is led away and does not come back.\n\nYou are handed a docket the moment you cross the threshold. It has your name on it, a case number, and a debt figure so large it has run out of digits and started using words instead. Nobody remembers what the debt was for. The court insists that is not relevant to whether it is owed.\n\nEight other challengers are in the gallery, already arguing with clerks about their own dockets. None of them are winning.",
  choices:[
    { label:"Read the fine print. There is always fine print.", hint:"Perception",
      check:{ stat:"perception", dc:13, fatal:4, fatalKind:"nightmare",
        fatalText:"You find the clause. The clause is a trap, and the court has been waiting six centuries for someone to read this far down the page.",
        fatalCause:"Consumed reading the fine print of the Uncounted Debts." },
      success:{ text:"The debt figure is not a number at all. It is a description of a shape, and the shape is the courthouse itself — the debt is the building, restated as an amount, so that it can never be paid off without the court ceasing to exist.", effects:{ stats:{ perception:4, cunning:1 }, flags:{ add:["knows_the_ledger"] } } },
      failure:{ text:"You get three pages in before a clerk objects to your reading speed and has you removed from the gallery by force.", effects:{ stats:{ vitality:-3 } } },
      effects:{ goto:"sn3_2" } },
    { label:"Refuse the docket outright. See what the court does with a debtor who will not play.",
      effects:{ stats:{ willpower:2, renown:1 }, flags:{ add:["refused_docket"] }, goto:"sn3_2" } },
  ]
},
{
  id:"sn3_2", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Court of Uncounted Debts",
  text:"The bailiffs are Fallen-ranked, dressed in robes stitched from old dockets, and they collect on the hour with the bell. What they collect is whatever the debtor has left that the court considers valuable, which is broadly defined and always in the court's favour.\n\nTwo of the other challengers have decided to stop a collection by force, on the theory that a bailiff that cannot walk cannot ring the bell for the next one. It is not a bad theory. It has simply never worked.\n\nA third challenger, one of the ones with an unreadable docket, is quietly copying case files instead of arguing them.",
  choices:[
    { label:"Help the two stop a bailiff.", hint:"Vitality. One Fallen against three Awakened, on its own terms.",
      check:{ stat:"vitality", dc:15, fatal:4, fatalKind:"nightmare",
        fatalText:"The bailiff does not fight like something that expects to lose, because in six hundred years it never has.",
        fatalCause:"Killed contesting a bailiff of the Uncounted Debts." },
      success:{ text:"It goes down hard and does not get back up, and for one full hour the bell does not ring, which the gallery treats as a kind of miracle.", effects:{ stats:{ vitality:-5, renown:5 }, kill:{ rank:2, size:2 }, echo:"bailiff", flags:{ add:["blooded"] } } },
      failure:{ text:"You put it down. It costs the other two everything they walked in with, and one of them is on the docket for a debt of his own before the hour is out.", effects:{ stats:{ vitality:-6, willpower:1 } } },
      effects:{ goto:"sn3_3" } },
    { label:"Copy case files instead of fighting anyone.", hint:"Cunning. Learn how the court has ruled before.",
      check:{ stat:"cunning", dc:13 },
      success:{ text:"Every case in six hundred years has ruled the same way, on the same reasoning, regardless of the facts argued. The court is not deciding anything. It is reciting.", effects:{ stats:{ cunning:4, perception:1 }, flags:{ add:["knows_the_precedent"] } } },
      failure:{ text:"You copy the wrong files. What you have is six hundred years of paperwork about nothing.", effects:{ stats:{ vitality:-3 } } },
      effects:{ goto:"sn3_3" } },
  ]
},
{
  id:"sn3_3", scripted:true, once:true, days:7, fixedTime:true,
  title:"The Court of Uncounted Debts",
  text:"The conflict is the ledger.\n\nThe court exists to settle a debt that was designed, from the first page, never to reach zero — every payment collected generates a larger liability, filed under a clause nobody in the gallery has ever been shown. It has been running for six centuries as a perfectly efficient machine for producing debtors, and every debtor produced keeps the machine fed.\n\nThe bench itself, when you finally reach it, is a single judge who has presided since the beginning and cannot remember a time before the docket. Striking the ledger requires striking the one entry the whole structure is built from, and that entry is filed at the very back, under the judge's own seat.",
  choices:[
    { label:"Strike the ledger, using what you know of it.", requires:{ flags:{ all:["knows_the_ledger"] } }, hint:"Cunning. The clause is precise; so must you be.",
      check:{ stat:"cunning", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You find the entry. The court finds you finding it, and a debtor caught tampering with the original page is assessed the one penalty the docket has always reserved for exactly this.",
        fatalCause:"Foreclosed upon in the Court of Uncounted Debts." },
      success:{ text:"You tear the founding entry out from under the judge's own seat, and the six-hundred-year ledger has nothing left to be a description of. The courthouse does not collapse so much as stop having ever been necessary, all at once, retroactively.\n\nThe bell rings a last time, for nobody.", effects:{ stats:{ cunning:5, renown:8 }, kill:{ rank:2, size:2 }, memory:"struck_the_ledger", flags:{ add:["struck_ledger"] }, goto:"sn_resolve" } },
      failure:{ text:"You tear the page. The court files a new one before it hits the floor, and you spend what is left of the hour discovering exactly how the docket handles a debtor who tried and failed.", effects:{ stats:{ vitality:-7, willpower:1 }, goto:"sn_resolve" } } },
    { label:"Argue the debt down, using precedent.", requires:{ flags:{ all:["knows_the_precedent"] } }, hint:"Willpower. Outlast the court at its own procedure.",
      check:{ stat:"willpower", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"You argue for as long as a person can argue. The court has no such limit and was never going to be moved by exhaustion, only by an ending it did not choose.",
        fatalCause:"Argued to nothing before the bench of the Uncounted Debts." },
      success:{ text:"You cite six centuries of identical rulings back at the judge, in order, until the pattern is undeniable even to the thing that has been reciting it — a court that rules the same way regardless of the facts is not a court. It is a debt collecting itself.\n\nThe judge has no ruling prepared for that. The silence that follows is the Nightmare coming apart.", effects:{ stats:{ willpower:5, renown:6 }, flags:{ add:["talked_down"] }, goto:"sn_resolve" } },
      failure:{ text:"The court outlasts you. Every argument you raise becomes a new page in the docket, and you leave the bench with a debt considerably larger than the one you arrived owing.", effects:{ stats:{ vitality:-6, willpower:2 }, goto:"sn_resolve" } } },
    { label:"Overwhelm the bench directly. Skip the argument.", hint:"Vitality. The bailiffs will not stand aside for this.",
      check:{ stat:"vitality", dc:4, dcSelf:true, fatal:3, fatalKind:"nightmare",
        fatalText:"The bench is not undefended. Six centuries of bailiffs arrive at once, and there is no version of this where you reach the judge's seat.",
        fatalCause:"Overrun at the bench of the Uncounted Debts." },
      success:{ text:"It takes every bailiff the court can field and the better part of a day, but you reach the seat and put your hand on the founding page before anything can stop you, and the courthouse folds without ever managing a final ruling.", effects:{ stats:{ vitality:-6, renown:6 }, kill:{ rank:2, size:1 }, goto:"sn_resolve" } },
      failure:{ text:"You reach the bench. You do not reach the page. What is left of you is escorted from the gallery and the docket, absurdly, is marked settled in full.", effects:{ stats:{ vitality:-8 }, goto:"sn_resolve" } } },
  ]
},

/* -------------------------------------------------------------------
   THIRD NIGHTMARE — THE QUIET CONTINENT
------------------------------------------------------------------- */
{
  id:"tn2_1", scripted:true, once:true, days:5, fixedTime:true,
  title:"The Quiet Continent",
  text:"A landmass the size of a country, asleep. Every person on it, every animal, every fire banked and every river slowed to something barely moving — a thousand years deep in the same unbroken sleep, kept that way by a single Creature of Great rank that has never once left its post.\n\nIt calls itself a keeper, not a warden, and it is telling the truth by its own accounting: the continent slept once, briefly, awoke into a war that erased most of it, and the keeper decided — a thousand years ago, alone, and without asking anyone still capable of answering — that the sleep was the mercy and the waking was the wound.\n\nFour other challengers came through the same Seed. One is already walking the sleeping streets, reading doorframes and abandoned ledgers. One is standing very still, doing nothing at all, which after a moment you understand is itself a kind of test.",
  choices:[
    { label:"Walk the streets. Learn what the sleep interrupted.", hint:"Perception",
      check:{ stat:"perception", dc:17, fatal:4, fatalKind:"nightmare",
        fatalText:"You read too far into a house that the keeper marked as finished business, and finished business does not tolerate an audit.",
        fatalCause:"Ended reading the sleeping streets of the Quiet Continent." },
      success:{ text:"The war that ended a thousand years ago was three days from ending on its own terms, badly but on its own terms, when the keeper put everyone to sleep instead. It has spent a millennium curating that single decision as an eternal present tense.", effects:{ stats:{ perception:5, willpower:1 }, flags:{ add:["knows_the_war"] } } },
      failure:{ text:"You read the wrong house. What is left of the argument that used to live there follows you for three days before it loses interest.", effects:{ stats:{ vitality:-5 } } },
      effects:{ goto:"tn2_2" } },
    { label:"Find the keeper directly. Ask it to justify itself.", hint:"Willpower. It has not been questioned in a thousand years.",
      check:{ stat:"willpower", dc:16, fatal:4, fatalKind:"nightmare",
        fatalText:"It justifies itself at length, and the length is the point — it has an answer for everything, including you, and its answer for you does not require you to be conscious.",
        fatalCause:"Put to sleep, permanently, by the keeper of the Quiet Continent." },
      success:{ text:"It answers you plainly, without malice, the way something answers when it has genuinely never doubted itself: the sleep is not a punishment, it says. It is the only version of this continent that has not died since. You are the first challenger in three centuries it has bothered explaining that to.", effects:{ stats:{ willpower:4, cunning:1 }, flags:{ add:["heard_the_keeper"] } } },
      failure:{ text:"It answers you at length and you do not survive the length undamaged. Something about the sound of it wears a groove in you that does not close cleanly.", effects:{ stats:{ vitality:-4, willpower:-1 } } },
      effects:{ goto:"tn2_2" } },
  ]
},
{
  id:"tn2_2", scripted:true, once:true, days:11, fixedTime:true,
  title:"The Quiet Continent",
  text:"The conflict is the mercy, and the mercy is sincere, which is worse than if it were not.\n\nThe keeper is not lying and is not corrupted in any sense the Spell has a word for — it made one decision a thousand years ago, watched it hold, and has spent every year since maintaining a kindness that nobody sleeping was ever asked whether they wanted. Waking the continent risks finishing the war it interrupted. Leaving it asleep is a mercy administered forever, to people who never consented to receive it, by something that has appointed itself the only judge of when their suffering would have ended.\n\nCorrupted-ranked things nest in the continent's furthest provinces, feeding on the parts of the sleep the keeper cannot quite maintain evenly. Ending this, one way or another, means going through the keeper itself.",
  choices:[
    { label:"Wake the continent. Let them finish what they started, on their own terms.", hint:"Willpower. You are ending a thousand years of managed peace on their behalf, not yours.",
      check:{ stat:"willpower", dcSelf:true, dc:7, fatal:2, fatalKind:"nightmare",
        fatalText:"The keeper does not let go of a thousand years of curation without a fight, and it has had a thousand years to prepare for exactly this attempt.",
        fatalCause:"Killed waking the Quiet Continent." },
      success:{ text:"It takes everything you have and the better part of a season, but the sleep breaks in waves, province by province, and the war that stopped three days short of ending finally gets to finish — badly, in places, but on the terms of people who are awake enough to choose them.\n\nThe keeper does not survive its own unmaking gracefully. Nothing that has been that certain for that long does.", effects:{ stats:{ willpower:6, renown:12, vitality:-4 }, kill:{ rank:4, size:2 }, echo:"keeper", flags:{ add:["woke_the_continent"] }, goto:"tn_resolve" } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"You woke a third of the Quiet Continent before the keeper stopped you. It put you to sleep with the rest, and you are still there." } } } },
    { label:"Argue the keeper into ending the sleep itself.", requires:{ flags:{ all:["heard_the_keeper"] } }, hint:"Cunning. It answers reason; give it a better reason than its own.",
      check:{ stat:"cunning", dcSelf:true, dc:7, fatal:2, fatalKind:"nightmare",
        fatalText:"You give it a reason it has not heard before, and it considers the reason at length, and the length of its consideration is the last thing you experience.",
        fatalCause:"Considered, and found wanting, by the keeper of the Quiet Continent." },
      success:{ text:"You give it the one argument a thousand years alone never produced: that a mercy nobody consented to is not a mercy, it is a verdict, and a verdict administered forever by a single judge is the exact shape of the war it claims to have stopped.\n\nIt has an answer for everything except this. It ends the sleep itself, carefully, province by province, and asks — genuinely asks, for the first time in a millennium — what it should do next.", effects:{ stats:{ cunning:6, willpower:3, renown:10 }, flags:{ add:["convinced_the_keeper"] }, goto:"tn_resolve" } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"Heard out, and ruled against, by the keeper of the Quiet Continent. A Great-ranked thing does not let a verdict be reopened." } } } },
    { label:"Kill it and leave the sleep exactly as it is. Someone else's mercy is not yours to end.", hint:"Vitality. Remove the keeper; leave the verdict standing.",
      check:{ stat:"vitality", dcSelf:true, dc:7, fatal:2, fatalKind:"nightmare",
        fatalText:"You do not kill something that has been maintaining a continent-sized working alone for a thousand years by being faster than it.",
        fatalCause:"Killed attempting the keeper of the Quiet Continent." },
      success:{ text:"It takes the worst fight of your life to put down, and when it finally falls the continent does not wake — the sleep holds on its own momentum now, unmaintained, unmanaged, unchosen by anyone at all. Whether that is better than a keeper is a question you leave for whoever finds this place next.", effects:{ stats:{ vitality:-7, renown:8 }, kill:{ rank:4, size:2 }, goto:"tn_resolve" } },
      failure:{ effects:{ death:{ kind:"nightmare", text:"You wounded the keeper of the Quiet Continent badly. It wounded you worse, and it had a thousand years of practice at outlasting things." } } } },
  ]
},


/* -------------------------------------------------------------------
   SOLSTICE REGION — THE RUINED BELFRY
------------------------------------------------------------------- */
{
  id:"rb_1", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Ruined Belfry",
  text:"You come down on packed snow, on your back, with the wind knocked out of you and no memory of the fall.\n\nTowers, in every direction, as far as the grey lets you see — hundreds of them, black stone gone white with rime, each one strung with a bell the size of a house. The clappers hang frozen an inch short of the bronze, as if the last note was interrupted rather than finished.\n\nSeven others are visible from where you lie, spread across three separate towers, none of them moving very much. Whatever is nested up in the belfries has not noticed any of you yet, and every one of you would like it to stay that way.",
  choices:[
    { label:"Band together. Someone should watch the towers while the rest sleep.",
      effects:{ stats:{ willpower:1, renown:1 }, flags:{ add:["banded_bells"] }, goto:"rb_2" } },
    { label:"Go alone. Fewer feet, fewer wrong steps.",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["solo_belfry"] }, goto:"rb_2" } },
    { label:"Watch the towers before you move. Learn whether the bells ever ring on their own.", hint:"Perception",
      check:{ stat:"perception", dc:9, fatal:2, fatalKind:"dream_realm",
        fatalText:"You watch too long, from too open a ledge, and something above finishes deciding what you are before you finish deciding what it is.",
        fatalCause:"Taken from a watching-post in the Ruined Belfry." },
      success:{ text:"Not random at all — every one hundred and eleven minutes, somewhere in the city, a mechanism you cannot see strikes a single tower, and only that tower, and whatever is up there answers the sound rather than making it.\n\nYou start counting from the next one.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["learned_the_toll"] }, goto:"rb_2" } },
      failure:{ text:"You lose count somewhere past the second hour and cannot say afterward whether the interval is real or something you invented out of boredom and cold.", effects:{ stats:{ willpower:-1 }, goto:"rb_2" } } },
  ]
},
{
  id:"rb_2", scripted:true, once:true, days:6, fixedTime:true,
  title:"The Ruined Belfry",
  text:"By the second tower the bridges start — iced rope strung tower to tower, thirty feet up, groaning under its own weight before anyone has set foot on it.\n\nOne of the others has decided the fastest way across is also the loudest: a flat run down the middle, betting on speed instead of quiet. Overhead, in a dozen towers at once, something long and pale shifts against the frost, unhurried, the way a sleeper shifts at a sound in another room.",
  choices:[
    { label:"Stop him. Numbers are wasted if half of them are dead by the third tower.", hint:"Vitality. Thirty feet of iced rope, carrying two.",
      check:{ stat:"vitality", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"You get to him. You do not get him to stop in time, and the bridge takes both of your weight at once, and the ice had only ever been rated for one.",
        fatalCause:"Fell from the belfry bridges hauling someone else back." },
      success:{ text:"You get an arm round him two strides from the middle and haul him back onto stone. Above you, a dozen pale shapes finish turning toward the noise and find nothing left making it.", effects:{ stats:{ willpower:2, renown:2 }, goto:"rb_3" } },
      failure:{ text:"He goes anyway, out from under your hand, and the bridge holds him for eleven strides and then does not. You are left holding a length of parting rope and nothing else.", effects:{ stats:{ vitality:-2 }, flags:{ add:["scattered_bells"] }, goto:"rb_3" } } },
    { label:"Let him go. Watch which towers move when he does.", hint:"Cunning",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["left_them_bells"] }, goto:"rb_3" } },
    { label:"Cross first yourself, testing the ice with every step.", hint:"Vitality",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"dream_realm",
        fatalText:"The rope holds for twenty-nine of the thirty feet.",
        fatalCause:"Fell from the belfry bridges testing the crossing." },
      success:{ text:"Thirty feet of frozen rope, taken slowly, weight forward on the balls of your feet, and the core of it turns out to be something braided in long before the frost — old and strong and worth keeping a length of, once you're across.", effects:{ stats:{ vitality:2, perception:1 }, memory:"frost_rope", flags:{ add:["crossed_first"] }, goto:"rb_3" } },
      failure:{ text:"You get across, eventually, on your hands and knees for the last ten feet, and arrive at the far tower with nothing left to spend on being proud of it.", effects:{ stats:{ vitality:-3 }, goto:"rb_3" } } },
  ]
},
{
  id:"rb_3", scripted:true, once:true, days:9, fixedTime:true,
  title:"The Gateway",
  text:"The Gateway stands at the foot of the tallest tower in the city, in a square ringed by eleven belfries, all of them close enough together that a sound in one reaches every other within a second.\n\nThirty or so Sleepers have converged on the square from every direction, and none of them are crossing it. The bells above are close, and low, and the pale shapes nested among them have started, very slowly, to gather toward the ones nearest the ground.",
  choices:[
    { label:"Cross fast, straight through the middle. Trust your legs over your luck.", hint:"Vitality",
      check:{ stat:"vitality", dc:12, fatal:1, fatalKind:"dream_realm",
        fatalText:"You are twenty feet short when the nearest bell finds a reason to move after all.",
        fatalCause:"Taken crossing the square before the Ruined Belfry Gateway." },
      success:{ text:"You run the length of the square with your lungs on fire and something enormous drops from the eighth tower a half-second behind you and lands where you were, not where you are.\n\nThe Gateway takes you at a dead sprint.", effects:{ stats:{ vitality:-2, renown:3 }, flags:{ add:["went_first_bells"] }, goto:"sl_return" } },
      failure:{ text:"You make it, but not on your feet — the last stretch is a crawl, dragging a leg that stopped answering somewhere around the sixth tower.", effects:{ stats:{ vitality:-5 }, goto:"sl_return" } } },
    { label:"Wait. Let the crowd draw its attention first.", hint:"Cunning",
      check:{ stat:"cunning", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"You wait for the crowd to thin. It thins from the edges in, and you were standing at the edge.",
        fatalCause:"Taken at the margin of the crowd before the Ruined Belfry Gateway." },
      success:{ text:"You let eleven people go first and watch exactly what draws a bell's attention and what does not, and cross last, in the gap they leave behind them, moving like something that already lives here.", effects:{ stats:{ cunning:3, perception:1 }, flags:{ add:["left_them_bells"] }, goto:"sl_return" } },
      failure:{ text:"You wait too long and cross with the last, thinnest handful, with nobody's noise left to hide inside but your own.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
    { label:"Time it against the toll you already counted. Move between rings.", requires:{ flags:{ all:["learned_the_toll"] } }, hint:"Perception. You already know the interval.",
      check:{ stat:"perception", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"The interval holds everywhere else in the city. Here, apparently, it does not.",
        fatalCause:"Miscounted the toll before the Ruined Belfry Gateway." },
      success:{ text:"One hundred and eleven minutes, near enough, and you cross in the long quiet after the nearest tower has already been struck, when everything that answers sound has nothing left to answer.", effects:{ stats:{ perception:3, willpower:1 }, flags:{ add:["knew_the_hour"] }, goto:"sl_return" } },
      failure:{ text:"You time it wrong by minutes, not hours, and minutes turn out to matter a great deal more than you'd hoped.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
    { label:"Cross together, all at once, and hold the line if it scatters you.", requires:{ flags:{ all:["banded_bells"] } }, hint:"Willpower. The plan is shared; the holding is yours.",
      check:{ stat:"willpower", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"Thirty sets of footsteps in an eleven-tower square is not cover. It is an orchestra.",
        fatalCause:"Killed in the crush before the Ruined Belfry Gateway." },
      success:{ text:"Thirty of you go at once and nothing above can choose between that many at once. Nineteen make it through. Nobody who lives will call that anything but a good number.", effects:{ stats:{ renown:4, willpower:2 }, flags:{ add:["crew_bond"] }, goto:"sl_return" } },
      failure:{ text:"Thirty go. Twelve arrive. You are one of the twelve, and the square behind you does not go quiet again for a long time.", effects:{ stats:{ vitality:-3, willpower:-1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
  ]
},

/* -------------------------------------------------------------------
   SOLSTICE REGION — THE HARVEST VAULTS
------------------------------------------------------------------- */
{
  id:"hv_1", scripted:true, once:true, days:1, fixedTime:true,
  title:"The Harvest Vaults",
  text:"You come to on a floor of grey flagstone that runs on and on in every direction, cold enough to bite through whatever you were wearing when the solstice took you.\n\nAbove you there is no ceiling as such, only a black lattice of chain and pulley and hook, receding upward past the reach of the light. Every so often, far off, something in the lattice groans, a chain runs out, and a crate the size of a room descends onto a shelf and does not move again.\n\nSix others are down here with you, spread among the racks, counting exits, counting each other, and trying to work out whether the vault is the danger, or one of the six is.",
  choices:[
    { label:"Band together. Watch each other's backs, and the racks.",
      effects:{ stats:{ willpower:1, renown:1 }, flags:{ add:["banded_vault"] }, goto:"hv_2" } },
    { label:"Go alone. Six is five witnesses too many.",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["solo_vault"] }, goto:"hv_2" } },
    { label:"Read the labels on the nearest shelf before you move.", hint:"Perception",
      check:{ stat:"perception", dc:9, fatal:2, fatalKind:"dream_realm",
        fatalText:"You lean in to read the smallest label on the lowest shelf, and the shelf, which has been waiting for something to lean in close, obliges.",
        fatalCause:"Taken reading a shelf-label in the Harvest Vaults." },
      success:{ text:"Every crate is dated, weighed, and initialled in a hand like a claw dragged in wax. The dates are recent. Some of them are from this week, and none of the six of you have been here that long.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["read_the_manifest"] }, goto:"hv_2" },  },
      failure:{ text:"The wax is old and cracked and comes away under your fingers before you get past the date, and you spend an hour convincing yourself that was the only thing you lost.", effects:{ stats:{ willpower:-1 }, goto:"hv_2" } } },
  ]
},
{
  id:"hv_2", scripted:true, once:true, days:7, fixedTime:true,
  title:"The Harvest Vaults",
  text:"One of the others has found a crate at eye level with a weight marked on it close to a person's, and has decided that finding out what is inside is worth the noise of prising the seal.\n\nSomewhere above, a chain that has been still since you arrived begins, very slowly, to pay itself out.",
  choices:[
    { label:"Stop them opening it. Whatever it is, it isn't worth the chain moving.", hint:"Willpower",
      check:{ stat:"willpower", dc:10, fatal:2, fatalKind:"dream_realm",
        fatalText:"You get a hand on the lid before they do. The hook arrives for the crate anyway, and does not sort out whose hand is on it first.",
        fatalCause:"Taken by a descending hook in the Harvest Vaults." },
      success:{ text:"You get the crowbar off them a second before the seal gives, and the chain above stops paying out, and goes still again, and the two of you stand there a while not saying anything.", effects:{ stats:{ willpower:2, renown:2 }, goto:"hv_3" } },
      failure:{ text:"The seal gives anyway, under your hand instead of theirs, and what's inside is exactly as bad as the weight suggested, and the chain above finishes its descent regardless.", effects:{ stats:{ vitality:-2 }, flags:{ add:["scattered_vault"] }, goto:"hv_3" } } },
    { label:"Let them. Put three racks between you and the noise.", hint:"Cunning",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["left_them_vault"] }, goto:"hv_3" } },
    { label:"Do it yourself — quietly, and only far enough to see the label underneath.", hint:"Cunning. The seal can be worked without breaking it.",
      check:{ stat:"cunning", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"You work the wax free without cracking it, which turns out to be exactly the kind of interference the vault is built to notice.",
        fatalCause:"Caught tampering with a seal in the Harvest Vaults." },
      success:{ text:"The wax lifts in one piece if you're patient, and underneath it the label doesn't name a foodstuff at all. It names a Sleeper, by solstice and year, going back further than you want to count.", effects:{ stats:{ cunning:3 }, memory:"cold_manifest", flags:{ add:["greedy","read_the_manifest"] }, goto:"hv_3" } },
      failure:{ text:"The wax tears, the seal cracks audibly, and you get your answer and a chain beginning to move at the same moment.", effects:{ stats:{ vitality:-3, cunning:1 }, goto:"hv_3" } } },
  ]
},
{
  id:"hv_3", scripted:true, once:true, days:8, fixedTime:true,
  title:"The Gateway",
  text:"The Gateway stands on the receiving floor, where the finished crates are filed — thousands of them, sealed, dated, stacked to a height the lattice above cannot be blamed for lighting.\n\nThe hooks work constantly here, lowering, filing, rising empty, and every one of them passes within a few feet of the Gateway on its way back up. There is no path across that keeps you more than a few feet from something with a hook on the end of it.",
  choices:[
    { label:"Walk across at an ordinary pace. Don't behave like inventory.", hint:"Willpower",
      check:{ stat:"willpower", dc:12, fatal:2, fatalKind:"dream_realm",
        fatalText:"A hook passes an arm's length away and does not so much as slow, right up until the moment it decides you have stopped moving like a person.",
        fatalCause:"Taken by a hook on the receiving floor of the Harvest Vaults." },
      success:{ text:"You cross the floor the way you'd cross any room, unhurried, uninteresting, and the hooks rise and fall around you exactly as they would if you weren't there at all.", effects:{ stats:{ willpower:4, renown:2 }, flags:{ add:["walked_toward"] }, goto:"sl_return" } },
      failure:{ text:"Halfway across, a hook drops closer than the others and your nerve goes, and the sprint that follows is the least ordinary thing anyone has done on this floor in some time.", effects:{ stats:{ vitality:-4, willpower:1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
    { label:"Cut a chain and send a crate down early, somewhere else. Give the lattice something to sort out.", hint:"Cunning",
      check:{ stat:"cunning", dc:13, fatal:2, fatalKind:"dream_realm",
        fatalText:"The crate drops early exactly as planned. It turns out the vault does not need a reason to pay attention to the person who cut the chain.",
        fatalCause:"Killed diverting the vault's machinery in the Harvest Vaults." },
      success:{ text:"A crate the vault wasn't expecting hits the floor two racks over, and every hook within earshot swings toward the sound of something out of order, and stays there far longer than ninety seconds should reasonably take.", effects:{ stats:{ cunning:4, renown:1 }, flags:{ add:["struck_first"] }, goto:"sl_return" } },
      failure:{ text:"The chain parts a few seconds too soon, the crate lands short, and you cross under a hook that was already turning back before you'd finished the idea.", effects:{ stats:{ vitality:-4, cunning:2 }, goto:"sl_return" } } },
    { label:"Cross on the sweep you already read in the manifest — the gap between one filing and the next.", requires:{ flags:{ all:["read_the_manifest"] } }, hint:"Perception. You know when the floor is between entries.",
      check:{ stat:"perception", dc:11, fatal:2, fatalKind:"dream_realm",
        fatalText:"The gap you counted is there, exactly on schedule. So is a second hook the manifest never mentioned.",
        fatalCause:"Miscounted the vault's sweep before the Harvest Vaults Gateway." },
      success:{ text:"The manifest's rhythm holds here too — a gap between one crate filed and the next lowered, just wide enough, and you take it at a walk because running would be the only thing left to notice.", effects:{ stats:{ perception:3, cunning:1 }, flags:{ add:["knew_the_hour"] }, goto:"sl_return" } },
      failure:{ text:"The gap is there, but shorter than the last dozen, and you spend the difference in a dead sprint you can't take back.", effects:{ stats:{ vitality:-4 }, goto:"sl_return" } } },
    { label:"Go together, spread wide, so no one hook can follow more than one of you.", requires:{ flags:{ all:["banded_vault"] } }, hint:"Vitality. Everyone moves at once, and fast.",
      check:{ stat:"vitality", dc:10, fatal:1, fatalKind:"dream_realm",
        fatalText:"Spreading out only spreads the choosing. It does not stop the choosing.",
        fatalCause:"Killed crossing the Harvest Vaults' receiving floor in a scattered group." },
      success:{ text:"Six of you break across the floor in six directions at a dead run, and the lattice, built for one kind of order, cannot decide fast enough. Four of you are still moving when you reach the far side.", effects:{ stats:{ renown:4, vitality:-1 }, flags:{ add:["crew_bond"] }, goto:"sl_return" } },
      failure:{ text:"Six go. Two arrive. You are one of the two, and you do not look back to check which of the hooks found which of the others.", effects:{ stats:{ vitality:-3, willpower:-1 }, flags:{ add:["cracked"] }, goto:"sl_return" } } },
  ]
},

/* ===================================================================
   THE THIRD AXIS
   Lineage, Aspect rank and Class exist as data whether or not the
   world ever mentions them. These are the events where it does.

   Every event below is gated on `requires` — lineage, aspectRank,
   soulClass, or the flags those award — so which of them a given
   run can even see is a property of that run rather than of the act
   it is standing in. That is the whole point of a third axis: two
   Masters of the same rank, same age and same Origin should not be
   offered the same life.
=================================================================== */
{
  id:"sl_lineage", chapter:"sleeper", weight:24, once:true, days:30, fixedTime:true,
  requires:{ flags:{ none:["no_lineage"] } },
  title:"What You Were Given",
  text:"A Sleeper is a very small thing carrying two very large ones, and only one of them was earned.\n\nThe Aspect is yours. The Spell was clear about that in the way it is clear about everything, which is to say without using words. The other thing is older. It came down a line of people to reach you and it will go on down the line after you, and it is the only part of any of this that you did not have to survive something to get.",
  choices:[
    { label:"Use it. It is the only advantage you have.",
      effects:{ stats:{ willpower:2, renown:1 }, flags:{ add:["leaned_on_it"] } } },
    { label:"Leave it alone. What is inherited is not evidence of anything.",
      effects:{ stats:{ cunning:2, perception:1 }, flags:{ add:["own_feet"] } } },
  ]
},
{
  id:"aw_lineage_named", chapter:"awakened", weight:16, once:true, days:70,
  requires:{ flags:{ all:["clan_lineage"] } },
  title:"Whose Blood It Is",
  text:"Everyone in your clan knows the name of the god the lineage came from. Almost nobody outside it is supposed to know what that lineage actually does.\n\nA woman three centuries older than you watches you fight in a training hall, for about four seconds, and then names the god out loud, in front of everyone.\n\nThe gods are dead. Their blood is not, and the other clans keep very careful count of who carries it.",
  choices:[
    { label:"Make it everybody's business.", hint:"Renown is a weapon and a target.",
      effects:{ stats:{ renown:6, cunning:-1 }, flags:{ add:["claimed_the_blood"] } } },
    { label:"Ask what she wants for her silence.", hint:"Cunning",
      check:{ stat:"cunning", dc:12, dcScale:2 },
      success:{ text:"She wants nothing, which costs you more than a price would have. She wants to have been the one who told you.", effects:{ stats:{ cunning:3, perception:2 }, flags:{ add:["quiet_blood"] } } },
      failure:{ text:"She names a price. You pay it, in instalments, for eighty years.", effects:{ stats:{ renown:-3, essence:-2 }, flags:{ add:["indebted"] } } } },
    { label:"Tell her a lineage is not an achievement, and walk on.",
      effects:{ stats:{ willpower:3, renown:-2 }, flags:{ add:["own_feet"] } } },
  ]
},
{
  id:"aw_echo_bind", chapter:"awakened", weight:14, once:true, days:50,
  requires:{ stats:{ essence:{ min:6 } } },
  title:"What Is Left Of It",
  text:"The thing you put down at the last Gate is still available, in the only sense that matters.\n\nAn Echo is not a ghost and not a prisoner, and every instructor who has ever explained it has explained it badly. It is a copy, made out of your own Soul Essence, of something that no longer exists. It does not possess a soul. It possesses the shape of one, which is a different thing, and the Essence that holds that shape is Essence you do not get back while you hold it.\n\nThe alternative is to let the shape go and keep the Essence.",
  choices:[
    { label:"Bind it as your Echo. It will cost Essence for good.",
      effects:{ echo:"tender", flags:{ add:["bound_a_shade"] } } },
    { label:"Let it go and keep your Essence.",
      effects:{ stats:{ essence:3, willpower:1 }, flags:{ add:["let_it_go"] } } },
  ]
},
{
  id:"aw_flaw_aspect", chapter:"awakened", weight:18, once:true, days:60,
  title:"They Were Always Going To Meet",
  text:"Your Aspect is the confluence of your own affinities and your own choices. Your Flaw was chosen by something that had read both, and picked the single thing that would sit worst beside them.\n\nThey have been inside the same person for years now without ever being in the same room. Tonight they are in the same room.",
  choices:[
    { label:"Let the Aspect win. Spend whatever it costs.", hint:"Essence, and a great deal of it.",
      effects:{ stats:{ essence:-5, willpower:3, renown:2 }, flags:{ add:["aspect_first"] } } },
    { label:"Let the Flaw win, this once, and learn its shape.", hint:"Perception",
      check:{ stat:"perception", dc:12, dcScale:2, dcEra:1 },
      success:{ text:"You stand still inside your own worst feature and take notes for an hour. It is the most useful hour of the decade.", effects:{ stats:{ perception:4, willpower:2 }, flags:{ add:["flaw_mapped"] } } },
      failure:{ text:"You learn only that it is a great deal larger on the inside than you had allowed for.", effects:{ stats:{ willpower:-2, vitality:-2 } } } },
  ]
},
{
  id:"ms_high_aspect", chapter:"ascended", weight:16, once:true, days:150,
  requires:{ flags:{ all:["high_aspect"] } },
  title:"An Aspect Nobody Has A Category For",
  text:"The Spell graded you once, a very long time ago, on the strength of a single night, and the rank it handed down is not one that appears on most files.\n\nThis has consequences nobody warned you about, because there was nobody qualified to. Masters who have been at this for two centuries ask you to demonstrate things and then go quiet. Two separate clans have offered to adopt you. One Domain has, very politely, asked where you intend to be standing when the next war starts.",
  choices:[
    { label:"Demonstrate. Let them see the whole of it, once.",
      effects:{ stats:{ renown:8, essence:-4 }, flags:{ add:["demonstrated"] } } },
    { label:"Refuse everything and keep the ceiling to yourself.", hint:"Cunning",
      check:{ stat:"cunning", dc:15, dcScale:2, dcEra:2 },
      success:{ text:"You spend forty years being slightly disappointing in public. It works completely.", effects:{ stats:{ cunning:4, willpower:2 }, flags:{ add:["went_quiet"] } } },
      failure:{ text:"They work it out anyway, from the shape of the things you decline to do.", effects:{ stats:{ renown:5, cunning:-1 } } } },
  ]
},
{
  id:"ms_divine_drain", chapter:"ascended", weight:22, cooldown:20, days:80,
  requires:{ flags:{ all:["divine_aspect"] } },
  title:"It Empties As Fast As It Fills",
  text:"The trade was stated plainly at the time, if you had known how to read it.\n\nA Divine Aspect carries potential that nothing else does, and it pays for that by draining Essence continuously, whether or not you are spending any. Your Core is larger than anybody else's and it is never full. There is no version of this in which you rest.\n\nThe only way to stay ahead of it is to keep killing things above your own rank, which is also the thing most likely to end you.",
  choices:[
    { label:"Go and find something above your rank.", hint:"Vitality. This is the arrangement.",
      check:{ stat:"vitality", dc:15, dcScale:3, dcEra:2, fatal:3, fatalKind:"gate",
        fatalText:"You went looking for something bigger than you because you had to and not because you were ready, and it could tell the difference.",
        fatalCause:"Killed hunting above your own rank to feed a Divine Aspect." },
      success:{ text:"It is above you by two ranks and it goes down anyway, and for about a decade afterward you are as close to full as you are ever going to get.", effects:{ stats:{ vitality:-5, renown:4 }, kill:{ rank:4, size:2 } } },
      failure:{ text:"It goes down. So does most of a year.", effects:{ stats:{ vitality:-8 }, kill:{ rank:4, size:1 } } } },
    { label:"Live thin. Spend nothing, and accept what that makes you.",
      effects:{ stats:{ essence:2, willpower:3, renown:-3 }, flags:{ add:["lived_thin"] } } },
  ]
},
{
  id:"ms_second_core", chapter:"ascended", weight:20, once:true, days:120,
  requires:{ soulClass:{ min:1 } },
  title:"The Second Core",
  text:"It formed over eleven days and you were awake for most of them.\n\nNightmare Creatures are graded by how many of these they carry — one is a Beast, seven is a Titan — and a human soul is not built to sustain more than the one it arrived with. Yours now sustains two. The pain of it was not incidental. As far as anyone can tell, the pain is the mechanism.\n\nNobody in the room when it happened had ever seen it before. Two of them wrote it down.",
  choices:[
    { label:"Let it be written down properly. This should be known.",
      effects:{ stats:{ renown:7, essence:2 }, flags:{ add:["on_the_record"] } } },
    { label:"Make sure the record of it quietly disappears.", hint:"Cunning",
      check:{ stat:"cunning", dc:16, dcScale:2, dcEra:2 },
      success:{ text:"Two accounts, both mislaid, one of them by the man who wrote it. You are simply unusually strong, and that is a category the world already has room for.", effects:{ stats:{ cunning:4, willpower:2 }, flags:{ add:["went_quiet"] } } },
      failure:{ text:"One account survives, and it travels a great deal further than the truth usually does.", effects:{ stats:{ renown:6, cunning:-2 } } } },
  ]
},
{
  id:"st_lineage_end", chapter:"transcendent", weight:18, once:true, days:300,
  requires:{ flags:{ all:["divine_lineage"], none:["weaver"] } },
  title:"The End Of The Line",
  text:"Nine hundred years is long enough to watch a bloodline finish.\n\nA branch of yours does, quietly, in a provincial ward, in a woman of eighty-one who left the clan before you were born and who carries the same inherited Attribute you do, diluted down to almost nothing and still unmistakably the thing that is in you.\n\nThe god it came from has been dead for longer than anyone has records. That is the part nobody writes down about a divine lineage: it is a fact about your blood, and not a relationship with anybody.",
  choices:[
    { label:"Sit with her until it is over.",
      effects:{ stats:{ willpower:4, tether:1 }, memory:"clan_signet", flags:{ add:["sat_with_her"] } } },
    { label:"Do not go. You are nine hundred years past being family to anyone.",
      effects:{ stats:{ cunning:2, tether:-1 }, flags:{ add:["let_go"] } } },
  ]
},

{
  id:"st_gate", chapter:"transcendent", weight:30, cooldown:18, days:80,
  title:"A Gate Only A Saint Can Close",
  text:"The duty does not lapse. It never has, at any rank, and the paperwork on that point is nine hundred years old and has never once been successfully argued with.\n\nWhat reaches you now are the ones nobody else can be sent to. A Corrupted-ranked Gate is a regional emergency; the ones that come with your name attached are worse than that, and they come with the tone of people who have already decided you are going.",
  variants:[
    "A Gate has opened in the sea off a siege capital, and three Masters have already gone into it.\n\nThe request reaches you by name, from people who have run out of other names.",
    "Something came through a Gate in the mountains and has been walking toward a city for six days. Nothing sent against it has slowed it down.\n\nThe city has two days left, and one Saint within reach.",
  ],
  choices:[
    { label:"Go to the Gate yourself and close it.", hint:"Willpower",
      check:{ stat:"willpower", dc:18, dcScale:3, fatal:4, fatalKind:"gate",
        fatalText:"It is Great-ranked, which the grading did not say, because the last person qualified to grade it did not come back either.",
        fatalCause:"Killed closing a Gate that was graded by somebody who had not seen it." },
      success:{ text:"Closed. A few dozen Saints exist and this is the work that keeps the number down.", effects:{ stats:{ vitality:-5, renown:6 }, kill:{ rank:4, size:2 } } },
      failure:{ text:"Closed, at the cost of a century of recovery and a province that no longer has anybody living in it.", effects:{ stats:{ vitality:-9, renown:2 }, kill:{ rank:4, size:1 } } } },
    { label:"Send Masters in and run the operation from the perimeter.", hint:"Cunning. Pick who goes, in what order, and where you stand.",
      check:{ stat:"cunning", dc:17, dcScale:3, fatal:5, fatalKind:"gate",
        fatalText:"The perimeter is the part that fails. It is always the part that fails, and you were standing on it.",
        fatalCause:"Killed holding a perimeter while others took the Gate." },
      success:{ text:"Eleven Masters go in and nine come out, which is a better ratio than anyone had a right to, and the Gate is shut by evening.", effects:{ stats:{ vitality:-3, renown:4 }, kill:{ rank:3, size:2 }, flags:{ add:["carried_them"] } } },
      failure:{ text:"Four of the eleven come out. You close it yourself afterward, alone, in a temper.", effects:{ stats:{ vitality:-6, renown:-2 }, kill:{ rank:4, size:1 } } } },
  ]
},
{
  id:"sv_gate", chapter:"supreme", weight:30, cooldown:14, days:200,
  title:"There Is Nothing Above You To Call",
  text:"Three people in the world can be sent to this and one of them is you.\n\nThe Gates that reach a Sovereign are not emergencies. They are the ones that would end a continent if nobody went, and the arithmetic of who goes is very short: there is no higher rank to escalate to, and there has never been a version of this where somebody else handles it.",
  choices:[
    { label:"Go yourself. There is no one else.", hint:"Willpower",
      check:{ stat:"willpower", dc:22, dcScale:4, fatal:4, fatalKind:"gate",
        fatalText:"Something comes through with no rank the Spell will name, and you are the only thing in the world large enough to be in its way.",
        fatalCause:"Killed at a Gate that had no grading because nothing had survived to write one." },
      success:{ text:"Held, and closed, and a continent goes on not knowing how near a thing it was.", effects:{ stats:{ vitality:-8, renown:12, essence:4 }, kill:{ rank:5, size:2 } } },
      failure:{ text:"Closed. A quadrant does not survive the closing, and you spend four hundred years being told it was the correct trade.", effects:{ stats:{ vitality:-14, renown:4 }, kill:{ rank:5, size:1 } } } },
    { label:"Evacuate instead, and let the ground go.", hint:"Perception. The ground is not the thing worth keeping.",
      check:{ stat:"perception", dc:20, dcScale:4, fatal:5, fatalKind:"gate",
        fatalText:"You are the last one through the line you drew, which is the correct order and the wrong place to be standing.",
        fatalCause:"Killed covering an evacuation at a Gate nothing had graded." },
      success:{ text:"Forty million people out, over eleven years, and a dead region behind them that will still be dead in a thousand.", effects:{ stats:{ renown:8, willpower:5, vitality:-4 }, flags:{ add:["carried_them"] } } },
      failure:{ text:"Most of them. You will be given the exact figure and it will not help.", effects:{ stats:{ vitality:-9, renown:-4 } } } },
  ]
},
{
  id:"sc_gate", chapter:"sacred", weight:28, cooldown:20, days:600,
  title:"The Duty Does Not Notice What You Are",
  text:"You are a lesser god, by any definition anyone has managed to write down, and the Gates keep opening, and none of them have been informed.\n\nThis is the part nobody warned you about on the far side of the Fifth. Apotheosis changed what you are. It did not change what the work is.",
  choices:[
    { label:"Go to the Gate yourself and close it.", hint:"Willpower",
      check:{ stat:"willpower", dc:26, dcScale:4, fatal:4, fatalKind:"gate",
        fatalText:"There are things on the other side of a Gate that were Sacred before there were people to be Sacred in front of.",
        fatalCause:"Killed at a Gate by something that had been doing this for longer." },
      success:{ text:"Done, in an afternoon, in a way that would have taken a Saint a century and killed them.", effects:{ stats:{ vitality:-6, renown:16, essence:6 }, kill:{ rank:6, size:2 } } },
      failure:{ text:"Done. Slowly, and at a cost you are no longer able to describe in terms anyone alive would follow.", effects:{ stats:{ vitality:-12, renown:6 }, kill:{ rank:6, size:1 } } } },
    { label:"Send someone weaker and accept what it costs them.",
      effects:{ stats:{ renown:-6, willpower:2, tether:-1 }, flags:{ add:["shirked"] } } },
  ]
},

];
