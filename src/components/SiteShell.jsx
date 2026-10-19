"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  MagnifyingGlass,
  ArrowUpRight,
  CaretRight,
  List,
  X,
  GithubLogo,
  BookOpen,
  SquaresFour,
} from "@phosphor-icons/react";
import BrandLogo from "./BrandLogo";
import { assetPath } from "@/lib/paths";
import { modelName, providerGroups } from "@/lib/brands";

const SearchContext = createContext({ query: "", setQuery: () => {} });
export const useCatalogSearch = () => useContext(SearchContext);
export default function SiteShell({ catalog, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const search = useRef(null);
  const groups = providerGroups(catalog.models);
  const active =
    catalog.recipes.find(
      (r) =>
        pathname === `/recipes/${r.id}/` || pathname === `/recipes/${r.id}`,
    )?.modelSlug ||
    catalog.models.find((m) => pathname.includes(`/models/${m.slug}`))?.slug;
  const matches = catalog.models.filter((m) =>
    `${m.id} ${m.provider}`.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    function shortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  function selectModel() {
    setQuery("");
    setMobileOpen(false);
  }
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-brand">
            <button
              className="icon-button mobile-menu"
              aria-label={
                mobileOpen ? "Close model navigation" : "Open model navigation"
              }
              aria-expanded={mobileOpen}
              aria-controls="model-navigation"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X /> : <List />}
            </button>
            <Link
              href="/"
              className="brand"
              aria-label="InferMatrixLab Recipes home"
              onClick={selectModel}
            >
              <img
                src={assetPath("/assets/infermatrix-logo.png")}
                alt="InferMatrix"
                width="151"
                height="50"
              />
              <span className="brand-divider">/</span>
              <strong>Recipes</strong>
            </Link>
          </div>
          <div className="global-search-wrap">
            <form
              className="global-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                router.push("/#catalog");
              }}
            >
              <MagnifyingGlass size={17} />
              <label className="sr-only" htmlFor="global-search">
                Search models or providers
              </label>
              <input
                ref={search}
                id="global-search"
                type="search"
                placeholder="Search models or providers…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              <kbd>Ctrl K</kbd>
            </form>
            {query && pathname !== "/" && (
              <div className="search-results" aria-label="Model search results">
                <span className="section-kicker">
                  MODELS · {matches.length}
                </span>
                {matches.length ? (
                  matches.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/models/${m.slug}/`}
                      onClick={selectModel}
                    >
                      {modelName(m)}
                      <ArrowUpRight />
                    </Link>
                  ))
                ) : (
                  <p>No matching models.</p>
                )}
                <button
                  onClick={() => {
                    router.push("/#catalog");
                    setMobileOpen(false);
                  }}
                >
                  Search all recipes <ArrowUpRight />
                </button>
              </div>
            )}
          </div>
          <nav className="header-links" aria-label="Main navigation">
            <Link href="/" onClick={selectModel}>
              Browse
            </Link>
            <a href="https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template">
              Docs
            </a>
            <a href="https://github.com/InferMatrixLab/recipe">
              <GithubLogo size={16} /> GitHub
            </a>
          </nav>
        </div>
      </header>
      <div className="site-frame">
        {mobileOpen && (
          <button
            className="sidebar-backdrop"
            aria-label="Close model navigation"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          id="model-navigation"
          className={`model-navigation ${mobileOpen ? "is-open" : ""}`}
          aria-label="Providers and models"
        >
          <Link
            className={`all-models ${!active && pathname === "/" ? "active" : ""}`}
            href="/"
            onClick={selectModel}
          >
            <SquaresFour size={17} /> All recipes{" "}
            <span>{catalog.recipes.length}</span>
          </Link>
          <div className="sidebar-heading">
            PROVIDERS <span>{groups.length}</span>
          </div>
          {groups.map((provider) => (
            <details className="provider-group" key={provider.id} open>
              <summary>
                <BrandLogo brand={provider} decorative />
                <span>{provider.name}</span>
                <small>{provider.models.length}</small>
                <CaretRight className="provider-caret" size={12} />
              </summary>
              <div className="provider-models">
                {provider.models.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${m.slug}/`}
                    onClick={selectModel}
                    className={active === m.slug ? "active" : ""}
                    aria-current={active === m.slug ? "page" : undefined}
                  >
                    <span>{modelName(m)}</span>
                    {m.provider === "mlx-community" && (
                      <small>MLX · quantized checkpoint</small>
                    )}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <div className="sidebar-footer">
            <BookOpen size={16} />
            <div>
              <b>Bring your engine.</b>
              <a href="https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template">
                Start with the template <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </aside>
        <div className="content-column">
          {children}
          <footer className="site-footer">
            <span>
              InferMatrixLab <span className="footer-separator">/</span>{" "}
              Community-maintained inference recipes
            </span>
            <a href="https://github.com/InferMatrixLab/recipe/blob/main/NOTICE">
              Sources & licenses <ArrowUpRight size={12} />
            </a>
          </footer>
        </div>
      </div>
    </SearchContext.Provider>
  );
}
