# TIMBERLINE — A Living World

**A realistic 3D, browser-first survival / building / growing / community game.** Start with dirt and one tree; build a shelter in visible stages, harvest and craft, create a home, cultivate life, progress through meaningful skills and eventually interact/cooperate with other inhabitants.

**Current version: `v0.1` playable prototype, not a finished game.** The initial Timberline construction demo has five animated levels, generated PBR textures, movable Havok props, a door, camera and day/dusk. The full vision and delivery gates are in [`PLAN.md`](PLAN.md). The first graphical upgrade is a scanned-material and hero-tree vertical slice.

## Quick start (Windows, Linux, macOS)

1. Install Node.js **20+**. On Windows run `powershell -File scripts/check-env.ps1` to inspect your tools (read-only).
2. Run `npm start` or `node server.cjs` (no `npm install` required for the current demo).
3. Open **http://localhost:8797**. Internet is currently required to load Babylon.js and Havok via CDN, and for the optional HDR environment.
4. Click **NEXT BUILD** to progress; **SPACE** build; **V** camera; **L** drop physics log; click logs to push; click front door to open; **R** reset.
5. Validate: `npm run verify` (static integrity + local HTTP smoke test). Other checks listed in `PLAN.md`.

Windows shortcut: double-click `start-windows.bat`; Linux/macOS: `./start.sh`.

## Project guide

- [`PLAN.md`](PLAN.md) — prioritized roadmap and task checkboxes; **single source of truth for autonomous Codex development**.
- [`AGENTS.md`](AGENTS.md) — professional code/QA/commit rules and low-waste token strategy.
- [`.agents/skills`](.agents/skills/) — 9 project skills for Codex, including Babylon rendering, Blender modeling, AI assets, gameplay, visual QA and tool-readiness.
- [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) — pillars, mechanics, 5/20/60-minute core loops.
- [`docs/ART_DIRECTION.md`](docs/ART_DIRECTION.md) — realistic art quality, render style and acceptance gates.
- [`docs/TOOLS_MCP.md`](docs/TOOLS_MCP.md) — optional Codex MCP tooling, no speculative installation.
- [`docs/ASSET_SOURCES.md`](docs/ASSET_SOURCES.md) — CC0/free material libraries, license and provenance constraints.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — implemented changes, test evidence and next steps.
- [`scripts/check-env.ps1`](scripts/check-env.ps1) — local Windows diagnostics. `scripts/setup-windows.ps1` previews install actions by default.
- [`scripts/blender_validate.py`](scripts/blender_validate.py) — offline Blender GLB geometry inspection.
- [`assets/asset-manifest.json`](assets/asset-manifest.json) — baseline original procedural asset ledger.

## Development policy

Codex should do meaningful implementation batches, keep `PLAN.md` up to date, test + inspect screenshots before each commit, and use the **personal GitHub account** for pushes. Avoid broad edits, fake demos, speculative microservice architecture, API/token spending or content bulk generation before a hero asset passes quality review.

The original maps are procedural **placeholders**, not photogrammetry. They are 512 px in the repository to keep clone size reasonable; `scripts/make_textures.py` can regenerate at that resolution with `numpy scipy Pillow`. The renderer and collision interactions need actual visual confirmation on Windows; a Node smoke test cannot prove the GPU scene looks right.

**Credit safety:** ChatGPT Plus does not automatically give OpenAI API credits. Tripo Studio credits are a separate wallet from Tripo API credits. The reported ~700 Studio credits are not accessed by the project and should be used only for explicitly approved hero assets; free CC0 scans and Blender remain the defaults.

**License:** original prototype code and generated textures from the Timberline demo; third-party downloaded assets must be reviewed and logged individually. Avoid copying protected art or identity from other games.