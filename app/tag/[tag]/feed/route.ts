import { notFound } from "next/navigation";
import { archiveSlugs, getArchive } from "@/lib/content";
import { postsFeed } from "@/lib/rss";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("tag").map((tag) => ({ tag }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ tag: string }> }) {
  const archive = getArchive("tag", (await params).tag);
  if (!archive) notFound();
  return postsFeed(`${archive.name} – ${SITE_NAME}`, `${archive.path}feed/`, archive.posts);
}
