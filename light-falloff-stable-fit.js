(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function stableFit(){
    const doc=frameDoc();
    if(!doc)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;

    const rootRect=root.getBoundingClientRect();
    const win=doc.defaultView;
    let contentBottom=rootRect.top;

    Array.from(root.children).forEach(el=>{
      const style=win?.getComputedStyle(el);
      if(style?.display==='none'||style?.visibility==='hidden')return;
      const rect=el.getBoundingClientRect();
      if(rect.width===0&&rect.height===0)return;
      const marginBottom=parseFloat(style?.marginBottom||'0')||0;
      contentBottom=Math.max(contentBottom,rect.bottom+marginBottom);
    });

    // Marge fixe calculée depuis le contenu réel : elle ne dépend jamais de
    // la hauteur actuelle de l'iframe et ne peut donc pas s'accumuler.
    const SAFE_BOTTOM=28;
    const required=Math.max(1,Math.ceil(contentBottom-rootRect.top+SAFE_BOTTOM));

    if(Math.abs((parseFloat(frame.style.height)||0)-required)>1){
      frame.style.height=required+'px';
    }
  }

  function install(){
    // expo-mini-plateau appelle cette fonction à chaque déplacement du perso,
    // du projecteur ou du mur. On remplace le calcul cumulatif par celui-ci.
    window.BOSExpoHostFit=stableFit;
  }

  install();
  frame.addEventListener('load',()=>{
    [0,20,100,300,700].forEach(ms=>setTimeout(()=>{
      install();
      stableFit();
    },ms));
  });

  [0,60,180,500].forEach(ms=>setTimeout(()=>{
    install();
    stableFit();
  },ms));
})();
