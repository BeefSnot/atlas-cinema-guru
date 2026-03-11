"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback } from "react";

const ALL_GENRES = [
  "Action", "Comedy", "Drama", "Fantasy", "Horror",
  "Mystery", "Romance", "Sci-Fi", "Thriller", "Animation",
];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minYear, setMinYear] = useState(searchParams.get("minYear") ?? "");
  const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") ?? "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genres") ? searchParams.get("genres")!.split(",") : []
  );

  const applyFilters = useCallback(
    (overrides?: {
      search?: string;
      minYear?: string;
      maxYear?: string;
      genres?: string[];
    }) => {
      const s = overrides?.search ?? search;
      const mn = overrides?.minYear ?? minYear;
      const mx = overrides?.maxYear ?? maxYear;
      const g = overrides?.genres ?? selectedGenres;

      const params = new URLSearchParams();
      params.set("page", "1");
      if (s) params.set("search", s);
      if (mn) params.set("minYear", mn);
      if (mx) params.set("maxYear", mx);
      if (g.length > 0) params.set("genres", g.join(","));

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [search, minYear, maxYear, selectedGenres, router, pathname]
  );

  function toggleGenre(genre: string) {
    const next = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(next);
    applyFilters({ genres: next });
  }

  function clearFilters() {
    setSearch("");
    setMinYear("");
    setMaxYear("");
    setSelectedGenres([]);
    startTransition(() => router.push(pathname));
  }

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-xl bg-[#0f0f4a] border border-[#2d2d7a] ${isPending ? "opacity-70" : ""}`}>
      {/* Search + Year filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-40">
          <label className="text-xs text-slate-400 font-medium">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search titles..."
            className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 placeholder-slate-500"
          />
        </div>
        <div className="flex flex-col gap-1 w-24">
          <label className="text-xs text-slate-400 font-medium">Min Year</label>
          <input
            type="number"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            onBlur={() => applyFilters()}
            placeholder="1900"
            className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 placeholder-slate-500"
          />
        </div>
        <div className="flex flex-col gap-1 w-24">
          <label className="text-xs text-slate-400 font-medium">Max Year</label>
          <input
            type="number"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
            onBlur={() => applyFilters()}
            placeholder="2030"
            className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 placeholder-slate-500"
          />
        </div>
        <button
          onClick={() => applyFilters()}
          className="bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="bg-[#1a1a5e] hover:bg-[#2d2d7a] text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors border border-[#2d2d7a]"
        >
          Clear
        </button>
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
              selectedGenres.includes(genre)
                ? "bg-green-500 text-white border-green-500"
                : "bg-transparent text-slate-400 border-[#2d2d7a] hover:border-green-500 hover:text-green-400"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
