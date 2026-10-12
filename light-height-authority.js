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

  function technicalBottomAnchor(doc){
    return doc.getElementById('bosTechFalloffDetails') || doc.getElementById('bosMiniPlateau');
  }

  function elementBottomInsideRoot(el,root){
    if(!el||!root)return 0;

    let top=0;
    let node=el;
    let guard=0;
    while(node&&node!==root&&guard<30){
      top+=Number(node.offsetTop)||0;
      node=node.offsetParent;
      guard++;
    }

    if(node===root){
      return top+(Number(el.offsetHeight)||0);
    }

    const rootRect=root.getBoundingClientRect();
    const rect=el.getBoundingClientRect();
    return Math.max(0,rect.bottom-rootRect.top);
  }

  function measureVisibleContent(){
    const doc=frameDoc();
    if(!doc)return {height:0,technical:false};
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return {height:0,technical:false};

    const win=doc.defaultView;
    const isTechnical=doc.documentElement.classList.contains('bos-light-section-technical');

    if(isTechnical){
      const anchor=technicalBottomAnchor(doc);
      if(anchor){
        const style=win?.getComputedStyle(anchor);
        if(style&&style.display!=='none'&&style.visibility!=='hidden'){
          const marginBottom=parseFloat(style.marginBottom||'0')||0;
          const SAFE_TECHNICAL_BOTTOM=20;
          const bottom=elementBottomInsideRoot(anchor,root);
          if(bottom>0){
            return {
              height:Math.max(1,Math.ceil(bottom+marginBottom+SAFE_TECHNICAL_BOTTOM)),
              technical:true
            };
          }
        }
      }
    }

    let bottom=0;
    Array.from(root.children).forEach(el=>{
      const style=win?.getComputedStyle(el);
      if(!style||style.display==='none'||style.visibility==='hidden')return;
      if((Number(el.offsetWidth)||0)===0&&(Number(el.offsetHeight)||0)===0)return;
      const marginBottom=parseFloat(style.marginBottom||'0')||0;
      bottom=Math.max(bottom,elementBottomInsideRoot(el,root)+marginBottom);
    });

    return {height:Math.max(1,Math.ceil(bottom+6)),technical:false};
  }

  function apply(){
    raf=0;
    const measured=measureVisibleContent();
    const required=measured.height;
    if(!required)return;

    const wantedMin=measured.technical?required+'px':'1px';
    if(frame.style.minHeight!==wantedMin)frame.style.minHeight=wantedMin;

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
        set(){ }
      });
    }catch(_){
      window.BOSExpoHostFit=schedule;
    }
    window.BOSLightFit=schedule;
  }

  function observeTechnicalAnchor(doc){
    if(!innerResizeObserver)return;
    const wrapper=doc.getElementById('bosTechFalloffDetails');
    const panel=doc.getElementById('bosMiniPlateau');
    if(wrapper){try{innerResizeObserver.observe(wrapper);}catch(_){ }}
    if(panel){try{innerResizeObserver.observe(panel);}catch(_){ }}
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
      observeTechnicalAnchor(doc);
    }

    innerMutationObserver=new MutationObserver(()=>{
      observeTechnicalAnchor(doc);
      schedule();
    });
    innerMutationObserver.observe(doc.documentElement,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['open','hidden','class']
    });

    doc.addEventListener('load',schedule,true);
    doc.addEventListener('toggle',schedule,true);
    doc.addEventListener('click',()=>{
      setTimeout(schedule,0);
      setTimeout(schedule,60);
      setTimeout(schedule,180);
    },true);

    installAuthority();
    [0,30,80,160,320,640,1000,1600].forEach(ms=>setTimeout(schedule,ms));
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
  [0,60,180,500,1000,1800].forEach(ms=>setTimeout(()=>{
    installAuthority();
    schedule();
  },ms));
})();
