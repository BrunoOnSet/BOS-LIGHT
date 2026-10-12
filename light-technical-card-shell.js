(function(){
  'use strict';

  const frame=document.getElementById('lightFrame');
  if(!frame)return;

  function apply(){
    let doc;
    try{doc=frame.contentDocument||null;}catch(_){return false;}
    if(!doc||!doc.head)return false;

    let style=doc.getElementById('bosTechnicalFixedCardShell');
    if(!style){
      style=doc.createElement('style');
      style.id='bosTechnicalFixedCardShell';
      doc.head.appendChild(style);
    }

    style.textContent=`
/* FICHES TECHNIQUES — la bulle reste strictement fixe ouverte ou fermée. */
html.bos-suite-embed #bosThreePointPanel,
html.bos-suite-embed #bosShadowHardnessPanel,
html.bos-suite-embed #bosMiniPlateau{
  border:0!important;
  background:transparent!important;
  box-shadow:none!important;
  overflow:visible!important;
  padding:0!important;
}

html.bos-suite-embed #bosThreePointPanel .bft-head,
html.bos-suite-embed #bosShadowHardnessPanel .bft-head,
html.bos-suite-embed #bosMiniPlateau .bft-head{
  height:78px!important;
  min-height:78px!important;
  max-height:78px!important;
  box-sizing:border-box!important;
  border:1px solid var(--bos-line,rgba(21,25,27,.085))!important;
  border-radius:18px!important;
  background:var(--bos-panel,#fff)!important;
  box-shadow:var(--bos-shadow,0 10px 34px rgba(22,31,35,.055),0 2px 8px rgba(22,31,35,.035))!important;
  overflow:hidden!important;
}

html.bos-suite-embed #bosThreePointPanel:not(.bmp-collapsed) .bft-head,
html.bos-suite-embed #bosShadowHardnessPanel:not(.bmp-collapsed) .bft-head,
html.bos-suite-embed #bosMiniPlateau:not(.bmp-collapsed) .bft-head{
  height:78px!important;
  min-height:78px!important;
  max-height:78px!important;
  border:1px solid var(--bos-line,rgba(21,25,27,.085))!important;
  border-radius:18px!important;
}

html.bos-suite-embed #bosThreePointPanel.bmp-collapsed,
html.bos-suite-embed #bosShadowHardnessPanel.bmp-collapsed,
html.bos-suite-embed #bosMiniPlateau.bmp-collapsed{
  height:78px!important;
  min-height:78px!important;
  max-height:78px!important;
}

html.bos-suite-embed #bosThreePointPanel .bft-body,
html.bos-suite-embed #bosShadowHardnessPanel .bft-body,
html.bos-suite-embed #bosMiniPlateau .bft-body{
  margin:0!important;
  padding:12px 18px 18px!important;
  border:0!important;
  background:transparent!important;
  box-shadow:none!important;
}

@media(max-width:520px){
  html.bos-suite-embed #bosThreePointPanel .bft-head,
  html.bos-suite-embed #bosShadowHardnessPanel .bft-head,
  html.bos-suite-embed #bosMiniPlateau .bft-head,
  html.bos-suite-embed #bosThreePointPanel:not(.bmp-collapsed) .bft-head,
  html.bos-suite-embed #bosShadowHardnessPanel:not(.bmp-collapsed) .bft-head,
  html.bos-suite-embed #bosMiniPlateau:not(.bmp-collapsed) .bft-head{
    height:78px!important;
    min-height:78px!important;
    max-height:78px!important;
    border-radius:16px!important;
  }

  html.bos-suite-embed #bosThreePointPanel.bmp-collapsed,
  html.bos-suite-embed #bosShadowHardnessPanel.bmp-collapsed,
  html.bos-suite-embed #bosMiniPlateau.bmp-collapsed{
    height:78px!important;
    min-height:78px!important;
    max-height:78px!important;
  }

  html.bos-suite-embed #bosThreePointPanel .bft-body,
  html.bos-suite-embed #bosShadowHardnessPanel .bft-body,
  html.bos-suite-embed #bosMiniPlateau .bft-body{
    padding:12px 15px 16px!important;
  }
}
`;
    return true;
  }

  function refresh(){
    apply();
    [60,180,500,1000,1800].forEach(ms=>setTimeout(apply,ms));
  }

  frame.addEventListener('load',refresh);
  refresh();
})();
