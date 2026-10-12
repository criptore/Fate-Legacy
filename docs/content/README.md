# Content packs and modules

Since v0.5.0, new content does not go into `js/data.js`. Each scenario, region
or batch of events is a **content pack** in `js/packs/`, and each feature is a
**module** in `js/modules/`. Every pack or module documents itself in a file of
its own in this folder.

The point is reviewability: one scenario is one file and one pull request, and
two pull requests never edit the same lines, so they can be merged in any
order.

## Adding a content pack

1. Write `js/packs/<id>.js`:

   ```js
   Pack.add({
     id: "my-pack",
     events: [ /* same format as EVENTS in data.js */ ],
     nightmares: { second: [ { id:"sn_x", name:"...", entry:"snx_1" } ] },
     solstice: [ /* { id, name, entry, blurb } */ ],
     memories: { /* id: { name, type, rank, desc, stats } */ },
     echoes: { /* id: { name, rank, bound, desc, stats } */ },
     achievements: { /* flag: { name, desc } */ },
     origins: [ /* same format as ORIGINS */ ],
     patch() { /* optional: rewire an existing event, e.g. Pack.byId("sv_fifth") */ },
   });
   ```

2. In `index.html`, replace **your own** `<!-- slot:<id> -->` line with
   `<script src="js/packs/<id>.js?v=0.5.0"></script>`. Leave the blank lines
   around it. If there is no slot for you, take a `*-spare-*` one.
3. Write `docs/content/<id>.md`: what it adds, what is canon, what is ours.
4. Run `node tools/validate.js` and `node tools/sim.js` (they read
   `index.html`, so your pack is included automatically).

## Adding a module

Same steps, in `js/modules/` and the MODULES slots. A module talks to the
game only through `Hooks` (see the header of `js/hooks.js` for every hook
and where it fires). A module must not touch the DOM when it loads; only
inside a UI hook.

## Why not just edit data.js

Because every scenario PR would then append to the same array in the same
file, and the second one merged would conflict with the first.
