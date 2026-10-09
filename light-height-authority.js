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

  function elementBottomInsideRoot(el,root){
    if(!el||!root)return 0;

    let top=0;
    let node=el;
    let guard=0;
    while(node&&node!==root&&guard<20){
      top+=Number(node.offsetTop)||0;
      node=node.offsetParent;
      guard++;
    }

    if(node===root){
      return top+(Number(el.offsetHeight)||0);
    }

    // Repli de sécurité si la chaîne offsetParent ne rejoint pas app-shell.
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

    // FICHES TECHNIQUES : FALL OFF est la référence absolue du bas de page.
    // offsetTop + offsetHeight mesure sa vraie boîte de layout et ne dépend pas
    // de la hauteur actuelle de l'iframe, donc aucun refresh ne peut la rogner.
    if(isTechnical){
      const falloff=doc.getElementById('bosMiniPlateau');
      if(falloff){
        const style=win?.getComputedStyle(falloff);
        if(style&&style.display!=='none'&&style.visibility!=='hidden'){
          const marginBottom=parseFloat(style.marginBottom||'0')||0;
          const SAFE_TECHNICAL_BOTTOM=32;
          const bottom=elementBottomInsideRoot(falloff,root);
          return {
            height:Math.max(1,Math.ceil(bottom+marginBottom+SAFE_TECHNICAL_BOTTOM)),
            technical:true
          };
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

    // En mode technique, min-height protège FALL OFF contre tout calcul trop
    // court provenant d'un autre script pendant le chargement. En Applications,
    // on la libère afin de ne jamais conserver un ancien grand espace vide.
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
    // Fall Off appelle BOSExpoHostFit pendant les interactions. Il est relié à
    // la même mesure stable que tout le reste de LIGHT.
    try{
      Object.defineProperty(window,'BOSExpoHostFit',{
        configurable:true,
        get(){return schedule;},
        set(){/* hauteur contrôlée ici uniquement */}
      });
    }catch(_){
      window.BOSExpoHostFit=schedule;
    }
    window.BOSLightFit=schedule;
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

    innerMutationObserver=new MutationObserver(()=>{
      // Si FALL OFF vient juste d'être injectée, on l'ajoute aussi à
      // ResizeObserver avant de recalculer.
      const falloff=doc.getElementById('bosMiniPlateau');
      if(falloff&&innerResizeObserver){
        try{innerResizeObserver.observe(falloff);}catch(_){ }
      }
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
