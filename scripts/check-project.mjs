import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const required=['index.html','style.css','js/app.js','server.cjs','PLAN.md','AGENTS.md','package.json'];
const families=['dirt','wood','bark','stone','roof','grass'];
for(const family of families) for(const suffix of ['color.jpg','normal.png','roughness.png']) required.push(`assets/${family}_${suffix}`);
let failures=0;
for(const name of required){const file=path.join(root,name);if(!fs.existsSync(file)||fs.statSync(file).size===0){console.error(`MISSING ${name}`);failures++;}}
for(const file of ['server.cjs','js/app.js','scripts/check-project.mjs']) {
  const r=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  if(r.status!==0){failures++;console.error(`SYNTAX ${file}\n${r.stderr}`);}
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const link of ['style.css','js/app.js']) if(!html.includes(link)){console.error(`UNREFERENCED ${link}`); failures++;}
console.log(`Timberline static integrity: ${required.length} required files, ${failures} error(s)`);
process.exitCode=failures?1:0;
