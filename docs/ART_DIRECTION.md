# Art Direction — grounded natural realism

**Visual target:** warm, photoreal-inspired woodland settlement viewed mostly from elevated human scale or orbit camera. Avoid toy-like saturated diorama, plastic surfaces, oversharpening or stylized cube trees. This is a realistic **game**, not a pre-rendered photo.

## Reference style
- Timber: aged structural pine with aligned grain, visible cut ends, joinery, wear and non-uniform planks.
- Earth: topsoil, stones, moss, twigs, subtle wheel marks/paths, locally blended materials and decals.
- Forest: botanically coherent tree species, branch shapes, leaf translucency, wind response, believable density and silhouettes.
- Stone and roof: proper thickness, scale-consistent texel density, UV seams hidden, no floating trim.
- Camera: 35–50 mm-equivalent feel, restrained perspective/isometric option, zoomable to human-height view, clear clipping and occlusion behavior.
- Lighting: time-of-day directional sun plus environment map, plausible sky/fog, physical roughness, natural contact shadows; adjust exposure before boosting contrast.
- Effects: particles are physically suggestive (sawdust, dust, raindrops, light smoke), subtle, readable, responsive to actions.

## Asset quality gate
1. Capture approved reference crops at ground level / 45-degree overview / close-up.
2. Source CC0 materials first. Match scale: one Blender unit = one meter; +Y up glTF; use consistent origin/pivots.
3. Validate UVs, normal mapping direction, ORM channel mapping, texture resolution/mipmaps, no baked-on lettering/highlights or random cutouts.
4. Each interactive model: render mesh + collision mesh + optional low LOD, named materials, animation states, stable IDs.
5. Import GLB in isolated test viewer before adding to the world. Compare against references in-engine, not Blender-only renders.
6. Measure memory and draw calls; compress materials/meshes where appropriate; document source and rights in `assets/asset-manifest.json`.

## Initial hero asset list
Hero pine tree (standing/felled/cut), first cabin shell/interior, low grass + stones, saw/axe, workbench, wheelbarrow, water barrel. Spend most effort on tree, soil and first structure before expanding content library.
