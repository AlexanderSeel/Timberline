---
name: timberline-construction-gameplay
description: Implement harvesting, construction, crafting, inventory and progression as testable game systems; use for gameplay changes.
---

# Build / harvest / create
- Keep a working five-stage construction scene while moving toward data-driven blueprints and resources.
- Use deterministic, serializable game state; animation reflects actual stage, inventory transaction, physical pickup or skill gain.
- Harvesting requires tool action, damage, fall, drops, carrying and regrowth. Buildings require placement validity, actual costs and stages.
- Provide audio/visual feedback, reasonable accessibility, reset/replay and clear undo/repair mechanics.
- Test zero/negative quantities, inventory exploits, invalid placement and save/load compatibility.
- Verify a complete 15–20-minute first-player loop, not just button click effects.
