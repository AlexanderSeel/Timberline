---
name: timberline-babylon-rendering
description: Build and debug photorealistic Babylon.js scenes, PBR materials, camera, light and Havok physics; use for engine and rendering changes.
---

# Babylon graphics and physics
- Prefer WebGL2 baseline, opportunistic WebGPU after support verification. Correct texture color spaces, ORM channels, texel scale and normal intensity.
- Maintain scene lifecycle, physics body disposal, camera controls, stable interaction IDs and memory management.
- Separate render meshes from simple colliders and deterministic simulation; never label scripted movement as physics.
- Use instancing/LOD and measurable draw calls for foliage, particles and planks.
- Inspect ground-level, close and isometric views at all affected building stages; validate lighting day and dusk, screenshots and console.
- Follow `docs/ART_DIRECTION.md`, `npm run verify`, and browser FPS diagnostics.
