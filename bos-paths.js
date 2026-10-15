(function(){
  'use strict';

  const root=new URL('./',document.baseURI);

  window.BOS_PATHS=Object.freeze({
    root:root.href,
    url(path){
      const clean=String(path||'').replace(/^\/+/, '');
      return new URL(clean,root).href;
    }
  });
})();

/* BOS Access : bootstrap isolé et sans rechargement forcé. */
(function(){
  if(document.querySelector('script[data-bos-light-access]'))return;
  const s=document.createElement('script');
  s.src='bos-access.js?v=1.0.0';
  s.async=false;
  s.dataset.bosLightAccess='1';
  document.head.appendChild(s);
})();
