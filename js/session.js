import { createTask } from "./scoring.js";
export const STORE = "ermittlungszentrale-session-v1";
export function freshState() {
  return {
    version: 1,
    current: null,
    revealed: false,
    cases: Object.fromEntries(
      [1, 2, 3, 4, 5].map((id) => [
        id,
        { phase: 0, selected: [], done: false },
      ]),
    ),
    tasks: Object.fromEntries(
      [
        "title",
        "selection",
        "atlas",
        "city",
        "cocoa",
        "headline",
        "future",
      ].map((id) => [id, createTask()]),
    ),
  };
}
export function loadState(storage) {
  try {
    const s = JSON.parse(storage?.getItem(STORE) || "null");
    if (!s || s.version !== 1 || ![null, 1, 2, 3, 4, 5].includes(s.current))
      return freshState();
    const base = freshState();
    for (const [key, t] of Object.entries(s.tasks || {})) {
      if (
        !(key in base.tasks) ||
        !t ||
        !Number.isInteger(t.hint) ||
        t.hint < 0 ||
        t.hint > 3 ||
        !Number.isInteger(t.points) ||
        t.points < 0 ||
        t.points > [5, 3, 2, 1][t.hint]
      )
        return freshState();
      if (
        !t.answers ||
        typeof t.answers !== "object" ||
        Array.isArray(t.answers) ||
        !Array.isArray(t.criteria)
      )
        return freshState();
      if (
        !Array.isArray(t.attempts) ||
        t.attempts.length !== 4 ||
        t.attempts.some((n) => !Number.isInteger(n) || n < 0)
      )
        return freshState();
      if (typeof t.complete !== "boolean" || typeof t.ack !== "boolean")
        return freshState();
      base.tasks[key] = { ...base.tasks[key], ...t };
    }
    for (const id of [1, 2, 3, 4, 5]) {
      const c = s.cases?.[id];
      if (
        !c ||
        !Number.isInteger(c.phase) ||
        c.phase < 0 ||
        c.phase > 6 ||
        !Array.isArray(c.selected) ||
        c.selected.some((n) => !Number.isInteger(n) || n < 1 || n > 10)
      )
        return freshState();
      base.cases[id] = { ...base.cases[id], ...c };
    }
    base.current = s.current;
    base.revealed = Boolean(s.revealed);
    return base;
  } catch {
    return freshState();
  }
}
export function saveState(state, storage) {
  try {
    storage?.setItem(STORE, JSON.stringify(state));
  } catch {
    /* Memory state remains fully usable. */
  }
}
