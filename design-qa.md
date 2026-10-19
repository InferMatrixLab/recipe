# Website design QA — 2026-10-19

final result: passed

## Visual target and scope

Source visual truth:

- `C:/Users/ADMINI~1/AppData/Local/Temp/codex-clipboard-b1b7faa5-191f-4c86-aef5-f8aabc8d4044.png`: supplied vLLM Recipes model page, 1920 × 957 px.
- `C:/Users/ADMINI~1/AppData/Local/Temp/codex-clipboard-aad68d86-d308-4ac1-89d2-e70afcda62ad.png`: supplied grouped configuration controls, 1175 × 583 px.

The requested target is the reference layout/style using this catalog's actual
models and engines. It does not add Step-5, arbitrary device support, KV offload,
strategies or performance claims unsupported by the recorded recipes.

Implementation: `http://localhost:4173/models/qwen-qwen-image-2-1-turbo-e1ff7c75/`.
State: light theme, Qwen-Image model selected, Serve tab active, install collapsed,
recorded NVIDIA B300 configuration and BF16 selected, other combinations disabled.
The sidebar deliberately expands providers to show all six actual model IDs, as
the user requested; the reference's much larger provider inventory is not copied.

## Captured comparison evidence

Evidence directory: `F:/CWQ/Code/workspace/output/recipe-delivery/`.

- `vllm-style-initial-comparison.png`: source and first render in one comparison image.
- `vllm-style-final-comparison.png`: source and corrected render in one comparison image.
- `vllm-style-configuration-comparison.png`: focused source configuration panel beside the rendered panel.
- `vllm-style-model-final.jpg` and `vllm-style-model-full.jpg`: final viewport/full-page model captures.
- `vllm-style-mobile-model.jpg`: rendered mobile model page.

Desktop CSS viewport: 1919 × 957, device pixel ratio 1. Browser viewport capture:
1904 × 950 px; full-page capture: 1904 × 2356 px. The full-view comparison crops
the source's right scrollbar/bottom strip to 1904 × 950 rather than stretching
text. The focused comparison crops the actual configuration DOM rectangle from
the full-page image, adjusting coordinates by capture-width / CSS-width, and
normalizes the supplied panel to the same width. Model identity and command
length differ deliberately; hierarchy and control treatment are the comparison.

## Comparison history and fixes

Initial comparison — blocked:

- [P1] A desktop mobile-menu button leaked through the shared icon-button rule,
  shifting the organization brand. Fixed with explicit desktop/mobile selectors.
- [P2] Extra breadcrumbs pushed the model heading and install section below the
  reference's vertical rhythm. Removed those breadcrumbs from this workspace.
- [P2] Provider/model navigation and configuration type were too small. Increased
  desktop model heading to 30 px, provider/model links to 14/12 px, configuration
  labels/buttons to 10/12 px and command text to 12 px.

Post-fix comparison — passed:

The final full-view and focused comparison images were opened together with the
source. No actionable P0/P1/P2 remains in the requested scope. Desktop brand and
sidebar align, model identity leads directly into install/command/configuration,
and real manufacturer/hardware marks are visible in navigation and controls.

## Required fidelity surfaces

| Surface | Result |
| --- | --- |
| Fonts/typography | IBM Plex Sans controls and IBM Plex Mono model/code text preserve the reference's compact documentation style; hierarchy/wrapping checked at desktop/tablet/mobile |
| Spacing/layout | Compact 65 px header, 260 px desktop sidebar, bounded content frame, divided configuration rows, rounded install/code panels and selected pill borders match the reference organization |
| Colors/tokens | White surfaces, blue-gray text/dividers, pale code background and blue outlined selected buttons; amber unverified status intentionally replaces reference green verified claims |
| Image quality/assets | Real Qwen, Fish Audio, ByteDance, Liquid AI, NVIDIA, Huawei and Apple marks; local original assets and recorded hashes, no missing images; library UI icons instead of hand-drawn brand substitutes |
| Copy/content | Six real model/checkpoint IDs and exact recorded commands retained; publisher/manufacturer distinguished; no unrecorded configuration or acceptance claim copied from the reference |

## Interaction and responsive checks

- Header search: Qwen returns three matching entries; task + M4 filters return one;
  incompatible BF16 filter returns an empty state; reset restores six.
- Provider groups collapse/expand; selected model remains marked; model links work.
- Install expands; install and request copies equal displayed command bytes after
  visible Copied feedback. Serve/Request/Environment tabs work; missing benchmark
  is disabled. Arrow-key navigation moves to the next enabled command tab.
- At 768 px, persistent navigation and content fit (client/scroll widths both 753).
- At 390 px, navigation becomes a working drawer and closes on model selection;
  client/scroll widths are both 375. A long command scrolls within a 339 px code
  viewport rather than expanding the page (command scroll width 694).
- All observed logos load. Console warnings/errors: none during tested flows.
- The `/recipe` prefix build also passes all 692 internal reference checks;
  browser selection/navigation and header search retain the prefix, and WebP,
  SVG and ICO assets return 200 with their correct MIME types.
- Keyboard focus outlines, native buttons/details, labels and reduced-motion rules
  are present. Unavailable hardware buttons remain disabled and do not alter commands.

Follow-up polish (P3): exact physical screenshot sharpness depends on the in-app
browser's viewport scaling; no new runtime claims or fabricated content should
be introduced merely to match the reference's longer command block height.

Implementation checklist: fixes applied, revised captures compared, interactions
verified, static build checked, local preview retained. No production deployment
or hardware inference was performed for this UI follow-up.
