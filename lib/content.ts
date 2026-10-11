import { AUTHORS, CATEGORIES, POSTS_PER_PAGE, TAGS, type Author } from "./site";

export interface Post {
  slug: string;
  title: string;
  /** ISO timestamp of first publication. */
  date: string;
  updated: string;
  author: Author;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  image: string | null;
  excerpt: string;
  /** Original WordPress post ID, kept for feed GUIDs (`/?p=ID`). */
  wpId: number;
  body: string;
}

export interface PublicationsPage {
  title: string;
  image: string;
  list: { slug: string; image: string; excerpt: string }[];
  body: string;
}

/** Splits a document into its frontmatter (one `key: <JSON>` per line) and Markdown body. */
function parseDocument(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(": ");
    if (sep > 0) data[line.slice(0, sep)] = JSON.parse(line.slice(sep + 2));
  }
  return { data, body: raw.slice(match[0].length) };
}

const postFiles = import.meta.glob<string>("/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const pageFiles = import.meta.glob<string>("/content/pages/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** All posts, newest first. */
export const posts: Post[] = Object.entries(postFiles)
  .map(([path, raw]) => {
    const { data, body } = parseDocument(raw);
    const author = AUTHORS[data.author as string];
    if (!author) throw new Error(`Unknown author "${data.author}" in ${path}`);
    return {
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
      title: data.title as string,
      date: data.date as string,
      updated: data.updated as string,
      author,
      categories: (data.categories as string[]).map((slug) => ({ slug, name: CATEGORIES[slug] ?? slug })),
      tags: (data.tags as string[]).map((slug) => ({ slug, name: TAGS[slug] ?? slug })),
      image: (data.image as string | null) ?? null,
      excerpt: data.excerpt as string,
      wpId: data.wpId as number,
      body,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** `older` is the previous post in time, `newer` the next one. */
export function adjacentPosts(slug: string): { older?: Post; newer?: Post } {
  const i = posts.findIndex((p) => p.slug === slug);
  return { newer: posts[i - 1], older: posts[i + 1] };
}

export type ArchiveKind = "category" | "tag" | "author";

export interface Archive {
  kind: ArchiveKind | "blog";
  slug: string;
  /** Heading shown on the archive page, e.g. "Author: Marco". */
  heading: string;
  /** Name used in the document and feed titles. */
  name: string;
  /** Base path without pagination, e.g. "/category/news/". */
  path: string;
  posts: Post[];
}

export const blogArchive: Archive = {
  kind: "blog",
  slug: "blog",
  heading: "Blog",
  name: "Blog",
  path: "/blog/",
  posts,
};

export function getArchive(kind: ArchiveKind, slug: string): Archive | undefined {
  if (kind === "category") {
    const name = CATEGORIES[slug];
    if (!name) return undefined;
    const list = posts.filter((p) => p.categories.some((c) => c.slug === slug));
    return { kind, slug, heading: name, name, path: `/category/${slug}/`, posts: list };
  }
  if (kind === "tag") {
    const name = TAGS[slug];
    if (!name) return undefined;
    const list = posts.filter((p) => p.tags.some((t) => t.slug === slug));
    return { kind, slug, heading: name, name, path: `/tag/${slug}/`, posts: list };
  }
  const author = AUTHORS[slug];
  if (!author) return undefined;
  const list = posts.filter((p) => p.author.slug === slug);
  return { kind, slug, heading: `Author: ${author.name}`, name: author.name, path: `/author/${slug}/`, posts: list };
}

export function archiveSlugs(kind: ArchiveKind): string[] {
  const source = kind === "category" ? CATEGORIES : kind === "tag" ? TAGS : AUTHORS;
  return Object.keys(source);
}

export function pageCount(archive: Archive): number {
  return Math.max(1, Math.ceil(archive.posts.length / POSTS_PER_PAGE));
}

export function pagePosts(archive: Archive, page: number): Post[] {
  return archive.posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}

export function pageHref(archive: Archive, page: number): string {
  return page <= 1 ? archive.path : `${archive.path}page/${page}/`;
}

/** Pages 2..n, for `generateStaticParams` on `/page/[page]/` routes. */
export function extraPages(archive: Archive): number[] {
  return Array.from({ length: pageCount(archive) - 1 }, (_, i) => i + 2);
}

/** Parses a `[page]` segment; returns undefined for anything that is not a valid page 2..n. */
export function parsePage(archive: Archive, value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const page = Number(value);
  return page >= 2 && page <= pageCount(archive) ? page : undefined;
}

export const publicationsPage: PublicationsPage = (() => {
  const raw = pageFiles["/content/pages/publications.md"];
  const { data, body } = parseDocument(raw);
  return {
    title: data.title as string,
    image: data.image as string,
    list: data.list as PublicationsPage["list"],
    body,
  };
})();

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** First `count` words of `text`, with an ellipsis when it was cut. */
export function truncateWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.length <= count ? text.trim() : `${words.slice(0, count).join(" ")}…`;
}
