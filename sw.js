const CACHE="bos-light-suite-v1-2-6";
const ASSETS=[
  "./",
  "./README.txt",
  "./app.js",
  "./suite-patch.js",
  "./continuous.css",
  "./assets/logo-bos-header.jpg",
  "./data/cameras.json",
  "./data/lights.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./modules/expo/README.txt",
  "./modules/expo/adapters/integrated.js",
  "./modules/expo/app.js",
  "./modules/expo/assets/logo-bos-header.jpg",
  "./modules/expo/icon-192.png",
  "./modules/expo/icon-512.png",
  "./modules/expo/index.html",
  "./modules/expo/logo-bruno-guillard.png",
  "./modules/expo/style.css",
  "./modules/light/adapters/integrated.js",
  "./modules/light/adapters/standalone.js",
  "./modules/light/app.js",
  "./modules/light/assets/gels/lee017-spectrum.png",
  "./modules/light/assets/gels/lee017-swatch-flat.png",
  "./modules/light/assets/gels/lee017-swatch.png",
  "./modules/light/assets/gels/lee117-swatch-flat.png",
  "./modules/light/assets/gels/lee201-swatch-flat.png",
  "./modules/light/assets/gels/lee202-swatch-flat.png",
  "./modules/light/assets/gels/lee203-swatch-flat.png",
  "./modules/light/assets/gels/lee204-swatch-flat.png",
  "./modules/light/assets/gels/lee205-swatch-flat.png",
  "./modules/light/assets/gels/lee206-swatch-flat.png",
  "./modules/light/assets/gels/lee213-swatch-flat.png",
  "./modules/light/assets/gels/lee245-swatch-flat.png",
  "./modules/light/assets/gels/lee246-swatch-flat.png",
  "./modules/light/assets/gels/lee248-swatch-flat.png",
  "./modules/light/assets/gels/lee249-swatch-flat.png",
  "./modules/light/assets/gels/lee506-swatch-flat.png",
  "./modules/light/assets/gels/lee603-swatch-flat.png",
  "./modules/light/assets/gels/lee728-swatch-flat.png",
  "./modules/light/assets/logo-bos-header.jpg",
  "./modules/light/bos-projecteurs-db.js",
  "./modules/light/index.html",
  "./modules/light/module.json",
  "./modules/light/styles.css",
  "./shared/analytics.js",
  "./shared/db.js",
  "./shared/module-host.js",
  "./shared/navigation.js",
  "./shared/state.js",
  "./style.css",
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
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(async()=>{
      if(/\/modules\/light(?:\/|$)/i.test(url.pathname))return (await caches.match('./modules/light/index.html'))||caches.match('./index.html');
      if(/\/modules\/expo(?:\/|$)/i.test(url.pathname))return (await caches.match('./modules/expo/index.html'))||caches.match('./index.html');
      return caches.match('./index.html');
    }));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{const cp=net.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return net;})));
});
