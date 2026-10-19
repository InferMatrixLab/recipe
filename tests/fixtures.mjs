// Synthetic data for contract tests only. Never imported by production content.
export const commit = "a".repeat(40);
export function fixture() {
  return {
    schema_version: 1,
    id: "fixture-engine-device",
    title: "Synthetic contract fixture",
    kind: "standalone_engine",
    model: {
      id: "fixture/model",
      provider: "Fixture",
      task: "text_generation",
    },
    engine: {
      id: "fixture-engine",
      name: "Fixture Engine",
      repository: "https://github.com/fixture/engine",
      ref: commit,
    },
    runtime: { backend: "cpu", precision: "fp32" },
    hardware: { vendor: "Fixture", model: "Synthetic CPU", device_count: 1 },
    environment: { os: "Fixture OS", requirements: [] },
    commands: {
      install: "fixture install",
      serve: "fixture serve",
      request: "fixture request",
      benchmark: null,
    },
    deployment: {
      status: "unverified",
      last_verified_at: null,
      evidence_url: null,
    },
    acceptance: {
      verdict: "INCONCLUSIVE",
      issue_url: null,
      evidence_url: null,
    },
    maintainers: ["fixture"],
    updated_at: "2026-10-19",
    limitations: ["Synthetic test data"],
  };
}
export function record(value = fixture()) {
  return {
    recipe: value,
    source: {
      repository: value.engine.repository,
      path: "recipes/fixture.yaml",
      commit,
      ref: "main",
    },
    file: "recipes/fixture.yaml",
  };
}
export function source() {
  return {
    id: "fixture-engine",
    repository: "https://github.com/fixture/engine",
    ref: "main",
    paths: ["recipes/fixture.yaml"],
  };
}
