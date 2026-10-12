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
| Aspect rank uses the same seven-rung ladder as Soul Rank | Spell status page: "Aspect Rank … Same as Soul Rank"; "Aspect Rank is not fixed and can evolve depend[ing] on one's feat" |
| A Divine Aspect buys potential and costs Essence | Divine Aspect Bearer: "bestowed far greater potential… came at the cost of rapidly depleting essence", and "no limit to the capacity to store essence" |
| Lineage and Aspect are unrelated | Aspect: "Possessing a lineage of a certain divine creature doesn't mean their aspect has to be related to it as well" — Mordret had the War God's lineage and an Aspect of mirrors; Sunny the Weaver's with a Shadow God Aspect; Nephis the Sun God's with a Nephilim Aspect |
| Lineage is hereditary, and clan scions share one | Legacy Clans: "scions inherited the same lineage Attribute"; Valor, Song and the House of Night are the Great Clans, Immortal Flame a fallen one |
| Class is a second axis, counted in Soul Cores | Nightmare Creature: "Beast (1 core), Monster (2 cores), Demon (3 cores), Devil (4 cores), Tyrant (5 cores), Terror (6 cores), Titan (7 cores)" — and Ranks (Dormant…Unholy) are a separate ladder from Classes |
| Extra Soul Cores hurt, and are not what humans are for | Soul Core: "Human souls are not meant to have many cores or sustain them"; Divine Aspect Bearer: "the birth of a new core brings immense pain" |
| Memories have a type and sit on the rank ladder | Memory: "a magical item tied to the essence of a Dream Realm inhabitant", typed Armor / Charm / Utility / Garment / Weapon / Lineage / Shard |
| An Echo is not a kind of Memory | Echo: "a magical copy of a slain Nightmare Creature" that does "not possess a soul" and is "created from Soul Essence"; the status page lists Memories and Echoes as separate rewards |

**Ours, not canon** (the source never fixes numbers): every lifespan figure,
every `timeScale`, and all stat/DC values. Canon says only that Awakened "have
longer lifespans than humans, but the exact amount was unknown."

Also ours, and worth being explicit about because each one *looks* like it
might be canon:

- **How a Divine Aspect comes about.** Canon says it exists and names three
  holders. It never says how. The gate here — an extraordinary appraisal plus
  a rare draw, and deliberately *not* gated on lineage — is invented.
- **The four divine lineages** (the Salt Queen, the Long Sleeper, the
  Cartographer, the Unmade Smith) and how common a divine lineage is. The
  three canon ones belong to named characters, so this project does not offer
  them.
- **The soul-fragment thresholds for each Class.** Calibrated against
  `tools/sim.js`, not taken from anywhere. Fan summaries quote figures in the
  thousands; a whole skilled life in this game banks about 40 fragments, so
  those numbers would make every rung above Beast unreachable.
- **That an ordinary Awakened is capped at two Soul Cores.** Canon says human
  souls "are not meant to have many cores", and that *some* Awakened can form
  more than one. It never states a hard cap. Ours is an inference.
- **Echo ranks and the Essence an Echo ties up.** Canon gives Echoes no rank
  list and no carry limit.
- **One caution about a near-miss.** `core_shard` is themed on a canon *Soul
  Shard* — "a physical manifestation of a broken Soul Core" — and NOT on the
  wiki's "Shard Memory", which is unrelated Forgotten Shore material. An
  earlier draft of this repo conflated the two.

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

`tools/sim.js` plays thousands of lives and reports where they end. Three
policies, because they answer three different questions:

- `random` — a floor. Picks uniformly among available choices.
- `skilled` — plays to *survive*. Prices every check honestly, including the
  personal trials, and therefore declines most of them.
- `climber` — plays to *rank up*, and takes the trials anyway. This is the
  rank ceiling; `skilled` is not, because optimal survival means not climbing.

```
random  play, 8000 runs   furthest rank: Sleeper 30.2%  Awakened 61.3%
                                         Master 7.9%  Saint 0.7%
        cause: gate 62.5%  nightmare 22.5%  dream realm 8.7%  age 1.5%

skilled play, 8000 runs   furthest rank: Sleeper 1.6%  Awakened 10.3%
                                         Master 50.0%  Saint 38.2%
        cause: gate 47.2%  age 30.4%  wounds 10.0%  nightmare 3.6%

climber play, 8000 runs   furthest rank: Sleeper 1.7%  Awakened 11.0%
                                         Master 50.0%  Saint 31.1%
                                         Sovereign 5.7%  Sacred 0.5%
        cause: gate 47.0%  nightmare 29.3%  age 13.0%  chain 1.1%
```

Reaching Master by origin, random play: clan 11.0%, citadel 7.2%, outskirts 4.7%.

**On `skilled`'s 30% age deaths.** The two design rules above say almost
nobody dies of old age, and under `random` play that holds (1.5%). Under
`skilled` it does not, and the reason is worth stating plainly: once the
personal trials are priced correctly, conquering a Nightmare is a bad bet, so
a survival-maximising player stops climbing and ages out on purpose. That is
a real strategy the game permits, not a bug. `climber` is what the ladder
looks like when someone takes the bets anyway.

Three tooling bugs were fixed to get these numbers, and all three had been
quietly distorting every figure this section used to quote:

1. `score()` ignored `dcSelf`, so the oracle believed every personal trial
   was free and walked into all of them.
2. `score()` only read `c.effects`, but every Nightmare puts its rank-up in
   `success.effects` — so the oracle saw no reason to conquer anything and
   turned around at the Fourth Door every single time. Sovereign was
   reported as 0% for that reason alone.
3. The documented command `node tools/sim.js random 8000` passed `8000` as
   the *origin*, silently fell back to Outskirts, and ran the default 6000
   lives. The argument order is `policy origin n`.

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
tools/audit.js      optional semantic audit (needs an API key, see below)
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
  requires:{ stats:{ willpower:{min:12} }, flags:{ none:["shirked"] },
             // the other axes are testable too, and this is how an event
             // becomes visible only to certain runs
             aspect:["shadow"], flaw:["hunger"], lineage:["valor","song"],
             aspectRank:["Sacred","Divine"], soulClass:{ min:1 } },
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
              kill:{rank:2, size:2}, memory:"id", echo:"id", awardFlaw:true,
              nightmare:"second",   // stages a random scenario from that tier
              conquered:true,       // ONLY on the resolution node's success — see below
              solstice:true,
              chapter:"ascended", goto:"next_id", death:{text:"", kind:""} }
  }]
}
```

`kill.rank` is an index into the same 0-6 ladder the player is on, which for
a Nightmare Creature reads Dormant 0, Awakened 1, Fallen 2, Corrupted 3,
Great 4, Cursed 5, Unholy 6.

Rules the validator enforces, because every one of them fails *silently*
in-game. Most were added after the thing they check actually happened:

1. **Every choice inside a `scripted` node must lead somewhere** (`goto`,
   `chapter`, `rank`, `nightmare` or `solstice`) — on *both* the success and
   failure branch of a check. A chain that breaks drops the player back into
   the ambient pool and quietly makes a whole act unreachable.
2. **Every chapter needs at least one repeatable event**, or its pool
   starves — unless every event in it always leads onward, which is what the
   two-event Aspirant act does.
3. **`goto` must live inside `effects`.** `success:{ goto:… }` beside
   `effects` parses fine and is silently ignored, because the engine only
   ever reads `branch.effects`. This caught three dead ends.
4. **A Flaw's `affinity` flags must be grantable before the Flaw is
   awarded.** `awardFlaw` fires once, on the First Nightmare's resolution, so
   a flag first granted in Act III can never steer the draw no matter how
   many events grant it. This caught three flags that were granted nowhere at
   all, which made three Flaws unreachable by behaviour.
5. **No `fatal:1` on an integer stat that also has a `failure` branch.** A
   miss means margin ≤ -1, and so does the fatal threshold, so every miss
   kills and the failure prose can never be shown. This caught 39 dead
   failure branches. Vitality is exempt — `heal()` makes it fractional.
6. **No `dcSelf` + `fatal` on a recurring event.** `dcSelf` measures you
   against your own stat, so the death chance is fixed however strong you
   get; on a repeating event that is certain death over a long lifespan.
   This caught two events that were killing every Saint in the game before
   the Fourth Door could come up.
7. **Every choice cannot be gated behind `requires`** — a node where they all
   are leaves the player nothing to click.
8. **Catalogue integrity**: `memory`, `echo`, `lineage`, `aspect`, `flaw` and
   `aspectRank` ids must exist, Memories and Echoes must carry a `rank` on
   the Soul Rank ladder, and anything in a catalogue that no choice ever
   awards is reported as dead content.

Adding a new Nightmare or solstice region: write the nodes as `scripted:true`
events, then register the entry point in `NIGHTMARES` or `SOLSTICE`.

---

## Running

```
python3 -m http.server 8080     # then open http://localhost:8080
node tools/validate.js          # after any content change
node tools/sim.js random citadel 8000    # policy origin n
node tools/sim.js climber citadel 8000   # or: skilled
node tools/audit.js             # optional, see below
```

### Semantic audit (optional, authoring only)

`tools/audit.js` asks a small judgment model ([TypeSafe](https://docs.typesafe.ai)
Jev) whether a choice's *text* agrees with its *mechanics*: does the action
really lean on the stat its check declares, do the success/failure texts read
the right way round, and does a choice that grants a Flaw-affinity flag fit
that Flaw's theme. It is advisory (exit 0 unless `--strict`) and reads a key
from `TYPESAFE_API_KEY` or a git-ignored `.env`. The game itself never calls
it: the site stays static and needs no key.


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
- **Aspect rank**, on the canon seven-rung ladder rather than a private
  grade track: the Spell appraises your First Nightmare and ranks your Aspect
  Dormant → Awakened → Ascended → Transcendent → Supreme → Sacred → Divine.
  The top three need an extraordinary trial *and* a rare draw, and come out
  at roughly Supreme 1%, Sacred 0.2%, Divine 0.04% of survivors.
- **Divine Aspects**, with the price canon attaches to them: far greater
  potential, an Essence ceiling nobody else has, and an Essence that drains
  continuously whether you spend it or not. A Divine Aspect holder has to
  keep killing upward to stay topped up, which is also what kills them.
- **10 Lineages** — a third axis, independent of Aspect by canon. Four are
  divine. Where you were born decides which you are likely to carry; nothing
  about your lineage touches your Aspect, and nothing about your Aspect
  touches your lineage. That gives 14 Aspects × 14 Flaws × 10 Lineages =
  **1,960 base combinations**, before Aspect rank and Class multiply it.
- **Class, counted in Soul Cores** (Beast → Titan), separate from Soul Rank.
  Ordinary Awakened can form a second core at an extreme fragment count and
  pay badly for it; only a Divine Aspect climbs further.
- **Echoes** — copies of things you have killed, bound out of your own Soul
  Essence, which is exactly what they cost to keep. 10 of them, earned off
  specific kills.
- **16 Memories**, each with a canon type (Armor / Charm / Utility / Garment
  / Weapon / Lineage / Shard) and a rank on the Soul Rank ladder.
- **11 hand-written Nightmare scenarios**, none from the novel, all built
  inside its rules: 5 for the First Nightmare (Hollow Choir, Nine-Tenths
  Tide, Debt Collector, Quiet Ward, Long Leash), 3 for the Second (Lantern
  March, Iron Orchard, Court of Uncounted Debts), 2 for the Third (Assembly
  of Mouths, Quiet Continent), 1 for the Fourth (Quiet Between Stars). A
  fresh one is drawn every run.
- **4 solstice regions** (Saltglass Flats, The Ledger, Ruined Belfry,
  Harvest Vaults) — destinations built on the same pattern as the novel's
  Forgotten Shore / Dark City / Hollow Mountains.
- **Recurring Gate duty at every rank**, including Saint, Sovereign and
  Sacred. Canon makes the duty permanent and never lets it lapse; without
  the top three, a strong run simply aged out.
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
- **First-launch guide** — a five-page "How to play" (premise, rolls,
  runes, rank/lifespan/Aspect, saves and the end screen), shown once and
  reopenable from Home or the in-game toolbar. Rune text is generated from
  `STATS`, so it never drifts from the data.
- **End-of-run feedback links** — "Report a bug" / "Leave feedback" open a
  pre-filled GitHub issue with the run's details.
- **PWA / offline play** via the service worker, and a **save/continue**
  system in localStorage.
- **Balance tooling** — `tools/validate.js` (event-graph correctness) and
  `tools/sim.js` (thousands of simulated lives, `random` or `skilled`
  policy) — both described above.

### Planned / not yet implemented

- **More scenarios for the Fourth, and any for the Fifth and Sixth.** The
  Fourth still has exactly one, and the Fifth and Sixth are single events
  rather than scenarios.
- **Sacred and Divine content.** Both are reachable and both now have a
  recurring duty, but there is little else up there.
- **More Origins** beyond the current three (Outskirts / Citadel Ward /
  Great Clan) — other backgrounds a Sleeper could plausibly come from,
  each with its own stat bias and Aspect weighting.
- **Aspect Abilities as mechanics.** Canon gives each Aspect concrete
  abilities that arrive at each rank-up. Here an Aspect is a stat block and
  a line of flavour; the abilities are mentioned in prose and do nothing.
- **Echoes and Memories as things you use**, rather than permanent stat
  bonuses. Canon has them summoned and spent; here they are passive.
- **Interactions with named characters from the novel** — conditional, not
  committed. Writing a scenario around an actual character (getting their
  voice right, not flattening them into a stat-check) is a different bar
  than the invented-original scenarios so far, and not one I trust my own
  judgment on yet. This waits on feedback on the writing already in the
  game before it's attempted at all.

If you want to take a swing at any of the above, see "Adding content" —
and the repo's README (this file) is the canon-vs-invented reference to
check against before writing anything that touches Rank, Class, or Aspect.
