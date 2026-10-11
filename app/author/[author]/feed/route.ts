import { notFound } from "next/navigation";
import { archiveSlugs, getArchive } from "@/lib/content";
import { postsFeed } from "@/lib/rss";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("author").map((author) => ({ author }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ author: string }> }) {
  const archive = getArchive("author", (await params).author);
  if (!archive) notFound();
  return postsFeed(`${archive.name} – ${SITE_NAME}`, `${archive.path}feed/`, archive.posts);
}
