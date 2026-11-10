# Product specification — RepoPulse

> Status: draft. Product code starts only after this specification is approved through Genesis.

## Problem

Developers evaluating an unfamiliar public GitHub repository must manually inspect its activity, release history, issue backlog, pull requests, and maintenance signals across several pages. RepoPulse provides one readable, evidence-backed snapshot so a developer can quickly decide whether a repository is active, healthy, and worth adopting or contributing to.

## Users

- Developers evaluating libraries before adopting them.
- Open-source contributors choosing projects to participate in.
- Engineering managers comparing the maintenance health of public dependencies.
- Anonymous visitors exploring the public demo.

## Functional requirements

- FR-1: The product shall allow a visitor to search for a public GitHub repository by `owner/name` or repository name.
- FR-2: The product shall display the selected repository's description, language, stars, forks, open issues, open pull requests, license, default branch, and last update time.
- FR-3: The product shall display recent releases and recent repository activity when GitHub provides those records.
- FR-4: The product shall compute a deterministic health score from documented maintenance signals; the score shall be reproducible for the same snapshot.
- FR-5: The product shall show the score breakdown and the source timestamp so users can understand and assess the result.
- FR-6: The product shall handle missing fields, inaccessible repositories, GitHub rate limits, upstream errors, and empty activity without crashing or inventing data.
- FR-7: A visitor shall be able to view a repository without signing in.
- FR-8: A user who signs in with GitHub OAuth shall be able to add and remove public repositories from a personal watchlist.
- FR-9: An authenticated user shall be able to view their watchlist and open any saved repository detail page.
- FR-10: A visitor shall be able to select two or three public repositories and compare their key metrics and health scores.
- FR-11: The product shall cache fetched public repository snapshots with a visible freshness timestamp and reuse a valid cached snapshot when appropriate.
- FR-12: The product shall provide a seeded public demo path that works without GitHub OAuth credentials.
- FR-13: The product shall provide accessible loading, empty, error, and retry states for primary search and detail flows.

## Non-functional requirements

- NFR-1: The application shall be deployable as one web service with a managed PostgreSQL database and documented environment variables.
- NFR-2: Public repository pages shall render the initial shell within two seconds on a normal broadband connection when valid cached data exists.
- NFR-3: All external GitHub responses shall be validated at the application boundary; untrusted response text shall never become executable content.
- NFR-4: GitHub OAuth tokens shall remain server-side, never be written to logs, and never be exposed to the browser.
- NFR-5: Database access shall enforce user ownership for watchlist records and use parameterized queries through the chosen ORM.
- NFR-6: The health score shall be covered by unit tests for fresh, stale, missing-data, and zero-activity cases.
- NFR-7: The application shall pass automated linting, type checking, unit tests, and a production build before deployment.
- NFR-8: Primary flows shall be keyboard accessible and use semantic labels, visible focus states, and readable contrast.
- NFR-9: The public demo shall not require real user data, private repository access, or paid third-party services beyond the selected deployment/database plans.

## Constraints

- The first release supports public GitHub repositories only.
- GitHub is the canonical source for repository facts; RepoPulse stores normalized snapshots and user watchlist metadata, not a replacement GitHub system.
- The first release uses deterministic scoring and no LLM API.
- The initial implementation uses a single Next.js application, PostgreSQL, and GitHub REST API; no Redis, queue, scheduler, or microservices.
- Secrets are provided through deployment environment variables and excluded from Git.
- Repository creation, milestone commits, and production deployment require explicit human-controlled GitHub/Vercel/Neon credentials; the coding agent must not invent credentials.

## Non-goals

- Managing private repositories.
- Creating issues, pull requests, releases, or other GitHub mutations.
- Replacing GitHub, GitHub Actions, or a team project-management system.
- Guaranteeing that a score represents code quality, security, or project success.
- Sending notifications or running an unbounded background crawler.
- Building a Concord clone or embedding Concord as a required product dependency.

## Acceptance criteria

- AC-1: An anonymous visitor can search for a known public repository and reach a detail page with repository facts, freshness timestamp, and a deterministic health score.
- AC-2: A repository detail page clearly distinguishes available data, missing data, stale data, and upstream failure.
- AC-3: The same normalized repository snapshot produces the same score across repeated calculations.
- AC-4: A signed-in user can add a repository to a watchlist, refresh the page, see it persisted, and remove it.
- AC-5: A visitor can compare two public repositories and see aligned metrics and score breakdowns.
- AC-6: A seeded demo route works without OAuth or a GitHub personal access token.
- AC-7: Automated tests cover the health-score rules, GitHub response validation, watchlist ownership, and primary error states.
- AC-8: The production build succeeds, migrations apply to a clean database, and the deployed public URL passes a smoke test for search, detail, comparison, and demo flows.
- AC-9: The repository README documents local setup, environment variables, architecture, scoring rules, deployment, limitations, and the Concord-coordinated milestone history.

## Risks

- GitHub rate limits may restrict anonymous live searches. Mitigation: cache normalized snapshots, show freshness, prefer the seeded demo, and return actionable rate-limit states.
- GitHub API fields and response shapes may change. Mitigation: isolate and validate the GitHub adapter and keep fixture tests for representative responses.
- A single health score can imply more certainty than it deserves. Mitigation: expose the formula, component values, timestamps, and a plain-language limitation.
- OAuth and watchlists add security surface. Mitigation: use a maintained OAuth integration, server-only tokens, minimal scopes, and no GitHub write permissions.
- Deployment credentials or service plans may not be available. Mitigation: keep the app runnable with demo fixtures and document the exact credential boundary before deployment.

## Open questions

None for the first implementation scope. The score weights and freshness duration are implementation decisions that must be documented and tested before the scoring milestone is marked complete.
