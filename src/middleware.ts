import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/billing(.*)"]);
const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? process.env.CLERK_PUBLISHABLE_KEY;

const clerkAuthMiddleware = clerkPublishableKey
  ? clerkMiddleware(
      (auth, request) => {
        if (isProtectedRoute(request)) {
          auth.protect();
        }

        return NextResponse.next();
      },
      {
        publishableKey: clerkPublishableKey
      }
    )
  : null;

export default function middleware(request: NextRequest, event: unknown) {
  if (!clerkAuthMiddleware) {
    return NextResponse.next();
  }

  return clerkAuthMiddleware(request, event as never);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"]
};