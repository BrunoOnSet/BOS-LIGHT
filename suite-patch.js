(function(){
  'use strict';

  const lightFrame=document.getElementById('lightFrame');
  const expoFrame=document.getElementById('expoFrame');

  function fitLightToLastCard(){
    if(!lightFrame)return;
    try{
      const doc=lightFrame.contentDocument;
      if(!doc)return;
      const root=doc.querySelector('.app-shell')||doc.body;
      const last=doc.getElementById('gelDetails');
      if(!root||!last)return;

      const rootRect=root.getBoundingClientRect();
      const lastRect=last.getBoundingClientRect();
      const lastStyle=doc.defaultView?.getComputedStyle?.(last);
      const marginBottom=parseFloat(lastStyle?.marginBottom)||0;
      const height=Math.ceil(lastRect.bottom-rootRect.top+marginBottom);
      if(height>0)lightFrame.style.height=`${height}px`;
    }catch(_){}
  }

  function scheduleLightFit(){
    requestAnimationFrame(fitLightToLastCard);
    setTimeout(fitLightToLastCard,60);
    setTimeout(fitLightToLastCard,220);
    setTimeout(fitLightToLastCard,500);
  }

  function setupLightFrame(){
    try{
      const doc=lightFrame?.contentDocument;
      if(!doc||doc.documentElement.dataset.bosSpacingFix==='1')return;
      doc.documentElement.dataset.bosSpacingFix='1';

      doc.addEventListener('toggle',scheduleLightFit,true);
      doc.addEventListener('click',()=>setTimeout(fitLightToLastCard,80),true);

      const last=doc.getElementById('gelDetails');
      if(last&&'ResizeObserver' in window){
        const ro=new ResizeObserver(scheduleLightFit);
        ro.observe(last);
        lightFrame._bosLastCardObserver=ro;
      }

      scheduleLightFit();
    }catch(_){}
  }

  function fixExpoOrderAndNumber(){
    if(!expoFrame)return;
    try{
      const doc=expoFrame.contentDocument;
      if(!doc)return;

      /* Pas de bulle « Références caméra » dans LIGHT : 05 est suivi directement de 06. */
      doc.getElementById('cameraRefPanel')?.remove();

      const compPanel=doc.getElementById('simpleExpoPanel');
      const head=compPanel?.querySelector('.compact-section-head');
      if(!head)return;

      let badge=head.querySelector(':scope > .bos-suite-number');
      if(!badge){
        badge=doc.createElement('span');
        badge.className='bos-suite-number';
        head.prepend(badge);
      }
      badge.textContent='06';
      head.classList.add('bos-suite-numbered-head');
    }catch(_){}
  }

  function setupExpoFrame(){
    fixExpoOrderAndNumber();
    setTimeout(fixExpoOrderAndNumber,180);
    setTimeout(fixExpoOrderAndNumber,450);
    setTimeout(fixExpoOrderAndNumber,800);
  }

  lightFrame?.addEventListener('load',setupLightFrame);
  expoFrame?.addEventListener('load',setupExpoFrame);

  /* Le script peut arriver après le load des iframes sur une connexion rapide. */
  if(lightFrame?.contentDocument?.readyState==='complete'||lightFrame?.contentDocument?.readyState==='interactive')setupLightFrame();
  if(expoFrame?.contentDocument?.readyState==='complete'||expoFrame?.contentDocument?.readyState==='interactive')setupExpoFrame();
})();
