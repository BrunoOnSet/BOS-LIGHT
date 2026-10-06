(function(){
  'use strict';

  const expoFrame=document.getElementById('expoFrame');
  if(!expoFrame)return;

  const COMPACT_CSS=`
html.bos-suite-embed .bos-comp-v2{padding-top:10px!important}
html.bos-suite-embed .bos-comp-topline{margin-bottom:8px!important;gap:8px!important}
html.bos-suite-embed .bos-comp-auto-pill{min-height:26px!important;padding:0 9px!important;font-size:9px!important}
html.bos-suite-embed .bos-comp-mode-help{font-size:8.5px!important;line-height:1.2!important}
html.bos-suite-embed .bos-comp-rows{gap:6px!important}
html.bos-suite-embed .bos-comp-row{padding:6px 9px 5px!important;border-radius:11px!important}
html.bos-suite-embed .bos-comp-row-head{margin-bottom:2px!important;gap:7px!important;min-height:24px!important}
html.bos-suite-embed .bos-comp-label-wrap{gap:6px!important}
html.bos-suite-embed .bos-comp-label{font-size:9.5px!important;letter-spacing:.04em!important}
html.bos-suite-embed .bos-comp-unit-switch{padding:1px!important}
html.bos-suite-embed .bos-comp-unit-switch button{padding:3px 6px!important;font-size:7px!important}
html.bos-suite-embed .bos-comp-lock{width:24px!important;height:24px!important;flex-basis:24px!important}
html.bos-suite-embed .bos-comp-lock svg{width:11px!important;height:11px!important}
html.bos-suite-embed .bos-comp-range-line{grid-template-columns:minmax(0,1fr) 72px!important;gap:7px!important;min-height:14px!important}
html.bos-suite-embed .bos-comp-range{height:14px!important}
html.bos-suite-embed .bos-comp-value{font-size:10px!important;line-height:1!important}
html.bos-suite-embed .bos-comp-foot{margin-top:1px!important;font-size:7px!important;line-height:1.1!important}
html.bos-suite-embed .bos-comp-iso-warning{margin-top:4px!important;padding:5px 7px!important;border-radius:8px!important;font-size:8px!important;line-height:1.2!important}
html.bos-suite-embed .bos-comp-status{margin-top:8px!important;padding:7px 9px!important;border-radius:10px!important;font-size:8.5px!important;line-height:1.3!important}
@media(max-width:430px){
  html.bos-suite-embed .bos-comp-v2{padding-top:9px!important}
  html.bos-suite-embed .bos-comp-row{padding:5px 8px 4px!important}
  html.bos-suite-embed .bos-comp-range-line{grid-template-columns:minmax(0,1fr) 66px!important;gap:6px!important}
  html.bos-suite-embed .bos-comp-value{font-size:9.5px!important}
  html.bos-suite-embed .bos-comp-mode-help{font-size:8px!important}
}
`;

  function apply(){
    try{
      const doc=expoFrame.contentDocument;
      if(!doc||!doc.documentElement.classList.contains('bos-suite-embed'))return false;
      let style=doc.getElementById('bos-compensate-compact-style');
      if(!style){
        style=doc.createElement('style');
        style.id='bos-compensate-compact-style';
        (doc.head||doc.documentElement).appendChild(style);
      }
      style.textContent=COMPACT_CSS;
      return true;
    }catch(_){return false;}
  }

  function setup(){
    if(apply())return;
    setTimeout(setup,60);
  }

  expoFrame.addEventListener('load',function(){setTimeout(setup,100);});
  if(expoFrame.contentDocument?.readyState==='complete'||expoFrame.contentDocument?.readyState==='interactive')setTimeout(setup,100);
})();
