import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { photos, clues } from "../data/cases.js";
import { coreLearning, extraSpurs } from "../data/learning.js";
import { dictionaryIntegrity } from "./dictionary-integrity.mjs";
const root = new URL("../", import.meta.url);
const media = JSON.parse(await readFile(new URL("data/media.json", root)));
const required = [
  ...new Set([
    ...photos.map((p) => p.key),
    ...Object.values(coreLearning).flatMap(x => x.steps.flatMap(step => step.photos || [])),
    ...Object.values(extraSpurs).flatMap(x => x.photos || []),
    "cocoa",
    ...clues.map((c) => c.key),
  ]),
];
let open = 0;
for (const key of required) {
  const image = media.images[key];
  if (!image) {
    console.log(`OFFEN Foto: ${key}`);
    open++;
    continue;
  }
  if (!image.path?.startsWith("assets/images/") || image.path.includes("..")) {
    console.log(`UNGÜLTIGER PFAD ${key}`);
    open++;
    continue;
  }
  for (const field of [
    "description",
    "location",
    "author",
    "source",
    "license",
    "licenseUrl",
    "attribution",
    "sha256",
    "locationEvidence",
    "evidence",
    "evidenceSha256",
    "originalSha1",
    "sourceRevision",
  ])
    if (!image[field]) {
      console.log(`OFFEN ${key}: ${field}`);
      open++;
    }
  try {
    const content = await readFile(new URL(image.path, root));
    if (createHash("sha256").update(content).digest("hex") !== image.sha256) {
      console.log(`HASH STIMMT NICHT ${key}`);
      open++;
    }
    if (content.length !== image.bytes || content.length > 500 * 1024 ||
      content.subarray(8, 12).toString() !== "WEBP" ||
      Math.max(image.width, image.height) > 1400 || Math.min(image.width, image.height) < 600) {
      console.log(`BILDFORMAT/-BUDGET UNGÜLTIG ${key}`);
      open++;
    }
  } catch {
    console.log(`DATEI FEHLT ${key}`);
    open++;
  }
  try {
    if (!/^docs\/media\/[a-z]+\.json$/.test(image.evidence)) throw new Error();
    const evidence = await readFile(new URL(image.evidence, root));
    const page = Object.values(JSON.parse(evidence).query.pages)[0];
    const original = page.imageinfo[0];
    if (createHash("sha256").update(evidence).digest("hex") !== image.evidenceSha256 ||
      page.revisions[0].revid !== image.sourceRevision ||
      original.sha1 !== image.originalSha1 ||
      original.extmetadata.LicenseShortName.value !== image.license ||
      original.extmetadata.LicenseUrl.value !== image.licenseUrl) throw new Error();
  } catch {
    console.log(`QUELLEN-/LIZENZNACHWEIS UNGÜLTIG ${key}`);
    open++;
  }
}
if (Object.keys(media.images).length !== required.length ||
  new Set(Object.values(media.images).map(i => i.path)).size !== required.length) {
  console.log(`OFFEN: ${required.length} eindeutige lokale Fotodateien erforderlich`);
  open++;
}
const { dictionary, problems } = await dictionaryIntegrity(root);
for (const problem of problems) {
  console.log(`UNGÜLTIG: ${problem}`);
  open++;
}
const review = JSON.parse(await readFile(new URL("data/review.json", root)));
if (review.dictionaryEditorial?.dictionarySha256 !==
  createHash("sha256").update(await readFile(new URL("data/dictionary.json", root))).digest("hex")) {
  console.log("OFFEN: Redaktionelle Wörterbuchprüfung passt nicht zum aktuellen Inhalt");
  open++;
}
for (const lang of ["ru", "uk", "pl", "tr", "ar", "ku", "ckb"]) {
  const missing = dictionary.filter((e) => !e[lang]).length;
  if (missing) {
    console.log(`OFFEN Wörterbuch ${lang}: ${missing} fehlende Übersetzungen`);
    open++;
  }
  if (!review.dictionary[lang]) {
    console.log(`OFFEN muttersprachliche Prüfung: ${lang}`);
    open++;
  }
}
if (!review.safari) {
  console.log("OFFEN: Test auf einem echten Schul-iPad in Safari");
  open++;
}
for (const [key,label] of Object.entries({
  curriculumOriginals:"Originalabgleich von Curriculum/Fachanforderungen und aktueller Geltung",
  primarySourceOriginals:"Direkter Originalabgleich der im Auftrag benannten Sachquellen",
  printProof:"Reale beidseitige Druckprobe",
  classroomTrial:"Lerngruppenerprobung, Bearbeitungszeit und Lernwirkung",
  liveBrowser:"Browserabnahme der tatsächlich veröffentlichten Website",
})) if (!review.v2?.[key]) { console.log(`OFFEN: ${label}`); open++; }
if (media.status !== "complete") {
  console.log("OFFEN: Bildkatalog noch nicht als vollständig abgenommen");
  open++;
}
for (const name of ["ermittlungsbogen.pdf", "erwartungshorizont.pdf"])
  try {
    await stat(new URL("materials/" + name, root));
  } catch {
    console.log("FEHLT: " + name);
    open++;
  }
console.log(
  open
    ? `${open} offene Abnahmepunkte. Technische Tests separat ausführen.`
    : "Unterrichtsabnahme vollständig dokumentiert.",
);
process.exitCode = open ? 2 : 0;
