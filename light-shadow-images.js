(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function ensureThumbStyle(doc){
    if(doc.getElementById('bosTechnicalThumbStyle'))return;
    const style=doc.createElement('style');
    style.id='bosTechnicalThumbStyle';
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
    doc.head.appendChild(style);
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
