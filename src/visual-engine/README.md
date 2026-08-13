# SciLoop Visual Engine V1

## 1. What it is

SciLoop Visual Engine V1 is the first version of a Visual Understanding Operating System.

It converts concepts into controlled visual recipes, renders them through reusable patterns and correct engines, learns from human feedback, and stores successful explanations as visual memory.

## 2. What it is not

It is not an AI image generator, an uncontrolled code generator, or a requirement to use heavy 3D/GPU technology.

SciLoop should not create a new random visual from zero every time.

SciLoop should reuse strong visual patterns that humans understand.

The invention is not the engine.

The invention is controlled visual understanding.

## 3. Core pipeline

`Concept → Mock/AI Translator → Visual Recipe → Pattern → Engine Router → Renderer → Feedback → Evolution Notes → Visual Memory`

## 4. Folder structure

- `foundation/` — atoms, semantics, recipe schema, factories, validators, examples
- `renderer/` — base renderer and safe fallback UI
- `patterns/` — reusable patterns, matching, registry, factories
- `engines/` — capabilities, scoring, routing, fallback strategies
- `visual-tech-lab/` — safe technology comparisons and future placeholders
- `ai/` — mock translator, normalization, guardrails, prompts, fallbacks
- `feedback/` — collection, analysis, evolution, storage adapters, UI
- `memory/` — successful explanation memory, registry, analysis, explorer
- `v1/` — final V1 launch orchestration, health, self-test, and UI

Use `src/visual-engine/index.ts` as the unified public entry point.

## 5. Visual Language

Stable atoms such as node, edge, layer, flow, field, signal, noise, transformation, uncertainty, and human understanding give visuals consistent meaning.

## 6. Visual Recipes

Recipes are typed instructions describing layers, objects, relations, flows, motion, explanation, assessment, engine recommendation, and fallback. AI produces recipe drafts—not arbitrary SVG or Canvas code.

## 7. Pattern Library

Patterns preserve reusable explanation intelligence such as Signal Decomposition, Field Influence, Random to Organized, Energy Flow, and Local Action to Global Impact.

## 8. Engine Router

The router chooses the smallest useful installed technology and exposes fallback engines. Unsupported or experimental engines never become mandatory.

## 9. Visual Tech Frontier Lab

The lab compares React/Tailwind, SVG, CSS motion, Canvas, and labeled future technologies against shared concepts. Canvas loops clean up on unmount.

## 10. AI Visual Translator

Mock mode is active by default and requires no key or external request. Every result passes normalization, guardrails, recipe validation, pattern selection, and engine routing.

## 11. Feedback and Evolution

Feedback records clarity, complexity, motion, usefulness, issues, requested improvements, and optional notes. Evolution is rule-based and suggestion-only.

## 12. Database-ready feedback storage

`FeedbackStorageManager` uses browser localStorage by default and memory fallback when unavailable. The database adapter and `/api/visual-engine/feedback` route truthfully remain unavailable until a real database is configured.

## 13. Visual Memory

Only successful human-reviewed explanations become memory. Memory may provide a validated prior recipe, pattern, engine, audience, or analogy as optional translator context. It never bypasses guardrails.

## 14. V1 Launch Route

Open `/visual-frontier/v1` for the final connected launch experience. The detailed module demo remains at `/visual-frontier/visual-engine-demo`; the Tech Lab remains at `/visual-frontier/tech-lab`.

## 15. How to add a new recipe

Use recipe factory helpers, reference valid objects from relations and flows, include explanation and fallback, then require `validateVisualRecipe()` to pass.

## 16. How to add a new pattern

Add a controlled pattern entry using existing atoms, use cases, stages, templates, preferred engines, fallbacks, and an understanding goal. Add matcher rules only when they distinguish the pattern.

## 17. How to add a new engine

Register its ID, capabilities, installation state, performance profile, and explicit fallbacks. Add routing rules only when the engine materially improves understanding.

## 18. How to connect real AI safely

Implement `AITranslatorProvider` behind a secure server route. Keep keys server-side. Treat provider output as an untrusted recipe draft and run all existing normalization, guardrails, validation, pattern, and routing stages.

## 19. How to connect a database later

Configure an approved server-side database client and migrations, implement `DatabaseFeedbackAdapter`, validate and rate-limit API writes, protect export/deletion, then migrate local JSON only with user approval. See `feedback/FEEDBACK_STORAGE.md`.

## 20. Future upgrade path

1. Connect secure server-side AI provider
2. Connect real database feedback storage
3. Add D3 for knowledge graphs
4. Upgrade Canvas simulations
5. Add Three.js/R3F only for real 3D concepts
6. Add MapLibre only for geography/global problem solving
7. Add WebGPU only as experimental frontier with WebGL/Canvas fallback
8. Add real user analytics after privacy design
9. Add content library for math, physics, AI, biology, climate, economics
10. Add classroom/student mode

Human understanding is the final metric.

## Forloop API Integration

ForLoop is an optional server-side intelligence translator. It converts a user idea, lesson, question, or news item into structured recipe JSON. It does not generate random images, raw SVG, Canvas code, React components, or direct renderer instructions.

The browser calls `/api/visual-engine/translate`. That Next.js route talks server-to-server to the existing ForLoop backend, whose provider keys remain in backend configuration. The response then passes through SciLoop parsing, normalization, guardrails, recipe validation, Pattern Library selection, Engine Router, renderer, feedback, and Visual Memory.

Mock translation remains the default and fallback. If ForLoop is offline, missing configuration, times out, or returns invalid JSON, SciLoop produces a safe mock recipe and continues rendering.

“Generate Best Visual” asks the provider to optimize for clarity, low text, strong layers, visible cause-and-effect, safe engine fallbacks, useful examples, and feedback readiness—not visual spectacle.
