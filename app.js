// BOS LIGHT V0.7 — assistant de puissance/exposition pour le tournage
// Mesures constructeur Aputure/amaran. Exposition incidente : C = 340 (Lumisphere Sekonic).

const INCIDENT_C = 340;

const state = {
  fixture: 'halo60x', accessory: 'softbox', cct: 5600,
  intensityPct: 100, iso: 800, shutterDenom: 50, aperture: 2.8,
  testDistance: 2.0
};

const haloFixtures = {
  halo60x: {label:'Halo 60x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,2570],[3,295]],3200:[[1,2800],[3,321]],4300:[[1,3070],[3,353]],5600:[[1,3240],[3,372]],6500:[[1,3270],[3,375]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,21440],[3,2164]],3200:[[1,23530],[3,2372]],4300:[[1,26000],[3,2622]],5600:[[1,27520],[3,2777]],6500:[[1,27890],[3,2812]]}},
    softbox:{label:'Softbox 60',quality:'measured',data:{2700:[[1,1760],[3,133]],3200:[[1,1927],[3,145]],4300:[[1,2129],[3,160]],5600:[[1,2255],[3,169]],6500:[[1,2285],[3,171]]}}
  }},
  halo100x: {label:'Halo 100x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,3670],[3,414]],3200:[[1,4360],[3,492]],4300:[[1,4890],[3,551]],5600:[[1,4860],[3,547]],6500:[[1,4630],[3,521]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,27910],[3,2690]],3200:[[1,33500],[3,3230]],4300:[[1,38100],[3,3670]],5600:[[1,38400],[3,3700]],6500:[[1,36700],[3,3540]]}},
    softbox:{label:'Softbox 60',quality:'measured',data:{2700:[[1,2417],[3,182]],3200:[[1,2892],[3,218]],4300:[[1,3280],[3,247]],5600:[[1,3290],[3,248]],6500:[[1,3140],[3,237]]}}
  }},
  halo200x: {label:'Halo 200x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,7800],[3,881],[5,358]],3200:[[1,9460],[3,1066],[5,441]],4300:[[1,10500],[3,1184],[5,495]],5600:[[1,10530],[3,1187],[5,503]],6500:[[1,9800],[3,1104],[5,471]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,22000],[3,2136],[5,746]],3200:[[1,26730],[3,2594],[5,921]],4300:[[1,29800],[3,2889],[5,1038]],5600:[[1,29980],[3,2901],[5,1054]],6500:[[1,27930],[3,2705],[5,988]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,7090],[3,489],[5,175]],3200:[[1,8620],[3,595],[5,216]],4300:[[1,9620],[3,662],[5,244]],5600:[[1,9670],[3,666],[5,248]],6500:[[1,9010],[3,621],[5,233]]}}
  }},
  halo300x: {label:'Halo 300x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,11850],[3,1335],[5,554]],3200:[[1,14600],[3,1647],[5,685]],4300:[[1,16200],[3,1827],[5,768]],5600:[[1,16120],[3,1819],[5,763]],6500:[[1,14360],[3,1515],[5,683]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,38100],[3,3630],[5,1292]],3200:[[1,47200],[3,4480],[5,1602]],4300:[[1,52600],[3,5000],[5,1803]],5600:[[1,52600],[3,5000],[5,1796]],6500:[[1,46800],[3,4450],[5,1610]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,11530],[3,808],[5,293]],3200:[[1,14250],[3,999],[5,364]],4300:[[1,15850],[3,1113],[5,410]],5600:[[1,15890],[3,1111],[5,408]],6500:[[1,14140],[3,989],[5,366]]}}
  }},
  halo600x: {label:'Halo 600x',family:'halo',defaultAccessory:'softbox',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,23600],[3,2627],[5,1094]],3200:[[1,27920],[3,3100],[5,1280]],4300:[[1,32000],[3,3550],[5,1475]],5600:[[1,32500],[3,3610],[5,1494]],6500:[[1,31200],[3,3460],[5,1461]]}},
    reflector:{label:'Réflecteur',quality:'measured',data:{2700:[[1,72500],[3,6900],[5,2519]],3200:[[1,86400],[3,8200],[5,2948]],4300:[[1,99900],[3,9480],[5,3420]],5600:[[1,102100],[3,9680],[5,3480]],6500:[[1,98400],[3,9340],[5,3410]]}},
    softbox:{label:'Softbox 90',quality:'measured',data:{2700:[[1,21590],[3,1485],[5,566]],3200:[[1,25590],[3,1767],[5,662]],4300:[[1,29700],[3,2042],[5,768]],5600:[[1,30300],[3,2087],[5,782]],6500:[[1,29300],[3,2012],[5,766]]}}
  }}
};

const cobFixtures = {
  cob100xs:{label:'amaran 100x S',family:'cob',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,2760],[3,324],[5,126]],3200:[[1,3410],[3,405],[5,157]],4300:[[1,3590],[3,426],[5,164]],5600:[[1,3640],[3,433],[5,166]],6500:[[1,3170],[3,377],[5,166]]}},
    reflector:{label:'Hyper Reflector',quality:'measured',data:{2700:[[1,22470],[3,2422],[5,856]],3200:[[1,28180],[3,2970],[5,1066]],4300:[[1,29670],[3,3160],[5,1137]],5600:[[1,30500],[3,3240],[5,1156]],6500:[[1,26080],[3,2824],[5,1005]]}}
  }},
  cob200xs:{label:'amaran 200x S',family:'cob',defaultAccessory:'reflector',accessories:{
    bare:{label:'Nu',quality:'measured',data:{2700:[[1,4930],[3,577],[5,223]],3200:[[1,5630],[3,675],[5,257]],4300:[[1,5980],[3,715],[5,273]],5600:[[1,6400],[3,764],[5,291]],6500:[[1,6060],[3,723],[5,277]]}},
    reflector:{label:'Hyper Reflector',quality:'measured',data:{2700:[[1,35000],[3,3570],[5,1265]],3200:[[1,40200],[3,4120],[5,1455]],4300:[[1,42600],[3,4350],[5,1538]],5600:[[1,45400],[3,4630],[5,1635]],6500:[[1,42900],[3,4370],[5,1543]]}}
  }}
};

const rayFixtures = {
  ray60c:{label:'Ray 60c',family:'ray-small',defaultAccessory:'miniReflector',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,3910]]}},
    miniReflector:{label:'Mini Reflector',quality:'measured',data:{2300:[[1,16310],[3,1812]],3200:[[1,19130],[3,2126]],4300:[[1,19530],[3,2170]],5600:[[1,18830],[3,2092]],6500:[[1,18500],[3,2056]],10000:[[1,17220],[3,1913]]}}
  }},
  ray120c:{label:'Ray 120c',family:'ray-small',defaultAccessory:'miniReflector',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,6850]]}},
    miniReflector:{label:'Mini Reflector',quality:'measured',data:{2300:[[1,24500],[3,2722]],3200:[[1,35600],[3,3956]],4300:[[1,35400],[3,3933]],5600:[[1,34000],[3,3778]],6500:[[1,33300],[3,3700]],10000:[[1,30500],[3,3389]]}}
  }},
  ray360c:{label:'Ray 360c',family:'ray-large',defaultAccessory:'fresnelSpot',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,17130]]}},
    fresnelSpot:{label:'Fresnel 15°',quality:'measured',data:{2300:[[3,10570],[5,3750]],3200:[[3,16780],[5,5790]],4300:[[3,18110],[5,6210]],5600:[[3,18000],[5,6400]],6500:[[3,17590],[5,6350]],10000:[[3,16580],[5,6000]]}},
    fresnelFlood:{label:'Fresnel 45°',quality:'measured',data:{2300:[[3,1738],[5,634]],3200:[[3,2750],[5,910]],4300:[[3,2970],[5,968]],5600:[[3,2950],[5,1108]],6500:[[3,2880],[5,1310]],10000:[[3,2730],[5,1014]]}}
  }},
  ray660c:{label:'Ray 660c',family:'ray-large',defaultAccessory:'fresnelSpot',accessories:{
    bare:{label:'Nu',quality:'single',singlePointLabel:'Sortie max publiée',data:{5600:[[1,38500]]}},
    fresnelSpot:{label:'Fresnel 15°',quality:'measured',data:{2300:[[3,20230],[5,7420]],3200:[[3,30990],[5,10998]],4300:[[3,29945],[5,11081]],5600:[[3,30900],[5,11068]],6500:[[3,28871],[5,11310]],10000:[[3,29450],[5,10790]]}},
    fresnelFlood:{label:'Fresnel 45°',quality:'measured',data:{2300:[[3,4250],[5,1327]],3200:[[3,5886],[5,2246]],4300:[[3,6821],[5,2338]],5600:[[3,6613],[5,2357]],6500:[[3,6030],[5,2474]],10000:[[3,6230],[5,2370]]}}
  }}
};

const fixtures = {...haloFixtures, ...rayFixtures, ...cobFixtures};
const FAMILY_ORDER = {
  halo:['halo60x','halo100x','halo200x','halo300x','halo600x'],
  'ray-small':['ray60c','ray120c'],
  'ray-large':['ray360c','ray660c'],
  cob:['cob100xs','cob200xs']
};

const UI_GROUPS = {
  halo:['halo60x','halo100x','halo200x','halo300x','halo600x'],
  ray:['ray60c','ray120c','ray360c','ray660c'],
  cob:['cob100xs','cob200xs']
};
const POWER_LABELS = {
  halo60x:'60X',halo100x:'100X',halo200x:'200X',halo300x:'300X',halo600x:'600X',
  ray60c:'60C',ray120c:'120C',ray360c:'360C',ray660c:'660C',
  cob100xs:'100X S',cob200xs:'200X S'
};
function uiGroupForFixture(key=state.fixture){if(key.startsWith('halo'))return'halo';if(key.startsWith('ray'))return'ray';return'cob';}


const ISO_VALUES=[100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800];
const SHUTTER_DENOMS=[24,25,30,40,48,50,60,80,100,120,125,160,200,250,320,400,500,640,800,1000];
const APERTURES=[1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];

const $=sel=>document.querySelector(sel);
const els={
  brandGrid:$('#brandGrid'),familyGrid:$('#familyGrid'),powerGrid:$('#powerGrid'),accessoryGrid:$('#accessoryGrid'),accessoryNote:$('#accessoryNote'),
  cctGrid:$('#cctGrid'),cctSection:$('#cctSection'),cctValue:$('#cctValue'),cctNote:$('#cctNote'),
  intensitySlider:$('#intensitySlider'),intensityValue:$('#intensityValue'),isoSelect:$('#isoSelect'),shutterSelect:$('#shutterSelect'),apertureSelect:$('#apertureSelect'),cameraSummary:$('#cameraSummary'),
  maxDistance:$('#maxDistance'),heroSummary:$('#heroSummary'),testDistanceSlider:$('#testDistanceSlider'),testDistanceValue:$('#testDistanceValue'),statusBox:$('#statusBox'),statusTitle:$('#statusTitle'),statusText:$('#statusText'),solutionIntro:$('#solutionIntro'),solutions:$('#solutions'),
  testLux:$('#testLux'),stopMargin:$('#stopMargin'),requiredIso:$('#requiredIso'),possibleAperture:$('#possibleAperture'),sourceDescriptor:$('#sourceDescriptor'),measurementRow:$('#measurementRow'),dataNote:$('#dataNote'),dimmerNote:$('#dimmerNote'),labBadge:$('#labBadge'),resetBtn:$('#resetBtn')
};

init();

function init(){
  populateSelect(els.isoSelect,ISO_VALUES,v=>`ISO ${v}`,state.iso);
  populateSelect(els.apertureSelect,APERTURES,v=>`f/${formatAperture(v)}`,state.aperture);
  populateSelect(els.shutterSelect,SHUTTER_DENOMS,v=>`1/${v}`,state.shutterDenom);
  bindUI(); update();
}
function populateSelect(select,values,labelFn,selected){select.innerHTML='';values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=labelFn(v);if(Number(v)===Number(selected))o.selected=true;select.appendChild(o);});}
function bindUI(){
  els.brandGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-brand]');if(!b)return;});
  els.familyGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-family]');if(!b)return;const group=b.dataset.family;if(group===uiGroupForFixture())return;state.fixture=UI_GROUPS[group][0];state.accessory=fixtures[state.fixture].defaultAccessory;ensureAccessoryAndCct();update();});
  els.powerGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-fixture]');if(!b)return;state.fixture=b.dataset.fixture;ensureAccessoryAndCct();update();});
  els.accessoryGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-accessory]');if(!b)return;state.accessory=b.dataset.accessory;ensureAccessoryAndCct();update();});
  els.cctGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-cct]');if(!b)return;state.cct=Number(b.dataset.cct);update();});
  els.intensitySlider.addEventListener('input',()=>{state.intensityPct=Number(els.intensitySlider.value);update();});
  els.isoSelect.addEventListener('change',()=>{state.iso=Number(els.isoSelect.value);update();});
  els.apertureSelect.addEventListener('change',()=>{state.aperture=Number(els.apertureSelect.value);update();});
  els.shutterSelect.addEventListener('change',()=>{state.shutterDenom=Number(els.shutterSelect.value);update();});
  els.testDistanceSlider.addEventListener('input',()=>{state.testDistance=Number(els.testDistanceSlider.value);update();});
  els.resetBtn.addEventListener('click',reset);
}
function reset(){Object.assign(state,{fixture:'halo60x',accessory:'softbox',cct:5600,intensityPct:100,iso:800,shutterDenom:50,aperture:2.8,testDistance:2});els.intensitySlider.value=100;els.isoSelect.value=800;els.apertureSelect.value=2.8;els.shutterSelect.value=50;els.testDistanceSlider.value=2;update();}

function fixture(){return fixtures[state.fixture];}
function accessory(fixtureKey=state.fixture,accessoryKey=state.accessory){return fixtures[fixtureKey].accessories[accessoryKey];}
function ensureAccessoryAndCct(){
  const f=fixture(); if(!f.accessories[state.accessory]) state.accessory=f.defaultAccessory;
  const keys=Object.keys(accessory().data).map(Number); if(!keys.includes(state.cct)) state.cct=keys.includes(5600)?5600:keys[0];
}
function getPoints(fixtureKey=state.fixture,accessoryKey=state.accessory,cct=state.cct){
  const a=accessory(fixtureKey,accessoryKey); const keys=Object.keys(a.data).map(Number); const use=keys.includes(Number(cct))?Number(cct):(keys.includes(5600)?5600:keys[0]); return a.data[use];
}
function update(){
  ensureAccessoryAndCct(); renderFixtureHierarchy(); renderAccessoryButtons(); renderCctButtons(); syncActiveButtons();
  const reqLux=requiredLux(state.iso,state.shutterDenom,state.aperture); const maxD=state.intensityPct<=0?0:solveDistanceForLux(reqLux);
  els.intensityValue.textContent=`${state.intensityPct} %`; els.testDistanceValue.textContent=`${formatDistance(state.testDistance)} m`; els.maxDistance.textContent=maxD>0?formatDistance(maxD):'0,0';
  els.cameraSummary.textContent=`ISO ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  els.heroSummary.textContent=`${fixture().label} · ${accessory().label} · ${state.intensityPct} % · ISO max ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  updateDistanceStatus(reqLux,maxD); updateAdvanced(reqLux,maxD,getPoints());
}
function renderFixtureHierarchy(){
  const group=uiGroupForFixture();
  els.familyGrid.querySelectorAll('[data-family]').forEach(b=>b.classList.toggle('active',b.dataset.family===group));
  const keys=UI_GROUPS[group];
  els.powerGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,5)},minmax(0,1fr))`;
  els.powerGrid.innerHTML=keys.map(key=>`<button data-fixture="${key}" class="${key===state.fixture?'active':''}" type="button">${POWER_LABELS[key]}</button>`).join('');
}

function renderAccessoryButtons(){
  const entries=Object.entries(fixture().accessories); els.accessoryGrid.style.gridTemplateColumns=`repeat(${Math.min(entries.length,3)},minmax(0,1fr))`;
  els.accessoryGrid.innerHTML=entries.map(([key,a])=>`<button data-accessory="${key}" class="${key===state.accessory?'active':''}" type="button">${a.label.toUpperCase()}</button>`).join('');
  const a=accessory(); els.accessoryNote.textContent=a.quality==='single'?'Ce mode repose sur un seul point constructeur : la distance est donc une estimation plus large.':'';
}
function renderCctButtons(){
  const keys=Object.keys(accessory().data).map(Number).sort((a,b)=>a-b); const isSingle=keys.length===1;
  els.cctSection.hidden=false; els.cctValue.textContent=`${state.cct} K`;
  els.cctGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,6)},minmax(0,1fr))`;
  els.cctGrid.innerHTML=keys.map(k=>`<button data-cct="${k}" class="${k===state.cct?'active':''}" type="button">${k}</button>`).join('');
  els.cctNote.textContent=isSingle?'Une seule température de référence est disponible dans les données publiées pour cette configuration.':'';
}
function syncActiveButtons(){document.querySelectorAll('[data-fixture]').forEach(b=>b.classList.toggle('active',b.dataset.fixture===state.fixture));}
function requiredLux(iso,shutterDenom,aperture){const t=1/shutterDenom;return INCIDENT_C*aperture*aperture/(iso*t);}
function estimatedLuxAtDistance(distance,fixtureKey=state.fixture,intensityPct=state.intensityPct,accessoryKey=null){if(intensityPct<=0)return 0;const aKey=accessoryKey||state.accessory;const points=getPoints(fixtureKey,aKey,state.cct);return curveLux(distance,points)*(intensityPct/100);}
function curveLux(distance,points){
  const d=Math.max(.05,distance); if(points.length===1){const [d1,e1]=points[0];return e1*Math.pow(d1/d,2);}
  let a,b;if(d<=points[0][0])[a,b]=[points[0],points[1]];else if(d>=points[points.length-1][0])[a,b]=[points[points.length-2],points[points.length-1]];else{for(let i=0;i<points.length-1;i++){if(d>=points[i][0]&&d<=points[i+1][0]){a=points[i];b=points[i+1];break;}}}
  const [d1,e1]=a,[d2,e2]=b;const exponent=Math.log(e2/e1)/Math.log(d2/d1);return e1*Math.pow(d/d1,exponent);
}
function solveDistanceForLux(targetLux){if(state.intensityPct<=0)return 0;if(estimatedLuxAtDistance(.1)<targetLux)return 0;let lo=.1,hi=1;while(estimatedLuxAtDistance(hi)>targetLux&&hi<200)hi*=2;if(hi>=200&&estimatedLuxAtDistance(hi)>targetLux)return 200;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(estimatedLuxAtDistance(mid)>=targetLux)lo=mid;else hi=mid;}return(lo+hi)/2;}

function updateDistanceStatus(reqLux,maxD){
  const d=state.testDistance,lux=estimatedLuxAtDistance(d),margin=lux>0?Math.log2(lux/reqLux):-Infinity,reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity,possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  els.statusBox.classList.remove('comfortable','just','insufficient');let title,text,cls;
  if(state.intensityPct<=0||lux<=0){cls='insufficient';title='SOURCE ÉTEINTE';text='Le projecteur est à 0 %. Monte sa puissance pour commencer le calcul.';}
  else if(margin>=.7){cls='comfortable';title='CONFORTABLE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet suffit pour tes réglages caméra, avec encore de la marge.`;}
  else if(margin>=0){cls='just';title='ÇA PASSE';text=`À ${formatDistance(d)} m, tu atteins l’exposition de référence avec tes réglages caméra, mais avec peu de marge.`;}
  else{cls='insufficient';title='PAS ASSEZ DE LUMIÈRE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet est insuffisante pour tes réglages caméra.`;}
  els.statusBox.classList.add(cls);els.statusTitle.textContent=title;els.statusText.textContent=text;
  const solutions=[];
  if(state.intensityPct<=0){els.solutionIntro.textContent='Pour obtenir une exposition de référence, commence par :';solutions.push(['MONTE LA PUISSANCE','au-dessus de 0 %']);}
  else if(margin>=0){els.solutionIntro.textContent='Tu es dans la bonne zone. Si tu veux modifier ton installation :';if(maxD>d+.1)solutions.push(['TU PEUX RECULER',`jusqu’à ${formatDistance(maxD)} m`]);const targetPct=state.intensityPct*reqLux/lux;if(targetPct<state.intensityPct-3&&targetPct>=1)solutions.push(['TU PEUX DIMMER',`vers ${Math.max(1,Math.round(targetPct))} %`]);const closeF=snapApertureForClosing(possibleF,state.aperture);if(closeF)solutions.push(['TU PEUX FERMER',`jusqu’à environ f/${formatAperture(closeF)}`]);}
  else{
    els.solutionIntro.textContent=`Pour obtenir une bonne exposition à ${formatDistance(d)} m, change au moins un de ces réglages :`;
    if(maxD>0)solutions.push(['RAPPROCHE TA SOURCE',maxD>=1?`place-la à ${formatDistance(maxD)} m ou moins`:'il faudrait moins de 1 m']);
    const neededPct=lux>0?state.intensityPct*reqLux/lux:Infinity;if(state.intensityPct<100&&neededPct<=100)solutions.push(['MONTE LA PUISSANCE',`vers ${Math.ceil(neededPct)} %`]);
    const openF=snapApertureForOpening(possibleF,state.aperture);if(openF)solutions.push(['OUVRE TON DIAPH',`passe à f/${formatAperture(openF)} ou plus ouvert`]);
    if(Number.isFinite(reqIso)&&reqIso>state.iso){const isoStep=snapIsoUp(reqIso);solutions.push(['MONTE TON ISO',isoStep?`passe à environ ISO ${isoStep}`:`il faudrait environ ISO ${formatIso(reqIso)}`]);}
    const stronger=findStrongerFixture(reqLux,d);if(stronger)solutions.push(['PRENDS PLUS PUISSANT',`passe au ${fixtures[stronger].label}`]);
  }
  els.solutions.innerHTML=solutions.slice(0,4).map(([l,v])=>`<div class="solution"><span>${l}</span><strong>${v}</strong></div>`).join('');
}
function snapApertureForOpening(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=0||maxF>=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f<currentF);return valid.length?valid[valid.length-1]:null;}
function snapApertureForClosing(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f>currentF);return valid.length?valid[valid.length-1]:null;}
function snapIsoUp(requiredIso){return ISO_VALUES.find(v=>v>=requiredIso)||null;}
function findStrongerFixture(reqLux,distance){
  const family=fixture().family,order=FAMILY_ORDER[family]||[],idx=order.indexOf(state.fixture),role=currentAccessoryRole();
  for(let i=idx+1;i<order.length;i++){const key=order[i],candidateAccessory=findAccessoryByRole(key,role);if(candidateAccessory&&estimatedLuxAtDistance(distance,key,100,candidateAccessory)>=reqLux)return key;}return null;
}
function currentAccessoryRole(){if(state.accessory==='bare')return'bare';if(['reflector','miniReflector'].includes(state.accessory))return'reflector';if(state.accessory==='softbox')return'softbox';if(state.accessory.startsWith('fresnel'))return state.accessory;return state.accessory;}
function findAccessoryByRole(fixtureKey,role){const keys=Object.keys(fixtures[fixtureKey].accessories);if(role==='reflector')return keys.find(k=>['reflector','miniReflector'].includes(k))||null;return keys.find(k=>k===role)||null;}

function updateAdvanced(reqLux,maxD,points){
  const d=state.testDistance,lux=estimatedLuxAtDistance(d),margin=lux>0?Math.log2(lux/reqLux):-Infinity,reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity,possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  els.testLux.textContent=`${formatLux(lux)} lux`;els.stopMargin.textContent=Number.isFinite(margin)?`${margin>=0?'+':''}${margin.toFixed(1).replace('.',',')} stop${Math.abs(margin)>=1.5?'s':''}`:'—';els.requiredIso.textContent=Number.isFinite(reqIso)?`ISO ${formatIso(reqIso)}`:'—';els.possibleAperture.textContent=possibleF>0?`f/${formatAperture(possibleF)}`:'—';
  const cctLabel=accessory().quality==='single'?'sortie max publiée':`${state.cct} K`;els.sourceDescriptor.textContent=`${fixture().label} · ${accessory().label} · ${cctLabel} · à 100 %`;
  els.measurementRow.innerHTML=points.map(([md,mlux])=>`<div class="measure-chip"><span>${md} m</span><strong>${formatLux(mlux)} lux</strong></div>`).join('');
  const rangeAtTest=classifyDistance(d,points,accessory().quality),rangeAtMax=classifyDistance(maxD,points,accessory().quality);const warning=rangeAtTest.warning||rangeAtMax.warning;
  if(accessory().quality==='single')els.dataNote.textContent='Un seul point constructeur est publié pour ce mode. LIGHT applique une décroissance en carré inverse : considère la distance comme une estimation, pas comme une mesure constructeur complète.';
  else els.dataNote.textContent=warning?`Une partie du calcul sort de la plage mesurée (${rangeAtTest.label.toLowerCase()} / distance max : ${rangeAtMax.label.toLowerCase()}).`:'La distance testée et la distance max restent dans la plage de mesures constructeur ; LIGHT interpole entre les points publiés.';
  els.dataNote.classList.toggle('warning',warning||accessory().quality==='single');
  if(state.intensityPct===100){els.dimmerNote.textContent='Puissance 100 % : les points de départ sont les mesures publiées par le constructeur.';els.dimmerNote.classList.remove('warning');}
  else{els.dimmerNote.textContent='Sous 100 %, LIGHT estime les lux proportionnellement au dimmer. Cette partie est moins fiable faute de courbe constructeur détaillée par pourcentage.';els.dimmerNote.classList.add('warning');}
}
function classifyDistance(distance,points,quality){if(!Number.isFinite(distance)||distance<=0)return{label:'source éteinte',warning:true};if(quality==='single')return{label:'estimation depuis 1 point',warning:true};const min=points[0][0],max=points[points.length-1][0];if(distance<min)return{label:`extrapolation < ${min} m`,warning:true};if(distance>max)return{label:`extrapolation > ${max} m`,warning:true};return{label:'interpolation constructeur',warning:false};}
function formatLux(v){if(!Number.isFinite(v))return'—';if(v>=100)return Math.round(v).toLocaleString('fr-FR');if(v>=10)return v.toFixed(1).replace('.',',');return v.toFixed(2).replace('.',',');}
function formatDistance(v){if(!Number.isFinite(v))return'—';if(v>=20)return v.toFixed(0).replace('.',',');return v.toFixed(1).replace('.',',');}
function formatAperture(v){if(!Number.isFinite(v))return'—';return v.toFixed(1).replace(/\.0$/,'').replace('.',',');}
function formatIso(v){if(!Number.isFinite(v))return'—';if(v>=1000)return Math.round(v/10)*10;return Math.max(1,Math.round(v));}
