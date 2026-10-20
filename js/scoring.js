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
    return answers.headline === "b" ? result("correct", 5) : result("wrong");
  }
  if (rubric.kind === "matching") {
    if (
      !answers.matches ||
      answers.matches.length !== 4 ||
      answers.matches.some((v) => v === "" || v === undefined)
    )
      return result("empty");
    const count = answers.matches.reduce(
      (n, v, i) => n + Number(String(v) === String(i)),
      0,
    );
    const raw = count === 4 ? 5 : count;
    return result(
      raw ? "correct" : "wrong",
      raw,
      answers.matches.map((v, i) => Number(String(v) === String(i))),
    );
  }
  throw new Error(`Unknown rubric: ${rubric.kind}`);
}
export function createTask() {
  return {
    hint: 0,
    locked: false,
    complete: false,
    points: 0,
    raw: 0,
    ack: false,
    attempts: [0, 0, 0, 0],
    answers: {},
    feedback: "",
    criteria: [],
  };
}
export function openHint(task) {
  if (task.complete || task.hint >= 3) return false;
  task.hint++;
  task.locked = false;
  task.feedback = "";
  task.answers = {};
  return true;
}
export function submitTask(task, rubric, answers, limits = [5, 3, 2, 1]) {
  if (task.complete) return { status: "complete", raw: task.raw };
  if (task.locked) return { status: "locked", raw: 0 };
  if (answers.fallback !== undefined && task.hint !== 3)
    return { status: "invalid", raw: 0 };
  const evaluation = evaluate(rubric, answers);
  task.answers = structuredClone(answers);
  if (["empty", "unclear"].includes(evaluation.status)) {
    task.feedback = evaluation.status;
    return evaluation;
  }
  task.attempts[task.hint]++;
  task.raw = evaluation.raw;
  task.criteria = evaluation.criteria;
  if (evaluation.raw > 0) {
    task.complete = true;
    task.points = Math.min(evaluation.raw, limits[task.hint]);
    task.feedback = "correct";
  } else {
    task.locked = task.hint < 3;
    task.feedback = "wrong";
  }
  return evaluation;
}
