"""Generate compact, original procedural PBR maps for the Timberfall Babylon prototype.
Requires numpy, scipy, Pillow. Assets are committed with the demo. Regeneration is optional.
"""
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter, sobel
from PIL import Image, ImageDraw, ImageFilter

OUT=Path(__file__).resolve().parent.parent/'assets'
OUT.mkdir(parents=True,exist_ok=True)
R=np.random.default_rng(20261109)
N=512
Y,X=np.mgrid[:N,:N].astype('float32')

def noise(sigma):
    n=gaussian_filter(R.normal(0,1,(N,N)).astype('float32'),sigma,mode='wrap')
    return n/(np.std(n)+1e-5)

def multi(spec):
    out=np.zeros((N,N),np.float32)
    for sigma,weight in spec: out+=noise(sigma)*weight
    return out

def save(key, rgb, height, rough):
    rgb=np.clip(rgb,0,255).astype('uint8')
    Image.fromarray(rgb,'RGB').save(OUT/f'{key}_color.jpg',quality=90,subsampling=0,optimize=True)
    h=height.astype('float32'); h=(h-np.mean(h))/(np.std(h)+1e-5)
    gx=sobel(h,axis=1,mode='wrap')/8; gy=sobel(h,axis=0,mode='wrap')/8
    strength = {'dirt':2.0,'wood':1.6,'bark':2.6,'stone':1.5,'roof':2.5,'grass':1.7}[key]
    nx=-gx*strength;ny=-gy*strength;nz=np.ones_like(nx)*3.2
    length=np.sqrt(nx*nx+ny*ny+nz*nz)
    normal=np.stack([(nx/length*.5+.5)*255,(ny/length*.5+.5)*255,(nz/length*.5+.5)*255],axis=-1).astype('uint8')
    Image.fromarray(normal,'RGB').save(OUT/f'{key}_normal.png',optimize=True)
    rr=(np.clip(rough,0.12,1)*255).astype('uint8')
    Image.fromarray(rr,'L').save(OUT/f'{key}_roughness.png',optimize=True)
    print('generated',key)

# Forest soil with mineral dust, crushed stones, wet streaks and small plant variations
broad=multi([(130,.95),(62,.64),(18,.34),(5,.20),(1,.11)])
rock=multi([(8,.70),(2,.30),(1,.18)])
wet=multi([(100,.65),(37,.65)])
g=np.clip(multi([(160,.5),(43,.8),(13,.3)])*.45+.38,0,1)
base=np.array([116,88,59],np.float32)
rgb=base[None,None,:]+broad[:,:,None]*np.array([13,11,9])+rock[:,:,None]*np.array([11,10,8])-wet[:,:,None]*np.array([5,5,5])
rgb += g[:,:,None]*np.array([5,7,1]); h=broad*.5+rock*.22
# embedded pebble points (subtle: random compact rocky chips)
img=Image.fromarray(np.uint8(np.clip(rgb,0,255)),'RGB'); draw=ImageDraw.Draw(img)
for _ in range(6500):
    x=int(R.integers(0,N)); y=int(R.integers(0,N)); radius=int(R.choice([1,1,1,2,2,3,4])); c=int(R.integers(90,165))
    draw.ellipse((x,y,x+radius*2,y+radius),fill=(int(c*.86),int(c*.78),int(c*.64)))
rgb=np.array(img,dtype=np.float32)
save('dirt',rgb,h,.88+rock*.045)

# Plankwood: warped grain and knot rings, subtle contrasting medullary rays
warp=multi([(85,1.5),(22,.95),(6,.23)])
yg=(Y+warp*7)
woodgrain=np.sin(yg*.090+np.sin(yg*.014)*2)+.45*np.sin(yg*.224)+.19*np.sin(yg*.71)
# elongated waves across the grain
f=multi([(90,.8),(18,.19),(3,.1)])
base=np.array([151,100,57],np.float32)
rgb=base[None,None,:]+woodgrain[:,:,None]*np.array([9.5,7.8,5.5])+f[:,:,None]*np.array([15,13,11])
# aged imperfections and old nail holes
img=Image.fromarray(np.uint8(np.clip(rgb,0,255)),'RGB'); draw=ImageDraw.Draw(img,'RGB')
for cx,cy in [(220,240),(830,670),(390,820)]:
    for r in range(4,46,4):
        col=(max(35,90-r//2), max(26,59-r//3), max(15,29-r//5))
        draw.ellipse((cx-r*1.1,cy-r*.4,cx+r*1.1,cy+r*.4),outline=col,width=1)
rgb=np.array(img,dtype=np.float32)
save('wood',rgb,woodgrain*.28+f*.16,.68+f*.07)

# Bark with fissures and irregular bark plate fragments
warp=multi([(54,2),(9,.7)])
stripes=np.cos((X+warp*12)*.071)**8
h=multi([(18,.46),(4,.22),(1,.12)])-stripes*.87
rgb=np.array([79,65,48],np.float32)[None,None,:]+h[:,:,None]*np.array([19,15,12])+stripes[:,:,None]*np.array([-29,-26,-20])
save('bark',rgb,h,.94+h*.015)

# Grey stone with granular mineral color and sharp cracked erosion
n=multi([(65,.7),(24,.7),(6,.45),(1,.25)])
cracks=np.abs(multi([(28,.4),(12,.6)]))
height=n*.5-cracks*.28
base=np.array([126,125,115],np.float32)
rgb=base[None,None,:]+n[:,:,None]*np.array([18,19,18])-cracks[:,:,None]*np.array([14,13,12])
save('stone',rgb,height,.87+n*.045)

# Cedar roof shakes with raised ends, nonuniform shingle discoloration
rgb=np.zeros((N,N,3),np.float32)
height=np.zeros((N,N),np.float32)
rowh=84; tilew=125
basegrain=multi([(45,.7),(5,.22),(1,.08)])
for row in range(N//rowh+1):
    y0=row*rowh;y1=min(N,(row+1)*rowh)
    off=(tilew//2) if row%2 else 0
    for col in range(-1,N//tilew+2):
        x0=max(0,col*tilew+off);x1=min(N,(col+1)*tilew+off)
        if x1<=x0 or y1<=y0:continue
        clr=R.uniform(-16,15)
        tilegrain=basegrain[y0:y1,x0:x1]
        yy=np.arange(y0,y1)[:,None]
        edge= np.clip((yy-y0)/9,0,1)*np.clip((y1-yy)/6,0,1)
        color=np.array([91,69,51],np.float32)
        rgb[y0:y1,x0:x1,:]=color+clr+tilegrain[:,:,None]*np.array([14,12,10])+edge[:,:,None]*7
        height[y0:y1,x0:x1]=tilegrain*.25+edge*.75
        height[y0:y0+2,x0:x1]-=.3
        if x0>0:height[y0:y1,x0:x0+2]-=.7
save('roof',rgb,height,.82+basegrain*.045)

# compact grass / moss atlas material for ground details
n=multi([(58,.75),(12,.5),(2,.15)])
rgb=np.array([91,107,59],np.float32)[None,None,:]+n[:,:,None]*np.array([16,20,11])+np.cos(Y*.07)[:,:,None]*3
save('grass',rgb,n*.55,.96+n*.015)
