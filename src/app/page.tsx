import { RepositorySearch } from "@/components/repository-search";

export default function Home() {
  return (
    <div className="app-frame">
      <aside className="rail">
        <div className="brand-lockup">
          <span className="brand-mark">R</span>
          <span>RepoPulse</span>
        </div>
        <nav className="rail-nav" aria-label="Primary navigation">
          <a className="rail-link is-active" href="#overview">
            Overview
          </a>
          <span className="rail-link is-planned">
            Watchlist <span className="rail-count">M2</span>
          </span>
          <span className="rail-link is-planned">
            Compare <span className="rail-count">M3</span>
          </span>
        </nav>
        <div className="rail-footer">
          <span className="status-dot" aria-hidden="true" />
          <span>Public data only</span>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">Repository intelligence</p>
            <h1>Know what you&apos;re adopting.</h1>
          </div>
          <span className="profile-button is-planned">GitHub sign-in · M2</span>
        </header>

        <section className="search-panel" aria-labelledby="search-heading">
          <div>
            <p className="eyebrow">Start with a repository</p>
            <h2 id="search-heading">Read the signals behind the stars.</h2>
            <p className="muted-copy">
              Activity, maintenance, and momentum in one clear snapshot.
            </p>
          </div>
          <RepositorySearch />
        </section>

        <section className="section-block" aria-labelledby="sample-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sample view</p>
              <h2 id="sample-heading">facebook / react</h2>
            </div>
            <span className="freshness">Updated 14 minutes ago</span>
          </div>

          <div className="metric-grid">
            <article className="metric-card metric-card-score">
              <span className="metric-label">Health score</span>
              <strong>86<span>/100</span></strong>
              <span className="score-note"><i /> Strong maintenance signals</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Open issues</span>
              <strong>1,842</strong>
              <span className="metric-change">−8.2% over 30 days</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Latest release</span>
              <strong>v19.1.0</strong>
              <span className="metric-change">Published 6 days ago</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Community</span>
              <strong>24.8k</strong>
              <span className="metric-change">Contributors this year</span>
            </article>
          </div>

          <div className="detail-grid">
            <article className="panel score-panel">
              <div className="panel-heading">
                <h3>What shapes the score</h3>
                <span className="panel-meta">Transparent formula</span>
              </div>
              <div className="score-row"><span>Release cadence</span><strong>92</strong><div className="score-bar"><i style={{ width: "92%" }} /></div></div>
              <div className="score-row"><span>Issue movement</span><strong>81</strong><div className="score-bar"><i style={{ width: "81%" }} /></div></div>
              <div className="score-row"><span>Pull request flow</span><strong>88</strong><div className="score-bar"><i style={{ width: "88%" }} /></div></div>
              <div className="score-row"><span>Recent activity</span><strong>84</strong><div className="score-bar"><i style={{ width: "84%" }} /></div></div>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading">
                <h3>Recent activity</h3>
                <span className="panel-meta">Last 30 days</span>
              </div>
              <div className="activity-list">
                <div><span className="activity-type type-release">Release</span><span>v19.1.0 published</span><time>6d</time></div>
                <div><span className="activity-type type-merge">Merged</span><span>Improve hydration warning</span><time>8d</time></div>
                <div><span className="activity-type type-issue">Issue</span><span>DevTools source map regression</span><time>11d</time></div>
                <div><span className="activity-type type-merge">Merged</span><span>Refine server component docs</span><time>14d</time></div>
              </div>
            </article>
          </div>
        </section>

        <footer className="page-footer">
          <span>Scores are signals, not verdicts.</span>
          <span>Source: GitHub public API · Demo data</span>
        </footer>
      </main>
    </div>
  );
}
