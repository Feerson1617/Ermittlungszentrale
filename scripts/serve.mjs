import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".geojson": "application/geo+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".png": "image/png",
  ".pdf": "application/pdf",
};
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://local");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/Ermittlungszentrale") {
      res.writeHead(308, { Location: "/Ermittlungszentrale/" + url.search }).end();
      return;
    }
    if (pathname.startsWith("/Ermittlungszentrale/"))
      pathname = pathname.slice("/Ermittlungszentrale".length);
    const target = resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const directory = (await stat(target)).isDirectory();
    if (directory && !pathname.endsWith("/")) {
      res.writeHead(308, { Location: url.pathname + "/" + url.search }).end();
      return;
    }
    const path = directory ? resolve(target, "index.html") : target;
    const file = await readFile(path);
    res
      .writeHead(200, {
        "Content-Type": mime[extname(path)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
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
