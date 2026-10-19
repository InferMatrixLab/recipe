import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import RecipeWorkspace from "@/components/RecipeWorkspace";
export const dynamicParams = false;
export function generateStaticParams() {
  return getCatalog().recipes.map((r) => ({ recipeId: r.id }));
}
export async function generateMetadata({ params }) {
  const { recipeId } = await params;
  return {
    title:
      getCatalog().recipes.find((r) => r.id === recipeId)?.title ||
      "Recipe not found",
  };
}
export default async function RecipePage({ params }) {
  const { recipeId } = await params,
    catalog = getCatalog();
  const recipe = catalog.recipes.find((r) => r.id === recipeId);
  if (!recipe) notFound();
  const recipes = catalog.recipes.filter((r) => r.model.id === recipe.model.id);
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
      initialRecipeId={recipeId}
      hardwareOptions={hardwareOptions}
    />
  );
}
