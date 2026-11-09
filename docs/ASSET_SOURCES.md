# Asset Sources / license ledger — research checked 2026-11-09

| Source | Best use | Licensing decision | URL |
|---|---|---|---|
| Poly Haven | **Primary** scanned soil, timber, stone, HDRIs, realistic props | Assets CC0; commercial use and redistribution allowed; still log exact asset URL | https://polyhaven.com/ |
| ambientCG | **Primary fallback** PBR materials / HDRI | Assets CC0; exact downloaded variant/source logged | https://ambientcg.com/ |
| Quaternius | Free modular props and rigged reference assets | Specific packs list CC0; visual style generally low-poly, do not import incompatible art wholesale | https://quaternius.com/ |
| Kenney | Prototyping and UI icons, utility 3D pieces | Check each asset page; many packs CC0; realism mismatch so mostly design placeholders | https://kenney.nl/assets |
| Blender built-in procedural | Original parametric meshes, vegetation and FX | Original work; no token cost | https://www.blender.org/ |
| Tripo Studio | Select **hero meshes** where free resources and Blender insufficient | Plan/license-dependent; Studio credit != API credit; record preview cost before generation | https://studio.tripo3d.ai/ |
| Mixamo | Optional placeholder rigging/animations | Check current Adobe usage terms and redistribute/embedding limitations before relying on it | https://www.mixamo.com/ |

## Intake procedure
- Record exact URL, original title/author where available, date checked, license text URL, downloaded version and modifications in `assets/asset-manifest.json`.
- Never assume assets from the *general* marketplace are CC0; verify **each pack** (including Sketchfab/CGTrader/BlenderKit if used).
- Generate/touch-up textures using imagegen only when the environment exposes a legal/authenticated service, no silent API purchases.
- Save source `.blend`, reference images and GLBs in separate folders; do not commit unlicensed previews.
- Scan files for problematic content and avoid executing bundled downloaded scripts by default.
- Prefer low-res test imports first. Higher resolution only when validated in engine and performance justified.

## Research references
- Poly Haven license: https://polyhaven.com/license
- ambientCG CC0 statement: https://ambientcg.com/gallery
- Quaternius pack example with CC0: https://quaternius.com/packs/cyberpunkgamekit.html
- Kenney per-pack CC0 example: https://kenney.nl/assets/development-essentials
- Tripo credit / rights reference (prices and rights may change): https://www.tripo3d.ai/product-doc/getting-started/pricing-credits
- Tripo Studio/API separate billing: https://www.tripo3d.ai/help/api-plugins/tripo-studiotripo-api
