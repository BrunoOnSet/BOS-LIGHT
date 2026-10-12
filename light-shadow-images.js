(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function fit(){
    if(typeof window.BOSLightFit==='function')window.BOSLightFit();
  }

  function ensureThumbStyle(doc){
    let style=doc.getElementById('bosTechnicalThumbStyle');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalThumbStyle';
      doc.head.appendChild(style);
    }
    style.textContent=`
/* Les fiches techniques utilisent maintenant la même tête que Applications. */
html.bos-light-split-embed .technical-native-card > summary.collapsible-heading{
  position:relative!important;
  overflow:hidden!important;
  padding-right:calc(clamp(180px,23vw,240px) + 46px)!important;
}

.bos-tech-thumb{
  position:absolute!important;
  z-index:1!important;
  top:0!important;
  right:0!important;
  bottom:0!important;
  width:clamp(180px,23vw,240px)!important;
  height:100%!important;
  object-fit:cover!important;
  object-position:center center!important;
  pointer-events:none!important;
  opacity:.97!important;
  border-radius:0 18px 18px 0!important;
  -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 15%,#000 34%,#000 100%)!important;
  mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 15%,#000 34%,#000 100%)!important;
}

html.bos-light-split-embed .technical-native-card .step,
html.bos-light-split-embed .technical-native-card .heading-copy{
  position:relative!important;
  z-index:3!important;
}
html.bos-light-split-embed .technical-native-card .chevron{
  right:14px!important;
  z-index:5!important;
  text-shadow:
    -.6px 0 rgba(255,255,255,.95),
    .6px 0 rgba(255,255,255,.95),
    0 -.6px rgba(255,255,255,.95),
    0 .6px rgba(255,255,255,.95),
    0 0 2px rgba(255,255,255,.72)!important;
}

/* Sous-titres identiques sur Applications et Fiches techniques. */
html.bos-light-split-embed .shared-heading-copy p,
html.bos-light-split-embed .heading-copy p{
  font-size:9.5px!important;
}

/* FALL OFF — typo sobre, identique ordinateur / téléphone. */
html.bos-suite-embed #bosMiniPlateau .bft-item-label,
html.bos-suite-embed #bosMiniPlateau .bft-hint,
html.bos-suite-embed #bosMiniPlateau .bft-distance span,
html.bos-suite-embed #bosMiniPlateau .bft-readout,
html.bos-suite-embed #bosMiniPlateau .bft-readout span,
html.bos-suite-embed #bosMiniPlateau .bft-readout strong{
  font-family:"Instrument Sans",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-item-label{
  font-size:9.5px!important;
  line-height:1.25!important;
  font-weight:400!important;
  letter-spacing:0!important;
  text-transform:uppercase!important;
  transform:translateX(-50%)!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-hint,
html.bos-suite-embed #bosMiniPlateau .bft-distance span,
html.bos-suite-embed #bosMiniPlateau .bft-readout span{
  font-weight:400!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-readout strong{font-weight:500!important}

html.bos-suite-embed #bosMiniPlateau .bft-item-label::before,
html.bos-suite-embed #bosMiniPlateau .bft-item-label::after{
  content:none!important;
  display:none!important;
  visibility:hidden!important;
}

html.bos-suite-embed #bosMiniPlateau .bft-readout strong{display:none!important}
html.bos-suite-embed #bosMiniPlateau .bft-readout{justify-content:flex-start!important}

/* Deux images après le module interactif Fall Off. */
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images{
  display:flex;
  flex-direction:column;
  gap:14px;
  width:100%;
  margin-top:14px;
}
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images[hidden]{display:none!important}
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img{
  display:block;
  width:100%;
  max-width:100%;
  height:auto;
  margin:0;
  border:0;
  border-radius:13px;
  background:#F5F2EA;
  object-fit:contain;
}
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img[hidden]{display:none!important}

html.bos-light-split-embed.bos-light-section-technical #bosThreePointPanel{margin-top:0!important}

html[data-theme="dark"] .bos-tech-thumb,
body.dark .bos-tech-thumb{filter:brightness(.72) saturate(.86)!important;opacity:.88!important}

@media(max-width:560px){
  html.bos-light-split-embed .technical-native-card > summary.collapsible-heading{
    padding-left:12px!important;
    padding-right:calc(clamp(104px,30vw,124px) + 34px)!important;
  }
  .bos-tech-thumb{
    width:clamp(104px,30vw,124px)!important;
    border-radius:0 18px 18px 0!important;
    -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
    mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
  }
  html.bos-light-split-embed .technical-native-card .chevron{
    right:12px!important;
    width:22px!important;
    height:22px!important;
  }
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images{gap:12px;margin-top:12px}
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img{border-radius:12px}
}

@media(max-width:420px){
  html.bos-light-split-embed .technical-native-card > summary.collapsible-heading{
    padding-left:10px!important;
    padding-right:calc(clamp(94px,29vw,112px) + 32px)!important;
  }
  .bos-tech-thumb{width:clamp(94px,29vw,112px)!important;border-radius:0 17px 17px 0!important}
}
`;
  }

  function ensureHeaderThumb(doc,panelId,src){
    const panel=doc.getElementById(panelId);
    if(!panel)return false;
    const head=panel.querySelector(':scope > summary.collapsible-heading');
    if(!head)return false;

    let img=head.querySelector('img.bos-tech-thumb');
    if(!img){
      img=doc.createElement('img');
      img.className='bos-tech-thumb';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.decoding='async';
      img.addEventListener('load',fit);
      head.appendChild(img);
    }
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    return true;
  }

  function applyTechnicalThumbs(){
    const doc=frameDoc();
    if(!doc)return false;
    ensureThumbStyle(doc);
    const a=ensureHeaderThumb(doc,'bosThreePointPanel','/BOS-LIGHT/assets/thumb-tech-3points.webp?v=20261012-3');
    const b=ensureHeaderThumb(doc,'bosShadowHardnessPanel','/BOS-LIGHT/assets/thumb-tech-shadow.webp?v=20261012-3');
    const c=ensureHeaderThumb(doc,'bosMiniPlateau','/BOS-LIGHT/assets/thumb-tech-falloff.webp?v=20261012-3');
    return a&&b&&c;
  }

  function setTextIfDifferent(el,value){
    if(el&&el.textContent!==value)el.textContent=value;
  }

  function setAttrIfDifferent(el,name,value){
    if(el&&el.getAttribute(name)!==value)el.setAttribute(name,value);
  }

  function applyTechnicalLabels(){
    const doc=frameDoc();
    if(!doc)return false;
    const values={
      bosThreePointPanel:['POSITION','Système 3 points','Position — Système 3 points'],
      bosShadowHardnessPanel:['SHADOWS','Dureté des ombres','Shadows — Dureté des ombres'],
      bosMiniPlateau:['FALL OFF','Gestion du contraste','Fall Off — Gestion du contraste']
    };
    Object.entries(values).forEach(([id,[title,subtitle,aria]])=>{
      const panel=doc.getElementById(id);
      if(!panel)return;
      setTextIfDifferent(panel.querySelector(':scope > summary .heading-copy h2'),title);
      setTextIfDifferent(panel.querySelector(':scope > summary .heading-copy p'),subtitle);
      setAttrIfDifferent(panel,'aria-label',aria);
    });
    return true;
  }

  function applyShadowImages(){
    const doc=frameDoc();
    if(!doc)return false;
    const panel=doc.getElementById('bosShadowHardnessPanel');
    if(!panel)return false;
    const images=panel.querySelectorAll('.bft-reference-images img');
    if(images[0]){
      images[0].src='/BOS-LIGHT/assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=20261009-2';
      images[0].alt='Dureté des ombres — schéma 1';
    }
    if(images[1]){
      images[1].src='/BOS-LIGHT/assets/lighting/shadow-hardness/02-durete-des-ombres.jpg?v=20261009-2';
      images[1].alt='Dureté des ombres — schéma 2';
    }
    return images.length>=2;
  }

  function removeFalloffIntro(){
    const doc=frameDoc();
    if(!doc)return false;
    const intro=doc.getElementById('bosMiniPlateau')?.querySelector('.bft-intro');
    if(intro)intro.remove();
    return true;
  }

  function ensureFalloffPostImages(){
    const doc=frameDoc();
    if(!doc)return false;
    const panel=doc.getElementById('bosMiniPlateau');
    const body=panel?.querySelector('.bft-body');
    if(!panel||!body)return false;

    let wrap=panel.querySelector('.bft-falloff-post-images');
    if(!wrap){
      wrap=doc.createElement('div');
      wrap.className='bft-falloff-post-images';
      wrap.hidden=true;

      const sources=[
        ['/BOS-LIGHT/assets/lighting/falloff/02-fall-off-fort.jpg?v=20261012-1','Fall Off fort'],
        ['/BOS-LIGHT/assets/lighting/falloff/03-fall-off-doux.jpg?v=20261012-1','Fall Off doux']
      ];

      const syncVisibility=()=>{
        const imgs=Array.from(wrap.querySelectorAll('img'));
        wrap.hidden=!imgs.some(img=>!img.hidden);
        if(!wrap.hidden)fit();
      };

      sources.forEach(([src,alt])=>{
        const img=doc.createElement('img');
        img.alt=alt;
        img.decoding='async';
        img.loading='eager';
        img.hidden=true;
        img.addEventListener('load',()=>{img.hidden=false;syncVisibility();});
        img.addEventListener('error',()=>{img.hidden=true;syncVisibility();});
        img.src=src;
        wrap.appendChild(img);
      });

      const anchor=panel.querySelector('.bft-readout')||panel.querySelector('.bft-stage');
      if(anchor)anchor.insertAdjacentElement('afterend',wrap);
      else body.appendChild(wrap);
    }
    return true;
  }

  function applyAll(){
    applyShadowImages();
    applyTechnicalThumbs();
    applyTechnicalLabels();
    removeFalloffIntro();
    ensureFalloffPostImages();
  }

  function watchFrame(){
    const doc=frameDoc();
    if(!doc||!doc.body||doc.documentElement.dataset.bosTechThumbWatch==='1')return;
    doc.documentElement.dataset.bosTechThumbWatch='1';
    const observer=new MutationObserver(()=>applyAll());
    observer.observe(doc.body,{childList:true,subtree:true});
  }

  function refresh(){
    applyAll();
    watchFrame();
    [60,180,500,1000,1800,3000].forEach(ms=>setTimeout(()=>{
      applyAll();
      watchFrame();
    },ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();