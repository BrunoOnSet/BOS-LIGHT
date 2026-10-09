(function(){
  'use strict';

  const VERSION='2.0.4';
  const THEME_KEY='bos-light-split-theme-v1';
  const BUBBLE_KEY='bos-light-split-bubbles-v1';
  const INSTALLED_KEY='bos-light-split-installed-v1';
  const frame=document.getElementById('lightFrame');
  const themeBtn=document.getElementById('themeBtn');
  const resetBtn=document.getElementById('suiteResetBtn');
  const applicationsModeBtn=document.getElementById('applicationsModeBtn');
  const technicalModeBtn=document.getElementById('technicalModeBtn');
  const installRow=document.getElementById('installAppRow');
  const installBtn=document.getElementById('installAppBtn');
  const installDialog=document.getElementById('installDialog');
  const installHelpText=document.getElementById('installHelpText');
  const installHelpBody=document.getElementById('installHelpBody');
  const projectBtn=document.getElementById('projectContactBtn');
  const projectDialog=document.getElementById('projectDialog');
  const themeColor=document.getElementById('themeColor');
  let deferredInstallPrompt=null;
  let sectionMode='applications';

  function standalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches===true||window.navigator.standalone===true;
  }
  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  }

  function savedBubbles(){
    const base={camera:false,light:false,fill:false,gel:false};
    try{
      const saved=JSON.parse(localStorage.getItem(BUBBLE_KEY)||'null');
      if(saved&&typeof saved==='object')Object.keys(base).forEach(k=>{if(typeof saved[k]==='boolean')base[k]=saved[k];});
    }catch(_){ }
    return base;
  }
  const bubbleState=savedBubbles();
  function saveBubbles(){try{localStorage.setItem(BUBBLE_KEY,JSON.stringify(bubbleState));}catch(_){}}

  function frameDoc(){try{return frame?.contentDocument||null;}catch(_){return null;}}

  function fit(){
    const doc=frameDoc();
    if(!doc||!frame)return;
    const root=doc.querySelector('.app-shell')||doc.body;
    if(!root)return;
    const rect=root.getBoundingClientRect();
    const h=Math.max(1,Math.ceil(rect.height));
    if(Math.abs((parseFloat(frame.style.height)||0)-h)>1)frame.style.height=h+'px';
  }

  function applySectionMode(mode){
    sectionMode=mode==='technical'?'technical':'applications';
    const applicationsActive=sectionMode==='applications';
    applicationsModeBtn?.classList.toggle('active',applicationsActive);
    technicalModeBtn?.classList.toggle('active',!applicationsActive);
    applicationsModeBtn?.setAttribute('aria-pressed',String(applicationsActive));
    technicalModeBtn?.setAttribute('aria-pressed',String(!applicationsActive));

    const doc=frameDoc();
    if(doc){
      doc.documentElement.classList.toggle('bos-light-section-applications',applicationsActive);
      doc.documentElement.classList.toggle('bos-light-section-technical',!applicationsActive);
      doc.documentElement.dataset.bosLightSection=sectionMode;
    }

    requestAnimationFrame(fit);
    setTimeout(fit,40);
    setTimeout(fit,180);
  }

  function syncCollapsedBubbleHeights(doc){
    const referenceDetails=doc.getElementById('cameraDetails');
    const referenceSummary=referenceDetails?.querySelector(':scope > summary.collapsible-heading');
    if(!referenceDetails||!referenceSummary)return;

    let headingHeight=0;
    let cardHeight=0;

    if(!referenceDetails.open){
      headingHeight=referenceSummary.getBoundingClientRect().height;
      cardHeight=referenceDetails.getBoundingClientRect().height;
    }else{
      const width=Math.max(1,referenceDetails.getBoundingClientRect().width);
      const probe=doc.createElement('details');
      probe.className=referenceDetails.className;
      probe.style.cssText=`position:absolute!important;visibility:hidden!important;pointer-events:none!important;left:-9999px!important;top:0!important;width:${width}px!important;margin:0!important;`;
      const clone=referenceSummary.cloneNode(true);
      probe.appendChild(clone);
      doc.body.appendChild(probe);
      headingHeight=clone.getBoundingClientRect().height;
      cardHeight=probe.getBoundingClientRect().height;
      probe.remove();
    }

    if(headingHeight>0){
      doc.documentElement.style.setProperty('--bos-light-collapsed-heading-height',`${Math.ceil(headingHeight)}px`);
    }
    if(cardHeight>0){
      doc.documentElement.style.setProperty('--bos-light-collapsed-card-height',`${Math.ceil(cardHeight)}px`);
    }
  }

  function applyTheme(theme){
    const value=theme==='dark'?'dark':'light';
    document.documentElement.dataset.theme=value;
    document.body.classList.toggle('dark',value==='dark');
    localStorage.setItem(THEME_KEY,value);
    if(themeBtn)themeBtn.textContent=value==='dark'?'LIGHT':'DARK';
    themeColor?.setAttribute('content',value==='dark'?'#0B0C0E':'#F3F1EC');
    const doc=frameDoc();
    if(doc){
      doc.documentElement.dataset.theme=value;
      doc.body?.classList.toggle('dark',value==='dark');
    }
  }

  function bindBubbles(doc){
    const entries=[['cameraDetails','camera'],['lightDetails','light'],['fillDetails','fill'],['gelDetails','gel']];
    entries.forEach(([id,key])=>{
      const details=doc.getElementById(id);
      if(!details)return;
      details.open=!!bubbleState[key];
      if(details.dataset.bosSplitState==='1')return;
      details.dataset.bosSplitState='1';
      details.addEventListener('toggle',()=>{
        bubbleState[key]=details.open;
        saveBubbles();
        requestAnimationFrame(()=>{
          syncCollapsedBubbleHeights(doc);
          fit();
        });
        setTimeout(()=>{
          syncCollapsedBubbleHeights(doc);
          fit();
        },80);
      });
    });
  }

  function prepareFrame(){
    const doc=frameDoc();
    if(!doc)return;
    doc.documentElement.classList.add('bos-light-split-embed');
    let style=doc.getElementById('bos-light-split-style');
    if(!style){
      style=doc.createElement('style');
      style.id='bos-light-split-style';
      style.textContent=`
html.bos-light-split-embed,html.bos-light-split-embed body{min-height:0!important;height:auto!important;background:transparent!important;overflow:hidden!important}
html.bos-light-split-embed .topbar,
html.bos-light-split-embed [data-bos-return],
html.bos-light-split-embed .utility-row,
html.bos-light-split-embed .project-contact-bottom,
html.bos-light-split-embed main>footer{display:none!important}
html.bos-light-split-embed .app-shell{width:100%!important;max-width:none!important;min-height:0!important;margin:0!important;padding:0!important}
html.bos-light-split-embed #cameraDetails{margin-top:0!important}

/* Onglet APPLICATIONS : uniquement 01 à 04. */
html.bos-light-split-embed.bos-light-section-applications #bosThreePointPanel,
html.bos-light-split-embed.bos-light-section-applications #bosShadowHardnessPanel,
html.bos-light-split-embed.bos-light-section-applications #bosMiniPlateau{display:none!important}

/* Onglet FICHES TECHNIQUES : uniquement 05 à 07. */
html.bos-light-split-embed.bos-light-section-technical #cameraDetails,
html.bos-light-split-embed.bos-light-section-technical #lightDetails,
html.bos-light-split-embed.bos-light-section-technical #fillDetails,
html.bos-light-split-embed.bos-light-section-technical #gelDetails{display:none!important}

/* V0.63 — réserve la flèche à droite dans les têtes repliables */
html.bos-light-split-embed .collapsible-heading{padding-right:56px!important}
html.bos-light-split-embed .collapsible-heading .summary-value{padding-right:30px!important;max-width:calc(100% - 190px)!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
html.bos-light-split-embed .collapsible-heading .chevron{right:18px!important}
html.bos-light-split-embed .camera-card .summary-value{max-width:calc(100% - 190px)!important}

/* Toutes les bulles repliées prennent exactement la hauteur de la bulle 01 */
html.bos-light-split-embed details.collapsible-card:not([open]) > summary.collapsible-heading{
  height:var(--bos-light-collapsed-heading-height)!important;
  min-height:var(--bos-light-collapsed-heading-height)!important;
  max-height:var(--bos-light-collapsed-heading-height)!important;
  box-sizing:border-box!important;
}

/* 05, 06 et 07 utilisent une autre structure : même hauteur extérieure que 01. */
html.bos-light-split-embed #bosThreePointPanel.bmp-collapsed,
html.bos-light-split-embed #bosShadowHardnessPanel.bmp-collapsed,
html.bos-light-split-embed #bosMiniPlateau.bmp-collapsed{
  height:var(--bos-light-collapsed-card-height)!important;
  min-height:var(--bos-light-collapsed-card-height)!important;
  max-height:var(--bos-light-collapsed-card-height)!important;
  box-sizing:border-box!important;
}
html.bos-light-split-embed #bosThreePointPanel.bmp-collapsed > .bft-head,
html.bos-light-split-embed #bosShadowHardnessPanel.bmp-collapsed > .bft-head,
html.bos-light-split-embed #bosMiniPlateau.bmp-collapsed > .bft-head{
  height:100%!important;
  min-height:0!important;
  max-height:100%!important;
  box-sizing:border-box!important;
}

@media (max-width:760px){
  html.bos-light-split-embed .collapsible-heading .summary-value,
  html.bos-light-split-embed .camera-card .summary-value,
  html.bos-light-split-embed .light-card .summary-value{max-width:calc(100% - 170px)!important}
}
`;
      (doc.head||doc.documentElement).appendChild(style);
    }
    bindBubbles(doc);
    applyTheme(localStorage.getItem(THEME_KEY)||'light');
    applySectionMode(sectionMode);
    syncCollapsedBubbleHeights(doc);
    fit();

    doc.fonts?.ready?.then(()=>{
      syncCollapsedBubbleHeights(doc);
      fit();
    }).catch(()=>{});

    if(!frame._bosSplitResizeObserver&&'ResizeObserver' in window){
      const root=doc.querySelector('.app-shell')||doc.body;
      const ro=new ResizeObserver(()=>requestAnimationFrame(()=>{
        syncCollapsedBubbleHeights(doc);
        fit();
      }));
      if(root)ro.observe(root);
      frame._bosSplitResizeObserver=ro;
    }
    if(!frame._bosSplitMutationObserver){
      const mo=new MutationObserver(()=>requestAnimationFrame(()=>{
        syncCollapsedBubbleHeights(doc);
        fit();
      }));
      mo.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['open','hidden','class','style']});
      frame._bosSplitMutationObserver=mo;
    }
    doc.addEventListener('click',()=>setTimeout(()=>{
      syncCollapsedBubbleHeights(doc);
      fit();
    },0),true);
    [60,180,500,1000].forEach(ms=>setTimeout(()=>{
      syncCollapsedBubbleHeights(doc);
      fit();
    },ms));
  }

  frame?.addEventListener('load',prepareFrame);
  if(frameDoc()?.readyState==='complete'||frameDoc()?.readyState==='interactive')prepareFrame();

  applicationsModeBtn?.addEventListener('click',()=>applySectionMode('applications'));
  technicalModeBtn?.addEventListener('click',()=>applySectionMode('technical'));
  applySectionMode('applications');

  themeBtn?.addEventListener('click',()=>{
    applyTheme((document.documentElement.dataset.theme||'light')==='dark'?'light':'dark');
  });

  resetBtn?.addEventListener('click',()=>{
    const doc=frameDoc();
    doc?.getElementById('resetBtn')?.click();
    setTimeout(fit,80);
  });

  projectBtn?.addEventListener('click',()=>projectDialog?.showModal());

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    if(installRow&&!standalone())installRow.hidden=false;
  });
  window.addEventListener('appinstalled',()=>{
    localStorage.setItem(INSTALLED_KEY,'1');
    if(installRow)installRow.hidden=true;
    deferredInstallPrompt=null;
  });

  function updateInstall(){
    if(!installRow)return;
    if(standalone()){
      localStorage.setItem(INSTALLED_KEY,'1');
      installRow.hidden=true;
      return;
    }
    installRow.hidden=localStorage.getItem(INSTALLED_KEY)==='1';
  }
  installBtn?.addEventListener('click',async()=>{
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      try{await deferredInstallPrompt.userChoice;}catch(_){ }
      deferredInstallPrompt=null;
      return;
    }
    if(installHelpText)installHelpText.textContent=isIOS()?'Installation sur iPhone / iPad':'Installation depuis votre navigateur';
    if(installHelpBody){
      installHelpBody.innerHTML=isIOS()
        ?'<p><strong>Safari :</strong> touchez <strong>Partager</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.</p>'
        :'<p>Ouvrez le menu du navigateur puis choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p>';
    }
    installDialog?.showModal();
  });

  applyTheme(localStorage.getItem(THEME_KEY)||'light');
  updateInstall();

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v='+VERSION).catch(()=>{}));
  }
})();