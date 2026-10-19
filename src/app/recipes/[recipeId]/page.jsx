import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { humanize } from "@/lib/paths";
import { Status } from "@/components/RecipeCard";
import DeploymentCommands from "@/components/DeploymentCommands";
import SourceText from "@/components/SourceText";
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
  const { recipeId } = await params;
  const r = getCatalog().recipes.find((x) => x.id === recipeId);
  if (!r) notFound();
  return (
    <main id="main" className="page-container detail-page">
      <div className="breadcrumbs">
        <Link href="/">Catalog</Link>
        <span>/</span>
        <Link href={`/models/${r.modelSlug}/`}>{r.model.id}</Link>
        <span>/ Recipe</span>
      </div>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            {humanize(r.kind)} / {humanize(r.model.task)}
          </p>
          <h1>{r.title}</h1>
          <p className="lede">
            {r.hardware.device_count} × {r.hardware.model} ·{" "}
            {r.runtime.precision} · {r.engine.name}
          </p>
        </div>
        <a className="outline-button" href={r.source.editUrl}>
          Edit this recipe ↗
        </a>
      </div>
      <div className="verification-strip">
        <div>
          <small>DEPLOYMENT</small>
          <Status value={r.deployment.status} />
          <p>
            {r.deployment.last_verified_at
              ? `Verified ${r.deployment.last_verified_at}`
              : "This combination has not been revalidated for this catalog."}
          </p>
        </div>
        <div>
          <small>PERFORMANCE ACCEPTANCE</small>
          <Status value={r.acceptance.verdict} />
          <p>
            Independent from deployment status. Consult the original scope and
            evidence.
          </p>
        </div>
      </div>
      <div className="detail-layout">
        <article className="recipe-body">
          <section id="environment">
            <h2>Environment & prerequisites</h2>
            <p>{r.environment.os}</p>
            {r.environment.requirements.length > 0 && (
              <ul>
                {r.environment.requirements.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
            <p className="notice">
              Commands below are the source owner’s documented configuration.
              Review prerequisites and limitations before running them on the
              listed hardware.
            </p>
          </section>
          <DeploymentCommands
            commands={r.commands}
            unsupported={r.deployment.status === "unsupported"}
          />
          <section id="limitations">
            <h2>Limitations & verification scope</h2>
            {r.limitations.length ? (
              <ul>
                {r.limitations.map((x) => (
                  <li key={x}>
                    <SourceText>{x}</SourceText>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No additional limitations recorded. Unlisted combinations remain
                unknown.
              </p>
            )}
          </section>
          <section id="evidence">
            <h2>Evidence & attribution</h2>
            <div className="evidence-links">
              {r.deployment.evidence_url && (
                <a href={r.deployment.evidence_url}>Deployment evidence ↗</a>
              )}
              {r.acceptance.issue_url && (
                <a href={r.acceptance.issue_url}>Acceptance issue ↗</a>
              )}
              {r.acceptance.evidence_url && (
                <a href={r.acceptance.evidence_url}>Original evidence ↗</a>
              )}
              <a href={r.source.url}>Source recipe at locked commit ↗</a>
              <a href={`${r.engine.repository}/tree/${r.engine.ref}`}>
                Engine deployment revision ↗
              </a>
            </div>
            <p>
              Imported reports retain their original authorship and scope.
              Catalog validation and CPU checks do not establish inference
              quality or performance.
            </p>
          </section>
        </article>
        <aside className="recipe-sidebar">
          <div className="sidebar-box">
            <span className="eyebrow">CONFIGURATION</span>
            <dl>
              <dt>Model</dt>
              <dd>
                <a href={`https://huggingface.co/${r.model.id}`}>
                  {r.model.id} ↗
                </a>
              </dd>
              <dt>Engine</dt>
              <dd>
                <a href={r.engine.repository}>{r.engine.name} ↗</a>
              </dd>
              <dt>Hardware</dt>
              <dd>
                {r.hardware.vendor}
                <br />
                {r.hardware.device_count} × {r.hardware.model}
              </dd>
              <dt>Runtime</dt>
              <dd>
                {r.runtime.backend} / {r.runtime.precision}
              </dd>
              <dt>Deployment ref</dt>
              <dd className="mono">{r.engine.ref}</dd>
              <dt>Updated</dt>
              <dd>{r.updated_at}</dd>
              <dt>Maintainers</dt>
              <dd>
                {r.maintainers.map((x) => (
                  <a key={x} href={`https://github.com/${x}`}>
                    @{x}{" "}
                  </a>
                ))}
              </dd>
            </dl>
          </div>
          <div className="sidebar-box source-box">
            <span className="eyebrow">CONTENT PROVENANCE</span>
            <p>{r.source.repository.replace("https://github.com/", "")}</p>
            <code>{r.source.path}</code>
            <small>Read at commit</small>
            <a className="mono" href={r.source.url}>
              {r.source.commit}
            </a>
            <p>
              Deployment ref identifies the engine to run. This commit
              identifies the recipe snapshot.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
