/* Versioned localStorage saves.
   Every write is wrapped: a full disk / private-mode browser must never
   take the game down. Saves are also flushed when the tab is hidden,
   which on mobile is how most people actually leave. */
const Save = (() => {
  const KEY = "fatelegacy.save";
  const VERSION = 2;   // state shape changed: origins, appraisal, tether, trials

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: VERSION, at: Date.now(), state }));
      return true;
    } catch (e) { return false; }
  }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const box = JSON.parse(raw);
      if (!box || box.v !== VERSION) return null;   // migrations go here
      return box;
    } catch (e) { return null; }
  }

  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  return { write, read, clear, VERSION };
})();
