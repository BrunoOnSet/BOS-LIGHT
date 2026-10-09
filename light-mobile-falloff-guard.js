(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  const isMobile=()=>window.matchMedia?.('(max-width: 760px)').matches===true;
  let raf=0;
  let innerObserver=null;
  let resizeObserver=null;
  let frameObserver=null;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function measureFalloffBottom(doc){
    const root=doc.querySelector('.app-shell')||doc.body;
    const falloff=doc.getElementById('bosMiniPlateau');
    if(!root||!falloff)return 0;

    const style=doc.defaultView?.getComputedStyle(falloff);
    if(!style||style.display==='none'||style.visibility==='hidden')return 0;

    const rootRect=root.getBoundingClientRect();
    const falloffRect=falloff.getBoundingClientRect();
    const marginBottom=parseFloat(style.marginBottom||'0')||0;

    // Deux mesures indépendantes : la géométrie visuelle et la géométrie de layout.
    // On garde la plus grande afin de couvrir les particularités de Safari/Chrome mobile.
    const rectBottom=Math.max(0,falloffRect.bottom-rootRect.top);

    let offsetBottom=0;
    let top=0;
    let node=falloff;
    let guard=0;
    while(node&&node!==root&&guard<30){
      top+=Number(node.offsetTop)||0;
      node=node.offsetParent;
      guard++;
    }
    if(node===root)offsetBottom=top+(Number(falloff.offsetHeight)||0);

    const SAFE_MOBILE_BOTTOM=72;
    return Math.ceil(Math.max(rectBottom,offsetBottom)+marginBottom+SAFE_MOBILE_BOTTOM);
  }

  function apply(){
    raf=0;
    if(!isMobile())return;

    const doc=frameDoc();
    if(!doc)return;
    const technical=doc.documentElement.classList.contains('bos-light-section-technical');

    if(!technical){
      // On libère uniquement notre verrou mobile en revenant sur Applications.
      if(frame.dataset.bosMobileFalloffGuard==='1'){
        frame.style.removeProperty('min-height');
        frame.dataset.bosMobileFalloffGuard='0';
      }
      return;
    }

    const required=measureFalloffBottom(doc);
    if(!required)return;

    frame.dataset.bosMobileFalloffGuard='1';
    frame.style.setProperty('min-height',required+'px','important');

    const current=parseFloat(frame.style.height)||0;
    if(current<required){
      frame.style.setProperty('height',required+'px','important');
    }
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(apply);
  }

  function bind(){
    innerObserver?.disconnect();
    resizeObserver?.disconnect();

    const doc=frameDoc();
    if(!doc)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;

    innerObserver=new MutationObserver(schedule);
    innerObserver.observe(doc.documentElement,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['class','open','hidden','style']
    });

    if('ResizeObserver' in window){
      resizeObserver=new ResizeObserver(schedule);
      resizeObserver.observe(root);
      const falloff=doc.getElementById('bosMiniPlateau');
      if(falloff)resizeObserver.observe(falloff);
    }

    doc.fonts?.ready?.then(schedule).catch(()=>{});
    [0,50,120,250,500,900,1400,2200,3200].forEach(ms=>setTimeout(schedule,ms));
  }

  frame.addEventListener('load',()=>{
    bind();
    schedule();
  });

  // Si un autre script tente de réduire l'iframe après notre calcul, on remet
  // immédiatement le verrou mobile sans augmenter cumulativement la hauteur.
  frameObserver=new MutationObserver(()=>{
    if(frame.dataset.bosMobileFalloffGuard==='1')schedule();
  });
  frameObserver.observe(frame,{attributes:true,attributeFilter:['style']});

  window.addEventListener('resize',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});

  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive')bind();
  [0,80,180,400,800,1600,2800].forEach(ms=>setTimeout(()=>{
    bind();
    schedule();
  },ms));
})();
