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

- Memories vanish when their owner dies.
- A destroyed Echo is gone.

The legends, archives and orders are ours.
