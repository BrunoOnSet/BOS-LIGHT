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

/* FALL OFF — nouvelle DA illustration BOS */
html.bos-suite-embed #bosMiniPlateau .bft-stage{
  border-color:rgba(45,47,47,.15)!important;
  background:
    radial-gradient(circle at 17% 19%,rgba(45,47,47,.028) 0 1px,transparent 1.35px),
    radial-gradient(circle at 76% 67%,rgba(45,47,47,.022) 0 1px,transparent 1.25px),
    linear-gradient(180deg,#F8F5ED 0%,#F3EFE6 100%)!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-paper-lines{opacity:.12!important}
html.bos-suite-embed #bosMiniPlateau .bft-beam-fill{fill:rgba(241,201,82,.17)!important}
html.bos-suite-embed #bosMiniPlateau .bft-beam-edge{
  stroke:#D9B44E!important;
  stroke-width:1.05!important;
  stroke-dasharray:none!important;
  opacity:.58!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-distance{border-top-color:rgba(47,91,102,.28)!important}
html.bos-suite-embed #bosMiniPlateau .bft-distance span{
  background:rgba(248,245,237,.94)!important;
  color:#68767A!important;
  font-family:"Instrument Sans",Inter,sans-serif!important;
  font-size:8px!important;
  font-weight:500!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-projector{width:94px;height:72px}
html.bos-suite-embed #bosMiniPlateau .bft-person{width:82px;height:92px}
html.bos-suite-embed #bosMiniPlateau .bft-wall{width:50px;height:140px}
html.bos-suite-embed #bosMiniPlateau .bft-sketch{filter:url(#bftRoughen)}
html.bos-suite-embed #bosMiniPlateau .bft-sketch [stroke]{vector-effect:non-scaling-stroke}
html.bos-suite-embed #bosMiniPlateau .bft-item-label{
  top:calc(100% + 8px)!important;
  color:#25292B!important;
  font-family:"Marker Felt","Bradley Hand","Segoe Print",cursive!important;
  font-size:10px!important;
  font-weight:600!important;
  letter-spacing:.085em!important;
  transform:translateX(-50%) rotate(-.45deg)!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-item-label::before{
  content:"";
  position:absolute;
  left:-9px;
  right:-9px;
  bottom:-5px;
  height:1px;
  background:rgba(66,152,205,.72);
}
html.bos-suite-embed #bosMiniPlateau .bft-item-label::after{
  content:"";
  position:absolute;
  left:-5px;
  bottom:-10px;
  width:1px;
  height:13px;
  background:rgba(66,152,205,.72);
}
html.bos-suite-embed #bosMiniPlateau .bft-hint{
  color:#707A7D!important;
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
  html.bos-suite-embed #bosMiniPlateau .bft-projector{width:80px;height:62px}
  html.bos-suite-embed #bosMiniPlateau .bft-person{width:70px;height:79px}
  html.bos-suite-embed #bosMiniPlateau .bft-wall{width:43px;height:122px}
  html.bos-suite-embed #bosMiniPlateau .bft-item-label{font-size:9px!important}
  html.bos-suite-embed #bosThreePointPanel .bft-body,
  html.bos-suite-embed #bosShadowHardnessPanel .bft-body{padding:14px 15px 16px}
}
`;

    /* Projecteur : dessin technique graphite + petit repère bleu BOS. */
    const projectorSvg=panel.querySelector('#bftProjector svg');
    if(projectorSvg){
      projectorSvg.setAttribute('viewBox','0 0 120 90');
      projectorSvg.innerHTML=`
        <defs>
          <linearGradient id="bftBosLampBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#777A7B"/>
            <stop offset=".48" stop-color="#4B4E4F"/>
            <stop offset="1" stop-color="#252728"/>
          </linearGradient>
          <radialGradient id="bftBosLampGlass" cx="36%" cy="36%" r="72%">
            <stop offset="0" stop-color="#FFFDF7"/>
            <stop offset=".58" stop-color="#EFECE4"/>
            <stop offset="1" stop-color="#C8C5BC"/>
          </radialGradient>
        </defs>
        <g class="bft-sketch">
          <path d="M18 35 L43 27 L70 30 L88 38 L88 52 L70 60 L43 63 L18 55 Z" fill="url(#bftBosLampBody)" stroke="#202325" stroke-width="1.15" stroke-linejoin="round"/>
          <path d="M68 30 L92 25 L106 34 L106 56 L92 65 L68 60 Q82 53 82 45 Q82 37 68 30 Z" fill="#D5D2CA" stroke="#202325" stroke-width="1.05"/>
          <ellipse cx="104" cy="45" rx="9" ry="15" fill="url(#bftBosLampGlass)" stroke="#202325" stroke-width="1"/>
          <ellipse cx="105" cy="45" rx="4.8" ry="9" fill="#FAF7EE" stroke="#85898A" stroke-width=".55"/>
          <path d="M27 34 Q45 30 67 34 M24 42 Q46 38 76 41 M24 50 Q48 46 76 49 M28 57 Q48 53 66 55" fill="none" stroke="#A1A3A2" stroke-width=".55" opacity=".55"/>
          <path d="M46 64 L43 75 M65 62 L69 75 M43 75 L32 84 M43 75 L52 84 M69 75 L61 84 M69 75 L80 83" fill="none" stroke="#313536" stroke-width="1" stroke-linecap="round"/>
          <circle cx="56" cy="66" r="3.5" fill="#626667" stroke="#232627" stroke-width=".8"/>
          <path d="M36 24 Q55 16 76 23" fill="none" stroke="#4298CD" stroke-width=".8" opacity=".82"/>
          <path d="M35 20 L35 28 M78 19 L78 27" fill="none" stroke="#4298CD" stroke-width=".65" opacity=".70"/>
        </g>`;
    }

    /* Personnage : vue du dessus, comme les schémas de la nouvelle DA. */
    const personSvg=panel.querySelector('#bftPerson svg');
    if(personSvg){
      personSvg.setAttribute('viewBox','0 0 100 112');
      personSvg.innerHTML=`
        <defs>
          <radialGradient id="bftBosHead" cx="38%" cy="30%" r="72%">
            <stop offset="0" stop-color="#EFEDE7"/>
            <stop offset=".62" stop-color="#BFC0BD"/>
            <stop offset="1" stop-color="#656869"/>
          </radialGradient>
          <linearGradient id="bftBosShirt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F3F1EB"/>
            <stop offset="1" stop-color="#D8D6D0"/>
          </linearGradient>
        </defs>
        <g class="bft-sketch">
          <ellipse cx="50" cy="29" rx="18" ry="20" fill="url(#bftBosHead)" stroke="#202325" stroke-width="1.05"/>
          <path d="M30 47 Q39 41 50 41 Q61 41 70 47 L79 63 Q74 69 68 66 L65 59 L65 86 Q58 93 50 93 Q42 93 35 86 L35 59 L32 66 Q26 69 21 63 Z" fill="url(#bftBosShirt)" stroke="#202325" stroke-width="1.05" stroke-linejoin="round"/>
          <path d="M36 84 L31 101 Q30 106 35 108 Q40 108 43 101 L47 91 M64 84 L69 101 Q70 106 65 108 Q60 108 57 101 L53 91" fill="#8D9090" stroke="#202325" stroke-width="1" stroke-linecap="round"/>
          <path d="M22 63 Q18 68 22 73 Q26 76 31 70 M78 63 Q82 68 78 73 Q74 76 69 70" fill="#CBCAC5" stroke="#202325" stroke-width=".9"/>
          <path d="M33 49 Q40 54 42 63 M67 49 Q60 54 58 63 M40 47 Q50 51 60 47" fill="none" stroke="#A8AAA8" stroke-width=".55" opacity=".65"/>
          <path d="M39 20 Q50 14 61 20 M36 28 Q50 21 64 28 M39 36 Q50 30 61 36" fill="none" stroke="#777A7A" stroke-width=".5" opacity=".52"/>
          <path d="M17 45 L28 45 M72 45 L83 45 M50 3 L50 12" fill="none" stroke="#4298CD" stroke-width=".7" opacity=".68"/>
        </g>`;
    }

    /* Mur : panneau ivoire/graphite, luminosité toujours pilotée par le calcul existant. */
    const wallSvg=panel.querySelector('#bftWall svg');
    if(wallSvg){
      wallSvg.setAttribute('viewBox','0 0 60 150');
      wallSvg.innerHTML=`
        <g class="bft-sketch">
          <rect class="bft-wall-fill" x="11" y="5" width="36" height="140" rx="1.5" stroke="#272A2B" stroke-width="1.05"/>
          <path d="M15 20 L42 13 M15 36 L43 28 M15 53 L43 45 M15 70 L43 62 M15 87 L43 79 M15 104 L43 96 M15 121 L43 113 M15 138 L43 130" fill="none" stroke="rgba(35,38,39,.24)" stroke-width=".55"/>
          <path d="M18 7 L18 143 M31 7 L31 143" fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".45"/>
          <path d="M6 22 L6 40 M2 31 L10 31 M51 113 L57 113" fill="none" stroke="#4298CD" stroke-width=".7" opacity=".72"/>
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