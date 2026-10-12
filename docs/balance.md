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
random  play, 8000 runs   furthest rank: Sleeper 31.8%  Awakened 53.0%
                                         Master 13.0%  Saint 2.1%  Sovereign 0.1%
        cause: gate 59.1%  nightmare 26.7%  dream realm 7.2%  age 1.8%

skilled play, 8000 runs   furthest rank: Sleeper 1.7%  Awakened 3.9%
                                         Master 52.8%  Saint 41.6%
        cause: gate 49.0%  age 25.6%  wounds 8.8%  nightmare 6.9%

climber play, 8000 runs   furthest rank: Sleeper 1.4%  Awakened 3.4%
                                         Master 52.4%  Saint 35.0%
                                         Sovereign 7.1%  Sacred 0.6%
        cause: gate 48.8%  nightmare 35.7%  age 4.6%  chain 1.4%
```

(Citadel origin, v0.3.5: Aspect stat bonuses applied on Awakening, and the
Second/Third Seed offers no longer one-shot. Before that, answering "Not
yet" stranded a life at its rank for good, which is most of why `skilled` used to end 10% of lives at
Awakened.)

Reaching Master or higher by origin, random play: clan 24.3%, citadel 15.2%,
outskirts 11.3%.

Aspect rank from the First Nightmare's appraisal comes out at roughly
Supreme 1%, Sacred 0.2% and Divine 0.04% of survivors.

**On `skilled`'s 25% age deaths.** Under `random` play the second design rule
holds (about 2%). Under `skilled` it does not, and the reason is worth stating
plainly: once the personal trials are priced correctly, conquering a
Nightmare is a bad bet, so a survival-maximising player stops climbing and
ages out on purpose. That is a real strategy the game permits, not a bug.
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
