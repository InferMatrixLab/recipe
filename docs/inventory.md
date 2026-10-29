# Engine inventory

Audited 2026-10-19 against current GitHub default branches and signed local source commits. All five named standalone engines already belong to InferMatrixLab; no transfer or runtime change was performed. This scoped inventory does not assert that all personal/private artifacts have been enumerated or migrated.

All catalog entries remain **unverified / INCONCLUSIVE**. Historical reports qualify only their exact revision/environment/workload. No GPU, NPU or Apple inference was run during website delivery.

## Ownership and coverage

| Engine | Current → target owner | Default branch | Model / task | Exact hardware / backend / precision |
| --- | --- | --- | --- | --- |
| [InferMatrixLab/qwen3-tts-engine](https://github.com/InferMatrixLab/qwen3-tts-engine) | InferMatrixLab → InferMatrixLab; already in organization | main | Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice / text_to_speech | 1 × Ascend 910B1 / ascend / bf16 |
| [InferMatrixLab/drama-3-single-b300-engine](https://github.com/InferMatrixLab/drama-3-single-b300-engine) | InferMatrixLab → InferMatrixLab; already in organization | codex-drama3-b300 | fishaudio/drama-3 / text_to_speech | 1 × B300 / cuda / fp8 experts / bf16 state and codec |
| [InferMatrixLab/vllm-omni-mlx](https://github.com/InferMatrixLab/vllm-omni-mlx) | InferMatrixLab → InferMatrixLab; already in organization | main | mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-4bit / text_to_speech | 1 × M4 (16 GB unified memory) / mlx / 4bit |
| [InferMatrixLab/vllm-rlt](https://github.com/InferMatrixLab/vllm-rlt) | InferMatrixLab → InferMatrixLab; already in organization | main | ByteDance/Ouro-1.4B / text_generation | 1 × H20-3e / cuda / bf16 |
| [InferMatrixLab/system1-omni](https://github.com/InferMatrixLab/system1-omni) | InferMatrixLab → InferMatrixLab; already in organization | main | LiquidAI/LFM2.5-350M / constrained_scoring | 1 × L40S / cuda / fp16 |
| [vLLM-Omni](https://github.com/vllm-project/vllm-omni) | external upstream; no transfer | historical pinned PR source | Qwen/Qwen-Image-2.1-Turbo / text_to_image | 4 × B300 SXM6 AC / cuda / bf16 |

Ownership categories: five already in organization; none of this audited set awaits a transfer; external Qwen-Image is an upstream patch/reference, not an InferMatrixLab implementation. System1 repository-wide licensing and unenumerated personal/private source relationships remain to verify. No automatic source deletion or empty engine repository was created.

## Source snapshots and evidence

Per the user’s latest instruction, engine and catalog commits stay local until write permission is available. The lock/cache is generated from the signed local source commits below. Source commit/edit links become available after the source changes land on the declared remote refs; their remote publication is pending, while local preview/build works offline.

### InferMatrixLab/qwen3-tts-engine

- Audited engine deployment ref: `b4451682abac651f26046f8d27467de3f007e1e7`.
- Local content source commit: `63620f6d906de103cc574f859124145998cc91a5` on `docs/recipe-catalog-20261019`.
- Source recipe: `recipes/qwen3-tts-ascend-910b1.yaml`.
- Real GitHub source contributors listed as recipe contacts: @amy-why-3459.
- Recorded OS: Linux (prepared Ascend environment; distribution not recorded).

Source evidence and documentation:

- [acceptance.md](https://github.com/InferMatrixLab/qwen3-tts-engine/blob/b4451682abac651f26046f8d27467de3f007e1e7/evidence/campaign-20261017/acceptance.md)
- [environment.md](https://github.com/InferMatrixLab/qwen3-tts-engine/blob/b4451682abac651f26046f8d27467de3f007e1e7/evidence/campaign-20261017/plan/environment.md)
- [README.md](https://github.com/InferMatrixLab/qwen3-tts-engine/blob/b4451682abac651f26046f8d27467de3f007e1e7/README.md)

Verification limits and follow-ups:

- This catalog entry has not been executed on hardware during the 2026-10-19 documentation work.
- The historical PASS covers measured engine e783a64b0fb4f9ade2ffb3980b3e1f74a00c9a6a and its frozen contract; it does not qualify this deployment ref automatically.
- Historical evidence: https://github.com/InferMatrixLab/qwen3-tts-engine/blob/b4451682abac651f26046f8d27467de3f007e1e7/evidence/campaign-20261017/acceptance.md
- Only this CustomVoice checkpoint, one 910B1 and the recorded BF16 configuration are represented. The separate 910B3 comparison is not validation of this recipe.
- Keep the install and serve blocks in the same activated shell. Send the request from a second terminal after health succeeds.
- The endpoint streams base64 PCM over SSE; it does not return a WAV directly. The OS distribution and CANN version were not fully frozen in the source documentation.
- 910B3 report has a different workload/environment; no 910B3 recipe is inferred.
- Capture full CANN and Linux distribution versions during remote validation.

### InferMatrixLab/drama-3-single-b300-engine

- Audited engine deployment ref: `58a1882a4d941f8d21bfce6be37d3d5e7c9fde80`.
- Local content source commit: `c560a520913f51586687943ef0adb1ec764ef510` on `docs/recipe-catalog-20261019`.
- Source recipe: `recipes/drama3-b300-fp8.yaml`.
- Real GitHub source contributors listed as recipe contacts: @david6666666.
- Recorded OS: Linux.

Source evidence and documentation:

- [README.md](https://github.com/InferMatrixLab/drama-3-single-b300-engine/blob/58a1882a4d941f8d21bfce6be37d3d5e7c9fde80/README.md)
- [current-results.md](https://github.com/InferMatrixLab/drama-3-single-b300-engine/blob/58a1882a4d941f8d21bfce6be37d3d5e7c9fde80/docs/current-results.md)
- [benchmark-native-b300.env](https://github.com/InferMatrixLab/drama-3-single-b300-engine/blob/58a1882a4d941f8d21bfce6be37d3d5e7c9fde80/configs/benchmark-native-b300.env)
- [NOTICE](https://github.com/InferMatrixLab/drama-3-single-b300-engine/blob/58a1882a4d941f8d21bfce6be37d3d5e7c9fde80/NOTICE)

Verification limits and follow-ups:

- This deployment ref has not been re-run on B300 during the catalog work; the Linux distribution is not frozen in the quickstart.
- Mixed precision is intentional: native FP8 experts, BF16 GDN state and BF16 codec. No all-FP8 claim is made.
- Output is 44.1 kHz mono signed 16-bit PCM. Allow model load, graph capture and codec warmup to finish before sending requests.
- Historical matched results use standalone 33f6d7237196520be9f457d86df161264cbb087e and include incomplete baseline repetitions; they do not establish the all-concurrency 1.5x acceptance target.
- Historical configuration, quality and raw evidence: https://github.com/InferMatrixLab/drama-3-single-b300-engine/blob/58a1882a4d941f8d21bfce6be37d3d5e7c9fde80/docs/current-results.md
- Built with Fish Audio. Fish Audio Community License and dependency licenses apply; retain NOTICE and third_party_licenses.
- Revalidate the current deployment commit on B300; preserve all incomplete historical baseline runs.

### InferMatrixLab/vllm-omni-mlx

- Audited engine deployment ref: `210cc4e35e208b56d4146e7cc735952cde8ea24e`.
- Local content source commit: `4bf0a5ccea1d5bf364f62927bf015368879a68a1` on `docs/recipe-catalog-20261019`.
- Source recipe: `recipes/qwen3-tts-mlx-m4-4bit.yaml`.
- Real GitHub source contributors listed as recipe contacts: @hsliuustc0106.
- Recorded OS: macOS arm64.

Source evidence and documentation:

- [README.md](https://github.com/InferMatrixLab/vllm-omni-mlx/blob/210cc4e35e208b56d4146e7cc735952cde8ea24e/README.md)
- [spike-mlx-audio-qwen3-tts.md](https://github.com/InferMatrixLab/vllm-omni-mlx/blob/210cc4e35e208b56d4146e7cc735952cde8ea24e/docs/spike-mlx-audio-qwen3-tts.md)
- [speech.md](https://github.com/InferMatrixLab/vllm-omni-mlx/blob/210cc4e35e208b56d4146e7cc735952cde8ea24e/docs/speech.md)
- [pyproject.toml](https://github.com/InferMatrixLab/vllm-omni-mlx/blob/210cc4e35e208b56d4146e7cc735952cde8ea24e/pyproject.toml)

Verification limits and follow-ups:

- This recipe has not been re-run on Apple hardware during the 2026-10-19 catalog work.
- M4/16 GB and the exact checkpoint are documented in the historical spike, which measured an earlier mlx-audio adaptation rather than this deployment ref.
- Source for the hardware scope: https://github.com/InferMatrixLab/vllm-omni-mlx/blob/210cc4e35e208b56d4146e7cc735952cde8ea24e/docs/spike-mlx-audio-qwen3-tts.md
- The dependency ranges and model download are not a fully locked macOS environment or checkpoint revision. Record resolved versions, model snapshot and macOS release during remote validation.
- The 4-bit label describes the quantized checkpoint; embeddings and vocoder may retain higher precision.
- One model instance per process; generation is serialized. The demo API key is a local example; default host is 127.0.0.1.
- No claim for every Apple Silicon SKU, ASR, speech-out chat or diffusion follows from this TTS recipe.
- Other Apple SKUs and other TTS/ASR/Omni checkpoints need their own fully specified combinations.
- Capture exact macOS release, resolved dependencies and model snapshot during remote validation.

### InferMatrixLab/vllm-rlt

- Audited engine deployment ref: `9d601ceaf9af63121c742df5f584467e23630a0b`.
- Local content source commit: `326f7edb8580b6c729ba52ce5b15ed67e7ab649e` on `docs/recipe-catalog-20261019`.
- Source recipe: `recipes/ouro-1-4b-rlt-h20-3e-bf16.yaml`.
- Real GitHub source contributors listed as recipe contacts: @bjf-frz.
- Recorded OS: Linux.

Source evidence and documentation:

- [README.md](https://github.com/InferMatrixLab/vllm-rlt/blob/9d601ceaf9af63121c742df5f584467e23630a0b/README.md)
- [launching.md](https://github.com/InferMatrixLab/vllm-rlt/blob/9d601ceaf9af63121c742df5f584467e23630a0b/docs/launching.md)
- [ouro_thinking.md](https://github.com/InferMatrixLab/vllm-rlt/blob/9d601ceaf9af63121c742df5f584467e23630a0b/docs/recipes/ouro_thinking.md)

Verification limits and follow-ups:

- This exact deployment ref and first-request configuration have not been re-run on H20-3e during catalog work.
- H20-3e BF16 hardware scope is taken from the historical README benchmark; those earlier runtime results are not qualification of this ref or request.
- Source and historical protocol: https://github.com/InferMatrixLab/vllm-rlt/blob/9d601ceaf9af63121c742df5f584467e23630a0b/README.md
- Uses default synchronous execution and exit_threshold 1.0 (fixed four loops). It does not enable asynchronous scheduling, preemption, self-speculation or disaggregation.
- Async execution with preemption and async self-speculation have documented correctness/lifecycle limitations. The small KV pool is a first-request setting, not a throughput profile.
- Linux distribution and resolved CUDA/PyTorch/Triton versions must be captured during remote validation. Preserve scheduler-provided CUDA_VISIBLE_DEVICES instead of overriding it.
- Nanbeige4.2-3B, Huginn-0125 and Thinking variants have documented support with differing scope; a precise hardware/configuration recipe for each is pending.

### InferMatrixLab/system1-omni

- Audited engine deployment ref: `e66ff34996760a84ad56690f0ae4cf434e669e65`.
- Local content source commit: `733be7a6a47bace63b8acfd8d455f72cbc781c9b` on `docs/recipe-catalog-20261019`.
- Source recipe: `recipes/lfm2-5-350m-system1-l40s-fp16.yaml`.
- Real GitHub source contributors listed as recipe contacts: @prettygirlisnotme.
- Recorded OS: Linux.

Source evidence and documentation:

- [README.md](https://github.com/InferMatrixLab/system1-omni/blob/e66ff34996760a84ad56690f0ae4cf434e669e65/recipe/lfm2/README.md)
- [RESULTS.md](https://github.com/InferMatrixLab/system1-omni/blob/e66ff34996760a84ad56690f0ae4cf434e669e65/recipe/lfm2/RESULTS.md)
- [supported-models.md](https://github.com/InferMatrixLab/system1-omni/blob/e66ff34996760a84ad56690f0ae4cf434e669e65/docs/supported-models.md)
- [engine.py](https://github.com/InferMatrixLab/system1-omni/blob/e66ff34996760a84ad56690f0ae4cf434e669e65/src/models/lfm2/engine.py)

Verification limits and follow-ups:

- This deployment ref has not been re-run on L40S during catalog work; historical reports identify earlier Python source by hashes and an earlier Rust frontend commit.
- This path is a Python Transformers FP16 worker behind a Rust frontend, not native Rust/CUDA model execution.
- Only text state and independent choice questions are supported by this worker. Confidence is normalized entropy concentration, not calibrated correctness.
- Historical exact hardware, evidence and boundaries: https://github.com/InferMatrixLab/system1-omni/blob/e66ff34996760a84ad56690f0ae4cf434e669e65/recipe/lfm2/README.md
- The Linux distribution and current Rust/CUDA runtime must be captured in remote validation. Keep the worker and frontend running in separate terminals.
- No repository-wide root license was found at this ref. Preserve component notices, the MIT RLCD reference notice and the model license; repository-wide licensing remains a maintainer follow-up.
- Native Cua-S1, Open-Jev, LAYA, D3 and other implementations remain in the source support matrix; no unsupported combinations are inferred.
- Repository-wide root license was not present; component/model licenses require maintainer clarification.

### Qwen-Image supplemental upstream recipe

- Local content owner: `recipes/qwen-image-2-1-turbo-b300.yaml`; implementation remains vllm-project/vllm-omni.
- Deployment ref `d57480f5054e6c377a04225840b24e6355244dd9`, pinned model snapshot and mandatory prepared environment are recorded in the YAML.
- [Exact commands/environment](https://github.com/vllm-project/vllm-omni/pull/8739#issuecomment-6119754582), [separate rebase evidence scope](https://github.com/vllm-project/vllm-omni/pull/8739#issuecomment-6119846759), [historical acceptance issue](https://github.com/InferMatrixLab/InferRSI/issues/3).
- PR8739 is merged upstream; this recipe keeps the historical configuration and does not imply later human-review fixes are included. No performance numbers are imported.
- Four idle B300 devices, prepared Python/CUDA/vLLM/FA4/NCCL stack, pinned local model and cache are prerequisites; the report does not supply a complete host provisioning lock.
- Qwen-Image Ascend remains a documented imported report outside the deployable catalog: [scope and missing evidence](https://github.com/InferMatrixLab/InferRSI/blob/main/docs/qwen-image-2.1-turbo-ascend.md). A complete deployment/environment contract is still needed.

## Other combinations

The engines document additional models and experiments. Qualify other MLX SKUs/checkpoints, RLT model variants, native System1 implementations, Qwen 910B3 and different Drama hardware independently; no support is inferred from this catalog. InferRSI’s separate Drama NPU readiness supplement is documentation, not an engine qualification.

InferMatrixCopilot, the organization website, playbook and marketing projects are outside this engine implementation. No personal/private repository transfer was performed; any future transfer requires source/target relationship and permission checks.

## MiniCPM-o 4.5 supplement — 2026-10-20

- Owner: [InferMatrixLab/minicpm-o-4.5-single-gpu-engine](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine), default branch `main`.
- Deployment/documentation pin: `a4f4778f312791c2d190b48e521141887ed160c8`; verified source-commit author/contact: @fake0fan.
- Catalog-owned source: [minicpm-o-4-5-h200.yaml](../recipes/minicpm-o-4-5-h200.yaml). No recipe YAML exists in the pinned upstream tree, so the documented local-source exception applies. No upstream repository is changed. H200 naming does not relabel the L20X performance evidence.
- Model/task: `openbmb/MiniCPM-o-4_5@503e754207c94da6bb26850b4469f367c9ea3582`, `text_to_speech` with a reference voice prompt.
- Target hardware: one NVIDIA H200, as requested by the user; execution remains unverified. Source measurements used an L20X (143 GB), about 95 GB used. Linux, Python 3.12, CUDA MPS. BF16 Thinker/Talker, FP16 flow, strict FP32 HiFT in the default profile. Other GPUs are unqualified here.
- Sources: [README](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine/blob/a4f4778f312791c2d190b48e521141887ed160c8/README.md), [architecture](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine/blob/a4f4778f312791c2d190b48e521141887ed160c8/docs/architecture.md), [environment](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine/blob/a4f4778f312791c2d190b48e521141887ed160c8/engine/env/engine.lock), [results](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine/blob/a4f4778f312791c2d190b48e521141887ed160c8/docs/current-results.md), [benchmark reproduction](https://github.com/InferMatrixLab/minicpm-o-4.5-single-gpu-engine/blob/a4f4778f312791c2d190b48e521141887ed160c8/docs/reproduce-benchmark.md).

Deployment remains **unverified / INCONCLUSIVE**: collection did not execute GPU workloads.
The recipe serves `track_s_fast`; the development performance report uses `track_s_fast_r11`
(TF32 HiFT, batched prompt setup and Talker prefill graphs). r11 fails one HiFT numerical
chunk and has not run the final speech-quality gates; the full 2× performance target is
unmet, and H200 K=10 acceptance is not run. The default profile's one-seed development
quality does not establish final acceptance. The source reports driver 570.133.20 while
the quickstart requires CUDA 13; target-host driver/toolkit compatibility remains to verify.
Benchmark is intentionally null; its separate harness, dataset and evaluator prerequisites
are linked rather than reduced to an incomplete command. This supplement adds a sixth
organization standalone engine and seventh catalog entry to the historical inventory above.

## h3-metal supplement — 2026-10-29

- External owner: [zuiho-kai/h3-metal](https://github.com/zuiho-kai/h3-metal), not an InferMatrixLab repository transfer.
- Engine/source pin: `4ba47a3eabdbebf801ac6664b31f8ec168bc57a8`; owner and source-commit author: @zuiho-kai.
- [Catalog-owned recipe](../recipes/fasth3-h3-metal-m5-max.yaml): the pinned upstream tree has no engine-owned recipe YAML. Targets FastVideo's FastH3 4-step preview on one M5 Max (40-core GPU), 128 GB, macOS 27. Metal-native CLI, mixed int8 TensorOps / BF16 video decoder; no HTTP endpoint is claimed.
- [README / reported performance](https://github.com/zuiho-kai/h3-metal/blob/4ba47a3eabdbebf801ac6664b31f8ec168bc57a8/README.md#performance), [usage](https://github.com/zuiho-kai/h3-metal/blob/4ba47a3eabdbebf801ac6664b31f8ec168bc57a8/docs/USAGE.md), [benchmark harness](https://github.com/zuiho-kai/h3-metal/blob/4ba47a3eabdbebf801ac6664b31f8ec168bc57a8/bench/run_fox2.sh), [InferRSI lessons](https://github.com/InferMatrixLab/InferRSI/blob/main/docs/h3-metal-apple-silicon-lessons.md).
- Author reports 48.23 s cold / 18.20 s warm at 768×448, 49 frames, seed 0, real weights, one engine at a time. The 4.03× h3.c and 7.40× MLX warm ratios compare distilled 4-step FastH3 with 20-step configurations and different warm aggregation protocols; they do not establish equivalent quality or equal-model/precision speedup. Original H3 is separately reported as 54.29 s cold / 29.89 s warm.
- Native/device/model/quality checks were not rerun. Deployment remains unverified and acceptance INCONCLUSIVE. Model snapshot and compiler/SDK pins require completion before a reproducible hardware campaign. Engine code is MIT with third-party BSD-3-Clause notices; weights have separate terms.
