import { emptyCommentsFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  return emptyCommentsFeed("Comments on: Home", "/home/feed/");
}
