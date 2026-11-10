import { NextResponse } from "next/server";
import { getRepositorySnapshot, GitHubApiError } from "@/lib/github";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ owner: string; name: string }> },
) {
  const { owner, name } = await params;

  try {
    return NextResponse.json(await getRepositorySnapshot(owner, name));
  } catch (error) {
    const message = error instanceof GitHubApiError ? error.message : "Repository is temporarily unavailable.";
    const status = error instanceof GitHubApiError ? error.status : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
