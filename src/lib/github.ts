import { z } from "zod";

const githubRepositorySchema = z.object({
  id: z.number(),
  full_name: z.string(),
  name: z.string(),
  owner: z.object({ login: z.string() }),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  watchers_count: z.number(),
  default_branch: z.string(),
  pushed_at: z.string().nullable(),
  updated_at: z.string(),
  created_at: z.string(),
  license: z.object({ spdx_id: z.string().nullable() }).nullable(),
});

const githubSearchSchema = z.object({
  total_count: z.number(),
  items: z.array(githubRepositorySchema),
});

const githubReleaseSchema = z.object({
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullable(),
  published_at: z.string().nullable(),
  html_url: z.string().url(),
});

const githubEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  created_at: z.string().nullable(),
  repo: z.object({ name: z.string() }).optional(),
});

export type GitHubRepository = z.infer<typeof githubRepositorySchema>;
export type GitHubRelease = z.infer<typeof githubReleaseSchema>;
export type GitHubEvent = z.infer<typeof githubEventSchema>;

export type RepositorySnapshot = {
  repository: GitHubRepository;
  releases: GitHubRelease[];
  activity: GitHubEvent[];
  fetchedAt: string;
  fromCache: boolean;
};

export class GitHubApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGitHub<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: headers(),
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new GitHubApiError(429, "GitHub rate limit reached. Try again shortly.");
    }
    if (response.status === 404) {
      throw new GitHubApiError(404, "Repository not found or not publicly accessible.");
    }
    throw new GitHubApiError(502, "GitHub could not provide repository data.");
  }

  const result = schema.safeParse(await response.json());
  if (!result.success) {
    throw new GitHubApiError(502, "GitHub returned an unexpected response.");
  }

  return result.data;
}

async function fetchOptional<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  try {
    return await fetchGitHub(path, schema);
  } catch {
    return [] as T;
  }
}

export async function searchRepositories(query: string) {
  const response = await fetchGitHub(
    `/search/repositories?q=${encodeURIComponent(query)}&per_page=8`,
    githubSearchSchema,
  );

  return response.items;
}

export async function getRepositorySnapshot(
  owner: string,
  name: string,
): Promise<RepositorySnapshot> {
  const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  const repository = await fetchGitHub(path, githubRepositorySchema);
  const [releases, activity] = await Promise.all([
    fetchOptional(`${path}/releases?per_page=5`, z.array(githubReleaseSchema)),
    fetchOptional(`${path}/events?per_page=8`, z.array(githubEventSchema)),
  ]);

  return {
    repository,
    releases,
    activity,
    fetchedAt: new Date().toISOString(),
    fromCache: true,
  };
}
