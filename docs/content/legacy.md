# The Hall of Past Lives

A module (`js/modules/legacy.js`) that remembers every finished life on this
device. The next life happens in the same world, after it.

## Not reincarnation

The next character is somebody else. They grow up hearing about the one
before, and three things can reach them:

| What carries over | How it reaches the next life |
|---|---|
| **The story** | *A Story You Grew Up On* (`hall_legend`): the legend of the most remarkable recent life. Tell it properly, learn from its mistake, or ignore it. |
| **Written notes** | *A Bundle Of Notes* (`hall_notes`), only if they died inside a Second-or-later Nightmare. If you read them and the Spell ever sends you into that same Nightmare, every roll inside gets **+3 "Their notes"**. Conquering it earns **Finished What They Started**. |
| **An organization** | *{their order} Still Stands* (`hall_org`), only if they founded one that was still standing (size ≥ 2). Join it (**Kept Their Name**), read the founder's papers, or walk your own road. |

**No item crosses over.** Canon: Memories vanish when their owner dies, and a
destroyed Echo is gone. Stories, notes and institutions are what a world
keeps, so they are all this module passes on.

## Which past life

When a new life starts, the module looks at the last ten finished lives that
were Awakened, or that died in a later Nightmare, and picks the most notable
one. Notability is rank × 3 + Nightmares conquered × 2 + 3 for a standing
organization + 1 for dying in a Nightmare + up to 3 for age. The Status page
shows who that was (*Who came before*).

## The Hall

- **Home screen:** the last eight lives, each with its rank, origin, age,
  Aspect and cause of death, plus the epithet if the Chronicle (#42) is
  merged. A summary line gives the number of lives and the deepest rank ever
  reached.
- **Forget them all:** clears the Hall, after a confirmation.
- **Storage:** `localStorage["fatelegacy.hall"]`, newest first, 40 lives at
  most. A life is recorded once, at its death.

## Numbers

A chain of 3,000 random lives, each one inheriting from the Hall:

- *A Story You Grew Up On*: 63% of lives;
- the organization event: 37%;
- the notes: 21%;
- *Finished What They Started*: 8 lives, so it is rare.

`sim.js` is unchanged, because it has no storage and therefore no past lives.

## Lore

Lore checked:

- Memories vanish when their owner dies: "destroyed at the moment of their
  owner's death" (Memory, wiki).
- A destroyed Echo is gone.
- A Seed stays open to "any number of challengers as long as the trial is not
  conquered" (Nightmares, wiki), and one that is not found in time blooms into
  a Gate that can still be entered (Seed of Nightmare, wiki). So the Nightmare
  that killed a past life can still be waiting for the next one. How long a
  Seed lasts is not stated anywhere; that it lasts a lifetime is ours.
- The notes hold only what someone could know *before* entering: what was
  known about the Seed, what came through its Gate, who else meant to try,
  and their plan. Nobody who died inside could write what happened there.

## Firsts stay true

Past lives happened in this world, so they count. Canon has three Sovereigns
before the player (ch. 368) and nobody of this cycle back from the Fifth
Nightmare (ch. 2761). If a past life became a Sovereign or a Spirit, the
module rewrites those lines for every life after it: "There have been four.
You are the fifth.", "Only one from this cycle of the Spell has ever come
back from it", and the Sacred who visits a god becomes the third of this
cycle instead of the second.

The legends, archives and orders are ours.
