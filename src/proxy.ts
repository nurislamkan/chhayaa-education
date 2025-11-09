import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const authCred = req.cookies.get("AUTH_CRED");
  let token: string | null = null;

  if (authCred) {
    try {
      token = JSON.parse(authCred.value)?.token ?? null;
    } catch (err) {
      console.error("Invalid AUTH_CRED cookie:", err);
    }
  }

  const protectedRoutes = ["/admin/dashboard", "/accounts", "/app"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: prevent logged-in users from seeing the login page
  if (req.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/accounts/:path*", "/app/:path*", "/login"],
};
