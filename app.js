(function(){
  'use strict';
  const THEME_KEY='bos-light-suite-theme-v1';
  const INSTALLED_KEY='bos-light-suite-installed-v1';
  let deferredInstallPrompt=null;
  const $=id=>document.getElementById(id);
  function standalone(){return window.matchMedia?.('(display-mode: standalone)').matches===true || window.navigator.standalone===true;}
  function ios(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
  function frameEls(){return [$('lightFrame'),$('expoFrame')].filter(Boolean);}
  function syncFrameTheme(value){
    frameEls().forEach(frame=>{
      try{
        const doc=frame.contentDocument;
        if(doc?.documentElement)doc.documentElement.dataset.theme=value;
      }catch(_){}
    });
  }
  function fitFrame(frame){
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      const h=Math.max(
        doc.documentElement?.scrollHeight||0,
        doc.body?.scrollHeight||0,
        doc.documentElement?.offsetHeight||0,
        doc.body?.offsetHeight||0
      );
      if(h>0)frame.style.height=`${h}px`;
    }catch(_){}
  }
  function bindFrame(frame){
    if(!frame)return;
    frame.addEventListener('load',()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc)return;
        doc.documentElement.dataset.theme=document.documentElement.dataset.theme||'light';
        fitFrame(frame);
        const resize=()=>requestAnimationFrame(()=>fitFrame(frame));
        if('ResizeObserver' in window){
          const ro=new ResizeObserver(resize);
          ro.observe(doc.documentElement);
          if(doc.body)ro.observe(doc.body);
          frame._bosResizeObserver=ro;
        }
        const mo=new MutationObserver(resize);
        mo.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,characterData:false});
        frame._bosMutationObserver=mo;
        doc.addEventListener('click',()=>setTimeout(resize,0),true);
        doc.addEventListener('toggle',()=>setTimeout(resize,0),true);
        window.setTimeout(resize,150);
        window.setTimeout(resize,600);
      }catch(_){}
    });
  }
  function theme(){
    const shared=window.BOSSharedState?.read?.();
    return shared?.theme==='dark'||shared?.theme==='light'?shared.theme:(localStorage.getItem(THEME_KEY)||'light');
  }
  function applyTheme(value){
    const t=value==='dark'?'dark':'light';
    document.documentElement.dataset.theme=t;
    localStorage.setItem(THEME_KEY,t);
    window.BOSSharedState?.patch?.({theme:t},'light-suite');
    $('themeBtn').textContent=t==='dark'?'LIGHT':'DARK';
    syncFrameTheme(t);
    $('themeColor')?.setAttribute('content',t==='dark'?'#0B0C0E':'#F3F1EC');
  }
  function updateInstall(){
    const row=$('installAppRow');if(!row)return;
    const remembered=localStorage.getItem(INSTALLED_KEY)==='1';
    if(standalone()){localStorage.setItem(INSTALLED_KEY,'1');row.hidden=true;return;}
    row.hidden=remembered;
  }
  function installHelp(){
    const dlg=$('installDialog'),body=$('installHelpBody'),intro=$('installHelpText');
    if(!dlg||!body)return;
    if(ios()){
      if(intro)intro.textContent='Installation sur iPhone / iPad';
      body.innerHTML='<p><strong>Safari :</strong> touchez le bouton <strong>Partager</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.</p><p>Une fois LIGHT lancé depuis son icône, ce bouton disparaît automatiquement.</p>';
    }else{
      if(intro)intro.textContent='Installation depuis votre navigateur';
      body.innerHTML='<p>Ouvrez le menu du navigateur puis choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p><p>Une fois LIGHT lancé comme application, ce bouton disparaît automatiquement.</p>';
    }
    dlg.showModal();
  }
  function bind(){
    frameEls().forEach(bindFrame);
    $('themeBtn')?.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
    const pd=$('projectDialog');$('projectContactBtn')?.addEventListener('click',()=>pd?.showModal());pd?.addEventListener('click',e=>{if(e.target===pd)pd.close();});
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;localStorage.removeItem(INSTALLED_KEY);updateInstall();});
    window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;localStorage.setItem(INSTALLED_KEY,'1');updateInstall();});
    $('installAppBtn')?.addEventListener('click',async()=>{
      if(deferredInstallPrompt){const p=deferredInstallPrompt;deferredInstallPrompt=null;try{await p.prompt();const c=await p.userChoice;if(c?.outcome==='accepted')localStorage.setItem(INSTALLED_KEY,'1');}catch(_){}updateInstall();return;}installHelp();
    });
    window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change',updateInstall);
  }
  applyTheme(theme());
  bind();
  updateInstall();
  window.BOSNavigation?.restoreCockpitPosition?.();
  if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v=1',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{}),{once:true});
})();
