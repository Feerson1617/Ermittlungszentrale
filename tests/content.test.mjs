import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { cases, photos, caseTasks, futureQuestions } from "../data/cases.js";
import { lookup, languages } from "../js/dictionary.js";
import { maps } from "../data/maps.js";
const root = new URL("../", import.meta.url);
const entries = JSON.parse(
  await readFile(new URL("data/dictionary.json", root)),
);
const rubrics = JSON.parse(await readFile(new URL("data/rubrics.json", root)));
test("Alle fünf Akten und sieben Wertungen sind vorhanden", () => {
  assert.equal(cases.length, 5);
  assert.equal(Object.values(caseTasks).flat().length, 7);
  assert.equal(futureQuestions.length, 4);
  for (const ids of Object.values(caseTasks))
    for (const id of ids) assert.ok(rubrics.tasks[id]);
});
test("Ein gemeinsamer Bildkatalog vermeidet abweichende Nummern", () => {
  assert.equal(photos.length, 12);
  assert.deepEqual(
    photos.map((p) => p.id),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  assert.equal(new Set(photos.map((p) => p.key)).size, 12);
  assert.deepEqual(rubrics.tasks.selection.editorial, [2, 5, 7, 11]);
});
test("197 eindeutige Wörter, sieben Sprachen, keine erfundenen Ersatzwerte", () => {
  assert.equal(entries.length, 197);
  assert.equal(new Set(entries.map((e) => e.de.toLowerCase())).size, 197);
  assert.equal(languages.length, 7);
  assert.equal(languages.find((l) => l[0] === "ar")[2], "rtl");
  assert.equal(languages.find((l) => l[0] === "ckb")[2], "rtl");
  for (const e of entries)
    for (const [lang] of languages)
      assert.ok(
        e[lang] === null || (typeof e[lang] === "string" && e[lang].trim()),
      );
});
for (const [lang, ,] of languages)
  test(`Wörterbuchsuche Karte in ${lang}`, () => {
    assert.equal(lookup(entries, "KARTE!", lang).status, "found");
    assert.ok(lookup(entries, "Karte", lang).translation);
  });
test("Wörterbuch korrigiert nur bekannte Varianten und schlägt unsichere vor", () => {
  assert.equal(lookup(entries, "HINWIES", "ru").entry.de, "Hinweis");
  for (const [form,word] of Object.entries({notiert:"notieren",beeinflusst:"beeinflussen",Ermittlungsteam:"Team",Bildbeleg:"Beweis",gemeinsam:"gemeinsam"})) assert.equal(lookup(entries, form, "pl").entry.de, word);
  assert.equal(lookup(entries, "Karten", "ru").translation, "карта");
  assert.equal(lookup(entries, "Krate", "ru").status, "missing");
  assert.equal(lookup(entries, "Krate", "ru").suggestions[0].de, "Karte");
  assert.equal(
    lookup(entries, "BeliebigesFantasiewort", "ar").translation,
    undefined,
  );
  assert.equal(lookup(entries, "Bevölkerungswachstum", "ku").status, "missing");
});
test("Geografische Karten stammen aus echten Polygonen", async () => {
  const geo = JSON.parse(
    await readFile(new URL("data/countries.geojson", root)),
  );
  assert.ok(geo.features.length > 170);
  for (const code of ["MAR", "NGA", "GHA"])
    assert.ok(geo.features.find((f) => f.properties.ADM0_A3 === code));
  for (const name of [
    "world",
    "reveal",
    "a",
    "b",
    "atlas",
    "city",
    "cocoa",
    "summary",
  ]) {
    assert.ok(maps[name].includes("<path"));
    assert.ok(
      (await stat(new URL(`assets/maps/${name}.svg`, root))).size > 1000,
    );
  }
  assert.ok(!maps.world.includes("Afrika"));
  assert.ok(maps.world.includes('viewBox="0 0 900 450"'), "Weltkarte umfasst alle Breitengrade einschließlich Antarktika");
  assert.equal((maps.world.match(/#d17852/g) || []).length, 0);
  assert.ok((maps.reveal.match(/#d17852/g) || []).length > 40);
});
test("Spiel enthält keine externen Laufzeitdienste oder Audioelemente", async () => {
  for (const file of [
    "index.html",
    "js/app.js",
    "js/scoring.js",
    "js/dictionary.js",
    "css/style.css",
    "data/learning.js",
  ]) {
    const text = await readFile(new URL(file, root), "utf8");
    assert.ok(
      !/<audio|new Audio|speechSynthesis|googleapis|fonts\.google/.test(
        text,
      ),
      file,
    );
    assert.ok(!/localStorage|document\.cookie|indexedDB/.test(text), file);
  }
});
test("Druckdateien sind vorhanden; Schülerbogen hat genau zwei Seitenabschnitte", async () => {
  const html = await readFile(
    new URL("materials/ermittlungsbogen.html", root),
    "utf8",
  );
  assert.equal((html.match(/class="sheet"/g) || []).length, 2);
  assert.doesNotMatch(html, /Afrika|Africa|Marokko|Nigeria|Ghana/i);
  assert.ok(html.includes("Gesamt: ______ / 30"));
  assert.ok(html.includes("Bonus-Akte 5: ______ / 5"));
  for (const file of ["ermittlungsbogen.pdf", "erwartungshorizont.pdf"])
    assert.ok((await stat(new URL("materials/" + file, root))).size > 5000);
});
