import { posts } from "@/lib/content";
import { postsFeed } from "@/lib/rss";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return postsFeed(SITE_NAME, "/feed/", posts);
}
