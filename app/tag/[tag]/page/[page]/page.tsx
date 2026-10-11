import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs, extraPages, getArchive } from "@/lib/content";

type Props = { params: Promise<{ tag: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("tag").flatMap((tag) =>
    extraPages(getArchive("tag", tag)!).map((page) => ({ tag, page: String(page) })),
  );
}

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("tag", p.tag, p.page);
  return archiveMetadata(archive, page);
}

export default async function ArchivePagedRoute({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("tag", p.tag, p.page);
  return <ArchivePage archive={archive} page={page} />;
}
