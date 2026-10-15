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

  const DEFAULT_CONFIG=Object.freeze({
    schema:1,
    module:'LIGHT',
    version:'V2.0.0',
    build:19,
    access:'free',
    accessProvider:'none'
  });

  const state={
    config:DEFAULT_CONFIG,
    source:'default',
    ready:false,
    error:null
  };

  async function fetchJson(url){
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    return response.json();
  }

  async function loadConfig(){
    const stamp=Date.now();
    try{
      const central=await fetchJson('https://raw.githubusercontent.com/BrunoOnSet/Bruno-On-Set/main/bos-config.json?ts='+stamp);
      const remote=central?.modules?.LIGHT;
      if(!remote||typeof remote!=='object')throw new Error('LIGHT config missing');
      state.config=Object.freeze({...DEFAULT_CONFIG,...remote,module:'LIGHT'});
      state.source='central';
      state.error=null;
    }catch(centralError){
      try{
        const local=await fetchJson(window.BOS_PATHS.url('version.json?ts='+stamp));
        state.config=Object.freeze({...DEFAULT_CONFIG,...local,module:'LIGHT'});
        state.source='local';
        state.error=centralError;
      }catch(localError){
        state.config=DEFAULT_CONFIG;
        state.source='default';
        state.error=localError;
      }
    }finally{
      state.ready=true;
    }
    return state;
  }

  const ready=loadConfig();

  window.BOSAccess=Object.freeze({
    state,
    ready,
    getConfig(){return state.config;},
    async authorize(){
      await ready;
      const mode=String(state.config.access||'free').toLowerCase();
      return {
        allowed:mode==='free',
        mode,
        provider:state.config.accessProvider||'none'
      };
    }
  });

  if('serviceWorker' in navigator){
    const hadController=!!navigator.serviceWorker.controller;
    let refreshing=false;

    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(!hadController||refreshing)return;
      refreshing=true;
      window.location.reload();
    });

    async function checkForUpdate(){
      if(!navigator.onLine)return;
      try{
        const registration=await navigator.serviceWorker.ready;
        await registration.update();
      }catch(_){ }
    }

    window.addEventListener('load',checkForUpdate,{once:true});
    window.addEventListener('online',checkForUpdate);
  }
})();
