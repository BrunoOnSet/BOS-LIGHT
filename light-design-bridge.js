(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

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

    if(!doc.getElementById('bosLightDesignCss')){
      const css=doc.createElement('link');
      css.id='bosLightDesignCss';
      css.rel='stylesheet';
      css.href='/BOS-LIGHT/light-design.css?v=1.1.0';
      css.addEventListener('load',()=>{
        requestAnimationFrame(()=>window.BOSLightFit?.());
        setTimeout(()=>window.BOSLightFit?.(),80);
      });
      doc.head.appendChild(css);
    }

    return true;
  }

  function refresh(){
    inject();
    [60,180,500,1000].forEach(ms=>setTimeout(inject,ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
