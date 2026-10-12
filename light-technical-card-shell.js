(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const PANEL_IDS=['bosThreePointPanel','bosShadowHardnessPanel','bosMiniPlateau'];

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function fit(){
    if(typeof window.BOSLightFit==='function'){
      window.BOSLightFit();
      return;
    }
    requestAnimationFrame(()=>{
      if(typeof window.BOSLightFit==='function')window.BOSLightFit();
    });
  }

  function copyAttributes(from,to){
    Array.from(from.attributes||[]).forEach(attr=>{
      if(attr.name==='type')return;
      to.setAttribute(attr.name,attr.value);
    });
  }

  function normalizeSummary(doc,panel){
    let head=panel.querySelector(':scope > .bft-head')||panel.querySelector(':scope > summary');
    if(!head)return null;

    if(head.tagName!=='SUMMARY'){
      const summary=doc.createElement('summary');
      copyAttributes(head,summary);
      while(head.firstChild)summary.appendChild(head.firstChild);
      head.replaceWith(summary);
      head=summary;
    }

    /* Exactement les mêmes classes que les bulles Applications. */
    head.classList.add('card-heading','collapsible-heading','bft-head');
    head.removeAttribute('aria-expanded');

    /* Empêche l'ancien système JS technique de reprendre la main. */
    head.dataset.bosBound='1';
    head.dataset.bosChevronBound='1';

    const number=head.querySelector('.bft-number');
    if(number)number.classList.add('step');

    const title=head.querySelector('.bft-title');
    if(title)title.classList.add('heading-copy');

    const chevron=head.querySelector('.bft-chevron');
    if(chevron){
      chevron.classList.add('chevron');
      chevron.textContent='⌄';
    }

    return head;
  }

  function normalizePanel(doc,id){
    let panel=doc.getElementById(id);
    if(!panel)return false;

    const wasOpen=panel.tagName==='DETAILS'
      ? panel.open
      : !panel.classList.contains('bmp-collapsed');

    if(panel.tagName!=='DETAILS'){
      const details=doc.createElement('details');
      details.id=panel.id;
      details.className='controls-card collapsible-card technical-native-card';
      const aria=panel.getAttribute('aria-label');
      if(aria)details.setAttribute('aria-label',aria);
      if(wasOpen)details.open=true;

      const children=Array.from(panel.children);
      children.forEach(child=>details.appendChild(child));
      panel.replaceWith(details);
      panel=details;
    }else{
      panel.classList.add('controls-card','collapsible-card','technical-native-card');
    }

    normalizeSummary(doc,panel);

    const sync=()=>{
      /* Compatibilité uniquement : l'ouverture réelle est celle de <details>. */
      panel.classList.toggle('bmp-collapsed',!panel.open);
      const summary=panel.querySelector(':scope > summary');
      if(summary){
        summary.dataset.bosBound='1';
        summary.dataset.bosChevronBound='1';
      }
      fit();
    };

    if(panel.dataset.bosNativeToggleBound!=='1'){
      panel.dataset.bosNativeToggleBound='1';
      panel.addEventListener('toggle',sync);
      panel.querySelectorAll('img').forEach(img=>img.addEventListener('load',fit));
    }

    sync();
    return true;
  }

  function ensureStyle(doc){
    let style=doc.getElementById('bosTechnicalFixedCardShell');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalFixedCardShell';
      doc.head.appendChild(style);
    }

    style.textContent=`
/*
  FICHES TECHNIQUES = même système que Applications.
  Même <details>, même <summary>, mêmes classes et ouverture native.
*/
html.bos-suite-embed #bosThreePointPanel,
html.bos-suite-embed #bosShadowHardnessPanel,
html.bos-suite-embed #bosMiniPlateau{
  margin-top:12px!important;
  padding:0!important;
  border:1px solid var(--bos-line,rgba(21,25,27,.085))!important;
  border-radius:var(--bos-radius,18px)!important;
  background:var(--bos-panel,#fff)!important;
  box-shadow:var(--bos-shadow,0 10px 34px rgba(22,31,35,.055),0 2px 8px rgba(22,31,35,.035))!important;
  overflow:hidden!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
}

html.bos-suite-embed #bosThreePointPanel > summary.bft-head,
html.bos-suite-embed #bosShadowHardnessPanel > summary.bft-head,
html.bos-suite-embed #bosMiniPlateau > summary.bft-head{
  list-style:none!important;
  cursor:pointer!important;
  border-bottom:0!important;
  border-radius:0!important;
  box-shadow:none!important;
}
html.bos-suite-embed #bosThreePointPanel > summary.bft-head::-webkit-details-marker,
html.bos-suite-embed #bosShadowHardnessPanel > summary.bft-head::-webkit-details-marker,
html.bos-suite-embed #bosMiniPlateau > summary.bft-head::-webkit-details-marker{display:none!important}

/* Même séparation que .collapsible-card[open] > summary.card-heading. */
html.bos-suite-embed #bosThreePointPanel[open] > summary.bft-head,
html.bos-suite-embed #bosShadowHardnessPanel[open] > summary.bft-head,
html.bos-suite-embed #bosMiniPlateau[open] > summary.bft-head{
  border-bottom:1px solid var(--bos-line,rgba(21,25,27,.085))!important;
}

/* On abandonne le pseudo-chevron technique : même chevron réel qu'Applications. */
html.bos-suite-embed #bosThreePointPanel .bft-chevron,
html.bos-suite-embed #bosShadowHardnessPanel .bft-chevron,
html.bos-suite-embed #bosMiniPlateau .bft-chevron{
  font-size:18px!important;
  line-height:1!important;
  transform:translateY(-50%)!important;
  transform-origin:50% 50%!important;
  transition:transform .2s ease!important;
}
html.bos-suite-embed #bosThreePointPanel .bft-chevron::before,
html.bos-suite-embed #bosShadowHardnessPanel .bft-chevron::before,
html.bos-suite-embed #bosMiniPlateau .bft-chevron::before{
  content:none!important;
  display:none!important;
}
html.bos-suite-embed #bosThreePointPanel[open] .bft-chevron,
html.bos-suite-embed #bosShadowHardnessPanel[open] .bft-chevron,
html.bos-suite-embed #bosMiniPlateau[open] .bft-chevron{
  transform:translateY(-50%) rotate(180deg)!important;
}

/* Le corps reste dans la carte, exactement comme le contenu Applications. */
html.bos-suite-embed #bosThreePointPanel > .bft-body,
html.bos-suite-embed #bosShadowHardnessPanel > .bft-body,
html.bos-suite-embed #bosMiniPlateau > .bft-body{
  margin:0!important;
  border:0!important;
  box-shadow:none!important;
}

@media(max-width:520px){
  html.bos-suite-embed #bosThreePointPanel,
  html.bos-suite-embed #bosShadowHardnessPanel,
  html.bos-suite-embed #bosMiniPlateau{
    border-radius:16px!important;
  }
}
`;
  }

  function apply(){
    const doc=frameDoc();
    if(!doc||!doc.head)return false;
    ensureStyle(doc);
    let found=false;
    PANEL_IDS.forEach(id=>{if(normalizePanel(doc,id))found=true;});
    return found;
  }

  function watch(){
    const doc=frameDoc();
    if(!doc||!doc.body||doc.documentElement.dataset.bosTechnicalNativeWatch==='1')return;
    doc.documentElement.dataset.bosTechnicalNativeWatch='1';
    const observer=new MutationObserver(()=>apply());
    observer.observe(doc.body,{childList:true,subtree:true});
  }

  function refresh(){
    apply();
    watch();
    [60,180,500,1000,1800,3000].forEach(ms=>setTimeout(()=>{
      apply();
      watch();
    },ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
