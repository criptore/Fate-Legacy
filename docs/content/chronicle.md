# The Chronicle

A module (`js/modules/chronicle.js`) that writes each life's history as it
happens, and shows it as a timeline on the end screen.

## What it records

After each choice it compares the state with the previous one and writes down
what changed. It needs nothing from the packs, so it records their content too
(new Nightmares, Memories, Echoes, achievements, the rival).

| Moment | Example |
|---|---|
| Birth | `Born: A Great Clan. Lineage: Valor · the War God.` |
| A Nightmare entered or conquered | `Entered a Nightmare: The Iron Orchard.` / `Conquered The Iron Orchard.` |
| The Aspect and the Flaw (revealed together) | `The Spell named the Aspect: Ember. Its price, the Flaw: The Unspent.` |
| The solstice region | `Woke in the Dream Realm, in The Ruined Belfry.` |
| A rank | `Became Ascended (Master).` |
| A Memory, an Echo, an Echo lost | `An Orchard Tender died in your place.` |
| A Soul Core, an organization, a rewritten lineage | `Founded the Second Watch.` |
| An achievement | its name and description |
| A deadly roll passed by 0 or 1 | `Lived through "The Communicator" by a single breath.` |
| The death | the cause, as on the end screen |

The list is capped at 120 entries. When it is full, the oldest entry after the
birth line is dropped. A life saved before the module existed starts its
chronicle at the next choice, with a line saying so.

## Where it shows

- **End screen:** the full timeline, with **Copy as text** and
  **Download .txt** buttons.
- **End screen tile:** *Remembered as*, an epithet for the life. It is
  chosen from how the life ended (*Who Outlived Everyone*, *the Betrayed*,
  *Author of a Law*), then from what happened in it (*the Many-Times Spared*,
  *Breaker of Nightmares*, *Founder*), then from the highest attribute
  (*the Unbending*, *the Quiet Knife*).
- **Status page:** the last five entries.

## Text export

```
FATE LEGACY — A CHRONICLE
Ascended, the Well-Known

Age    17  Born: A Great Clan. Lineage: Valor · the War God.
Age    17  Entered a Nightmare: The Quiet Ward.
...
Age   118  Killed alone in a Gate you had cleared of everyone who might have helped.
```

## Lore

No lore. It only records what other content does.

## Numbers

From 3,000 random lives:

- a life has 13 entries at the median and 39 at most;
- there are about 1.2 close calls per life.
