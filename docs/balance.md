# Balance, measured

## The two design rules

**1. Time is event-driven, not annual.** Each event declares a cost in days,
multiplied by the current rank's `timeScale`. An Aspirant's decisions are days
apart; a Sovereign's are centuries apart. This is what lets one run cover a
whole lifespan without ever playing a boring year.

**2. Almost nobody dies of old age.** Lifespan exists, and rising ranks buy
centuries of it, but it is not what kills you. You die in a Nightmare, at a
Gate, in the Dream Realm, or at the hands of another Awakened. Under random
play, about **2%** of lives end of the years (see below; an earlier version
had ~86%).

## Simulation

`tools/sim.js` plays thousands of lives and reports where they end. Three
policies, because they answer three different questions:

- `random`: a floor. Picks uniformly among available choices.
- `skilled`: plays to *survive*. Prices every check honestly, including the
  personal trials, and therefore declines most of them.
- `climber`: plays to *rank up*, and takes the trials anyway. This is the
  rank ceiling; `skilled` is not, because optimal survival means not climbing.

```
random  play, 8000 runs   furthest rank: Sleeper 28.5%  Awakened 49.0%
                                         Master 19.0%  Saint 3.3%  Sovereign 0.2%
        cause: gate 48.8%  nightmare 30.4%  age 7.3%  murdered 5.1%  dream realm 3.8%

skilled play, 8000 runs   furthest rank: Sleeper 1.5%  Awakened 2.4%
                                         Master 72.0%  Saint 19.2%  Sovereign 4.9%
        cause: gate 50.9%  nightmare 29.5%  wounds 9.2%  age 5.4%  murdered 2.8%

climber play, 8000 runs   furthest rank: Sleeper 1.7%  Awakened 2.5%
                                         Master 71.4%  Saint 19.7%
                                         Sovereign 4.1%  Sacred 0.5%
        cause: gate 50.5%  nightmare 33.2%  wounds 9.2%  murdered 3.3%  age 2.4%
```

(Citadel origin, v0.4.0.) What changed since v0.3.5, and why the numbers
moved:

- **Saint is rarer (issue #7).** `skilled` reached Saint in 41.6% of lives;
  it is now 19.2%, inside the 15–20% target. Three causes: the Third
  Nightmares no longer let you walk out, and failing their decisive check is
  death rather than Sainthood (before, a failed final check still sent you
  to `tn_resolve`); the Quiet Continent's decisive checks are personal
  trials; and a Third Seed now needs Renown 16 and comes round more slowly.
  Canon: "hundreds attempted the Third Nightmare in recent decades, but only
  a few dozen humans returned".
- **`skilled` stops ageing out.** Its age deaths fell from 25.6% to 5.4%,
  because the Third Seed is no longer a free pass, so a survival-maximising
  player meets it less often, and the one that does is no longer offered a
  safe exit from inside it.
- **Random play lives a little longer** (age 1.8% → 7.3%). That is the
  Echoes: an Echo now dies in your place on a fatal miss (issue #9), and a
  random player who refuses every Seed now survives some Gates they used to
  die at. Still "almost nobody", but worth watching.
- **Sovereign is a little more common for `skilled`** (0% → 4.9%), because
  a failed crossing of the Fourth Nightmare now leads to a last attempt
  instead of a safe trip home that ended the climb for good.

Reaching Master or higher by origin, random play: clan 31.4%, citadel 22.5%,
outskirts 16.6%.

## Divine lineages

Chance of being born with each, 200 000 draws per origin:

```
            War    Beast  Storm  Sun    Heart  Shadow   any divine at birth
outskirts   0.20%  0.19%  0.20%  0.15%  0.08%  0.11%    0.9%
citadel     1.02%  0.95%  0.99%  0.20%  0.16%  0.11%    3.4%
clan       19.8%  20.0%  17.7%   0.59%  0.31%  0.13%   58.5%
```

The Weaver is never inherited. It comes only from `ev_weave`, which needs a
lineage to devour (so "No Lineage" can never see it) and is the
lowest-weight event in the game. 100 000 random-play lives per origin:

```
            event appears   Weaver gained (random play)
outskirts   0.016%          0.007%
citadel     0.044%          0.024%
clan        0.103%          0.062%
```

A player who always accepts it gets the Weaver about as often as the event
appears (refusing can fail, and then it takes you anyway). `skilled` and
`climber` refuse it, so `tools/sim.js` reports 0% for them. In every origin
the Weaver is rarer than the rarest birth lineage there.

Aspect rank from the First Nightmare's appraisal comes out at roughly
Supreme 1%, Sacred 0.2% and Divine 0.04% of survivors.

**On `skilled` and old age.** Until v0.3.5 `skilled` died of old age in a
quarter of lives: once the personal trials are priced correctly, conquering a
Nightmare is a bad bet, so a survival-maximising player stopped climbing and
aged out on purpose. Since v0.4.0 it is about 5%, for the reasons above.
`climber` is what the ladder looks like when someone takes the bets anyway.

## Tooling bugs already fixed

Three bugs in the simulator had been quietly distorting every figure this
section used to quote:

1. `score()` ignored `dcSelf`, so the oracle believed every personal trial
   was free and walked into all of them.
2. `score()` only read `c.effects`, but every Nightmare puts its rank-up in
   `success.effects`, so the oracle saw no reason to conquer anything and
   turned around at the Fourth Door every single time. Sovereign was
   reported as 0% for that reason alone.
3. The documented command `node tools/sim.js random 8000` passed `8000` as
   the *origin*, silently fell back to Outskirts, and ran the default 6000
   lives. The argument order is `policy origin n`.
