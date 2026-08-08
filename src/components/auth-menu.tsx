"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function AuthMenu() {
  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/45">Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>

      <SignedOut>
        <Link href="/sign-in" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
          Sign in
        </Link>
      </SignedOut>
    </div>
  );
}
