(function(){
  'use strict';

  const STORAGE_KEY='bos-light-bubbles-v1';
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
      Object.keys(DEFAULT_STATE).forEach(key=>{
        if(typeof saved[key]==='boolean')state[key]=saved[key];
      });
    }
  }catch(_){ }

  function save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){ }
  }

  function bindRootCamera(){
    const details=document.getElementById('sharedCameraDetails');
    if(!details||details.dataset.bosCollapseState==='1')return;
    details.dataset.bosCollapseState='1';
    details.open=!!state.camera;
    details.addEventListener('toggle',()=>{
      state.camera=details.open;
      save();
    });
  }

  function bindLightFrame(){
    const frame=document.getElementById('lightFrame');
    const doc=frame?.contentDocument;
    if(!doc)return false;

    const mapping=[
      ['lightDetails','light'],
      ['fillDetails','fill'],
      ['gelDetails','gel']
    ];

    let ready=true;
    mapping.forEach(([id,key])=>{
      const details=doc.getElementById(id);
      if(!details){ready=false;return;}
      if(details.dataset.bosCollapseState==='1')return;
      details.dataset.bosCollapseState='1';
      details.open=!!state[key];
      details.addEventListener('toggle',()=>{
        state[key]=details.open;
        save();
      });
    });
    return ready;
  }

  function setExpoOpen(panel,button,content,open){
    panel.classList.toggle('collapsed',!open);
    panel.classList.toggle('bos-suite-collapsed',!open);
    if(content)content.hidden=!open;
    if(button)button.setAttribute('aria-expanded',open?'true':'false');
  }

  function bindExpoPanel(doc,id,key){
    const panel=doc.getElementById(id);
    if(!panel)return false;
    const button=panel.querySelector('.panel-collapse-btn');
    const content=panel.querySelector('.panel-collapse-content');
    if(!button||!content)return false;

    if(panel.dataset.bosCollapseState!=='1'){
      panel.dataset.bosCollapseState='1';
      setExpoOpen(panel,button,content,!!state[key]);

      const syncFromPanel=()=>{
        const open=button.getAttribute('aria-expanded')==='true'&&!content.hidden;
        panel.classList.toggle('bos-suite-collapsed',!open);
        state[key]=open;
        save();
      };

      const observer=new MutationObserver(syncFromPanel);
      observer.observe(button,{attributes:true,attributeFilter:['aria-expanded']});
      observer.observe(content,{attributes:true,attributeFilter:['hidden']});
      panel._bosCollapseObserver=observer;
    }
    return true;
  }

  function bindExpoFrame(){
    const frame=document.getElementById('expoFrame');
    const doc=frame?.contentDocument;
    if(!doc)return false;
    const a=bindExpoPanel(doc,'readToolPanel','dynamics');
    const b=bindExpoPanel(doc,'simpleExpoPanel','compensate');
    return a&&b;
  }

  function retry(fn,tries=40){
    let count=0;
    const run=()=>{
      if(fn())return;
      count+=1;
      if(count<tries)setTimeout(run,50);
    };
    run();
  }

  bindRootCamera();

  const lightFrame=document.getElementById('lightFrame');
  const expoFrame=document.getElementById('expoFrame');

  lightFrame?.addEventListener('load',()=>retry(bindLightFrame));
  expoFrame?.addEventListener('load',()=>retry(bindExpoFrame));

  if(lightFrame?.contentDocument?.readyState==='complete'||lightFrame?.contentDocument?.readyState==='interactive')retry(bindLightFrame);
  if(expoFrame?.contentDocument?.readyState==='complete'||expoFrame?.contentDocument?.readyState==='interactive')retry(bindExpoFrame);
})();
