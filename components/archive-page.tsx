import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Archive, type ArchiveKind, getArchive, pageHref, parsePage } from "@/lib/content";
import { ArchiveList } from "./archive-list";
import { ContentWithSidebar, PageHeader, SiteShell } from "./site-shell";

export function ArchivePage({ archive, page }: { archive: Archive; page: number }) {
  return (
    <SiteShell current={archive.kind === "blog" ? "/blog/" : undefined}>
      <PageHeader title={archive.heading} />
      <ContentWithSidebar archive>
        <ArchiveList archive={archive} page={page} />
      </ContentWithSidebar>
    </SiteShell>
  );
}

export function archiveMetadata(archive: Archive, page: number): Metadata {
  const feed = archive.kind === "blog" ? "/feed/" : `${archive.path}feed/`;
  return {
    title: page > 1 ? `${archive.name} – Page ${page}` : archive.name,
    alternates: {
      canonical: pageHref(archive, page),
      types: { "application/rss+xml": feed },
    },
  };
}

/** Resolves `/{kind}/{slug}/` and `/{kind}/{slug}/page/{n}/` route params, or 404s. */
export function resolveArchive(kind: ArchiveKind, slug: string, pageParam?: string): { archive: Archive; page: number } {
  const archive = getArchive(kind, slug);
  if (!archive) notFound();
  if (pageParam === undefined) return { archive, page: 1 };
  const page = parsePage(archive, pageParam);
  if (!page) notFound();
  return { archive, page };
}
