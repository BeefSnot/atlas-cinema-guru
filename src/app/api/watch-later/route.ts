import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWatchLater } from "@/lib/data";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");

  const titles = await getWatchLater({ page, userId: session.user.id });
  return NextResponse.json(titles);
}
