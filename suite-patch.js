(function(){
  'use strict';

  const lightFrame=document.getElementById('lightFrame');
  const expoFrame=document.getElementById('expoFrame');
  let lightSetupRetry=null;

  const COMMON_LIGHT_CSS=`
html.bos-suite-embed{
  --bos-bubble-gap:12px;
  --bos-bubble-radius:22px;
  --bos-bubble-collapsed-h:82px;
  --bos-bubble-head-h:80px;
  --bos-bubble-number:34px;
}
html.bos-suite-embed #lightDetails,
html.bos-suite-embed #fillDetails,
html.bos-suite-embed #gelDetails{
  width:100%!important;
  border:1px solid var(--card-border,#D7D9D6)!important;
  border-radius:var(--bos-bubble-radius)!important;
  background:var(--panel)!important;
  box-shadow:none!important;
  overflow:hidden!important;
}
html.bos-suite-embed #lightDetails{margin-top:0!important}
html.bos-suite-embed #fillDetails,
html.bos-suite-embed #gelDetails{margin-top:var(--bos-bubble-gap)!important}
html.bos-suite-embed #lightDetails:not([open]),
html.bos-suite-embed #fillDetails:not([open]),
html.bos-suite-embed #gelDetails:not([open]){height:var(--bos-bubble-collapsed-h)!important}
html.bos-suite-embed #lightDetails>.card-heading,
html.bos-suite-embed #fillDetails>.card-heading,
html.bos-suite-embed #gelDetails>.card-heading{
  display:grid!important;
  grid-template-columns:var(--bos-bubble-number) minmax(0,1fr) minmax(0,180px) 24px!important;
  align-items:center!important;
  gap:12px!important;
  width:100%!important;
  height:var(--bos-bubble-head-h)!important;
  min-height:var(--bos-bubble-head-h)!important;
  margin:0!important;
  padding:14px 16px!important;
  border:0!important;
  box-sizing:border-box!important;
}
html.bos-suite-embed #lightDetails[open]>.card-heading,
html.bos-suite-embed #fillDetails[open]>.card-heading,
html.bos-suite-embed #gelDetails[open]>.card-heading{border-bottom:1px solid var(--line)!important}
html.bos-suite-embed #lightDetails>.card-heading .step,
html.bos-suite-embed #fillDetails>.card-heading .step,
html.bos-suite-embed #gelDetails>.card-heading .step{
  width:var(--bos-bubble-number)!important;
  min-width:var(--bos-bubble-number)!important;
  height:var(--bos-bubble-number)!important;
  display:grid!important;
  place-items:center!important;
  margin:0!important;
  padding:0!important;
  border:1px solid #2F5B66!important;
  border-radius:10px!important;
  background:rgba(47,91,102,.14)!important;
  color:#2F5B66!important;
  font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-size:11px!important;
  line-height:1!important;
  font-weight:700!important;
}
html.bos-suite-embed body.dark #lightDetails>.card-heading .step,
html.bos-suite-embed body.dark #fillDetails>.card-heading .step,
html.bos-suite-embed body.dark #gelDetails>.card-heading .step{
  background:rgba(47,91,102,.22)!important;
  color:#7FA7B0!important;
}
html.bos-suite-embed #lightDetails>.card-heading .heading-copy,
html.bos-suite-embed #fillDetails>.card-heading .heading-copy,
html.bos-suite-embed #gelDetails>.card-heading .heading-copy{min-width:0!important}
html.bos-suite-embed #lightDetails>.card-heading .heading-copy h2,
html.bos-suite-embed #fillDetails>.card-heading .heading-copy h2,
html.bos-suite-embed #gelDetails>.card-heading .heading-copy h2{
  margin:0!important;
  overflow:hidden!important;
  color:#2F5B66!important;
  font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-size:16px!important;
  line-height:1.15!important;
  font-weight:700!important;
  letter-spacing:0!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-suite-embed body.dark #lightDetails>.card-heading .heading-copy h2,
html.bos-suite-embed body.dark #fillDetails>.card-heading .heading-copy h2,
html.bos-suite-embed body.dark #gelDetails>.card-heading .heading-copy h2{color:#7FA7B0!important}
html.bos-suite-embed #lightDetails>.card-heading .heading-copy p,
html.bos-suite-embed #fillDetails>.card-heading .heading-copy p,
html.bos-suite-embed #gelDetails>.card-heading .heading-copy p{
  margin:4px 0 0!important;
  overflow:hidden!important;
  color:var(--muted)!important;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","Roboto","Segoe UI",sans-serif!important;
  font-size:10px!important;
  line-height:1.3!important;
  font-weight:400!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-suite-embed #lightDetails>.card-heading .summary-value,
html.bos-suite-embed #fillDetails>.card-heading .summary-value,
html.bos-suite-embed #gelDetails>.card-heading .summary-value{
  min-width:0!important;
  max-width:180px!important;
  margin:0!important;
  overflow:hidden!important;
  color:var(--muted)!important;
  font-size:10px!important;
  line-height:1.2!important;
  font-weight:700!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-suite-embed #lightDetails>.card-heading .chevron,
html.bos-suite-embed #fillDetails>.card-heading .chevron,
html.bos-suite-embed #gelDetails>.card-heading .chevron{
  position:static!important;
  display:grid!important;
  place-items:center!important;
  width:24px!important;
  height:24px!important;
  margin:0!important;
  color:var(--muted)!important;
  font-size:18px!important;
  line-height:1!important;
  transform:none!important;
}
html.bos-suite-embed #lightDetails[open]>.card-heading .chevron,
html.bos-suite-embed #fillDetails[open]>.card-heading .chevron,
html.bos-suite-embed #gelDetails[open]>.card-heading .chevron{transform:rotate(180deg)!important}
@media(max-width:430px){
  html.bos-suite-embed #lightDetails>.card-heading,
  html.bos-suite-embed #fillDetails>.card-heading,
  html.bos-suite-embed #gelDetails>.card-heading{
    grid-template-columns:var(--bos-bubble-number) minmax(0,1fr) 24px!important;
    gap:10px!important;
    padding:14px 15px!important;
  }
  html.bos-suite-embed #lightDetails>.card-heading .summary-value,
  html.bos-suite-embed #fillDetails>.card-heading .summary-value,
  html.bos-suite-embed #gelDetails>.card-heading .summary-value{display:none!important}
}
`;

  const COMMON_EXPO_CSS=`
html.bos-suite-embed{
  --bos-bubble-gap:12px;
  --bos-bubble-radius:22px;
  --bos-bubble-collapsed-h:82px;
  --bos-bubble-head-h:80px;
  --bos-bubble-number:34px;
}
html.bos-suite-embed #cameraRefPanel{display:none!important}
html.bos-suite-embed #exposeSupported.expo-quick-stack{margin:0!important;padding:0!important;gap:0!important}
html.bos-suite-embed #readToolPanel,
html.bos-suite-embed #simpleExpoPanel{
  width:100%!important;
  border:1px solid var(--card-border,#D7D9D6)!important;
  border-radius:var(--bos-bubble-radius)!important;
  background:var(--panel)!important;
  box-shadow:none!important;
  overflow:hidden!important;
}
html.bos-suite-embed #readToolPanel{margin-top:0!important}
html.bos-suite-embed #simpleExpoPanel{margin-top:var(--bos-bubble-gap)!important}
html.bos-suite-embed #readToolPanel.bos-suite-collapsed,
html.bos-suite-embed #simpleExpoPanel.bos-suite-collapsed{
  height:var(--bos-bubble-collapsed-h)!important;
  padding:0!important;
}
html.bos-suite-embed #readToolPanel>.quick-inline-head,
html.bos-suite-embed #simpleExpoPanel>.compact-section-head{
  display:grid!important;
  grid-template-columns:var(--bos-bubble-number) minmax(0,1fr) auto 24px!important;
  align-items:center!important;
  gap:12px!important;
  width:calc(100% + 36px)!important;
  height:var(--bos-bubble-head-h)!important;
  min-height:var(--bos-bubble-head-h)!important;
  margin:-18px -18px 0!important;
  padding:14px 16px!important;
  border:0!important;
  box-sizing:border-box!important;
}
html.bos-suite-embed #readToolPanel.bos-suite-collapsed>.quick-inline-head,
html.bos-suite-embed #simpleExpoPanel.bos-suite-collapsed>.compact-section-head{
  width:100%!important;
  margin:0!important;
}
html.bos-suite-embed #readToolPanel:not(.bos-suite-collapsed)>.quick-inline-head,
html.bos-suite-embed #simpleExpoPanel:not(.bos-suite-collapsed)>.compact-section-head{
  border-bottom:1px solid var(--line)!important;
}
html.bos-suite-embed .bos-suite-number{
  width:var(--bos-bubble-number)!important;
  min-width:var(--bos-bubble-number)!important;
  height:var(--bos-bubble-number)!important;
  display:grid!important;
  place-items:center!important;
  margin:0!important;
  padding:0!important;
  border:1px solid #2F5B66!important;
  border-radius:10px!important;
  background:rgba(47,91,102,.14)!important;
  color:#2F5B66!important;
  font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-size:11px!important;
  line-height:1!important;
  font-weight:700!important;
}
html.bos-suite-embed body.dark .bos-suite-number{background:rgba(47,91,102,.22)!important;color:#7FA7B0!important}
html.bos-suite-embed #readToolPanel>.quick-inline-head>div:first-of-type,
html.bos-suite-embed #simpleExpoPanel>.compact-section-head>div:first-of-type{min-width:0!important}
html.bos-suite-embed #readToolPanel>.quick-inline-head .panel-kicker,
html.bos-suite-embed #simpleExpoPanel>.compact-section-head .panel-kicker{
  margin:0!important;
  overflow:hidden!important;
  color:#2F5B66!important;
  font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  font-size:16px!important;
  line-height:1.15!important;
  font-weight:700!important;
  letter-spacing:0!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-suite-embed body.dark #readToolPanel>.quick-inline-head .panel-kicker,
html.bos-suite-embed body.dark #simpleExpoPanel>.compact-section-head .panel-kicker{color:#7FA7B0!important}
html.bos-suite-embed #readToolPanel>.quick-inline-head .panel-subtitle,
html.bos-suite-embed #simpleExpoPanel>.compact-section-head .panel-subtitle{
  margin:4px 0 0!important;
  overflow:hidden!important;
  color:var(--muted)!important;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","Roboto","Segoe UI",sans-serif!important;
  font-size:10px!important;
  line-height:1.3!important;
  font-weight:400!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}
html.bos-suite-embed .bos-suite-collapse-chevron{
  position:static!important;
  display:grid!important;
  place-items:center!important;
  width:24px!important;
  min-width:24px!important;
  height:24px!important;
  margin:0!important;
  color:var(--muted)!important;
  font-size:18px!important;
  line-height:1!important;
  transform:rotate(180deg)!important;
}
html.bos-suite-embed .bos-suite-collapsed .bos-suite-collapse-chevron{transform:none!important}
html.bos-suite-embed #readToolPanel.bos-suite-collapsed>:not(.quick-inline-head),
html.bos-suite-embed #simpleExpoPanel.bos-suite-collapsed>:not(.compact-section-head){display:none!important}
html.bos-suite-embed .bos-suite-moved-note{
  margin:14px 0 0!important;
  color:var(--muted)!important;
  font-size:10px!important;
  line-height:1.45!important;
  font-weight:700!important;
}
html.bos-suite-embed #readToolPanel .waveform-explorer-value{margin:0!important}
html.bos-suite-embed #readToolPanel .waveform-explorer-value strong{font-size:31px!important}
html.bos-suite-embed #simpleExpoPanel>.compact-section-head .small-action{margin:0!important}
@media(max-width:430px){
  html.bos-suite-embed #readToolPanel>.quick-inline-head,
  html.bos-suite-embed #simpleExpoPanel>.compact-section-head{
    grid-template-columns:var(--bos-bubble-number) minmax(0,1fr) 24px!important;
    gap:10px!important;
    padding:14px 15px!important;
  }
  html.bos-suite-embed #readToolPanel .waveform-explorer-value,
  html.bos-suite-embed #simpleExpoPanel>.compact-section-head .small-action{display:none!important}
}
`;

  function injectStyle(doc,id,css){
    if(!doc)return;
    let style=doc.getElementById(id);
    if(!style){
      style=doc.createElement('style');
      style.id=id;
      (doc.head||doc.documentElement).appendChild(style);
    }
    if(style.textContent!==css)style.textContent=css;
  }

  function measuredBubbleGap(doc){
    const fill=doc.getElementById('fillDetails');
    const gel=doc.getElementById('gelDetails');
    if(fill&&gel){
      const a=fill.getBoundingClientRect();
      const b=gel.getBoundingClientRect();
      const gap=Math.round(b.top-a.bottom);
      if(Number.isFinite(gap)&&gap>=0&&gap<=40)return gap;
    }
    return 12;
  }

  function fitLightToLastCard(){
    if(!lightFrame)return;
    try{
      const doc=lightFrame.contentDocument;
      if(!doc||!doc.documentElement.classList.contains('bos-suite-embed'))return;
      const root=doc.querySelector('.app-shell')||doc.body;
      const last=doc.getElementById('gelDetails');
      if(!root||!last)return;

      const rootRect=root.getBoundingClientRect();
      const lastRect=last.getBoundingClientRect();
      /* L'espace 04→05 est dérivé de l'espace réel 03→04, donc identique au pixel près. */
      const exactGap=measuredBubbleGap(doc);
      const height=Math.ceil(lastRect.bottom-rootRect.top+exactGap);
      const current=parseFloat(lightFrame.style.height)||0;
      if(height>0&&Math.abs(current-height)>1)lightFrame.style.height=`${height}px`;
    }catch(_){}
  }

  function scheduleLightFit(){
    requestAnimationFrame(fitLightToLastCard);
    setTimeout(fitLightToLastCard,40);
    setTimeout(fitLightToLastCard,120);
    setTimeout(fitLightToLastCard,260);
    setTimeout(fitLightToLastCard,600);
  }

  function setupLightFrame(){
    try{
      const doc=lightFrame?.contentDocument;
      if(!doc)return;
      if(!doc.documentElement.classList.contains('bos-suite-embed')){
        clearTimeout(lightSetupRetry);
        lightSetupRetry=setTimeout(setupLightFrame,30);
        return;
      }

      injectStyle(doc,'bos-suite-unified-light',COMMON_LIGHT_CSS);

      if(doc.documentElement.dataset.bosUnifiedLight!=='1'){
        doc.documentElement.dataset.bosUnifiedLight='1';
        const root=doc.querySelector('.app-shell')||doc.body;
        const last=doc.getElementById('gelDetails');
        doc.addEventListener('toggle',scheduleLightFit,true);
        doc.addEventListener('click',()=>setTimeout(fitLightToLastCard,50),true);
        if('ResizeObserver' in window){
          const ro=new ResizeObserver(scheduleLightFit);
          if(root)ro.observe(root);
          if(last&&last!==root)ro.observe(last);
          lightFrame._bosUnifiedResizeObserver=ro;
        }
        if(!lightFrame._bosUnifiedHeightGuard){
          const guard=new MutationObserver(()=>requestAnimationFrame(fitLightToLastCard));
          guard.observe(lightFrame,{attributes:true,attributeFilter:['style']});
          lightFrame._bosUnifiedHeightGuard=guard;
        }
      }
      scheduleLightFit();
    }catch(_){}
  }

  function ensureNumber(doc,panel,selector,number){
    const head=panel?.querySelector(selector);
    if(!head)return;
    let badge=head.querySelector(':scope > .bos-suite-number');
    if(!badge){
      badge=doc.createElement('span');
      badge.className='bos-suite-number';
      head.prepend(badge);
    }
    badge.textContent=number;
    head.classList.add('bos-suite-numbered-head');
  }

  function moveExplorerNote(doc){
    const panel=doc.getElementById('readToolPanel');
    const head=panel?.querySelector('.quick-inline-head');
    const note=panel?.querySelector('.explorer-native-note');
    if(!panel||!head||!note)return;
    if(note.parentElement!==panel){
      note.classList.add('bos-suite-moved-note');
      head.insertAdjacentElement('afterend',note);
    }
  }

  function setupExpoFrame(){
    try{
      const doc=expoFrame?.contentDocument;
      if(!doc)return;
      injectStyle(doc,'bos-suite-unified-expo',COMMON_EXPO_CSS);

      doc.getElementById('cameraRefPanel')?.remove();
      moveExplorerNote(doc);

      const read=doc.getElementById('readToolPanel');
      const comp=doc.getElementById('simpleExpoPanel');
      ensureNumber(doc,read,'.quick-inline-head','05');
      ensureNumber(doc,comp,'.compact-section-head','06');

      /* app.js crée déjà le comportement repliable ; on ne touche qu'au rendu. */
      setTimeout(()=>{
        doc.getElementById('cameraRefPanel')?.remove();
        moveExplorerNote(doc);
        ensureNumber(doc,doc.getElementById('readToolPanel'),'.quick-inline-head','05');
        ensureNumber(doc,doc.getElementById('simpleExpoPanel'),'.compact-section-head','06');
      },120);
      setTimeout(()=>{
        doc.getElementById('cameraRefPanel')?.remove();
        moveExplorerNote(doc);
        ensureNumber(doc,doc.getElementById('simpleExpoPanel'),'.compact-section-head','06');
      },420);
    }catch(_){}
  }

  lightFrame?.addEventListener('load',setupLightFrame);
  expoFrame?.addEventListener('load',setupExpoFrame);

  if(lightFrame?.contentDocument?.readyState==='complete'||lightFrame?.contentDocument?.readyState==='interactive')setupLightFrame();
  if(expoFrame?.contentDocument?.readyState==='complete'||expoFrame?.contentDocument?.readyState==='interactive')setupExpoFrame();
})();
