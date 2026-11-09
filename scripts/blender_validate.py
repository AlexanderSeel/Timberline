"""Validate a GLB asset headlessly in Blender; no network or paid generation.
Usage: blender -b -P scripts/blender_validate.py -- assets/source/hero-tree.glb
"""
import bpy
import json
import sys
from pathlib import Path

args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if not args or args[0]=='--help':
    print(__doc__)
    sys.exit(0)
source=Path(args[0]).expanduser().resolve()
if not source.exists() or source.suffix.lower() not in ('.glb','.gltf'):
    print('Expected readable .glb or .gltf file',file=sys.stderr)
    sys.exit(2)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
report={'file':source.name,'mesh_count':len(meshes),'triangles':sum(len(o.data.loop_triangles) for o in meshes),'materials':sorted({m.name for o in meshes for m in o.data.materials if m}), 'untextured_meshes':[o.name for o in meshes if not o.data.uv_layers]}
for m in meshes: m.data.calc_loop_triangles()
report['triangles']=sum(len(o.data.loop_triangles) for o in meshes)
print(json.dumps(report,indent=2))
if not meshes:sys.exit(3)
