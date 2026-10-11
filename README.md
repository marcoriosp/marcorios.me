# marcorios.me

Personal site of Marco Rios, built with [vinext](https://github.com/cloudflare/vinext) (the Next.js App Router API on Vite) and deployed to Cloudflare Workers with Wrangler.

## Layout

| Path | What it is |
| --- | --- |
| `app/portfolio/` | The portfolio page rebuilt in Next.js (tabbed gallery, year filter, lightbox). Prerendered at build time. |
| `lib/portfolio-data.ts` | Portfolio entries (newest first). Edit this to add or remove work. |
| `lib/portfolio-layout.ts` | Justified/cluster gallery layout (hero first, wide image + nearest-dated verticals). |
| `components/` | Site header (with push menu) and footer shared by rebuilt pages. |
| `old_site/` | The original static WordPress export. Every page except `/portfolio/` is still served from here. |
| `scripts/sync-legacy.mjs` | Copies `old_site/` into `public/` (generated, git-ignored) before `dev` and `build`, skipping the rebuilt `portfolio/` and Cloudflare's reserved `cdn-cgi/`. |

Legacy pages are served as Workers Static Assets; the Worker only handles routes that have no static file (the rebuilt pages). `trailingSlash` is on, so `/portfolio` redirects to `/portfolio/` like the old site.

## Commands

```bash
pnpm install
pnpm dev          # local dev server (Vite)
pnpm build        # sync legacy files + production build into dist/
pnpm start        # run the built Worker locally with wrangler dev
pnpm typecheck
pnpm deploy:dry   # build + wrangler deploy --dry-run (packaging check)
pnpm run deploy   # build + deploy to Cloudflare Workers ("pnpm deploy" alone is pnpm's built-in command)
```

## Deploying

The Worker is named `marcorios-me` (see `wrangler.jsonc`). It needs no environment variables or secrets.

1. `npx wrangler login` (once per machine).
2. `pnpm run deploy` and check the `*.workers.dev` URL it prints.
3. Move the domain: the site was previously served by the Cloudflare Pages project `marcorios`. Remove `marcorios.me` from that Pages project's custom domains, then add it to the Worker (Workers & Pages → `marcorios-me` → Settings → Domains & Routes → Custom domain), or add `"routes": [{ "pattern": "marcorios.me", "custom_domain": true }]` to `wrangler.jsonc` and redeploy.
