import { chromium, devices } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { assertStart, assertCasesAndDictionary, assertCleanStart, observeStart } from "../tests/browser/start-check.mjs";

const urls = process.argv.slice(2);
if (!urls.length || urls.some(url => !/^https?:\/\//.test(url))) {
  console.error("Aufruf: npm run check:start -- <vollständige HTTP(S)-Vorschau-URL> [weitere URL]. Der Server muss bereits laufen.");
  process.exit(1);
}
const output = new URL("../artifacts/start-check/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
const results = [];
try {
  for (const [index, url] of urls.entries()) for (const device of ["desktop", "ipad"]) {
    const context = await browser.newContext(device === "ipad" ? devices["iPad (gen 7) landscape"] : { viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const events = observeStart(page, url);
    const result = { url, device, success: false, ...events };
    results.push(result);
    try {
      await assertStart(page, url);
      result.documentCsp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
      result.address = page.url();
      await page.screenshot({ path: new URL(`${index}-${device}-start.png`, output).pathname, fullPage: true, caret: "initial" });
      await page.locator('[data-case="1"]').click();
      await expectPhotos(page);
      await page.screenshot({ path: new URL(`${index}-${device}-akte-001.png`, output).pathname, fullPage: true, caret: "initial" });
      await page.locator('[data-action="home"]').click();
      await assertCasesAndDictionary(page);
      assertCleanStart(events);
      result.success = true;
      console.log(`BESTANDEN ${device}: ${url} – CSS, Motiv, fünf Akten, Hinweise/Punkte, Wörterbuch, 24 Fotos.`);
    } catch (error) {
      result.error = error.message;
      console.error(`FEHLER ${device}: ${url}\n${error.message}`);
      process.exitCode = 1;
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(new URL("results.json", output), JSON.stringify(results, null, 2) + "\n");
}

async function expectPhotos(page) {
  for (const img of await page.locator("main .photo img").all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(i => i.decode());
  }
  await page.evaluate(() => scrollTo(0, 0));
}
