import { describe, expect, it } from "vitest";
import { GitHubApiError } from "@/lib/github";

describe("GitHub API boundary", () => {
  it("exposes actionable upstream errors", () => {
    const error = new GitHubApiError(429, "GitHub rate limit reached. Try again shortly.");
    expect(error.status).toBe(429);
    expect(error.message).toContain("rate limit");
  });
});
