// Dependency-free static HTTP server. Run: node server.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root=__dirname;
const port=Number(process.env.PORT||8797);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.cjs':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  const requestPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const full=path.resolve(root,'.'+requestPath,(requestPath.endsWith('/')?'index.html':''));
  if(full!==root&&!full.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.stat(full,(err,st)=>{
    if(err||!st.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream','Cache-Control':'no-cache'});
    fs.createReadStream(full).pipe(res);
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`TIMBERLINE ready at http://localhost:${port}`));
