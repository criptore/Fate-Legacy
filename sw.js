/* One version for the whole bundle. sw.js builds every precache URL out of V,
   so index.html's `?v=` strings MUST be this same number — otherwise the
   worker caches `data.js?v=<CACHE>` while the page requests `data.js?v=<other>`,
   the precache never matches a real request, and the only thing saving the
   offline case is the ignoreSearch fallback at the bottom of this file. */
const CACHE = "fatelegacy-v0.5.2", V = CACHE.split("-v")[1];
const CORE = [
  "./", "./index.html",
  `./css/tokens.css?v=${V}`, `./css/main.css?v=${V}`,
  `./js/hooks.js?v=${V}`, `./js/data.js?v=${V}`, `./js/save.js?v=${V}`,
  `./js/engine.js?v=${V}`, `./js/ui.js?v=${V}`,
];
/* Content packs and modules (js/packs/, js/modules/) are not listed here on
   purpose: each lives in its own pull request, and the fetch handler below
   caches them on first load, which is enough for offline play. */

async function net(req, tries = 3, opts) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(req, opts);
      if (r && r.ok) return r;
      if (r && r.status >= 400 && r.status < 500) return r;
    } catch (e) {}
    if (i < tries - 1) await new Promise(r => setTimeout(r, 600 * (i + 1)));
  }
  return null;
}

self.addEventListener("install", e => e.waitUntil((async () => {
  const c = await caches.open(CACHE);
  await Promise.all(CORE.map(async u => { const r = await net(u); if (r && r.ok) await c.put(u, r); }));
  await self.skipWaiting();
})()));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  if (req.mode === "navigate") {
    // Network-first for the shell, so a bad deploy can always be corrected.
    e.respondWith((async () => {
      const r = await net(req, 2, { cache: "reload" });
      if (r && r.ok) { (await caches.open(CACHE)).put(req, r.clone()); return r; }
      return (await caches.match("./index.html")) || (await caches.match("./")) || r ||
        new Response("Offline.", { status: 503 });
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const r = await net(req);
    if (r && r.ok) { (await caches.open(CACHE)).put(req, r.clone()); return r; }
    return (await caches.match(req, { ignoreSearch: true })) || r ||
      new Response("", { status: 504 });
  })());
});
