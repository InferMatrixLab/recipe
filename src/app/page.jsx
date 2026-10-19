import { getCatalog } from "@/lib/catalog";
import RecipeFilters from "@/components/RecipeFilters";
export default function Home() {
  const catalog = getCatalog();
  const vendors = [
    ...new Set(catalog.recipes.map((r) => r.hardware.vendor)),
  ].sort();
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> INFERMATRIXLAB / ENGINE RECIPES
            </p>
            <h1>
              Find your
              <br />
              inference <em>recipe.</em>
            </h1>
            <p className="hero-description">
              A model, an engine, your hardware.
              <br />
              Find a documented path from source to first request.
            </p>
            <a className="hero-cta" href="#catalog">
              Explore the catalog <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div
            className="hero-diagram"
            aria-label="Recipe connects a model and hardware to commands and evidence"
          >
            <div className="diagram-label">
              THE DEPLOYMENT PATH <span>01 — 04</span>
            </div>
            <div className="diagram-input">
              <div>
                <small>01 / MODEL</small>
                <strong>Choose your model</strong>
                <span>Language · speech · image</span>
              </div>
              <div>
                <small>02 / HARDWARE</small>
                <strong>Match the device</strong>
                <span>{vendors.join(" · ")}</span>
              </div>
            </div>
            <div className="diagram-connector" aria-hidden="true">
              ↓
            </div>
            <div className="diagram-recipe">
              <span className="diagram-symbol" aria-hidden="true">
                ⌘
              </span>
              <div>
                <small>03 / RECIPE</small>
                <strong>Source-pinned. Ready to inspect.</strong>
                <span>Environment → install → run → request</span>
              </div>
            </div>
            <div className="diagram-evidence">
              <span aria-hidden="true">↳</span>
              <div>
                <small>04 / EVIDENCE</small>
                <strong>Know what has been verified.</strong>
              </div>
              <span className="evidence-mark" aria-hidden="true">
                ◎
              </span>
            </div>
          </div>
        </div>
        <div className="stats-row">
          <div>
            <b>{String(catalog.recipes.length).padStart(2, "0")}</b>
            <span>documented recipes</span>
          </div>
          <div>
            <b>{String(catalog.models.length).padStart(2, "0")}</b>
            <span>models</span>
          </div>
          <div>
            <b>{String(catalog.engines.length).padStart(2, "0")}</b>
            <span>engines</span>
          </div>
          <div className="stats-note">
            Specific hardware.
            <br />
            Visible verification status.
          </div>
        </div>
      </section>
      <div className="page-container">
        <RecipeFilters recipes={catalog.recipes} />
        <section className="contribute-strip">
          <span className="eyebrow">BUILD → VERIFY → SHARE</span>
          <h2>Your next engine starts here.</h2>
          <p>
            Use the InferRSI delivery template. Keep the recipe with your
            engine, then bring it to the catalog.
          </p>
          <a href="https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template">
            Open engine template <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </main>
  );
}
