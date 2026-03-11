import { auth } from "@/auth";
import { getWatchLater } from "@/lib/data";
import TitleGrid from "@/components/TitleGrid";

export default async function WatchLaterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const titles = await getWatchLater({ page, userId: session!.user!.id! });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white">Watch Later</h2>
      <TitleGrid titles={titles} currentPage={page} basePath="/dashboard/watch-later" />
    </div>
  );
}
