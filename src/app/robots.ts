import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// 검색엔진과 AI 답변 엔진(GPTBot, ClaudeBot, PerplexityBot, Google-Extended 등) 모두 허용한다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
