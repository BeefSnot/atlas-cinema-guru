import { Suspense } from "react";
import TitleCard from "@/components/TitleCard";
import Pagination from "@/components/Pagination";
import type { Title } from "@/lib/data";

export default function TitleGrid({
  titles,
  currentPage,
  basePath,
}: {
  titles: Title[];
  currentPage: number;
  basePath: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {titles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <span className="text-5xl mb-4">🎬</span>
          <p className="text-lg">No movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {titles.map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      )}
      <Suspense>
        <Pagination
          currentPage={currentPage}
          hasMore={titles.length === 6}
          basePath={basePath}
        />
      </Suspense>
    </div>
  );
}
