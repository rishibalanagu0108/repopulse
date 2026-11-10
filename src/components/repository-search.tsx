"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SearchResult = { full_name: string; description: string | null; stargazers_count: number };

export function RepositorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);

    try {
      const response = await fetch(`/api/repositories/search?q=${encodeURIComponent(query)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Search is temporarily unavailable.");
      setResults(body.repositories);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-form">
      <form onSubmit={submit}>
        <label htmlFor="repository-search">Search public GitHub repositories</label>
        <div className="search-row">
          <input
            id="repository-search"
            name="repository"
            placeholder="Try facebook/react"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Searching..." : "Inspect repository"}
          </button>
        </div>
      </form>
      {error && <p className="search-feedback is-error" role="alert">{error}</p>}
      {!error && !loading && results.length === 0 && <p className="search-feedback">Search results will appear here.</p>}
      {loading && <p className="search-feedback">Reading GitHub&apos;s public index...</p>}
      {results.length > 0 && (
        <div className="search-results" aria-label="Repository search results">
          {results.map((result) => {
            const [owner, name] = result.full_name.split("/");
            return (
              <button
                className="search-result"
                key={result.full_name}
                onClick={() => router.push(`/repository/${owner}/${name}`)}
                type="button"
              >
                <span><strong>{result.full_name}</strong><small>{result.description ?? "No description provided."}</small></span>
                <span className="result-stars">★ {result.stargazers_count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
