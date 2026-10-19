import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import RecipeWorkspace from "@/components/RecipeWorkspace";
export const dynamicParams = false;
export function generateStaticParams() {
  return getCatalog().models.map((m) => ({ modelSlug: m.slug }));
}
export async function generateMetadata({ params }) {
  const { modelSlug } = await params;
  return {
    title:
      getCatalog().models.find((m) => m.slug === modelSlug)?.id ||
      "Model not found",
  };
}
export default async function ModelPage({ params }) {
  const { modelSlug } = await params,
    catalog = getCatalog();
  const model = catalog.models.find((m) => m.slug === modelSlug);
  if (!model) notFound();
  const recipes = catalog.recipes.filter((r) => r.model.id === model.id);
  const hardwareOptions = [
    ...new Map(
      catalog.recipes.map((r) => [
        `${r.hardware.vendor}/${r.hardware.model}/${r.hardware.device_count}`,
        r.hardware,
      ]),
    ).values(),
  ];
  return (
    <RecipeWorkspace
      recipes={recipes}
      initialRecipeId={recipes[0].id}
      hardwareOptions={hardwareOptions}
    />
  );
}
