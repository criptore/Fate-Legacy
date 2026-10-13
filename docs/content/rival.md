# The Rival

A module (`js/modules/rival.js`) that gives every life a rival: someone else
who came out of the same Gateway the winter you Awakened, and who stays in
your life for as long as both of you live.

## How it works

- **When:** not every life has a rival. *Someone Else Who Made It*
  (`rv_meet`) is an ordinary random event in the Awakened pool, drawn at most
  once per life, and the rival only exists once it is drawn. It is someone
  who came out of the same Gateway the winter you Awakened and has been
  thinking about you since.
- **Who:** an original character (never a canon one). They get a name, a
  background (Legacy scion, outskirts kid, citadel prodigy) and an Aspect
  that is not yours.
- **Standing:** a scale from -3 ("would kill you") to +3 ("would die for
  you"). It starts at -1. Your choices move it.
- **Rank:** the rival climbs on their own. Each time you rank up, they have a
  60% chance to follow, and some scenes push them further. When they are
  ahead of you, the `rival_ahead` flag is set.

## Events

| id | when | what |
|---|---|---|
| `rv_meet` | Awakened, random, once | first meeting, outside a Gate cordon |
| `rv_gate` | Awakened/Ascended, recurring | the same Gate, two Aspects |
| `rv_news` | recurring | you hear how they are doing |
| `rv_duel` | standing ≤ -2, once | they come to take your soul fragments (fatal, `murdered`) |
| `rv_rescue` | standing ≥ 2, once | they come back for you |
| `rv_fall` | once | they die somewhere you were not |

Achievements: **Only One Of Us** (kill your rival) and **Saved By A Rival**.

The Status page shows the rival's name, rank, Aspect and standing. The end
screen shows what became of them.

## Lore basis

- Killing an Awakened yields part of their soul fragments. That is the canon
  motive for the duel.
- Feuds between Legacy scions and independents in the Dream Realm.
- Duels between Awakened happen.

Everything else (names, scenes, the standing scale) is fanfiction.

## Balance

From a sim of 6,000 random-policy lives:

- **Who meets one:** 46% of the lives that reach Awakened, or 34% of all lives.
- **When:** at a median age of 36. One meeting in ten happens by age 20, and one in ten after age 76.
- **Deaths:** about 0.2% of all lives are killed by their rival.
