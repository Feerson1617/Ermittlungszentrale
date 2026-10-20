import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { photos, clues } from "../data/cases.js";
const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root));
const media = JSON.parse(await read("data/media.json"));
const required = [...photos.map((p) => p.key), "cocoa", ...clues.map((c) => c.key)];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("15 eigenständige lokale Beweisfotos mit eindeutigen Nachweisen", async () => {
  assert.equal(media.status, "complete");
  assert.deepEqual(Object.keys(media.images).sort(), [...required].sort());
  assert.equal(new Set(Object.values(media.images).map((i) => i.path)).size, 15);
  assert.equal(new Set(Object.values(media.images).map((i) => i.sha256)).size, 15);
  assert.equal((await readdir(new URL("assets/images/", root))).length, 15);
});

for (const key of required) test(`Foto ${key}: Datei, Ort, Lizenz und Originalrevision stimmen überein`, async () => {
  const i = media.images[key];
  assert.ok(i, key);
  assert.match(i.path, /^assets\/images\/\d{2}\.webp$/);
  assert.match(i.license, /^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/);
  assert.match(i.licenseUrl, /^https:\/\/creativecommons\.org\/licenses\/(?:by|by-sa)\/(?:2|3|4)\.0\/?$/);
  assert.ok(i.location && i.locationEvidence && i.author && i.attribution && i.modification);
  assert.match(i.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  const bytes = await read(i.path);
  assert.equal(bytes.subarray(0,4).toString(), "RIFF");
  assert.equal(bytes.subarray(8,12).toString(), "WEBP");
  assert.equal(sha256(bytes), i.sha256);
  assert.equal(bytes.length, i.bytes);
  assert.ok(i.bytes < 500 * 1024, "Einzelfoto bleibt unter 500 KiB");
  assert.ok(Math.max(i.width, i.height) === 1400 && Math.min(i.width, i.height) >= 600);
  const evidence = await read(i.evidence);
  assert.equal(sha256(evidence), i.evidenceSha256);
  const page = Object.values(JSON.parse(evidence).query.pages)[0];
  const original = page.imageinfo[0];
  assert.equal(page.title, `File:${i.sourceTitle}`);
  assert.equal(page.revisions[0].revid, i.sourceRevision);
  assert.equal(original.sha1, i.originalSha1);
  assert.equal(original.url.split("?")[0], i.original);
  assert.equal(original.extmetadata.LicenseShortName.value, i.license);
  assert.equal(original.extmetadata.LicenseUrl.value, i.licenseUrl);
  assert.ok(page.revisions[0].slots.main["*"].length > 100);
  const credits = (await read("bildnachweise.html")).toString();
  assert.ok(credits.includes(`id="${i.creditId}"`));
  assert.ok(credits.includes(i.licenseUrl));
  assert.ok(credits.includes(i.source));
});

test("Bildbudget und Quellenverzeichnis sind vollständig", async () => {
  assert.ok(Object.values(media.images).reduce((sum, i) => sum+i.bytes, 0) < 5*1024*1024);
  const docs = (await read("docs/bildquellen.md")).toString();
  for (const i of Object.values(media.images)) {
    assert.ok(docs.includes(i.sha256));
    assert.ok(docs.includes(i.evidenceSha256));
    assert.ok(docs.includes(i.locationEvidence));
  }
});
