/* SCORM 1.2: technical session only. Deliberately no CMI reads or writes. */
(() => {
  "use strict";
  const slot = "__ermittlungszentraleScorm12";
  if (window[slot]) return;
  const state = { phase: "new" };
  Object.defineProperty(window, slot, { value: state });
  let adapter;
  const isTrue = value => value === "true" || value === true;
  // Cross-origin access and malformed/cyclic frame trees must not stop the game.
  function findAPI(start) {
    const seen = new Set(), queue = [start];
    for (let count = 0; queue.length && count < 100; count++) {
      const current = queue.shift();
      if (!current || seen.has(current)) continue;
      seen.add(current);
      try {
        const api = current.API;
        if (typeof api?.LMSInitialize === "function" && typeof api?.LMSFinish === "function") return api;
      } catch { /* inaccessible context */ }
      for (const key of ["parent", "opener"]) {
        try { if (current[key] && !seen.has(current[key])) queue.push(current[key]); }
        catch { /* inaccessible context */ }
      }
    }
    return null;
  }
  function initialize() {
    if (!["new", "suspended"].includes(state.phase)) return;
    state.phase = "initializing";
    adapter = findAPI(window);
    if (!adapter) { state.phase = "unavailable"; return; }
    try { state.phase = isTrue(adapter.LMSInitialize("")) ? "active" : "failed"; }
    catch { state.phase = "failed"; }
  }
  function finish(persisted) {
    if (state.phase !== "active") return;
    state.phase = "finishing"; // Guard before calling into an external adapter.
    try { adapter.LMSFinish(""); }
    catch { /* Unloading is best effort; never interrupt the game. */ }
    state.phase = persisted ? "suspended" : "finished";
  }
  // No beforeunload: it can cancel navigation and harms the Safari back/forward cache.
  window.addEventListener("pagehide", event => finish(event.persisted));
  window.addEventListener("unload", () => finish(false));
  window.addEventListener("pageshow", event => {
    if (event.persisted && state.phase === "suspended") initialize();
  });
  initialize();
})();
