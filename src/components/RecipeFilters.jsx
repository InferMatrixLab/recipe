"use client";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import { filterRecipes } from "@/lib/filter";
import { humanize } from "@/lib/paths";
const definitions = [
  ["task", "Task", (r) => r.model.task],
  ["vendor", "Hardware vendor", (r) => r.hardware.vendor],
  ["hardware", "Device model", (r) => r.hardware.model],
  ["backend", "Backend", (r) => r.runtime.backend],
  ["engine", "Engine", (r) => r.engine.id],
  ["status", "Deployment status", (r) => r.deployment.status],
];
export default function RecipeFilters({ recipes }) {
  const [filters, setFilters] = useState({});
  const update = (key, value) =>
    setFilters((old) => ({ ...old, [key]: value }));
  const results = filterRecipes(recipes, filters);
  const count = Object.values(filters).filter(Boolean).length;
  return (
    <section id="catalog" className="catalog-section">
      <div className="section-title">
        <div>
          <span className="eyebrow">THE CATALOG</span>
          <h2>One model. Your hardware.</h2>
        </div>
        <span className="subtle">Every combination has its own recipe.</span>
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel" aria-label="Recipe filters">
          <div className="filter-heading">
            <h3>Refine recipes</h3>
            <button className="text-button" onClick={() => setFilters({})}>
              Clear{count ? ` (${count})` : ""}
            </button>
          </div>
          {definitions.map(([key, label, read]) => (
            <label key={key} className="filter-label" htmlFor={`filter-${key}`}>
              {label}
              <select
                id={`filter-${key}`}
                value={filters[key] || ""}
                onChange={(e) => update(key, e.target.value)}
              >
                <option value="">All {label.toLowerCase()}</option>
                {[...new Set(recipes.map(read))].sort().map((value) => (
                  <option key={value} value={value}>
                    {humanize(value)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <div className="filter-note">
            <b>Read the evidence.</b>
            <p>
              Deployment status and performance acceptance are tracked
              separately. Unlisted combinations are unknown.
            </p>
          </div>
        </aside>
        <div className="results-panel">
          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="recipe-search">
              Search models or engines
            </label>
            <input
              id="recipe-search"
              type="search"
              placeholder="Search a model, provider or engine…"
              value={filters.q || ""}
              onChange={(e) => update("q", e.target.value)}
            />
            <kbd aria-hidden="true">SEARCH</kbd>
          </div>
          <div className="result-count" role="status" aria-live="polite">
            <b>{results.length}</b>{" "}
            {results.length === 1 ? "recipe" : "recipes"}{" "}
            <span>· Exact configurations, source included</span>
          </div>
          {results.length ? (
            <div className="recipe-grid">
              {results.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">∅</span>
              <h3>No matching recipes</h3>
              <p>
                Try another search or clear a filter. An unlisted configuration
                has no support claim.
              </p>
              <button className="primary-button" onClick={() => setFilters({})}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
