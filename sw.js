const CACHE='bos-light-v2-1-clean3';

const STATIC_ASSETS=[
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/logo-bos-header.jpg',
  './assets/lighting/3points/01-systeme-3-points.jpg?v=20261009-1',
  './assets/lighting/3points/02-key-light.jpg?v=20261009-1',
  './assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=20261009-2',
  './assets/lighting/shadow-hardness/02-durete-des-ombres.jpg?v=20261009-2'
];

const CAMERA_DB_HOST='raw.githubusercontent.com';
const DB_PATHS=new Set([
  '/BrunoOnSet/BOS-CAMERA-DB/main/cameras.json',
  '/BrunoOnSet/BOS-PROJECTEURS-DB/main/lights.json'
]);

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(STATIC_ASSETS.map(async url=>{
      try{
        const request=new Request(url,{cache:'reload'});
        const response=await fetch(request);
        if(response.ok)await cache.put(request,response);
      }catch(_){ }
    }));
  })());
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('bos-light-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok)await cache.put(request,response.clone());
    return response;
  }catch(_){
    return (await cache.match(request,{ignoreSearch:true}))||Response.error();
  }
}

async function cacheFirst(request){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request,{ignoreSearch:true});
  if(cached)return cached;
  const response=await fetch(request);
  if(response&&response.ok)await cache.put(request,response.clone());
  return response;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  const url=new URL(event.request.url);
  if(url.hostname===CAMERA_DB_HOST&&DB_PATHS.has(url.pathname))return;

  if(event.request.mode==='navigate'){
    event.respondWith(networkFirst(event.request));
    return;
  }

  if(url.origin===self.location.origin){
    const isLiveCode=/\.(?:html?|css|js|json)$/i.test(url.pathname)||
      url.pathname.endsWith('/')||
      url.pathname.includes('/modules/light')||
      url.pathname.includes('/shared/');

    if(isLiveCode){
      event.respondWith(networkFirst(event.request));
      return;
    }

    event.respondWith(cacheFirst(event.request));
  }
});
