/*
 * TIMBERLINE - one-scene Babylon.js construction showcase
 * Standalone, original parametric meshes and generated PBR materials.
 * Construction elements are animated into place; Havok simulates loose logs and stones.
 * Dependencies: Babylon.js and Havok UMD loaded in index.html.
 */

const B = globalThis.BABYLON;
const el = (id) => document.getElementById(id);
const UI = {
  canvas: el('renderCanvas'), status: el('physicsBadge'), stage: el('stageNumber'),
  title: el('stageTitle'), description: el('stageDescription'), action: el('actionText'),
  progress: [...el('progressTrack').children], button: el('buildBtn'),
  message: el('buildingMessage'), wood: el('woodValue'), level: el('levelValue'),
  toast: el('toast'), drop: el('dropBtn'), reset: el('resetBtn'), view: el('viewBtn'),
  light: el('lightBtn'), weather: el('sceneWeather')
};
if (!B) {
  el('fatal').classList.remove('hidden');
  el('fatal').textContent = 'Could not load Babylon.js. Please connect to the internet and refresh. Babylon.js and Havok are loaded from the Babylon CDN.';
  throw new Error('Babylon.js CDN was not available');
}

const V = (x,y,z) => new B.Vector3(x,y,z);
const T = (a,b,t) => a+(b-a)*t;
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const ease = (t) => 1-Math.pow(1-t,3);
const smooth = (t) => t*t*(3-2*t);
const rand = (a=0,b=1) => a+Math.random()*(b-a);
const rnd = (a,b) => Math.floor(rand(a,b));
const HOME = {x:1.2, left:-3, right:5.4, front:-3.15, back:3.15, floor:1.06, eave:4.75, ridge:6.65};
const STAGES = [
  { title:'Unclaimed woodland', description:'A quiet clearing. One tree. Enough raw timber to begin somewhere new.', action:'HARVEST THE TREE', wood:0 },
  { title:'The first clearing', description:'Timber harvested. Flatten the earth, mark the corners, and prepare the building footprint.', action:'LAY THE FOUNDATION', wood:6 },
  { title:'Stone & timber base', description:'Footings settle into the earth. Heavy beams lock together to form a stable base.', action:'RAISE THE TIMBER FRAME', wood:11 },
  { title:'A structure emerges', description:'Floorboards and upright posts click into place. The silhouette of your cabin appears.', action:'INSTALL THE WALLS', wood:17 },
  { title:'Protected from the wind', description:'Weathered timber walls, glazed windows and a working wooden door transform the frame.', action:'COMPLETE THE CABIN', wood:22 },
  { title:'Your woodland cabin', description:'Cedar roof, chimney and porch complete your first home. Drop logs, push them, and explore!', action:'CABIN COMPLETED', wood:24 },
];

const canvas = UI.canvas;
const engine = new B.Engine(canvas, true, {preserveDrawingBuffer:true, stencil:true, antialias:true, powerPreference:'high-performance'});
if (window.devicePixelRatio > 1) engine.setHardwareScalingLevel(Math.min(1.5, window.devicePixelRatio / 1.35));
const scene = new B.Scene(engine);
scene.clearColor = new B.Color4(.55,.64,.64,1);
scene.ambientColor = new B.Color3(.24,.26,.20);
scene.fogMode = B.Scene.FOGMODE_EXP2;
scene.fogDensity = .008;
scene.fogColor = new B.Color3(.64,.72,.70);
scene.imageProcessingConfiguration.contrast = 1.26;
scene.imageProcessingConfiguration.exposure = 1.22;
scene.imageProcessingConfiguration.toneMappingEnabled = true;
scene.imageProcessingConfiguration.toneMappingType = B.ImageProcessingConfiguration.TONEMAPPING_ACES;
scene.skipPointerMovePicking = true;
try { scene.environmentTexture = B.CubeTexture.CreateFromPrefilteredData('https://assets.babylonjs.com/environments/environmentSpecular.env',scene); scene.environmentIntensity=.52; } catch(e) { console.info('HDR environment optional',e); }

const camera = new B.ArcRotateCamera('orbital-camera', -Math.PI/2.62,1.11,26,V(.1,2.9,0),scene);
camera.attachControl(canvas,true);
camera.lowerRadiusLimit=10;
camera.upperRadiusLimit=43;
camera.lowerBetaLimit=.25;
camera.upperBetaLimit=Math.PI*.48;
camera.wheelDeltaPercentage=.014;
camera.pinchDeltaPercentage=.018;
camera.panningSensibility=0;
camera.inertia=.72;
camera.angularSensibilityX=1400;
camera.angularSensibilityY=1400;

const hemispheric = new B.HemisphericLight('skylight',V(.2,1,.3),scene);
hemispheric.intensity=.80;
hemispheric.diffuse=new B.Color3(.79,.87,1);
hemispheric.groundColor=new B.Color3(.43,.32,.19);
const sun = new B.DirectionalLight('late-afternoon-sun',V(-.72,-1.15,-.48),scene);
sun.position=V(22,37,19);
sun.intensity=2.5;
sun.diffuse=new B.Color3(1,.87,.70);
const shadows = new B.ShadowGenerator(2048,sun);
shadows.usePercentageCloserFiltering=true;
shadows.filteringQuality=B.ShadowGenerator.QUALITY_MEDIUM;
shadows.bias=.0012;
shadows.normalBias=.02;

// Materials use generated albedo, tangent-space normals and roughness maps.
function surface(name, {tiling=1, rough=.8, tint=[1,1,1], bump=.7, metal=0}={}) {
  const m=new B.PBRMaterial(name,scene);
  m.albedoTexture=new B.Texture(`./assets/${name}_color.jpg`,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE);
  m.bumpTexture=new B.Texture(`./assets/${name}_normal.png`,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE);
  m.bumpTexture.level=bump;m.bumpTexture.gammaSpace=false;
  m.metallicTexture=new B.Texture(`./assets/${name}_roughness.png`,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE);
  m.metallicTexture.gammaSpace=false;
  m.useRoughnessFromMetallicTextureGreen=true;
  m.useMetallnessFromMetallicTextureBlue=false;
  m.metallic=metal; m.roughness=rough;
  m.albedoColor=new B.Color3(...tint);
  for (const tex of [m.albedoTexture,m.bumpTexture,m.metallicTexture]) {tex.uScale=tiling;tex.vScale=tiling;tex.wrapU=B.Texture.WRAP_ADDRESSMODE;tex.wrapV=B.Texture.WRAP_ADDRESSMODE;}
  return m;
}
function colorMat(name,r,g,b,rough=.8,metal=0){
  const m=new B.PBRMaterial(name,scene);m.albedoColor=new B.Color3(r,g,b);m.roughness=rough;m.metallic=metal;return m;
}
const M={
  dirt:surface('dirt',{tiling:9,bump:.45}),wood:surface('wood',{bump:.72}),
  woodLight:surface('wood',{tint:[1.28,1.15,1.01],bump:.65}),
  bark:surface('bark',{tiling:1.5,bump:.7}),stone:surface('stone',{bump:.8}),
  roof:surface('roof',{bump:.7}),grass:surface('grass',{tiling:4,bump:.4}),
  leaves:colorMat('evergreen',.16,.30,.18,.9),
  leafLight:colorMat('foliage-moss',.20,.39,.21,.91),
  leafDark:colorMat('foliage-dark',.09,.20,.125,.89),
  iron:colorMat('aged-iron',.13,.14,.13,.35,.75),
  glass:colorMat('window-glass',.41,.66,.73,.12,.10),
  warm:colorMat('warm-window',1,.62,.28,.25),
  dust:colorMat('wood-dust',.69,.51,.29,1),
  straw:colorMat('straw',.45,.53,.24,.95),
  darkEarth:surface('dirt',{tiling:2,bump:.7,tint:[.69,.63,.58]}),
};
M.glass.alpha=.54;
M.glass.transparencyMode=B.Material.MATERIAL_ALPHABLEND;
M.warm.emissiveColor=new B.Color3(1,.43,.11);
M.warm.emissiveIntensity=.8;

const animated=[];
const staticBodies=[];
const colliderLevels=new Set();
const dynamicBodies=[];
const stageMeshes=Array.from({length:6},()=>[]);
let physicsReady=false;
let buildLevel=0;
let constructing=false;
let tree=null;
let fall=null;
let doorPivot=null;
let doorOpen=false;
let doorTarget=0;
let cameraGround=false;
let dusk=false;
let glowFlashes=[];
let toastTimer;

function markShadow(mesh) {
  if (mesh && mesh.getClassName && mesh.getClassName() === 'Mesh') shadows.addShadowCaster(mesh);
}
function box(name,w,h,d,pos,material,shadow=false) {
  const m=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);
  m.position.copyFrom(pos);m.material=material;m.receiveShadows=true;
  if (shadow)markShadow(m);
  return m;
}
function cylinder(name,height,db,dt,pos,material,shadow=false,tess=12){
  const m=B.MeshBuilder.CreateCylinder(name,{height,diameterBottom:db,diameterTop:dt,tessellation:tess},scene);
  m.position.copyFrom(pos);m.material=material;m.receiveShadows=true;
  if(shadow)markShadow(m);
  return m;
}
function sphere(name,dia,pos,material,segments=8,shadow=false){
  const m=B.MeshBuilder.CreateIcoSphere(name,{radius:dia/2,subdivisions:segments>8?2:1},scene);
  m.position.copyFrom(pos);m.material=material;
  if(shadow)markShadow(m);
  return m;
}
function parentTo(child,parent) {child.parent=parent;return child;}
function spawn(mesh,level,delay=0, {shadow=true,from='up'}={}) {
  stageMeshes[level].push(mesh);
  if(shadow)markShadow(mesh);
  const pos=mesh.position.clone(),scl=mesh.scaling.clone(),rot=mesh.rotation.clone();
  const source=pos.clone();source.x+=from==='side'?rand(-6,6):rand(-1.8,1.8);
  source.y+=from==='side'?rand(1,3):rand(5,8);
  source.z+=rand(-1.2,1.2);
  const delayMs=delay*1000;
  mesh.position.copyFrom(source);
  mesh.scaling.scaleInPlace(.10);
  mesh.rotation.set(rot.x+rand(-.6,.6),rot.y+rand(-1.4,1.4),rot.z+rand(-.65,.65));
  mesh.setEnabled(false);
  animated.push({mesh,position:pos,scale:scl,rotation:rot,source,start:performance.now()+delayMs,duration:rand(600,970),done:false});
  return mesh;
}
function disposeLevel(){
  for(const a of animated)if(a.mesh&&!a.mesh.isDisposed())a.mesh.setEnabled(false);
  animated.length=0;
  for(const s of staticBodies){try{s.dispose();}catch{}}
  staticBodies.length=0;colliderLevels.clear();
  for(const list of stageMeshes){for(const m of list){if(m&&!m.isDisposed())m.dispose();}list.length=0;}
  for(const b of dynamicBodies){try{b.aggregate?.dispose();}catch{} if(b.mesh&&!b.mesh.isDisposed())b.mesh.dispose();}
  dynamicBodies.length=0;
  for(const g of glowFlashes){if(g.mesh&&!g.mesh.isDisposed())g.mesh.dispose();}
  glowFlashes=[];
  if (doorPivot){doorPivot.dispose();doorPivot=null;}
  if (tree){tree.dispose();tree=null;}
  fall=null;
}
function pulse(x,y,z,material=M.warm){
  const p=B.MeshBuilder.CreateTorus('construction-pulse',{diameter:1.3,thickness:.035,tessellation:48},scene);
  p.position=V(x,y,z);p.rotation.x=Math.PI/2;
  const m=colorMat('pulse-flash-'+Math.random(),.94,.75,.36,.45);
  m.emissiveColor=new B.Color3(.65,.38,.12);m.alpha=.63;
  p.material=m;
  glowFlashes.push({mesh:p,time:performance.now()});
}

// Generative terrain: displacement mesh + multiple grasses, small rocks, forest debris.
function terrain(){
  const ground=B.MeshBuilder.CreateGround('sculpted-dirt-terrain',{width:48,height:48,subdivisions:100,updatable:true},scene);
  const positions=ground.getVerticesData(B.VertexBuffer.PositionKind);
  for(let i=0;i<positions.length;i+=3){const x=positions[i],z=positions[i+2];
    const dist=Math.sqrt((x-1)**2+z*z);
    const hills=(Math.sin(x*.26)*Math.cos(z*.35)*.42+Math.sin(z*.53+x*.18)*.17)*smooth(clamp((dist-5.3)/12,0,1));
    positions[i+1]=hills+.025*Math.sin(x*3.4)*Math.cos(z*2.3);
  }
  ground.updateVerticesData(B.VertexBuffer.PositionKind,positions);
  const indices=ground.getIndices();const normals=[];
  B.VertexData.ComputeNormals(positions,indices,normals);
  ground.updateVerticesData(B.VertexBuffer.NormalKind,normals);
  ground.material=M.dirt;ground.receiveShadows=true;
  const pad=box('site-underlay',9,.10,7,V(HOME.x,.06,0),M.darkEarth);
  pad.isVisible=false; // Becomes visible during site preparation.
  const groundMat=colorMat('grass-blade',1,1,1,.97);
  groundMat.backFaceCulling=false;
  const positionsGrass=[],indicesGrass=[],colorsGrass=[];
  let vert=0;
  for(let i=0;i<3600;i++){
    const x=rand(-22,22),z=rand(-22,22);
    if (Math.abs(x-HOME.x)<5.15&&Math.abs(z)<4.2)continue;
    if (Math.abs(x+5.8)<1.4&&Math.abs(z-2)<1.4)continue;
    const h=(Math.sin(x*.26)*Math.cos(z*.35)*.42+Math.sin(z*.53+x*.18)*.17)*smooth(clamp((Math.hypot(x-1,z)-5.3)/12,0,1));
    const s=rand(.12,.38),side=rand(.035,.11),a=rand(0,6.28),dx=Math.cos(a),dz=Math.sin(a);
    positionsGrass.push(x-dx*side,h,z-dz*side, x+dx*side,h,z+dz*side,x+rand(-.11,.11),h+s,z+rand(-.11,.11));
    const c=rand(.75,1.22);for(let q=0;q<3;q++)colorsGrass.push(.20*c,.37*c,.145*c,1);
    indicesGrass.push(vert,vert+1,vert+2);vert+=3;
  }
  const grass=new B.Mesh('wildgrass-mesh',scene);
  const dat=new B.VertexData();dat.positions=positionsGrass;dat.indices=indicesGrass;dat.colors=colorsGrass;dat.normals=[];B.VertexData.ComputeNormals(positionsGrass,indicesGrass,dat.normals);dat.applyToMesh(grass);
  grass.material=groundMat;grass.hasVertexAlpha=false;grass.alwaysSelectAsActiveMesh=true;
  for(let i=0;i<72;i++){
    const x=rand(-19,19),z=rand(-19,19);
    if(Math.abs(x-HOME.x)<5.3 && Math.abs(z)<4.8)continue;
    const r=rand(.10,.50);
    const y=(Math.sin(x*.26)*Math.cos(z*.35)*.42+Math.sin(z*.53+x*.18)*.17)*smooth(clamp((Math.hypot(x-1,z)-5.3)/12,0,1));
    const stone=sphere('field-stone',r,V(x,y+r*.22,z),M.stone);
    stone.scaling=V(rand(.75,1.4),rand(.40,.85),rand(.8,1.5));stone.rotation.y=rand(0,Math.PI);
  }
  return {ground,pad};
}
const environment=terrain();

function createTreeAt(x,z,size=1,primary=false){
  const root=new B.TransformNode(primary?'harvest-tree-root':'forest-tree-root',scene);
  root.position=V(x,0,z);
  const trunk=parentTo(cylinder('tree-trunk',6.6*size,1.0*size,.40*size,V(0,3.3*size,0),M.bark,true,12),root);
  trunk.rotation.y=rand(0,Math.PI);
  const branches=primary?19:12;
  for(let i=0;i<branches;i++){
    const y=rand(2.65,6.1)*size,angle=(i/branches)*Math.PI*2+rand(-.4,.4);
    const length=rand(1.4,2.8)*size;
    const a=V(0,y,0);
    const b=V(Math.cos(angle)*length,y+rand(.55,1.75)*size,Math.sin(angle)*length);
    const vec=b.subtract(a);const segment=cylinder('tree-branch',vec.length(),.20*size,.06*size,V(0,0,0),M.bark,false,7);
    segment.position=a.add(b).scale(.5);
    segment.lookAt(b);segment.rotate(B.Axis.X,Math.PI/2,B.Space.LOCAL);
    parentTo(segment,root);
  }
  const groups=primary?56:24;
  for(let i=0;i<groups;i++){
    const angle=rand(0,6.283),radius=rand(.45,2.55)*size;
    const y=rand(3.9,7.9)*size;
    const p=V(Math.cos(angle)*radius,y,Math.sin(angle)*radius);
    const mm=[M.leaves,M.leafLight,M.leafDark][rnd(0,3)];
    const cl=sphere('foliage-cluster',rand(.85,1.6)*size,p,mm,8,primary&&i%5===0);
    cl.scaling=V(rand(.75,1.3),rand(.8,1.55),rand(.75,1.4));parentTo(cl,root);
  }
  return root;
}
function makePrimaryTree(){tree=createTreeAt(-6.35,1.85,1.05,true);}
makePrimaryTree();
// Surrounding vegetation keeps the scene in a woodland, even after harvest.
[[-14,-12,.72],[-14,10,.80],[15,13,.9],[17,-8,.75],[-10,17,.82],[9,18,.65]].forEach(([x,z,s])=>createTreeAt(x,z,s));

function addStaticProxy(name,w,h,d,x,y,z,rotation=0){
  if(!physicsReady)return;
  const mesh=box(name,w,h,d,V(x,y,z),M.wood);
  mesh.rotation.z=rotation;mesh.visibility=0;mesh.isPickable=false;
  const agg=new B.PhysicsAggregate(mesh,B.PhysicsShapeType.BOX,{mass:0,friction:.85,restitution:.1},scene);
  staticBodies.push(agg);
  // Retain the proxy mesh for cleanup, independent of construction art assets.
  stageMeshes[buildLevel].push(mesh);
}
function collisionForLevel(level){
  if(!physicsReady||colliderLevels.has(level))return;
  colliderLevels.add(level);
  if(level===2)addStaticProxy('foundation-collision',8.4,.38,6.3,HOME.x,.85,0);
  if(level===3)addStaticProxy('floor-collision',8.4,.3,6.3,HOME.x,1.02,0);
  if(level===4){
    addStaticProxy('wall-left-collision',.3,3.4,6.3,HOME.left,2.85,0);
    addStaticProxy('wall-right-collision',.3,3.4,6.3,HOME.right,2.85,0);
    addStaticProxy('wall-back-collision',8.4,3.4,.3,HOME.x,2.85,HOME.back);
  }
}
function movingLog(x=rand(-4,4),z=rand(-4,4),y=10){
  if(!physicsReady){showToast('Havok physics is still loading.');return;}
  const mesh=cylinder('physics-log',1.9,.62,.62,V(x,y,z),M.bark,true,12);
  mesh.rotation.z=rand(-1.8,1.8);
  // end-grain plugs make the rolling wood visually legible
  mesh.metadata={kickable:true};
  const agg=new B.PhysicsAggregate(mesh,B.PhysicsShapeType.CYLINDER,
    {mass:4,friction:.67,restitution:.19},scene);
  dynamicBodies.push({mesh,aggregate:agg});
  agg.body.setLinearVelocity(V(rand(-1.2,1.2),rand(-1,0),rand(-1,1)));
  if(dynamicBodies.length>24){const old=dynamicBodies.shift();old.aggregate.dispose();old.mesh.dispose();}
  showToast('Physics log dropped — click it to push!');
}
function looseStones(){
  if(!physicsReady)return;
  for(let i=0;i<4;i++){
    const d=rand(.38,.62),mesh=sphere('physics-stone',d,V(rand(-7,-4),rand(2,3),rand(-5,-3)),M.stone,12,true);
    mesh.scaling=V(1,rand(.7,1.15),rand(.8,1.5));mesh.metadata={kickable:true};
    const agg=new B.PhysicsAggregate(mesh,B.PhysicsShapeType.SPHERE,{mass:1.4,friction:.85,restitution:.25},scene);
    dynamicBodies.push({mesh,aggregate:agg});
  }
}

// Animated site preparation and handcrafted structural assembly.
function prepareSite(){
  environment.pad.isVisible=false;
  const marker=box('earth-work-pad',8.55,.06,6.6,V(HOME.x,.12,0),M.darkEarth);
  spawn(marker,1,0,{shadow:false});
  let delay=.15;
  for(const x of [HOME.left,HOME.right])for(const z of [HOME.front,HOME.back]){
    const stake=cylinder('survey-stake',.95,.17,.13,V(x,.53,z),M.woodLight);
    spawn(stake,1,delay,{shadow:false});delay+=.22;
    const block=box('rough-ground-stone',.55,.35,.55,V(x,.19,z),M.stone);
    spawn(block,1,delay,{shadow:true});delay+=.18;
  }
}
function logPile(){
  for(let i=0;i<7;i++){
    const row=i%3,layer=Math.floor(i/3);
    const log=cylinder('harvested-log',2.5,.5,.49,V(-7.15+layer*.15,.45+layer*.47,-1.75+row*.53),M.bark);
    log.rotation.z=Math.PI/2;
    stageMeshes[1].push(log);
  }
}
function foundation(){
  let t=.05;
  for(const x of [-2.7,-.1,2.7,5.1])for(const z of [-2.95,0,2.95]){
    const s=box('stone-footing',.8,.48,.8,V(x,.34,z),M.stone);
    s.rotation.y=rand(-.11,.11);spawn(s,2,t,{shadow:true});t+=.115;
  }
  const rails=[
    [8.4,.37,.43,HOME.x,.72,HOME.front],[8.4,.37,.43,HOME.x,.72,HOME.back],
    [.43,.37,6.3,HOME.left,.72,0],[.43,.37,6.3,HOME.right,.72,0],
    [8.2,.35,.27,HOME.x,.72,0],
  ];
  for(const [w,h,d,x,y,z] of rails){spawn(box('foundation-beam',w,h,d,V(x,y,z),M.wood,true),2,t);t+=.17;}
  for(let i=0;i<12;i++){
    const z=-2.9+i*.53;
    const brace=box('subfloor-joist',8.15,.22,.14,V(HOME.x,.83,z),M.woodLight);
    spawn(brace,2,t,{shadow:i%3===0});t+=.055;
  }
}
function timberFrame(){
  let t=.02;
  for(let i=0;i<18;i++){
    const z=HOME.front+.18+i*.345;
    const plank=box('floor-board',8.15,.15,.305,V(HOME.x,HOME.floor,z),i%5===0?M.woodLight:M.wood);
    spawn(plank,3,t,{shadow:i%4===0});t+=.095;
  }
  for(const x of [HOME.left,HOME.x,HOME.right])for(const z of [HOME.front,HOME.back]){
    const post=box('hand-hewn-upright',.32,3.65,.32,V(x,2.93,z),M.woodLight);
    spawn(post,3,t);t+=.13;
  }
  for(const z of [HOME.front,HOME.back]){
    spawn(box('upper-plate',8.6,.33,.33,V(HOME.x,4.72,z),M.wood),3,t);t+=.16;
  }
  for(const x of [HOME.left,HOME.right]){
    spawn(box('upper-side-plate',.33,.33,6.55,V(x,4.72,0),M.wood),3,t);t+=.16;
  }
  // diagonal knee braces, rotated within the facade plane
  for(const x of [-2.52,4.92])for(const z of [HOME.front+.1,HOME.back-.1]){
    const brace=box('knee-brace',.16,1.35,.24,V(x,3.76,z),M.woodLight);
    brace.rotation.z=x<0?-Math.PI/4:Math.PI/4;
    spawn(brace,3,t);t+=.11;
  }
}
function subtractWindows(segments,openings){
  for(const [l,r] of openings){
    const next=[];
    for(const [a,b] of segments){
      if(r<=a||l>=b){next.push([a,b]);continue;}
      if(a<l)next.push([a,l]);
      if(b>r)next.push([r,b]);
    }
    segments=next;
  }
  return segments;
}
function addWall(axis,fixed,min,max,openings,t0){
  let t=t0;
  const bottom=1.25,top=4.55,step=.25;
  for(let row=0;bottom+row*step<top;row++){
    const y=bottom+row*step;
    const blocked=openings.filter(o=>y+step>o.y0&&y<o.y1).map(o=>[o.a,o.b]);
    const parts=subtractWindows([[min,max]],blocked);
    for(const [a,b] of parts){
      if(b-a<.09)continue;
      const w=axis==='x'?b-a:.235,d=axis==='z'?b-a:.235;
      const x=axis==='x'?(a+b)*.5:fixed,z=axis==='z'?(a+b)*.5:fixed;
      const slat=box('wall-clapboard',w,.245,d,V(x,y,z),row%5===0?M.woodLight:M.wood);
      spawn(slat,4,t,{shadow:row%3===0});t+=.038;
    }
  }
  return t;
}
function windowFrame(axis,fixed,mid,lower,upper,width,delay){
  const horizontal=axis==='x';
  const outer=horizontal?{x:mid,z:fixed}:{x:fixed,z:mid};
  const a=lower,b=upper;
  const edge=(horizontal?width:width)*.5;
  for(const delta of [-edge,edge]){
    const pos=horizontal?V(mid+delta,(a+b)/2,fixed):V(fixed,(a+b)/2,mid+delta);
    const bar=box('window-vertical-jamb',horizontal?.12:.29,b-a+.2,horizontal?.29:.12,pos,M.woodLight);
    spawn(bar,4,delay,{shadow:false});delay+=.025;
  }
  for(const y of [a,b]){
    const bar=box('window-horizontal-jamb',horizontal?width+.17:.26,.12,horizontal?.27:width+.17,V(outer.x,y,outer.z),M.woodLight);
    spawn(bar,4,delay,{shadow:false});delay+=.025;
  }
  const glass=box('glass-pane',horizontal?width-.10:.08,b-a-.1,horizontal?.07:width-.10,V(outer.x,(a+b)/2,outer.z),M.glass);
  glass.isPickable=false;spawn(glass,4,delay,{shadow:false});delay+=.035;
  const cross=box('window-center-cross',horizontal?.075:.14,b-a-.07,horizontal?.15:.075,V(outer.x,(a+b)/2,outer.z),M.woodLight);
  spawn(cross,4,delay,{shadow:false});delay+=.03;
  return delay;
}
function door(){
  doorPivot=new B.TransformNode('real-hinged-door',scene);
  doorPivot.position=V(.50,1.28,HOME.front-.22);
  const slab=box('click-to-open-wooden-door',1.53,2.48,.14,V(.77,1.24,0),M.woodLight);
  slab.parent=doorPivot;
  slab.metadata={door:true};
  spawn(slab,4,2.0,{shadow:true});
  for(let n=0;n<4;n++){
    const sl=box('door-plank-detail',.10,2.33,.19,V(.20+n*.38,1.24,-.01),M.wood);
    sl.parent=doorPivot;sl.metadata={door:true};spawn(sl,4,2.01+n*.045,{shadow:false});
  }
  const handle=sphere('door-handle',.15,V(1.27,1.2,-.17),M.iron,8);
  handle.parent=doorPivot;handle.metadata={door:true};spawn(handle,4,2.3,{shadow:false});
  doorPivot.rotation.y=0;
}
function walls(){
  const frontOpen=[{a:.5,b:2.02,y0:1.0,y1:3.83},{a:-1.95,b:-.75,y0:2.25,y1:3.47},{a:3.14,b:4.31,y0:2.25,y1:3.47}];
  const backOpen=[{a:.18,b:2.05,y0:2.25,y1:3.5}];
  const sideOpen=[{a:-.75,b:.95,y0:2.2,y1:3.45}];
  addWall('x',HOME.front,HOME.left,HOME.right,frontOpen,.04);
  addWall('x',HOME.back,HOME.left,HOME.right,backOpen,.48);
  addWall('z',HOME.left,HOME.front,HOME.back,sideOpen,.90);
  addWall('z',HOME.right,HOME.front,HOME.back,sideOpen,1.25);
  // Place glazed windows and sturdy hand-built timber frames.
  let tt=1.7;
  for(const [axis,fixed,mid,width] of [['x',HOME.front,-1.35,1.2],['x',HOME.front,3.72,1.17],['x',HOME.back,1.115,1.87],['z',HOME.left,.10,1.70],['z',HOME.right,.10,1.70]]){
    tt=windowFrame(axis,fixed,mid,2.25,3.47,width,tt);
  }
  door();
  // Diagonal lintel above the entrance and front door frame.
  spawn(box('entrance-lintel',1.87,.19,.34,V(1.26,3.80,HOME.front-.02),M.woodLight),4,2.2);
  for(const x of [.43,2.07])spawn(box('door-jamb',.16,2.68,.26,V(x,2.49,HOME.front-.09),M.woodLight),4,2.3);
}
function roofPiece(name,w,h,d,x,y,z,rot,t,shadow=true,material=M.roof){
  const p=box(name,w,h,d,V(x,y,z),material);
  p.rotation.z=rot;return spawn(p,5,t,{shadow});
}
function finishCabin(){
  let t=.03;
  const angle=Math.atan2(HOME.ridge-HOME.eave,(HOME.right-HOME.left)/2);
  for(const sign of [-1,1]){
    const x=HOME.x+sign*2.2;
    const rot=-sign*angle;
    roofPiece('roof-structural-plane',4.92,.18,7.2,x,5.70,0,rot,t,true,M.wood);t+=.20;
    // individual layered shingles, placed along the slope. No image baked into the wall.
    for(let j=0;j<7;j++)for(let k=0;k<11;k++){
      const xx=HOME.x+sign*(.45+j*.64),zz=-3.2+k*.64;
      const yy=HOME.ridge-(HOME.ridge-HOME.eave)*(Math.abs(xx-HOME.x)/4.2)+.12;
      const sh=box('overlapping-cedar-shingle',.77,.10,.64,V(xx,yy,zz),M.roof);
      sh.rotation.z=rot;
      spawn(sh,5,t+(.017*(j+k)),{shadow:false});
    }
    t+=.27;
  }
  roofPiece('ridge-cap',.29,.27,7.37,HOME.x,HOME.ridge+.13,0,0,t,true,M.woodLight);t+=.12;
  // exposed timber gable beams
  for(const sign of [-1,1])for(const z of [HOME.front,HOME.back]){
    const beam=box('gable-rafter',4.87,.22,.18,V(HOME.x+sign*2.1,5.72,z),M.woodLight);
    beam.rotation.z=-sign*angle;spawn(beam,5,t);t+=.08;
  }
  // stone chimney rising through the rear section of the roof
  for(let row=0;row<9;row++)for(let face=0;face<4;face++){
    const x=3.85+((face===0)?-.37:(face===1)?.37:0), z=1.67+((face===2)?-.38:(face===3)?.38:0);
    const w=face<2?.18:.91,d=face>=2?.18:.91;
    const brick=box('chimney-stone',w,.28,d,V(x,4.88+row*.29,z),M.stone);
    spawn(brick,5,t+row*.05,{shadow:row%3===0});
  }
  t+=.45;
  // Small entry porch + stairs
  for(let i=0;i<6;i++){
    const p=box('porch-deck-plank',2.94,.15,.40,V(1.25,.82,-3.34-i*.38),i%3===0?M.woodLight:M.wood);
    spawn(p,5,t+i*.05,{shadow:i%3===0});
  }
  for(let i=0;i<3;i++){
    spawn(box('porch-step',2.6,.21,.39,V(1.25,.19+i*.19,-6.05+i*.36),M.woodLight),5,t+.43+i*.10);
  }
  for(const x of [-.18,2.69]){
    spawn(box('porch-post',.20,2.25,.2,V(x,1.99,-5.18),M.woodLight),5,t+.35);
    spawn(box('rail-top',.16,.15,1.85,V(x,1.65,-4.35),M.wood),5,t+.51);
  }
  // Warm lamp welcomes the player at the entrance.
  const lamp=sphere('porch-lantern',.29,V(2.45,3.47,-3.53),M.warm,12);
  spawn(lamp,5,t+.74,{shadow:false});
  const lampLight=new B.PointLight('cabin-lantern-light',V(2.45,3.47,-3.63),scene);
  lampLight.diffuse=new B.Color3(1,.59,.28);lampLight.intensity=0;lampLight.range=10;
  stageMeshes[5].push({dispose:()=>lampLight.dispose(),isDisposed:()=>false});
  const on=()=>{lampLight.intensity=dusk?3.0:1.0};setTimeout(on,1600);
}

function startFall(){
  if(!tree)return;
  fall={started:performance.now(),duration:1800,root:tree};
}
function showToast(message){
  UI.toast.textContent=message;UI.toast.classList.add('visible');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>UI.toast.classList.remove('visible'),2500);
}
function updateUI(){
  const step=STAGES[buildLevel];
  UI.stage.innerHTML=String(buildLevel).padStart(2,'0')+' <span>/ 05</span>';
  UI.title.textContent=step.title;UI.description.textContent=step.description;
  UI.action.textContent=step.action;
  UI.wood.textContent=`${step.wood} / 24`;
  UI.level.textContent=`${buildLevel} / 5`;
  UI.progress.forEach((p,i)=>p.classList.toggle('active',i<buildLevel));
  UI.button.disabled=constructing||buildLevel===5;
  if(buildLevel===5){UI.button.querySelector('small').textContent='ALL LEVELS COMPLETE';UI.button.querySelector('.build-arrow').textContent='✓';}
  else {UI.button.querySelector('small').textContent='NEXT BUILD';UI.button.querySelector('.build-arrow').textContent='↗';}
  if(!constructing)UI.message.textContent=buildLevel===5?'CABIN BUILT · PHYSICS ACTIVE · EXPLORE':'CLICK TO CONTINUE CONSTRUCTION';
}
async function advance(){
  if(constructing||buildLevel>=5)return;
  constructing=true;
  buildLevel++;
  updateUI();
  UI.message.textContent='CONSTRUCTION IN PROGRESS · TIMBERS MOVING';
  UI.button.disabled=true;
  const level=buildLevel;
  if(level===1){startFall();prepareSite();}
  if(level===2)foundation();
  if(level===3)timberFrame();
  if(level===4)walls();
  if(level===5)finishCabin();
  pulse(HOME.x,.35,0);
  const end=Math.max(2900,...animated.filter(x=>!x.done).map(x=>(x.start-performance.now())+x.duration));
  setTimeout(()=>{
    if(buildLevel!==level)return;
    if(level===1)logPile();
    collisionForLevel(level);
    constructing=false;
    updateUI();
    showToast(level===5?'Cabin complete. Explore your build!':'Build stage '+level+' complete');
  },end+300);
}
function reset(){
  if(constructing){showToast('Finish the current construction stage first.');return;}
  disposeLevel();
  environment.pad.isVisible=false;
  makePrimaryTree();
  buildLevel=0;doorOpen=false;doorTarget=0;
  updateUI();
  if(physicsReady)looseStones();
  showToast('The woodland clearing has been restored.');
}

// Animation update: spring-driven timber flight, falling tree, interactive door and build highlights.
let lastTime=performance.now();
scene.onBeforeRenderObservable.add(()=>{
  const now=performance.now(),dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;
  for(const item of animated){
    if(item.done||now<item.start)continue;
    const {mesh}=item;
    if(mesh.isDisposed()){item.done=true;continue;}
    mesh.setEnabled(true);
    const tt=clamp((now-item.start)/item.duration,0,1),e=ease(tt);
    mesh.position.copyFrom(B.Vector3.Lerp(item.source,item.position,e));
    // brief impact overtravel is kept subtle for realistic timber motion
    if(tt>.75&&tt<1)mesh.position.y+=Math.sin((tt-.75)*Math.PI/.25)*.028;
    mesh.scaling.copyFrom(B.Vector3.Lerp(item.scale.scale(.1),item.scale,e));
    mesh.rotation.x=T(mesh.rotation.x,item.rotation.x,clamp(dt*16,0,1));
    mesh.rotation.y=T(mesh.rotation.y,item.rotation.y,clamp(dt*16,0,1));
    mesh.rotation.z=T(mesh.rotation.z,item.rotation.z,clamp(dt*16,0,1));
    if(tt>=1){mesh.position.copyFrom(item.position);mesh.scaling.copyFrom(item.scale);mesh.rotation.copyFrom(item.rotation);item.done=true;}
  }
  if(fall){
    const tt=clamp((now-fall.started)/fall.duration,0,1);
    fall.root.rotation.z=-1.48*smooth(tt);
    if(tt>=1){fall.root.setEnabled(false);fall=null;}
  }
  if(doorPivot)doorPivot.rotation.y=T(doorPivot.rotation.y,doorTarget,clamp(dt*5,0,1));
  for(const fx of glowFlashes){
    const age=(now-fx.time)/1500;
    if(age>1){fx.mesh.dispose();fx.dead=true;continue;}
    fx.mesh.scaling.setAll(1+age*15);
    fx.mesh.material.alpha=(1-age)*.45;
  }
  glowFlashes=glowFlashes.filter(x=>!x.dead);
  if(cameraGoal){
    const k=clamp(dt*1.9,0,1);camera.alpha=T(camera.alpha,cameraGoal.alpha,k);
    camera.beta=T(camera.beta,cameraGoal.beta,k);
    camera.radius=T(camera.radius,cameraGoal.radius,k);
    camera.target=B.Vector3.Lerp(camera.target,cameraGoal.target,k);
  }
});

// Physically simulated interactions: left-click any loose object to apply an impulse.
let pointerDown=null;
scene.onPointerObservable.add(info=>{
  const evt=info.event;
  if(info.type===B.PointerEventTypes.POINTERDOWN){pointerDown={x:evt.clientX,y:evt.clientY};}
  if(info.type===B.PointerEventTypes.POINTERUP){
    if(pointerDown&&Math.hypot(evt.clientX-pointerDown.x,evt.clientY-pointerDown.y)>8){pointerDown=null;return;}
    pointerDown=null;
    const pick=scene.pick(scene.pointerX,scene.pointerY);
    if(!pick?.hit||!pick.pickedMesh)return;
    const mesh=pick.pickedMesh;
    if(mesh.metadata?.door&&doorPivot){
      doorOpen=!doorOpen;doorTarget=doorOpen?-.98:0;showToast(doorOpen?'Front door opened':'Front door closed');return;
    }
    if(mesh.metadata?.kickable){
      const d=dynamicBodies.find(b=>b.mesh===mesh);
      if(d?.aggregate){
        const dir=mesh.position.subtract(camera.position).normalize().scale(7);
        dir.y=6;
        try{d.aggregate.body.applyImpulse(dir,pick.pickedPoint||mesh.getAbsolutePosition());showToast('Impulse applied · Havok rigid-body physics');}
        catch(e){console.warn('Could not apply impulse',e);}
      }
    }
  }
});

let cameraGoal=null;
function toggleCamera(){
  cameraGround=!cameraGround;
  cameraGoal=cameraGround?{alpha:-1.07,beta:1.45,radius:17,target:V(.3,1.9,0)}:
    {alpha:-Math.PI/2.62,beta:1.11,radius:26,target:V(.1,2.9,0)};
  UI.view.querySelector('span').textContent=cameraGround?'GROUND':'CAMERA';
  showToast(cameraGround?'Lower perspective · near ground level':'Isometric overview');
}
function toggleDay(){
  dusk=!dusk;
  if(dusk){
    sun.intensity=.63;sun.diffuse=new B.Color3(1,.43,.25);
    hemispheric.intensity=.35;scene.clearColor=new B.Color4(.13,.19,.25,1);
    scene.fogColor=new B.Color3(.20,.24,.27);scene.imageProcessingConfiguration.exposure=1.0;
  }else{
    sun.intensity=2.5;sun.diffuse=new B.Color3(1,.87,.70);
    hemispheric.intensity=.8;scene.clearColor=new B.Color4(.55,.64,.64,1);
    scene.fogColor=new B.Color3(.64,.72,.70);scene.imageProcessingConfiguration.exposure=1.22;
  }
  const lamp=scene.getLightByName('cabin-lantern-light');if(lamp)lamp.intensity=dusk?3.0:1.0;
  UI.light.querySelector('span').textContent=dusk?'DUSK':'DAY';
  UI.weather.textContent=dusk?'AFTER SUNSET':'LATE AFTERNOON';
}
UI.button.addEventListener('click',advance);
UI.drop.addEventListener('click',()=>movingLog(rand(-4,3),rand(-2,3),rand(9,13)));
UI.reset.addEventListener('click',reset);
UI.view.addEventListener('click',toggleCamera);
UI.light.addEventListener('click',toggleDay);
window.addEventListener('keydown',e=>{
  if(e.repeat||e.target instanceof HTMLInputElement)return;
  if(e.code==='Space'){e.preventDefault();advance();}
  if(e.key.toLowerCase()==='r')reset();
  if(e.key.toLowerCase()==='v')toggleCamera();
  if(e.key.toLowerCase()==='l')movingLog();
});
window.addEventListener('resize',()=>engine.resize());
engine.runRenderLoop(()=>scene.render());
updateUI();

// Physics initialization is asynchronous; rendering and all construction features run even if
// the Havok WASM download is blocked by network policy. No physics is falsely simulated.
(async()=>{
  try{
    if(typeof globalThis.HavokPhysics!=='function')throw new Error('Havok script unavailable');
    const havok=await globalThis.HavokPhysics();
    scene.enablePhysics(V(0,-9.81,0),new B.HavokPlugin(true,havok));
    physicsReady=true;
    const collider=box('invisible-terrain-physics',48,.4,48,V(0,-.20,0),M.dirt);
    collider.isVisible=false;collider.isPickable=false;
    // Permanent ground collider survives resets; only house collision proxies are disposed.
    new B.PhysicsAggregate(collider,B.PhysicsShapeType.BOX,{mass:0,friction:.95,restitution:.07},scene);
    for(let step=2;step<=buildLevel;step++)collisionForLevel(step);
    looseStones();
    UI.status.classList.add('ok');UI.status.innerHTML='<span class="statusdot"></span>HAVOK PHYSICS LIVE';
    showToast('Ready: build a cabin or drop a physics log.');
  }catch(err){
    console.warn('Physics unavailable:',err);
    UI.status.classList.add('warn');UI.status.innerHTML='<span class="statusdot"></span>PHYSICS UNAVAILABLE';
    UI.drop.disabled=true;
    showToast('The scene runs; physics requires the Havok CDN.');
  }
})();
