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

/* FALL OFF — typographie stable et sobre sur toutes les plateformes. */
html.bos-light-split-embed #bosMiniPlateau .bft-item-label{
  font-family:"Instrument Sans",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-size:9.5px!important;
  line-height:1.25!important;
  font-weight:400!important;
  letter-spacing:-.005em!important;
  text-transform:uppercase!important;
  transform:translateX(-50%)!important;
}
html.bos-light-split-embed #bosMiniPlateau .bft-hint,
html.bos-light-split-embed #bosMiniPlateau .bft-distance span{
  font-family:"Instrument Sans",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-weight:400!important;
}

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

  function applyAll(){
    applyShadowImages();
    applyTechnicalThumbs();
    applyTechnicalLabels();
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