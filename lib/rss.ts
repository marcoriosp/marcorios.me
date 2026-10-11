import type { Post } from "./content";
import { markdownToText } from "./markdown";
import { SITE_TAGLINE, SITE_URL } from "./site";

const FEED_SIZE = 10;
const DESCRIPTION_WORDS = 55;

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

function cdata(value: string): string {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString().replace("GMT", "+0000");
}

function summary(post: Post): string {
  const words = markdownToText(post.body).split(" ");
  return words.length > DESCRIPTION_WORDS ? `${words.slice(0, DESCRIPTION_WORDS).join(" ")} […]` : words.join(" ");
}

function channel(title: string, selfPath: string, lastBuild: string | undefined, items: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>${escapeXml(title)}</title>
	<atom:link href="${SITE_URL}${selfPath}" rel="self" type="application/rss+xml" />
	<link>${SITE_URL}/</link>
	<description>${escapeXml(SITE_TAGLINE)}</description>
${lastBuild ? `	<lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>\n` : ""}	<language>en-US</language>
${items}</channel>
</rss>
`;
}

function xmlResponse(xml: string): Response {
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=UTF-8" } });
}

/** RSS 2.0 feed of the newest posts in `posts`, matching the original WordPress feeds. */
export function postsFeed(title: string, selfPath: string, posts: Post[]): Response {
  const latest = posts.slice(0, FEED_SIZE);
  const lastBuild = latest.map((p) => p.updated).sort().at(-1);
  const items = latest
    .map((post) => {
      const link = `${SITE_URL}/${post.slug}/`;
      const categories = post.categories.map((c) => `		<category>${cdata(c.name)}</category>\n`).join("");
      return `	<item>
		<title>${escapeXml(post.title)}</title>
		<link>${link}</link>
		<dc:creator>${cdata(post.author.name)}</dc:creator>
		<pubDate>${rfc822(post.date)}</pubDate>
${categories}		<guid isPermaLink="false">${SITE_URL}/?p=${post.wpId}</guid>
		<description>${cdata(summary(post))}</description>
	</item>
`;
    })
    .join("");
  return xmlResponse(channel(title, selfPath, lastBuild, items));
}

/** Comments are closed on every post, so comment feeds are valid but empty. */
export function emptyCommentsFeed(title: string, selfPath: string): Response {
  return xmlResponse(channel(title, selfPath, undefined, ""));
}