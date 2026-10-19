"use client";
import { useState } from "react";
import {
  Package,
  CaretDown,
  Copy,
  Check,
  TerminalWindow,
  Code,
  Gauge,
  Globe,
  Circle,
} from "@phosphor-icons/react";
export default function DeploymentCommands({ commands, unsupported, recipe }) {
  const [tab, setTab] = useState("serve");
  const [feedback, setFeedback] = useState({});
  async function copy(key, text) {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback((x) => ({ ...x, [key]: "Copied" }));
    } catch {
      setFeedback((x) => ({
        ...x,
        [key]: "Copy unavailable. Select the command text.",
      }));
    }
  }
  if (unsupported)
    return (
      <div className="notice">
        This configuration is unsupported. Review its limitations; deployment
        commands are unavailable.
      </div>
    );
  const tabs = [
    { key: "serve", label: "Serve", icon: TerminalWindow },
    { key: "request", label: "Request", icon: Code },
    { key: "benchmark", label: "Benchmark", icon: Gauge },
    { key: "environment", label: "Environment", icon: Globe },
  ];
  function changeTab(key) {
    setTab(key);
    setFeedback({});
  }
  function tabKeys(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = tabs.filter(
      (x) => x.key === "environment" || commands[x.key],
    );
    const current = enabled.findIndex((x) => x.key === tabs[index].key);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? enabled.length - 1
          : (current + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) %
            enabled.length;
    changeTab(enabled[next].key);
    document.getElementById(`command-tab-${enabled[next].key}`)?.focus();
  }
  return (
    <div className="deployment-workspace">
      <details className="install-panel">
        <summary>
          <span>
            <Package size={15} />
            <strong>INSTALL</strong>
            <small>
              {recipe.engine.name} · {recipe.runtime.backend.toUpperCase()}
            </small>
          </span>
          <span>
            Shell
            <CaretDown size={13} />
          </span>
        </summary>
        <div className="install-content">
          <div className="install-content-bar">
            <span>Run in the prepared environment</span>
            <button
              className="command-action"
              onClick={() => copy("install", commands.install)}
              aria-label="Copy install command"
            >
              {feedback.install === "Copied" ? <Check /> : <Copy />}
              {feedback.install || "Copy"}
            </button>
          </div>
          <pre tabIndex={0} aria-label="Install command">
            <code>{commands.install}</code>
          </pre>
        </div>
      </details>
      <section className="command-panel" aria-label="Deployment commands">
        <div className="command-panel-toolbar">
          <span className={`command-status ${recipe.deployment.status}`}>
            <Circle size={6} weight="fill" />
            {recipe.deployment.status === "validated"
              ? "Verified"
              : "Unverified"}{" "}
            on {recipe.hardware.vendor} {recipe.hardware.model}
          </span>
          <div className="command-tools">
            <div role="tablist" aria-label="Command type">
              {tabs.map(({ key, label, icon: Icon }, index) => (
                <button
                  key={key}
                  id={`command-tab-${key}`}
                  role="tab"
                  aria-selected={tab === key}
                  aria-controls="command-content"
                  tabIndex={tab === key ? 0 : -1}
                  disabled={key !== "environment" && !commands[key]}
                  title={
                    key !== "environment" && !commands[key]
                      ? "No benchmark command recorded"
                      : label
                  }
                  className={tab === key ? "active" : ""}
                  onClick={() => changeTab(key)}
                  onKeyDown={(e) => tabKeys(e, index)}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
            {tab !== "environment" && (
              <button
                className="command-action"
                aria-label={`Copy ${tab} command`}
                onClick={() => copy(tab, commands[tab])}
              >
                {feedback[tab] === "Copied" ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )}{" "}
                {feedback[tab] || "Copy"}
              </button>
            )}
          </div>
        </div>
        <div
          id="command-content"
          role="tabpanel"
          aria-labelledby={`command-tab-${tab}`}
        >
          {tab === "environment" ? (
            <div className="environment-preview">
              <b>{recipe.environment.os}</b>
              <ul>
                {recipe.environment.requirements.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : (
            <pre
              tabIndex={0}
              aria-label={`${tabs.find((x) => x.key === tab).label} command`}
            >
              <code>{commands[tab]}</code>
            </pre>
          )}
        </div>
        <div className="copy-feedback" role="status" aria-live="polite">
          {feedback[tab]}
        </div>
      </section>
    </div>
  );
}
