# Development

Static site: no framework, no build step, no backend.

## Running

```
python3 -m http.server 8080     # then open http://localhost:8080
node tools/validate.js          # after any content change
node tools/sim.js random citadel 8000    # policy origin n
node tools/sim.js climber citadel 8000   # or: skilled
node tools/audit.js             # optional, see below
```

## Files

```
index.html          shell + recovery hatch (/?repair)
css/tokens.css      design tokens, per-rank accent colours
css/main.css        everything else
js/data.js          ALL content: ranks, origins, aspects, flaws, catalogues, events
js/engine.js        clock, eligibility, weighted draw, checks, effects
js/save.js          versioned localStorage
js/ui.js            DOM rendering
sw.js               PWA precache, network-first shell
tools/validate.js   event-graph checker; run after every content change
tools/audit.js      optional semantic audit (needs an API key, see below)
tools/sim.js        balance harness (see balance.md)
```

`data.js` is the only file a writer needs to touch. Before writing anything
that touches Rank, Class, Aspect or Lineage, check it against
[canon.md](canon.md).

**Asset versions:** `index.html`'s `?v=` strings must match `sw.js`'s
`CACHE` version. Bump both whenever a CSS or JS file changes, or returning
players keep the old file. `/?repair` clears a stuck service worker.

## The rune HUD and day mode

The status HUD is styled as the Spell's status page ("a script only the
carrier can see") rather than a generic stat bar. Each attribute is a glyph
in a ring that glows the current rank's colour (`--rank`, set per rank in
`css/tokens.css`); Aspect gets its own glyph in the memory-gold accent
(`--accent-2`) since it is personal rather than rank-conferred. VIT/WIL/PER/
ESS and Aspect are always visible during play; CUN/REN/TET, the Aspect's and
Flaw's text sit behind the "More runes" expander (tapping the Aspect rune
opens it too). The same glyphs and rank badge are reused on the end screen
and in the Status sheet, so the visual language is one system, not three.

Day mode is an opt-in toggle (`#theme-toggle`), persisted to
`localStorage["fatelegacy.theme"]` and applied via `html[data-theme="light"]`.
It is applied inline in `index.html`'s `<head>`, before either stylesheet
paints, so switching to it never flashes the dark theme first. Several rank
colours (`sacred`, `divine`) are redeclared for light mode because the dark
theme's near-white values are unreadable on a pale background.

Display preferences live outside the save: `fatelegacy.theme`,
`fatelegacy.guideSeen` (first-launch guide) and `fatelegacy.statHints`
(choice hints, off by default).

**A layout trap worth knowing before touching the HUD:** the theme toggle is
`position:fixed` and the HUD is `position:sticky`, so they occupy the same
screen band for as long as the game screen is open. `.hud-row` carries a
permanent `padding-right` gutter to keep the age text clear of it; if you
resize or reposition either element, re-check that gutter at several scroll
depths.

End-screen achievements are read from `S.trials`, populated only by
`conquered:true` on a Nightmare's resolution node (`fn_resolve`, `sn_resolve`,
`tn_resolve`, and the Fourth's success branch), never at entry. A run that
dies inside a Nightmare must not be credited with conquering it;
`s.currentTrial` holds the attempt until (if) it resolves.

## Adding content

```js
{
  id:"unique_id",
  chapter:"awakened",          // which act; scripted nodes omit this
  weight:20, once:true, cooldown:60,   // cooldown in Sleeper-scale days
  days:30, fixedTime:true,     // time cost; fixedTime ignores rank scaling
  scripted:true,               // reachable only via another event's goto
  requires:{ stats:{ willpower:{min:12} }, flags:{ none:["shirked"] },
             // the other axes are testable too, and this is how an event
             // becomes visible only to certain runs
             aspect:["shadow"], flaw:["hunger"], lineage:["valor","song"],
             aspectRank:["Sacred","Divine"], soulClass:{ min:1 },
             org:{ min:1 },                 // size of your organization
             chapter:["ascended","transcendent"] },  // for an event with no `chapter`
  title:"...", text:"...",
  variants:["...", "..."],     // optional alternate texts for a recurring event;
                               // same choices, never the same one twice in a row
  choices:[{
    label:"...", hint:"Willpower",
    text:"...",               // outcome text for a choice with no check
    requires:{ aspect:["iron"] },   // aspect/flaw-gated choices are HIDDEN from
                                    // everyone else, not greyed out
    check:{ stat:"willpower", dc:14,
            dcScale:2,        // + this per rank      (recurring duties)
            dcEra:2,          // + this per 20 years  (the world worsening)
            dcSelf:true,      // dc becomes (your stat + dc): a personal trial
            fatal:3, fatalKind:"gate", fatalText:"...", fatalCause:"..." },
    success:{ text:"...", effects:{...} },
    failure:{ text:"...", effects:{...} },
    effects:{ stats:{essence:2}, flags:{add:["x"]}, rank:1, appraisal:2,
              kill:{rank:2, size:2}, memory:"id", echo:"id", awardFlaw:true,
              org:{ found:"company", kind:"order", grow:1, sworn:true },
              nightmare:"second",   // stages a random scenario from that tier
              conquered:true,       // ONLY on the resolution node's success
              solstice:true,
              chapter:"ascended", goto:"next_id", death:{text:"", kind:""} }
  }]
}
```

**Dangerous checks.** A check with `fatal` whose `fatalKind` is `gate`,
`nightmare`, `dream_realm`, `war`, `chain` or `murdered`, and which is not `dcSelf`, is a
fight: Weapon Memories add +1 each (cap 2), a bound Echo adds a d4, Armor and
Garment Memories take 2 Vitality each (cap 4) off the failure branch, and a
fatal miss destroys the strongest Echo instead of the player (never leaving
you below 1 Vitality). The numbers live in `Engine.AID`, which the UI reads. See
`checkAid` in `engine.js`; `tools/sim.js` prices all of it.

**A Nightmare ends in conquest or death.** No choice inside a Second+
Nightmare may send the player back out un-ascended. A failed decisive check
is a `death`, or a `goto` to a last attempt (see `qn1_2`).

`kill.rank` is an index into the same 0-6 ladder the player is on, which for
a Nightmare Creature reads Dormant 0, Awakened 1, Fallen 2, Corrupted 3,
Great 4, Cursed 5, Unholy 6.

Choice hints that start with a stat name ("Willpower. Years of it.") have the
name stripped in-game unless the player turns Stat hints on, so keep the
flavour after the full stop meaningful on its own.

**`once` on an offer is a trap.** If an event offers a "not yet" choice, it
must not be `once:true`, or "not yet" means never and the life is stranded at
its rank. Use a `cooldown` and a flag for the permanent refusal instead (see
`aw_second`).

Rules the validator enforces, because every one of them fails *silently*
in-game. Most were added after the thing they check actually happened:

1. **Every choice inside a `scripted` node must lead somewhere** (`goto`,
   `chapter`, `rank`, `nightmare` or `solstice`), on *both* the success and
   failure branch of a check (a failure branch may also end in `death`). A chain that breaks drops the player back into
   the ambient pool and quietly makes a whole act unreachable.
2. **Every chapter needs at least one repeatable event**, or its pool
   starves, unless every event in it always leads onward, which is what the
   two-event Aspirant act does.
3. **`goto` must live inside `effects`.** `success:{ goto:… }` beside
   `effects` parses fine and is silently ignored, because the engine only
   ever reads `branch.effects`. This caught three dead ends.
4. **A Flaw's `affinity` flags must be grantable before the Flaw is
   awarded.** `awardFlaw` fires once, on the First Nightmare's resolution, so
   a flag first granted in Act III can never steer the draw. This caught
   three flags that were granted nowhere at all, which made three Flaws
   unreachable by behaviour.
5. **No `fatal:1` on an integer stat that also has a `failure` branch.** A
   miss means margin ≤ -1, and so does the fatal threshold, so every miss
   kills and the failure prose can never be shown. This caught 39 dead
   failure branches. Vitality is exempt: `heal()` makes it fractional.
6. **No `dcSelf` + `fatal` on a recurring event.** `dcSelf` measures you
   against your own stat, so the death chance is fixed however strong you
   get; on a repeating event that is certain death over a long lifespan.
   This caught two events that were killing every Saint in the game before
   the Fourth Door could come up.
7. **Every choice cannot be gated behind `requires`**: a node where they all
   are leaves the player nothing to click.
8. **Catalogue integrity**: `memory`, `echo`, `lineage`, `aspect`, `flaw` and
   `aspectRank` ids must exist, Memories and Echoes must carry a `rank` on
   the Soul Rank ladder, and anything in a catalogue that no choice ever
   awards is reported as dead content.

Adding a new Nightmare or solstice region: write the nodes as `scripted:true`
events, then register the entry point in `NIGHTMARES` or `SOLSTICE`.

## Semantic audit (optional, authoring only)

`tools/audit.js` asks a small judgment model ([TypeSafe](https://docs.typesafe.ai)
Jev) whether a choice's *text* agrees with its *mechanics*: does the action
really lean on the stat its check declares, do the success/failure texts read
the right way round, and does a choice that grants a Flaw-affinity flag fit
that Flaw's theme. It is advisory (exit 0 unless `--strict`) and reads a key
from `TYPESAFE_API_KEY` or a git-ignored `.env`. The game itself never calls
it: the site stays static and needs no key.
