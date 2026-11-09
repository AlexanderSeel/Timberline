# TIMBERLINE — Production Roadmap (source of truth)

**Updated:** 2026-11-09  
**Product:** Original, realistic 3D, browser-first living-world crafting / building / nature / community game  
**Engine:** Babylon.js + TypeScript + Havok; WebGPU progressive enhancement, WebGL2 fallback  
**Target:** Desktop browser first; adaptive midrange laptop, mobile later  
**Status:** `v0.1 prototype baseline` — preserve first demo and advance through the vertical slice, then scale  
**Non-goal:** Copying protected assets, gameplay footage, game names, or UI from existing games.

## Vision

Start with dirt, a living tree and a few tools. Harvest responsibly, build a shelter component by component, create functional objects, cultivate a garden, grow a settlement and develop relationships with NPCs and other players. The world should feel physical and alive: seasons, changing daylight, wind, rain, water, plants, wildlife, wear, labor, maintenance and human routines. Players can collaborate and trade. Conflict is optional and never the core loop. No forced PvP, deceptive timers or pay-to-win mechanics.

**Core loop:** Explore → gather → craft → build → inhabit → grow → exchange → explore further.  
**Creative pillar:** Every construction step should be *seen* and *felt*, not only represented by a level number.  
**Balance pillar:** Reward progression without grind; resources replenish responsibly, NPCs have needs, and the world reacts coherently.  
**Visual pillar:** Grounded contemporary-realistic 3D, tactile timber, organic terrain, consistent scale and lighting. Not an isometric mobile-game asset reskin.

## Starting baseline / evidence

- [x] `v0.1` source from initial Timberline Babylon.js demo imported into development workspace: cabin builds through five steps, physically movable loose objects, orbit/ground camera, day/dusk, generated PBR materials.
- [x] Dependency-free local server and Windows launcher retained.
- [x] Asset provenance and low-credit production strategy documented.
- [x] Local environment checker, project integrity check, smoke tests and CI workflow authored.
- [ ] Full browser visual QA on user's Windows GPU (WebGL2/WebGPU console, screenshots at every stage, physics impulses, reset); not verified in remote headless environment.
- [ ] Downloaded/photogrammetric hero assets integrated; current maps are procedural placeholders, **not photoreal**.
- [ ] Node production modularization and bundling completed.

**Definition of done:** only check a task after implementation *and* appropriate validation evidence. Use `docs/PROGRESS.md` to record completed changes, commands, representative screenshots and known limitations. A script, plan or placeholder alone does not complete gameplay work.

## Milestones (dependency order, checked from tests, not aspirations)

### M0 — Repository foundation / repeatable environment (P0)
- [x] Import demo source and original texture generator / locally generated textures; preserve replayable initial state.
- [x] Write `AGENTS.md`, repository skills under `.agents/skills`, architectural/design/asset/MCP guidelines.
- [x] `scripts/check-env.ps1` reports OS, commands, versions, GPU, browser, auth and MCP presence without exposing credentials.
- [x] Setup script with explicit options and no silent installations or paid calls.
- [x] `npm run verify` and GitHub Actions basic validation.
- [ ] Run Windows checker locally; record Windows 11/Blender/Codex/Node/Git/GPU/MCP results in local untracked file.
- [ ] Validate browser against baseline and fix runtime warnings/errors.

### M1 — Visual quality / vertical-slice art bar (P0)
- [ ] Lock art bible (`docs/ART_DIRECTION.md`): scale, palette, time of day, camera FOV, lens behavior, vegetation density, material response, weather references.
- [ ] Replace placeholder dirt/grass/stone/bark/timber with consistent, legally reusable **scanned PBR** material set (Poly Haven / ambientCG); convert to KTX2/Basis when appropriate.
- [ ] Author *one* high-quality hero tree (trunk/branches/leaves, wind animation, damage/cut states, collision proxies, harvest transition), not many mismatched low-quality trees.
- [ ] Author an optimized ground tile: terrain blending, decals, microdetail, scatter, footpaths, correct slope/collision.
- [ ] Upgrade house silhouette, roof thickness, trim, glazing, foundation joinery, seams, physical textures, decals and subtle wear.
- [ ] Build coherent HDRI/sun/sky/fog, ACES exposure, contact shadows/SSAO, reflection probes as available; control bloom and avoid artificial plastic shine.
- [ ] Add construction VFX/SFX: rope tension, sawdust, falling planks, impact audio and ambient birds/wind; **effects should correspond to actions**.
- [ ] Side-by-side screenshots vs approved reference from 3 cameras, 3 times of day and all build stages. Human visual gate.
- [ ] Profile on target browsers: desktop >= 60 FPS at 1080p preferred, midrange >= 30 FPS; quality presets, honest documented measured baseline.

### M2 — Maintainable TypeScript architecture (P0)
- [ ] Migrate from single JS scene to Vite + TypeScript modules, deterministic fixed-timestep sim, asset IDs and state boundaries while preserving visual and play behavior.
- [ ] Split `core/{game,events,save,clock}`, `world/{terrain,biomes,weather}`, `systems/{harvest,craft,build,inventory,progression}`, `render/{materials,particles,lighting}`, `physics/`, `ui/`, `data/`.
- [ ] Component/entity IDs, clean disposal, resource lifetimes, debug overlay, central input action map, camera modes.
- [ ] Runtime telemetry panel for FPS, draw calls, triangles, GPU memory estimate, physics bodies, long frames.
- [ ] Data-driven item/recipe/building definitions with schema validation and migration versioning.
- [ ] Tests for build costs, inventory transfers, transaction rollback, physics activation, resource depletion and save compatibility.

### M3 — Satisfying build loop (P0, playable alpha slice)
- [ ] Select building footprint with placement preview, rotations, terrain validity and collision checks.
- [ ] Foundation → frame → roof → furnished interior as data-driven construction phases with custom timing / resources / animations.
- [ ] Real harvesting: click tree, tool swings, gradual tree damage, falling direction safety, collectible logs, replanting.
- [ ] Distinct resource piles and pickup/drop/carry interactions with physics proxies, sound and accessibility alternatives.
- [ ] Workbench and first 10 craftable objects: axes, saw, stakes, floorboards, storage, table, bed, bucket, planter and lantern.
- [ ] Inventory with quantity, mass/stacking, container contents, quick slots and transparent recipes.
- [ ] Persistence: save/load in IndexedDB with versioned schema, autosave, export/import, corrupted-save recovery.
- [ ] First 15–20 minutes fun-test: start tree → build playable home → cook/plant → sleep, no developer controls.

### M4 — Living forest and seasons (P1)
- [ ] Procedural biomes with seeded generation, hand-authored points of interest and walkability.
- [ ] Day/night cycle, season length, sunrise, rain, wind, mud, puddles, snow (quality-scaled), shelter temperature.
- [ ] Trees grow through states (sapling/mature/old), renew resources, soil fertility, seed spread and sustainable harvest constraints.
- [ ] Dynamic wildlife: simple needs/schedules, soundscapes, tracks, avoidance, non-hostile interactions.
- [ ] Crops and gardens: sowing, watering, fertilizer, growth timing, harvest and cooking.
- [ ] Rivers/pools, realistic water presentation and selective physics interactions where affordable.

### M5 — People, character and emotional life (P1)
- [ ] One production-ready rigged player character with readable locomotion, tool use, pickup/hold, body/hand IK and collision.
- [ ] NPC daily routines: work, rest, food, shelter, socializing, tasks, relationships and personal goals.
- [ ] Task assignment for helpers, work queue, pathfinding, navmesh rebuilding around new buildings.
- [ ] Dialogue and meaningful requests; variation without endless AI API spending, authored deterministic baseline.
- [ ] Needs model (energy, hunger, warmth, morale) tuned for atmosphere instead of punishing micromanagement.
- [ ] Family/community progression *optional*, respectful, age-appropriate, no manipulative mechanics.
- [ ] Accessibility: remappable inputs, text size, subtitles, color-safe UI, reduced motion, configurable timers.

### M6 — Settlement, economy and exploration (P1)
- [ ] Multiple building categories: home, storage, mill, workshop, greenhouse, garden, bridge, gathering hall.
- [ ] Logistics: carts, hauling routes, storages, workshops, conversion chains and task prioritization.
- [ ] Experience levels and skills from doing: building, carpentry, farming, foraging, trade, exploration; transparent unlocks.
- [ ] Roads/paths and terrain ownership/unlocking that *looks* natural rather than square tiles popping in.
- [ ] Visitors/traders, fair economy, barter, rare resources, community reputation, balanced supply/demand.
- [ ] Discovery journal, ruins, landmarks, cooperative quests and environmental storytelling.

### M7 — Interaction with other players (P2; opt-in multiplayer)
- [ ] Choose server-authoritative co-op architecture: rooms/world shards; WebSocket state sync; interest management.
- [ ] Identity/privacy/consent design, private invite worlds, guest mode, rate limits and anti-grief controls.
- [ ] Shared construction with ownership/permissions, trading escrow, cooperative carrying and social activities.
- [ ] Predictive local movement and reconciliation; reliable transactions and world state snapshots.
- [ ] Moderation/report/block/mute and basic safety controls before public social rollout.
- [ ] Load tests for 2, 4, 8 concurrent players; network loss/rejoin and item duplication tests.

### M8 — Content, polish and release (P2)
- [ ] Biome variety, season-themed content, 30+ craftables, 10+ building types, polished onboarding.
- [ ] Photo mode, replayable construction camera, high-quality ambience and readable UX.
- [ ] Optimization: instancing, mesh batching, chunk streaming, LOD, mesh/material pooling, occlusion/culling, texture budgets and load screens.
- [ ] Threat modeling, dependency audits, save data integrity, privacy/legal, asset license audit.
- [ ] Automated visual regression (approved screenshots), playthrough testing and GPU-specific smoke tests.
- [ ] Responsive UI, PWA/offline plan, deploy preview/staging, release telemetry opt-in.
- [ ] Alpha/beta gates and measurable retention/fun/quality tests; avoid premature monetization.

## First major Codex execution batch

**Immediate priority:** finish M0 validation and then M1 *single hero slice*. Do not attempt to populate an entire world with random generated assets. Implement a scanned-ground + scanned-wood + hero-tree + improved lighting proof, keep 5-stage building working, profile before/after, document exact asset licenses and reference sources, capture screenshots. This is a substantial, testable vertical slice.

## Architecture and design choices

- **Web-first:** Babylon.js with WebGL2 baseline, opportunistic WebGPU; Havok for interactable dynamic props and static collision proxies; gameplay simulation independent from mesh instances.
- **Art imports:** Blender headless `.blend` / glTF `.glb`, PBR maps with proper ORM channels, consistent +Y-up exports and meter scale; maintain original/source files separately from runtime outputs.
- **Networking:** **not** part of v0.1. Start deterministic offline, model commands/events now, add authoritative backend only after single-player is convincing.
- **Persistence:** eventually IndexedDB and documented schema migrations; avoid depending on a cloud account just to play.
- **Build:** run `npm run verify` after each meaningful batch; use Playwright browser inspections if available; capture screenshot artifacts and visually inspect them.
- **Risk:** photorealism and browser perf conflict. Test on actual GPU early; optimize before generating bulk content.

## AI asset production: cheapest acceptable source first

1. Reuse licensed free assets before generation; read/check actual asset license before importing. See `docs/ASSET_SOURCES.md`.
2. Blender procedural modeling, modifications, UV/LOD/collision and material standardization (local CPU/GPU; no third-party token charge).
3. Image generation for concepts / orthographic reference / decals where provider is *actually available*; preserve source, prompts, costs and rights; no assumption that ChatGPT Plus includes an API quota.
4. Tripo Studio manually for complex hero geometry *only when visual value outweighs credits*. **Studio credits do not fund API calls**. Do not tell Codex to automate the Studio portal without authorized access; API uses distinct billing. `docs/TOOLS_MCP.md`.
5. Blender retopology + texture consistency + GLB validation; screenshot review; import to game. Reject visibly bad topology/assets rather than automatically shipping them.

**Suggested budget for the reported ~700 Studio credits, not a purchase authorization:** Reserve 150–200. Evaluate one P2 hero (100) and a few P1 tests (~35 each); account separately for UV/textures/rigging. Tripo pricing/rights can change: inspect preview cost, licensing and export permissions each time. Never click generate or call paid APIs without explicit approval for the specific batch and cap.

## Codex professional / balanced token operating contract

1. At start read `AGENTS.md`, `PLAN.md` (relevant milestone only), relevant `.agents/skills/*/SKILL.md`; discover tool availability from `codex mcp list` and `scripts/check-env.ps1` instead of claiming it.
2. Select **one coherent batch of 3–7 connected tasks** with explicit acceptance criteria. Prioritize highest risk visible result, not code volume; avoid one-task stop-and-summarize loops.
3. Search exact files/functions first; read narrow ranges, avoid repeatedly dumping the entire repo, giant logs or assets into context. Consult external docs/MCP only when blocked or when APIs may have changed.
4. Prefer existing reusable code and free licensed assets; no speculative pipelines, huge upfront abstractions, auto-purchased credits or repeated generative retries.
5. Perform changes; run targeted tests then `npm run verify` and a browser smoke/visual review. Fix regressions before proceeding. Record actual evidence/limitations.
6. Keep `PLAN.md` checkboxes accurate, append concise log to `docs/PROGRESS.md`, commit a logical tested batch and push to `main` if authorized. Check active GitHub account belongs to `AlexanderSeel`, never corporate credentials.
7. Continue to next *substantial batch* without asking between milestones, except for paid operations, protected credentials, destructive edits, unclear licensing or decisions with irreversible costs. If an external limit blocks progress, leave exact resumable next actions and blockers.
8. Model choice: cheap/fast local or Instant for simple search/format/repetitive scripts, stronger reasoning only for architecture, shader/physics debugging or complex cross-system work; no blanket high-thinking for every file. Do not waste tokens on lengthy progress essays.
9. Never mark done merely because code compiles; visible game features require screenshots/playthrough, physics needs deterministic interaction checks, and perf needs measurement.

## QA matrix

| Capability | Minimum pass | Evidence |
|---|---|---|
| Bootstrap | Node >=20, local server serves static assets | `npm run verify` |
| Gameplay | Stage 0→5, reset, clickable door, camera and lighting | Browser interaction video/screenshots |
| Physics | Havok loads, log falls/bounces and impulse works | Browser console + observed motion |
| Materials | All 18 maps load; correct roughness/normal response | DevTools network + close-up screenshot |
| Visual | Hero tree, terrain and house cohesive at 3 zooms | Screenshot review |
| Performance | Measured FPS, draw calls, memory at 1080p | Profile report |
| Licensing | Every external model/texture licensed and attributed if needed | `assets/asset-manifest.json` |
| Secrets/Costs | No API keys checked in; no unapproved paid calls | Audit + usage log |

## Deferred decisions / risks

- Final target platform (desktop-only vs mobile-first), target GPU and co-op scope; current assumption desktop browser.
- Multiplayer hosting costs/security/privacy, NPC AI and procedural generation scope are significant separate workstreams.
- Asset fidelity depends on actual graphics references; request visual approval before generating large packs.
- License review is mandatory even for libraries described as “free”; free access ≠ redistribution/commercial rights.
