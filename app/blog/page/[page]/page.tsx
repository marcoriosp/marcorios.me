import { notFound } from "next/navigation";
import { ArchivePage, archiveMetadata } from "@/components/archive-page";
import { blogArchive, extraPages, parsePage } from "@/lib/content";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return extraPages(blogArchive).map((page) => ({ page: String(page) }));
}

async function resolve(params: Props["params"]) {
  const page = parsePage(blogArchive, (await params).page);
  if (!page) notFound();
  return page;
}

export async function generateMetadata({ params }: Props) {
  return archiveMetadata(blogArchive, await resolve(params));
}

export default async function BlogPagedPage({ params }: Props) {
  return <ArchivePage archive={blogArchive} page={await resolve(params)} />;
}
