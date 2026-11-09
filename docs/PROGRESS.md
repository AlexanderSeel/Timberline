# Progress / validation journal

## 2026-11-09 — v0.1 baseline and development workflow
- Imported the original single-scene playable demo, with five stages, orbit camera, day/dusk, Havok log drop, generated PBR maps and interactive door.
- Added Python texture generator and compressed runtime textures (downscaled 1024 to 512 for repository footprint); actual external scanned assets are **not yet integrated**.
- Added Node project validation, server smoke test, Windows environment checks/setup, plan, art/license/MCP/skills instructions and CI definition.
- Verified in preparation workspace: `node scripts/check-project.mjs`, `npm test`, JavaScript syntax. **Not yet verified in an actual target browser/GPU** (CDN dependent and no guaranteed WebGPU environment).
- Next: visual inspect and resolve runtime issues on Windows, then M1 scanned material/hero tree slice.
