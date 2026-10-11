# marcorios.me

Personal site of Marco Rios, built with [vinext](https://github.com/cloudflare/vinext) (the Next.js App Router API on Vite) and deployed to Cloudflare Workers with Wrangler.

Every page is a React server component that mirrors the design of the original WordPress site (`sensible-wp` theme). No legacy HTML is served; content lives in Markdown and is rendered at build time.

## Layout

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Home: hero, welcome text, experience boxes, latest 3 posts, about me, publications call-to-action. |
| `app/blog/`, `app/category/`, `app/tag/`, `app/author/` | Post archives, 10 per page, with `/page/N/` pagination. |
| `app/[slug]/page.tsx` | Single post at `/<slug>/`, with older/newer navigation. |
| `app/publications/`, `app/contact/`, `app/portfolio/` | Static pages. The contact form opens the visitor's mail app (no backend). |
| `app/feed/`, `app/*/[…]/feed/`, `app/comments/feed/`, `app/home/feed/` | RSS 2.0 route handlers matching the old WordPress feed URLs. |
| `content/posts/*.md` | One file per post. Frontmatter is one `key: <JSON value>` per line. |
| `content/pages/publications.md` | Publications intro text and the ordered list of featured papers. |
| `lib/content.ts` | Loads the Markdown, builds archives, pagination and dates. |
| `lib/site.ts` | Site name, menu, social links, authors, categories and tags. |
| `lib/markdown.ts`, `components/markdown.tsx` | Markdown → React renderer with the post widgets listed below. |
| `lib/portfolio-data.ts`, `lib/portfolio-layout.ts` | Portfolio entries and the justified gallery layout. |
| `app/styles/` | The original theme stylesheet, a Font Awesome 4 subset and the push-menu CSS. `app/globals.css` holds the additions. |
| `public/theme/` | Theme fonts and images. |
| `old_site/` | The original static WordPress export, kept for reference only. Nothing from it is served. |

All pages are prerendered at build time (`generateStaticParams`, `dynamicParams = false`), so unknown URLs return 404. `trailingSlash` is on, so `/blog` redirects to `/blog/` like the old site.

## Writing a post

Create `content/posts/<slug>.md`; the slug becomes the URL `/<slug>/`.

```markdown
---
title: "Post title"
date: "2026-10-11T09:00:00+00:00"
updated: "2026-10-11T09:00:00+00:00"
author: "zerovriu-admin"
categories: ["blog"]
tags: []
image: "https://file.marcorios.me/…/header.jpg"
excerpt: "First paragraph, shown on the blog listing and home page."
wpId: 0
---
# Centered title box

Regular Markdown…
```

`author` must be a key of `AUTHORS` and categories/tags keys of `CATEGORIES`/`TAGS` in `lib/site.ts`. `image` may be `null`. `wpId` is only used for feed GUIDs of migrated posts.

Besides standard Markdown, the renderer understands:

| Syntax | Renders |
| --- | --- |
| `# Heading` | Centered boxed heading (the old "su-heading"). |
| `![alt](src "left")` | Image floated left; also `"right"` and `"center"`. |
| `==text==` | Highlighted text. |
| `::youtube{id="…" list="…"}` | Responsive YouTube embed (`list` optional). |
| `::tweet{text="…" url="…"}` | Quote box with a "Click To Tweet" link. |
| `::pdf{src="/documents/X.pdf" title="…"}` | "Read the full paper" download card. |
| `:::gallery` … `:::` | Image slider with lightbox; put one `![alt](src)` per line inside. |
| `:::spoiler Title` … `:::` | Collapsible section. |
| `:::note` … `:::` | Boxed note. |

The publication PDFs (`AMVEEFSE.pdf`, `GOEMA.pdf`, `HETRDI.pdf`, `MFMADAR.pdf`, `RERSSE-ASR.pdf`) were not part of the WordPress export. Copy them into `public/documents/` for the download cards to work; note that `*.pdf` is git-ignored, so either force-add them or remove that rule.

## Commands

```bash
pnpm install
pnpm dev          # local dev server (Vite)
pnpm build        # production build into dist/
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
