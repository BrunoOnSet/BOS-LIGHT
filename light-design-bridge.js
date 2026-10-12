(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const DESIGN_VERSION='20261012-lock4';
  let activeDoc=null;
  let loadPromise=null;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function revealFrame(){
    requestAnimationFrame(()=>requestAnimationFrame(()=>frame.classList.add('bos-design-ready')));
  }

  function ensureFont(doc){
    let fonts=doc.getElementById('bosLightDesignFonts');
    if(!fonts){
      fonts=doc.createElement('link');
      fonts.id='bosLightDesignFonts';
      fonts.rel='stylesheet';
      doc.head.appendChild(fonts);
    }
    fonts.href='https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap';
  }

  function ensureStyle(doc,id,css){
    let style=doc.getElementById(id);
    if(!style){
      style=doc.createElement('style');
      style.id=id;
      doc.head.appendChild(style);
    }
    if(style.textContent!==css)style.textContent=css;
    return style;
  }

  function ensureCritical(doc){
    const css=`
:root{
  --bos-ink:#15191B;
  --bos-muted:#737B7E;
  --bos-faint:#98A0A3;
  --bos-accent:#2F5B66;
  --bos-accent-2:#547984;
  --bos-accent-soft:#E8EFF1;
}
html[data-theme="dark"],body.dark{
  --bos-ink:#F3F5F5;
  --bos-muted:#A2ABAE;
  --bos-faint:#7D878A;
  --bos-accent:#88AEB7;
  --bos-accent-2:#AAC4CA;
  --bos-accent-soft:rgba(136,174,183,.14);
}
html,body,body *,button,input,select,textarea{
  font-family:"Instrument Sans",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
}
.shared-heading-copy h2,.heading-copy h2,.card-heading h2,.bft-title strong{color:var(--bos-ink)!important}
.shared-heading-copy p,.heading-copy p,.bft-title small{color:var(--bos-muted)!important}
.summary-value,.light-summary{color:var(--bos-accent-2)!important}
.chevron,.shared-chevron,.bft-chevron{color:var(--bos-faint)!important}
.add-dialog[open]{
  position:fixed!important;
  left:50%!important;
  right:auto!important;
  bottom:auto!important;
  margin:0!important;
  transform:translateX(-50%)!important;
}
`;
    return ensureStyle(doc,'bosLightDesignCritical',css);
  }

  function removeLegacyLinks(doc){
    doc.getElementById('bosLightDesignCss')?.remove();
    doc.getElementById('bosLightBubblesCss')?.remove();
  }

  async function fetchCss(path){
    const response=await fetch(`${path}?v=${DESIGN_VERSION}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status} pour ${path}`);
    return response.text();
  }

  function getSafeViewportTop(){
    let safeTop=12;
    const stickyHeader=document.querySelector('.topbar');
    if(stickyHeader){
      const headerRect=stickyHeader.getBoundingClientRect();
      const headerIsVisible=headerRect.bottom>0&&headerRect.top<window.innerHeight;
      if(headerIsVisible)safeTop=Math.max(safeTop,headerRect.bottom+14);
    }
    return safeTop;
  }

  function positionOpenDialogs(doc){
    if(doc!==frameDoc())return;
    const rect=frame.getBoundingClientRect();
    const safeViewportTop=getSafeViewportTop();
    const viewportTop=Math.max(12,safeViewportTop-rect.top);
    const viewportBottom=Math.min(rect.height-12,-rect.top+window.innerHeight-12);
    const available=Math.max(180,viewportBottom-viewportTop);

    doc.querySelectorAll('dialog.add-dialog[open]').forEach(dialog=>{
      dialog.style.setProperty('top',`${Math.round(viewportTop)}px`,'important');
      dialog.style.setProperty('left','50%','important');
      dialog.style.setProperty('right','auto','important');
      dialog.style.setProperty('bottom','auto','important');
      dialog.style.setProperty('margin','0','important');
      dialog.style.setProperty('transform','translateX(-50%)','important');
      const shell=dialog.querySelector('.dialog-shell');
      if(shell){
        shell.style.setProperty('max-height',`${Math.max(180,Math.min(720,Math.floor(available)))}px`,'important');
        shell.style.setProperty('overflow','auto','important');
      }
    });
  }

  function bindDialogPositioning(doc){
    if(doc.documentElement.dataset.bosDialogPositioning==='1')return;
    doc.documentElement.dataset.bosDialogPositioning='1';

    const refreshPosition=()=>requestAnimationFrame(()=>positionOpenDialogs(doc));
    const observer=new MutationObserver(mutations=>{
      if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='open'))refreshPosition();
    });
    observer.observe(doc.documentElement,{subtree:true,attributes:true,attributeFilter:['open']});

    doc.addEventListener('click',()=>{
      setTimeout(()=>positionOpenDialogs(doc),0);
      setTimeout(()=>positionOpenDialogs(doc),60);
    },true);
  }

  async function loadFullDesign(doc){
    try{
      const [designCss,bubblesCss]=await Promise.all([
        fetchCss('/BOS-LIGHT/light-design.css'),
        fetchCss('/BOS-LIGHT/light-bubbles.css')
      ]);
      if(doc!==frameDoc())return;
      ensureStyle(doc,'bosLightDesignInline',designCss);
      ensureStyle(doc,'bosLightBubblesInline',bubblesCss);
      enforceOrder(doc);
      [40,120,300,700,1400,2400].forEach(ms=>setTimeout(()=>enforceOrder(doc),ms));
      revealFrame();
    }catch(err){
      console.warn('[BOS LIGHT design]',err);
      enforceOrder(doc);
      revealFrame();
    }
  }

  function enforceOrder(doc){
    if(doc!==frameDoc()||!doc.head)return;
    const critical=doc.getElementById('bosLightDesignCritical');
    const design=doc.getElementById('bosLightDesignInline');
    const bubbles=doc.getElementById('bosLightBubblesInline');
    if(critical)doc.head.appendChild(critical);
    if(design)doc.head.appendChild(design);
    if(bubbles)doc.head.appendChild(bubbles);
    positionOpenDialogs(doc);
    requestAnimationFrame(()=>window.BOSLightFit?.());
  }

  function inject(){
    const doc=frameDoc();
    if(!doc||!doc.head)return false;

    if(doc!==activeDoc){
      activeDoc=doc;
      loadPromise=null;
    }

    ensureFont(doc);
    removeLegacyLinks(doc);
    ensureCritical(doc);
    bindDialogPositioning(doc);
    enforceOrder(doc);

    if(!loadPromise)loadPromise=loadFullDesign(doc);
    return true;
  }

  function refresh(){
    frame.classList.remove('bos-design-ready');
    inject();
    [40,120,300,700,1400,2400].forEach(ms=>setTimeout(()=>{
      inject();
      const doc=frameDoc();
      if(doc)enforceOrder(doc);
    },ms));
  }

  window.addEventListener('scroll',()=>{
    const doc=frameDoc();
    if(doc)positionOpenDialogs(doc);
  },{passive:true});
  window.addEventListener('resize',()=>{
    const doc=frameDoc();
    if(doc)positionOpenDialogs(doc);
  });

  frame.addEventListener('load',refresh);
  refresh();
})();
