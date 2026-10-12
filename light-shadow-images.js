(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function ensureThumbStyle(doc){
    let style=doc.getElementById('bosTechnicalThumbStyle');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalThumbStyle';
      doc.head.appendChild(style);
    }
    style.textContent=`
#bosThreePointPanel .bft-head,
#bosShadowHardnessPanel .bft-head,
#bosMiniPlateau .bft-head{position:relative!important;overflow:hidden!important}

#bosThreePointPanel .bft-head::after,
#bosShadowHardnessPanel .bft-head::after,
#bosMiniPlateau .bft-head::after{display:none!important;content:none!important}

/* Les bulles techniques gardent exactement le même en-tête ouvertes ou fermées. */
html.bos-suite-embed #bosThreePointPanel,
html.bos-suite-embed #bosShadowHardnessPanel,
html.bos-suite-embed #bosMiniPlateau{box-sizing:border-box!important}
html.bos-suite-embed #bosThreePointPanel .bft-head,
html.bos-suite-embed #bosShadowHardnessPanel .bft-head,
html.bos-suite-embed #bosMiniPlateau .bft-head{
  height:80px!important;
  min-height:80px!important;
  max-height:80px!important;
  box-sizing:border-box!important;
}
html.bos-suite-embed #bosThreePointPanel.bmp-collapsed,
html.bos-suite-embed #bosShadowHardnessPanel.bmp-collapsed,
html.bos-suite-embed #bosMiniPlateau.bmp-collapsed{
  height:82px!important;
  min-height:82px!important;
  max-height:82px!important;
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

#bosThreePointPanel .bft-number,
#bosShadowHardnessPanel .bft-number,
#bosMiniPlateau .bft-number,
#bosThreePointPanel .bft-title,
#bosShadowHardnessPanel .bft-title,
#bosMiniPlateau .bft-title{position:relative!important;z-index:3!important}

#bosThreePointPanel .bft-chevron,
#bosShadowHardnessPanel .bft-chevron,
#bosMiniPlateau .bft-chevron{z-index:5!important}

/* Sous-titres : réduction très légère, identique sur toutes les bulles. */
html.bos-light-split-embed .shared-heading-copy p,
html.bos-light-split-embed .heading-copy p,
html.bos-light-split-embed .bft-title small{
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
html.bos-suite-embed #bosMiniPlateau .bft-readout strong{
  font-weight:500!important;
}

/* FALL OFF — supprimer les petits repères bleus sous les libellés. */
html.bos-suite-embed #bosMiniPlateau .bft-item-label::before,
html.bos-suite-embed #bosMiniPlateau .bft-item-label::after{
  content:none!important;
  display:none!important;
  visibility:hidden!important;
}

/* FALL OFF — ne pas afficher une valeur en stops, seulement l'indication qualitative. */
html.bos-suite-embed #bosMiniPlateau .bft-readout strong{
  display:none!important;
}
html.bos-suite-embed #bosMiniPlateau .bft-readout{
  justify-content:flex-start!important;
}

/* Deux images optionnelles après le module interactif Fall Off. */
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
  height:auto;
  margin:0;
  border:0;
  border-radius:13px;
  background:#F5F2EA;
  object-fit:contain;
}
html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img[hidden]{display:none!important}

/* Même espace switch → 01 qu'en mode Applications : aucun retrait interne supplémentaire. */
html.bos-light-split-embed.bos-light-section-technical #bosThreePointPanel{
  margin-top:0!important;
}

html[data-theme="dark"] .bos-tech-thumb,
body.dark .bos-tech-thumb{filter:brightness(.72) saturate(.86)!important;opacity:.88!important}

@media(max-width:560px){
  .bos-tech-thumb{
    width:clamp(104px,30vw,124px)!important;
    border-radius:0 18px 18px 0!important;
    -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
    mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
  }
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images{gap:12px;margin-top:12px}
  html.bos-suite-embed #bosMiniPlateau .bft-falloff-post-images img{border-radius:12px}
}

@media(max-width:420px){
  .bos-tech-thumb{width:clamp(94px,29vw,112px)!important;border-radius:0 17px 17px 0!important}
}
`;
  }

  function ensureHeaderThumb(doc,panelId,src){
    const panel=doc.getElementById(panelId);
    if(!panel)return false;
    const head=panel.querySelector('.bft-head');
    if(!head)return false;

    let img=head.querySelector('img.bos-tech-thumb');
    if(!img){
      img=doc.createElement('img');
      img.className='bos-tech-thumb';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.decoding='async';
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

    const three=doc.getElementById('bosThreePointPanel');
    const shadow=doc.getElementById('bosShadowHardnessPanel');
    const falloff=doc.getElementById('bosMiniPlateau');

    if(three){
      setTextIfDifferent(three.querySelector('.bft-title strong'),'POSITION');
      setTextIfDifferent(three.querySelector('.bft-title small'),'Système 3 points');
      setAttrIfDifferent(three,'aria-label','Position — Système 3 points');
    }
    if(shadow){
      setTextIfDifferent(shadow.querySelector('.bft-title strong'),'SHADOWS');
      setTextIfDifferent(shadow.querySelector('.bft-title small'),'Dureté des ombres');
      setAttrIfDifferent(shadow,'aria-label','Shadows — Dureté des ombres');
    }
    if(falloff){
      setTextIfDifferent(falloff.querySelector('.bft-title strong'),'FALL OFF');
      setTextIfDifferent(falloff.querySelector('.bft-title small'),'Gestion du contraste');
      setAttrIfDifferent(falloff,'aria-label','Fall Off — Gestion du contraste');
    }

    return !!(three&&shadow&&falloff);
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
    const panel=doc.getElementById('bosMiniPlateau');
    if(!panel)return false;
    const intro=panel.querySelector('.bft-intro');
    if(intro)intro.remove();
    return true;
  }

  function ensureFalloffPostImages(){
    const doc=frameDoc();
    if(!doc)return false;
    const panel=doc.getElementById('bosMiniPlateau');
    if(!panel)return false;
    const body=panel.querySelector('.bft-body');
    if(!body)return false;

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
        img.addEventListener('load',()=>{
          img.hidden=false;
          syncVisibility();
        });
        img.addEventListener('error',()=>{
          img.hidden=true;
          syncVisibility();
        });
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