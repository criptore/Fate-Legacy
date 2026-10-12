# Balance, measured

## The two design rules

**1. Time is event-driven, not annual.** Each event declares a cost in days,
multiplied by the current rank's `timeScale`. An Aspirant's decisions are days
apart; a Sovereign's are centuries apart. This is what lets one run cover a
whole lifespan without ever playing a boring year.

**2. Almost nobody dies of old age.** Lifespan exists, and rising ranks buy
centuries of it, but it is not what kills you. You die in a Nightmare, at a
Gate, in the Dream Realm, or at the hands of another Awakened. Under random
play, about **1.5%** of lives end of the years (see below; an earlier version
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
random  play, 8000 runs   furthest rank: Sleeper 31.5%  Awakened 55.3%
                                         Master 11.6%  Saint 1.5%
        cause: gate 59.5%  nightmare 25.2%  dream realm 8.3%  age 1.5%

skilled play, 8000 runs   furthest rank: Sleeper 1.6%  Awakened 4.6%
                                         Master 53.5%  Saint 40.4%
        cause: gate 50.2%  age 25.2%  wounds 9.0%  nightmare 6.2%

climber play, 8000 runs   furthest rank: Sleeper 1.6%  Awakened 4.0%
                                         Master 53.8%  Saint 34.1%
                                         Sovereign 5.9%  Sacred 0.7%
        cause: gate 50.5%  nightmare 34.5%  age 4.0%  chain 1.0%
```

(Citadel origin, v0.3.4. Measured after the Second/Third Seed offers stopped
being one-shot. Before that, answering "Not yet" stranded a life at its rank
for good, which is most of why `skilled` used to end 10% of lives at
Awakened.)

Reaching Master or higher by origin, random play: clan 21.1%, citadel 13.2%,
outskirts 8.5%.

Aspect rank from the First Nightmare's appraisal comes out at roughly
Supreme 1%, Sacred 0.2% and Divine 0.04% of survivors.

**On `skilled`'s 25% age deaths.** Under `random` play the second design rule
holds (1.5%). Under `skilled` it does not, and the reason is worth stating
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
