import { getCatalog } from "@/lib/catalog";
import RecipeFilters from "@/components/RecipeFilters";
export default function Home() {
  const catalog = getCatalog();
  return (
    <main id="main" className="browse-page">
      <div className="page-heading">
        <div>
          <span className="section-kicker">INFERMATRIXLAB / MODEL CATALOG</span>
          <h1>
            Inference recipes<span className="title-dot">.</span>
          </h1>
          <p>Choose a model. Match your hardware. Get the commands.</p>
        </div>
        <div className="catalog-totals">
          <strong>{catalog.models.length}</strong> models <span>/</span>{" "}
          <strong>{catalog.engines.length}</strong> engines
        </div>
      </div>
      <RecipeFilters recipes={catalog.recipes} />
    </main>
  );
}
