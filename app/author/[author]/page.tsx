import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs } from "@/lib/content";

type Props = { params: Promise<{ author: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("author").map((author) => ({ author }));
}

export async function generateMetadata({ params }: Props) {
  const { archive, page } = resolveArchive("author", (await params).author);
  return archiveMetadata(archive, page);
}

export default async function ArchiveRoute({ params }: Props) {
  const { archive, page } = resolveArchive("author", (await params).author);
  return <ArchivePage archive={archive} page={page} />;
}
