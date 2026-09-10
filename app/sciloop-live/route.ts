import { NextRequest, NextResponse } from "next/server";

import { getPublicPortalHtml } from "@/lib/public-portal";

export async function GET(request: NextRequest) {
  const html = await getPublicPortalHtml(request.nextUrl.pathname, request.url);

  return new NextResponse(html, {
    headers: {
      "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      "content-type": "text/html; charset=utf-8",
      "x-sciloop-surface": "preserved-public-portal",
    },
  });
}
