import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';

async function unusedPort() {
  const server=net.createServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const p=server.address().port; await new Promise(r=>server.close(r)); return p;
}
test('serves index, assets and rejects traversal', async (t)=>{
  const port=await unusedPort();
  const child=spawn(process.execPath,['server.cjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
  t.after(()=>child.kill());
  const url=`http://127.0.0.1:${port}`;
  let ready=false;
  for(let i=0;i<40;i++) { try {const r=await fetch(url); if(r.ok){ready=true;break;}}catch{} await new Promise(r=>setTimeout(r,75)); }
  assert.equal(ready,true,'local server must start');
  let r=await fetch(url+'/'); assert.equal(r.status,200); assert.match(await r.text(),/TIMBERLINE/);
  r=await fetch(url+'/js/app.js'); assert.equal(r.status,200); assert.match(await r.text(),/BABYLON/);
  r=await fetch(url+'/assets/wood_color.jpg'); assert.equal(r.status,200); assert.match(r.headers.get('content-type'),/image\/jpeg/);
  r=await fetch(url+'/this-does-not-exist'); assert.equal(r.status,404);
});
