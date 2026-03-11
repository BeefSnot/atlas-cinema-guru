"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  activity_type: string;
  timestamp: string;
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/favorites", label: "Favorites", icon: "⭐" },
  { href: "/dashboard/watch-later", label: "Watch Later", icon: "🕐" },
];

function activityLabel(type: string): string {
  switch (type) {
    case "FAVORITED":           return "added to favorites";
    case "UNFAVORITED":         return "removed from favorites";
    case "WATCH_LATER":         return "added to watch later";
    case "REMOVED_WATCH_LATER": return "removed from watch later";
    default:                    return type.toLowerCase();
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities?page=1")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setActivities(data); })
      .catch(() => {});
  }, []);

  return (
    /*
     * `group` enables child elements to react to the aside's hover state.
     * Width transitions from w-16 (collapsed, icons only) → w-64 (expanded).
     * `overflow-hidden` prevents content from spilling out while collapsed.
     */
    <aside className="group relative flex flex-col shrink-0 min-h-full overflow-hidden bg-[#0a0a3a] border-r border-[#2d2d7a] transition-[width] duration-300 ease-in-out w-16 hover:w-64">

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex flex-col gap-1 p-2 pt-4">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                isActive
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "text-slate-300 hover:bg-[#1a1a5e] hover:text-white"
              }`}
            >
              {/* Icon is always visible */}
              <span className="text-lg shrink-0">{icon}</span>
              {/* Label fades in when expanded */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Divider + Activity Feed (hidden when collapsed) ─────── */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2 px-4 pt-2 pb-4 overflow-hidden">
        <hr className="border-[#2d2d7a] mb-1" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recent Activity
        </h3>

        {activities.length === 0 ? (
          <p className="text-slate-600 text-xs">No activity yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activities.map((a) => (
              <li key={a.id} className="text-xs text-slate-400">
                <span className="text-slate-300 font-medium">{a.title}</span>{" "}
                <span className="text-slate-500">{activityLabel(a.activity_type)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
