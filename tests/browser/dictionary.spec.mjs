import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const dictionary = JSON.parse(await readFile(new URL("../../data/dictionary.json", import.meta.url)));
const observed = new WeakMap();
test.beforeEach(async ({page}) => {
  const errors=[]; observed.set(page,errors);
  page.on("pageerror", e=>errors.push(e.message));
  page.on("request", r=>{if(!r.url().startsWith("http://127.0.0.1:4173/")) errors.push(r.url());});
  page.on("response", r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
});
test.afterEach(async ({page})=>expect(observed.get(page)).toEqual([]));
async function boot(page) {
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("Willkommen");
  await page.locator("#dictionary-open").click();
}

test("Ergänzte Begriffe in sieben Sprachen, getrennte Varietäten und RTL", async ({page},testInfo) => {
  await boot(page);
  for (const lang of ["ru","uk","pl","tr","ar","ku","ckb"]) {
    await page.locator("#dictionary-language").selectOption(lang);
    await expect(page.locator("#dictionary-result")).toHaveAttribute("dir",["ar","ckb"].includes(lang)?"rtl":"ltr");
    await expect(page.locator("#dictionary-result")).toHaveAttribute("lang",lang==="ku"?"kmr":lang);
    for(const word of ["Landwirtschaft","Universität","Wirtschaft","alle"]) {
      await page.locator("#dictionary-input").fill(word);
      await expect(page.locator("#dictionary-result")).toHaveText(dictionary.find(e=>e.de===word)[lang]);
    }
  }
  await page.locator("#dictionary-input").fill("Strom");
  await expect(page.locator("#dictionary-context")).toContainText("Elektrizität");
  await expect(page.locator("#dictionary-context")).toHaveAttribute("dir","ltr");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:testInfo.outputPath("woerterbuch-sorani.png"),fullPage:true});
});

test("Offene Fachbegriffe bleiben leer und Wörterbuch erhält die Ermittlung", async ({page}) => {
  await page.goto("./");
  await page.locator('[data-action="open"][data-case="1"]').click();
  await page.locator('[data-action="hint"]').click();
  await page.locator("#name-answer").fill("Afirka");
  await page.locator("#dictionary-open").click();
  for(const lang of ["ku","ckb"]) {
    await page.locator("#dictionary-language").selectOption(lang);
    for(const word of ["nachhaltig","Bevölkerungswachstum","zuordnen"]) {
      await page.locator("#dictionary-input").fill(word);
      await expect(page.locator("#dictionary-result")).toHaveText("Keine Übersetzung vorhanden.");
    }
    await page.locator("#dictionary-input").fill("See");
    await expect(page.locator("#dictionary-context")).toContainText("Binnengewässer");
  }
  await expect(page.locator("#dictionary")).toContainText("muttersprachliche Prüfung steht noch aus");
  await page.locator("#dictionary-close").click();
  await expect(page.locator("#name-answer")).toHaveValue("Afirka");
  await expect(page.locator(".point-cap")).toContainText("3");
});

test("Lokale Quellen- und Statusseite ist erreichbar und behauptet keine Sprachfreigabe", async ({page})=>{
  await boot(page);
  const link=page.getByRole("link",{name:"Quellen und offene Begriffe"});
  await link.scrollIntoViewIfNeeded();
  const box=await link.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);
  await expect(link).toHaveAttribute("href","woerterbuch.html");
  await page.goto(await link.getAttribute("href"));
  await expect(page.locator("h1")).toContainText("Quellen und Prüfstand");
  await expect(page.locator("body")).toContainText("noch nicht muttersprachlich abgenommen");
  await expect(page.locator("tbody tr")).toHaveCount(7);
  await expect(page.locator("tbody")).toContainText("184 / 197");
  await expect(page.locator("tbody")).toContainText("184 / 197");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
