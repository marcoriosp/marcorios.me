// Copies the archived static WordPress export (old_site/) into public/ so every
// legacy URL keeps working as a Workers static asset. Pages rebuilt in the
// Next.js app are excluded so the app route answers them instead.
import { cp, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "old_site");
const dest = path.join(root, "public");

// Top-level old_site entries now served by app/ routes.
const REBUILT = new Set(["portfolio"]);
// /cdn-cgi/* is reserved by Cloudflare and never reaches static assets.
const RESERVED = new Set(["cdn-cgi"]);

await stat(src);
await rm(dest, { recursive: true, force: true });
await cp(src, dest, {
  recursive: true,
  filter(file) {
    const rel = path.relative(src, file);
    if (!rel) return true;
    const top = rel.split(path.sep)[0];
    if (REBUILT.has(top) || RESERVED.has(top)) return false;
    return path.basename(file) !== ".DS_Store";
  },
});

console.log(`[sync-legacy] old_site -> public (skipped: ${[...REBUILT, ...RESERVED].join(", ")})`);
