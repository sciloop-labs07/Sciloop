import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PORTAL_PATH = "/sciloop-live";

function isPublicPortalAsset(pathname: string) {
  return pathname.startsWith(`${PUBLIC_PORTAL_PATH}/`) && /\.[^/]+$/.test(pathname);
}

function isAllowedNonUiPath(pathname: string) {
  return (
    pathname === PUBLIC_PORTAL_PATH ||
    pathname === `${PUBLIC_PORTAL_PATH}/` ||
    pathname === "/portal/index.html" ||
    isPublicPortalAsset(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest"
  );
}

export function proxy(request: NextRequest) {
  if (!isAllowedNonUiPath(request.nextUrl.pathname)) {
    const destination = new URL(PUBLIC_PORTAL_PATH, request.url);
    destination.search = request.nextUrl.search;
    return NextResponse.redirect(destination, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
