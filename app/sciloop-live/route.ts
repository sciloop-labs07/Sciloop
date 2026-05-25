import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const MAIN_HTML_FILE = "SciLoop - Live Scientific Discoveries 80.html";

function buildShareConfig(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return {
    aiBackendUrl: `${origin}/api/sciloop-ai-proxy`,
    forloopBackendUrl: `${origin}/api/forloop-proxy`,
    visualLanguageLabUrl: `${origin}/visual-language-lab`,
  };
}

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), MAIN_HTML_FILE);
  const html = await readFile(filePath, "utf8");
  const configScript = `<script>window.SCILOOP_SHARE_CONFIG=${JSON.stringify(buildShareConfig(request))};</script>`;
  const enhancedHtml = html.includes("</head>")
    ? html.replace("</head>", `${configScript}</head>`)
    : `${configScript}${html}`;

  return new NextResponse(enhancedHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

