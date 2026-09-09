# Fate Legacy

**Play it: https://criptore.github.io/Fate-Legacy/**

A narrative life-sim in the world of the Nightmare Spell. One run is one whole
life — from the week the Spell infects you to whatever finally stops you.

## What this is

**Fate Legacy is an unofficial, non-commercial fan project** built for readers
of Shadow Slave. It is not written or endorsed by GuiltyThree, and it makes
no money — no ads, no donations, no premium tier, none planned, ever. It
exists for one reason: to turn the book's soul-rank ladder into a fun,
replayable interactive story, free for anyone to play. Source is open for
the same reason — if you enjoy the setting, take the code and run with it.

If GuiltyThree or a rights holder would rather this didn't exist in this
form, opening an issue is enough — it'll be taken down without argument.

**Found a bug, or have thoughts after a run?** The end screen has direct
links to file it on this repo's [Issues](../../issues) page — that's the
whole feedback loop, and it's how the project actually improves.

Static site: no framework, no build step, no backend. Open `index.html`, or
just use the play link above.

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

## The rune HUD and day mode

The status HUD is styled as the Spell's status page — "a script only the
carrier can see" — rather than a generic stat bar. Each attribute is a glyph
in a ring that glows the current rank's colour (`--rank`, set per rank in
`css/tokens.css`); Aspect gets its own glyph in the memory-gold accent
(`--accent-2`) since it is personal rather than rank-conferred. VIT/WIL/PER/
ESS and Aspect are always visible during play; CUN/REN/TET and the Flaw's
text sit behind the "More runes" expander so the always-on strip stays short
on a phone. The same glyphs and rank badge are reused on the end screen
(`#end-runes`, `.rank-badge-lg`) and in the deeper Status sheet, so the
visual language is one system, not three.

Day mode is an opt-in toggle (`#theme-toggle`, top-right, every screen),
persisted to `localStorage["fatelegacy.theme"]` and applied via
`html[data-theme="light"]` in `css/tokens.css`. It is applied inline in
`index.html`'s `<head>`, before either stylesheet paints, so switching to it
never flashes the dark theme first. Several rank colours (`sacred`, `divine`)
are redeclared for light mode rather than reused — the dark theme's
near-white values are unreadable once the background itself turns pale.

**A layout trap worth knowing before touching the HUD:** the theme toggle is
`position:fixed` and the HUD is `position:sticky`, so they occupy the same
screen band for as long as the game screen is open — not just at one scroll
position. `.hud-row` carries a permanent `padding-right` gutter to keep the
age text clear of it; if you resize or reposition either element, re-check
that gutter rather than assuming a screenshot at scroll-top proves it clear.

End-screen achievements are read from `S.trials`, populated only by
`conquered:true` on a Nightmare's resolution node (`fn_resolve`, `sn_resolve`,
`tn_resolve`, and the Fourth's success branch) — never at entry. A run that
dies inside a Nightmare must not be credited with conquering it; `s.currentTrial`
holds the attempt until (if) it resolves.

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
              nightmare:"second",   // stages a random scenario from that tier
              conquered:true,       // ONLY on the resolution node's success — see below
              solstice:true,
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

## Features

### Implemented

- **Full rank ladder, Aspirant to Divine.** Seven Soul Ranks, each with its
  own lifespan and time-scale (see the table above). Sacred and Divine are
  reachable but thin on content — see "Planned" below.
- **3 Origins** (Outskirts / Citadel Ward / Great Clan) — the difficulty
  setting. Each biases starting stats, which Aspects you're likely to draw,
  and how generously the Spell grades your First Nightmare.
- **Aspect + Flaw**, drawn at infection and granted after survival, per
  canon's actual sequencing (see the table above). Flaws are weighted by
  what you did in the Nightmare, not rolled blind.
- **Aspect grading** — the Spell appraises your First Nightmare and grades
  your Aspect Dormant / Awakened / Ascended / Transcendent accordingly.
  (Currently capped at Transcendent — see "Planned.")
- **7 hand-written Nightmare scenarios**, none of them from the novel, built
  inside its rules: 3 for the First Nightmare (Hollow Choir, Nine-Tenths
  Tide, Debt Collector), 2 for the Second (Lantern March, Iron Orchard), 1
  for the Third (Assembly of Mouths), 1 for the Fourth (Quiet Between
  Stars). A fresh one is drawn every run.
- **2 solstice regions** (Saltglass Flats, The Ledger) — new destinations
  built on the same pattern as the novel's Forgotten Shore / Dark City /
  Hollow Mountains.
- **Soul fragments**, following the wiki's actual formula
  (`2^(ranks above you) × soul cores`), and **Tether**, which thins with
  every rank the way the novel describes (Masters leave a tether, Saints
  are miniature Gateways, Supremes are barely tied to Earth at all).
- **Escalating world state** — Gate difficulty scales with both your rank
  and the years you've lived, so refusing to climb is not a survival
  strategy. This is what keeps "die of old age" at ~0.03% of runs instead
  of the ~86% it was in an earlier version (see `README` git history / the
  balance numbers above).
- **Memories** (permanent stat bonuses from key choices) and a curated
  **Achievements** list (22 entries) shown on the end screen, built from
  which Nightmares you actually conquered — not just entered.
- **Rune-styled HUD**: rank badge with a rank-tier ladder, always-visible
  glyphs for Vitality/Willpower/Perception/Essence and your Aspect, an
  expandable row for Cunning/Renown/Tether + your Flaw's text.
- **Day mode**, opt-in, persisted, applied before first paint.
- **End-of-run feedback links** — "Report a bug" / "Leave feedback" open a
  pre-filled GitHub issue with the run's details.
- **PWA / offline play** via the service worker, and a **save/continue**
  system in localStorage.
- **Balance tooling** — `tools/validate.js` (event-graph correctness) and
  `tools/sim.js` (thousands of simulated lives, `random` or `skilled`
  policy) — both described above.

### Planned / not yet implemented

- **Divine-grade Aspects.** Canon has a small, named category of
  "Divine Aspect Holders" (Sunny, Nephis, Mordret) whose Aspect outranks
  Transcendent — the game's grading currently hard-caps at Transcendent, so
  a Divine-grade Aspect cannot occur yet. This isn't a balance choice, it's
  a gap: the ceiling needs raising and something needs to gate how rare it
  is.
- **A real Class system**, separate from Soul Rank, matching what the wiki
  actually describes for Divine Aspect holders: "Humans only ever had one
  soul core" — normal Awakened are permanently capped at Beast Class no
  matter their Rank. A Divine Aspect is what lets someone form additional
  Soul Cores and climb Beast → Monster → Demon → Devil → Tyrant → Terror →
  Titan, gated by soul-fragment thresholds (1000 / 2000 / 3000 / 4000 /
  5000 / 6000+) exactly like a Nightmare Creature's own Class ladder. None
  of this exists in the engine yet — `s.fragments` already tracks the right
  number, but nothing reads it for Class purposes.
- **More Nightmare scenarios per tier**, and content for the Fifth and
  Sixth. Right now each tier has just enough scenarios to feel non-repeat
  early and gets thin fast (the Fourth has exactly one).
- **More solstice regions** beyond the two above.
- **Sacred and Divine content.** Reachable, but only a handful of events
  exist past Supreme — deliberately deferred until the mid-game tone was
  settled, which it now mostly is.
- **More Origins** beyond the current three (Outskirts / Citadel Ward /
  Great Clan) — other backgrounds a Sleeper could plausibly come from,
  each with its own stat bias and Aspect weighting.
- **Interactions with named characters from the novel** — conditional, not
  committed. Writing a scenario around an actual character (getting their
  voice right, not flattening them into a stat-check) is a different bar
  than the invented-original scenarios so far, and not one I trust my own
  judgment on yet. This waits on feedback on the writing already in the
  game before it's attempted at all.

If you want to take a swing at any of the above, see "Adding content" —
and the repo's README (this file) is the canon-vs-invented reference to
check against before writing anything that touches Rank, Class, or Aspect.
