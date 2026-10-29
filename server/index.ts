import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type ServerResponse } from "node:http";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { WebSocketServer, type WebSocket } from "ws";
import { COOLDOWN_MS, MAX_MESSAGE_LENGTH, type ServerMessage } from "../src/protocol.ts";

const PORT = Number(process.env.PORT ?? 8080);
const DIST = resolve(import.meta.dirname, "../dist");

if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build found. Run `npm start` (builds then serves) or `npm run build` first.");
  process.exit(1);
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".lottie": "application/zip",
  ".json": "application/json",
};

/** Picks the Wi-Fi/Ethernet IPv4 address phones on the same network can reach. */
function lanIp(): string | undefined {
  if (process.env.HOST_IP) return process.env.HOST_IP;
  const ignored = /^(lo|utun|bridge|vmnet|vboxnet|docker|veth|awdl|llw|anpi|ap\d|tailscale|zt)/;
  const candidates = Object.entries(networkInterfaces())
    .filter(([name]) => !ignored.test(name))
    .flatMap(([name, addrs]) =>
      (addrs ?? [])
        .filter((a) => a.family === "IPv4" && !a.internal && !a.address.startsWith("169.254."))
        .map((a) => ({ name, address: a.address })),
    );
  const rank = (c: { name: string; address: string }) =>
    (/^(en|eth|wl)/.test(c.name) ? 0 : 2) + (/^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))/.test(c.address) ? 0 : 1);
  return candidates.sort((a, b) => rank(a) - rank(b))[0]?.address;
}

const joinUrl = () => {
  if (process.env.JOIN_URL) return new URL("/join", process.env.JOIN_URL).href;
  const ip = lanIp();
  return ip ? `http://${ip}:${PORT}/join` : null;
};

function sendFile(res: ServerResponse, file: string) {
  const isHashedAsset = file.startsWith(join(DIST, "assets"));
  res.writeHead(200, {
    "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
    "Cache-Control": isHashedAsset ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(file).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://x");

  if (url.pathname === "/api/info") {
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ joinUrl: joinUrl() }));
    return;
  }

  const file = normalize(join(DIST, url.pathname));
  if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) return sendFile(res, file);
  // Extension-less paths like /join are client-side routes.
  if (!extname(url.pathname)) return sendFile(res, join(DIST, "index.html"));
  res.writeHead(404).end("Not found");
});

const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 });
const displays = new Set<WebSocket>();
const guests = new Set<WebSocket>();

function broadcast(targets: Iterable<WebSocket>, msg: ServerMessage) {
  const data = JSON.stringify(msg);
  for (const ws of targets) if (ws.readyState === ws.OPEN) ws.send(data);
}

const broadcastPresence = () =>
  broadcast([...displays, ...guests], { type: "presence", guests: guests.size });

wss.on("connection", (ws, req) => {
  const role = new URL(req.url ?? "", "http://x").searchParams.get("role");
  const pool = role === "display" ? displays : guests;
  pool.add(ws);
  broadcastPresence();

  let lastSent = 0;
  ws.on("message", (raw) => {
    const now = Date.now();
    if (pool !== guests || now - lastSent < COOLDOWN_MS) return;
    let msg: { type?: unknown; message?: unknown };
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (msg.type !== "reaction") return;
    lastSent = now;
    const message = String(msg.message ?? "")
      .replace(/\p{C}/gu, "")
      .trim()
      .slice(0, MAX_MESSAGE_LENGTH);
    broadcast(displays, { type: "reaction", id: randomUUID(), message });
  });

  ws.on("close", () => {
    pool.delete(ws);
    broadcastPresence();
  });
});

server.listen(PORT, () => {
  console.log(`\n  🎃 Display (open on the laptop):  http://localhost:${PORT}`);
  console.log(`  👻 Guests (QR code on screen):   ${joinUrl() ?? "no Wi-Fi address found; set HOST_IP"}\n`);
});
