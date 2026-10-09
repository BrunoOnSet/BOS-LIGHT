(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  let innerResizeObserver=null;
  let innerMutationObserver=null;
  let frameMutationObserver=null;
  let raf=0;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(applyMinHeight);
  }

  function applyMinHeight(){
    const doc=frameDoc();
    if(!doc)return;

    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;

    const isTechnical=doc.documentElement.classList.contains('bos-light-section-technical');

    if(!isTechnical){
      frame.style.minHeight='1px';
      return;
    }

    const lastCard=doc.getElementById('bosMiniPlateau');
    if(!lastCard)return;

    const rootRect=root.getBoundingClientRect();
    const cardRect=lastCard.getBoundingClientRect();
    const style=doc.defaultView?.getComputedStyle(lastCard);
    const marginBottom=parseFloat(style?.marginBottom||'0')||0;

    // Le minimum est basé directement sur le bas réel de la fiche 07,
    // indépendamment des autres calculs de hauteur de LIGHT.
    const SAFE_BOTTOM=28;
    const required=Math.ceil(cardRect.bottom-rootRect.top+marginBottom+SAFE_BOTTOM);

    if(required>0){
      frame.style.minHeight=required+'px';
      const current=parseFloat(frame.style.height)||0;
      if(current<required)frame.style.height=required+'px';
    }
  }

  function bindInnerObservers(){
    innerResizeObserver?.disconnect();
    innerMutationObserver?.disconnect();

    const doc=frameDoc();
    if(!doc)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;

    if('ResizeObserver' in window){
      innerResizeObserver=new ResizeObserver(schedule);
      innerResizeObserver.observe(root);
      const lastCard=doc.getElementById('bosMiniPlateau');
      if(lastCard)innerResizeObserver.observe(lastCard);
    }

    innerMutationObserver=new MutationObserver(schedule);
    innerMutationObserver.observe(doc.documentElement,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['class','style','open','hidden']
    });

    doc.addEventListener('click',()=>{
      setTimeout(schedule,0);
      setTimeout(schedule,80);
      setTimeout(schedule,220);
    },true);

    [0,60,180,500,1000].forEach(ms=>setTimeout(schedule,ms));
  }

  frame.addEventListener('load',()=>{
    bindInnerObservers();
    schedule();
  });

  // Si un autre script réécrit height après nous, min-height reste prioritaire.
  // On recalcule malgré tout au cas où le contenu de la fiche 07 ait changé.
  frameMutationObserver=new MutationObserver(schedule);
  frameMutationObserver.observe(frame,{attributes:true,attributeFilter:['style']});

  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive'){
    bindInnerObservers();
    schedule();
  }
})();
