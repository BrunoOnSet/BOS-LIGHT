(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function frameDoc(){
    try{return frame.contentDocument||null;}catch(_){return null;}
  }

  function isLightDocument(doc){
    try{return !!doc&&/\/modules\/light(?:\/|$)/i.test(doc.location.pathname);}catch(_){return false;}
  }

  function safeViewportTop(){
    let top=12;
    const header=document.querySelector('.topbar');
    if(header){
      const r=header.getBoundingClientRect();
      if(r.bottom>0&&r.top<window.innerHeight)top=Math.max(top,r.bottom+14);
    }
    return top;
  }

  function positionOpenDialogs(){
    const doc=frameDoc();
    if(!isLightDocument(doc))return;

    const frameRect=frame.getBoundingClientRect();
    const top=Math.max(12,safeViewportTop()-frameRect.top);
    const bottom=Math.min(frameRect.height-12,-frameRect.top+window.innerHeight-12);
    const available=Math.max(180,bottom-top);

    doc.querySelectorAll('dialog.add-dialog[open]').forEach(dialog=>{
      dialog.style.setProperty('top',`${Math.round(top)}px`,'important');
      dialog.style.setProperty('left','50%','important');
      dialog.style.setProperty('right','auto','important');
      dialog.style.setProperty('bottom','auto','important');
      dialog.style.setProperty('margin','0','important');
      dialog.style.setProperty('transform','translateX(-50%)','important');

      const shell=dialog.querySelector('.dialog-shell');
      if(shell){
        shell.style.setProperty('max-height',`${Math.min(720,Math.floor(available))}px`,'important');
        shell.style.setProperty('overflow','auto','important');
      }
    });
  }

  function bind(){
    const doc=frameDoc();
    if(!isLightDocument(doc)||doc.documentElement.dataset.bosDialogPositioning==='1')return;
    doc.documentElement.dataset.bosDialogPositioning='1';

    new MutationObserver(mutations=>{
      if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='open')){
        requestAnimationFrame(positionOpenDialogs);
      }
    }).observe(doc.documentElement,{subtree:true,attributes:true,attributeFilter:['open']});

    doc.addEventListener('click',()=>{
      setTimeout(positionOpenDialogs,0);
      setTimeout(positionOpenDialogs,60);
    },true);

    positionOpenDialogs();
  }

  frame.addEventListener('load',bind);
  window.addEventListener('scroll',positionOpenDialogs,{passive:true});
  window.addEventListener('resize',positionOpenDialogs);

  bind();
})();
