import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { lookup, languages } from "../js/dictionary.js";
import { canonicalExcerpt, digest, dictionaryIntegrity } from "../scripts/dictionary-integrity.mjs";
const root = new URL("../", import.meta.url);
const { dictionary, evidence, problems } = await dictionaryIntegrity(root);
test("Wörterbuch und Belegauszüge sind vollständig zugeordnet und unverändert", () => {
  assert.deepEqual(problems, []);
  assert.equal(evidence.entries.length, 187);
  assert.equal(evidence.nativeReview, false);
  for (const word of dictionary) {
    const e = evidence.entries.find(e => e.de === word.de);
    for (const lang of ["ru", "uk", "pl", "tr", "ar"])
      assert.match(e.plausibility[lang], /muttersprachliche Prüfung offen/);
  }
});
for (const [lang] of languages) test(`Wörterbuch ${lang}: plausible Schrift und kein ungeprüfter Ersatz für Lücken`, () => {
  for (const word of dictionary) {
    const result = lookup(dictionary, word.de, lang);
    if (word[lang] === null) {
      assert.equal(result.status, "missing");
      assert.equal(result.translation, "");
      continue;
    }
    assert.equal(result.status, "found", word.de);
    assert.equal(result.translation, word[lang]);
    assert.equal(word[lang], word[lang].normalize("NFC"));
    if (["ar", "ckb"].includes(lang)) {
      assert.match(word[lang], /\p{Script=Arabic}/u);
      assert.doesNotMatch(word[lang], /[a-zA-Z]/);
    } else if (["ru", "uk"].includes(lang)) {
      assert.match(word[lang], /\p{Script=Cyrillic}/u);
    } else assert.doesNotMatch(word[lang], /\p{Script=Arabic}/u);
  }
});
test("Neue kurdische Übersetzungen sind an passende Varietät und Quelle gebunden", () => {
  let added = 0;
  for (const e of evidence.entries) for (const lang of ["ku", "ckb"]) {
    const item = e.translations[lang];
    if (Object.hasOwn(item, "previous") && item.previous === null && item.translation) added++;
    if (!item.translation) {
      assert.equal(item.status, "offen-kein-passender-Beleg");
      continue;
    }
    assert.equal(item.status, "belegt-redaktionell");
    assert.ok(item.references.length);
    for (const ref of item.references) {
      assert.ok(evidence.sources[ref.source]);
      assert.equal(digest(canonicalExcerpt(ref.quote)), ref.excerptSha256);
      if (ref.source === "wiktionary-mirror") assert.equal(ref.dialect, lang);
      if (ref.source === "en-wiktionary") assert.match(ref.url, /oldid=\d+/);
      if (ref.url.includes("github.com")) assert.match(ref.url, /\/[0-9a-f]{40}\//);
    }
  }
  assert.equal(added, 248);
});
test("Fachlich andere Bedeutungen bleiben getrennt und unsichere Fachwörter offen", () => {
  for (const word of ["Land", "Karte", "See", "Strom", "Fall", "Bogen", "nachhaltig", "zuordnen"])
    assert.ok(dictionary.find(e => e.de === word).context);
  assert.equal(lookup(dictionary, "Strom", "ku").translation, "elektrîk");
  assert.equal(lookup(dictionary, "Strom", "ckb").translation, "کارەبا");
  assert.equal(lookup(dictionary, "See", "ku").translation, "gol");
  for (const word of ["Regenwald", "Bevölkerungswachstum", "Solaranlage", "nachhaltig", "zuordnen"])
    for (const lang of ["ku", "ckb"]) assert.equal(lookup(dictionary, word, lang).status, "missing");
  assert.equal(lookup(dictionary, "BeliebigesFantasiewort", "ckb").translation, undefined);
});
test("Plausibilitätsprüfung wird getrennt von einer muttersprachlichen Abnahme geführt", async () => {
  const review = JSON.parse(await readFile(new URL("data/review.json", root)));
  assert.match(review.dictionaryEditorial.kind, /keine muttersprachliche/);
  assert.equal(review.dictionaryEditorial.dictionarySha256, evidence.dictionarySha256);
  for (const [lang] of languages) assert.equal(review.dictionaryEditorial.languages[lang], true);
  // A future real sign-off can change dictionary[lang]; editorial flags never do so.
  assert.equal(Object.keys(review.dictionary).length, 7);
});
