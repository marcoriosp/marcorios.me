import { notFound } from "next/navigation";
import { archiveSlugs, getArchive } from "@/lib/content";
import { postsFeed } from "@/lib/rss";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("category").map((category) => ({ category }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ category: string }> }) {
  const archive = getArchive("category", (await params).category);
  if (!archive) notFound();
  return postsFeed(`${archive.name} – ${SITE_NAME}`, `${archive.path}feed/`, archive.posts);
}
