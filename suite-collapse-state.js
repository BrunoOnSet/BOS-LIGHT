(function(){
  'use strict';

  /*
   * V3 — une seule source de vérité pour l'état ouvert/fermé des bulles.
   *
   * 01–04 : <details> natifs.
   * 05–06 : le wrapper BOS (classe .bos-suite-collapsed) est seul maître.
   *          Le collapse historique d'EXPO est neutralisé afin qu'il ne puisse
   *          plus rouvrir les panneaux au chargement ou après actualisation.
   */
  const STORAGE_KEY='bos-light-bubbles-v3';
  const DEFAULT_STATE={
    camera:false,
    light:false,
    fill:false,
    gel:false,
    dynamics:false,
    compensate:false
  };

  let state={...DEFAULT_STATE};
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&typeof saved==='object'){
      Object.keys(DEFAULT_STATE).forEach(function(key){
        if(typeof saved[key]==='boolean')state[key]=saved[key];
      });
    }
  }catch(_){ }

  function save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){ }
  }

  function bindDetails(details,key){
    if(!details||details.dataset.bosCollapseV3==='1')return !!details;
    details.dataset.bosCollapseV3='1';
    details.open=!!state[key];
    details.addEventListener('toggle',function(){
      state[key]=!!details.open;
      save();
    });
    return true;
  }

  function bindRootCamera(){
    return bindDetails(document.getElementById('sharedCameraDetails'),'camera');
  }

  function bindLightFrame(){
    const frame=document.getElementById('lightFrame');
    const doc=frame&&frame.contentDocument;
    if(!doc)return false;
    const items=[
      [doc.getElementById('lightDetails'),'light'],
      [doc.getElementById('fillDetails'),'fill'],
      [doc.getElementById('gelDetails'),'gel']
    ];
    if(items.some(function(item){return !item[0];}))return false;
    items.forEach(function(item){bindDetails(item[0],item[1]);});
    return true;
  }

  function shortDynamicsCopy(panel,closed){
    if(!panel)return;
    const title=panel.querySelector('.panel-kicker');
    const subtitle=panel.querySelector('.panel-subtitle');
    if(title){
      if(!title.dataset.bosFullText)title.dataset.bosFullText=title.textContent.trim();
      title.textContent=closed?'DYNAMIQUE DE L’IMAGE':title.dataset.bosFullText;
    }
    if(subtitle){
      if(!subtitle.dataset.bosFullText)subtitle.dataset.bosFullText=subtitle.textContent.trim();
      subtitle.textContent=closed?'Lire le waveform et les repères de latitude.':subtitle.dataset.bosFullText;
    }
  }

  function expoParts(doc,panelId){
    const panel=doc.getElementById(panelId);
    if(!panel)return null;
    const head=panelId==='readToolPanel'
      ? panel.querySelector('.quick-inline-head')
      : panel.querySelector('.compact-section-head');
    if(!head)return null;
    return {
      panel:panel,
      head:head,
      legacyButton:panel.querySelector('.panel-collapse-btn'),
      legacyContent:panel.querySelector('.panel-collapse-content')
    };
  }

  function normalizeLegacyExpo(parts){
    /* EXPO garde techniquement son contenu "ouvert" ; seule la classe BOS
       décide ensuite si la bulle est visible ou repliée. */
    parts.panel.classList.remove('collapsed');
    if(parts.legacyContent)parts.legacyContent.hidden=false;
    if(parts.legacyButton){
      parts.legacyButton.setAttribute('aria-expanded','true');
      parts.legacyButton.style.setProperty('display','none','important');
    }
  }

  function applyExpo(parts,key){
    if(!parts)return;
    const open=!!state[key];
    normalizeLegacyExpo(parts);
    parts.panel.classList.toggle('bos-suite-collapsed',!open);
    parts.head.setAttribute('aria-expanded',open?'true':'false');
    if(key==='dynamics')shortDynamicsCopy(parts.panel,!open);
  }

  function bindExpoPanel(doc,panelId,key){
    const parts=expoParts(doc,panelId);
    if(!parts)return false;
    if(parts.panel.dataset.bosCollapseV3==='1'){
      applyExpo(parts,key);
      return true;
    }
    parts.panel.dataset.bosCollapseV3='1';

    let applying=false;
    const apply=function(){
      if(applying)return;
      applying=true;
      applyExpo(parts,key);
      requestAnimationFrame(function(){applying=false;});
    };

    /* État mémorisé appliqué immédiatement puis après les derniers patches EXPO. */
    apply();
    requestAnimationFrame(apply);
    [50,140,320,700,1200].forEach(function(ms){setTimeout(apply,ms);});

    /*
     * On intercepte le clic AVANT les deux anciens systèmes de collapse
     * (EXPO + wrapper BOS). Cela évite tout double-toggle.
     * RESET reste indépendant et ne replie pas la bulle.
     */
    parts.head.addEventListener('click',function(event){
      if(event.target.closest('#simpleResetBtn,.small-action'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      state[key]=!state[key];
      save();
      apply();
    },true);

    parts.head.addEventListener('keydown',function(event){
      if(event.key!=='Enter'&&event.key!==' ')return;
      if(event.target.closest('#simpleResetBtn,.small-action'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      state[key]=!state[key];
      save();
      apply();
    },true);

    /* Si un ancien script tente de changer l'état ensuite, on restaure
       immédiatement la valeur mémorisée sans la réécrire. */
    const observer=new MutationObserver(function(){
      if(applying)return;
      const shouldBeClosed=!state[key];
      const wrongClass=parts.panel.classList.contains('bos-suite-collapsed')!==shouldBeClosed;
      const legacyClosed=parts.panel.classList.contains('collapsed')||!!parts.legacyContent?.hidden;
      if(wrongClass||legacyClosed)apply();
    });
    observer.observe(parts.panel,{attributes:true,attributeFilter:['class']});
    if(parts.legacyContent)observer.observe(parts.legacyContent,{attributes:true,attributeFilter:['hidden']});
    if(parts.legacyButton)observer.observe(parts.legacyButton,{attributes:true,attributeFilter:['aria-expanded']});
    parts.panel._bosCollapseV3Observer=observer;

    return true;
  }

  function bindExpoFrame(){
    const frame=document.getElementById('expoFrame');
    const doc=frame&&frame.contentDocument;
    if(!doc)return false;
    const dynamics=bindExpoPanel(doc,'readToolPanel','dynamics');
    const compensate=bindExpoPanel(doc,'simpleExpoPanel','compensate');
    return dynamics&&compensate;
  }

  function retry(fn,tries){
    let count=0;
    const max=tries||100;
    const run=function(){
      if(fn())return;
      count+=1;
      if(count<max)setTimeout(run,40);
    };
    run();
  }

  bindRootCamera();

  const lightFrame=document.getElementById('lightFrame');
  const expoFrame=document.getElementById('expoFrame');

  lightFrame?.addEventListener('load',function(){retry(bindLightFrame);});
  expoFrame?.addEventListener('load',function(){retry(bindExpoFrame);});

  if(lightFrame?.contentDocument?.readyState==='complete'||lightFrame?.contentDocument?.readyState==='interactive')retry(bindLightFrame);
  if(expoFrame?.contentDocument?.readyState==='complete'||expoFrame?.contentDocument?.readyState==='interactive')retry(bindExpoFrame);
})();
