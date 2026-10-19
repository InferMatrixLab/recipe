const fields = {
  hardware: (r) =>
    `${r.hardware.vendor}/${r.hardware.model}/${r.hardware.device_count}`,
  precision: (r) => r.runtime.precision,
  engine: (r) => r.engine.id,
  backend: (r) => r.runtime.backend,
  task: (r) => r.model.task,
};
export const configurationValue = (r, field) => fields[field](r);
export function selectConfiguration(recipes, current, field, value) {
  // Navigation always selects a whole recorded recipe, never a synthetic command.
  const matches = recipes.filter(
    (r) => r.model.id === current.model.id && fields[field](r) === value,
  );
  const score = (r) =>
    Object.entries(fields).filter(
      ([key, read]) => key !== field && read(r) === read(current),
    ).length;
  return (
    matches.sort(
      (a, b) => score(b) - score(a) || a.id.localeCompare(b.id),
    )[0] || null
  );
}
