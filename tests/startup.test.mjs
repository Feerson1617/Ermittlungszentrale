import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

test("Die CSP erlaubt exakt die frühe Startüberwachung ohne unsafe-inline", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = html.match(/<script data-startup>([\s\S]*?)<\/script>/)[1];
  const hash = createHash("sha256").update(script).digest("base64");
  assert.ok(html.includes(`script-src 'self' 'sha256-${hash}'`));
  assert.ok(!html.includes("unsafe-inline"));
  assert.ok(html.indexOf("<script data-startup>") < html.indexOf('id="app-style"'));
});
