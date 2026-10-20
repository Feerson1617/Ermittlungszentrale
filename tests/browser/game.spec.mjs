import { test, expect } from "@playwright/test";
const observed = new WeakMap();
test.beforeEach(async ({ page }) => {
  const events = { errors: [], external: [] };
  observed.set(page, events);
  page.on("pageerror", (e) => events.errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4173/"))
      events.external.push(r.url());
  });
});
test.afterEach(async ({ page }) => {
  expect(observed.get(page).errors).toEqual([]);
  expect(observed.get(page).external).toEqual([]);
});
async function boot(page) {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();
}
async function open(page, n) {
  await page.locator(`[data-action="open"][data-case="${n}"]`).click();
}
async function home(page) {
  await page.locator('[data-action="home"]').click();
}
async function choose(page, ids, action = "select") {
  for (const id of ids)
    await page.locator(`[data-action="${action}"][data-photo="${id}"]`).click();
}
async function submit(page) {
  await page.getByRole("button", { name: "Antwort abgeben" }).click();
}
async function result(page, points) {
  await expect(page.locator(".result .points")).toContainText(String(points));
  await expect(page.locator('[data-action="result-next"]')).toBeDisabled();
  await page.locator("#points-recorded").check();
  await page.locator('[data-action="result-next"]').click();
}
async function selectionTask(page) {
  await choose(page, [1, 2, 3, 4]);
  await page.getByRole("button", { name: "Auswahl ansehen" }).click();
  await page.locator("#paper-recorded").check();
  await page.getByRole("button", { name: "Zur Redaktion" }).click();
  await page.getByRole("button", { name: "Die Überschrift prüfen" }).click();
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
}

test("Start bleibt geheim; alle Akten sind unabhängig erreichbar", async ({
  page,
}) => {
  await boot(page);
  await expect(page).toHaveTitle("Die geheime Ermittlungszentrale");
  await expect(page.locator("body")).not.toContainText(/Afrika/i);
  for (const id of [5, 4, 3, 2, 1]) {
    await open(page, id);
    await noOverflow(page);
    await expect(page.locator("h1")).toBeVisible();
    await home(page);
  }
  await noOverflow(page);
});

test("Akte 001: Lösung, Papierbestätigung und Themenauflösung", async ({
  page,
}) => {
  await boot(page);
  await open(page, 1);
  await expect(page.locator("main")).not.toContainText(/Afrika/i);
  const alts = await page
    .locator("main [aria-label], main img[alt]")
    .evaluateAll((els) =>
      els
        .map((e) => e.getAttribute("alt") || e.getAttribute("aria-label"))
        .join(" "),
    );
  expect(alts).not.toMatch(/Afrika/i);
  await page.locator("#name-answer").fill("Afirka!");
  await submit(page);
  await expect(
    page.getByRole("heading", { name: "Unser neues Thema ist AFRIKA!" }),
  ).toBeVisible();
  await expect(page.locator('[data-action="home"]')).toBeDisabled();
  await result(page, 5);
  await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();
});

test("Hinweislimits, Sperren und Abschluss mit echtem Lösungsversuch", async ({
  page,
}) => {
  await boot(page);
  await open(page, 1);
  for (let level = 0; level < 3; level++) {
    await page
      .locator("#name-answer")
      .fill(level === 0 ? "Amerika" : "Südafrika");
    await submit(page);
    await expect(
      page.getByRole("button", { name: "Antwort abgeben" }),
    ).toBeDisabled();
    await page.locator('[data-action="hint"]').click();
    await expect(page.locator(".point-cap")).toContainText(
      String([3, 2, 1][level]),
    );
    await expect(page.locator("main")).not.toContainText(/Afrika/i);
  }
  await page.getByLabel("Kontinent B", { exact: true }).check();
  await submit(page);
  await expect(
    page.getByRole("button", { name: "Antwort abgeben" }),
  ).toBeEnabled();
  await page.getByLabel("Kontinent A", { exact: true }).check();
  await submit(page);
  await result(page, 1);
});

test("Akte 002: persönliche Auswahl unbewertet, volle gemeinsame Abgabe", async ({
  page,
}) => {
  await boot(page);
  await open(page, 2);
  await selectionTask(page);
  await page.locator("#scope-answer").fill("nur paar");
  await page.getByLabel("Nein", { exact: true }).check();
  await choose(page, [4, 6], "missing");
  await expect(page.locator("#scope-answer")).toHaveValue("nur paar");
  await submit(page);
  await result(page, 5);
  await expect(
    page.getByRole("heading", {
      name: "Fotos zeigen nur einen Teil der Wirklichkeit.",
    }),
  ).toBeVisible();
});

test("Akte 002: richtige Einzelkriterien bleiben erhalten", async ({
  page,
}) => {
  await boot(page);
  await open(page, 2);
  await selectionTask(page);
  await page.locator("#scope-answer").fill("wenige");
  await page.getByLabel("Ja", { exact: true }).check();
  await choose(page, [1, 2], "missing");
  await submit(page);
  await result(page, 2);
});

test("Unklare Antwort klärt neutral, ohne Versuch oder Teilpunkte zu verraten", async ({
  page,
}) => {
  await boot(page);
  await open(page, 2);
  await selectionTask(page);
  await page.locator("#scope-answer").fill("einige und alle");
  await page.getByLabel("Nein", { exact: true }).check();
  await choose(page, [4, 6], "missing");
  await submit(page);
  await expect(page.locator(".feedback")).toContainText("dieselbe Aussage");
  await expect(page.locator(".result")).toHaveCount(0);
  const s = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("ermittlungszentrale-session-v1")),
  );
  expect(s.tasks.selection.attempts[0]).toBe(0);
  expect(s.tasks.selection.points).toBe(0);
});

test("Akte 003: alle drei Orte liefern unabhängig bis zu 15 Punkte", async ({
  page,
}) => {
  await boot(page);
  await open(page, 3);
  for (const [i, name] of ["Maroko", "Nigeira", "Gahna"].entries()) {
    await expect(page.locator(".map")).toBeVisible();
    await page.locator("#name-answer").fill(name);
    await submit(page);
    await result(page, 5);
  }
  await expect(
    page.getByRole("heading", { name: "Ihr habt drei Orte entdeckt!" }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator("tbody")).toContainText("Marokko");
  await noOverflow(page);
});

test("Akte 004: ohne Akte 002 spielbar, Punkteübersicht nutzt Papier", async ({
  page,
}) => {
  await boot(page);
  await open(page, 4);
  await choose(page, [3, 6, 8, 9]);
  await page.getByRole("button", { name: "Auswahl ansehen" }).click();
  await expect(page.locator("main")).toContainText(
    "Eure Auswahl darf gleich bleiben",
  );
  await page.locator("#paper-recorded").check();
  await page.getByRole("button", { name: "Zum letzten Rätsel" }).click();
  await page.getByLabel("B · Ein Ort in Afrika.", { exact: true }).check();
  await submit(page);
  await result(page, 5);
  await expect(
    page.getByRole("heading", { name: "Ermittlung abgeschlossen!" }),
  ).toBeVisible();
  for (const [i, n] of [5, 3, 12, 2].entries())
    await page.locator(".score-input").nth(i).fill(String(n));
  await expect(page.locator("#calculator-total")).toHaveText("Gesamt: 22 / 30");
  await page.locator(".score-input").first().fill("8");
  await expect(page.locator("#calculator-total")).not.toContainText("25 / 30");
});

test("Akte 005: vier Spuren, Bonus getrennt, eigene Frage unbewertet", async ({
  page,
}) => {
  await boot(page);
  await open(page, 5);
  await expect(page.locator(".clue-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Spuren zuordnen" }).click();
  for (let i = 0; i < 4; i++)
    await page.locator(`#match-${i}`).selectOption(String(i));
  await submit(page);
  await result(page, 5);
  await page.getByRole("button", { name: "Wie können Menschen …?" }).click();
  await page
    .locator("#future-question")
    .fill("Wie können Menschen Wasser sparen?");
  await page.getByRole("button", { name: "Ermittlung abschließen" }).click();
  await expect(page.locator("main")).toContainText("5 / 5 Bonuspunkte");
});

test("Wörterbuch mit sieben Sprachen, RTL, fehlenden Begriffen und erhaltenem Spielstand", async ({
  page,
}) => {
  await boot(page);
  await open(page, 1);
  await page.locator('[data-action="hint"]').click();
  await page.locator("#name-answer").fill("Afirka");
  await page.locator("#dictionary-open").click();
  await expect(page.locator("#dictionary-language option")).toHaveCount(7);
  await page.locator("#dictionary-input").fill("KARTE");
  await expect(page.locator("#dictionary-result")).toHaveText("карта");
  for (const lang of ["ar", "ckb"]) {
    await page.locator("#dictionary-language").selectOption(lang);
    await expect(page.locator("#dictionary-result")).toHaveAttribute(
      "dir",
      "rtl",
    );
  }
  await page.locator("#dictionary-input").fill("XyzFantasieWort");
  await expect(page.locator("#dictionary-result")).toHaveText(
    "Keine Übersetzung vorhanden.",
  );
  await page.locator("#dictionary-close").click();
  await expect(page.locator("#name-answer")).toHaveValue("Afirka");
  await expect(page.locator(".point-cap")).toContainText("3");
  await submit(page);
  await result(page, 3);
});

test("Neuladen erhält Hinweisstufe und Versuchssperre; Neustart bestätigt Rücksetzen", async ({
  page,
}) => {
  await boot(page);
  await open(page, 1);
  await page.locator('[data-action="hint"]').click();
  await page.locator("#name-answer").fill("Amerika");
  await submit(page);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Antwort abgeben" }),
  ).toBeDisabled();
  await expect(page.locator(".point-cap")).toContainText("3");
  await page
    .getByRole("button", { name: "Akte neu starten", exact: true })
    .click();
  await page.getByRole("button", { name: "Akte behalten" }).click();
  await expect(page.locator(".point-cap")).toContainText("3");
  await page
    .getByRole("button", { name: "Akte neu starten", exact: true })
    .click();
  await page.getByRole("button", { name: "Neu starten", exact: true }).click();
  await expect(page.locator(".point-cap")).toContainText("5");
  await expect(page.locator("#name-answer")).toHaveValue("");
});

test("Keine Browser-Persistenz erforderlich, keine externen Requests oder Laufzeitfehler", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("storage denied");
      },
    });
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("storage denied");
      },
    });
  });
  const errors = [],
    external = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4173/")) external.push(r.url());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(r.url());
  });
  await boot(page);
  for (const id of [2, 3, 4, 5, 1]) {
    await open(page, id);
    await noOverflow(page);
    if (id === 1) {
      await page.locator("#name-answer").fill("Afrika");
      await submit(page);
      await result(page, 5);
    } else await home(page);
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(failed).toEqual([]);
});

test("Touch-Ziele, Dialog-Tastatur und Hoch-/Querformat bleiben bedienbar", async ({
  page,
}, testInfo) => {
  await boot(page);
  const small = await page
    .locator("button:not(:disabled),a")
    .evaluateAll((els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            (r.width < 44 || r.height < 44) &&
            !el.classList.contains("skip")
          );
        })
        .map((el) => el.outerHTML),
    );
  expect(small).toEqual([]);
  await page.locator("#dictionary-open").click();
  await expect(page.locator("#dictionary-input")).toBeFocused();
  await noOverflow(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("#dictionary")).not.toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("zentrale.png"),
    fullPage: true,
  });
});

for (const caseId of [2, 3, 4, 5])
  test(`Akte ${caseId}: einfache Abschlussaufgabe nach drei Hinweisen`, async ({
    page,
  }) => {
    await boot(page);
    await open(page, caseId);
    if (caseId === 2) await selectionTask(page);
    if (caseId === 4) {
      await choose(page, [1, 2, 3, 4]);
      await page.getByRole("button", { name: "Auswahl ansehen" }).click();
      await page.locator("#paper-recorded").check();
      await page.getByRole("button", { name: "Zum letzten Rätsel" }).click();
    }
    if (caseId === 5)
      await page.getByRole("button", { name: "Spuren zuordnen" }).click();
    for (let h = 0; h < 3; h++)
      await page.locator('[data-action="hint"]').click();
    await noOverflow(page);
    await expect(page.locator(".point-cap")).toContainText("1");
    await page.locator('input[name="fallback"][value="b"]').check();
    await submit(page);
    await expect(
      page.getByRole("button", { name: "Antwort abgeben" }),
    ).toBeEnabled();
    await page.locator('input[name="fallback"][value="a"]').check();
    await submit(page);
    await result(page, 1);
  });

test("Karte groß öffnen erhält Antworten und Hinweise", async ({ page }) => {
  await boot(page);
  await open(page, 3);
  await page.locator("#name-answer").fill("Maroko");
  await page.getByRole("button", { name: "Karte groß ansehen" }).click();
  await expect(page.locator("#map-dialog")).toBeVisible();
  await noOverflow(page);
  await page.locator("#map-close").click();
  await expect(page.locator("#name-answer")).toHaveValue("Maroko");
  await expect(page.locator(".point-cap")).toContainText("5");
});
