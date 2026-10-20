import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const root = resolve(new URL("..", import.meta.url).pathname);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".png": "image/png",
  ".pdf": "application/pdf",
};
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://local").pathname,
    );
    if (pathname.startsWith("/Ermittlungszentrale/"))
      pathname = pathname.slice("/Ermittlungszentrale".length);
    const target = resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const path = (await stat(target)).isDirectory()
      ? resolve(target, "index.html")
      : target;
    const file = await readFile(path);
    res
      .writeHead(200, {
        "Content-Type": mime[extname(path)] || "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(file);
  } catch {
    res
      .writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
      .end("Datei nicht gefunden.");
  }
}).listen(Number(process.env.PORT || 4173), "0.0.0.0", () =>
  console.log("Ermittlungszentrale: Port " + (process.env.PORT || 4173)),
);
