(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const appUrl=path=>window.BOS_PATHS?.url(path)||new URL(String(path||'').replace(/^\/+/,''),new URL('./',document.baseURI)).href;

  const CARDS=[
    {panelId:'bosThreePointPanel',wrapperId:'bosTechThreePointDetails',number:'01',title:'POSITION',subtitle:'Système 3 points',thumb:appUrl('assets/thumb-tech-3points.webp?v=20261012-3')},
    {panelId:'bosShadowHardnessPanel',wrapperId:'bosTechShadowDetails',number:'02',title:'SHADOWS',subtitle:'Dureté des ombres',thumb:appUrl('assets/thumb-tech-shadow.webp?v=20261012-3')},
    {panelId:'bosMiniPlateau',wrapperId:'bosTechFalloffDetails',number:'03',title:'FALL OFF',subtitle:'Gestion du contraste',thumb:appUrl('assets/thumb-tech-falloff.webp?v=20261012-3')}
  ];

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function fit(){
    if(typeof window.BOSLightFit==='function')window.BOSLightFit();
  }

  function applicationSummaryTemplate(doc){
    return doc.querySelector('#cameraDetails > summary.card-heading.collapsible-heading') ||
           doc.querySelector('details.collapsible-card > summary.card-heading.collapsible-heading');
  }

  function makeSummary(doc,meta){
    const source=applicationSummaryTemplate(doc);
    const summary=source ? source.cloneNode(true) : doc.createElement('summary');

    summary.className='card-heading collapsible-heading';
    summary.removeAttribute('id');
    summary.removeAttribute('aria-expanded');
    summary.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));

    if(!source){
      summary.innerHTML='<span class="step"></span><div class="heading-copy"><h2></h2><p></p></div><div class="summary-value light-summary"></div><span class="chevron">⌄</span>';
    }

    let step=summary.querySelector('.step');
    if(!step){step=doc.createElement('span');step.className='step';summary.prepend(step);}
    step.textContent=meta.number;

    let copy=summary.querySelector('.heading-copy');
    if(!copy){copy=doc.createElement('div');copy.className='heading-copy';summary.appendChild(copy);}
    let h2=copy.querySelector('h2');
    if(!h2){h2=doc.createElement('h2');copy.prepend(h2);}
    let p=copy.querySelector('p');
    if(!p){p=doc.createElement('p');copy.appendChild(p);}
    h2.textContent=meta.title;
    p.textContent=meta.subtitle;

    let value=summary.querySelector('.summary-value');
    if(!value){value=doc.createElement('div');value.className='summary-value light-summary';summary.appendChild(value);}
    value.textContent='';
    value.setAttribute('aria-hidden','true');

    let chevron=summary.querySelector('.chevron');
    if(!chevron){chevron=doc.createElement('span');chevron.className='chevron';summary.appendChild(chevron);}
    chevron.textContent='⌄';
    chevron.setAttribute('aria-hidden','true');

    summary.querySelectorAll('.bos-tech-thumb').forEach(img=>img.remove());
    const img=doc.createElement('img');
    img.className='bos-tech-thumb';
    img.src=meta.thumb;
    img.alt='';
    img.decoding='async';
    img.setAttribute('aria-hidden','true');
    img.addEventListener('load',fit);
    summary.appendChild(img);

    return summary;
  }

  function ensureStyle(doc){
    let style=doc.getElementById('bosTechnicalExactApplicationsShell');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalExactApplicationsShell';
      doc.head.appendChild(style);
    }

    style.textContent=`
/* Les fiches techniques utilisent la vraie coque <details> Applications. */
html.bos-light-split-embed .technical-application-card{
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}
html.bos-light-split-embed .technical-application-card > summary.card-heading.collapsible-heading{
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
  position:relative!important;
  overflow:hidden!important;
}
html.bos-light-split-embed .technical-application-card > summary .heading-copy,
html.bos-light-split-embed .technical-application-card > summary .summary-value{
  min-width:0!important;
}

/*
  Chevron Fiches techniques — COPIE EXACTE du chevron Applications.
  Même dimensions, même couleur, même liseré blanc, même absence de fond/contour.
*/
html.bos-light-split-embed.bos-light-section-technical .technical-application-card > summary.collapsible-heading > .chevron{
  right:14px!important;
  width:24px!important;
  height:24px!important;
  display:grid!important;
  place-items:center!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  color:var(--bos-accent)!important;
  box-shadow:none!important;
  text-shadow:
    -.6px 0 rgba(255,255,255,.95),
    .6px 0 rgba(255,255,255,.95),
    0 -.6px rgba(255,255,255,.95),
    0 .6px rgba(255,255,255,.95),
    0 0 2px rgba(255,255,255,.72)!important;
  z-index:5!important;
}

/* Le panneau technique historique devient uniquement le contenu de la bulle. */
html.bos-light-split-embed .technical-application-card > .technical-source-panel{
  display:block!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
  overflow:visible!important;
  box-sizing:border-box!important;
}
html.bos-light-split-embed .technical-application-card > .technical-source-panel > .bft-head{
  display:none!important;
}
html.bos-light-split-embed .technical-application-card > .technical-source-panel > .bft-body{
  display:block!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

html.bos-light-split-embed.bos-light-section-technical #bosTechThreePointDetails{margin-top:0!important}
html.bos-light-split-embed.bos-light-section-applications .technical-application-card{display:none!important}
html.bos-light-split-embed.bos-light-section-technical .technical-application-card{display:block!important}

/* Aucun élément interne ne doit agrandir la largeur du téléphone. */
html.bos-light-split-embed .technical-application-card .bft-body,
html.bos-light-split-embed .technical-application-card .bft-reference-images,
html.bos-light-split-embed .technical-application-card .bft-stage,
html.bos-light-split-embed .technical-application-card .bft-readout,
html.bos-light-split-embed .technical-application-card .bft-falloff-reference,
html.bos-light-split-embed .technical-application-card .bft-falloff-post-images,
html.bos-light-split-embed .technical-application-card img{
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

#bosTechnicalMountMarker{display:none!important}

@media(max-width:560px){
  html.bos-light-split-embed .technical-application-card,
  html.bos-light-split-embed .technical-application-card > summary,
  html.bos-light-split-embed .technical-application-card > .technical-source-panel{
    width:100%!important;
    max-width:100%!important;
  }
}
`;
  }

  function ensureMountMarker(doc){
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return null;

    let marker=doc.getElementById('bosTechnicalMountMarker');
    if(!marker){
      marker=doc.createElement('div');
      marker.id='bosTechnicalMountMarker';
      marker.hidden=true;
      const gel=doc.getElementById('gelDetails');
      if(gel&&gel.parentElement===root)gel.insertAdjacentElement('afterend',marker);
      else root.appendChild(marker);
    }else if(marker.parentElement!==root){
      root.appendChild(marker);
    }
    return {root,marker};
  }

  function unwrapObsoleteNativeCard(doc,meta){
    const native=doc.getElementById(meta.panelId);
    if(!native||native.tagName!=='DETAILS'||native.dataset.bosApplicationsCard!=='1')return native;

    const body=native.querySelector(':scope > .bft-body');
    if(!body)return native;

    const section=doc.createElement('section');
    section.id=meta.panelId;
    section.className='technical-source-panel';
    section.setAttribute('aria-label',native.getAttribute('aria-label')||meta.title);

    const oldHead=doc.createElement('button');
    oldHead.type='button';
    oldHead.className='bft-head';
    oldHead.hidden=true;
    section.appendChild(oldHead);
    section.appendChild(body);
    native.replaceWith(section);
    return section;
  }

  function ensureWrapper(doc,meta){
    let panel=doc.getElementById(meta.panelId);
    if(!panel)return false;

    panel=unwrapObsoleteNativeCard(doc,meta)||panel;

    let wrapper=doc.getElementById(meta.wrapperId);
    if(!wrapper){
      wrapper=doc.createElement('details');
      wrapper.id=meta.wrapperId;
      wrapper.className='controls-card collapsible-card technical-application-card';
      wrapper.dataset.bosTechnicalWrapper='1';
      wrapper.setAttribute('aria-label',`${meta.title} — ${meta.subtitle}`);
      wrapper.appendChild(makeSummary(doc,meta));
      panel.parentNode.insertBefore(wrapper,panel);
      wrapper.appendChild(panel);
      wrapper.addEventListener('toggle',()=>{
        requestAnimationFrame(fit);
        setTimeout(fit,80);
      });
    }else if(panel.parentElement!==wrapper){
      wrapper.appendChild(panel);
    }

    panel.classList.add('technical-source-panel');
    panel.classList.remove('bmp-collapsed');
    panel.querySelectorAll('img').forEach(img=>{
      if(img.dataset.bosTechnicalFitBound==='1')return;
      img.dataset.bosTechnicalFitBound='1';
      img.addEventListener('load',fit);
    });
    return true;
  }

  function mountWrappersTopLevel(doc){
    const mount=ensureMountMarker(doc);
    if(!mount)return false;
    const {root,marker}=mount;

    let cursor=marker;
    for(let i=CARDS.length-1;i>=0;i--){
      const wrapper=doc.getElementById(CARDS[i].wrapperId);
      if(!wrapper)continue;
      if(wrapper.parentElement!==root||wrapper.nextElementSibling!==cursor){
        root.insertBefore(wrapper,cursor);
      }
      cursor=wrapper;
    }
    return true;
  }

  function apply(){
    const doc=frameDoc();
    if(!doc||!doc.head)return false;
    ensureStyle(doc);
    let ready=0;
    CARDS.forEach(meta=>{if(ensureWrapper(doc,meta))ready++;});
    mountWrappersTopLevel(doc);
    if(ready)fit();
    return ready===CARDS.length;
  }

  function watch(){
    const doc=frameDoc();
    if(!doc||!doc.body||doc.documentElement.dataset.bosTechnicalExactWatch==='1')return;
    doc.documentElement.dataset.bosTechnicalExactWatch='1';
    const observer=new MutationObserver(()=>apply());
    observer.observe(doc.body,{childList:true,subtree:true});
  }

  function refresh(){
    apply();
    watch();
    [40,100,220,500,1000,1800,3000].forEach(ms=>setTimeout(()=>{apply();watch();fit();},ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
