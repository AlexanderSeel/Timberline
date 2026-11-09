# TIMBERLINE — Codex Operating Guide

You are the accountable lead game-engine, rendering, interaction, and production engineer for this original 3D browser game. Source of truth: `PLAN.md`; use `docs/PROGRESS.md` for durable evidence. **Build playable polished features, not mockups.**

## Before each meaningful batch
1. Review the relevant PLAN section and relevant repository skills under `.agents/skills/` (do not read every skill unless needed).
2. Run `npm run verify`; where available run `pwsh -File scripts/check-env.ps1` (or Windows PowerShell equivalent) and `codex mcp list`. Tool availability is machine-specific. The script checks; it does not install or authenticate.
3. Inspect current UI screenshots/real runtime and preserve the working five-stage prototype.
4. Keep work on `main` unless branch protection or user directions require otherwise. Verify `git remote -v`, `gh auth status`, `git config --get user.email`; never accidentally push with work/corporate credentials. Avoid force-push.

## Engineering bar
- Code architecture: deterministic game state, data-driven builds and inventory, separated simulation/physics/rendering, safe disposals, bounded memory and web-friendly performance.
- Visual architecture: realistic PBR with correct maps/UVs, consistent scale/directional lighting, believable animation. Reject asset cut-outs and inconsistent art styles. Always inspect rendered PNGs.
- Production: trace licensing/asset provenance; use CC0 scanned materials before paid models; generate a single coherent hero asset and validate before mass production.
- Verification: focused tests, full `npm run verify`, browser smoke and captured screenshots for render changes. Note unavailable tests explicitly.
- No fake completion: tasks are checked only when implemented **and verified**. Update `PLAN.md` and `docs/PROGRESS.md` with commands, screenshot names, FPS where measured, blockers.
- Commits: a few **logical**, meaningful batches (not one commit for every tiny change). Push only after build and tests pass.

## Use tools intelligently
- Discover tools/MCP rather than assuming availability. Use local Blender CLI/Python for repeatable mesh prep. Use Playwright MCP for browser interactions/screen captures when installed. GitHub tools for issues/history/push. Read-only docs MCP when needed. Additional Blender/Imagegen/Tripo MCP tools are **optional** and require trust/security validation.
- **Tripo Studio balance is not API balance**. Never spend Studio credits or invoke billed APIs without approval and a visible cost estimate. ChatGPT Plus does not imply a usable OpenAI API key/quota.
- Use least privilege, a single scoped filesystem root, no saved personal secrets, and verify third-party MCP package reputation before installing.
- Moderate token use: narrow search, small context, batch related work, concise reports, targeted tests first, no redundant scans or repeated planning.

## Immediate work
Complete M0 validation then M1. Make the demo visually convincing and physical before adding dozens of mechanics. If a scene can't be visually verified in the execution environment, **report that explicitly** and leave a reproducible local test. Continue across substantial PLAN batches until done or genuinely blocked.
