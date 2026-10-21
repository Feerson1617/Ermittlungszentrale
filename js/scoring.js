/** Task-specific interpretation. Never apply fuzzy distance to geographic names. */
export function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("de-DE")
    .replace(/ß/g, "ss")
    .replace(/[äáàâ]/g, "a")
    .replace(/[öóòô]/g, "o")
    .replace(/[üúùû]/g, "u")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const result = (status, raw = 0, criteria = []) => ({ status, raw, criteria });
const otherPlaces = [
  "deutschland",
  "spanien",
  "frankreich",
  "italien",
  "portugal",
  "russland",
  "ukraine",
  "polen",
  "turkei",
  "china",
  "indien",
  "japan",
  "aegypten",
  "agypten",
  "algerien",
  "tunesien",
  "libyen",
  "sudan",
  "tschad",
  "mali",
  "niger",
  "kamerun",
  "togo",
  "benin",
  "uganda",
  "kenia",
  "kongo",
  "namibia",
  "sambia",
  "simbabwe",
  "angola",
  "botswana",
  "senegal",
  "gambia",
  "gabun",
  "guinea",
  "ghana",
  "nigeria",
  "marokko",
  "sudafrika",
  "amerika",
  "america",
  "sudamerika",
  "nordamerika",
  "asien",
  "australien",
  "europa",
  "antarktis",
  "ozeanien",
];
const negatives = /\b(nicht|kein|keine|keinen|niemals|no|not)\b/;
const uncertainty =
  /\b(vielleicht|eventuell|oder|weiss nicht|weis nicht|keine ahnung)\b/;
export function evaluateName(value, rubric) {
  const text = normalize(value);
  if (!text) return result("empty");
  const tokens = text.split(" ");
  const positive = rubric.aliases.some(
    (a) => text === normalize(a) || ` ${text} `.includes(` ${normalize(a)} `),
  );
  const wrong = (
    rubric.wrong || [
      "marokko",
      "nigeria",
      "ghana",
      "kenia",
      "sudafrika",
      "niger",
      "guinea",
      "gambia",
      "gabun",
      "mali",
      "algerien",
      "agadir",
      "lagos",
    ]
  ).some((a) => {
    const n = normalize(a);
    return (
      !rubric.aliases.map(normalize).includes(n) &&
      ` ${text} `.includes(` ${n} `)
    );
  });
  if (positive && (wrong || uncertainty.test(text))) return result("unclear");
  if (positive && rubric.kind === "continent") {
    if (/\bland\s*\?/i.test(String(value))) return result("unclear");
    const deniesCountry = /\bkein(?:e[nmrs]?)? land\b/.test(text);
    const deniesContinent = /\b(?:kein(?:e[nmrs]?)?|nicht (?:ein )?) kontinent\b/.test(text);
    if (deniesContinent) return result("wrong");
    if (deniesCountry && /\bkontinent\b/.test(text) && !/\bnicht afrika\b/.test(text))
      return result("correct", 5);
    if (/\b(?:ist|sei|war) (?:ein(?:e[nmrs]?)? )?land\b/.test(text) && !deniesCountry)
      return result("wrong");
    if (/\bland\b/.test(text)) return result("unclear");
  }
  if (positive && rubric.kind === "country") {
    if (/\b(?:ist|sei|war) (?:ein )?kontinent\b/.test(text)) return result("wrong");
    if (/\bkein land\b/.test(text)) return result("wrong");
    // Explicit country-specific phrasing; continent negation is not a negated
    // country name. Unknown additional claims still use neutral clarification.
    if (rubric.aliases.some(alias => text === `${normalize(alias)} ist kein kontinent sondern ein land`))
      return result("correct", 5);
  }
  if (positive && negatives.test(text)) return result("wrong");
  if (positive) {
    // Accept a short name, a bullet, or a simple sentence. Additional unknown claims are not silently ignored.
    const stripped = tokens
      .filter(
        (t) =>
          ![
            "ein",
            "eine",
            "einen",
            "einem",
            "einer",
            "den",
            "der",
            "die",
            "das",
            "kontinent",
            "land",
            "ist",
            "es",
            "in",
            "wir",
            "denken",
            "denke",
            "glauben",
            "glaube",
            "vermuten",
            "vermute",
            "ich",
            "meine",
            "antwort",
            "gesucht",
            "liegt",
            "heisst",
            "heiβt",
            "heiẞt",
            "losung",
            "auf",
            "dem",
            "foto",
            "sieht",
            "man",
            "unser",
            "unsere",
          ].includes(t),
      )
      .join(" ");
    if (rubric.aliases.map(normalize).includes(stripped))
      return result("correct", 5);
    return result("unclear");
  }
  if (
    wrong ||
    otherPlaces.includes(text) ||
    negatives.test(text) ||
    ["mond", "mars", "deutschland", "berlin", "wasser", "ja", "nein"].includes(
      text,
    )
  )
    return result("wrong");
  return result("unclear");
}
const someAnswers = new Set([
  "einige",
  "wenige",
  "paar",
  "nur paar",
  "ein paar",
  "nur ein paar",
  "nur vier",
  "vier",
  "manche",
  "nur manche",
  "teil",
  "ein teil",
  "einen teil",
  "nur ein teil",
  "ausschnitt",
  "ein ausschnitt",
  "kleiner ausschnitt",
  "nur einen teil",
  "nur ein kleiner teil",
  "nicht alle",
  "nicht alles",
  "nicht uberall",
  "nur einige",
  "einige orte",
  "nur einige orte",
  "nur wenige orte",
  "nur wenige",
  "ein paar orte",
  "nur ein paar orte",
  "nur einen kleinen teil",
  "nur ein kleinen teil",
  "wenige orte",
  "nur manche orte",
  "nur vier orte",
  "vier orte",
  "nur einen ausschnitt",
  "ein kleiner ausschnitt",
  "weniege",
  "einiege",
  "enige",
  "eingie",
  "einige ort",
  "nur 4",
  "4",
  "nur 4 orte",
  "nciht alle",
]);
export const scopeAccepted = [...someAnswers];
const allAnswers = new Set([
  "alle",
  "alles",
  "alle orte",
  "ganz afrika",
  "den ganzen kontinent",
  "der ganze kontinent",
  "uberall",
  "ganz",
  "ganze",
  "ja",
]);
export const scopeRejected = [...allAnswers];
export const diversityAccepted = [
  "nein",
  "nicht uberall gleich",
  "nicht gleich",
  "unterschiedlich",
  "afrika unterschiedlich",
  "afrika ist unterschiedlich",
];
export const diversityRejected = [
  "ja",
  "uberall gleich",
  "gleich",
  "afrika nicht unterschiedlich",
  "afrika ist nicht unterschiedlich",
  "nicht unterschiedlich",
];
export function evaluateScope(value) {
  let text = normalize(value);
  if (!text) return result("empty");
  text = text
    .replace(/^(die )?(vier |4 )?(bilder|fotos) (zeigen|sind|bilden) /, "")
    .replace(/^(sie|es) (zeigen|zeigt|sind|ist) /, "")
    .replace(/^(das ist|es ist) /, "")
    .replace(/ (von|in) afrika$/, "")
    .replace(/ (der wirklichkeit|des kontinents)$/, "");
  if (someAnswers.has(text)) return result("correct", 2);
  if (
    allAnswers.has(text) ||
    /^(nicht|kein|keine|keinen) (einige|wenige|manche|teil|ein teil|nur ein teil|ein ausschnitt)$/.test(
      text,
    )
  )
    return result("wrong");
  // Full phrases with exact, interpretable meaning; contradictory combinations remain unresolved.
  if (
    /^(sie zeigen )?(nur )?(einige|wenige|manche) (orte|platze|stellen)$/.test(
      text,
    )
  )
    return result("correct", 2);
  return result("unclear");
}
export function evaluateDiversity(value) {
  const text = normalize(value);
  if (!text) return result("empty");
  if (diversityAccepted.includes(text)) return result("correct", 1);
  if (diversityRejected.includes(text)) return result("wrong");
  return result("unclear");
}
export function evaluate(rubric, answers) {
  if (answers.fallback !== undefined) {
    if (!answers.fallback) return result("empty");
    return answers.fallback === rubric.fallback.answer
      ? result("correct", 1)
      : result("wrong");
  }
  if (rubric.kind === "continent" || rubric.kind === "country")
    return evaluateName(answers.name, rubric);
  if (rubric.kind === "selection" && rubric.schema === 2) {
    const keys = ["scope", "diversity", "work", "education"];
    if (keys.some(key => answers[key] === undefined || answers[key] === "")) return result("empty");
    if (!["some", "all"].includes(answers.scope) || !["different", "same"].includes(answers.diversity) ||
      [answers.work, answers.education].some(id => !Number.isInteger(Number(id)) || Number(id) < 1 || Number(id) > 12))
      return result("empty");
    const criteria = keys.map((key, i) => rubric.correctAnswers[key].map(String).includes(String(answers[key])) ? rubric.criteria[i].points : 0);
    const raw = criteria.reduce((sum, n) => sum + n, 0);
    return result(raw ? "correct" : "wrong", raw, criteria);
  }
  if (rubric.kind === "selection") {
    const scope = evaluateScope(answers.scope);
    const diversity = evaluateDiversity(answers.diversity);
    const selected = [...new Set(answers.missing || [])];
    if (
      scope.status === "empty" ||
      diversity.status === "empty" ||
      selected.length !== 2 ||
      selected.some((id) => !Number.isInteger(id) || id < 1 || id > 10)
    )
      return result("empty");
    if (scope.status === "unclear" || diversity.status === "unclear")
      return result("unclear");
    const criteria = [
      scope.raw,
      diversity.raw,
      ...selected.map((id) => (rubric.editorial.includes(id) ? 0 : 1)),
    ];
    const raw = criteria.reduce((a, b) => a + b, 0);
    return result(raw ? "correct" : "wrong", raw, criteria);
  }
  if (rubric.kind === "headline") {
    if (!answers.headline) return result("empty");
    return answers.headline === (rubric.answer || "b") ? result("correct", 5) : result("wrong");
  }
  if (rubric.kind === "matching" && rubric.schema === 2) {
    const keys = correctionKeys(rubric);
    if (!answers.matches || Array.isArray(answers.matches) || keys.some(key => !answers.matches[key])) return result("empty");
    const valid = new Set(Object.values(rubric.matchingAnswers));
    if (keys.some(key => !valid.has(answers.matches[key]))) return result("empty");
    const criteria = keys.map(key => Number(answers.matches[key] === rubric.matchingAnswers[key]));
    const count = criteria.reduce((sum, n) => sum + n, 0), raw = count === 4 ? 5 : count;
    return result(raw ? "correct" : "wrong", raw, criteria);
  }
  if (rubric.kind === "matching") {
    if (
      !answers.matches ||
      answers.matches.length !== 4 ||
      answers.matches.some((v) => v === "" || v === undefined)
    )
      return result("empty");
    const expected = rubric.matchingAnswers ? Object.values(rubric.matchingAnswers) : ["0", "1", "2", "3"];
    if (answers.matches.some(value => !expected.includes(String(value)))) return result("empty");
    const count = answers.matches.reduce((n, value, i) => n + Number(String(value) === expected[i]), 0);
    const raw = count === 4 ? 5 : count;
    return result(
      raw ? "correct" : "wrong",
      raw,
      answers.matches.map((v, i) => Number(String(v) === expected[i])),
    );
  }
  throw new Error(`Unknown rubric: ${rubric.kind}`);
}
export function createTask() {
  return {
    hint: 0, locked: false, scored: false, fullCorrect: false, resolved: false,
    usedFallback: false, points: 0, raw: 0, ack: false,
    attempts: [0, 0, 0, 0], answers: {}, regularDraft: {}, fallbackDraft: {},
    submittedAnswers: {}, feedback: "", criteria: [], clarification: false,
    resolutionTried: false, resolutionAnswers: {},
  };
}
export function openHint(task) {
  if (task.scored || task.hint >= 3) return false;
  task.hint++;
  task.locked = false;
  task.feedback = "";
  task.clarification = false;
  if (task.hint === 3) {
    task.regularDraft = structuredClone(task.answers);
    task.answers = structuredClone(task.fallbackDraft);
  }
  return true;
}
export function submitTask(task, rubric, answers, limits = [5, 3, 2, 1]) {
  if (task.scored) return { status: "scored", raw: task.raw };
  if (task.locked) return { status: "locked", raw: 0 };
  if ((answers.fallback !== undefined) !== (task.hint === 3)) return { status: "invalid", raw: 0 };
  const evaluation = evaluate(rubric, answers);
  task.answers = structuredClone(answers);
  if (task.hint === 3) task.fallbackDraft = structuredClone(answers);
  if (["empty", "unclear"].includes(evaluation.status)) {
    task.feedback = evaluation.status;
    task.clarification = evaluation.status === "unclear";
    return evaluation;
  }
  task.clarification = false;
  task.attempts[task.hint]++;
  task.raw = evaluation.raw;
  task.criteria = evaluation.criteria;
  if (evaluation.raw > 0) {
    task.scored = true;
    task.usedFallback = task.hint === 3;
    task.fullCorrect = !task.usedFallback && evaluation.raw === rubric.max;
    task.resolved = task.fullCorrect || task.usedFallback;
    task.submittedAnswers = structuredClone(answers);
    task.points = Math.min(evaluation.raw, limits[task.hint]);
    task.feedback = "correct";
  } else {
    task.locked = task.hint < 3;
    task.feedback = "wrong";
  }
  return evaluation;
}
export function correctionKeys(rubric) {
  return rubric.kind === "selection" ? ["scope", "diversity", "work", "education"] : ["water", "people", "economy", "solar"];
}
export function attemptResolution(task, rubric, answers) {
  if (!task.scored || task.resolved || task.resolutionTried) return "unavailable";
  const keys = correctionKeys(rubric);
  const wrong = keys.filter((key, i) => !task.criteria[i]);
  if (wrong.some(key => answers[key] === undefined || answers[key] === "")) return "empty";
  task.resolutionTried = true;
  task.resolutionAnswers = structuredClone(answers);
  task.resolved = wrong.every(key => rubric.kind === "selection"
    ? rubric.correctAnswers[key].map(String).includes(String(answers[key]))
    : rubric.matchingAnswers[key] === answers[key]);
  return task.resolved ? "resolved" : "explain";
}
export function confirmResolution(task) {
  if (!task.scored || !task.resolutionTried) return false;
  task.resolved = true;
  return true;
}
