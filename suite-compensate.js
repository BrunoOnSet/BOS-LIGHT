(function(){
  'use strict';

  const expoFrame=document.getElementById('expoFrame');
  if(!expoFrame)return;

  const COMP_CSS=`
html.bos-suite-embed #simpleExpoPanelContent{padding-top:0!important}
html.bos-suite-embed #simpleExpoPanelContent>.bos-comp-legacy{display:none!important}
html.bos-suite-embed .bos-comp-v2{padding:16px 0 0}
html.bos-suite-embed .bos-comp-topline{display:flex;align-items:center;justify-content:flex-start;gap:10px;margin:0 0 14px}
html.bos-suite-embed .bos-comp-auto-pill{display:inline-flex;align-items:center;gap:7px;min-height:30px;padding:0 11px;border:1px solid var(--line);border-radius:999px;background:var(--panel2);color:var(--muted);font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:10px;font-weight:700;letter-spacing:.08em;cursor:pointer}
html.bos-suite-embed .bos-comp-auto-pill .bos-comp-dot{width:7px;height:7px;border-radius:50%;background:var(--muted);box-shadow:0 0 0 3px rgba(110,115,122,.13)}
html.bos-suite-embed .bos-comp-auto-pill.is-on{border-color:#2F5B66;background:rgba(47,91,102,.14);color:#2F5B66}
html.bos-suite-embed .bos-comp-auto-pill.is-on .bos-comp-dot{background:#2F5B66;box-shadow:0 0 0 3px rgba(47,91,102,.14)}
html.bos-suite-embed body.dark .bos-comp-auto-pill.is-on{color:#7FA7B0;background:rgba(47,91,102,.22)}
html.bos-suite-embed body.dark .bos-comp-auto-pill.is-on .bos-comp-dot{background:#7FA7B0}
html.bos-suite-embed .bos-comp-mode-help{color:var(--muted);font-size:9.5px;line-height:1.3}
html.bos-suite-embed .bos-comp-rows{display:grid;gap:10px}
html.bos-suite-embed .bos-comp-row{padding:12px 13px 11px;border:1px solid var(--line);border-radius:14px;background:var(--field-bg,var(--panel2));transition:border-color .15s ease,background .15s ease}
html.bos-suite-embed .bos-comp-row-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
html.bos-suite-embed .bos-comp-label-wrap{display:flex;align-items:center;gap:8px;min-width:0}
html.bos-suite-embed .bos-comp-label{color:var(--text);font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:11px;font-weight:700;letter-spacing:.05em}
html.bos-suite-embed .bos-comp-unit-switch{display:inline-flex;gap:2px;padding:2px;border:1px solid var(--line);border-radius:999px;background:var(--panel)}
html.bos-suite-embed .bos-comp-unit-switch button{border:0;border-radius:999px;background:transparent;color:var(--muted);padding:4px 7px;font-size:8px;font-weight:800;letter-spacing:.06em;cursor:pointer}
html.bos-suite-embed .bos-comp-unit-switch button.active{background:#2F5B66;color:#fff}
html.bos-suite-embed .bos-comp-lock{width:29px;height:29px;display:grid;place-items:center;flex:0 0 29px;border:1px solid var(--line);border-radius:50%;background:var(--panel);color:var(--muted);padding:0;cursor:pointer}
html.bos-suite-embed .bos-comp-lock svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
html.bos-suite-embed .bos-comp-lock .lock-closed{display:none}
html.bos-suite-embed .bos-comp-lock.locked{color:#2F5B66;border-color:#2F5B66;background:rgba(47,91,102,.12)}
html.bos-suite-embed .bos-comp-lock.locked .lock-open{display:none}
html.bos-suite-embed .bos-comp-lock.locked .lock-closed{display:block}
html.bos-suite-embed body.dark .bos-comp-lock.locked{color:#7FA7B0;background:rgba(47,91,102,.22)}
html.bos-suite-embed .bos-comp-range-line{display:grid;grid-template-columns:minmax(0,1fr) 92px;gap:11px;align-items:center}
html.bos-suite-embed .bos-comp-range{width:100%;margin:0!important;accent-color:#2F5B66;cursor:pointer}
html.bos-suite-embed .bos-comp-value{min-width:0;text-align:right;color:#2F5B66;font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
html.bos-suite-embed body.dark .bos-comp-value{color:#7FA7B0}
html.bos-suite-embed .bos-comp-foot{display:flex;justify-content:space-between;gap:10px;margin-top:5px;color:var(--muted);font-size:8px;line-height:1.25}
html.bos-suite-embed .bos-comp-foot span:last-child{text-align:right}
html.bos-suite-embed .bos-comp-iso-warning{display:none;margin:8px 0 0;padding:8px 10px;border:1px solid rgba(201,120,22,.45);border-radius:10px;background:rgba(201,120,22,.09);color:#B76600;font-size:9px;line-height:1.35;font-weight:700}
html.bos-suite-embed .bos-comp-row.is-over-iso{border-color:rgba(201,120,22,.55);background:rgba(201,120,22,.055)}
html.bos-suite-embed .bos-comp-row.is-over-iso .bos-comp-value{color:#C97816!important}
html.bos-suite-embed .bos-comp-row.is-over-iso .bos-comp-range{accent-color:#C97816}
html.bos-suite-embed .bos-comp-row.is-over-iso .bos-comp-iso-warning{display:block}
html.bos-suite-embed body.dark .bos-comp-row.is-over-iso{border-color:rgba(228,160,74,.55);background:rgba(228,160,74,.09)}
html.bos-suite-embed body.dark .bos-comp-row.is-over-iso .bos-comp-value{color:#E4A04A!important}
html.bos-suite-embed body.dark .bos-comp-row.is-over-iso .bos-comp-range{accent-color:#E4A04A}
html.bos-suite-embed body.dark .bos-comp-iso-warning{border-color:rgba(228,160,74,.48);background:rgba(228,160,74,.10);color:#E4A04A}
html.bos-suite-embed .bos-comp-status{margin-top:12px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--panel2);color:var(--muted);font-size:9.5px;line-height:1.4;font-weight:650}
html.bos-suite-embed .bos-comp-status.is-ok{border-color:rgba(47,91,102,.38);color:#2F5B66;background:rgba(47,91,102,.08)}
html.bos-suite-embed .bos-comp-status.is-warning{border-color:rgba(164,126,62,.42);color:var(--text)}
html.bos-suite-embed body.dark .bos-comp-status.is-ok{color:#7FA7B0;background:rgba(47,91,102,.18)}
@media(max-width:430px){
  html.bos-suite-embed .bos-comp-v2{padding-top:14px}
  html.bos-suite-embed .bos-comp-row{padding:11px}
  html.bos-suite-embed .bos-comp-range-line{grid-template-columns:minmax(0,1fr) 78px;gap:8px}
  html.bos-suite-embed .bos-comp-value{font-size:11px}
  html.bos-suite-embed .bos-comp-mode-help{font-size:9px}
}
`;

  function inject(){
    try{
      const doc=expoFrame.contentDocument;
      if(!doc||!doc.documentElement.classList.contains('bos-suite-embed'))return false;

      let style=doc.getElementById('bos-compensate-v2-style');
      if(!style){
        style=doc.createElement('style');
        style.id='bos-compensate-v2-style';
        (doc.head||doc.documentElement).appendChild(style);
      }
      style.textContent=COMP_CSS;

      if(doc.getElementById('bos-compensate-v2-script'))return true;
      const script=doc.createElement('script');
      script.id='bos-compensate-v2-script';
      script.textContent=`
(function(){
  'use strict';
  if(window.BOSCompensateV2)return;

  const panel=document.getElementById('simpleExpoPanel');
  if(!panel)return;
  const content=panel.querySelector('.panel-collapse-content')||panel;
  const head=panel.querySelector('.compact-section-head');
  if(!head)return;

  const oldSubtitle=head.querySelector('.panel-subtitle');
  if(oldSubtitle)oldSubtitle.textContent='ISO, diaph, shutter et ND avec compensation automatique.';

  const legacy=[...content.children].filter(function(el){return !el.classList.contains('bos-comp-v2');});
  legacy.forEach(function(el){el.classList.add('bos-comp-legacy');});
  document.getElementById('bosCompensateV2')?.remove();

  const ui=document.createElement('div');
  ui.className='bos-comp-v2';
  ui.id='bosCompensateV2';
  ui.innerHTML=''
    +'<div class="bos-comp-topline">'
      +'<button type="button" class="bos-comp-auto-pill" id="bosCompAuto" aria-pressed="false"><span class="bos-comp-dot"></span><strong>OFF</strong></button>'
      +'<span class="bos-comp-mode-help" id="bosCompModeHelp">Réglage manuel : chaque ligne est indépendante.</span>'
    +'</div>'
    +'<div class="bos-comp-rows">'
      +'<div class="bos-comp-row" data-bos-comp-key="iso">'
        +'<div class="bos-comp-row-head">'
          +'<div class="bos-comp-label-wrap"><span class="bos-comp-label" id="bosCompIsoLabel">ISO</span><span class="bos-comp-unit-switch"><button type="button" data-bos-iso-mode="iso" class="active">ISO</button><button type="button" data-bos-iso-mode="gain">GAIN</button></span></div>'
          +'<button type="button" class="bos-comp-lock" data-bos-comp-lock="iso" aria-label="Verrouiller ISO"><svg class="lock-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 9.2-2.7"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg><svg class="lock-closed" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg></button>'
        +'</div>'
        +'<div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompIso" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompIsoValue">—</output></div>'
        +'<div class="bos-comp-foot"><span id="bosCompIsoMin">—</span><span id="bosCompIsoHint">—</span></div>'
        +'<div class="bos-comp-iso-warning" id="bosCompIsoWarning"></div>'
      +'</div>'
      +'<div class="bos-comp-row" data-bos-comp-key="aperture">'
        +'<div class="bos-comp-row-head"><span class="bos-comp-label">DIAPH</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="aperture" aria-label="Verrouiller le diaph"><svg class="lock-open" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 9.2-2.7"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg><svg class="lock-closed" viewBox="0 0 24 24"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg></button></div>'
        +'<div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompAperture" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompApertureValue">—</output></div>'
        +'<div class="bos-comp-foot"><span>Ouvert</span><span>Fermé</span></div>'
      +'</div>'
      +'<div class="bos-comp-row" data-bos-comp-key="shutter">'
        +'<div class="bos-comp-row-head"><span class="bos-comp-label">SHUTTER</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="shutter" aria-label="Verrouiller le shutter"><svg class="lock-open" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 9.2-2.7"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg><svg class="lock-closed" viewBox="0 0 24 24"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg></button></div>'
        +'<div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompShutter" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompShutterValue">—</output></div>'
        +'<div class="bos-comp-foot"><span>Lent</span><span>Rapide</span></div>'
      +'</div>'
      +'<div class="bos-comp-row" data-bos-comp-key="nd">'
        +'<div class="bos-comp-row-head"><span class="bos-comp-label">ND</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="nd" aria-label="Verrouiller le ND"><svg class="lock-open" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 9.2-2.7"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg><svg class="lock-closed" viewBox="0 0 24 24"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg></button></div>'
        +'<div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompNd" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompNdValue">—</output></div>'
        +'<div class="bos-comp-foot"><span>0 stop</span><span>8 stops</span></div>'
      +'</div>'
    +'</div>'
    +'<div class="bos-comp-status" id="bosCompStatus">Mode manuel.</div>';
  content.prepend(ui);

  const state={on:false,target:null,isoMode:'iso',locks:{iso:false,aperture:false,shutter:false,nd:false},values:{aperture:2.8,iso:800,shutter:50,nd:0},residual:0};
  try{
    const saved=JSON.parse(localStorage.getItem('bos-light-compensate-v2')||'null');
    if(saved&&saved.isoMode==='gain')state.isoMode='gain';
    if(saved&&saved.locks)Object.keys(state.locks).forEach(function(k){state.locks[k]=!!saved.locks[k];});
  }catch(_){ }

  const byId=function(id){return document.getElementById(id);};
  const parentValue=function(id){try{return parent.document.getElementById(id)?.value||'';}catch(_){return '';}};
  const num=function(v){return Number(String(v==null?'':v).replace(',','.'));};
  const log2=function(v){return Math.log(v)/Math.LN2;};
  const fmt=function(v){return Number(v).toLocaleString('fr-FR',{maximumFractionDigits:1});};
  const fmtAperture=function(v){return Number(v).toLocaleString('fr-FR',{maximumFractionDigits:1});};
  const save=function(){try{localStorage.setItem('bos-light-compensate-v2',JSON.stringify({isoMode:state.isoMode,locks:state.locks}));}catch(_){}};

  function acceptedIsoMax(){
    const v=num(parentValue('sharedLightIso'));
    if(v>0)return v;
    try{return typeof simpleDefaultMax==='function'?simpleDefaultMax():51200;}catch(_){return 51200;}
  }
  function bases(){
    try{const v=currentBaseIsos();return Array.isArray(v)&&v.length?v.map(Number).filter(function(n){return n>0;}).sort(function(a,b){return a-b;}):[800];}catch(_){return [800];}
  }
  function gainBase(){
    try{if(Number(gainBaseIso)>0)return Number(gainBaseIso);}catch(_){ }
    return bases()[0]||800;
  }
  function activeNative(iso){
    const b=bases();
    let active=b[0]||800;
    b.forEach(function(v){if(v<=iso+1e-9)active=v;});
    return active;
  }
  function isoFromGain(db){
    try{if(typeof gainDbToIso==='function'){const v=Number(gainDbToIso(db));if(v>0)return v;}}catch(_){ }
    return gainBase()*Math.pow(2,Number(db)/6);
  }
  function gainFromIso(iso){
    try{if(typeof isoToGainDb==='function'){const v=Number(isoToGainDb(iso));if(Number.isFinite(v))return v;}}catch(_){ }
    return 6*log2(Number(iso)/gainBase());
  }
  function cameraIsoValues(){
    let vals=[];
    try{vals=simpleAvailableIsoValues().slice();}catch(_){vals=[50,64,80,100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800,16000,20000,25600,32000,40000,51200];}
    vals=vals.map(Number).filter(function(v){return Number.isFinite(v)&&v>0;}).sort(function(a,b){return a-b;});
    vals=[...new Set(vals.map(function(v){return Math.round(v*1000)/1000;}))];
    return vals.length?vals:[bases()[0]||800];
  }
  function isoCandidates(){
    const cameraVals=cameraIsoValues();
    if(state.isoMode!=='gain')return cameraVals;
    const minIso=cameraVals[0],maxIso=cameraVals[cameraVals.length-1];
    let vals=[];
    try{vals=GAIN_VALUES.map(function(v){return isoFromGain(v);});}catch(_){for(let g=-12;g<=54;g+=1)vals.push(isoFromGain(g));}
    vals=vals.map(Number).filter(function(v){return Number.isFinite(v)&&v>0&&v>=minIso-1e-8&&v<=maxIso+1e-8;}).sort(function(a,b){return a-b;});
    vals=[...new Set(vals.map(function(v){return Math.round(v*1000)/1000;}))];
    return vals.length?vals:cameraVals;
  }
  function candidates(key){
    if(key==='iso')return isoCandidates();
    if(key==='aperture'){try{return simpleAvailableApertureValues().slice();}catch(_){return [1,1.4,2,2.8,4,5.6,8,11,16,22];}}
    if(key==='shutter'){try{return SHUTTER_SPEEDS.slice();}catch(_){return [25,40,50,100,200,400,800];}}
    if(key==='nd'){try{return ND_STOPS.slice();}catch(_){return [0,1,2,3,4,5,6,7,8];}}
    return [];
  }
  function stopFor(key,value){
    const v=Number(value);
    if(key==='aperture')return -2*log2(v);
    if(key==='iso')return log2(v);
    if(key==='shutter')return -log2(v);
    if(key==='nd')return -v;
    return 0;
  }
  function total(values){
    const v=values||state.values;
    return ['aperture','iso','shutter','nd'].reduce(function(s,k){return s+stopFor(k,v[k]);},0);
  }
  function nearestIndex(vals,value,key){
    let best=0,d=Infinity;
    vals.forEach(function(v,i){
      const x=key==='iso'?Math.abs(stopFor('iso',v)-stopFor('iso',value)):Math.abs(Number(v)-Number(value));
      if(x<d){d=x;best=i;}
    });
    return best;
  }
  function snapValue(key,value){
    const vals=candidates(key);
    return vals[nearestIndex(vals,value,key)]??value;
  }
  function formatValue(key,value){
    if(key==='iso'){
      if(state.isoMode==='gain'){
        const db=gainFromIso(value);
        const s=Math.abs(db)<.05?'0':(db>0?'+':'')+fmt(db);
        return s+' dB';
      }
      return 'ISO '+Math.round(value).toLocaleString('fr-FR');
    }
    if(key==='aperture')return 'f/'+fmtAperture(value);
    if(key==='shutter')return '1/'+fmt(value);
    if(key==='nd')return Number(value)===0?'0 stop':fmt(value)+' stops';
    return String(value);
  }
  function readInitialValues(){
    let v={aperture:2.8,iso:bases()[0]||800,shutter:50,nd:0};
    try{if(typeof simplePhysicalValues==='function')v={...v,...simplePhysicalValues()};}catch(_){ }
    const ap=num(parentValue('sharedLightAperture'));if(ap>0)v.aperture=ap;
    const sh=num(parentValue('sharedLightShutter'));if(sh>0)v.shutter=sh;
    v.iso=Number(v.iso)||bases()[0]||800;
    Object.keys(v).forEach(function(k){v[k]=snapValue(k,v[k]);});
    return v;
  }
  function applyPhysical(){
    try{if(typeof simpleSetCurrentFromValues==='function')simpleSetCurrentFromValues({...state.values});}catch(_){ }
  }
  function bestCandidate(key,current,remaining){
    let vals=candidates(key);
    if(key==='iso'){
      const maxAccepted=acceptedIsoMax();
      if(remaining<0){
        const floor=activeNative(current);
        vals=vals.filter(function(v){return v>=floor-1e-8&&v<=current+1e-8;});
      }else if(remaining>0){
        vals=vals.filter(function(v){return v>=current-1e-8&&v<=maxAccepted+1e-8;});
      }
    }
    if(!vals.length)return current;
    const currentStop=stopFor(key,current);
    const target=currentStop+remaining;
    let best=current,diff=Infinity;
    vals.forEach(function(v){
      const move=stopFor(key,v)-currentStop;
      if(remaining>0&&move<-1e-8)return;
      if(remaining<0&&move>1e-8)return;
      const d=Math.abs(stopFor(key,v)-target);
      if(d<diff-1e-12){diff=d;best=v;}
    });
    return best;
  }
  function compensate(changedKey){
    if(!state.on||state.target===null)return;
    let remaining=state.target-total();
    const order=remaining<0?['iso','nd','aperture','shutter']:['iso','aperture','nd','shutter'];
    for(const key of order){
      if(Math.abs(remaining)<0.025)break;
      if(key===changedKey||state.locks[key])continue;
      const before=state.values[key];
      const beforeStop=stopFor(key,before);
      const next=bestCandidate(key,before,remaining);
      if(!Number.isFinite(next)||Math.abs(next-before)<1e-9)continue;
      state.values[key]=next;
      remaining-=stopFor(key,next)-beforeStop;
    }
    state.residual=state.target-total();
  }
  function renderIsoWarning(){
    const row=document.querySelector('[data-bos-comp-key="iso"]');
    const warning=byId('bosCompIsoWarning');
    if(!row||!warning)return;
    const max=acceptedIsoMax();
    const over=state.values.iso>max+1e-8;
    row.classList.toggle('is-over-iso',over);
    warning.textContent=over?'Attention : sensibilité au-dessus du maximum accepté dans Réglages caméra (ISO '+Math.round(max).toLocaleString('fr-FR')+').':'';
  }
  function renderStatus(){
    const el=byId('bosCompStatus');
    const help=byId('bosCompModeHelp');
    if(!el||!help)return;
    el.classList.remove('is-ok','is-warning');
    if(!state.on){
      el.textContent='Mode manuel : les quatre réglages restent indépendants.';
      help.textContent='Réglage manuel : chaque ligne est indépendante.';
      return;
    }
    help.textContent='Compensation automatique sur les réglages non verrouillés.';
    const r=state.target-total();
    if(Math.abs(r)<0.08){
      el.textContent='EXPOSITION CONSERVÉE · ISO jusqu’au seuil accepté, puis diaph / ND selon le sens de correction.';
      el.classList.add('is-ok');
    }else{
      el.textContent=(r>0?'+':'')+fmt(r)+' stop restant : limite atteinte ou réglage verrouillé.';
      el.classList.add('is-warning');
    }
  }
  function render(){
    const auto=byId('bosCompAuto');
    auto?.classList.toggle('is-on',state.on);
    auto?.setAttribute('aria-pressed',state.on?'true':'false');
    const strong=auto?.querySelector('strong');if(strong)strong.textContent=state.on?'ON':'OFF';
    byId('bosCompIsoLabel').textContent=state.isoMode==='gain'?'GAIN':'ISO';
    document.querySelectorAll('[data-bos-iso-mode]').forEach(function(btn){btn.classList.toggle('active',btn.dataset.bosIsoMode===state.isoMode);});
    document.querySelectorAll('[data-bos-comp-lock]').forEach(function(btn){
      const key=btn.dataset.bosCompLock,locked=!!state.locks[key];
      btn.classList.toggle('locked',locked);btn.setAttribute('aria-pressed',locked?'true':'false');
    });
    const map={iso:['bosCompIso','bosCompIsoValue'],aperture:['bosCompAperture','bosCompApertureValue'],shutter:['bosCompShutter','bosCompShutterValue'],nd:['bosCompNd','bosCompNdValue']};
    Object.entries(map).forEach(function(entry){
      const key=entry[0],sliderId=entry[1][0],outId=entry[1][1];
      const vals=candidates(key),slider=byId(sliderId),out=byId(outId);
      const idx=nearestIndex(vals,state.values[key],key);
      state.values[key]=vals[idx]??state.values[key];
      if(slider){slider.max=String(Math.max(0,vals.length-1));slider.value=String(idx);slider.disabled=vals.length<=1;}
      if(out)out.textContent=formatValue(key,state.values[key]);
    });
    const isoVals=candidates('iso');
    byId('bosCompIsoMin').textContent=formatValue('iso',isoVals[0]);
    if(state.isoMode==='gain'){
      byId('bosCompIsoHint').textContent='0 dB = ISO '+Math.round(gainBase()).toLocaleString('fr-FR')+' · accepté ISO '+Math.round(acceptedIsoMax()).toLocaleString('fr-FR');
    }else{
      byId('bosCompIsoHint').textContent='Natif actif '+Math.round(activeNative(state.values.iso)).toLocaleString('fr-FR')+' · accepté '+Math.round(acceptedIsoMax()).toLocaleString('fr-FR');
    }
    renderIsoWarning();
    renderStatus();
    applyPhysical();
  }
  function changeFromSlider(key,slider){
    const vals=candidates(key);
    const idx=Math.max(0,Math.min(vals.length-1,Number(slider.value)||0));
    state.values[key]=vals[idx];
    compensate(key);
    render();
  }
  function refreshFromCamera(){
    state.on=false;state.target=null;state.residual=0;
    state.values=readInitialValues();
    render();
  }

  state.values=readInitialValues();

  byId('bosCompAuto')?.addEventListener('click',function(){
    state.on=!state.on;
    state.target=state.on?total():null;
    state.residual=0;
    render();
  });
  document.querySelectorAll('[data-bos-comp-lock]').forEach(function(btn){btn.addEventListener('click',function(){
    const key=btn.dataset.bosCompLock;state.locks[key]=!state.locks[key];save();render();
  });});
  document.querySelectorAll('[data-bos-iso-mode]').forEach(function(btn){btn.addEventListener('click',function(){
    state.isoMode=btn.dataset.bosIsoMode==='gain'?'gain':'iso';save();state.values.iso=snapValue('iso',state.values.iso);render();
  });});
  [['iso','bosCompIso'],['aperture','bosCompAperture'],['shutter','bosCompShutter'],['nd','bosCompNd']].forEach(function(pair){byId(pair[1])?.addEventListener('input',function(e){changeFromSlider(pair[0],e.target);});});
  byId('simpleResetBtn')?.addEventListener('click',function(){setTimeout(refreshFromCamera,0);});

  ['sharedCameraBrand','sharedCameraModel','sharedCameraGamma','sharedLightAperture','sharedLightShutter'].forEach(function(id){
    try{parent.document.getElementById(id)?.addEventListener('change',function(){setTimeout(refreshFromCamera,160);});}catch(_){ }
  });
  try{parent.document.getElementById('sharedLightIso')?.addEventListener('change',function(){setTimeout(render,80);});}catch(_){ }

  window.BOSCompensateV2={refresh:refreshFromCamera,state:state};
  render();
})();
`;
      (doc.body||doc.documentElement).appendChild(script);
      return true;
    }catch(_){return false;}
  }

  function setup(){
    if(inject())return;
    setTimeout(setup,60);
  }

  expoFrame.addEventListener('load',function(){setTimeout(setup,80);});
  if(expoFrame.contentDocument?.readyState==='complete'||expoFrame.contentDocument?.readyState==='interactive')setTimeout(setup,80);
})();
