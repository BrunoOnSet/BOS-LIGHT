const CACHE="bos-light-v2-0-26";
const ASSETS=[
  "./",
  "./index.html",
  "./light-shadow-images.js",
  "./light-height-authority.js",
  "./light-mobile-falloff-guard.js",
  "./style.css",
  "./continuous.css",
  "./manifest.webmanifest",
  "./assets/logo-bos-header.jpg",
  "./assets/lighting/3points/01-systeme-3-points.jpg?v=20261009-1",
  "./assets/lighting/3points/02-key-light.jpg?v=20261009-1",
  "./assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=20261009-2",
  "./assets/lighting/shadow-hardness/02-durete-des-ombres.jpg?v=20261009-2",
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
const DB_PATHS=new Set([
  "/BrunoOnSet/BOS-CAMERA-DB/main/cameras.json",
  "/BrunoOnSet/BOS-PROJECTEURS-DB/main/lights.json"
]);

const FRESH_ASSETS=[
  "/light-host.js",
  "/light-falloff-bridge.js",
  "/light-design-bridge.js",
  "/light-design.css",
  "/light-bubbles.css",
  "/modules/light/styles.css"
];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

function putIfOk(request,response){
  if(response&&response.ok){
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(request,copy));
  }
  return response;
}

async function freshFirst(request){
  try{
    const response=await fetch(request,{cache:"no-store"});
    return putIfOk(request,response);
  }catch(_){
    return (await caches.match(request))||Response.error();
  }
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;

  const url=new URL(e.request.url);
  if(url.hostname===CAMERA_DB_HOST&&DB_PATHS.has(url.pathname))return;

  if(e.request.mode==="navigate"){
    e.respondWith((async()=>{
      try{
        const response=await fetch(e.request,{cache:"no-store"});
        return putIfOk(e.request,response);
      }catch(_){
        if(/\/modules\/light(?:\/|$)/i.test(url.pathname)){
          return (await caches.match("./modules/light/index.html"))||(await caches.match("./index.html"));
        }
        return caches.match("./index.html");
      }
    })());
    return;
  }

  const isFreshAsset=url.origin===self.location.origin&&FRESH_ASSETS.some(path=>url.pathname.endsWith(path));
  if(isFreshAsset){
    e.respondWith(freshFirst(e.request));
    return;
  }

  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(net=>putIfOk(e.request,net))));
});