"use client";
import { useState } from "react";
import {
  ArrowCounterClockwise,
  FadersHorizontal,
  Cpu,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import RecipeCard from "./RecipeCard";
import ConfigurationRow from "./ConfigurationRow";
import BrandLogo from "./BrandLogo";
import { useCatalogSearch } from "./SiteShell";
import { filterRecipes } from "@/lib/filter";
import {
  HARDWARE,
  hardwareModelLabel,
  precisionLabel,
  taskLabel,
} from "@/lib/brands";
const unique = (values) => [...new Set(values)].sort();
export default function RecipeFilters({ recipes }) {
  const { query, setQuery } = useCatalogSearch();
  const [filters, setFilters] = useState({});
  const hardwareVendors = [
    ...new Set([
      ...Object.keys(HARDWARE),
      ...unique(recipes.map((r) => r.hardware.vendor)),
    ]),
  ].filter((vendor) => recipes.some((r) => r.hardware.vendor === vendor));
  const update = (key, value) =>
    setFilters((old) => ({ ...old, [key]: old[key] === value ? "" : value }));
  const results = filterRecipes(recipes, { ...filters, q: query });
  const count = Object.values(filters).filter(Boolean).length + (query ? 1 : 0);
  function clear() {
    setFilters({});
    setQuery("");
  }
  function pill(key, value, label = value) {
    return (
      <button
        key={value}
        type="button"
        className={`config-pill ${filters[key] === value ? "selected" : ""}`}
        aria-pressed={filters[key] === value}
        onClick={() => update(key, value)}
      >
        {label}
      </button>
    );
  }
  return (
    <section id="catalog" className="catalog-section">
      <div className="filter-toolbar">
        <h2>
          <FadersHorizontal size={16} /> Refine recipes
        </h2>
        <button className="reset-button" onClick={clear}>
          <ArrowCounterClockwise size={13} /> Reset
          {count > 0 ? ` (${count})` : ""}
        </button>
      </div>
      <div className="configuration-panel" aria-label="Recipe filters">
        <ConfigurationRow label="TASK">
          <div className="pill-group">
            {unique(recipes.map((r) => r.model.task)).map((value) =>
              pill("task", value, taskLabel(value)),
            )}
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="HARDWARE">
          {hardwareVendors.map((vendor) => (
            <div className="hardware-group" key={vendor}>
              <button
                className={`vendor-label ${filters.vendor === vendor ? "selected" : ""}`}
                aria-label={`Filter ${vendor} hardware`}
                aria-pressed={filters.vendor === vendor}
                onClick={() => {
                  setFilters((old) => ({
                    ...old,
                    vendor: old.vendor === vendor ? "" : vendor,
                    hardware: "",
                  }));
                }}
              >
                <BrandLogo brand={HARDWARE[vendor]} decorative />
                <span>{HARDWARE[vendor]?.name || vendor}</span>
              </button>
              <div className="pill-group">
                {unique(
                  recipes
                    .filter((r) => r.hardware.vendor === vendor)
                    .map((r) => hardwareModelLabel(r.hardware)),
                ).map((value) => pill("hardware", value))}
              </div>
            </div>
          ))}
        </ConfigurationRow>
        <ConfigurationRow label="ENGINE">
          <div className="pill-group">
            {unique(recipes.map((r) => r.engine.id)).map((id) =>
              pill(
                "engine",
                id,
                recipes.find((r) => r.engine.id === id).engine.name,
              ),
            )}
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="PRECISION">
          <div className="pill-group">
            {unique(recipes.map((r) => r.runtime.precision)).map((value) =>
              pill("precision", value, precisionLabel(value)),
            )}
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="DEPLOYMENT">
          <div className="pill-group">
            {unique(recipes.map((r) => r.deployment.status)).map((value) =>
              pill("status", value),
            )}
            <span className="row-hint">
              Deployment and performance acceptance are tracked separately.
            </span>
          </div>
        </ConfigurationRow>
      </div>
      <div className="result-heading">
        <h2>
          Explore models <span>{results.length}</span>
        </h2>
        <div className="result-count" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "recipe" : "recipes"}
          {query ? ` matching “${query}”` : " · Source-pinned configurations"}
        </div>
      </div>
      {results.length ? (
        <div className="recipe-grid">
          {results.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MagnifyingGlass size={30} />
          <h3>No matching recipes</h3>
          <p>Try another model, or reset your filters.</p>
          <button className="primary-button" onClick={clear}>
            Reset filters
          </button>
        </div>
      )}
      <div className="catalog-note">
        <Cpu size={16} />
        <span>
          Only the listed model and hardware combinations are documented. Review
          the source and verification scope before deployment.
        </span>
      </div>
    </section>
  );
}
