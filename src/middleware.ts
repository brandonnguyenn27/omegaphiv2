import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/api/auth", // IMPORTANT: Allow access to auth API routes!
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If no session cookie and not a public path, redirect to login
  if (!sessionCookie && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For now, we'll let the server-side components handle whitelist checking
  // The middleware will just ensure there's a valid session cookie
  if (sessionCookie && !isPublicPath) {
    // Session exists, allow access - whitelist checking will be done server-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
