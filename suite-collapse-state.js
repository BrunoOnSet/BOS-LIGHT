(function(){
  'use strict';

  /*
   * V2 : état des bulles BOS LIGHT.
   * - première ouverture : tout est replié
   * - ensuite : chaque bulle retrouve exactement son dernier état
   * - EXPO (05/06) est appliqué après l'initialisation interne du module,
   *   afin que son defaultOpen historique ne puisse plus réouvrir les bulles.
   */
  const STORAGE_KEY='bos-light-bubbles-v2';
  const DEFAULT_STATE={camera:false,light:false,fill:false,gel:false,dynamics:false,compensate:false};
  let state={...DEFAULT_STATE};

  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&typeof saved==='object'){
      Object.keys(DEFAULT_STATE).forEach(key=>{
        if(typeof saved[key]==='boolean')state[key]=saved[key];
      });
    }
  }catch(_){ }

  function save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){ }
  }

  function bindRootCamera(){
    const details=document.getElementById('sharedCameraDetails');
    if(!details||details.dataset.bosCollapseV2==='1')return;
    details.dataset.bosCollapseV2='1';
    details.open=!!state.camera;
    details.addEventListener('toggle',()=>{
      state.camera=details.open;
      save();
    });
  }

  function bindLightFrame(){
    const frame=document.getElementById('lightFrame');
    const doc=frame?.contentDocument;
    if(!doc)return false;

    const mapping=[['lightDetails','light'],['fillDetails','fill'],['gelDetails','gel']];
    let ready=true;

    mapping.forEach(([id,key])=>{
      const details=doc.getElementById(id);
      if(!details){ready=false;return;}
      if(details.dataset.bosCollapseV2==='1')return;

      details.dataset.bosCollapseV2='1';
      let userTouched=false;
      const applySaved=()=>{if(!userTouched)details.open=!!state[key];};

      applySaved();
      requestAnimationFrame(applySaved);
      setTimeout(applySaved,80);
      setTimeout(applySaved,250);

      details.addEventListener('toggle',()=>{
        userTouched=true;
        state[key]=details.open;
        save();
      });
    });
    return ready;
  }

  function expoParts(doc,panelId){
    const panel=doc.getElementById(panelId);
    if(!panel)return null;
    return {
      panel,
      button:panel.querySelector('.panel-collapse-btn'),
      content:panel.querySelector('.panel-collapse-content'),
      head:panelId==='readToolPanel'?panel.querySelector('.quick-inline-head'):panel.querySelector('.compact-section-head')
    };
  }

  function setExpoOpen(parts,open){
    if(!parts?.panel||!parts?.content)return;
    parts.panel.classList.toggle('collapsed',!open);
    parts.panel.classList.toggle('bos-suite-collapsed',!open);
    parts.content.hidden=!open;
    if(parts.button)parts.button.setAttribute('aria-expanded',open?'true':'false');
  }

  function isExpoOpen(parts){
    if(!parts?.panel||!parts?.content)return false;
    if(parts.content.hidden)return false;
    if(parts.panel.classList.contains('collapsed')||parts.panel.classList.contains('bos-suite-collapsed'))return false;
    if(parts.button&&parts.button.getAttribute('aria-expanded')==='false')return false;
    return true;
  }

  function bindExpoFrame(){
    const frame=document.getElementById('expoFrame');
    const doc=frame?.contentDocument;
    if(!doc)return false;

    const configs=[['readToolPanel','dynamics'],['simpleExpoPanel','compensate']];
    const entries=configs.map(([panelId,key])=>({key,parts:expoParts(doc,panelId)}));
    if(entries.some(entry=>!entry.parts?.button||!entry.parts?.content||!entry.parts?.head))return false;

    entries.forEach(entry=>{
      const {key,parts}=entry;
      if(parts.panel.dataset.bosCollapseV2==='1')return;
      parts.panel.dataset.bosCollapseV2='1';

      let armed=false;
      let userTouched=false;
      const applySaved=()=>{
        if(userTouched)return;
        setExpoOpen(parts,!!state[key]);
      };

      /* Le module EXPO ouvre historiquement 05/06 par défaut.
         On réapplique donc l'état mémorisé après toutes ses initialisations. */
      applySaved();
      requestAnimationFrame(applySaved);
      [60,160,360,700].forEach(ms=>setTimeout(applySaved,ms));

      const remember=()=>{
        userTouched=true;
        armed=true;
        setTimeout(()=>{
          state[key]=isExpoOpen(parts);
          save();
        },0);
      };

      /* Capture tout clic sur l'en-tête, quel que soit le chevron/bouton réellement utilisé. */
      parts.head.addEventListener('click',remember,true);

      /* Et couvre aussi clavier / changement de l'état par le composant natif EXPO. */
      const observer=new MutationObserver(()=>{
        if(!armed)return;
        state[key]=isExpoOpen(parts);
        save();
      });
      observer.observe(parts.panel,{attributes:true,attributeFilter:['class']});
      observer.observe(parts.content,{attributes:true,attributeFilter:['hidden']});
      observer.observe(parts.button,{attributes:true,attributeFilter:['aria-expanded']});
      parts.panel._bosCollapseV2Observer=observer;

      setTimeout(()=>{armed=true;},760);
    });

    return true;
  }

  function retry(fn,tries=80){
    let count=0;
    const run=()=>{
      if(fn())return;
      count+=1;
      if(count<tries)setTimeout(run,40);
    };
    run();
  }

  bindRootCamera();

  const lightFrame=document.getElementById('lightFrame');
  const expoFrame=document.getElementById('expoFrame');

  lightFrame?.addEventListener('load',()=>retry(bindLightFrame));
  expoFrame?.addEventListener('load',()=>retry(bindExpoFrame));

  if(lightFrame?.contentDocument?.readyState==='complete'||lightFrame?.contentDocument?.readyState==='interactive')retry(bindLightFrame);
  if(expoFrame?.contentDocument?.readyState==='complete'||expoFrame?.contentDocument?.readyState==='interactive')retry(bindExpoFrame);
})();
