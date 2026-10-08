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

    /* L’outil EXPO garde sa logique ; LIGHT applique seulement sa présentation dédiée. */
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

  function customizeFalloff(){
    const doc=frameDoc();
    if(!doc)return false;

    const panel=doc.getElementById('bosMiniPlateau');
    if(!panel)return false;

    const number=panel.querySelector('.bft-number');
    if(number)number.textContent='06';

    const reset=panel.querySelector('.bft-reset');
    if(reset)reset.remove();

    if(!doc.getElementById('bosLightFalloffSimpleStyle')){
      const style=doc.createElement('style');
      style.id='bosLightFalloffSimpleStyle';
      style.textContent=`
html.bos-suite-embed .bft-head{grid-template-columns:34px minmax(0,1fr) 24px}
html.bos-suite-embed .bft-projector{width:88px;height:64px}
html.bos-suite-embed .bft-person{width:82px;height:82px}
@media(max-width:520px){html.bos-suite-embed .bft-projector{width:76px;height:56px}html.bos-suite-embed .bft-person{width:72px;height:72px}}
`;
      doc.head.appendChild(style);
    }

    const projectorSvg=panel.querySelector('#bftProjector svg');
    if(projectorSvg){
      projectorSvg.setAttribute('viewBox','0 0 120 90');
      projectorSvg.innerHTML=`
        <defs>
          <linearGradient id="bftLightProjectorBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#5d5f60"/>
            <stop offset="0.6" stop-color="#303234"/>
            <stop offset="1" stop-color="#1a1b1c"/>
          </linearGradient>
        </defs>
        <g class="bft-sketch">
          <rect x="18" y="23" width="72" height="44" rx="4" fill="url(#bftLightProjectorBody)" stroke="#111213" stroke-width="4"/>
          <path d="M25 31 L82 28 M24 40 L84 37 M24 50 L84 47 M25 59 L80 56" stroke="#77797a" stroke-width="1.8" opacity=".55"/>
          <ellipse cx="91" cy="45" rx="14" ry="18" fill="#f2f1ed" stroke="#111213" stroke-width="4"/>
          <ellipse cx="93" cy="45" rx="8" ry="11" fill="#faf9f5" stroke="#77797a" stroke-width="1.5" opacity=".9"/>
        </g>`;
    }

    const personSvg=panel.querySelector('#bftPerson svg');
    if(personSvg){
      personSvg.setAttribute('viewBox','0 0 100 100');
      personSvg.innerHTML=`
        <defs>
          <radialGradient id="bftLightSphere" cx="34%" cy="28%" r="76%">
            <stop offset="0" stop-color="#f0f0ee"/>
            <stop offset="0.28" stop-color="#d7d7d4"/>
            <stop offset="0.58" stop-color="#8c8e8e"/>
            <stop offset="0.82" stop-color="#454748"/>
            <stop offset="1" stop-color="#171819"/>
          </radialGradient>
        </defs>
        <g class="bft-sketch">
          <circle cx="50" cy="50" r="38" fill="url(#bftLightSphere)" stroke="#111213" stroke-width="4"/>
          <path d="M23 55 Q49 42 76 49 M25 65 Q49 52 73 59 M31 75 Q49 64 67 68" fill="none" stroke="#27292a" stroke-width="1.4" opacity=".32"/>
          <path d="M29 31 Q42 23 58 23 M24 41 Q42 31 66 31 M22 49 Q42 38 72 39" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".28"/>
        </g>`;
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
      customizeFalloff();
    }catch(err){
      console.error('[BOS LIGHT fall-off]',err);
    }finally{
      frame.id=originalId;
      customizeFalloff();
      fit();
      [60,180,500].forEach(ms=>setTimeout(()=>{customizeFalloff();fit();},ms));
    }
  }

  frame.addEventListener('load',()=>{
    prepareFrame();
    setTimeout(()=>{customizeFalloff();fit();},80);
  });

  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive')boot();
  else frame.addEventListener('load',boot,{once:true});
})();
