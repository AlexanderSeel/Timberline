# Game Design — Timberline

**Pitch:** A tactile, living, collaborative world in which a dirt clearing becomes a home, a homestead and eventually a thriving community. The challenge is in making and caring for things rather than defeating others.

## Player verbs
- **Harvest:** cut, dig, forage, mine modestly, collect rainwater; animations and grounded scarcity.
- **Create:** craft tools, furniture, building components, decorations; materials and joinery matter.
- **Build:** select, place, upgrade and repair foundations, shelters, bridges, gardens, workshops and settlements, each seen assembling.
- **Grow:** plant saplings and crops, watch weather/soil influence them, develop personal skill paths.
- **Live:** rest, cook, light fires, shelter from rain, keep warm, host visitors, decorate and inhabit spaces.
- **Interact:** talk/trade/ask NPC helpers for work; later co-op friends build, haul and explore together.

## Progression in meaningful loops
- **First 5 min:** identify a tree, collect wood, choose house footprint, raise the base. Every click has immediate visual response.
- **First 20 min:** finish shelter, furnish bed and workbench, plant something, sleep once, experience dusk/dawn.
- **First 60 min:** craft better tool, trade with visitor, discover spring, invite first helper, add a garden/workshop.
- **Midgame:** multiple households, NPC workflows, seasonal agriculture, transport/logistics and emergent social choices.
- **Long game:** co-op homestead / village, shared creations, evolving ecology, distinct regions and seasonal stories.

## Systems model
- World: heightfield/chunk data, weather, growth, light, physics affordances, navmesh and work sites.
- Entity: persistent ID, transform, owner, state, optional component data.
- Build recipe: inputs/costs, placement constraints, staged work, construction animations, functionality unlocked at completion.
- Inventory transaction: atomic item transfer with capacity and permissions; save-replay consistency.
- Skills: carpentry, forestry, gardening, craft, social, exploration. Unlock utility and expression, not compulsory grind.
- Social: deterministic dialogue/routines first; optional future AI dialogue only behind user-approved privacy/cost controls.

## Gameplay values / guardrails
- Fair, understandable resource economy; no arbitrary energy gates, no forced PvP and no exploitative dark patterns.
- Responsive tactile interactions, readable information, indoor/outdoor atmosphere and seasons.
- Solo offline fun first; multiplayer opt-in and server authoritative later.
- Age-friendly accessibility and optional lower-difficulty survival rules.
