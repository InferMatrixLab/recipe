export const PROVIDERS = {
  Qwen: { id: "qwen", name: "Qwen", logo: "/assets/brands/qwen.webp" },
  fishaudio: {
    id: "fish-audio",
    name: "Fish Audio",
    logo: "/assets/brands/fish-audio.webp",
  },
  LiquidAI: {
    id: "liquid-ai",
    name: "Liquid AI",
    logo: "/assets/brands/liquid-ai.webp",
  },
  ByteDance: {
    id: "bytedance",
    name: "ByteDance",
    logo: "/assets/brands/bytedance.webp",
  },
};
export const HARDWARE = {
  NVIDIA: { name: "NVIDIA", logo: "/assets/brands/nvidia.webp" },
  Huawei: { name: "Huawei Ascend", logo: "/assets/brands/huawei.svg" },
  Apple: { name: "Apple Silicon", logo: "/assets/brands/apple.ico" },
};
export function hardwareModelLabel(hardware) {
  return hardware.vendor === "NVIDIA"
    ? hardware.model.split(/[\s-]/)[0]
    : hardware.model;
}
export function modelBrand(model) {
  // A quantized checkpoint's publisher is distinct from its model manufacturer.
  if (model.provider === "mlx-community" && model.id.includes("/Qwen"))
    return PROVIDERS.Qwen;
  return (
    PROVIDERS[model.provider] || {
      id: model.provider,
      name: model.provider,
      logo: null,
    }
  );
}
export function modelName(model) {
  return model.id.split("/").slice(1).join("/");
}
export function providerGroups(models) {
  const groups = new Map();
  for (const model of models) {
    const provider = modelBrand(model);
    if (!groups.has(provider.id))
      groups.set(provider.id, { ...provider, models: [] });
    groups.get(provider.id).models.push(model);
  }
  return [...groups.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      ...p,
      models: p.models.sort((a, b) => modelName(a).localeCompare(modelName(b))),
    }));
}
export function taskLabel(task) {
  return (
    {
      text_to_speech: "Text to speech",
      text_to_image: "Text to image",
      text_generation: "Text generation",
      constrained_scoring: "Choice scoring",
    }[task] || task.replaceAll("_", " ")
  );
}
export function precisionLabel(value) {
  return (
    {
      bf16: "BF16",
      fp16: "FP16",
      "4bit": "4-bit",
      "fp8 experts / bf16 state and codec": "FP8 / BF16",
    }[value] || value.toUpperCase()
  );
}

export function publisherBrand(model) {
  return model.provider === "mlx-community"
    ? { name: "mlx-community", logo: "/assets/brands/mlx-community.webp" }
    : modelBrand(model);
}
