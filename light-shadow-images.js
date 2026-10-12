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

  function ensureStyle(doc){
    let style=doc.getElementById('bosTechnicalThumbStyle');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalThumbStyle';
      doc.head.appendChild(style);
    }

    style.textContent=`
/* Image latérale : même principe visuel que les bulles Applications. */
html.bos-light-split-embed .technical-application-card > summary.collapsible-heading{
  position:relative!important;
  overflow:hidden!important;
  padding-right:calc(clamp(180px,23vw,240px) + 46px)!important;
}
html.bos-light-split-embed .technical-application-card .bos-tech-thumb{
  position:absolute!important;
  z-index:1!important;
  top:0!important;
  right:0!important;
  bottom:0!important;
  width:clamp(180px,23vw,240px)!important;
  height:100%!important;
  max-width:none!important;
  object-fit:cover!important;
  object-position:center center!important;
  pointer-events:none!important;
  opacity:.97!important;
  border-radius:0 18px 18px 0!important;
  -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 15%,#000 34%,#000 100%)!important;
  mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 15%,#000 34%,#000 100%)!important;
}
html.bos-light-split-embed .technical-application-card .step,
html.bos-light-split-embed .technical-application-card .heading-copy,
html.bos-light-split-embed .technical-application-card .summary-value{
  position:relative!important;
  z-index:3!important;
}
html.bos-light-split-embed .technical-application-card .chevron{
  z-index:5!important;
}
html[data-theme="dark"] .bos-tech-thumb,
body.dark .bos-tech-thumb{
  filter:brightness(.72) saturate(.86)!important;
  opacity:.88!important;
}

/* Sous-titres harmonisés. */
html.bos-light-split-embed .shared-heading-copy p,
html.bos-light-split-embed .heading-copy p{
  font-size:9.5px!important;
}

/* FALL OFF : aucune ancienne phrase d'introduction. */
html.bos-suite-embed #bosMiniPlateau .bft-intro{display:none!important}

/* FALL OFF : typo sobre et aucun petit repère bleu sous les libellés. */
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
html.bos-suite-embed #bosMiniPlateau .bft-item-label::before,
html.bos-suite-embed #bosMiniPlateau .bft-item-label::after{
  content:none!important;
  display:none!important;
  visibility:hidden!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-readout strong{display:none!important}
html.bos-suite-embed #bosMiniPlateau .bft-readout{justify-content:flex-start!important}

/* Images après le module interactif. */
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images{
  display:flex;
  flex-direction:column;
  gap:14px;
  width:100%;
  max-width:100%;
  min-width:0;
  margin-top:14px;
  box-sizing:border-box;
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
  box-sizing:border-box;
}
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img[hidden]{display:none!important}

@media(max-width:560px){
  html.bos-light-split-embed .technical-application-card > summary.collapsible-heading{
    padding-right:calc(clamp(104px,30vw,124px) + 34px)!important;
  }
  html.bos-light-split-embed .technical-application-card .bos-tech-thumb{
    width:clamp(104px,30vw,124px)!important;
    border-radius:0 18px 18px 0!important;
    -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
    mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
  }
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images{gap:12px;margin-top:12px}
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img{border-radius:12px}
}
@media(max-width:420px){
  html.bos-light-split-embed .technical-application-card > summary.collapsible-heading{
    padding-right:calc(clamp(94px,29vw,112px) + 32px)!important;
  }
  html.bos-light-split-embed .technical-application-card .bos-tech-thumb{
    width:clamp(94px,29vw,112px)!important;
    border-radius:0 17px 17px 0!important;
  }
}
`;
  }

  function ensureThumb(doc,wrapperId,src){
    const summary=doc.querySelector(`#${wrapperId} > summary.collapsible-heading`);
    if(!summary)return false;
    let img=summary.querySelector('.bos-tech-thumb');
    if(!img){
      img=doc.createElement('img');
      img.className='bos-tech-thumb';
      img.alt='';
      img.decoding='async';
      img.setAttribute('aria-hidden','true');
      img.addEventListener('load',fit);
      summary.appendChild(img);
    }
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    return true;
  }

  function applyTechnicalThumbs(doc){
    ensureThumb(doc,'bosTechThreePointDetails','/BOS-LIGHT/assets/thumb-tech-3points.webp?v=20261012-3');
    ensureThumb(doc,'bosTechShadowDetails','/BOS-LIGHT/assets/thumb-tech-shadow.webp?v=20261012-3');
    ensureThumb(doc,'bosTechFalloffDetails','/BOS-LIGHT/assets/thumb-tech-falloff.webp?v=20261012-3');
  }

  function applyShadowImages(doc){
    const panel=doc.getElementById('bosShadowHardnessPanel');
    if(!panel)return;
    const images=panel.querySelectorAll('.bft-reference-images img');
    if(images[0]){
      images[0].src='/BOS-LIGHT/assets/lighting/shadow-hardness/01-durete-des-ombres.jpg?v=20261009-2';
      images[0].alt='Dureté des ombres — schéma 1';
    }
    if(images[1]){
      images[1].src='/BOS-LIGHT/assets/lighting/shadow-hardness/02-durete-des-ombres.jpg?v=20261009-2';
      images[1].alt='Dureté des ombres — schéma 2';
    }
  }

  function removeFalloffIntro(doc){
    doc.getElementById('bosMiniPlateau')?.querySelector('.bft-intro')?.remove();
  }

  function ensureFalloffPostImages(doc){
    const panel=doc.getElementById('bosMiniPlateau');
    const body=panel?.querySelector('.bft-body');
    if(!panel||!body)return;

    let wrap=panel.querySelector('.bft-falloff-post-images');
    if(wrap)return;

    wrap=doc.createElement('div');
    wrap.className='bft-falloff-post-images';
    wrap.hidden=true;

    const sources=[
      ['/BOS-LIGHT/assets/lighting/falloff/02-fall-off-fort.jpg?v=20261012-2','Fall Off fort'],
      ['/BOS-LIGHT/assets/lighting/falloff/03-fall-off-doux.jpg?v=20261012-2','Fall Off doux']
    ];

    const sync=()=>{
      const imgs=[...wrap.querySelectorAll('img')];
      wrap.hidden=!imgs.some(img=>!img.hidden);
      fit();
    };

    sources.forEach(([src,alt])=>{
      const img=doc.createElement('img');
      img.alt=alt;
      img.decoding='async';
      img.loading='eager';
      img.hidden=true;
      img.addEventListener('load',()=>{img.hidden=false;sync();});
      img.addEventListener('error',()=>{img.hidden=true;sync();});
      img.src=src;
      wrap.appendChild(img);
    });

    const anchor=panel.querySelector('.bft-readout')||panel.querySelector('.bft-stage');
    if(anchor)anchor.insertAdjacentElement('afterend',wrap);
    else body.appendChild(wrap);
  }

  function applyAll(){
    const doc=frameDoc();
    if(!doc||!doc.head)return false;
    ensureStyle(doc);
    applyTechnicalThumbs(doc);
    applyShadowImages(doc);
    removeFalloffIntro(doc);
    ensureFalloffPostImages(doc);
    return true;
  }

  function watch(){
    const doc=frameDoc();
    if(!doc||!doc.body||doc.documentElement.dataset.bosTechVisualWatch==='1')return;
    doc.documentElement.dataset.bosTechVisualWatch='1';
    const observer=new MutationObserver(()=>applyAll());
    observer.observe(doc.body,{childList:true,subtree:true});
  }

  function refresh(){
    applyAll();
    watch();
    [60,180,500,1000,1800,3000].forEach(ms=>setTimeout(()=>{applyAll();watch();fit();},ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
