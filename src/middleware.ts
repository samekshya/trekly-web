import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    // base64url -> base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  const isLoggedIn = Boolean(payload?.id);
  const role = payload?.role;

  if (pathname.startsWith("/user")) {
    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
