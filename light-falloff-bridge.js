(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const EXPO_FALLOFF_VERSION='4.0.13';
  let booted=false;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  // Une seule autorité de hauteur pour LIGHT.
  function fit(){
    if(typeof window.BOSLightFit==='function'){
      window.BOSLightFit();
      return;
    }
    requestAnimationFrame(()=>{
      if(typeof window.BOSLightFit==='function')window.BOSLightFit();
    });
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

  function syncPanelChevron(section){
    if(!section)return;
    const chevron=section.querySelector('.bft-chevron');
    if(!chevron)return;
    const collapsed=section.classList.contains('bmp-collapsed');
    chevron.textContent=collapsed?'⌄':'⌃';
  }

  function bindChevronState(section){
    if(!section)return;
    const toggle=section.querySelector('.bft-head');
    syncPanelChevron(section);
    if(!toggle||toggle.dataset.bosChevronBound==='1')return;
    toggle.dataset.bosChevronBound='1';
    toggle.addEventListener('click',()=>{
      setTimeout(()=>syncPanelChevron(section),0);
    });
  }

  function bindPanelToggle(section,toggleId){
    const toggle=section.querySelector('#'+toggleId);
    if(!toggle)return;
    syncPanelChevron(section);
    if(toggle.dataset.bosBound!=='1'){
      toggle.dataset.bosBound='1';
      toggle.addEventListener('click',()=>{
        const collapsed=section.classList.toggle('bmp-collapsed');
        toggle.setAttribute('aria-expanded',String(!collapsed));
        syncPanelChevron(section);
        setTimeout(fit,20);
        setTimeout(fit,160);
      });
      section.querySelectorAll('img').forEach(el=>el.addEventListener('load',fit));
    }
    bindChevronState(section);
  }

  function ensureThreePointPanel(doc,panel){
    let three=doc.getElementById('bosThreePointPanel');
    if(!three){
      three=doc.createElement('section');
      three.id='bosThreePointPanel';
      three.className='bmp-collapsed';
      three.setAttribute('aria-label','Système 3 points');
      three.innerHTML=`
        <button type="button" class="bft-head" id="bftThreePointToggle" aria-expanded="false">
          <span class="bft-number">01</span>
          <span class="bft-title"><strong>SYSTÈME 3 POINTS</strong><small>ÉCLAIRAGE PORTRAIT</small></span>
          <span class="bft-chevron" aria-hidden="true">⌄</span>
        </button>
        <div class="bft-body">
          <div class="bft-reference-images">
            <img src="/BOS-LIGHT/assets/lighting/3points/01-systeme-3-points.jpg?v=20261009-1" alt="Système 3 points">
            <img src="/BOS-LIGHT/assets/lighting/3points/02-key-light.jpg?v=20261009-1" alt="Schémas d’éclairage portrait">
          </div>
        </div>`;
      panel.parentNode.insertBefore(three,panel);
    }else{
      three.setAttribute('aria-label','Système 3 points');
      const number=three.querySelector('.bft-number');
      if(number)number.textContent='01';
      const title=three.querySelector('.bft-title strong');
      if(title)title.textContent='SYSTÈME 3 POINTS';
      let subtitle=three.querySelector('.bft-title small');
      if(!subtitle&&three.querySelector('.bft-title')){
        subtitle=doc.createElement('small');
        three.querySelector('.bft-title').appendChild(subtitle);
      }
      if(subtitle)subtitle.textContent='ÉCLAIRAGE PORTRAIT';
    }
    bindPanelToggle(three,'bftThreePointToggle');
    return three;
  }

  function ensureShadowHardnessPanel(doc,panel){
    let shadow=doc.getElementById('bosShadowHardnessPanel');
    if(!shadow){
      shadow=doc.createElement('section');
      shadow.id='bosShadowHardnessPanel';
      shadow.className='bmp-collapsed';
      shadow.setAttribute('aria-label','Dureté des ombres');
      shadow.innerHTML=`
        <button type="button" class="bft-head" id="bftShadowHardnessToggle" aria-expanded="false">
          <span class="bft-number">02</span>
          <span class="bft-title"><strong>DURETÉ DES OMBRES</strong><small>GESTION DE LA SOURCE</small></span>
          <span class="bft-chevron" aria-hidden="true">⌄</span>
        </button>
        <div class="bft-body">
          <div class="bft-reference-images">
            <img src="/BOS-LIGHT/assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=1" alt="Dureté des ombres — schéma 1">
            <img src="/BOS-LIGHT/assets/lighting/shadow-hardness/02-gestion-de-la-source.jpg?v=1" alt="Dureté des ombres — schéma 2">
          </div>
        </div>`;
      panel.parentNode.insertBefore(shadow,panel);
    }else{
      const number=shadow.querySelector('.bft-number');
      if(number)number.textContent='02';
    }
    bindPanelToggle(shadow,'bftShadowHardnessToggle');
    return shadow;
  }

  function customizeFalloff(){
    const doc=frameDoc();
    if(!doc)return false;

    const panel=doc.getElementById('bosMiniPlateau');
    if(!panel)return false;

    const number=panel.querySelector('.bft-number');
    if(number)number.textContent='03';

    const title=panel.querySelector('.bft-title strong');
    if(title)title.textContent='FALL OFF';

    const titleWrap=panel.querySelector('.bft-title');
    let subtitle=panel.querySelector('.bft-title small');
    if(!subtitle&&titleWrap){
      subtitle=doc.createElement('small');
      titleWrap.appendChild(subtitle);
    }
    if(subtitle)subtitle.textContent='GESTION DU CONTRASTE';

    const reset=panel.querySelector('.bft-reset');
    if(reset)reset.remove();

    ensureThreePointPanel(doc,panel);
    ensureShadowHardnessPanel(doc,panel);
    bindChevronState(panel);

    let style=doc.getElementById('bosLightFalloffSimpleStyle');
    if(!style){
      style=doc.createElement('style');
      style.id='bosLightFalloffSimpleStyle';
      doc.head.appendChild(style);
    }

    style.textContent=`
html.bos-suite-embed .bft-head{grid-template-columns:34px minmax(0,1fr) 24px}

/* FALL OFF — géométrie BOS minimale */
html.bos-suite-embed #bosMiniPlateau .bft-stage{
  border-color:rgba(31,34,35,.14)!important;
  background:
    radial-gradient(circle at 18% 22%,rgba(32,34,35,.026) 0 1px,transparent 1.3px),
    radial-gradient(circle at 79% 66%,rgba(32,34,35,.02) 0 1px,transparent 1.2px),
    linear-gradient(180deg,#F5F2EA 0%,#EEEAE1 100%)!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-paper-lines{opacity:.08!important}
html.bos-suite-embed #bosMiniPlateau .bft-beam-fill{fill:rgba(232,193,79,.14)!important}
html.bos-suite-embed #bosMiniPlateau .bft-beam-edge{
  stroke:#C8A547!important;
  stroke-width:.8!important;
  stroke-dasharray:none!important;
  opacity:.5!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-distance{border-top-color:rgba(47,91,102,.22)!important}
html.bos-suite-embed #bosMiniPlateau .bft-distance span{
  background:rgba(245,242,234,.94)!important;
  color:#667276!important;
  font-family:"Instrument Sans",Inter,sans-serif!important;
  font-size:8px!important;
  font-weight:500!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-projector{width:58px;height:58px}
html.bos-suite-embed #bosMiniPlateau .bft-person{width:60px;height:60px}
html.bos-suite-embed #bosMiniPlateau .bft-wall{width:34px;height:118px}
html.bos-suite-embed #bosMiniPlateau .bft-sketch{filter:none!important}
html.bos-suite-embed #bosMiniPlateau .bft-sketch [stroke]{vector-effect:non-scaling-stroke}
html.bos-suite-embed #bosMiniPlateau .bft-item-label{
  top:calc(100% + 8px)!important;
  color:#262A2B!important;
  font-family:"Marker Felt","Bradley Hand","Segoe Print",cursive!important;
  font-size:9px!important;
  font-weight:600!important;
  letter-spacing:.08em!important;
  transform:translateX(-50%) rotate(-.35deg)!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-item-label::before{
  content:"";
  position:absolute;
  left:-8px;
  right:-8px;
  bottom:-5px;
  height:1px;
  background:rgba(66,152,205,.58);
}
html.bos-suite-embed #bosMiniPlateau .bft-item-label::after{
  content:"";
  position:absolute;
  left:-4px;
  bottom:-9px;
  width:1px;
  height:11px;
  background:rgba(66,152,205,.58);
}
html.bos-suite-embed #bosMiniPlateau .bft-hint{
  color:#737B7E!important;
  font-family:"Instrument Sans",Inter,sans-serif!important;
  font-size:9px!important;
  font-weight:400!important;
  letter-spacing:0!important;
}

html.bos-suite-embed #bosThreePointPanel,
html.bos-suite-embed #bosShadowHardnessPanel{width:100%;margin-top:12px;border:1px solid var(--card-border,#D7D9D6);border-radius:22px;background:var(--panel);box-shadow:none;overflow:hidden;padding:0}
html.bos-suite-embed #bosThreePointPanel.bmp-collapsed,
html.bos-suite-embed #bosShadowHardnessPanel.bmp-collapsed{height:82px}
html.bos-suite-embed #bosThreePointPanel.bmp-collapsed .bft-body,
html.bos-suite-embed #bosShadowHardnessPanel.bmp-collapsed .bft-body{display:none}
html.bos-suite-embed #bosThreePointPanel:not(.bmp-collapsed) .bft-head,
html.bos-suite-embed #bosShadowHardnessPanel:not(.bmp-collapsed) .bft-head{border-bottom:1px solid var(--line)}
html.bos-suite-embed #bosThreePointPanel .bft-body,
html.bos-suite-embed #bosShadowHardnessPanel .bft-body{padding:16px 18px 18px}
html.bos-suite-embed .bft-reference-images{display:flex;flex-direction:column;gap:14px}
html.bos-suite-embed .bft-reference-images img{display:block;width:100%;height:auto;border:0;border-radius:12px;background:#f2f0eb}

@media(max-width:520px){
  html.bos-suite-embed #bosMiniPlateau .bft-projector{width:52px;height:52px}
  html.bos-suite-embed #bosMiniPlateau .bft-person{width:54px;height:54px}
  html.bos-suite-embed #bosMiniPlateau .bft-wall{width:31px;height:106px}
  html.bos-suite-embed #bosMiniPlateau .bft-item-label{font-size:8.5px!important}
  html.bos-suite-embed #bosThreePointPanel .bft-body,
  html.bos-suite-embed #bosShadowHardnessPanel .bft-body{padding:14px 15px 16px}
}
`;

    /* Projecteur = carré sombre, sans détail figuratif. */
    const projectorSvg=panel.querySelector('#bftProjector svg');
    if(projectorSvg){
      projectorSvg.setAttribute('viewBox','0 0 80 80');
      projectorSvg.innerHTML=`
        <defs>
          <linearGradient id="bftBosSquare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#3E4142"/>
            <stop offset="1" stop-color="#1B1E1F"/>
          </linearGradient>
        </defs>
        <g class="bft-sketch">
          <rect x="14" y="14" width="52" height="52" rx="2" fill="url(#bftBosSquare)" stroke="#121415" stroke-width="1.05"/>
          <path d="M21 25 L58 25 M21 35 L58 35 M21 45 L58 45 M21 55 L58 55" fill="none" stroke="#737778" stroke-width=".42" opacity=".28"/>
          <path d="M18 10 L30 10 M18 7 L18 13" fill="none" stroke="#4298CD" stroke-width=".65" opacity=".58"/>
        </g>`;
    }

    /* Personne = boule sombre, simple et lisible. */
    const personSvg=panel.querySelector('#bftPerson svg');
    if(personSvg){
      personSvg.setAttribute('viewBox','0 0 80 80');
      personSvg.innerHTML=`
        <defs>
          <radialGradient id="bftBosBall" cx="34%" cy="28%" r="76%">
            <stop offset="0" stop-color="#6E7172"/>
            <stop offset=".48" stop-color="#3C3F40"/>
            <stop offset="1" stop-color="#17191A"/>
          </radialGradient>
        </defs>
        <g class="bft-sketch">
          <circle cx="40" cy="40" r="27" fill="url(#bftBosBall)" stroke="#101213" stroke-width="1.05"/>
          <ellipse cx="31" cy="29" rx="9" ry="6" fill="#FFFFFF" opacity=".10"/>
          <path d="M15 12 L25 12 M15 9 L15 15" fill="none" stroke="#4298CD" stroke-width=".65" opacity=".52"/>
        </g>`;
    }

    /* Mur = rectangle vertical, luminosité toujours pilotée par le calcul existant. */
    const wallSvg=panel.querySelector('#bftWall svg');
    if(wallSvg){
      wallSvg.setAttribute('viewBox','0 0 50 150');
      wallSvg.innerHTML=`
        <g class="bft-sketch">
          <rect class="bft-wall-fill" x="11" y="7" width="28" height="136" rx="1" stroke="#1B1E1F" stroke-width="1.05"/>
          <path d="M15 32 L35 32 M15 58 L35 58 M15 84 L35 84 M15 110 L35 110" fill="none" stroke="rgba(25,28,29,.20)" stroke-width=".42"/>
          <path d="M5 21 L5 33 M2 27 L8 27" fill="none" stroke="#4298CD" stroke-width=".65" opacity=".52"/>
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