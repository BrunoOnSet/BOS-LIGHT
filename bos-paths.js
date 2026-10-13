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
