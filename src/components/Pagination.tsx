"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  hasMore,
  basePath,
}: {
  currentPage: number;
  hasMore: boolean;
  basePath: string;
}) {
  const searchParams = useSearchParams();

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  if (currentPage === 1 && !hasMore) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-[#1a1a5e] text-white hover:bg-[#2d2d7a] transition-colors text-sm font-medium border border-[#2d2d7a]"
        >
          ← Previous
        </Link>
      )}
      <span className="text-slate-400 text-sm">Page {currentPage}</span>
      {hasMore && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-4 py-2 rounded-lg bg-[#1a1a5e] text-white hover:bg-[#2d2d7a] transition-colors text-sm font-medium border border-[#2d2d7a]"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
