"use client";

import Link from "next/link";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Header({
  user,
  onSignOut,
}: {
  user?: User;
  onSignOut: () => Promise<void>;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0d0d2b] border-b border-[#2d2d7a] sticky top-0 z-20 h-14">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <span className="text-xl">🎬</span>
        <span className="text-lg font-bold text-white tracking-wide">
          Atlas <span className="text-green-400">Cinema</span> Guru
        </span>
      </Link>

      {/* Right side: email + sign out */}
      <div className="flex items-center gap-4">
        {user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? "User avatar"}
            className="w-7 h-7 rounded-full border border-green-400/50 hidden sm:block"
          />
        )}
        {/* Show email per requirements */}
        <span className="text-slate-300 text-sm hidden sm:block truncate max-w-[200px]">
          {user?.email}
        </span>
        <form action={onSignOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white bg-[#1a1a5e] hover:bg-[#2d2d7a] border border-[#2d2d7a] hover:border-[#4a4aaa] px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </form>
      </div>
    </header>
  );
}
