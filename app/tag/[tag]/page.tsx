import { ArchivePage, archiveMetadata, resolveArchive } from "@/components/archive-page";
import { archiveSlugs } from "@/lib/content";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return archiveSlugs("tag").map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props) {
  const { archive, page } = resolveArchive("tag", (await params).tag);
  return archiveMetadata(archive, page);
}

export default async function ArchiveRoute({ params }: Props) {
  const { archive, page } = resolveArchive("tag", (await params).tag);
  return <ArchivePage archive={archive} page={page} />;
}
