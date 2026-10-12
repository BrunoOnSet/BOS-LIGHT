(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const CARDS={
    bosThreePointPanel:{number:'01',title:'POSITION',subtitle:'Système 3 points'},
    bosShadowHardnessPanel:{number:'02',title:'SHADOWS',subtitle:'Dureté des ombres'},
    bosMiniPlateau:{number:'03',title:'FALL OFF',subtitle:'Gestion du contraste'}
  };

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function fit(){
    if(typeof window.BOSLightFit==='function')window.BOSLightFit();
  }

  function makeSummary(doc,meta){
    const summary=doc.createElement('summary');
    summary.className='card-heading collapsible-heading';
    summary.innerHTML=`
      <span class="step">${meta.number}</span>
      <div class="heading-copy">
        <h2>${meta.title}</h2>
        <p>${meta.subtitle}</p>
      </div>
      <span class="chevron" aria-hidden="true">⌄</span>`;
    return summary;
  }

  function rebuildPanel(doc,id,meta){
    const old=doc.getElementById(id);
    if(!old)return false;

    if(old.tagName==='DETAILS'&&old.dataset.bosApplicationsCard==='1')return true;

    const body=old.querySelector(':scope > .bft-body')||old.querySelector('.bft-body');
    if(!body)return false;

    /*
      Le script Fall Off d'origine garde une référence vers son ancien conteneur.
      On le laisse logiquement "ouvert" avant de le détacher : son calcul de resize
      continue ainsi à fonctionner sur les éléments déplacés dans le nouveau <details>.
    */
    old.classList.remove('bmp-collapsed');

    const details=doc.createElement('details');
    details.id=id;
    details.className='controls-card collapsible-card technical-native-card';
    details.dataset.bosApplicationsCard='1';
    details.setAttribute('aria-label',`${meta.title} — ${meta.subtitle}`);
    details.appendChild(makeSummary(doc,meta));
    details.appendChild(body);

    old.replaceWith(details);

    details.addEventListener('toggle',()=>{
      requestAnimationFrame(()=>{
        if(details.open)doc.defaultView?.dispatchEvent(new Event('resize'));
        fit();
      });
      setTimeout(()=>{
        if(details.open)doc.defaultView?.dispatchEvent(new Event('resize'));
        fit();
      },80);
    });
    details.querySelectorAll('img').forEach(img=>img.addEventListener('load',fit));
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
/* Mobile : aucune largeur interne ne peut dépasser le viewport de l'iframe. */
html.bos-light-split-embed,
html.bos-light-split-embed body,
html.bos-light-split-embed .app-shell{
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:hidden!important;
}
html.bos-light-split-embed .technical-native-card,
html.bos-light-split-embed .technical-native-card > summary,
html.bos-light-split-embed .technical-native-card > .bft-body{
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

/* La coque et la tête sont exactement celles des cartes Applications. */
html.bos-light-split-embed .technical-native-card > .bft-body{
  padding:16px 18px 18px;
}
html.bos-light-split-embed .technical-native-card .heading-copy{
  min-width:0!important;
}
html.bos-light-split-embed .technical-native-card .heading-copy h2,
html.bos-light-split-embed .technical-native-card .heading-copy p{
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

@media(max-width:520px){
  html.bos-light-split-embed .technical-native-card > .bft-body{
    padding:14px 15px 16px;
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
    },ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
