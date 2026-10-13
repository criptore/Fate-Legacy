# Technical follow-ups (v0.5.0)

Three small fixes found while building the v0.5.0 content.

## 1. A stats block that silently lost a number
Two Aspect choices at Master (Thorn and Iron) had
`stats:{ vitality:-2, renown:4, vitality:1 }`. A repeated key is legal
JavaScript and only the last value counts, so the -2 Vitality cost vanished
and the choice paid +1 Vitality instead. They now cost -1 Vitality (the
intended -2 +1). The canon watch caught it.

`validate.js` now reads the source of every loaded file and fails on any
`stats:{...}` block that repeats a key, so this cannot come back.

## 2. The Second Nightmares were almost harmless
At realistic Awakened stats the Lantern March, the Iron Orchard and the
Court of Uncounted Debts killed 0.1–1.9% of challengers. Their decisive
checks used fixed DCs (14–17), which any Awakened ready for a Second Seed
clears easily. In canon the Second Nightmare is "larger, longer, and harder" than the
First (ch. 559), and its Creatures are "usually either Awakened or Fallen"; a
Nightmare that kills almost nobody does not match that. Canon gives no death
rate for it, so the 10% below is ours.

The decisive (last-node) checks are now personal trials
(`dcSelf:true, dc:4, fatal:3`), the same as the new Noon Tribute:
about 10% die, about 20% conquer at a cost, and the rest conquer cleanly.
Nothing else changed, and every failure branch still resolves the Nightmare.

Scenario test (4000 runs, Awakened stats 14–21, random choices):

| | before | after |
|---|---|---|
| Lantern March | 0.1% death | 10.9% |
| Iron Orchard | 0.7% | 10.5% |
| Court of Uncounted Debts | 1.9% | 10.0% |

## 3. Memories and Echoes in the choice hint
With *Stat hints* on, a fight now also shows what your Memories and Echoes
will add before you choose, e.g. *"Perception. Find out what came through
before it finds you. (Weapon +1, Echo +d4)"*. With hints off, nothing
changes.

## Numbers
`sim.js`, 8000 lives per policy, citadel origin:
- **skilled:** Saint 19.3% → 16.9% (target 15–20%); Second Nightmare deaths
  now end about 8% more lives at Awakened.
- **climber:** Saint 19.5% → 17.2%.
- **random:** Master+ 23.4% → 20.4%.
