import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { photos, clues } from "../data/cases.js";
const root = new URL("../", import.meta.url);
const media = JSON.parse(await readFile(new URL("data/media.json", root)));
const required = [
  ...new Set([
    ...photos.map((p) => p.key),
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
    "attribution",
    "sha256",
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
  } catch {
    console.log(`DATEI FEHLT ${key}`);
    open++;
  }
}
const dictionary = JSON.parse(
  await readFile(new URL("data/dictionary.json", root)),
);
const review = JSON.parse(await readFile(new URL("data/review.json", root)));
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
