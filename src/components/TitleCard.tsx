"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Title } from "@/lib/data";

export default function TitleCard({ title }: { title: Title }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [favorited, setFavorited] = useState(title.favorited ?? false);
  const [watchLater, setWatchLater] = useState(title.watchLater ?? false);

  async function toggleFavorite() {
    const method = favorited ? "DELETE" : "POST";
    setFavorited(!favorited);
    await fetch(`/api/favorites/${title.id}`, { method });
    startTransition(() => router.refresh());
  }

  async function toggleWatchLater() {
    const method = watchLater ? "DELETE" : "POST";
    setWatchLater(!watchLater);
    await fetch(`/api/watch-later/${title.id}`, { method });
    startTransition(() => router.refresh());
  }

  const genreColors: Record<string, string> = {
    "Action": "bg-red-500/20 text-red-400",
    "Comedy": "bg-yellow-500/20 text-yellow-400",
    "Drama": "bg-blue-500/20 text-blue-400",
    "Fantasy": "bg-purple-500/20 text-purple-400",
    "Horror": "bg-gray-500/20 text-gray-300",
    "Mystery": "bg-indigo-500/20 text-indigo-400",
    "Romance": "bg-pink-500/20 text-pink-400",
    "Sci-Fi": "bg-cyan-500/20 text-cyan-400",
    "Thriller": "bg-orange-500/20 text-orange-400",
    "Animation": "bg-green-500/20 text-green-400",
  };

  const genreClass = genreColors[title.genre] ?? "bg-slate-500/20 text-slate-400";

  return (
      <div className={`title-card relative rounded-xl overflow-hidden border border-[#2d2d7a] bg-[#0f0f4a] group transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${isPending ? "opacity-70" : ""}`}>
        {/* Poster / Image area */}
        <div className="relative h-64 bg-gradient-to-br from-[#1a1a5e] to-[#0a0a3a] flex items-center justify-center overflow-hidden">
          {title.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={title.image} alt={title.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl select-none">🎬</span>
          )}

          {/* Hover Overlay with info and actions */}
          <div className="title-overlay absolute inset-0 bg-[#0f0f4a]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col p-4 backdrop-blur-sm">
            {/* Hover details */}
            <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 mb-1">
              {title.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${genreClass}`}>
                {title.genre}
              </span>
              <span className="text-slate-300 text-xs font-semibold">{title.released}</span>
            </div>
            <p className="text-slate-200 text-xs flex-1 text-ellipsis overflow-hidden leading-relaxed">
              {title.synopsis}
            </p>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center mt-3 border-t border-[#2d2d7a] pt-3">
              <button
                onClick={toggleFavorite}
                title={favorited ? "Remove from favorites" : "Add to favorites"}
                className={`transition-transform hover:scale-110 flex items-center justify-center ${
                  favorited ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : "text-slate-400 hover:text-white"
                }`}
              >
                {/* SVG Star: outline if not favorited, filled if favorited */}
                <svg className="w-8 h-8" fill={favorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
              <button
                onClick={toggleWatchLater}
                title={watchLater ? "Remove from watch later" : "Add to watch later"}
                className={`transition-transform hover:scale-110 flex items-center justify-center ${
                  watchLater ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "text-slate-400 hover:text-white"
                }`}
              >
                {/* SVG Clock: outline if not watch later, filled if watch later */}
                <svg className="w-8 h-8" fill={watchLater ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Card info (always visible) */}
        <div className="p-3 flex items-center justify-between bg-[#0f0f4a]">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-1 flex-1 pr-2">
            {title.title}
          </h3>
          <span className="text-slate-400 text-xs shrink-0">{title.released}</span>
        </div>
      </div>
  );
}
