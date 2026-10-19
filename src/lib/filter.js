export function filterRecipes(recipes, filters = {}) {
  const q = (filters.q || "").trim().toLowerCase();
  return recipes.filter(
    (r) =>
      (!q ||
        `${r.title} ${r.model.id} ${r.model.provider} ${r.engine.name} ${r.engine.id}`
          .toLowerCase()
          .includes(q)) &&
      (!filters.task || r.model.task === filters.task) &&
      (!filters.vendor || r.hardware.vendor === filters.vendor) &&
      (!filters.hardware || r.hardware.model === filters.hardware) &&
      (!filters.backend || r.runtime.backend === filters.backend) &&
      (!filters.engine || r.engine.id === filters.engine) &&
      (!filters.status || r.deployment.status === filters.status),
  );
}
