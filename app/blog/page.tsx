import { ArchivePage, archiveMetadata } from "@/components/archive-page";
import { blogArchive } from "@/lib/content";

export const metadata = archiveMetadata(blogArchive, 1);

export default function BlogPage() {
  return <ArchivePage archive={blogArchive} page={1} />;
}
