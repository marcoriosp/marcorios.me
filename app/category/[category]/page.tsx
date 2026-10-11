import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs } from "@/lib/content";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("category").map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props) {
  const { archive, page } = resolveArchive("category", (await params).category);
  return archiveMetadata(archive, page);
}

export default async function ArchiveRoute({ params }: Props) {
  const { archive, page } = resolveArchive("category", (await params).category);
  return <ArchivePage archive={archive} page={page} />;
}
