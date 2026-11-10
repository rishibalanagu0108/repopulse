import Link from "next/link";
import { getRepositorySnapshot, GitHubApiError } from "@/lib/github";

export default async function RepositoryPage({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}) {
  const { owner, name } = await params;
  let snapshot;
  let errorMessage;

  try {
    snapshot = await getRepositorySnapshot(owner, name);
  } catch (error) {
    errorMessage = error instanceof GitHubApiError ? error.message : "Repository is temporarily unavailable.";
  }

  if (!snapshot) {
    return <main className="repository-page"><Link className="back-link" href="/">← Back to overview</Link><div className="error-panel" role="alert"><p className="eyebrow">Unable to load repository</p><h1>{errorMessage}</h1><p>Try again in a moment or return to the overview.</p><Link className="primary-button" href="/">Return to search</Link></div></main>;
  }

  const { repository, releases, activity } = snapshot;
  return (
    <main className="repository-page">
      <Link className="back-link" href="/">← Back to overview</Link>
      <div className="repository-header">
        <div><p className="eyebrow">Public repository</p><h1>{repository.full_name}</h1><p className="repository-description">{repository.description ?? "No description provided."}</p></div>
        <a className="profile-button" href={repository.html_url} rel="noreferrer" target="_blank">Open on GitHub ↗</a>
      </div>
      <div className="repository-meta"><span>{repository.language ?? "Unknown language"}</span><span>★ {repository.stargazers_count.toLocaleString()}</span><span>⑂ {repository.forks_count.toLocaleString()} forks</span><span>Updated {new Date(repository.updated_at).toLocaleDateString()}</span></div>
      <section className="repository-grid">
        <article className="panel repository-score"><p className="eyebrow">Snapshot</p><strong>Ready for scoring</strong><p>Health scoring arrives in M3. This live snapshot was fetched with a 15-minute revalidation window.</p><span className="freshness">Fetched {new Date(snapshot.fetchedAt).toLocaleTimeString()}</span></article>
        <article className="panel"><div className="panel-heading"><h2>Repository signals</h2><span className="panel-meta">Current</span></div><div className="signal-list"><div><span>Open issues</span><strong>{repository.open_issues_count.toLocaleString()}</strong></div><div><span>Watchers</span><strong>{repository.watchers_count.toLocaleString()}</strong></div><div><span>Default branch</span><strong>{repository.default_branch}</strong></div><div><span>License</span><strong>{repository.license?.spdx_id ?? "Not listed"}</strong></div></div></article>
        <article className="panel"><div className="panel-heading"><h2>Latest releases</h2><span className="panel-meta">{releases.length}</span></div><div className="activity-list">{releases.length ? releases.map((release) => <div key={release.id}><span className="activity-type type-release">Release</span><span>{release.name || release.tag_name}</span><time>{release.published_at ? new Date(release.published_at).toLocaleDateString() : "—"}</time></div>) : <p className="muted-copy">No public releases found.</p>}</div></article>
        <article className="panel"><div className="panel-heading"><h2>Recent events</h2><span className="panel-meta">{activity.length}</span></div><div className="activity-list">{activity.length ? activity.map((event) => <div key={event.id}><span className="activity-type type-merge">{event.type.replace("Event", "")}</span><span>{event.repo?.name ?? repository.full_name}</span><time>{event.created_at ? new Date(event.created_at).toLocaleDateString() : "—"}</time></div>) : <p className="muted-copy">No recent public events found.</p>}</div></article>
      </section>
    </main>
  );
}
