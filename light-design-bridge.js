(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function ensureStylesheet(doc,id,href){
    let link=doc.getElementById(id);
    if(link){
      if(link.getAttribute('href')!==href)link.setAttribute('href',href);
      return link;
    }
    link=doc.createElement('link');
    link.id=id;
    link.rel='stylesheet';
    link.href=href;
    link.addEventListener('load',()=>{
      requestAnimationFrame(()=>window.BOSLightFit?.());
      setTimeout(()=>window.BOSLightFit?.(),80);
    });
    doc.head.appendChild(link);
    return link;
  }

  function inject(){
    let doc;
    try{doc=frame.contentDocument||null;}catch(_){doc=null;}
    if(!doc||!doc.head)return false;

    if(!doc.getElementById('bosLightDesignFonts')){
      const fonts=doc.createElement('link');
      fonts.id='bosLightDesignFonts';
      fonts.rel='stylesheet';
      fonts.href='https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap';
      doc.head.appendChild(fonts);
    }

    ensureStylesheet(doc,'bosLightDesignCss','/BOS-LIGHT/light-design.css?v=1.1.0');
    ensureStylesheet(doc,'bosLightBubblesCss','/BOS-LIGHT/light-bubbles.css?v=1.1.0');

    return true;
  }

  function refresh(){
    inject();
    [60,180,500,1000].forEach(ms=>setTimeout(inject,ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
