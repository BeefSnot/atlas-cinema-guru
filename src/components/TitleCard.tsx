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
      <div className="relative h-48 bg-gradient-to-br from-[#1a1a5e] to-[#0a0a3a] flex items-center justify-center overflow-hidden">
        <span className="text-6xl select-none">🎬</span>
        {/* Overlay with actions */}
        <div className="title-overlay absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4">
          <p className="text-white text-xs text-center line-clamp-3">{title.synopsis}</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={toggleFavorite}
              title={favorited ? "Remove from favorites" : "Add to favorites"}
              className={`p-2 rounded-full transition-colors ${
                favorited
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white/10 text-white hover:bg-yellow-400 hover:text-gray-900"
              }`}
            >
              ⭐
            </button>
            <button
              onClick={toggleWatchLater}
              title={watchLater ? "Remove from watch later" : "Add to watch later"}
              className={`p-2 rounded-full transition-colors ${
                watchLater
                  ? "bg-green-400 text-gray-900"
                  : "bg-white/10 text-white hover:bg-green-400 hover:text-gray-900"
              }`}
            >
              🕐
            </button>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {title.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${genreClass}`}>
            {title.genre}
          </span>
          <span className="text-slate-400 text-xs">{title.released}</span>
        </div>
      </div>
    </div>
  );
}
