import { Suspense } from "react";
import { getTitles } from "@/lib/data";
import TitleGrid from "@/components/TitleGrid";
import FilterBar from "@/components/FilterBar";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; minYear?: string; maxYear?: string; genres?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const minYear = params.minYear ? parseInt(params.minYear) : undefined;
  const maxYear = params.maxYear ? parseInt(params.maxYear) : undefined;
  const genres = params.genres ? params.genres.split(",") : undefined;
  const search = params.search ?? undefined;

  const titles = await getTitles({ page, minYear, maxYear, genres, search });

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <FilterBar />
      </Suspense>
      <TitleGrid titles={titles} currentPage={page} basePath="/dashboard" />
    </div>
  );
}
