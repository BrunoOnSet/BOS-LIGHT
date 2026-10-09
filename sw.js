const CACHE="bos-light-v2-0-3";
const ASSETS=[
  "./",
  "./index.html",
  "./light-host.js",
  "./light-falloff-bridge.js",
  "./style.css",
  "./continuous.css",
  "./manifest.webmanifest",
  "./assets/logo-bos-header.jpg",
  "./assets/lighting/3points/01-systeme-3-points.jpg?v=20261009-1",
  "./assets/lighting/3points/02-key-light.jpg?v=20261009-1",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./modules/light/index.html",
  "./modules/light/styles.css",
  "./modules/light/app.js",
  "./modules/light/bos-projecteurs-db.js",
  "./modules/light/adapters/integrated.js",
  "./modules/light/adapters/standalone.js",
  "./modules/light/assets/logo-bos-header.jpg",
  "./shared/state.js",
  "./shared/navigation.js",
  "./shared/db.js",
  "./shared/analytics.js",
  "./shared/module-host.js",
  "./version.json"
];
const CAMERA_DB_HOST="raw.githubusercontent.com";
const DB_PATHS=new Set(["/BrunoOnSet/BOS-CAMERA-DB/main/cameras.json","/BrunoOnSet/BOS-PROJECTEURS-DB/main/lights.json"]);
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.hostname===CAMERA_DB_HOST&&DB_PATHS.has(url.pathname))return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;}).catch(async()=>{
      if(/\/modules\/light(?:\/|$)/i.test(url.pathname))return (await caches.match('./modules/light/index.html'))||caches.match('./index.html');
      return caches.match('./index.html');
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{if(net.ok){const cp=net.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return net;})));
});
