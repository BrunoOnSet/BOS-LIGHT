(function(){
  'use strict';

  const expoFrame=document.getElementById('expoFrame');
  if(!expoFrame)return;

  const COMP_CSS=`
html.bos-suite-embed .bos-comp-legacy{display:none!important}
html.bos-suite-embed .bos-comp-v3{padding:16px 0 0}
html.bos-suite-embed .bos-comp-topline{display:flex;align-items:center;gap:10px;margin:0 0 14px}
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
  html.bos-suite-embed .bos-comp-v3{padding-top:14px}
  html.bos-suite-embed .bos-comp-row{padding:11px}
  html.bos-suite-embed .bos-comp-range-line{grid-template-columns:minmax(0,1fr) 78px;gap:8px}
  html.bos-suite-embed .bos-comp-value{font-size:11px}
  html.bos-suite-embed .bos-comp-mode-help{font-size:9px}
}
`;

  const ISO_FALLBACK=[50,64,80,100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800,16000,20000,25600,32000,40000,51200];
  const APERTURE_FALLBACK=[1,1.1,1.2,1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];
  const SHUTTER_VALUES=[25,40,50,100,200,400,800];
  const ND_VALUES=[0,1,2,3,4,5,6,7,8];

  function uniqSorted(values){return [...new Set(values.map(Number).filter(v=>Number.isFinite(v)&&v>0))].sort((a,b)=>a-b);}
  function parseNum(value){const n=Number(String(value??'').replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:NaN;}
  function rootValue(id){return parseNum(document.getElementById(id)?.value);}
  function childValue(doc,id){return parseNum(doc.getElementById(id)?.value);}
  function optionValues(doc,id){const select=doc.getElementById(id);if(!select)return [];return uniqSorted([...select.options].map(o=>parseNum(o.value)));}
  function currentBases(doc){
    const text=doc.getElementById('baseIsoNote')?.textContent||'';
    const nums=(text.match(/\d[\d\s\u00a0.]*/g)||[]).map(s=>Number(s.replace(/[^\d.]/g,''))).filter(v=>Number.isFinite(v)&&v>0);
    const vals=uniqSorted(nums);return vals.length?vals:[800];
  }
  function acceptedIsoMax(){const v=rootValue('sharedLightIso');return v>0?v:51200;}
  function activeNative(doc,iso){const vals=currentBases(doc);let active=vals[0]||800;vals.forEach(v=>{if(v<=iso+1e-9)active=v;});return active;}
  function log2(v){return Math.log(v)/Math.LN2;}
  function stopFor(key,value){const v=Number(value);if(key==='aperture')return -2*log2(v);if(key==='iso')return log2(v);if(key==='shutter')return -log2(v);if(key==='nd')return -v;return 0;}
  function total(values){return ['aperture','iso','shutter','nd'].reduce((sum,key)=>sum+stopFor(key,values[key]),0);}
  function nearestIndex(values,value,key){let best=0,d=Infinity;values.forEach((v,i)=>{const diff=key==='iso'?Math.abs(log2(v/value)):Math.abs(Number(v)-Number(value));if(diff<d){d=diff;best=i;}});return best;}
  function lockSvg(){return '<svg class="lock-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 9.2-2.7"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg><svg class="lock-closed" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="5" y="10" width="14" height="10" rx="2"/></svg>';}

  function setup(){
    try{
      const doc=expoFrame.contentDocument;
      if(!doc||!doc.documentElement.classList.contains('bos-suite-embed')){setTimeout(setup,50);return;}
      const panel=doc.getElementById('simpleExpoPanel');
      const head=panel?.querySelector('.compact-section-head');
      if(!panel||!head){setTimeout(setup,50);return;}

      if(doc.getElementById('bos-compensate-v3-style')===null){
        const style=doc.createElement('style');style.id='bos-compensate-v3-style';style.textContent=COMP_CSS;(doc.head||doc.documentElement).appendChild(style);
      }

      doc.defaultView.BOSCompensateV2={nativeParent:true};
      doc.getElementById('bos-compensate-v2-script')?.remove();
      doc.getElementById('bosCompensateV2')?.remove();
      if(doc.getElementById('bosCompensateV3'))return;

      const subtitle=head.querySelector('.panel-subtitle');if(subtitle)subtitle.textContent='ISO, diaph, shutter et ND avec compensation automatique.';
      const host=panel.querySelector('.panel-collapse-content')||panel;
      [...host.children].forEach(el=>{if(el!==head&&!el.classList.contains('bos-comp-v3'))el.classList.add('bos-comp-legacy');});

      const ui=doc.createElement('div');ui.className='bos-comp-v3';ui.id='bosCompensateV3';
      ui.innerHTML=
        '<div class="bos-comp-topline"><button type="button" class="bos-comp-auto-pill" id="bosCompAuto" aria-pressed="false"><span class="bos-comp-dot"></span><strong>OFF</strong></button><span class="bos-comp-mode-help" id="bosCompModeHelp">Réglage manuel : chaque ligne est indépendante.</span></div>'+
        '<div class="bos-comp-rows">'+
          '<div class="bos-comp-row" data-bos-comp-key="iso"><div class="bos-comp-row-head"><div class="bos-comp-label-wrap"><span class="bos-comp-label" id="bosCompIsoLabel">ISO</span><span class="bos-comp-unit-switch"><button type="button" data-bos-iso-mode="iso" class="active">ISO</button><button type="button" data-bos-iso-mode="gain">GAIN</button></span></div><button type="button" class="bos-comp-lock" data-bos-comp-lock="iso" aria-label="Verrouiller ISO">'+lockSvg()+'</button></div><div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompIso" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompIsoValue">—</output></div><div class="bos-comp-foot"><span id="bosCompIsoMin">—</span><span id="bosCompIsoHint">—</span></div><div class="bos-comp-iso-warning" id="bosCompIsoWarning"></div></div>'+
          '<div class="bos-comp-row" data-bos-comp-key="aperture"><div class="bos-comp-row-head"><span class="bos-comp-label">DIAPH</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="aperture" aria-label="Verrouiller le diaph">'+lockSvg()+'</button></div><div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompAperture" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompApertureValue">—</output></div><div class="bos-comp-foot"><span>Ouvert</span><span>Fermé</span></div></div>'+
          '<div class="bos-comp-row" data-bos-comp-key="shutter"><div class="bos-comp-row-head"><span class="bos-comp-label">SHUTTER</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="shutter" aria-label="Verrouiller le shutter">'+lockSvg()+'</button></div><div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompShutter" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompShutterValue">—</output></div><div class="bos-comp-foot"><span>Lent</span><span>Rapide</span></div></div>'+
          '<div class="bos-comp-row" data-bos-comp-key="nd"><div class="bos-comp-row-head"><span class="bos-comp-label">ND</span><button type="button" class="bos-comp-lock" data-bos-comp-lock="nd" aria-label="Verrouiller le ND">'+lockSvg()+'</button></div><div class="bos-comp-range-line"><input class="bos-comp-range" id="bosCompNd" type="range" min="0" max="1" step="1"><output class="bos-comp-value" id="bosCompNdValue">—</output></div><div class="bos-comp-foot"><span>0 stop</span><span>8 stops</span></div></div>'+
        '</div><div class="bos-comp-status" id="bosCompStatus">Mode manuel.</div>';

      if(host===panel)head.insertAdjacentElement('afterend',ui);else host.prepend(ui);

      const q=id=>doc.getElementById(id);
      const state={on:false,target:null,isoMode:'iso',locks:{iso:false,aperture:false,shutter:false,nd:false},values:{aperture:2.8,iso:800,shutter:50,nd:0}};
      try{const saved=JSON.parse(localStorage.getItem('bos-light-compensate-v3')||'null');if(saved?.isoMode==='gain')state.isoMode='gain';if(saved?.locks)Object.keys(state.locks).forEach(k=>state.locks[k]=!!saved.locks[k]);}catch(_){}
      const save=()=>{try{localStorage.setItem('bos-light-compensate-v3',JSON.stringify({isoMode:state.isoMode,locks:state.locks}));}catch(_){}};

      function candidates(key){
        if(key==='iso'){const vals=optionValues(doc,'isoMaxSelect');return vals.length?vals:ISO_FALLBACK.slice();}
        if(key==='aperture'){const vals=optionValues(doc,'apertureMaxSelect');return vals.length?vals:APERTURE_FALLBACK.slice();}
        if(key==='shutter')return SHUTTER_VALUES.slice();
        if(key==='nd')return ND_VALUES.slice();
        return [];
      }
      function snap(key,value){const vals=candidates(key);return vals[nearestIndex(vals,value,key)]??value;}
      function format(key,value){
        if(key==='iso'){
          if(state.isoMode==='gain'){const base=activeNative(doc,value);const db=6*log2(value/base);const text=Math.abs(db)<.05?'0':(db>0?'+':'')+db.toLocaleString('fr-FR',{maximumFractionDigits:1});return text+' dB';}
          return 'ISO '+Math.round(value).toLocaleString('fr-FR');
        }
        if(key==='aperture')return 'f/'+Number(value).toLocaleString('fr-FR',{maximumFractionDigits:1});
        if(key==='shutter')return '1/'+Number(value).toLocaleString('fr-FR',{maximumFractionDigits:1});
        if(key==='nd')return Number(value)===0?'0 stop':Number(value).toLocaleString('fr-FR',{maximumFractionDigits:1})+' stops';
        return String(value);
      }
      function readInitial(){
        const values={aperture:childValue(doc,'newAperture'),iso:childValue(doc,'newIso'),shutter:childValue(doc,'newShutter'),nd:childValue(doc,'newNd')};
        const rootAp=rootValue('sharedLightAperture'),rootSh=rootValue('sharedLightShutter');
        if(rootAp>0)values.aperture=rootAp;if(rootSh>0)values.shutter=rootSh;
        if(!(values.aperture>0))values.aperture=2.8;if(!(values.iso>0))values.iso=currentBases(doc)[0]||800;if(!(values.shutter>0))values.shutter=50;if(!(values.nd>=0))values.nd=0;
        Object.keys(values).forEach(k=>values[k]=snap(k,values[k]));return values;
      }
      function syncHidden(){
        const map={aperture:'newAperture',iso:'newIso',shutter:'newShutter',nd:'newNd'};
        Object.entries(map).forEach(([key,id])=>{const el=doc.getElementById(id);if(!el)return;el.value=String(state.values[key]);const E=doc.defaultView.Event;el.dispatchEvent(new E('input',{bubbles:true}));el.dispatchEvent(new E('change',{bubbles:true}));});
      }
      function bestCandidate(key,current,remaining){
        let vals=candidates(key);
        if(key==='iso'){
          if(remaining<0){const floor=activeNative(doc,current);vals=vals.filter(v=>v>=floor-1e-9&&v<=current+1e-9);}
          else if(remaining>0){const max=acceptedIsoMax();vals=vals.filter(v=>v>=current-1e-9&&v<=max+1e-9);}
        }
        if(!vals.length)return current;
        const currentStop=stopFor(key,current),target=currentStop+remaining;let best=current,bestDiff=Infinity;
        vals.forEach(v=>{const move=stopFor(key,v)-currentStop;if(remaining>0&&move<-1e-9)return;if(remaining<0&&move>1e-9)return;const diff=Math.abs(stopFor(key,v)-target);if(diff<bestDiff){bestDiff=diff;best=v;}});
        return best;
      }
      function compensate(changedKey){
        if(!state.on||state.target===null)return;
        let remaining=state.target-total(state.values);
        const order=remaining<0?['iso','nd','aperture','shutter']:['iso','aperture','nd','shutter'];
        for(const key of order){if(Math.abs(remaining)<0.025)break;if(key===changedKey||state.locks[key])continue;const before=state.values[key],beforeStop=stopFor(key,before),next=bestCandidate(key,before,remaining);if(!Number.isFinite(next)||Math.abs(next-before)<1e-9)continue;state.values[key]=next;remaining-=stopFor(key,next)-beforeStop;}
      }
      function render(){
        const auto=q('bosCompAuto');auto?.classList.toggle('is-on',state.on);auto?.setAttribute('aria-pressed',state.on?'true':'false');const autoText=auto?.querySelector('strong');if(autoText)autoText.textContent=state.on?'ON':'OFF';
        q('bosCompIsoLabel').textContent=state.isoMode==='gain'?'GAIN':'ISO';
        doc.querySelectorAll('[data-bos-iso-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.bosIsoMode===state.isoMode));
        doc.querySelectorAll('[data-bos-comp-lock]').forEach(btn=>{const key=btn.dataset.bosCompLock;btn.classList.toggle('locked',!!state.locks[key]);btn.setAttribute('aria-pressed',state.locks[key]?'true':'false');});
        const map={iso:['bosCompIso','bosCompIsoValue'],aperture:['bosCompAperture','bosCompApertureValue'],shutter:['bosCompShutter','bosCompShutterValue'],nd:['bosCompNd','bosCompNdValue']};
        Object.entries(map).forEach(([key,[sliderId,outId]])=>{const vals=candidates(key),idx=nearestIndex(vals,state.values[key],key);state.values[key]=vals[idx]??state.values[key];const slider=q(sliderId);if(slider){slider.max=String(Math.max(0,vals.length-1));slider.value=String(idx);}const out=q(outId);if(out)out.textContent=format(key,state.values[key]);});
        const isoVals=candidates('iso');q('bosCompIsoMin').textContent=format('iso',isoVals[0]);
        const max=acceptedIsoMax(),native=activeNative(doc,state.values.iso);
        q('bosCompIsoHint').textContent=state.isoMode==='gain'?'0 dB = ISO '+Math.round(native).toLocaleString('fr-FR')+' · accepté ISO '+Math.round(max).toLocaleString('fr-FR'):'Natif actif '+Math.round(native).toLocaleString('fr-FR')+' · accepté '+Math.round(max).toLocaleString('fr-FR');
        const isoRow=doc.querySelector('[data-bos-comp-key="iso"]'),warning=q('bosCompIsoWarning'),over=state.values.iso>max+1e-9;isoRow?.classList.toggle('is-over-iso',over);if(warning)warning.textContent=over?'Attention : on dépasse l’ISO maximum accepté dans Réglages caméra (ISO '+Math.round(max).toLocaleString('fr-FR')+').':'';
        const status=q('bosCompStatus'),help=q('bosCompModeHelp');status?.classList.remove('is-ok','is-warning');
        if(!state.on){if(help)help.textContent='Réglage manuel : chaque ligne est indépendante.';if(status)status.textContent='Mode manuel : les quatre réglages restent indépendants.';}
        else{if(help)help.textContent='Compensation automatique sur les réglages non verrouillés.';const residual=state.target-total(state.values);if(Math.abs(residual)<0.08){if(status){status.textContent='EXPOSITION CONSERVÉE';status.classList.add('is-ok');}}else if(status){status.textContent=(residual>0?'+':'')+residual.toLocaleString('fr-FR',{maximumFractionDigits:2})+' stop restant : limite atteinte ou réglage verrouillé.';status.classList.add('is-warning');}}
        syncHidden();
      }
      function moveFromSlider(key,slider){const vals=candidates(key),idx=Math.max(0,Math.min(vals.length-1,Number(slider.value)||0));state.values[key]=vals[idx];compensate(key);render();}
      function refresh(){state.on=false;state.target=null;state.values=readInitial();render();}

      state.values=readInitial();
      q('bosCompAuto')?.addEventListener('click',()=>{state.on=!state.on;state.target=state.on?total(state.values):null;render();});
      doc.querySelectorAll('[data-bos-comp-lock]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.bosCompLock;state.locks[key]=!state.locks[key];save();render();}));
      doc.querySelectorAll('[data-bos-iso-mode]').forEach(btn=>btn.addEventListener('click',()=>{state.isoMode=btn.dataset.bosIsoMode==='gain'?'gain':'iso';save();render();}));
      [['iso','bosCompIso'],['aperture','bosCompAperture'],['shutter','bosCompShutter'],['nd','bosCompNd']].forEach(([key,id])=>q(id)?.addEventListener('input',event=>moveFromSlider(key,event.target)));
      q('simpleResetBtn')?.addEventListener('click',()=>setTimeout(refresh,0));
      ['sharedCameraBrand','sharedCameraModel','sharedCameraGamma','sharedLightAperture','sharedLightShutter'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>setTimeout(refresh,180)));
      document.getElementById('sharedLightIso')?.addEventListener('change',()=>setTimeout(render,60));

      expoFrame._bosCompensateRefresh=refresh;
      render();
    }catch(error){
      console.error('BOS COMPENSER',error);
      setTimeout(setup,120);
    }
  }

  expoFrame.addEventListener('load',()=>setTimeout(setup,40));
  if(expoFrame.contentDocument?.readyState==='complete'||expoFrame.contentDocument?.readyState==='interactive')setTimeout(setup,40);
})();
