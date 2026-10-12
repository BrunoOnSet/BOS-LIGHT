(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const CARDS={
    bosThreePointPanel:{number:'01',title:'POSITION',subtitle:'Système 3 points',toggleId:'bftThreePointToggle',thumb:'/BOS-LIGHT/assets/thumb-tech-3points.webp?v=20261012-3'},
    bosShadowHardnessPanel:{number:'02',title:'SHADOWS',subtitle:'Dureté des ombres',toggleId:'bftShadowHardnessToggle',thumb:'/BOS-LIGHT/assets/thumb-tech-shadow.webp?v=20261012-3'},
    bosMiniPlateau:{number:'03',title:'FALL OFF',subtitle:'Gestion du contraste',toggleId:'bftToggle',thumb:'/BOS-LIGHT/assets/thumb-tech-falloff.webp?v=20261012-3'}
  };

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

  function makeSummary(doc,meta){
    const summary=doc.createElement('summary');
    summary.className='card-heading collapsible-heading';
    summary.id=meta.toggleId;
    summary.dataset.bosApplicationSummary='1';
    summary.dataset.bosBound='1';
    summary.dataset.bosChevronBound='1';
    summary.innerHTML=`
      <span class="step">${meta.number}</span>
      <div class="heading-copy">
        <h2>${meta.title}</h2>
        <p>${meta.subtitle}</p>
      </div>
      <div class="summary-value light-summary" aria-hidden="true"></div>
      <span class="chevron" aria-hidden="true">⌄</span>
      <img class="bos-tech-thumb" src="${meta.thumb}" alt="" aria-hidden="true" decoding="async">`;
    return summary;
  }

  function ensureSummary(doc,details,meta){
    let summary=details.querySelector(':scope > summary.card-heading.collapsible-heading');
    if(!summary||summary.dataset.bosApplicationSummary!=='1'){
      const oldHead=details.querySelector(':scope > summary, :scope > .bft-head');
      summary=makeSummary(doc,meta);
      if(oldHead)oldHead.replaceWith(summary);
      else details.insertBefore(summary,details.firstChild);
    }

    summary.className='card-heading collapsible-heading';
    summary.id=meta.toggleId;
    summary.dataset.bosApplicationSummary='1';
    summary.dataset.bosBound='1';
    summary.dataset.bosChevronBound='1';
    summary.removeAttribute('aria-expanded');

    const step=summary.querySelector('.step');
    const h2=summary.querySelector('.heading-copy h2');
    const p=summary.querySelector('.heading-copy p');
    if(step)step.textContent=meta.number;
    if(h2)h2.textContent=meta.title;
    if(p)p.textContent=meta.subtitle;

    let thumb=summary.querySelector('.bos-tech-thumb');
    if(!thumb){
      thumb=doc.createElement('img');
      thumb.className='bos-tech-thumb';
      thumb.alt='';
      thumb.setAttribute('aria-hidden','true');
      thumb.decoding='async';
      summary.appendChild(thumb);
    }
    if(thumb.getAttribute('src')!==meta.thumb)thumb.setAttribute('src',meta.thumb);
    return summary;
  }

  function rebuildPanel(doc,id,meta){
    let panel=doc.getElementById(id);
    if(!panel)return false;

    if(panel.tagName!=='DETAILS'||panel.dataset.bosApplicationsCard!=='1'){
      const body=panel.querySelector(':scope > .bft-body')||panel.querySelector('.bft-body');
      if(!body)return false;

      const details=doc.createElement('details');
      details.id=id;
      details.className='controls-card collapsible-card technical-native-card';
      details.dataset.bosApplicationsCard='1';
      details.setAttribute('aria-label',`${meta.title} — ${meta.subtitle}`);
      details.appendChild(makeSummary(doc,meta));
      details.appendChild(body);
      panel.replaceWith(details);
      panel=details;
    }else{
      panel.className='controls-card collapsible-card technical-native-card';
      panel.setAttribute('aria-label',`${meta.title} — ${meta.subtitle}`);
      ensureSummary(doc,panel,meta);
    }

    /* Aucun état .bmp-collapsed : seule l'ouverture native <details> pilote la carte. */
    panel.classList.remove('bmp-collapsed');

    if(panel.dataset.bosNativeToggleBound!=='1'){
      panel.dataset.bosNativeToggleBound='1';
      panel.addEventListener('toggle',()=>{
        requestAnimationFrame(()=>{
          if(panel.open)doc.defaultView?.dispatchEvent(new Event('resize'));
          fit();
        });
        setTimeout(()=>{
          if(panel.open)doc.defaultView?.dispatchEvent(new Event('resize'));
          fit();
        },80);
      });
      panel.querySelectorAll('img').forEach(img=>img.addEventListener('load',fit));
    }

    return true;
  }

  function ensureStyle(doc){
    let style=doc.getElementById('bosTechnicalApplicationsStructure');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalApplicationsStructure';
      doc.head.appendChild(style);
    }

    style.textContent=`
/* Aucune largeur interne ne peut dépasser l'écran. */
html.bos-light-split-embed,
html.bos-light-split-embed body{
  width:100%!important;
  max-width:100%!important;
  overflow-x:hidden!important;
}
html.bos-light-split-embed .app-shell{
  width:100%!important;
  max-width:620px!important;
  min-width:0!important;
}
html.bos-light-split-embed .technical-native-card,
html.bos-light-split-embed .technical-native-card > summary,
html.bos-light-split-embed .technical-native-card > .bft-body,
html.bos-light-split-embed .technical-native-card .bft-reference-images,
html.bos-light-split-embed .technical-native-card .bft-stage,
html.bos-light-split-embed .technical-native-card img{
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

/* La carte utilise uniquement la coque Applications. */
html.bos-light-split-embed .technical-native-card{
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  padding:0!important;
}

/* Exactement le résumé Applications : card-heading + collapsible-heading. */
html.bos-light-split-embed .technical-native-card > summary.card-heading.collapsible-heading{
  position:relative!important;
  width:100%!important;
  max-width:100%!important;
  list-style:none!important;
  overflow:hidden!important;
  cursor:pointer!important;
}
html.bos-light-split-embed .technical-native-card > summary.card-heading.collapsible-heading::-webkit-details-marker{
  display:none!important;
}
html.bos-light-split-embed .technical-native-card > summary .step,
html.bos-light-split-embed .technical-native-card > summary .heading-copy,
html.bos-light-split-embed .technical-native-card > summary .summary-value{
  position:relative!important;
  z-index:3!important;
}
html.bos-light-split-embed .technical-native-card > summary .heading-copy{
  min-width:0!important;
}
html.bos-light-split-embed .technical-native-card > summary .heading-copy h2,
html.bos-light-split-embed .technical-native-card > summary .heading-copy p{
  overflow:hidden!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-light-split-embed .technical-native-card > summary .chevron{
  z-index:5!important;
}

/* Photo latérale calquée sur Applications. */
html.bos-light-split-embed .technical-native-card .bos-tech-thumb{
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

/* Ordinateur : même composition que les bulles Applications. */
@media(min-width:561px){
  html.bos-light-split-embed .technical-native-card > summary.card-heading.collapsible-heading{
    display:grid!important;
    grid-template-columns:32px minmax(150px,1fr) minmax(110px,180px)!important;
    align-items:center!important;
    column-gap:12px!important;
    padding-right:calc(clamp(180px,23vw,240px) + 48px)!important;
  }
  html.bos-light-split-embed .technical-native-card > summary .step{grid-column:1!important;grid-row:1!important}
  html.bos-light-split-embed .technical-native-card > summary .heading-copy{grid-column:2!important;grid-row:1!important}
  html.bos-light-split-embed .technical-native-card > summary .summary-value{grid-column:3!important;grid-row:1!important;visibility:hidden!important}
}

/* Téléphone : mêmes règles de placement que Applications. */
@media(max-width:560px){
  html.bos-light-split-embed .app-shell{
    padding-left:10px!important;
    padding-right:10px!important;
  }
  html.bos-light-split-embed .technical-native-card > summary.card-heading.collapsible-heading{
    display:flex!important;
    align-items:center!important;
    column-gap:10px!important;
    padding-left:12px!important;
    padding-right:calc(clamp(104px,30vw,124px) + 34px)!important;
  }
  html.bos-light-split-embed .technical-native-card > summary .step{
    flex:0 0 31px!important;
  }
  html.bos-light-split-embed .technical-native-card > summary .heading-copy{
    flex:1 1 auto!important;
    min-width:0!important;
  }
  html.bos-light-split-embed .technical-native-card > summary .summary-value{
    display:none!important;
  }
  html.bos-light-split-embed .technical-native-card .bos-tech-thumb{
    width:clamp(104px,30vw,124px)!important;
    border-radius:0 18px 18px 0!important;
    -webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
    mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.72) 18%,#000 38%,#000 100%)!important;
  }
  html.bos-light-split-embed .technical-native-card > .bft-body{
    padding:14px 15px 16px!important;
  }
}

@media(max-width:420px){
  html.bos-light-split-embed .technical-native-card > summary.card-heading.collapsible-heading{
    column-gap:8px!important;
    padding-left:10px!important;
    padding-right:calc(clamp(94px,29vw,112px) + 32px)!important;
  }
  html.bos-light-split-embed .technical-native-card .bos-tech-thumb{
    width:clamp(94px,29vw,112px)!important;
    border-radius:0 17px 17px 0!important;
  }
}
`;
  }

  function apply(){
    const doc=frameDoc();
    if(!doc||!doc.head)return false;
    ensureStyle(doc);
    let count=0;
    Object.entries(CARDS).forEach(([id,meta])=>{
      if(rebuildPanel(doc,id,meta))count++;
    });
    if(count)fit();
    return count===3;
  }

  function watch(){
    const doc=frameDoc();
    if(!doc||!doc.body||doc.documentElement.dataset.bosTechnicalApplicationsWatch==='1')return;
    doc.documentElement.dataset.bosTechnicalApplicationsWatch='1';
    const observer=new MutationObserver(()=>apply());
    observer.observe(doc.body,{childList:true,subtree:true});
  }

  function refresh(){
    apply();
    watch();
    [40,100,220,500,1000,1800,3000].forEach(ms=>setTimeout(()=>{
      apply();
      watch();
      fit();
    },ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
