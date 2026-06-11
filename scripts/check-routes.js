const http = require('http');
const routes = ['/admin', '/admin/login', '/admin/dashboard'];
function check(route) {
  return new Promise((resolve) => {
    http.get({host:'localhost', port:3000, path:route}, res => {
      let len=0;
      res.on('data', d=> len+=d.length);
      res.on('end', ()=> resolve({route, status: res.statusCode, len}));
    }).on('error', e=> resolve({route, error: e.message}));
  });
}
(async ()=>{
  for (const r of routes) {
    const res = await check(r);
    console.log(res);
  }
})();
