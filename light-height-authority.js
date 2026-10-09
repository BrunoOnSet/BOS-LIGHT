(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  let raf=0;
  let innerResizeObserver=null;
  let innerMutationObserver=null;
  let frameStyleObserver=null;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function measureVisibleContent(){
    const doc=frameDoc();
    if(!doc)return 0;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return 0;

    const rootRect=root.getBoundingClientRect();
    const win=doc.defaultView;
    const isTechnical=doc.documentElement.classList.contains('bos-light-section-technical');

    // Dans FICHES TECHNIQUES, la hauteur est ancrée directement sur le bas
    // réel de FALL OFF. Cela garantit que son arrondi inférieur n'est jamais
    // rogné, sans dépendre de la hauteur précédente de l'iframe.
    if(isTechnical){
      const falloff=doc.getElementById('bosMiniPlateau');
      if(falloff){
        const style=win?.getComputedStyle(falloff);
        if(style&&style.display!=='none'&&style.visibility!=='hidden'){
          const rect=falloff.getBoundingClientRect();
          const marginBottom=parseFloat(style.marginBottom||'0')||0;
          const SAFE_TECHNICAL_BOTTOM=24;
          return Math.max(1,Math.ceil(rect.bottom-rootRect.top+marginBottom+SAFE_TECHNICAL_BOTTOM));
        }
      }
    }

    let bottom=rootRect.top;
    Array.from(root.children).forEach(el=>{
      const style=win?.getComputedStyle(el);
      if(!style||style.display==='none'||style.visibility==='hidden')return;
      const rect=el.getBoundingClientRect();
      if(rect.width===0&&rect.height===0)return;
      const marginBottom=parseFloat(style.marginBottom||'0')||0;
      bottom=Math.max(bottom,rect.bottom+marginBottom);
    });

    // Applications : petite marge fixe depuis le contenu réellement visible.
    return Math.max(1,Math.ceil(bottom-rootRect.top+6));
  }

  function apply(){
    raf=0;
    const required=measureVisibleContent();
    if(!required)return;

    if(frame.style.minHeight!=='1px')frame.style.minHeight='1px';

    const current=parseFloat(frame.style.height)||0;
    if(Math.abs(current-required)>1)frame.style.height=required+'px';
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(apply);
  }

  function installAuthority(){
    try{
      Object.defineProperty(window,'BOSExpoHostFit',{
        configurable:true,
        get(){return schedule;},
        set(){/* hauteur contrôlée ici uniquement */}
      });
    }catch(_){
      window.BOSExpoHostFit=schedule;
    }
  }

  function bindInner(){
    innerResizeObserver?.disconnect();
    innerMutationObserver?.disconnect();

    const doc=frameDoc();
    if(!doc)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;

    if('ResizeObserver' in window){
      innerResizeObserver=new ResizeObserver(schedule);
      innerResizeObserver.observe(root);
      Array.from(root.children).forEach(el=>innerResizeObserver.observe(el));
      const falloff=doc.getElementById('bosMiniPlateau');
      if(falloff)innerResizeObserver.observe(falloff);
    }

    innerMutationObserver=new MutationObserver(schedule);
    innerMutationObserver.observe(doc.documentElement,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['open','hidden','class']
    });

    doc.addEventListener('load',schedule,true);
    doc.addEventListener('toggle',schedule,true);
    doc.addEventListener('click',()=>setTimeout(schedule,0),true);

    installAuthority();
    [0,40,120,300,700,1200].forEach(ms=>setTimeout(schedule,ms));
  }

  frame.addEventListener('load',()=>{
    bindInner();
    schedule();
  });

  frameStyleObserver=new MutationObserver(schedule);
  frameStyleObserver.observe(frame,{attributes:true,attributeFilter:['style']});

  window.addEventListener('resize',schedule,{passive:true});

  installAuthority();
  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive')bindInner();
  [0,60,180,500,1000,1500].forEach(ms=>setTimeout(()=>{
    installAuthority();
    schedule();
  },ms));
})();
