---
name: timberline-visual-qa
description: Inspect and test actual game screenshots, physics movement, visual fidelity and frame-time; use when judging visual or UI quality.
---

# Visual regression
- Launch server and browser (Playwright MCP if installed); do not claim rendered QA from JavaScript syntax tests alone.
- Capture level 0/2/3/5, day/dusk, overview and ground-level and inspect images. Keep captures local in ignored `reports/`.
- Detect misaligned geometry, stretched UVs, plastic appearance, shadow artifacts, missing assets, flicker, clipping and inaccessible UI.
- Verify log gravity/impulse, falling tree, construction and door state with interaction, not static screenshot alone.
- Record measured FPS/draw calls on supported target GPU, never invent benchmarks from headless container.
- Follow art direction, fix largest issues and compare before/after.
