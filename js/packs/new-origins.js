/* =============================================================
   NEW ORIGINS — A SWORN HOUSE, THE EVACUATION CAMPS
   Two more places to be born, each with its own difficulty and
   its own events.

   - A Sworn House: a lesser Legacy Clan sworn to a Great one. Canon
     has lesser Legacy Clans with hereditary Attributes (Aegis Rose,
     Dagonet, Han Li, Maharana, Pandavar, Sorrow, White Feather), and
     some of them serve a Great Clan.
     Which house is left unnamed: the player's family is ours.
   - The Evacuation Camps: raised in a camp after a Gate swallowed
     your home region. Canon's Chain of Nightmares turned Antarctica
     into hundreds of Gates and emptied it; the Government ran the
     evacuation, and the First Evacuation Army fought it. The camps
     and your region are ours.

   Origin is the difficulty setting. See docs/content/new-origins.md.
   ============================================================= */
Pack.add({
  id: "new-origins",

  origins: [
    { id:"sworn_house", name:"A Sworn House",
      desc:"A lesser Legacy Clan, sworn to a Great one. You have an Attribute, a sword, a little training, and an oath that was signed before you were born.",
      stats:{ willpower:2, essence:2, vitality:1, perception:1, renown:2 }, flags:["sworn_house", "obligated"],
      deviation:0 },
    { id:"evacuee", name:"The Evacuation Camps",
      desc:"A Gate swallowed the region you were born in. You grew up in the camps afterwards, in a row of identical tents, learning which adults to trust. Hard, but nobody there ever lied to you about the Spell.",
      stats:{ willpower:3, perception:2, cunning:2, vitality:-1, renown:-2 }, flags:["evacuee"],
      deviation:1 },
  ],

  achievements: {
    kept_the_oath: { name:"Kept the Oath", desc:"Answered your liege clan's call to war as a Sworn House scion, and came home from it." },
    went_back_to_camp: { name:"Back to the Camps", desc:"Went back, as an Awakened, to the evacuation camp you grew up in." },
  },

  events: [
/* ---------- A Sworn House ---------- */
{
  id:"or_oath", chapter:"awakened", weight:16, once:true, days:60,
  requires:{ flags:{ all:["sworn_house"] } },
  title:"The Oath Is Called",
  text:"A rider from your liege clan arrives at your family's house before dawn. You have never met him. He knows your name, your Aspect and your rank, and he is holding a letter with a seal that your great-grandfather swore to.\n\nThe Great Clan is fighting for a Citadel in the Dream Realm, and the oath says that every Awakened of your house answers when it is called. It does not say anything about whether you will come back.",
  choices:[
    { label:"Answer the call. Your family keeps its oaths.", hint:"Willpower. A clan war, fought by its vassals.",
      check:{ stat:"willpower", dc:14, dcScale:2, dcEra:1, fatal:5, fatalKind:"war",
        fatalText:"The Great Clan's Saints break the enemy line. The vassals were the line before that.",
        fatalCause:"Killed in a Great Clan's war, answering the oath of a Sworn House." },
      success:{ text:"You come home a year later with a scar, a commendation in a hand you do not recognise, and the quiet respect of a liege clan that had never learned your name before.", effects:{ stats:{ renown:6, willpower:2, vitality:-3 }, kill:{ rank:1, size:2 }, flags:{ add:["kept_the_oath"] } } },
      failure:{ text:"You come home. Not everyone from your house does. Your mother does not ask about the ones who did not.", effects:{ stats:{ vitality:-6, willpower:1 }, flags:{ add:["kept_the_oath"] } } } },
    { label:"Send a younger cousin in your place.", effects:{ stats:{ cunning:2, renown:-3 }, flags:{ add:["shirked"] } },
      text:"Your cousin goes. He comes back. You never stop wondering what you would have done if he had not." },
    { label:"Refuse. You did not sign anything.", hint:"Cunning. Your family will not forgive this easily.",
      check:{ stat:"cunning", dc:15, dcScale:2 },
      success:{ text:"You find the clause your great-grandfather left in the oath for exactly this, and the liege clan, to its credit, honours it. Your family does not speak to you for a decade.", effects:{ stats:{ cunning:3, renown:-2 }, flags:{ add:["broke_the_oath"] } } },
      failure:{ text:"There is no clause. Your house is fined, publicly, and the fine is paid by your parents.", effects:{ stats:{ renown:-6, willpower:-1 }, flags:{ add:["broke_the_oath"] } } } },
  ]
},
{
  id:"or_heirloom", chapter:"sleeper", weight:160, once:true, days:20, fixedTime:true,
  requires:{ flags:{ all:["sworn_house"] } },
  title:"The House Heirloom",
  text:"Your grandmother calls you in the week before the solstice. She is Awakened, old, and has never let you touch the Memory she carries.\n\nToday she holds out her hand. A Memory can only be handed over by touch, and only while its owner lives. She says she would rather give it to you now than have it vanish with her.",
  choices:[
    { label:"Take it, and thank her.", effects:{ memory:"clan_signet", stats:{ willpower:1 } },
      text:"Her hand is warm and dry. The Memory moves from her to you like a held breath let go. She looks smaller afterwards, and very pleased." },
    { label:"Refuse. She will need it more than you, out there.", effects:{ stats:{ willpower:3 } },
      text:"She is angry for an hour, and then not. She keeps it. Years later, when she dies, it goes with her, the way Memories do, and you find you do not regret it." },
  ]
},

/* ---------- The Evacuation Camps ---------- */
{
  id:"or_camp_letter", chapter:"sleeper", weight:160, once:true, days:20, fixedTime:true,
  requires:{ flags:{ all:["evacuee"] } },
  title:"Letters From The Camp",
  text:"The camp you grew up in sends you off to the solstice with a bag of letters.\n\nEvery family in your row wrote one. Most of them say the same things: come back, be careful, do not be brave. One is from a boy you used to share a tent with, who was taken by the Spell two years ago and never came home. His mother wrote it in his name.",
  choices:[
    { label:"Read them all, now, before the solstice.", effects:{ stats:{ willpower:3, tether:2 } },
      text:"You read them by torchlight. By the end you know exactly how many people are waiting for you, and it is more than you thought." },
    { label:"Keep them sealed. You will read them when you come back.", effects:{ stats:{ willpower:2, cunning:1 }, flags:{ add:["sealed_letters"] } },
      text:"You tuck them inside your shirt, sealed. It is a promise, and you are not sure who you are making it to." },
  ]
},
{
  id:"or_army", chapter:"awakened", weight:18, once:true, days:80,
  requires:{ flags:{ all:["evacuee"] } },
  title:"The Army Comes Recruiting",
  text:"An officer of the Evacuation Army finds you at a Gate you have just closed. She has your file. She knows which camp you came from, and which region the camp was for, and that the region is still a ruin of Gates and nobody has been allowed back.\n\nThe Army is going back. It needs Awakened who know what it is to lose a home to a Gate.",
  choices:[
    { label:"Enlist, and go back to where you were born.", hint:"Perception. A region of Gates, chained together.",
      check:{ stat:"perception", dc:15, dcScale:2, dcEra:1, fatal:5, fatalKind:"gate",
        fatalText:"The region is a chain of Gates, and one of them opens under your company's camp at night.",
        fatalCause:"Killed retaking the region you were born in, with the Evacuation Army." },
      success:{ text:"It takes three years. At the end of them your company stands in the ruins of the town you were born in, and you find the street, and the house, and nothing left of either. You plant a flag anyway.", effects:{ stats:{ renown:8, willpower:3, vitality:-3 }, kill:{ rank:2, size:2 }, flags:{ add:["carried_them"] } } },
      failure:{ text:"The Army does not take the region back. It takes part of it, at a terrible price, and you are part of the price.", effects:{ stats:{ vitality:-7, willpower:2 } } } },
    { label:"Go back to the camp instead, and teach the children what is coming.", effects:{ stats:{ renown:4, tether:3 }, flags:{ add:["went_back_to_camp"] } },
      text:"The camp is still there. It is bigger. You spend a year teaching anyone who will listen how to survive their First Nightmare, and some of them do." },
    { label:"Decline. You left the camps for good.", effects:{ stats:{ cunning:2, tether:-1 } } },
  ]
},
  ],

  patch() {
    /* Lineage: a Sworn House is a lesser Legacy Clan, so its own Attribute
       is the common case and a Great Clan's blood is rare; the camps are like
       the outskirts. Without these weights the draw would fall back to 1 for
       every lineage, and divine blood would be common. */
    const W = {
      none:{ sworn_house:10, evacuee:74 }, thin:{ sworn_house:24, evacuee:24 }, legacy:{ sworn_house:58, evacuee:1 },
      valor:{ sworn_house:2, evacuee:0.2 }, song:{ sworn_house:2, evacuee:0.2 }, night:{ sworn_house:2, evacuee:0.2 },
      sun:{ sworn_house:0.3, evacuee:0.15 }, heart:{ sworn_house:0.2, evacuee:0.08 }, shadow:{ sworn_house:0.12, evacuee:0.12 },
    };
    for (const l of LINEAGES) {
      if (l.eventOnly) continue;
      l.weight = l.weight ?? {};
      const w = W[l.id] ?? { sworn_house:1, evacuee:1 };
      Object.assign(l.weight, w);
    }
    /* Aspects: the camps lean like the outskirts, a Sworn House like a clan. */
    for (const a of ASPECTS) {
      if ((a.origins ?? []).includes("outskirts")) a.origins.push("evacuee");
      if ((a.origins ?? []).includes("clan")) a.origins.push("sworn_house");
    }
    /* Origin is the difficulty setting, so the list reads hardest to easiest:
       Outskirts, Camps, Citadel, Sworn House, Great Clan. */
    const order = ["outskirts", "evacuee", "citadel", "sworn_house", "clan"];
    ORIGINS.sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99));
    /* A Sworn House gets the clan's preparation offer before the solstice. */
    const prep = Pack.byId("sl_after")?.choices.find(c => c.requires?.flags?.all?.includes("clan"));
    if (prep) prep.requires = { flags:{ any:["clan", "sworn_house"] } };
  },
});
