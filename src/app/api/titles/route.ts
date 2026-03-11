import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTitles } from "@/lib/data";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const minYear = searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!) : undefined;
  const maxYear = searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!) : undefined;
  const genresParam = searchParams.get("genres");
  const genres = genresParam ? genresParam.split(",") : undefined;
  const search = searchParams.get("search") ?? undefined;

  const titles = await getTitles({ page, minYear, maxYear, genres, search });
  return NextResponse.json(titles);
}
