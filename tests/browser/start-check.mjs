import { expect } from "@playwright/test";
import { learning } from "./v2-helpers.mjs";

// Shared with the probe for an already running server: no route mocks or fixture server.
export function observeStart(page, url) {
  const origin = new URL(url).origin;
  const events = { errors: [], failures: [], external: [], responses: [] };
  page.on("pageerror", e => events.errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") events.errors.push(m.text()); });
  page.on("requestfailed", r => events.failures.push(`${r.url()}: ${r.failure()?.errorText}`));
  page.on("request", r => { if (new URL(r.url()).origin !== origin) events.external.push(r.url()); });
  page.on("response", r => {
    events.responses.push({ url: r.url(), status: r.status(), type: r.headers()["content-type"], csp: r.headers()["content-security-policy"] || null });
    if (r.status() >= 400) events.failures.push(`${r.status()} ${r.url()}`);
  });
  return events;
}

export async function assertStart(page, url) {
  await page.goto(url);
  await expect(page.locator("html")).toHaveAttribute("data-app-state", "ready");
  await expect(page.locator(".boot-message, #startup-status")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Willkommen/ })).toBeVisible();
  await expect(page.locator(".case-card:not(.bonus)")).toHaveCount(4);
  await expect(page.locator(".case-card.bonus")).toHaveCount(1);
  for (const card of await page.locator(".case-card").all()) {
    await expect(card).toBeVisible();
    await expect(card).toBeEnabled();
    expect((await card.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.locator(".case-grid").evaluate(e => getComputedStyle(e).display)).toBe("grid");
  expect(await page.locator("body").evaluate(e => getComputedStyle(e).margin)).toBe("0px");
  expect(await page.locator("html").evaluate(e => getComputedStyle(e).backgroundColor)).toBe("rgb(245, 242, 233)");
  await expect.poll(() => page.locator(".hero-art").evaluate(i => i.complete && i.naturalWidth > 0)).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
}

export async function assertCasesAndDictionary(page) {
  const photos = new Set();
  const decoded = async () => {
    for (const img of await page.locator("main .photo img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth >= 600)).toBeTruthy();
      photos.add(await img.getAttribute("src"));
    }
  };
  for (const n of [1, 2, 3, 4, 5]) {
    await page.locator(`[data-action="open"][data-case="${n}"]`).click();
    await expect(page.locator(".case-heading h1")).toBeVisible();
    await expect(page.locator(".case-heading")).toContainText(`AKTE ${String(n).padStart(3, "0")}`);
    await decoded();
    if (n === 1) {
      await expect(page.locator(".point-cap")).toContainText("5");
      await page.locator('[data-action="hint"]').click();
      await expect(page.locator(".point-cap")).toContainText("3");
      await page.locator("#name-answer").fill("Afrika");
      await page.getByRole("button", { name: "Antwort abgeben" }).click();
      await expect(page.locator(".result .points")).toContainText("3");
      await page.locator("#points-recorded").check();
      await page.locator('[data-action="result-next"]').click();
    } else {
      if (n === 3) {
        for (const answer of ["Marokko", "Nigeria", "Ghana"]) {
          await decoded();
          await page.locator("#name-answer").fill(answer);
          await page.getByRole("button", { name: "Antwort abgeben" }).click();
          await expect(page.locator(".result .points")).toContainText("5");
          await page.locator("#points-recorded").check();
          await page.locator('[data-action="result-next"]').click();
          await learning(page,decoded);
        }
      }
      if (n === 2 || n === 4) {
        const first = page.locator('[data-action="select"]').first();
        await first.click();
        await expect(first).toHaveAttribute("aria-pressed", "true");
      }
      await page.locator('.case-nav [data-action="home"]').click();
    }
    await expect(page.locator(".case-card")).toHaveCount(5);
  }
  await page.locator("#dictionary-open").click();
  await expect(page.locator("#dictionary")).toBeVisible();
  await page.locator("#dictionary-input").fill("Karte");
  await page.locator("#dictionary-language").selectOption("ckb");
  await expect(page.locator("#dictionary-result")).toHaveText("نەخشە");
  await page.locator("#dictionary-close").click();
  expect(photos.size).toBe(19);
}

export function assertCleanStart(events) {
  expect(events.errors).toEqual([]);
  expect(events.failures).toEqual([]);
  expect(events.external).toEqual([]);
  for (const r of events.responses) {
    if (/\.(js|css|json)(?:\?|$)/.test(r.url)) {
      expect(r.status).toBe(200);
      const type = r.url.includes(".css") ? "text/css" : r.url.includes(".json") ? "application/json" : "(?:text|application)/javascript";
      expect(r.type).toMatch(new RegExp(`^${type}(?:;|$)`));
    }
  }
}
