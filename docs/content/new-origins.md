# New origins: A Sworn House, The Evacuation Camps

Origin is the difficulty setting. With these two the origin screen reads
hardest to easiest: The Outskirts, **The Evacuation Camps**, A Citadel Ward,
**A Sworn House**, A Great Clan.

## A Sworn House
A lesser Legacy Clan sworn to a Great one: an Attribute, a little training,
and an oath signed before you were born.

- **Stats and lineage.** Between a citadel ward and a Great Clan. Its own
  Attribute ("A Legacy Clan") is the common lineage (59%); a Great Clan's
  divine blood is rare (about 2% each).
- **Before the solstice.** Gets the clan's preparation offer.
- **The House Heirloom** (Sleeper). Your grandmother hands you her Memory
  while she is still alive to do it, or you refuse it and she keeps it until
  it vanishes with her.
- **The Oath Is Called** (Awakened). Your liege clan calls your house to war.
  You can answer (*Kept the Oath*), send a cousin, or refuse and hunt for the
  clause that lets you.

## The Evacuation Camps
A Gate swallowed the region you were born in, and you grew up in the camps.

- **Stats and lineage.** Willpower, perception and cunning, at a cost in
  body and standing. Lineage is like the Outskirts. The Spell grades you a
  little more generously, because you are far from any destined path
  (deviation +1; the Outskirts get +2).
- **Letters From The Camp** (Sleeper). Every family in your row wrote you a
  letter for the solstice.
- **The Army Comes Recruiting** (Awakened). The Evacuation Army is going back
  to retake your region. You can enlist, go back to the camp and teach the
  children, or decline.

## Canon it follows
| Rule | Source |
|---|---|
| Lesser Legacy Clans have hereditary Attributes, and some serve a Great Clan (White Feather serves Valor) | Legacy Clans (wiki) |
| "Physical contact was required to transfer a Memory", and Memories are "destroyed at the moment of their owner's death" | Memory (wiki) |
| The Chain of Nightmares turned Antarctica into hundreds of Gates; the Government ran the evacuation; the First Evacuation Army fought it | Chain of Nightmares, ch. 843+ (wiki) |
| The Spell's appraisal is tied to "how far one deviated from their destined path" | Nightmare Spell (wiki) |

## Ours
Both families, the camps, the liege's war and the Army's return. Your house
and your region are never named.

## Code
`ORIGINS` entries may now carry a `deviation` (the appraisal adjustment);
`awardFlaw` reads it and falls back to the old values for the original
three origins. The pack also sets each lineage's weight for the new origins
(without that, every lineage would fall back to weight 1, making divine
blood common), adds the new origins to the matching Aspect biases, and sorts
the origin list by difficulty.

## Numbers
`sim.js random <origin> 6000`, share of lives reaching Master or higher:
Outskirts 16%, Camps 21%, Citadel 23%, Sworn House 29%, Great Clan 32%.
