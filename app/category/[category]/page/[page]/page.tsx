import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs, extraPages, getArchive } from "@/lib/content";

type Props = { params: Promise<{ category: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("category").flatMap((category) =>
    extraPages(getArchive("category", category)!).map((page) => ({ category, page: String(page) })),
  );
}

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("category", p.category, p.page);
  return archiveMetadata(archive, page);
}

export default async function ArchivePagedRoute({ params }: Props) {
  const p = await params;
  const { archive, page } = resolveArchive("category", p.category, p.page);
  return <ArchivePage archive={archive} page={page} />;
}
