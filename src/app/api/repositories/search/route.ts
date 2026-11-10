import { NextResponse } from "next/server";
import { GitHubApiError, searchRepositories } from "@/lib/github";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Enter at least two characters." }, { status: 400 });
  }

  try {
    return NextResponse.json({ repositories: await searchRepositories(query) });
  } catch (error) {
    const message = error instanceof GitHubApiError ? error.message : "Search is temporarily unavailable.";
    const status = error instanceof GitHubApiError ? error.status : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
