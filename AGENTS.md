# BuildAI Agent Instructions

This repository is a Next.js 15 TypeScript SaaS builder. The critical product flow is:

User chat prompt -> niche intelligence -> site generation/editing -> live preview update.

## Current priority
Fix the AI builder so generated sites are coherent, niche-specific, image-led where appropriate, and editable through follow-up chat without losing context.

## Non-negotiable rules

1. Never expose internal/debug copy in generated sites.
   - Forbidden examples: "No stacked chaos", "Background only", "Integrated flow", "engine", "fallback", "AI builder", "component system".

2. Generated sites must match the user's niche.
   - Photography/wedding: editorial portfolio, large images, galleries, storytelling, booking/contact. No SaaS dashboards.
   - Trading/prop firm/copy trading: command center, HUD, risk metrics, plans, payouts, dashboards.
   - Beauty: services, booking calendar, client trust, testimonials, contact.
   - SaaS/technology: product workflow, dashboard, metrics, automation.

3. Follow-up chat edits must modify the current project, not regenerate a disconnected fallback.
   - Preserve existing HTML/CSS/JS unless the user requests a full redesign.
   - Keep project history and apply incremental changes.
   - Always update live preview after edits.

4. Visual effects must not cover readable content.
   - WebGL, Three.js, shaders, particles, bloom and post-processing should be background/atmosphere layers.
   - Text and cards must remain readable and aligned.

5. Fallback output must still look like a client website.
   - No diagnostic pages.
   - No internal explanations.
   - No placeholders that reveal implementation details.

## Important files

- `src/app/api/generate-site/route.ts` — main generation route.
- `src/lib/nicheIntelligenceEngine.ts` — niche detection.
- `src/lib/artDirectionEngine.ts` — generic composition engine.
- `src/lib/photographyArchitectureEngine.ts` — dedicated photography architecture.
- `src/lib/realImageEngine.ts` — image generation integration.
- `src/lib/threeSceneEngine.ts` — Three.js scene layer.
- `src/lib/webglEngine.ts` — native WebGL shader layer.
- `src/lib/motionEngine.ts` — motion utilities.

## Checks before finishing

Run these when possible:

```bash
npm run type-check
npm run build
```

If build is too slow or environment variables are missing, explain exactly what could not be verified.
