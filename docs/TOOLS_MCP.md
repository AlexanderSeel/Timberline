# Codex, MCP and AI asset production — integration runbook

## Reality check
Codex works with local CLI and configured MCP tools, **not all tools automatically**. Use `codex mcp list` + `/mcp` in Codex to list actually installed tools. ChatGPT Plus access does not automatically provide an OpenAI API key or API balance. Tripo Studio credits and Tripo API credits are **different wallets**; the reported 700 Studio credits cannot be programmatically spent through Tripo API. This repo ships no credentials or service tokens.

## Recommended connectors (install only after checking trust / terms)

| Capability | Preferred path | MCP role / caution |
|---|---|---|
| GitHub | Git CLI + `gh`, existing Codex GitHub connection | Issues, commits, PRs; verify **personal** account before push |
| Browser testing | Playwright test code; optional Playwright MCP `@playwright/mcp` | Browser navigation, screenshots, assertions; test canvas **visually**, not just accessibility tree |
| Up-to-date docs | OpenAI Developer Docs MCP `https://developers.openai.com/mcp` plus Babylon/Blender official docs | Read-only; no OpenAI API calls |
| Blender | Local `blender -b -P script.py` is reliable primary path | Optional vetted Blender MCP only if discoverable and installed; restrict filesystem and Blender script execution |
| Imagegen | ChatGPT image generation manually or user-approved authenticated image API / MCP if available | Concepts / reference / textures; no assumption Codex has it |
| Tripo Studio | Web UI + manual file export into `assets/source` | 700 Studio credits require explicit per-job approval; **not callable via API using those credits** |
| Tripo API | Optional only if independently funded and keys provided securely | Never attempt/test generation on user balance without explicit approval |
| Asset search | Poly Haven/ambientCG official download + license ledger | Prefer free licensed scans; be cautious with scraping / rate limits |
| Local FS/Git | Native tools preferred; scoped MCP filesystem only if necessary | Least privilege. Current official MCP filesystem package may need Node >=24 |
| Task planning | PLAN.md & docs/PROGRESS.md | MCP memory not necessary; no hidden task state needed |

## Verified documented configurations (examples)

Codex MCP configuration lives in `~/.codex/config.toml`, or trusted project `.codex/config.toml`. This repo ships `docs/mcp.example.toml`, **not automatically active**, to avoid starting network-connected servers without consent. `codex mcp list` verifies activation.

- Docs MCP (read-only): `codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp`
- Playwright MCP: `codex mcp add playwright -- npx -y @playwright/mcp@latest`; ensure Node >=20, browser support installed, and approve execution. On Windows may use `cmd /c npx -y ...` if direct executable lookup fails.
- Optional filesystem MCP: `@modelcontextprotocol/server-filesystem` for a **single allowed workspace**; inspect current version/Node requirement; native terminal is often enough.
- Optional Github: prefer already working Codex GitHub connection; do not duplicate and accidentally route pushes through work account.

## Steps for local tool readiness
1. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-env.ps1 -ShowMcp` (or `pwsh -File ...`). Review warnings and PATH aliases before installing.
2. Run `npm run verify`, `npm start` and open `http://localhost:8797`.
3. If Codex is absent, install with documented channel; connect personal GitHub profile. `gh auth status` and `git config --get user.email` are independent of each other.
4. Install Blender, confirm `blender --version`, `blender -b -P scripts/blender_validate.py -- --help` and export a tiny test GLB.
5. Configure *read-only docs* and *browser* MCP if desired, run `codex mcp list`; do not copy a random community MCP config into the repo.
6. For imagegen/Tripo, import downloaded files into `assets/source/`, run provenance checks, and only then process with Blender. If user approves a paid batch, record estimated/actual credits in `docs/PROGRESS.md`.

## Security and cost safety
- Do not commit tokens, credentials, OAuth cookies or local machine paths. Use environment variables/secrets manager; `TRIPO_API_KEY` only when separate API billing is authorized.
- Third-party MCP servers can execute arbitrary code and expose local data; inspect repository, signatures, security and scope first.
- Never let an autonomous agent approve paid service dialogs, enroll in subscriptions, reveal passwords or mass-download licensed files silently.
- Use tool calls selectively: environment once, docs when necessary, screenshot after visual batches, Blender batch import via scripts, Tripo only on approved hero asset. Optimize **developer time**, not raw token count alone.

## Sources
- OpenAI Codex MCP docs: https://learn.chatgpt.com/docs/extend/mcp
- OpenAI docs MCP: https://developers.openai.com/learn/docs-mcp
- Playwright MCP: https://playwright.dev/docs/getting-started-mcp
- Official reference MCP servers: https://github.com/modelcontextprotocol/servers
- Tripo separate billing: https://www.tripo3d.ai/help/api-plugins/tripo-studiotripo-api
