---
name: timberline-mcp-readiness
description: Check local Codex, GitHub and MCP readiness and configure only vetted least-privilege tools; use during setup/tool integrations.
---

# Tool readiness
- Run `scripts/check-env.ps1 -ShowMcp` and `codex mcp list`, verify personal GitHub login and git commit identity.
- Read `docs/TOOLS_MCP.md` for documented official endpoints and examples; prefer native Blender CLI and Git over extra MCPs where practical.
- Docs MCP is read-only, Playwright MCP provides browser interactions; optional filesystem/Blender/Imagegen/Tripo MCP requires verification and consent.
- Never assume all tools, ChatGPT Plus API allowance or Tripo API entitlement. Never expose tokens, OAuth cookies or local secrets.
- Do not connect unknown community MCP servers or broad writable roots automatically. Record available vs missing features truthfully.
