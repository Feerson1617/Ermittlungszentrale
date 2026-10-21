import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Match the documented, UTF-8 JSON encoding of the preserved source excerpts.
export function canonicalExcerpt(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalExcerpt).join(", ")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort()
    .map(key => `${JSON.stringify(key)}: ${canonicalExcerpt(value[key])}`).join(", ")}}`;
  return JSON.stringify(value);
}
export const digest = value => createHash("sha256").update(value).digest("hex");

export async function dictionaryIntegrity(root) {
  const bytes = await readFile(new URL("data/dictionary.json", root));
  const dictionary = JSON.parse(bytes);
  const evidence = JSON.parse(await readFile(new URL("data/dictionary-evidence.json", root)));
  const problems = [];
  if (digest(bytes) !== evidence.dictionarySha256) problems.push("Wörterbuchprüfung ist veraltet (SHA256)");
  if (evidence.entries.length !== dictionary.length) problems.push("Anzahl der Wörterbuchnachweise stimmt nicht");
  for (const word of dictionary) {
    const record = evidence.entries.find(e => e.de === word.de);
    if (!record) { problems.push(`Wörterbuchnachweis fehlt: ${word.de}`); continue; }
    // All Kurdish values and all additionally sourced V2 values are bound to
    // their exact evidence. Legacy values in five languages remain editorial.
    for (const lang of new Set(["ku", "ckb", ...Object.keys(record.translations)])) {
      const item = record.translations[lang];
      if (item?.translation !== word[lang]) problems.push(`Wörterbuchnachweis veraltet: ${word.de}/${lang}`);
      if (!word[lang]) continue;
      if (!item?.references?.length) problems.push(`Wörterbuchquelle fehlt: ${word.de}/${lang}`);
      for (const ref of item?.references || []) {
        if (!evidence.sources[ref.source] || !ref.url?.startsWith("https://") ||
          !ref.quote || digest(canonicalExcerpt(ref.quote)) !== ref.excerptSha256)
          problems.push(`Wörterbuchbeleg ungültig: ${word.de}/${lang}`);
        if (ref.source === "wiktionary-mirror" && ref.dialect !== lang)
          problems.push(`Kurdische Varietät verwechselt: ${word.de}/${lang}`);
      }
    }
  }
  return { dictionary, evidence, problems };
}
