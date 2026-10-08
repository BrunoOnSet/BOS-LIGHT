(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const EXPO_FALLOFF_VERSION='4.0.13';
  let booted=false;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function fit(){
    const doc=frameDoc();
    if(!doc)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;
    const h=Math.max(1,Math.ceil(root.getBoundingClientRect().height));
    if(Math.abs((parseFloat(frame.style.height)||0)-h)>1)frame.style.height=h+'px';
  }

  function prepareFrame(){
    const doc=frameDoc();
    if(!doc)return false;

    /* L’outil EXPO garde exactement ses styles et son comportement. */
    doc.documentElement.classList.add('bos-suite-embed');

    if(!doc.getElementById('simpleExpoPanel')){
      const anchor=doc.createElement('div');
      anchor.id='simpleExpoPanel';
      anchor.hidden=true;
      const gel=doc.getElementById('gelDetails');
      if(gel?.parentNode)gel.insertAdjacentElement('afterend',anchor);
      else (doc.querySelector('.app-shell')||doc.body).appendChild(anchor);
    }

    return true;
  }

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=src;
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error('Impossible de charger '+src));
      document.head.appendChild(script);
    });
  }

  async function boot(){
    if(booted)return;
    if(!prepareFrame()){
      setTimeout(boot,80);
      return;
    }

    booted=true;
    const originalId=frame.id;
    frame.id='expoFrame';
    window.BOSExpoHostFit=fit;

    try{
      await loadScript('/BOS-EXPO/expo-mini-plateau.js?v='+EXPO_FALLOFF_VERSION);
      await loadScript('/BOS-EXPO/expo-falloff-reference-assets.js?v='+EXPO_FALLOFF_VERSION);
    }catch(err){
      console.error('[BOS LIGHT fall-off]',err);
    }finally{
      frame.id=originalId;
      fit();
      [60,180,500].forEach(ms=>setTimeout(fit,ms));
    }
  }

  frame.addEventListener('load',()=>{
    prepareFrame();
    setTimeout(fit,80);
  });

  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive')boot();
  else frame.addEventListener('load',boot,{once:true});
})();
