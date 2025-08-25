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

  // Check for admin routes - these will be handled by the admin layout
  const isAdminRoute = pathname.startsWith("/admin");

  if (sessionCookie && !isPublicPath) {
    // For admin routes, let the admin layout handle the role check
    // For regular routes, just ensure there's a valid session
    if (isAdminRoute) {
      // Admin routes will be protected by the admin layout
      return NextResponse.next();
    } else {
      // Regular routes - session exists, allow access
      return NextResponse.next();
    }
  }

  return NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
