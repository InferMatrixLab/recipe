"use client";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Code,
  Cpu,
  FileCode,
  Package,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  modelBrand,
  modelName,
  publisherBrand,
  HARDWARE,
  taskLabel,
  precisionLabel,
} from "@/lib/brands";
import { configurationValue, selectConfiguration } from "@/lib/configuration";
import BrandLogo from "./BrandLogo";
import ConfigurationRow from "./ConfigurationRow";
import DeploymentCommands from "./DeploymentCommands";
import SourceText from "./SourceText";
import { Status } from "./RecipeCard";

export default function RecipeWorkspace({
  recipes,
  initialRecipeId,
  hardwareOptions,
}) {
  const r = recipes.find((x) => x.id === initialRecipeId) || recipes[0];
  const router = useRouter();
  function choice(field, value, label) {
    const next = selectConfiguration(recipes, r, field, value);
    const selected = configurationValue(r, field) === value;
    return (
      <button
        type="button"
        key={value}
        disabled={!next}
        aria-pressed={selected}
        title={
          !next
            ? "No published recipe for this model and configuration"
            : undefined
        }
        className={`config-pill ${selected ? "selected" : ""}`}
        onClick={() => {
          if (next) router.push(`/recipes/${next.id}/`);
        }}
      >
        {label}
      </button>
    );
  }
  const unique = (field, values = recipes) => [
    ...new Set(values.map((x) => configurationValue(x, field))),
  ];
  return (
    <main id="main" className="model-page">
      <header className="model-heading">
        <BrandLogo brand={modelBrand(r.model)} className="model-heading-logo" />
        <div>
          <h1>
            <span className="model-owner">{r.model.id.split("/")[0]}/</span>
            {modelName(r.model)}
          </h1>
          <p>
            {taskLabel(r.model.task)} with {r.engine.name} on{" "}
            {r.hardware.vendor} {r.hardware.model}.
          </p>
          <a
            className="model-hf-link"
            href={`https://huggingface.co/${r.model.id}`}
          >
            <BrandLogo brand={publisherBrand(r.model)} decorative />
            View on Hugging Face <ArrowUpRight size={12} />
          </a>
        </div>
      </header>
      <div className="model-badges">
        <span>
          <Package size={12} />
          {taskLabel(r.model.task)}
        </span>
        <span>{precisionLabel(r.runtime.precision)}</span>
        <a href={r.engine.repository}>
          {r.engine.name}
          <ArrowUpRight size={10} />
        </a>
        <span>
          {r.hardware.device_count} × {r.hardware.model}
        </span>
        <Status value={r.deployment.status} />
      </div>
      <DeploymentCommands
        key={r.id}
        commands={r.commands}
        unsupported={r.deployment.status === "unsupported"}
        recipe={r}
      />
      <section
        className="configuration-panel model-configuration"
        aria-label="Model configuration"
      >
        <ConfigurationRow label="HARDWARE">
          {Object.keys(HARDWARE).map((vendor) => (
            <div className="hardware-group" key={vendor}>
              <div className="vendor-label">
                <BrandLogo brand={HARDWARE[vendor]} decorative />
                <span>{HARDWARE[vendor].name}</span>
              </div>
              <div className="pill-group">
                {hardwareOptions
                  .filter((h) => h.vendor === vendor)
                  .map((h) =>
                    choice(
                      "hardware",
                      `${h.vendor}/${h.model}/${h.device_count}`,
                      <>
                        {h.model}
                        <small>
                          {h.device_count} device{h.device_count > 1 ? "s" : ""}
                        </small>
                      </>,
                    ),
                  )}
              </div>
            </div>
          ))}
        </ConfigurationRow>
        <ConfigurationRow label="VARIANT">
          <div className="pill-group">
            {unique("precision").map((v) =>
              choice("precision", v, precisionLabel(v)),
            )}
            <span className="row-hint">{r.runtime.precision}</span>
          </div>
          <a
            className="configuration-model-link"
            href={`https://huggingface.co/${r.model.id}`}
          >
            <BrandLogo brand={publisherBrand(r.model)} decorative />
            {r.model.id}
            <ArrowUpRight size={11} />
          </a>
        </ConfigurationRow>
        <ConfigurationRow label="ENGINE">
          <div className="pill-group">
            {unique("engine").map((id) =>
              choice(
                "engine",
                id,
                recipes.find((x) => x.engine.id === id).engine.name,
              ),
            )}
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="BACKEND">
          <div className="pill-group">
            {unique("backend").map((v) =>
              choice("backend", v, v.toUpperCase()),
            )}
            <span className="row-hint">{r.environment.os}</span>
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="TASK">
          <div className="pill-group">
            {unique("task").map((v) => choice("task", v, taskLabel(v)))}
            <span className="row-hint">
              {r.hardware.device_count === 1
                ? "Single device"
                : `${r.hardware.device_count} devices`}{" "}
              · recorded configuration
            </span>
          </div>
        </ConfigurationRow>
        <ConfigurationRow label="VERIFICATION">
          <div className="verification-row">
            <span>
              Deployment <Status value={r.deployment.status} />
            </span>
            <span>
              Acceptance <Status value={r.acceptance.verdict} />
            </span>
          </div>
          <p className="row-hint verification-caption">
            {r.deployment.last_verified_at
              ? `Deployment verified ${r.deployment.last_verified_at}.`
              : "Not revalidated for this catalog."}{" "}
            See the original evidence for the exact scope.
          </p>
        </ConfigurationRow>
        <details className="advanced-config">
          <summary>
            <span>ADVANCED</span> Source & reproducibility <Code size={14} />
          </summary>
          <div>
            <dl className="source-metadata">
              <dt>Deployment ref</dt>
              <dd>
                <a href={`${r.engine.repository}/tree/${r.engine.ref}`}>
                  {r.engine.ref}
                  <ArrowUpRight size={11} />
                </a>
              </dd>
              <dt>Recipe source</dt>
              <dd>
                <a href={r.source.url}>
                  {r.source.repository.replace("https://github.com/", "")}/
                  {r.source.path}
                  <ArrowUpRight size={11} />
                </a>
              </dd>
              <dt>Content commit</dt>
              <dd>{r.source.commit}</dd>
              <dt>Updated</dt>
              <dd>{r.updated_at}</dd>
              <dt>Maintainers</dt>
              <dd>
                {r.maintainers.map((name) => (
                  <a key={name} href={`https://github.com/${name}`}>
                    @{name}{" "}
                  </a>
                ))}
              </dd>
            </dl>
            <a className="edit-link" href={r.source.editUrl}>
              Edit the source recipe <ArrowUpRight size={12} />
            </a>
          </div>
        </details>
      </section>
      <section className="recipe-guide" id="environment">
        <h2>
          <Cpu size={20} /> Environment & prerequisites
        </h2>
        <p>{r.environment.os}</p>
        <ul>
          {r.environment.requirements.map((x) => (
            <li key={x}>
              <SourceText>{x}</SourceText>
            </li>
          ))}
        </ul>
      </section>
      <section className="recipe-guide" id="limitations">
        <h2>
          <ShieldCheck size={20} /> Limitations & verification scope
        </h2>
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
            No additional limitations recorded. Unlisted combinations are
            unknown.
          </p>
        )}
      </section>
      <section className="recipe-guide" id="evidence">
        <h2>
          <FileCode size={20} /> Evidence & attribution
        </h2>
        <div className="evidence-links">
          {r.deployment.evidence_url && (
            <a href={r.deployment.evidence_url}>
              Deployment evidence <ArrowUpRight size={12} />
            </a>
          )}
          {r.acceptance.issue_url && (
            <a href={r.acceptance.issue_url}>
              Acceptance issue <ArrowUpRight size={12} />
            </a>
          )}
          {r.acceptance.evidence_url && (
            <a href={r.acceptance.evidence_url}>
              Original evidence <ArrowUpRight size={12} />
            </a>
          )}
          <a href={r.source.url}>
            Source recipe <ArrowUpRight size={12} />
          </a>
          <a href={`${r.engine.repository}/tree/${r.engine.ref}`}>
            Engine deployment revision <ArrowUpRight size={12} />
          </a>
        </div>
        <p>
          Imported reports retain their authorship and verification scope.
          Catalog checks do not establish inference quality or performance.
        </p>
      </section>
    </main>
  );
}
