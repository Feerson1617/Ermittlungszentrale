import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  normalize,
  evaluateName,
  evaluateScope,
  evaluateDiversity,
  evaluate,
  createTask,
  openHint,
  submitTask,
} from "../js/scoring.js";
import { freshState, loadState, saveState, STORE } from "../js/session.js";
const r = JSON.parse(
  await readFile(new URL("../data/rubrics.json", import.meta.url)),
);
const answers = {
  title: { name: "Afrika" },
  selection: { scope: "einige", diversity: "nein", missing: [4, 6] },
  atlas: { name: "Marokko" },
  city: { name: "Nigeria" },
  cocoa: { name: "Ghana" },
  headline: { headline: "b" },
  future: { matches: ["0", "1", "2", "3"] },
};
const wrong = {
  title: { name: "Amerika" },
  selection: { scope: "alle", diversity: "ja", missing: [1, 2] },
  atlas: { name: "Nigeria" },
  city: { name: "Niger" },
  cocoa: { name: "Kenia" },
  headline: { headline: "a" },
  future: { matches: ["1", "2", "3", "0"] },
};
for (const word of [
  "Afrika",
  "afrika",
  "AFRIKA",
  "Affrika",
  "Africka",
  "Afirka",
  "Afrka",
  "Africa",
  "  Afrika ! ",
  "AＦＲＩＫＡ",
  "Der Kontinent ist Afrika.",
  "– Afrika",
  "Unsere Antwort ist Afrika",
])
  test(`Akte 001 akzeptiert: ${word}`, () =>
    assert.equal(evaluateName(word, r.tasks.title).raw, 5));
for (const word of [
  "Amerika",
  "America",
  "Südamerika",
  "Nordamerika",
  "Asien",
  "Antarktis",
  "Südafrika",
  "Europa",
  "Spanien",
  "nicht Afrika",
  "Afrika ist nicht die Lösung",
])
  test(`Akte 001 lehnt fachlich ab: ${word}`, () =>
    assert.equal(evaluateName(word, r.tasks.title).status, "wrong"));
for (const word of [
  "Afrika oder Amerika",
  "Afrika und Amerika",
  "vielleicht Afrika",
  "Afri?",
  "???",
])
  test(`Akte 001 klärt ohne Punkte: ${word}`, () => {
    const x = evaluateName(word, r.tasks.title);
    assert.equal(x.status, word === "???" ? "empty" : "unclear");
    assert.equal(x.raw, 0);
  });
for (const word of [
  "einige",
  "wenige",
  "nur paar",
  "nicht alle",
  "nur vier",
  "teil",
  "nur manche",
  "einige orte",
  "Die vier Fotos zeigen nur einige Orte.",
  "Sie zeigen einen Teil",
  "EINIGE!",
  "einiege",
  "eingie",
  "nur 4",
])
  test(`Ausschnitt: ${word}`, () => assert.equal(evaluateScope(word).raw, 2));
for (const word of [
  "alle",
  "alles",
  "ganz Afrika",
  "nicht einige",
  "alle Orte",
])
  test(`Kein Ausschnitt: ${word}`, () =>
    assert.equal(evaluateScope(word).raw, 0));
for (const word of [
  "einige und alle",
  "alle aber nur manche",
  "vielleicht",
  "Teile oder alles",
])
  test(`Widerspruch beim Ausschnitt: ${word}`, () =>
    assert.equal(evaluateScope(word).status, "unclear"));
test("Verneinungen ändern fachliche Bedeutung", () => {
  for (const s of ["Nicht überall gleich", "Afrika unterschiedlich"])
    assert.equal(evaluateDiversity(s).raw, 1);
  for (const s of ["Überall gleich", "Afrika nicht unterschiedlich"])
    assert.equal(evaluateDiversity(s).status, "wrong");
  assert.equal(
    evaluateDiversity("gleich und unterschiedlich").status,
    "unclear",
  );
});
test("Normalisierung verändert keine fachlichen Wörter", () => {
  assert.equal(normalize("  ÄQUATOR!  "), "aquator");
  assert.equal(normalize("Straße"), "strasse");
  assert.notEqual(normalize("Amerika"), normalize("Afrika"));
});
for (const [id, rubric] of Object.entries(r.tasks)) {
  test(`${id}: vollständige Lösung und leere Antwort`, () => {
    assert.equal(evaluate(rubric, answers[id]).raw, 5);
    assert.equal(evaluate(rubric, {}).status, "empty");
    assert.equal(evaluate(rubric, wrong[id]).status, "wrong");
  });
  for (let level = 0; level < 3; level++)
    test(`${id}: genau ein falscher Versuch auf Stufe ${level}`, () => {
      const t = createTask();
      for (let h = 0; h < level; h++) openHint(t);
      submitTask(t, rubric, wrong[id]);
      assert.equal(t.locked, true);
      assert.equal(t.attempts[level], 1);
      assert.equal(submitTask(t, rubric, answers[id]).status, "locked");
      assert.equal(t.complete, false);
      assert.equal(t.points, 0);
      assert.equal(t.attempts[level], 1);
      openHint(t);
      assert.equal(t.locked, false);
      assert.equal(t.hint, level + 1);
    });
  for (let level = 0; level < 3; level++)
    test(`${id}: richtige Lösung auf Stufe ${level} → ${r.limits[level]}`, () => {
      const t = createTask();
      for (let h = 0; h < level; h++) openHint(t);
      submitTask(t, rubric, answers[id]);
      assert.equal(t.points, r.limits[level]);
      assert.equal(t.complete, true);
      assert.equal(openHint(t), false);
      assert.equal(submitTask(t, rubric, wrong[id]).status, "complete");
      assert.equal(t.points, r.limits[level]);
    });
  test(`${id}: dritte Hilfe eröffnet unbeschränktes, echtes Abschlussrätsel`, () => {
    const t = createTask();
    for (let h = 0; h < 3; h++) {
      openHint(t);
      assert.equal(t.points, 0);
      assert.equal(t.complete, false);
    }
    for (let i = 0; i < 7; i++) {
      submitTask(t, rubric, { fallback: "b" });
      assert.equal(t.locked, false);
      assert.equal(t.points, 0);
    }
    assert.equal(t.attempts[3], 7);
    submitTask(t, rubric, { fallback: "a" });
    assert.equal(t.points, 1);
    assert.equal(t.complete, true);
    assert.equal(t.ack, false);
  });
  test(`${id}: Abschlussauswahl ist vor Hinweis 3 unzulässig`, () => {
    const t = createTask();
    assert.equal(submitTask(t, rubric, { fallback: "a" }).status, "invalid");
    assert.equal(t.points, 0);
  });
}
for (const [key, variants, negatives] of [
  [
    "atlas",
    ["Maroko", "Marocko", "Morroco", "Marokko ist das Land"],
    ["Nigeria", "Kenia"],
  ],
  [
    "city",
    ["Nigerai", "Nigeira", "Nigera", "Das Land ist Nigeria"],
    ["Niger", "Guinea"],
  ],
  [
    "cocoa",
    ["Gana", "Gahna", "Ghanna", "Das Land ist Ghana"],
    ["Guinea", "Gambia"],
  ],
]) {
  for (const word of variants)
    test(`${key}: Schreibweise ${word}`, () =>
      assert.equal(evaluateName(word, r.tasks[key]).raw, 5));
  for (const word of negatives)
    test(`${key}: Ähnlich, aber falsch ${word}`, () =>
      assert.equal(evaluateName(word, r.tasks[key]).status, "wrong"));
}
test("Unklare Bedeutung verbraucht keinen Versuch und zeigt keine Teilpunkte", () => {
  const t = createTask();
  assert.equal(
    submitTask(t, r.tasks.selection, {
      scope: "einige und alle",
      diversity: "nein",
      missing: [4, 6],
    }).status,
    "unclear",
  );
  assert.equal(t.complete, false);
  assert.equal(t.points, 0);
  assert.equal(t.attempts[0], 0);
  assert.deepEqual(t.criteria, []);
});
test("Ein erfülltes Teilkriterium bleibt erhalten", () => {
  const t = createTask();
  submitTask(t, r.tasks.selection, {
    scope: "wenige",
    diversity: "ja",
    missing: [1, 2],
  });
  assert.equal(t.points, 2);
  assert.deepEqual(t.criteria, [2, 0, 0, 0]);
  assert.equal(t.complete, true);
});
test("Jedes unabhängige Foto zählt, andere Fehler nehmen es nicht weg", () => {
  const t = createTask();
  submitTask(t, r.tasks.selection, {
    scope: "alle",
    diversity: "ja",
    missing: [4, 1],
  });
  assert.equal(t.points, 1);
  assert.equal(t.complete, true);
});
test("Teilpunkte und Hinweise werden kombiniert", () => {
  const t = createTask();
  openHint(t);
  openHint(t);
  submitTask(t, r.tasks.selection, {
    scope: "nur paar",
    diversity: "nein",
    missing: [4, 1],
  });
  assert.equal(t.raw, 4);
  assert.equal(t.points, 2);
});
test("Doppelte, unbekannte oder unvollständige Bilder werden nicht gewertet", () => {
  for (const missing of [[4, 4], [1], [11, 12], ["4", "6"]]) {
    const t = createTask();
    assert.equal(
      submitTask(t, r.tasks.selection, {
        scope: "einige",
        diversity: "nein",
        missing,
      }).status,
      "empty",
    );
    assert.equal(t.attempts[0], 0);
  }
});
for (const [matches, points] of [
  [["0", "1", "2", "3"], 5],
  [["0", "1", "2", "0"], 3],
  [["0", "1", "0", "0"], 2],
  [["0", "0", "0", "0"], 1],
  [["1", "2", "3", "0"], 0],
])
  test(`Bonus: ${matches} → ${points} Rohpunkte`, () =>
    assert.equal(evaluate(r.tasks.future, { matches }).raw, points));
test("Haupt- und Bonuswertung sind getrennt", () => {
  assert.equal(
    Object.values(r.tasks)
      .filter((t) => t.case !== 5)
      .reduce((n, t) => n + t.max, 0),
    30,
  );
  assert.equal(r.tasks.future.max, 5);
});
test("Sitzung ist ohne Browser-Persistenz vollständig benutzbar", () => {
  const storage = {
    getItem() {
      throw new Error("disabled");
    },
    setItem() {
      throw new Error("disabled");
    },
  };
  const s = loadState(storage);
  s.current = 1;
  submitTask(s.tasks.title, r.tasks.title, answers.title);
  assert.doesNotThrow(() => saveState(s, storage));
  assert.equal(s.tasks.title.points, 5);
});
test("Sitzung kann wiederhergestellt werden", () => {
  let json;
  const storage = {
    getItem: (k) => (k === STORE ? json : null),
    setItem: (_k, v) => (json = v),
  };
  const s = freshState();
  s.current = 3;
  openHint(s.tasks.atlas);
  s.tasks.atlas.answers.name = "Maroko";
  saveState(s, storage);
  assert.deepEqual(loadState(storage), s);
});
test("Beschädigte Sitzung wird sicher zurückgesetzt", () => {
  for (const input of [
    "{bad",
    "null",
    JSON.stringify({ version: 5 }),
    JSON.stringify({ ...freshState(), current: 9 }),
  ])
    assert.deepEqual(loadState({ getItem: () => input }), freshState());
  const corrupt = freshState();
  corrupt.tasks.title.answers = "bad";
  assert.deepEqual(
    loadState({ getItem: () => JSON.stringify(corrupt) }),
    freshState(),
  );
});
