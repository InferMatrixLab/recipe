"use client";
import { useState } from "react";
export default function DeploymentCommands({ commands, unsupported }) {
  const [feedback, setFeedback] = useState({});
  async function copy(key, text) {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback((x) => ({ ...x, [key]: "Copied" }));
    } catch {
      setFeedback((x) => ({
        ...x,
        [key]: "Copy unavailable. Select the command below.",
      }));
    }
  }
  if (unsupported)
    return (
      <div className="notice">
        This configuration is unsupported. Deployment and copy actions are
        unavailable; review the limitations below.
      </div>
    );
  return (
    <div>
      {[
        ["install", "01", "Install"],
        ["serve", "02", "Start the engine"],
        ["request", "03", "Make a request"],
        ["benchmark", "04", "Benchmark"],
      ].map(([key, number, title]) => (
        <section key={key} className="command-section" id={key}>
          <h2>
            <span>{number}</span>
            {title}
          </h2>
          {commands[key] ? (
            <div className="terminal">
              <div className="terminal-bar">
                <span>
                  <i /> shell
                </span>
                <button
                  onClick={() => copy(key, commands[key])}
                  aria-label={`Copy ${title.toLowerCase()} command`}
                >
                  Copy <span aria-hidden="true">⧉</span>
                </button>
              </div>
              <pre tabIndex={0} aria-label={`${title} command`}>
                <code>{commands[key]}</code>
              </pre>
              <div className="copy-feedback" role="status" aria-live="polite">
                {feedback[key]}
              </div>
            </div>
          ) : (
            <p className="notice">
              No benchmark command recorded. Consult the source documentation
              and acceptance protocol.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
