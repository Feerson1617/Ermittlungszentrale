import { test, expect } from "@playwright/test";
import { assertStart, assertCasesAndDictionary, assertCleanStart, observeStart } from "./start-check.mjs";

for (const path of ["/", "/Ermittlungszentrale/"]) {
  test(`Realer Start ${path}: CSS, Motiv, fünf bedienbare Akten und Wörterbuch`, async ({ page, baseURL }) => {
    const url = new URL(path, baseURL).href;
    const events = observeStart(page, url);
    await assertStart(page, url);
    // WebKit screenshot preparation injects a stylesheet rejected by the real CSP.
    // Keep this console/network check free of that instrumentation; check:start saves Chromium views.
    await assertCasesAndDictionary(page);
    assertCleanStart(events);
  });
}

test("Projektpfad ohne Slash wird kanonisch weitergeleitet", async ({ page, baseURL }) => {
  const url = new URL("/Ermittlungszentrale?start=1", baseURL).href;
  const events = observeStart(page, url);
  await assertStart(page, url);
  await expect(page).toHaveURL(new URL("/Ermittlungszentrale/?start=1", baseURL).href);
  assertCleanStart(events);
});

for (const [file, mode, message] of [
  ["css/style.css", "missing", /Gestaltung/],
  ["css/style.css", "empty", /CSS-Datei/],
  ["js/app.js", "missing", /JavaScript/],
  ["data/maps.js", "html", /JavaScript/],
  ["data/rubrics.json", "missing", /rubrics.json: HTTP 404/],
  ["data/dictionary.json", "html", /dictionary.json.*keine JSON/],
  ["data/media.json", "invalid", /media.json.*ungültig/],
]) {
  test(`Startfehler ${file} (${mode}) erscheint verständlich und erlaubt erneutes Laden`, async ({ page }) => {
    const pattern = `**/${file}`;
    await page.route(pattern, route => route.fulfill({
      status: mode === "missing" ? 404 : 200,
      contentType: mode === "html" ? "text/html" : file.endsWith(".css") ? "text/css" : "application/json",
      body: mode === "html" ? "<!doctype html><p>Fallback</p>" : mode === "invalid" ? "{" : "",
    }));
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("data-app-state", "failed");
    await expect(page.getByRole("alert")).toContainText("Die Akten konnten nicht geladen werden.");
    await expect(page.locator("#startup-detail")).toContainText(message);
    await expect(page.locator(".boot-message")).toHaveCount(0);
    await expect(page.locator("#dictionary-open")).toBeDisabled();
    await page.unroute(pattern);
    await page.getByRole("link", { name: "Seite erneut laden" }).click();
    await expect(page.locator(".case-card")).toHaveCount(5);
    await expect(page.locator("html")).toHaveAttribute("data-app-state", "ready");
  });
}

for (const file of ["css/style.css", "js/app.js", "data/media.json"]) test(`Hängender Abruf ${file} endet mit Fehler statt dauerhafter Lademeldung`, async ({ page }) => {
  await page.clock.install();
  let pending;
  await page.route(`**/${file}`, route => { pending = route; });
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect.poll(() => Boolean(pending)).toBeTruthy();
  await page.clock.fastForward(18001);
  await expect(page.locator("html")).toHaveAttribute("data-app-state", "failed");
  await expect(page.getByRole("alert")).toContainText("Der Start dauert zu lange");
  await expect(page.locator(".boot-message")).toHaveCount(0);
  await expect(page.locator("#dictionary-open")).toBeDisabled();
});

test("Eine übergeordnete Skriptsperre lässt die statische Starthilfe sichtbar", async ({ page }) => {
  await page.route("**/Ermittlungszentrale/", async route => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "Content-Security-Policy": "script-src 'none'" } });
  });
  await page.goto("./");
  await expect(page.locator("#startup-status h1")).toHaveText("Das Spiel ist noch nicht gestartet.");
  await expect(page.locator("#startup-detail")).toContainText("ist der Start blockiert");
  await expect(page.locator("main")).not.toContainText("Die Akten werden geöffnet");
  await expect(page.locator("#dictionary-open")).toBeDisabled();
});
