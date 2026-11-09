---
name: timberline-blender-production
description: Create and verify coherent 3D GLB assets using local Blender scripting, UV, PBR, collisions and LOD; use when producing models.
---

# Blender modeling
- First verify Blender exists via `scripts/check-env.ps1`; use `blender -b -P script.py` for deterministic operations.
- Work in meters, consistent pivots, correct glTF orientation and UVs. Separate visual geometry from simple colliders.
- Export individual usable hero meshes, not offset crops of multi-object images. Do not bake fake shadows/labels in texture maps.
- Retopologize Tripo meshes, inspect normals, material count, physics alignment and mesh budgets before shipping.
- Run `scripts/blender_validate.py` and inspect in engine at multiple angles. Log model source and license.
