import Link from "next/link";
import { humanize } from "@/lib/paths";
export function Status({ value }) {
  return (
    <span className={`status status-${value.toLowerCase()}`}>
      <span aria-hidden="true" />
      {value}
    </span>
  );
}
export default function RecipeCard({ recipe: r }) {
  return (
    <article className="recipe-card">
      <div className="card-top">
        <span className="eyebrow">{r.model.provider}</span>
        <Status value={r.deployment.status} />
      </div>
      <h3>
        <Link href={`/recipes/${r.id}/`}>{r.title}</Link>
      </h3>
      <p className="model-id">{r.model.id}</p>
      <div className="chips">
        <span>{humanize(r.model.task)}</span>
        <span>{r.runtime.precision}</span>
        <span>{r.runtime.backend}</span>
      </div>
      <div className="hardware-line">
        <span className="chip-icon" aria-hidden="true">
          ▦
        </span>
        <div>
          <strong>
            {r.hardware.device_count} × {r.hardware.model}
          </strong>
          <small>
            {r.hardware.vendor} · {r.engine.name}
          </small>
        </div>
      </div>
      <div className="card-evidence">
        <span>
          Acceptance <b>{r.acceptance.verdict}</b>
        </span>
        <time dateTime={r.updated_at}>{r.updated_at}</time>
      </div>
      <div className="card-bottom">
        <Link href={`/models/${r.modelSlug}/`}>Model overview</Link>
        <Link href={`/recipes/${r.id}/`} aria-label={`View recipe: ${r.title}`}>
          View recipe <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
