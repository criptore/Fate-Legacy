# Fate Legacy

A narrative life-sim in the world of the Nightmare Spell. One run is one whole
life — from the week the Spell infects you to whatever finally stops you.

Static site: no framework, no build step, no backend. Open `index.html`.

---

## The two design rules

**1. Time is event-driven, not annual.** Each event declares a cost in days,
multiplied by the current rank's `timeScale`. An Aspirant's decisions are days
apart; a Sovereign's are centuries apart. This is what lets one run cover a
whole lifespan without ever playing a boring year.

**2. Almost nobody dies of old age.** Lifespan exists, and rising ranks buy
centuries of it, but it is not what kills you. You die in a Nightmare, at a
Gate, in the Dream Realm, or at the hands of another Awakened. Measured over
8000 random-play runs: **0.03% die of the years.**

---

## What the canon dictates

Every balance decision below is anchored to the wiki or the novel. Where the
canon is silent, that is stated.

| Design choice | Canon it comes from |
|---|---|
| Aspirant → First Nightmare → **Sleeper** → winter solstice → Dream Realm → **Awakened** | Paths of Ascension: a Sleeper has Aspect and Flaw but "ha[s] not yet established a connection with the Dream Realm"; only on returning "for the first time" do they become Awakened |
| Aspect exists **before** the First Nightmare; the Flaw is granted **after** | Awakened: Aspirants "start off with a Dormant Rank Aspect without the Flaw or Aspect Ability… and [are] given Flaw in exchange for the power" |
| Flaws are weighted by what you did, never rolled blind | Flaw: "Flaws are never random; they are deeply connected to the individuals cursed by them" |
| Spell appraises the trial and grades your Aspect | Awakened: "The Aspect can rank up after the trial is over, depending on the appraisal the Spell gives" |
| Outskirts origin is the hard difficulty | ch. 1977: "Very few people from the outskirts survive the First Nightmare" |
| Clan origin is the easy one | Awakened: many "challeng[ed] the First Nightmare by simply requesting it from the great clans… Many even survived" |
| An outskirts survivor is graded more generously | Nightmare Spell: "The Spell's appraisals were tied to how far one deviated from their destined path" |
| A fresh First Nightmare scenario every run | Nightmares: "First Nightmares are unique because each of them is tailored individually" |
| First Nightmares contain exactly one creature, Beast or Monster, rarely a Demon | Nightmares: "only a single Creature can appear… never anything stronger than a devil" |
| Gate duty is mandatory, recurring and lethal | Awakened: "Every Awakened technically has a duty to respond when a Gate opens near their location" |
| Gates get worse the longer you live | Sovereigns: Obel's theory that Ascensions cause "the growing number and intensity of the Nightmare Gates" |
| Hollow and Lost are possible only below Master | Awakened: "Only Awakened below the Master rank can become Hollow or Lost" |
| Soul fragments = `2^(ranks above you) × soul cores` | Wiki FAQ, progression formula |
| Tether thins as you climb | Nightmare Spell: Masters leave a tether, Saints are miniature Gateways, Supremes are tied to the Dream Realm instead of Earth |
| An unaffiliated Master gets politically blocked | Sovereigns: "Suppressing the Transcendence of independent Awakened for decades" |
| Transcendence is reachable without a Third Nightmare | Hierarchy: "The Path of Ascension could reach Transcendence without conquering a Third Nightmare" |
| Saint is rare; Supreme is nearly unique | "just a few dozen Saints in the world"; Aster, Song and Vale were "the first humans to reach Supreme Rank" |
| Fifth Nightmare is near-certain death | Nightmares: "no Awakened from the current cycle of the Nightmare Spell had ever returned from it" |
| One attempt per Nightmare tier, ever | Nightmares: "Those who had conquered a Nightmare of a particular Rank could not enter any Seed of the same Rank again" |
| Wounds heal between events | Awakened: "Awakened did not usually have scars, since their bodies could recover better" |

**Ours, not canon** (the source never fixes numbers): every lifespan figure,
every `timeScale`, and all stat/DC values. Canon says only that Awakened "have
longer lifespans than humans, but the exact amount was unknown."

| Rank | Common name | Lifespan | timeScale |
|---|---|---|---|
| Dormant | Sleeper | 85 | ×1 |
| Awakened | Awakened | 140 | ×12 |
| Ascended | Master | 320 | ×34 |
| Transcendent | Saint | 900 | ×90 |
| Supreme | Sovereign | 6 000 | ×520 |
| Sacred | Sacred | 40 000 | ×1 200 |
| Divine | Divine | unbounded | ×6 000 |

---

## Balance, measured

`tools/sim.js` plays thousands of lives and reports where they end. Two
policies: `random` (a floor) and `skilled` (a near-perfect oracle — a ceiling
no human reaches).

```
random  play, 8000 runs   furthest rank: Sleeper 48.7%  Awakened 46.5%
                                         Master 4.6%  Saint 0.2%  Sovereign 0.01%
        cause: gate 45.5%  nightmare 37.6%  dream realm 11.7%  age 0.03%

skilled play, 8000 runs   furthest rank: Sleeper 10.9%  Awakened 20.7%
                                         Master 43.3%  Saint 22.4%  Sovereign 2.7%
        cause: gate 40.4%  nightmare 27.2%  age 14.3%  war 10.2%  chain 2.2%
```

Reaching Master by origin, random play: clan 8.7%, citadel 6.3%, outskirts 4.4%.

---

## Files

```
index.html          shell + recovery hatch (/?repair)
css/tokens.css      design tokens, per-rank accent colours
css/main.css        everything else
js/data.js          ALL content — ranks, origins, aspects, flaws, catalogues, events
js/engine.js        clock, eligibility, weighted draw, checks, effects
js/save.js          versioned localStorage
js/ui.js            DOM rendering
sw.js               PWA precache, network-first shell
tools/validate.js   event-graph checker — run after every content change
tools/sim.js        balance harness
```

`data.js` is the only file a writer needs to touch.

---

## Adding content

```js
{
  id:"unique_id",
  chapter:"awakened",          // which act; scripted nodes omit this
  weight:20, once:true, cooldown:60,   // cooldown in Sleeper-scale days
  days:30, fixedTime:true,     // time cost; fixedTime ignores rank scaling
  scripted:true,               // reachable only via another event's goto
  requires:{ stats:{ willpower:{min:12} }, flags:{ none:["shirked"] } },
  title:"...", text:"...",
  choices:[{
    label:"...", hint:"Willpower",
    check:{ stat:"willpower", dc:14,
            dcScale:2,        // + this per rank      (recurring duties)
            dcEra:2,          // + this per 20 years  (the world worsening)
            dcSelf:true,      // dc becomes (your stat + dc) — a personal trial
            fatal:3, fatalKind:"gate", fatalText:"...", fatalCause:"..." },
    success:{ text:"...", effects:{...} },
    failure:{ text:"...", effects:{...} },
    effects:{ stats:{essence:2}, flags:{add:["x"]}, rank:1, appraisal:2,
              kill:{rank:2, size:2}, memory:"id", awardFlaw:true,
              nightmare:"second", solstice:true,
              chapter:"ascended", goto:"next_id", death:{text:"", kind:""} }
  }]
}
```

Two rules that the validator enforces, because breaking either fails silently:

1. **Every choice inside a `scripted` node must lead somewhere** (`goto`,
   `chapter`, `rank`, `nightmare` or `solstice`) — on *both* the success and
   failure branch of a check. A chain that breaks drops the player back into
   the ambient pool and quietly makes a whole act unreachable.
2. **Every chapter needs at least one repeatable event**, or its pool starves.

Adding a new Nightmare or solstice region: write the nodes as `scripted:true`
events, then register the entry point in `NIGHTMARES` or `SOLSTICE`.

---

## Running

```
python3 -m http.server 8080     # then open http://localhost:8080
node tools/validate.js          # after any content change
node tools/sim.js random 8000   # or: skilled
```

## Status

Engine complete and validated. 56 events across seven acts, Aspirant to Sacred.
Sacred and Divine are reachable but thin — deliberately left until the
mid-game tone is settled. The work from here is writing.
