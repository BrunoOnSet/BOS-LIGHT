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

    let style=doc.getElementById('bosLightFalloffSimpleStyle');
    if(!style){
      style=doc.createElement('style');
      style.id='bosLightFalloffSimpleStyle';
      doc.head.appendChild(style);
    }
    style.textContent=`
html.bos-suite-embed .bft-head{grid-template-columns:34px minmax(0,1fr) 24px}
html.bos-suite-embed .bft-projector{width:92px;height:66px}
html.bos-suite-embed .bft-person{width:84px;height:84px}
html.bos-suite-embed #bosMiniPlateau .bft-sketch [stroke]{stroke-width:.8 !important}
html.bos-suite-embed #bosMiniPlateau .bft-wall .bft-sketch [stroke]{stroke-width:.8 !important}
@media(max-width:520px){html.bos-suite-embed .bft-projector{width:78px;height:56px}html.bos-suite-embed .bft-person{width:72px;height:72px}}
`;

    const projectorSvg=panel.querySelector('#bftProjector svg');
    if(projectorSvg){
      projectorSvg.setAttribute('viewBox','0 0 120 90');
      projectorSvg.innerHTML=`
        <defs>
          <linearGradient id="bftLightProjectorBody" x1="0.08" y1="0.18" x2="0.92" y2="0.84">
            <stop offset="0" stop-color="#76787a"/>
            <stop offset="0.42" stop-color="#4b4d4f"/>
            <stop offset="1" stop-color="#222325"/>
          </linearGradient>
          <radialGradient id="bftLightProjectorFace" cx="38%" cy="38%" r="75%">
            <stop offset="0" stop-color="#f8f7f3"/>
            <stop offset="0.52" stop-color="#eceae5"/>
            <stop offset="1" stop-color="#c9c7c1"/>
          </radialGradient>
        </defs>
        <g class="bft-sketch">
          <rect x="20" y="24" width="64" height="40" rx="3" fill="url(#bftLightProjectorBody)" stroke="#111213" stroke-width="0.8"/>
          <ellipse cx="84" cy="44" rx="13" ry="17" fill="url(#bftLightProjectorFace)" stroke="#111213" stroke-width="0.8"/>
          <ellipse cx="86" cy="44" rx="8" ry="11" fill="#fbfaf6" stroke="#8b8d8f" stroke-width="0.55" opacity=".96"/>
          <path d="M27 31 Q49 27 76 29" fill="none" stroke="#9a9c9e" stroke-width="0.45" opacity=".38"/>
          <path d="M26 39 Q49 36 78 37" fill="none" stroke="#8a8c8e" stroke-width="0.42" opacity=".32"/>
          <path d="M26 48 Q50 46 78 47" fill="none" stroke="#838587" stroke-width="0.4" opacity=".28"/>
          <path d="M28 57 Q50 55 75 56" fill="none" stroke="#7c7e80" stroke-width="0.4" opacity=".25"/>
        </g>`;
    }

    const personSvg=panel.querySelector('#bftPerson svg');
    if(personSvg){
      personSvg.setAttribute('viewBox','0 0 100 100');
      personSvg.innerHTML=`
        <defs>
          <radialGradient id="bftLightSphere" cx="34%" cy="28%" r="78%">
            <stop offset="0" stop-color="#f4f3f0"/>
            <stop offset="0.20" stop-color="#e7e6e2"/>
            <stop offset="0.42" stop-color="#c9c9c5"/>
            <stop offset="0.66" stop-color="#7f8182"/>
            <stop offset="0.86" stop-color="#3a3c3d"/>
            <stop offset="1" stop-color="#171819"/>
          </radialGradient>
        </defs>
        <g class="bft-sketch">
          <circle cx="50" cy="50" r="37" fill="url(#bftLightSphere)" stroke="#111213" stroke-width="0.8"/>
          <ellipse cx="39" cy="34" rx="16" ry="11" fill="#ffffff" opacity=".17"/>
          <path d="M24 56 Q36 47 52 46 Q67 45 77 50" fill="none" stroke="#2e3031" stroke-width="0.4" opacity=".20"/>
          <path d="M26 64 Q38 57 53 56 Q65 56 74 60" fill="none" stroke="#2a2c2d" stroke-width="0.38" opacity=".16"/>
          <path d="M30 72 Q42 67 54 66 Q63 66 70 69" fill="none" stroke="#242627" stroke-width="0.35" opacity=".12"/>
          <path d="M31 29 Q42 24 56 24" fill="none" stroke="#ffffff" stroke-width="0.4" opacity=".22"/>
          <path d="M26 39 Q38 33 60 33" fill="none" stroke="#ffffff" stroke-width="0.38" opacity=".16"/>
        </g>`;
    }

    const wallSvg=panel.querySelector('#bftWall svg');
    if(wallSvg){
      wallSvg.querySelectorAll('[stroke-width]').forEach(el=>el.setAttribute('stroke-width','0.8'));
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
