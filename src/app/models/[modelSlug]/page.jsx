import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import RecipeCard from "@/components/RecipeCard";
export const dynamicParams = false;
export function generateStaticParams() {
  return getCatalog().models.map((m) => ({ modelSlug: m.slug }));
}
export async function generateMetadata({ params }) {
  const { modelSlug } = await params;
  const m = getCatalog().models.find((x) => x.slug === modelSlug);
  return { title: m?.id || "Model not found" };
}
export default async function ModelPage({ params }) {
  const { modelSlug } = await params,
    catalog = getCatalog();
  const model = catalog.models.find((x) => x.slug === modelSlug);
  if (!model) notFound();
  const recipes = catalog.recipes.filter((r) => r.model.id === model.id);
  return (
    <main id="main" className="page-container detail-page">
      <Link className="back-link" href="/">
        ← All recipes
      </Link>
      <p className="eyebrow">{model.provider} / MODEL OVERVIEW</p>
      <h1>{model.id}</h1>
      <p className="lede">
        {recipes.length} documented{" "}
        {recipes.length === 1 ? "configuration" : "configurations"} across{" "}
        {model.engineIds.length}{" "}
        {model.engineIds.length === 1 ? "engine" : "engines"}. Each recipe
        applies to its listed hardware and runtime.
      </p>
      <section className="model-engines">
        <h2>Available engines</h2>
        {model.engineIds.map((id) => (
          <span key={id} className="engine-pill">
            {catalog.engines.find((e) => e.id === id).name}
          </span>
        ))}
      </section>
      <div className="recipe-grid">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </main>
  );
}
