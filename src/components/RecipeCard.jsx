import Link from "next/link";
import { ArrowUpRight, Circle } from "@phosphor-icons/react/dist/ssr";
import BrandLogo from "./BrandLogo";
import {
  modelBrand,
  modelName,
  HARDWARE,
  precisionLabel,
  taskLabel,
} from "@/lib/brands";
export function Status({ value }) {
  return (
    <span className={`status status-${value.toLowerCase()}`}>
      <Circle size={6} weight="fill" aria-hidden="true" />
      {value}
    </span>
  );
}
export default function RecipeCard({ recipe: r }) {
  const brand = modelBrand(r.model);
  return (
    <article className="recipe-card">
      <div className="card-top">
        <div className="card-provider">
          <BrandLogo brand={brand} decorative />
          <span>{brand.name}</span>
        </div>
        <ArrowUpRight size={15} />
      </div>
      <h3>
        <Link href={`/models/${r.modelSlug}/`}>{modelName(r.model)}</Link>
      </h3>
      <p className="model-id">{r.model.id}</p>
      <div className="chips">
        <span>{taskLabel(r.model.task)}</span>
        <span>{precisionLabel(r.runtime.precision)}</span>
        <span>{r.runtime.backend.toUpperCase()}</span>
      </div>
      <div className="hardware-line">
        <BrandLogo brand={HARDWARE[r.hardware.vendor]} decorative />
        <div>
          <strong>
            {r.hardware.device_count} × {r.hardware.model}
          </strong>
          <small>{r.engine.name}</small>
        </div>
      </div>
      <div className="card-evidence">
        <Status value={r.deployment.status} />
        <span>
          Acceptance <b>{r.acceptance.verdict}</b>
        </span>
      </div>
      <div className="card-bottom">
        <time dateTime={r.updated_at}>Updated {r.updated_at}</time>
        <Link href={`/recipes/${r.id}/`} aria-label={`View recipe: ${r.title}`}>
          View recipe <ArrowUpRight size={12} />
        </Link>
      </div>
    </article>
  );
}
