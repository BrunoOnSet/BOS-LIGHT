(function(){
  'use strict';
  const THEME_KEY='bos-light-suite-theme-v1';
  const INSTALLED_KEY='bos-light-suite-installed-v1';
  let deferredInstallPrompt=null;
  let cameraSyncTimer=null;
  const $=id=>document.getElementById(id);

  function standalone(){return window.matchMedia?.('(display-mode: standalone)').matches===true || window.navigator.standalone===true;}
  function ios(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
  function frameEls(){return [$('lightFrame'),$('expoFrame')].filter(Boolean);}
  function lightDoc(){try{return $('lightFrame')?.contentDocument||null;}catch(_){return null;}}
  function expoDoc(){try{return $('expoFrame')?.contentDocument||null;}catch(_){return null;}}

  function syncFrameTheme(value){
    frameEls().forEach(frame=>{
      try{
        const doc=frame.contentDocument;
        if(!doc)return;
        if(doc.documentElement)doc.documentElement.dataset.theme=value;
        if(doc.body)doc.body.classList.toggle('dark',value==='dark');
      }catch(_){}
    });
  }

  function visibleElement(el,doc){
    if(!el||el.hidden)return false;
    const win=doc.defaultView;
    const cs=win?.getComputedStyle?.(el);
    return !cs || (cs.display!=='none'&&cs.visibility!=='hidden');
  }

  function naturalFrameHeight(doc){
    const candidates=[...doc.querySelectorAll('.app-shell,.app,#mainApp,.tips-page')];
    let top=Infinity;
    let bottom=-Infinity;
    candidates.forEach(el=>{
      if(!visibleElement(el,doc))return;
      const rect=el.getBoundingClientRect();
      if(!Number.isFinite(rect.height)||rect.height<=0)return;
      const cs=doc.defaultView?.getComputedStyle?.(el);
      const mt=parseFloat(cs?.marginTop)||0;
      const mb=parseFloat(cs?.marginBottom)||0;
      top=Math.min(top,rect.top-mt);
      bottom=Math.max(bottom,rect.bottom+mb);
    });
    if(Number.isFinite(top)&&Number.isFinite(bottom)&&bottom>top){
      return Math.ceil(bottom-top);
    }
    const bodyRect=doc.body?.getBoundingClientRect();
    return Math.max(1,Math.ceil(bodyRect?.height||0));
  }

  function fitFrame(frame){
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      const h=naturalFrameHeight(doc);
      const current=parseFloat(frame.style.height)||0;
      if(h>0&&Math.abs(current-h)>1)frame.style.height=`${h}px`;
    }catch(_){}
  }

  function addPanelNumber(doc,panelSelector,headSelector,number){
    const panel=doc.querySelector(panelSelector);
    const head=panel?.querySelector(headSelector);
    if(!head)return;
    let badge=head.querySelector(':scope > .bos-suite-number');
    if(!badge){
      badge=doc.createElement('span');
      badge.className='bos-suite-number';
      badge.textContent=number;
      head.prepend(badge);
    }else if(badge.textContent!==number){
      badge.textContent=number;
    }
    if(!head.classList.contains('bos-suite-numbered-head'))head.classList.add('bos-suite-numbered-head');
  }

  function makePanelCollapsible(doc,panelSelector,headSelector){
    const panel=doc.querySelector(panelSelector);
    const head=panel?.querySelector(headSelector);
    if(!panel||!head||panel.dataset.bosSuiteCollapsible==='1')return;

    panel.dataset.bosSuiteCollapsible='1';
    panel.classList.add('bos-suite-collapsible');
    head.classList.add('bos-suite-collapse-head');
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    head.setAttribute('aria-expanded','true');

    const chevron=doc.createElement('span');
    chevron.className='bos-suite-collapse-chevron';
    chevron.setAttribute('aria-hidden','true');
    chevron.textContent='⌄';
    head.appendChild(chevron);

    const toggle=()=>{
      const collapsed=panel.classList.toggle('bos-suite-collapsed');
      head.setAttribute('aria-expanded',collapsed?'false':'true');
      requestAnimationFrame(()=>fitFrame($('expoFrame')));
      setTimeout(()=>fitFrame($('expoFrame')),80);
    };

    head.addEventListener('click',event=>{
      if(event.target.closest('button,a,input,select,textarea,label'))return;
      toggle();
    });
    head.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        toggle();
      }
    });
  }

  function decorateExpo(doc){
    const refPanel=doc.getElementById('cameraRefPanel');
    const compPanel=doc.getElementById('simpleExpoPanel');
    if(refPanel&&compPanel&&refPanel.nextElementSibling!==compPanel){
      compPanel.parentNode.insertBefore(refPanel,compPanel);
    }
    addPanelNumber(doc,'#readToolPanel','.quick-inline-head','05');
    addPanelNumber(doc,'#cameraRefPanel','.compact-section-head','06');
    addPanelNumber(doc,'#simpleExpoPanel','.compact-section-head','07');
    makePanelCollapsible(doc,'#readToolPanel','.quick-inline-head');
    makePanelCollapsible(doc,'#cameraRefPanel','.compact-section-head');
  }

  function bindFrame(frame){
    if(!frame)return;
    frame.addEventListener('load',()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc)return;
        doc.documentElement.classList.add('bos-suite-embed');
        doc.documentElement.dataset.theme=document.documentElement.dataset.theme||'light';
        doc.body?.classList.toggle('dark',(document.documentElement.dataset.theme||'light')==='dark');
        if(!doc.getElementById('bos-suite-embed-style')){
          const style=doc.createElement('style');
          style.id='bos-suite-embed-style';
          style.textContent=`
html.bos-suite-embed,html.bos-suite-embed body{min-height:0!important;height:auto!important;background:transparent!important;overflow:hidden!important}
html.bos-suite-embed .topbar,html.bos-suite-embed [data-bos-return],html.bos-suite-embed .project-contact-bottom,html.bos-suite-embed main>footer{display:none!important}
html.bos-suite-embed .app-shell,html.bos-suite-embed .app,html.bos-suite-embed #mainApp{width:100%!important;max-width:none!important;min-height:0!important;margin:0!important;padding:0!important}
html.bos-suite-embed .first-card{margin-top:0!important}
html.bos-suite-embed .utility-row{display:none!important}
html.bos-suite-embed #cameraDetails,html.bos-suite-embed #cameraSettingsPanel{display:none!important}
html.bos-suite-embed .bos-suite-numbered-head{display:grid!important;grid-template-columns:32px minmax(0,1fr) auto!important;align-items:flex-start!important;gap:10px!important}
html.bos-suite-embed .bos-suite-numbered-head.bos-suite-collapse-head{grid-template-columns:32px minmax(0,1fr) auto auto!important}
html.bos-suite-embed .bos-suite-number{width:32px;height:32px;display:grid;place-items:center;flex:0 0 32px;border:1px solid #2F5B66;border-radius:9px;background:rgba(47,91,102,.14);color:#2F5B66;font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:11px;font-weight:700;line-height:1}
html.bos-suite-embed body.dark .bos-suite-number{color:#7FA7B0;border-color:#2F5B66;background:rgba(47,91,102,.22)}
html.bos-suite-embed .bos-suite-collapse-head{cursor:pointer;user-select:none}
html.bos-suite-embed .bos-suite-collapse-chevron{display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;color:var(--muted);font-size:17px;line-height:1;transform:rotate(180deg);transition:transform .16s ease}
html.bos-suite-embed .bos-suite-collapsed .bos-suite-collapse-chevron{transform:rotate(0deg)}
html.bos-suite-embed #readToolPanel.bos-suite-collapsed>:not(.quick-inline-head),html.bos-suite-embed #cameraRefPanel.bos-suite-collapsed>:not(.compact-section-head){display:none!important}
html.bos-suite-embed #readToolPanel.bos-suite-collapsed .quick-inline-head,html.bos-suite-embed #cameraRefPanel.bos-suite-collapsed .compact-section-head{margin-bottom:0!important}
@media(max-width:430px){html.bos-suite-embed .bos-suite-numbered-head{grid-template-columns:32px minmax(0,1fr) auto!important;gap:9px!important}html.bos-suite-embed .bos-suite-numbered-head.bos-suite-collapse-head{grid-template-columns:32px minmax(0,1fr) auto auto!important}}
`;
          (doc.head||doc.documentElement).appendChild(style);
        }
        if(frame.id==='expoFrame')decorateExpo(doc);
        fitFrame(frame);
        bindChildCameraListeners();
        scheduleCameraSync(450);

        const resize=()=>requestAnimationFrame(()=>fitFrame(frame));
        if('ResizeObserver' in window){
          const ro=new ResizeObserver(resize);
          const root=doc.querySelector('.app-shell,.app,#mainApp,.tips-page')||doc.body;
          if(root)ro.observe(root);
          frame._bosResizeObserver=ro;
        }

        const mo=new MutationObserver(()=>{
          resize();
          scheduleCameraSync(120);
        });
        mo.observe(doc.documentElement,{subtree:true,childList:true,attributes:false,characterData:false});
        frame._bosMutationObserver=mo;

        doc.addEventListener('click',()=>setTimeout(resize,0),true);
        doc.addEventListener('toggle',()=>{
          requestAnimationFrame(resize);
          setTimeout(resize,80);
          setTimeout(resize,220);
        },true);
        window.setTimeout(()=>{if(frame.id==='expoFrame')decorateExpo(doc);resize();bindChildCameraListeners();syncSharedCamera();},150);
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
    if($('themeBtn'))$('themeBtn').textContent=t==='dark'?'LIGHT':'DARK';
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

  function selectText(select){
    if(!select)return '';
    return select.options?.[select.selectedIndex]?.textContent?.trim()||select.value||'';
  }

  function activeButton(container){
    return container?.querySelector('button.active')||container?.querySelector('button[aria-pressed="true"]')||null;
  }

  function buttonValue(button){
    return button?.dataset?.value||button?.value||button?.textContent?.trim()||'';
  }

  function setOptionsFromButtons(target,container){
    if(!target||!container)return false;
    const buttons=[...container.querySelectorAll('button')];
    if(!buttons.length)return false;
    const current=buttonValue(activeButton(container));
    target.replaceChildren(...buttons.map(button=>{
      const option=document.createElement('option');
      option.value=buttonValue(button);
      option.textContent=button.textContent.trim();
      return option;
    }));
    if([...target.options].some(o=>o.value===current))target.value=current;
    return true;
  }

  function setOptionsFromSelect(target,source){
    if(!target||!source||!source.options?.length)return false;
    const current=source.value;
    target.replaceChildren(...[...source.options].map(sourceOption=>{
      const option=document.createElement('option');
      option.value=sourceOption.value;
      option.textContent=sourceOption.textContent;
      option.disabled=sourceOption.disabled;
      return option;
    }));
    target.value=current;
    return true;
  }

  function dispatchSelect(source,value){
    if(!source)return;
    source.value=value;
    source.dispatchEvent(new Event('input',{bubbles:true}));
    source.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function clickButtonValue(container,value){
    if(!container)return;
    const wanted=String(value);
    const button=[...container.querySelectorAll('button')].find(btn=>buttonValue(btn)===wanted);
    button?.click();
  }

  function syncSharedCamera(){
    const ld=lightDoc(),ed=expoDoc();
    if(!ld||!ed)return false;
    const results=[
      setOptionsFromButtons($('sharedCameraBrand'),ed.getElementById('cameraBrandMode')),
      setOptionsFromSelect($('sharedCameraModel'),ed.getElementById('cameraMode')),
      setOptionsFromButtons($('sharedCameraGamma'),ed.getElementById('gammaMode')),
      setOptionsFromSelect($('sharedLightIso'),ld.getElementById('isoSelect')),
      setOptionsFromSelect($('sharedLightAperture'),ld.getElementById('apertureSelect')),
      setOptionsFromSelect($('sharedLightShutter'),ld.getElementById('shutterSelect'))
    ];
    const parts=[
      selectText($('sharedCameraModel')),
      selectText($('sharedCameraGamma')),
      selectText($('sharedLightIso')),
      selectText($('sharedLightAperture')),
      selectText($('sharedLightShutter'))
    ].filter(Boolean);
    if(parts.length&&$('sharedCameraMeta'))$('sharedCameraMeta').textContent=parts.join(' · ');
    return results.every(Boolean);
  }

  function scheduleCameraSync(delay=60){
    clearTimeout(cameraSyncTimer);
    cameraSyncTimer=setTimeout(syncSharedCamera,delay);
  }

  function bindChildCameraListeners(){
    const ld=lightDoc(),ed=expoDoc();
    if(ld){
      ['isoSelect','apertureSelect','shutterSelect'].forEach(id=>{
        const el=ld.getElementById(id);
        if(el&&!el.dataset.bosSuiteBound){
          el.dataset.bosSuiteBound='1';
          el.addEventListener('change',()=>scheduleCameraSync(30));
          el.addEventListener('input',()=>scheduleCameraSync(30));
        }
      });
    }
    if(ed){
      const cameraMode=ed.getElementById('cameraMode');
      if(cameraMode&&!cameraMode.dataset.bosSuiteBound){cameraMode.dataset.bosSuiteBound='1';cameraMode.addEventListener('change',()=>scheduleCameraSync(80));}
      ['cameraBrandMode','gammaMode'].forEach(id=>{
        const el=ed.getElementById(id);
        if(el&&!el.dataset.bosSuiteBound){el.dataset.bosSuiteBound='1';el.addEventListener('click',()=>scheduleCameraSync(120),true);}
      });
    }
  }

  function bindSharedCameraControls(){
    $('sharedCameraBrand')?.addEventListener('change',e=>{
      clickButtonValue(expoDoc()?.getElementById('cameraBrandMode'),e.target.value);
      scheduleCameraSync(160);
    });
    $('sharedCameraModel')?.addEventListener('change',e=>{
      dispatchSelect(expoDoc()?.getElementById('cameraMode'),e.target.value);
      scheduleCameraSync(140);
    });
    $('sharedCameraGamma')?.addEventListener('change',e=>{
      clickButtonValue(expoDoc()?.getElementById('gammaMode'),e.target.value);
      scheduleCameraSync(120);
    });
    $('sharedLightIso')?.addEventListener('change',e=>{dispatchSelect(lightDoc()?.getElementById('isoSelect'),e.target.value);scheduleCameraSync(60);});
    $('sharedLightAperture')?.addEventListener('change',e=>{dispatchSelect(lightDoc()?.getElementById('apertureSelect'),e.target.value);scheduleCameraSync(60);});
    $('sharedLightShutter')?.addEventListener('change',e=>{dispatchSelect(lightDoc()?.getElementById('shutterSelect'),e.target.value);scheduleCameraSync(60);});
  }

  function openTips(){
    expoDoc()?.getElementById('tipsBtn')?.click();
    setTimeout(()=>fitFrame($('expoFrame')),80);
  }

  function resetSuite(){
    lightDoc()?.getElementById('resetBtn')?.click();
    expoDoc()?.getElementById('simpleResetBtn')?.click();
    setTimeout(()=>{syncSharedCamera();fitFrame($('lightFrame'));fitFrame($('expoFrame'));},120);
  }

  function bind(){
    frameEls().forEach(bindFrame);
    bindSharedCameraControls();
    $('suiteTipsBtn')?.addEventListener('click',openTips);
    $('suiteResetBtn')?.addEventListener('click',resetSuite);
    $('themeBtn')?.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
    const pd=$('projectDialog');
    $('projectContactBtn')?.addEventListener('click',()=>pd?.showModal());
    pd?.addEventListener('click',e=>{if(e.target===pd)pd.close();});
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;localStorage.removeItem(INSTALLED_KEY);updateInstall();});
    window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;localStorage.setItem(INSTALLED_KEY,'1');updateInstall();});
    $('installAppBtn')?.addEventListener('click',async()=>{
      if(deferredInstallPrompt){
        const p=deferredInstallPrompt;deferredInstallPrompt=null;
        try{await p.prompt();const c=await p.userChoice;if(c?.outcome==='accepted')localStorage.setItem(INSTALLED_KEY,'1');}catch(_){}
        updateInstall();return;
      }
      installHelp();
    });
    window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change',updateInstall);
  }

  applyTheme(theme());
  bind();
  updateInstall();
  window.BOSNavigation?.restoreCockpitPosition?.();
  if('serviceWorker' in navigator&&location.protocol!=='file:'){
    window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v=1.2.2',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{}),{once:true});
  }
})();
