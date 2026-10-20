import { test, expect } from "@playwright/test";
const failures = new WeakMap();
test.beforeEach(async ({ page }) => {
  const errors = [];
  failures.set(page, errors);
  page.on("pageerror", e => errors.push(e.message));
  page.on("requestfailed", r => errors.push(r.url()));
  page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:4173/")) errors.push(`Extern: ${r.url()}`); });
});
test.afterEach(async ({ page }) => expect(failures.get(page)).toEqual([]));
const open = (page,n) => page.locator(`[data-action="open"][data-case="${n}"]`).click();
const home = (page) => page.locator('[data-action="home"]').click();
async function decoded(page) {
  await expect(page.locator("main .photo img").first()).toBeVisible();
  // Scroll lazy images into view, including cards below the mobile fold.
  for (const img of await page.locator("main .photo img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth >= 600)).toBeTruthy();
    expect(await img.evaluate(i => getComputedStyle(i).objectFit)).toBe("contain");
  }
  expect(await page.locator(".photo-missing").count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
}
async function shot(page, testInfo, name) {
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath(name+".png"),fullPage:true});
}
async function solve(page, answer) {
  await page.locator("#name-answer").fill(answer);
  await page.getByRole("button",{name:"Antwort abgeben"}).click();
  await expect(page.locator(".result")).toBeVisible();
}

test("Fotos laden bedarfsweise; Akten 002/004 zeigen dieselben zehn Bilddateien", async ({page}, testInfo) => {
  const requests = [];
  page.on("request",r=>{if(r.url().includes("assets/images/"))requests.push(r.url());});
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("Willkommen");
  expect(requests).toEqual([]);
  await expect(page.locator("#photo-sources")).toBeHidden();
  await open(page,2);await decoded(page);
  const catalogue = () => page.locator(".photo-choice").evaluateAll(els=>els.map(e=>({
    id:e.dataset.photo,src:e.querySelector("img").getAttribute("src"),alt:e.querySelector("img").alt,
  })));
  const before=await catalogue();
  expect(before).toHaveLength(10);
  await shot(page,testInfo,"akte-002");
  await expect(page.locator("#photo-sources")).toBeVisible();
  await home(page);await open(page,4);await decoded(page);
  expect(await catalogue()).toEqual(before);
  await shot(page,testInfo,"akte-004");
});

test("Akte 001 verrät vor der Lösung keinen Ort; Akte 003 zeigt drei lesbare Fotokartenrätsel", async ({page},testInfo) => {
  await page.goto("./");await open(page,1);await decoded(page);
  expect(await page.locator("main .photo img").count()).toBe(4);
  const visibleEvidence=await page.locator("main .photo").evaluateAll(els=>els.map(e=>e.outerHTML).join(" "));
  expect(visibleEvidence).not.toMatch(/Afrika|Africa|Lagos|Nigeria|Marokko|Morocco|Namib|Congo|Kongo|Ituri/i);
  await expect(page.locator("#photo-sources")).toBeHidden();
  await shot(page,testInfo,"akte-001");
  await solve(page,"Afrika");
  await expect(page.locator("#photo-sources")).toBeVisible();
  await page.locator("#points-recorded").check();
  await page.locator('[data-action="result-next"]').click();
  await open(page,3);
  for (const [n,answer] of ["Marokko","Nigeria","Ghana"].entries()) {
    await decoded(page);
    await expect(page.locator("#photo-sources")).toBeHidden();
    await expect(page.locator(".map")).toBeVisible();
    await shot(page,testInfo,`akte-003-${n+1}`);
    await solve(page,answer);
    await page.locator("#points-recorded").check();
    await page.locator('[data-action="result-next"]').click();
  }
});

test("Akte 005: vier reale Zukunftsfotos und vollständige lokale Attribution", async ({page},testInfo) => {
  await page.goto("./");await open(page,5);await decoded(page);
  await expect(page.locator(".clue-card .photo img")).toHaveCount(4);
  await expect(page.locator(".clue-card .photo-credit")).toHaveCount(4);
  await shot(page,testInfo,"akte-005");
  await page.goto("bildnachweise.html");
  await expect(page.locator("article")).toHaveCount(15);
  for(const img of await page.locator("article img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(i=>i.complete && i.naturalWidth >= 600)).toBeTruthy();
  }
});
