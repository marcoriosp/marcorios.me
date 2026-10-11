import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs, extraPages, getArchive } from "@/lib/content";

type Props = { params: Promise<{ author: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("author").flatMap((author) =>
    extraPages(getArchive("author", author)!).map((page) => ({ author, page: String(page) })),
  );
}

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("author", p.author, p.page);
  return archiveMetadata(archive, page);
}

export default async function ArchivePagedRoute({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("author", p.author, p.page);
  return <ArchivePage archive={archive} page={page} />;
}
