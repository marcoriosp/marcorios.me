import { emptyCommentsFeed } from "@/lib/rss";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return emptyCommentsFeed(`Comments for ${SITE_NAME}`, "/comments/feed/");
}
