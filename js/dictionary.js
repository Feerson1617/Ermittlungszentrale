import { normalize } from "./scoring.js";
export const languages = [
  ["ru", "Russisch", "ltr"],
  ["uk", "Ukrainisch", "ltr"],
  ["pl", "Polnisch", "ltr"],
  ["tr", "Türkisch", "ltr"],
  ["ar", "Arabisch", "rtl"],
  ["ku", "Kurdisch (Kurmandschi)", "ltr"],
  ["ckb", "Kurdisch (Sorani)", "rtl"],
];
const aliases = {
  bilder: "bild",
  fotos: "foto",
  karten: "karte",
  lander: "land",
  landern: "land",
  stadte: "stadt",
  stadten: "stadt",
  worter: "wort",
  fragen: "frage",
  antworten: "antwort",
  hinweise: "hinweis",
  aufgaben: "aufgabe",
  losungen: "losung",
  punktezahl: "punkte",
  walder: "wald",
  menschen: "menschen",
  photo: "foto",
  hinwies: "hinweis",
  kontienent: "kontinent",
  kontinet: "kontinent",
  wustte: "wuste",
  bevolkerung: "bevolkerung",
  schulerinnen: "schuler",
  schulerin: "schuler",
  lehrer: "lehrkraft",
  lehrerin: "lehrkraft",
  lehrerinnen: "lehrkraft",
  notiert: "notieren",
  beeinflusst: "beeinflussen",
  ermittlungsteam: "team",
  bildbeleg: "beweis",
  bildbelege: "beweis",
  beleg: "beweis",
  belege: "beweis",
};
export function lookup(entries, input, language) {
  const text = normalize(input);
  if (!text) return { status: "empty", suggestions: [] };
  const word = aliases[text] || text;
  const match = entries.find((e) => normalize(e.de) === word);
  if (match)
    return {
      status: match[language] ? "found" : "missing",
      entry: match,
      translation: match[language] || "",
      suggestions: [],
    };
  // Suggestions never translate an uncertain match automatically.
  const suggestions = entries
    .filter(
      (e) => normalize(e.de).startsWith(word) || normalize(e.de).includes(word),
    )
    .slice(0, 5);
  if (!suggestions.length && word.length >= 4) {
    const signature = (s) => [...s].sort().join("");
    suggestions.push(
      ...entries
        .filter((e) => signature(normalize(e.de)) === signature(word))
        .slice(0, 4),
    );
  }
  return { status: "missing", suggestions };
}
