import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass API & Static
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm)$/)
  ) {
    return NextResponse.next();
  }

  // 1.5. SHORTLINK REWRITE PROXY
  // Detect /{code} (single segment, not a locale) and REWRITE to Backend
  // Backend will return 302 Redirect, which Next.js will pass to browser.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1) {
    const potentialCode = segments[0];

    // Check if it's NOT a locale (id, en) and NOT a standard route
    const isLocale = potentialCode === "id" || potentialCode === "en";
    const isSpecial = [
      "admin",
      "super-admin",
      "dashboard",
      "login",
      "register",
      "continue",
      "go",
      "expired",
      "referral",
      // Member routes
      "analytics",
      "levels",
      "withdrawal",
      "history",
      "settings",
      "new-link",
      "ads-info",
      "my-links",
      "notifications",
      "profile",
      // Landing pages
      "about",
      "contact",
      "payout-rates",
      "terms-of-service",
      "privacy-policy",
      "report-abuse",
      "faq",
      // Auth pages
      "forgot-password",
      "reset-password",
      "verify-email",
      "verification-pending",
    ].includes(potentialCode);

    if (!isLocale && !isSpecial) {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      // Gunakan Rewrite agar URL backend tidak terekspos langsung, tapi browser menerima respons 302 dari backend
      return NextResponse.rewrite(`${API_URL}/links/${potentialCode}`);
    }
  }

  // 2. Redirect bare /admin or /super-admin to dashboards
  // Extract locale and check path after locale
  // const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1) {
    const locale = segments[0]; // en or id
    const path = segments.slice(1).join("/");

    // Check if accessing bare admin or super-admin
    if (path === "admin" || path === "super-admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${path}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // 3. AUTH PROTECTION - Check token from cookie
  const token = request.cookies.get("auth_token")?.value;
  const userDataCookie = request.cookies.get("user_data")?.value;
  let userRole: string | null = null;

  if (userDataCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      userRole = userData.role;
    } catch (e) {
      // Invalid user data
      userRole = null;
    }
  }

  // Check if accessing protected routes
  const isDashboardPath = pathname.includes("/dashboard");
  const isAdminPath = pathname.includes("/admin");
  const isSuperAdminPath = pathname.includes("/super-admin");

  // Auth pages (login, register)
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    const url = request.nextUrl.clone();

    // Properly extract locale - check if first segment is a valid locale
    const validLocales = ["en", "id"];
    const firstSegment = segments[0] || "en";
    const locale = validLocales.includes(firstSegment) ? firstSegment : "en";

    // If accessing register with referral code, redirect to referral page
    const hasRefParam = request.nextUrl.searchParams.has("ref");
    const isRegisterPage = pathname.includes("/register");

    if (isRegisterPage && hasRefParam) {
      // User is logged in and clicked a referral link → show their own referral page
      url.pathname = `/${locale}/referral`;
      return NextResponse.redirect(url);
    }

    // Redirect based on role
    if (userRole === "super_admin") {
      url.pathname = `/${locale}/super-admin/dashboard`;
    } else if (userRole === "admin") {
      url.pathname = `/${locale}/admin/dashboard`;
    } else {
      url.pathname = `/${locale}/dashboard`;
    }
    return NextResponse.redirect(url);
  }

  // Protect dashboard routes - require authentication
  const memberRoutes = [
    "/new-link",
    "/ads-info",
    "/analytics",
    "/history",
    "/levels",
    "/profile",
    "/referral",
    "/settings",
    "/withdrawal",
  ];
  const isMemberPath = memberRoutes.some((route) => pathname.includes(route));

  if ((isDashboardPath || isMemberPath) && !isAdminPath && !isSuperAdminPath) {
    // This is user dashboard (/dashboard) or member page
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // Block admin from accessing user dashboard (only super_admin can access)
    if (userRole === "admin") {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/admin/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes - require admin or super_admin role
  if (isAdminPath && !isSuperAdminPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "admin" && userRole !== "super_admin") {
      // Not authorized - redirect to user dashboard
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Protect super-admin routes - require super_admin role only
  if (isSuperAdminPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      url.pathname = `/${locale}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "super_admin") {
      // Not super admin - redirect based on role
      const url = request.nextUrl.clone();
      const locale = segments[0] || "en";
      if (userRole === "admin") {
        url.pathname = `/${locale}/admin/dashboard`;
      } else {
        url.pathname = `/${locale}/dashboard`;
      }
      return NextResponse.redirect(url);
    }
  }

  // 4. Lanjut ke i18n Handler
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)", "/"],
};
