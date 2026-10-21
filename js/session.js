import { createTask } from "./scoring.js";
import { geographyFlow, coreLearning } from "../data/learning.js";
export const STORE = "ermittlungszentrale-session-v2";
export const LEGACY_STORE = "ermittlungszentrale-session-v1";
export function freshState() {
  return {
    version: 2, current: null, revealed: false, notice: null,
    cases: Object.fromEntries([1, 2, 3, 4, 5].map(id => [id, {
      phase: 0, selected: [], confirmedSelection: [], done: false,
      questionStep: 0, learningStep: 0, learningAnswers: {}, learningChecked: false,
    }])),
    tasks: Object.fromEntries(["title", "selection", "atlas", "city", "cocoa", "headline", "future"].map(id => [id, createTask()])),
  };
}
const object = value => value && typeof value === "object" && !Array.isArray(value);
const pictures = value => Array.isArray(value) && value.length <= 4 &&
  new Set(value).size === value.length && value.every(n => Number.isInteger(n) && n >= 1 && n <= 12);
export function loadState(storage) {
  try {
    const raw = storage?.getItem(STORE);
    if (!raw) {
      const legacy = storage?.getItem(LEGACY_STORE);
      if (legacy && JSON.parse(legacy)?.version === 1) {
        const state = freshState();
        state.notice = "Das Spiel wurde überarbeitet. Die alte digitale Sitzung passt nicht zu den neuen Aufgaben und wurde zurückgesetzt. Eure Papiernotizen bleiben die Sicherung.";
        return state;
      }
      return freshState();
    }
    const s = JSON.parse(raw), base = freshState();
    if (!s || s.version !== 2 || ![null, 1, 2, 3, 4, 5].includes(s.current)) return base;
    for (const key of Object.keys(base.tasks)) {
      const t = s.tasks?.[key];
      if (!object(t) || !Number.isInteger(t.hint) || t.hint < 0 || t.hint > 3 ||
        !Number.isInteger(t.raw) || t.raw < 0 || t.raw > 5 ||
        !Number.isInteger(t.points) || t.points < 0 || t.points > [5, 3, 2, 1][t.hint] ||
        ["scored", "fullCorrect", "resolved", "ack", "locked", "usedFallback", "resolutionTried", "clarification"].some(k => typeof t[k] !== "boolean") ||
        ["answers", "regularDraft", "fallbackDraft", "submittedAnswers", "resolutionAnswers"].some(k => !object(t[k])) ||
        !Array.isArray(t.criteria) || !Array.isArray(t.attempts) || t.attempts.length !== 4 ||
        t.attempts.some(n => !Number.isInteger(n) || n < 0) ||
        (t.scored && (t.raw < 1 || t.points !== Math.min(t.raw, [5, 3, 2, 1][t.hint]))) ||
        (!t.scored && (t.points !== 0 || t.fullCorrect || t.resolved || t.ack))) return base;
      base.tasks[key] = { ...base.tasks[key], ...t };
    }
    for (const id of [1, 2, 3, 4, 5]) {
      const c = s.cases?.[id];
      if (!object(c) || !Number.isInteger(c.phase) || c.phase < 0 || c.phase > {1:0,2:4,3:geographyFlow.length,4:3,5:3}[id] ||
        !pictures(c.selected) || !pictures(c.confirmedSelection) || typeof c.done !== "boolean" ||
        !Number.isInteger(c.questionStep) || c.questionStep < 0 || c.questionStep > 4 ||
        !Number.isInteger(c.learningStep) || c.learningStep < 0 || c.learningStep > 12 ||
        !object(c.learningAnswers) || typeof c.learningChecked !== "boolean") return base;
      const lesson = id === 3 && coreLearning[geographyFlow[c.phase]?.learning];
      if (c.learningStep > (lesson ? lesson.steps.length - 1 : 0)) return base;
      base.cases[id] = { ...base.cases[id], ...c };
    }
    base.current = s.current;
    base.revealed = Boolean(s.revealed);
    base.notice = typeof s.notice === "string" ? s.notice.slice(0, 500) : null;
    return base;
  } catch { return freshState(); }
}
export function saveState(state, storage) {
  try { storage?.setItem(STORE, JSON.stringify(state)); }
  catch { /* Optional storage: the current in-memory investigation keeps working. */ }
}
