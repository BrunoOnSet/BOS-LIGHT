// BOS LIGHT V0.29 — UI numérique FRAME + choix compacts
const INCIDENT_C = 340;
const STORAGE_KEY = 'bos-light-settings-v1';

const state = {
  fixture: 'halo60x', accessory: 'softbox', cct: 5600,
  intensityPct: 100, iso: 800, shutterDenom: 50, aperture: 2.8,
  testDistance: 2.0,
  fillEnabled: false, fillFixture: 'halo60x', fillAccessory: 'softbox', fillCct: 5600,
  fillIntensityPct: 50, fillDistance: 2.0
};

let fixtures = {};
let UI_GROUPS = {};
let BRAND_GROUPS = {};
let BRAND_LABELS = {};
let GROUP_LABELS = {};
let POWER_LABELS = {};
let DATABASE_INFO = {version:'—', updated:'—', source:'—', fixtureCount:0};
let pickerTarget='key', pickerBrand='', pickerFamily='';
let numericEditConfig=null;

const ISO_VALUES=[100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800];
const SHUTTER_DENOMS=[24,25,30,40,48,50,60,80,100,120,125,160,200,250,320,400,500,640,800,1000];
const APERTURES=[1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];

const $ = sel => document.querySelector(sel);
const els = {
  accessoryGrid:$('#accessoryGrid'), accessoryNote:$('#accessoryNote'), cctGrid:$('#cctGrid'), cctSection:$('#cctSection'), cctValue:$('#cctValue'), cctNote:$('#cctNote'),
  intensitySlider:$('#intensitySlider'), intensityValue:$('#intensityValue'), isoSelect:$('#isoSelect'), shutterSelect:$('#shutterSelect'), apertureSelect:$('#apertureSelect'), cameraSummary:$('#cameraSummary'), cameraHeadingMeta:$('#cameraHeadingMeta'), lightSummary:$('#lightSummary'),
  keyModelPickerBtn:$('#keyModelPickerBtn'), keyModelPickerLabel:$('#keyModelPickerLabel'),
  maxDistance:$('#maxDistance'), resultDistanceSummary:$('#resultDistanceSummary'), heroSummary:$('#heroSummary'), beamHint:$('#beamHint'), resultHeroCard:$('#resultHeroCard'), testDistanceSlider:$('#testDistanceSlider'), testDistanceValue:$('#testDistanceValue'), statusBox:$('#statusBox'), statusTitle:$('#statusTitle'), statusText:$('#statusText'), solutionIntro:$('#solutionIntro'), solutions:$('#solutions'), contrastSection:$('#contrastSection'),
  keyTechPopover:$('#keyTechPopover'), keyTechSourceDescriptor:$('#keyTechSourceDescriptor'), keyTechMeasurementRow:$('#keyTechMeasurementRow'),
  resultTechPopover:$('#resultTechPopover'), resultTechLux:$('#resultTechLux'), resultTechMargin:$('#resultTechMargin'), resultTechRequiredIso:$('#resultTechRequiredIso'), resultTechPossibleAperture:$('#resultTechPossibleAperture'), resultTechDataNote:$('#resultTechDataNote'),
  resetBtn:$('#resetBtn'), themeToggle:$('#themeToggle'), themeColor:$('#themeColor'),
  fillDetails:$('#fillDetails'), fillSummary:$('#fillSummary'), fillDisabled:$('#fillDisabled'), fillControls:$('#fillControls'), enableFillBtn:$('#enableFillBtn'), disableFillBtn:$('#disableFillBtn'),
  fillModelPickerBtn:$('#fillModelPickerBtn'), fillModelPickerLabel:$('#fillModelPickerLabel'), fillAccessoryGrid:$('#fillAccessoryGrid'), fillAccessoryNote:$('#fillAccessoryNote'),
  fillIntensitySlider:$('#fillIntensitySlider'), fillIntensityValue:$('#fillIntensityValue'), fillCctSection:$('#fillCctSection'), fillCctGrid:$('#fillCctGrid'), fillCctValue:$('#fillCctValue'), fillCctNote:$('#fillCctNote'), fillDistanceSlider:$('#fillDistanceSlider'), fillDistanceValue:$('#fillDistanceValue'),
  fillTechPopover:$('#fillTechPopover'), fillTechSourceDescriptor:$('#fillTechSourceDescriptor'), fillTechMeasurementRow:$('#fillTechMeasurementRow'),
  contrastCard:$('#contrastCard'), contrastCharacter:$('#contrastCharacter'), keyLuxResult:$('#keyLuxResult'), fillLuxResult:$('#fillLuxResult'), sourceGapResult:$('#sourceGapResult'), sourceGapDetail:$('#sourceGapDetail'), sourceRatioResult:$('#sourceRatioResult'), estimatedContrastResult:$('#estimatedContrastResult'),
  projectorDialog:$('#projectorDialog'), projectorDialogTitle:$('#projectorDialogTitle'), projectorChooserContext:$('#projectorChooserContext'), closeProjectorDialogBtn:$('#closeProjectorDialogBtn'), pickerBrandChoices:$('#pickerBrandChoices'), pickerFamilyChoices:$('#pickerFamilyChoices'), pickerModelChoices:$('#pickerModelChoices'), pickerCatalogCount:$('#pickerCatalogCount'),
  numericDialog:$('#numericDialog'), numericDialogForm:$('#numericDialogForm'), numericDialogTitle:$('#numericDialogTitle'), numericDialogInput:$('#numericDialogInput'), numericDialogUnit:$('#numericDialogUnit'), numericDialogValidate:$('#numericDialogValidate')
};

init().catch(err=>{console.error(err); document.body.dataset.dbError='1';});

async function init(){
  applyTheme(localStorage.getItem('bg-set-tools-theme') || 'light');
  const loaded = await window.BOSProjecteursDB.load();
  buildCatalogFromDatabase(loaded.db,loaded);
  loadSavedState();
  populateSelect(els.isoSelect,ISO_VALUES,v=>`ISO ${v}`,state.iso);
  populateSelect(els.apertureSelect,APERTURES,v=>`f/${formatAperture(v)}`,state.aperture);
  populateSelect(els.shutterSelect,SHUTTER_DENOMS,v=>`1/${v}`,state.shutterDenom);
  els.intensitySlider.value=state.intensityPct;
  els.testDistanceSlider.value=state.testDistance;
  els.fillIntensitySlider.value=state.fillIntensityPct;
  els.fillDistanceSlider.value=state.fillDistance;
  bindUI();
  update();
}

function naturalModelSort(a,b){
  const la=POWER_LABELS[a]||a, lb=POWER_LABELS[b]||b;
  const na=Number((la.match(/\d+(?:\.\d+)?/)||['99999'])[0]);
  const nb=Number((lb.match(/\d+(?:\.\d+)?/)||['99999'])[0]);
  if(na!==nb) return na-nb;
  return la.localeCompare(lb,'fr',{numeric:true,sensitivity:'base'});
}
function buildCatalogFromDatabase(db,sourceMeta={}){
  fixtures={}; UI_GROUPS={}; BRAND_GROUPS={}; BRAND_LABELS={}; GROUP_LABELS={}; POWER_LABELS={};
  const ui=db.calculatorUi||{};
  BRAND_LABELS={...(ui.brandLabels||{})};

  for(const item of db.fixtures||[]){
    const calc=item.calculator;
    if(!item.capabilities?.lightCalculator || !calc) continue;
    const key=calc.key||item.id;
    fixtures[key]={label:item.name,brand:calc.brandKey,group:calc.group,defaultAccessory:calc.defaultAccessory,accessories:calc.accessories||{},note:calc.note||'',databaseId:item.id,plan:item.plan||null};
    POWER_LABELS[key]=calc.powerLabel||item.short||item.name;
    GROUP_LABELS[calc.group]=calc.groupLabel||ui.groups?.[calc.group]?.label||calc.group;
    (UI_GROUPS[calc.group]??=[]).push(key);
  }
  Object.values(UI_GROUPS).forEach(keys=>keys.sort(naturalModelSort));
  const brandOrder=(ui.brandOrder||Object.keys(BRAND_LABELS));
  for(const brand of brandOrder){
    const groups=Object.entries(ui.groups||{})
      .filter(([key,g])=>g.brandKey===brand && UI_GROUPS[key]?.length)
      .map(([key,g])=>({key,order:Number(g.order)||0}))
      .filter(x=>UI_GROUPS[x.key]?.length)
      .sort((a,b)=>a.order-b.order)
      .map(x=>x.key);
    const extra=Object.keys(UI_GROUPS).filter(group=>{
      const first=fixtures[UI_GROUPS[group][0]];
      return first?.brand===brand && !groups.includes(group);
    });
    BRAND_GROUPS[brand]=[...groups,...extra];
    if(!BRAND_LABELS[brand]) BRAND_LABELS[brand]=brand;
  }
  for(const f of Object.values(fixtures)){
    if(!BRAND_GROUPS[f.brand]){
      BRAND_GROUPS[f.brand]=Object.keys(UI_GROUPS).filter(g=>fixtures[UI_GROUPS[g][0]]?.brand===f.brand);
      BRAND_LABELS[f.brand] ||= f.brand;
    }
  }
  DATABASE_INFO={version:db.databaseVersion||db.schemaVersion||'—',updated:db.updated||'—',source:sourceMeta.source||'—',url:sourceMeta.url||'',fixtureCount:Object.keys(fixtures).length,totalFixtureCount:(db.fixtures||[]).length};
}

function loadSavedState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!saved||typeof saved!=='object')return;
    const allowed=['fixture','accessory','cct','intensityPct','iso','shutterDenom','aperture','testDistance','fillEnabled','fillFixture','fillAccessory','fillCct','fillIntensityPct','fillDistance'];
    allowed.forEach(k=>{if(saved[k]!==undefined)state[k]=saved[k];});
    if(!fixtures[state.fixture]) state.fixture=fixtures.halo60x?'halo60x':Object.keys(fixtures)[0];
    if(!fixtures[state.fillFixture]) state.fillFixture=state.fixture;
    if(!ISO_VALUES.includes(Number(state.iso))) state.iso=800;
    if(!SHUTTER_DENOMS.includes(Number(state.shutterDenom))) state.shutterDenom=50;
    if(!APERTURES.includes(Number(state.aperture))) state.aperture=2.8;
    state.intensityPct=Math.max(0,Math.min(100,Number(state.intensityPct)||0));
    state.testDistance=Math.max(1,Math.min(20,Number(state.testDistance)||2));
    state.cct=Number(state.cct)||5600;
    state.fillEnabled=Boolean(state.fillEnabled);
    state.fillIntensityPct=Math.max(0,Math.min(100,Number(state.fillIntensityPct)??50));
    state.fillDistance=Math.max(1,Math.min(20,Number(state.fillDistance)||2));
    state.fillCct=Number(state.fillCct)||5600;
  }catch(_){ }
}
function persistState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){}}
function populateSelect(select,values,labelFn,selected){select.innerHTML='';values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=labelFn(v);if(Number(v)===Number(selected))o.selected=true;select.appendChild(o);});}
function brandForFixture(key=state.fixture){return fixtures[key]?.brand || Object.keys(BRAND_GROUPS)[0] || 'amaran';}
function uiGroupForFixture(key=state.fixture){return fixtures[key]?.group || Object.keys(UI_GROUPS)[0] || '';}
function fixture(){return fixtures[state.fixture];}
function fillFixture(){return fixtures[state.fillFixture];}
function accessory(fixtureKey=state.fixture,accessoryKey=state.accessory){return fixtures[fixtureKey].accessories[accessoryKey];}
function fillAccessory(){return accessory(state.fillFixture,state.fillAccessory);}
function getPoints(fixtureKey=state.fixture,accessoryKey=state.accessory,cct=state.cct){const a=accessory(fixtureKey,accessoryKey);const keys=Object.keys(a.data).map(Number);const use=keys.includes(Number(cct))?Number(cct):(keys.includes(5600)?5600:keys[0]);return a.data[use];}
function ensureAccessoryAndCct(){const f=fixture(); if(!f.accessories[state.accessory]) state.accessory=f.defaultAccessory; const keys=Object.keys(accessory().data).map(Number); if(!keys.includes(state.cct)) state.cct=keys.includes(5600)?5600:keys[0];}
function ensureFillAccessoryAndCct(){const f=fillFixture(); if(!f)return; if(!f.accessories[state.fillAccessory]) state.fillAccessory=f.defaultAccessory; const keys=Object.keys(fillAccessory().data).map(Number); if(!keys.includes(state.fillCct)) state.fillCct=keys.includes(5600)?5600:keys[0];}

function bindUI(){
  els.keyModelPickerBtn.addEventListener('click',()=>openProjectorPicker('key'));
  els.fillModelPickerBtn.addEventListener('click',()=>openProjectorPicker('fill'));
  els.closeProjectorDialogBtn.addEventListener('click',closeProjectorPicker);
  els.projectorDialog.addEventListener('click',e=>{if(e.target===els.projectorDialog)closeProjectorPicker();});
  els.pickerBrandChoices.addEventListener('click',e=>{const b=e.target.closest('button[data-picker-brand]');if(!b)return;pickerBrand=b.dataset.pickerBrand;pickerFamily=BRAND_GROUPS[pickerBrand]?.[0]||'';renderProjectorPicker();});
  els.pickerFamilyChoices.addEventListener('click',e=>{const b=e.target.closest('button[data-picker-family]');if(!b)return;pickerFamily=b.dataset.pickerFamily;renderProjectorPicker();});
  els.pickerModelChoices.addEventListener('click',e=>{const b=e.target.closest('button[data-picker-fixture]');if(!b)return;selectProjectorFromPicker(b.dataset.pickerFixture);});

  els.accessoryGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-accessory]');if(!b)return;state.accessory=b.dataset.accessory;ensureAccessoryAndCct();update();});
  els.cctGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-cct]');if(!b)return;state.cct=Number(b.dataset.cct);update();});
  els.intensitySlider.addEventListener('input',()=>{state.intensityPct=Number(els.intensitySlider.value);update();});
  els.intensityValue.addEventListener('click',()=>openNumericEditor('intensity'));
  els.testDistanceValue.addEventListener('click',()=>openNumericEditor('distance'));
  els.fillIntensityValue.addEventListener('click',()=>openNumericEditor('fillIntensity'));
  els.fillDistanceValue.addEventListener('click',()=>openNumericEditor('fillDistance'));
  els.isoSelect.addEventListener('change',()=>{state.iso=Number(els.isoSelect.value);update();});
  els.apertureSelect.addEventListener('change',()=>{state.aperture=Number(els.apertureSelect.value);update();});
  els.shutterSelect.addEventListener('change',()=>{state.shutterDenom=Number(els.shutterSelect.value);update();});
  els.testDistanceSlider.addEventListener('input',()=>{state.testDistance=Number(els.testDistanceSlider.value);update();});

  els.enableFillBtn.addEventListener('click',()=>{state.fillEnabled=true;if(!fixtures[state.fillFixture]){state.fillFixture=state.fixture;state.fillAccessory=state.accessory;state.fillCct=state.cct;state.fillDistance=state.testDistance;}ensureFillAccessoryAndCct();els.fillDetails.open=true;update();});
  els.disableFillBtn.addEventListener('click',()=>{state.fillEnabled=false;update();});
  els.fillAccessoryGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-fill-accessory]');if(!b)return;state.fillAccessory=b.dataset.fillAccessory;ensureFillAccessoryAndCct();update();});
  els.fillCctGrid.addEventListener('click',e=>{const b=e.target.closest('button[data-fill-cct]');if(!b)return;state.fillCct=Number(b.dataset.fillCct);update();});
  els.fillIntensitySlider.addEventListener('input',()=>{state.fillIntensityPct=Number(els.fillIntensitySlider.value);update();});
  els.fillDistanceSlider.addEventListener('input',()=>{state.fillDistance=Number(els.fillDistanceSlider.value);update();});


  els.numericDialogValidate?.addEventListener('click',applyNumericEditor);
  els.numericDialogInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyNumericEditor();}});
  els.numericDialog?.addEventListener('click',e=>{if(e.target===els.numericDialog)els.numericDialog.close();});

  els.resetBtn.addEventListener('click',reset);
  els.themeToggle?.addEventListener('click',()=>{const next=document.body.classList.contains('dark')?'light':'dark';try{localStorage.setItem('bg-set-tools-theme',next);}catch(_){}applyTheme(next);});
}

function openNumericEditor(kind){
  const configs={
    intensity:{title:'Intensité Key Light',unit:'%',min:0,max:100,step:1,get:()=>state.intensityPct,set:v=>{state.intensityPct=v;els.intensitySlider.value=v;}},
    distance:{title:'Distance Key Light',unit:'m',min:1,max:20,step:.1,get:()=>state.testDistance,set:v=>{state.testDistance=v;els.testDistanceSlider.value=v;}},
    fillIntensity:{title:'Intensité Fill Light',unit:'%',min:0,max:100,step:1,get:()=>state.fillIntensityPct,set:v=>{state.fillIntensityPct=v;els.fillIntensitySlider.value=v;}},
    fillDistance:{title:'Distance Fill Light',unit:'m',min:1,max:20,step:.1,get:()=>state.fillDistance,set:v=>{state.fillDistance=v;els.fillDistanceSlider.value=v;}}
  };
  numericEditConfig=configs[kind];
  if(!numericEditConfig)return;
  els.numericDialogTitle.textContent=numericEditConfig.title;
  els.numericDialogUnit.textContent=numericEditConfig.unit;
  els.numericDialogInput.min=numericEditConfig.min;
  els.numericDialogInput.max=numericEditConfig.max;
  els.numericDialogInput.step=numericEditConfig.step;
  els.numericDialogInput.value=numericEditConfig.get();
  if(typeof els.numericDialog.showModal==='function')els.numericDialog.showModal();else els.numericDialog.setAttribute('open','');
  setTimeout(()=>{els.numericDialogInput.focus();els.numericDialogInput.select();},30);
}
function applyNumericEditor(){
  if(!numericEditConfig)return;
  let v=Number(String(els.numericDialogInput.value).replace(',','.'));
  if(!Number.isFinite(v))return;
  v=Math.max(numericEditConfig.min,Math.min(numericEditConfig.max,v));
  if(numericEditConfig.step>=1)v=Math.round(v);
  else v=Math.round(v/numericEditConfig.step)*numericEditConfig.step;
  numericEditConfig.set(v);
  update();
  if(els.numericDialog.open&&typeof els.numericDialog.close==='function')els.numericDialog.close();else els.numericDialog.removeAttribute('open');
}

function applyTheme(theme){
  const isDark=theme==='dark'; document.body.classList.toggle('dark',isDark);
  if(els.themeToggle){els.themeToggle.textContent=isDark?'LIGHT':'DARK'; els.themeToggle.setAttribute('aria-label',isDark?'Passer en mode clair':'Passer en mode sombre');}
  els.themeColor?.setAttribute('content',isDark?'#0B0C0E':'#F3F1EC');
}
function reset(){const defaultFixture=fixtures.halo60x?'halo60x':Object.keys(fixtures)[0];const defaultAccessory=fixtures[defaultFixture]?.defaultAccessory||Object.keys(fixtures[defaultFixture]?.accessories||{})[0];Object.assign(state,{fixture:defaultFixture,accessory:defaultAccessory,cct:5600,intensityPct:100,iso:800,shutterDenom:50,aperture:2.8,testDistance:2,fillEnabled:false,fillFixture:defaultFixture,fillAccessory:defaultAccessory,fillCct:5600,fillIntensityPct:50,fillDistance:2});try{localStorage.removeItem(STORAGE_KEY);}catch(_){}els.intensitySlider.value=100;els.isoSelect.value=800;els.apertureSelect.value=2.8;els.shutterSelect.value=50;els.testDistanceSlider.value=2;els.fillIntensitySlider.value=50;els.fillDistanceSlider.value=2;update();}

function update(){
  ensureAccessoryAndCct(); ensureFillAccessoryAndCct();
  renderAccessoryButtons(); renderCctButtons();
  renderFillState();

  const reqLux=requiredLux(state.iso,state.shutterDenom,state.aperture);
  const maxD=state.intensityPct<=0?0:solveDistanceForLuxForConfig(reqLux,state.fixture,state.accessory,state.cct,state.intensityPct);

  els.intensityValue.textContent=`${state.intensityPct} %`;
  els.testDistanceValue.textContent=`${formatDistance(state.testDistance)} m`;
  els.maxDistance.textContent=maxD>0?formatDistance(maxD):'0,0';
  if(els.resultDistanceSummary) els.resultDistanceSummary.textContent=`Distance possible : ${maxD>0?formatDistance(maxD):'0,0'} m`;
  els.cameraSummary.textContent=`ISO ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  if(els.cameraHeadingMeta) els.cameraHeadingMeta.textContent=els.cameraSummary.textContent;

  const brandLabel=BRAND_LABELS[brandForFixture()]||brandForFixture();
  const modelLabel=fixture().label.replace(new RegExp('^'+escapeRegex(brandLabel)+'\\s+','i'),'');
  els.lightSummary.textContent=`${brandLabel} · ${modelLabel} · ${accessoryUiLabel()}`;
  els.keyModelPickerLabel.textContent=fixture().label;
  els.heroSummary.textContent=`${fixture().label} · ${accessoryUiLabel()} · ${state.intensityPct} % · ISO max ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;
  els.beamHint.textContent=modifierHint();

  updateDistanceStatus(reqLux,maxD);
  updateManufacturerTech({sourceDescriptor:els.keyTechSourceDescriptor,measurementRow:els.keyTechMeasurementRow}, {fixtureKey:state.fixture,accessoryKey:state.accessory,cct:state.cct});
  updateResultTech({lux:els.resultTechLux,margin:els.resultTechMargin,requiredIso:els.resultTechRequiredIso,possibleAperture:els.resultTechPossibleAperture,dataNote:els.resultTechDataNote}, {fixtureKey:state.fixture,accessoryKey:state.accessory,cct:state.cct,intensityPct:state.intensityPct,distance:state.testDistance}, reqLux);
  updateFillContrast();
  if(state.fillEnabled){
    updateManufacturerTech({sourceDescriptor:els.fillTechSourceDescriptor,measurementRow:els.fillTechMeasurementRow}, {fixtureKey:state.fillFixture,accessoryKey:state.fillAccessory,cct:state.fillCct});
  }
  persistState();
}

function renderFillState(){
  els.fillDisabled.hidden=state.fillEnabled;
  els.fillControls.hidden=!state.fillEnabled;
  els.contrastSection.hidden=!state.fillEnabled;
  if(!state.fillEnabled){els.fillSummary.textContent='Désactivée'; return;}
  renderFillAccessoryButtons(); renderFillCctButtons();
  els.fillIntensitySlider.value=state.fillIntensityPct;
  els.fillDistanceSlider.value=state.fillDistance;
  els.fillIntensityValue.textContent=`${state.fillIntensityPct} %`;
  els.fillDistanceValue.textContent=`${formatDistance(state.fillDistance)} m`;
  const brandLabel=BRAND_LABELS[brandForFixture(state.fillFixture)]||brandForFixture(state.fillFixture);
  const modelLabel=fillFixture().label.replace(new RegExp('^'+escapeRegex(brandLabel)+'\\s+','i'),'');
  els.fillSummary.textContent=`${brandLabel} · ${modelLabel} · ${accessoryUiLabel(state.fillAccessory,fillAccessory())}`;
  els.fillModelPickerLabel.textContent=fillFixture().label;
}
function openProjectorPicker(target){
  pickerTarget=target;
  const currentKey=target==='fill'?state.fillFixture:state.fixture;
  pickerBrand=brandForFixture(currentKey);
  pickerFamily=uiGroupForFixture(currentKey);
  els.projectorDialogTitle.textContent='Changer de projecteur';
  els.projectorChooserContext.textContent=target==='fill'?'Fill Light':'Key Light';
  renderProjectorPicker();
  if(typeof els.projectorDialog.showModal==='function')els.projectorDialog.showModal();else els.projectorDialog.setAttribute('open','');
}
function closeProjectorPicker(){if(els.projectorDialog.open&&typeof els.projectorDialog.close==='function')els.projectorDialog.close();else els.projectorDialog.removeAttribute('open');}
function renderProjectorPicker(){
  const brandKeys=Object.keys(BRAND_GROUPS).filter(key=>BRAND_GROUPS[key]?.length);
  if(!brandKeys.includes(pickerBrand))pickerBrand=brandKeys[0]||'';
  const families=BRAND_GROUPS[pickerBrand]||[];
  if(!families.includes(pickerFamily))pickerFamily=families[0]||'';
  const currentKey=pickerTarget==='fill'?state.fillFixture:state.fixture;
  els.pickerBrandChoices.innerHTML=brandKeys.map(key=>`<button class="choice-btn ${key===pickerBrand?'active':''}" data-picker-brand="${key}" type="button">${BRAND_LABELS[key]}</button>`).join('');
  els.pickerFamilyChoices.innerHTML=families.map(key=>`<button class="choice-btn ${key===pickerFamily?'active':''}" data-picker-family="${key}" type="button">${GROUP_LABELS[key]}</button>`).join('');
  const models=UI_GROUPS[pickerFamily]||[];
  els.pickerModelChoices.innerHTML=models.map(key=>`<button class="choice-btn ${key===currentKey?'active':''}" data-picker-fixture="${key}" type="button">${POWER_LABELS[key]}</button>`).join('');
  els.pickerCatalogCount.textContent=`${DATABASE_INFO.fixtureCount} modèles utilisables dans LIGHT · ${DATABASE_INFO.totalFixtureCount} projecteurs dans BOS-PROJECTEURS-DB`;
}
function selectProjectorFromPicker(key){
  if(!fixtures[key])return;
  if(pickerTarget==='fill'){
    state.fillFixture=key;
    state.fillAccessory=fixtures[key].defaultAccessory;
    ensureFillAccessoryAndCct();
  }else{
    state.fixture=key;
    state.accessory=fixtures[key].defaultAccessory;
    ensureAccessoryAndCct();
  }
  closeProjectorPicker();
  update();
}

function renderAccessoryButtons(){const entries=Object.entries(fixture().accessories); els.accessoryGrid.style.gridTemplateColumns=`repeat(${Math.min(entries.length,3)},minmax(0,1fr))`; els.accessoryGrid.innerHTML=entries.map(([key,a])=>`<button data-accessory="${key}" class="${key===state.accessory?'active':''}" type="button">${accessoryUiLabel(key,a).toUpperCase()}</button>`).join(''); const a=accessory(); const notes=[]; if(a.quality==='single')notes.push('Ce mode repose sur un seul point constructeur : la distance est donc une estimation plus large.'); if(a.quality==='estimated')notes.push(`≈ ${a.estimateBasis || 'Valeur extrapolée : aucune photométrie constructeur n’est publiée pour ce modificateur.'}`); if(a.note)notes.push(a.note); if(fixture().note)notes.push(fixture().note); els.accessoryNote.textContent=notes.join(' ');}
function renderFillAccessoryButtons(){const entries=Object.entries(fillFixture().accessories); els.fillAccessoryGrid.style.gridTemplateColumns=`repeat(${Math.min(entries.length,3)},minmax(0,1fr))`; els.fillAccessoryGrid.innerHTML=entries.map(([key,a])=>`<button data-fill-accessory="${key}" class="${key===state.fillAccessory?'active':''}" type="button">${accessoryUiLabel(key,a).toUpperCase()}</button>`).join(''); const a=fillAccessory(), notes=[]; if(a.quality==='single')notes.push('Ce mode repose sur un seul point constructeur : la distance est donc une estimation plus large.'); if(a.quality==='estimated')notes.push(`≈ ${a.estimateBasis || 'Valeur extrapolée : aucune photométrie constructeur n’est publiée pour ce modificateur.'}`); if(a.note)notes.push(a.note); if(fillFixture().note)notes.push(fillFixture().note); els.fillAccessoryNote.textContent=notes.join(' ');}
function renderCctButtons(){const keys=Object.keys(accessory().data).map(Number).sort((a,b)=>a-b), isSingle=keys.length===1; els.cctSection.hidden=false; els.cctValue.textContent=`${state.cct} K`; els.cctGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,6)},minmax(0,1fr))`; els.cctGrid.innerHTML=keys.map(k=>`<button data-cct="${k}" class="${k===state.cct?'active':''}" type="button">${k}</button>`).join(''); els.cctNote.textContent=isSingle?'Une seule température de référence est disponible dans les données publiées pour cette configuration.':'';}
function renderFillCctButtons(){const keys=Object.keys(fillAccessory().data).map(Number).sort((a,b)=>a-b), isSingle=keys.length===1; els.fillCctSection.hidden=false; els.fillCctValue.textContent=`${state.fillCct} K`; els.fillCctGrid.style.gridTemplateColumns=`repeat(${Math.min(keys.length,6)},minmax(0,1fr))`; els.fillCctGrid.innerHTML=keys.map(k=>`<button data-fill-cct="${k}" class="${k===state.fillCct?'active':''}" type="button">${k}</button>`).join(''); els.fillCctNote.textContent=isSingle?'Une seule température de référence est disponible dans les données publiées pour cette configuration.':'';}

function requiredLux(iso,shutterDenom,aperture){const t=1/shutterDenom;return INCIDENT_C*aperture*aperture/(iso*t);}
function curveLux(distance,points){const d=Math.max(.05,distance); if(points.length===1){const [d1,e1]=points[0];return e1*Math.pow(d1/d,2);} let a,b;if(d<=points[0][0])[a,b]=[points[0],points[1]];else if(d>=points[points.length-1][0])[a,b]=[points[points.length-2],points[points.length-1]];else{for(let i=0;i<points.length-1;i++){if(d>=points[i][0]&&d<=points[i+1][0]){a=points[i];b=points[i+1];break;}}} const [d1,e1]=a,[d2,e2]=b;const exponent=Math.log(e2/e1)/Math.log(d2/d1);return e1*Math.pow(d/d1,exponent);}
function estimatedLuxAtDistance(distance,fixtureKey=state.fixture,intensityPct=state.intensityPct,accessoryKey=null,cct=state.cct){if(intensityPct<=0)return 0; const aKey=accessoryKey||state.accessory; const points=getPoints(fixtureKey,aKey,cct); return curveLux(distance,points)*(intensityPct/100);}
function solveDistanceForLuxForConfig(targetLux,fixtureKey,accessoryKey,cct,intensityPct){if(intensityPct<=0)return 0; if(estimatedLuxAtDistance(.1,fixtureKey,intensityPct,accessoryKey,cct)<targetLux)return 0; let lo=.1,hi=1; while(estimatedLuxAtDistance(hi,fixtureKey,intensityPct,accessoryKey,cct)>targetLux&&hi<200)hi*=2; if(hi>=200&&estimatedLuxAtDistance(hi,fixtureKey,intensityPct,accessoryKey,cct)>targetLux)return 200; for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(estimatedLuxAtDistance(mid,fixtureKey,intensityPct,accessoryKey,cct)>=targetLux)lo=mid;else hi=mid;} return (lo+hi)/2;}

function updateDistanceStatus(reqLux,maxD){
  const d=state.testDistance,lux=estimatedLuxAtDistance(d),margin=lux>0?Math.log2(lux/reqLux):-Infinity,reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity,possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  els.statusBox.classList.remove('comfortable','just','insufficient');
  els.resultHeroCard?.classList.remove('status-comfortable','status-just','status-insufficient');
  let title,text,cls;
  if(state.intensityPct<=0||lux<=0){cls='insufficient';title='SOURCE ÉTEINTE';text='Le projecteur est à 0 %. Monte sa puissance pour commencer le calcul.';}
  else if(margin>=.7){cls='comfortable';title='CONFORTABLE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet suffit pour tes réglages caméra, avec encore de la marge.`;}
  else if(margin>=0){cls='just';title='ÇA PASSE';text=`À ${formatDistance(d)} m, tu atteins l’exposition de référence avec tes réglages caméra, mais avec peu de marge.`;}
  else{cls='insufficient';title='PAS ASSEZ DE LUMIÈRE';text=`À ${formatDistance(d)} m, la lumière reçue au niveau du sujet est insuffisante pour tes réglages caméra.`;}
  els.statusBox.classList.add(cls); if(els.resultHeroCard) els.resultHeroCard.classList.add(`status-${cls}`); els.statusTitle.textContent=title; els.statusText.textContent=text;
  const solutions=[];
  if(state.intensityPct<=0){els.solutionIntro.textContent='Pour obtenir une exposition de référence, commence par :'; solutions.push(['MONTE LA PUISSANCE','au-dessus de 0 %']);}
  else if(margin>=0){ if(maxD>d+.1)solutions.push(['TU PEUX RECULER',`jusqu’à ${formatDistance(maxD)} m`]); const targetPct=state.intensityPct*reqLux/lux; if(targetPct<state.intensityPct-3&&targetPct>=1)solutions.push(['TU PEUX DIMMER',`vers ${Math.max(1,Math.round(targetPct))} %`]); const closeF=snapApertureForClosing(possibleF,state.aperture); if(closeF)solutions.push(['TU PEUX FERMER',`jusqu’à environ f/${formatAperture(closeF)}`]); els.solutionIntro.textContent=solutions.length?'Tu es dans la bonne zone. Si tu veux modifier ton installation :':'Tu es dans la bonne zone.'; }
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

function updateManufacturerTech(ui,cfg){
  const fixtureObj=fixtures[cfg.fixtureKey];
  const accessoryObj=fixtureObj.accessories[cfg.accessoryKey];
  const points=getPoints(cfg.fixtureKey,cfg.accessoryKey,cfg.cct);
  const cctLabel=accessoryObj.quality==='single'?'sortie max publiée':`${cfg.cct} K`;
  if(ui.sourceDescriptor) ui.sourceDescriptor.textContent=`${fixtureObj.label} · ${accessoryObj.label} · ${cctLabel} · à 100 %`;
  if(ui.measurementRow) ui.measurementRow.innerHTML=points.map(([md,mlux])=>`<span class="measure-inline"><b>${md} m</b><strong>${formatLux(mlux)} lux</strong></span>`).join('');
}

function updateResultTech(ui,cfg,reqLux){
  const accessoryObj=fixtures[cfg.fixtureKey].accessories[cfg.accessoryKey];
  const points=getPoints(cfg.fixtureKey,cfg.accessoryKey,cfg.cct);
  const lux=estimatedLuxAtDistance(cfg.distance,cfg.fixtureKey,cfg.intensityPct,cfg.accessoryKey,cfg.cct);
  const margin=lux>0?Math.log2(lux/reqLux):-Infinity;
  const reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity;
  const possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  ui.lux.textContent=`${formatLux(lux)} lux`;
  ui.margin.textContent=Number.isFinite(margin)?`${margin>=0?'+':''}${margin.toFixed(1).replace('.',',')} stop${Math.abs(margin)>=1.5?'s':''}`:'—';
  ui.requiredIso.textContent=Number.isFinite(reqIso)?`ISO ${formatIso(reqIso)}`:'—';
  ui.possibleAperture.textContent=possibleF>0?`f/${formatAperture(possibleF)}`:'—';
  const maxD=solveDistanceForLuxForConfig(reqLux,cfg.fixtureKey,cfg.accessoryKey,cfg.cct,cfg.intensityPct);
  const rangeAtTest=classifyDistance(cfg.distance,points,accessoryObj.quality);
  const rangeAtMax=classifyDistance(maxD,points,accessoryObj.quality);
  const warning=rangeAtTest.warning||rangeAtMax.warning;
  if(accessoryObj.quality==='estimated') ui.dataNote.textContent='Cette configuration utilise une estimation pour le modificateur sélectionné.';
  else if(accessoryObj.quality==='single') ui.dataNote.textContent='Le calcul de distance repose sur un seul point photométrique disponible ; la distance est donc une estimation.';
  else if(warning) ui.dataNote.textContent=`Une partie du calcul sort de la plage mesurée (${rangeAtTest.label.toLowerCase()} / distance max : ${rangeAtMax.label.toLowerCase()}).`;
  else ui.dataNote.textContent='La distance testée et la distance maximale restent dans la plage photométrique disponible.';
  ui.dataNote.classList.toggle('warning',warning||accessoryObj.quality==='single'||accessoryObj.quality==='estimated');
}

function updateLightTechLegacy(ui,cfg,reqLux){
  const fixtureObj=fixtures[cfg.fixtureKey];
  const accessoryObj=fixtureObj.accessories[cfg.accessoryKey];
  const points=getPoints(cfg.fixtureKey,cfg.accessoryKey,cfg.cct);
  const lux=estimatedLuxAtDistance(cfg.distance,cfg.fixtureKey,cfg.intensityPct,cfg.accessoryKey,cfg.cct);
  const margin=lux>0?Math.log2(lux/reqLux):-Infinity;
  const reqIso=lux>0?INCIDENT_C*state.aperture*state.aperture/(lux*(1/state.shutterDenom)):Infinity;
  const possibleF=lux>0?Math.sqrt(lux*state.iso*(1/state.shutterDenom)/INCIDENT_C):0;
  ui.lux.textContent=`${formatLux(lux)} lux`;
  ui.margin.textContent=Number.isFinite(margin)?`${margin>=0?'+':''}${margin.toFixed(1).replace('.',',')} stop${Math.abs(margin)>=1.5?'s':''}`:'—';
  ui.requiredIso.textContent=Number.isFinite(reqIso)?`ISO ${formatIso(reqIso)}`:'—';
  ui.possibleAperture.textContent=possibleF>0?`f/${formatAperture(possibleF)}`:'—';
  const cctLabel=accessoryObj.quality==='single'?'sortie max publiée':`${cfg.cct} K`;
  ui.sourceDescriptor.textContent=`${fixtureObj.label} · ${accessoryObj.label} · ${cctLabel} · à 100 %`;
  ui.measurementRow.innerHTML=points.map(([md,mlux])=>`<div class="measure-chip"><span>${md} m</span><strong>${formatLux(mlux)} lux</strong></div>`).join('');
  const rangeAtTest=classifyDistance(cfg.distance,points,accessoryObj.quality);
  const maxD=solveDistanceForLuxForConfig(reqLux,cfg.fixtureKey,cfg.accessoryKey,cfg.cct,cfg.intensityPct);
  const rangeAtMax=classifyDistance(maxD,points,accessoryObj.quality);
  const warning=rangeAtTest.warning||rangeAtMax.warning;
  if(accessoryObj.quality==='estimated') ui.dataNote.textContent=`ESTIMATION MODIFICATEUR — ${accessoryObj.estimateBasis || 'Aucune mesure constructeur directe pour cette configuration.'} ${accessoryObj.estimateWarning || ''}`;
  else if(accessoryObj.quality==='single') ui.dataNote.textContent='Un seul point constructeur est publié pour ce mode. LIGHT applique une décroissance en carré inverse : considère la distance comme une estimation, pas comme une mesure constructeur complète.';
  else ui.dataNote.textContent=warning?`Une partie du calcul sort de la plage mesurée (${rangeAtTest.label.toLowerCase()} / distance max : ${rangeAtMax.label.toLowerCase()}).`:'La distance testée et la distance max restent dans la plage de mesures constructeur ; LIGHT interpole entre les points publiés.';
  ui.dataNote.classList.toggle('warning',warning||accessoryObj.quality==='single'||accessoryObj.quality==='estimated');
  const src=DATABASE_INFO.source==='remote'?'base commune en ligne':DATABASE_INFO.source==='local'?'copie locale de secours':DATABASE_INFO.source;
  ui.databaseNote.textContent=`BOS-PROJECTEURS-DB v${DATABASE_INFO.version} · ${DATABASE_INFO.fixtureCount} projecteurs calculables / ${DATABASE_INFO.totalFixtureCount} au total · ${src} · mise à jour ${DATABASE_INFO.updated}`;
  if(cfg.intensityPct===100){ui.dimmerNote.textContent=fixtureObj.note?`Puissance 100 % : ${fixtureObj.note}`:'Puissance 100 % : les points de départ sont les mesures publiées par le constructeur.';ui.dimmerNote.classList.remove('warning');}
  else{ui.dimmerNote.textContent='Sous 100 %, LIGHT estime les lux proportionnellement au dimmer. Cette partie est moins fiable faute de courbe constructeur détaillée par pourcentage.';ui.dimmerNote.classList.add('warning');}
  ui.labBadge.textContent=accessoryObj.quality==='estimated'?'ESTIMATION':(BRAND_LABELS[brandForFixture(cfg.fixtureKey)]||brandForFixture(cfg.fixtureKey)).toUpperCase();
  ui.labBadge.classList.toggle('estimate-badge',accessoryObj.quality==='estimated');
}
function classifyDistance(distance,points,quality){if(!Number.isFinite(distance)||distance<=0)return{label:'source éteinte',warning:true};if(quality==='estimated')return{label:'estimation modificateur',warning:true};if(quality==='single')return{label:'estimation depuis 1 point',warning:true};const min=points[0][0],max=points[points.length-1][0];if(distance<min)return{label:`extrapolation < ${min} m`,warning:true};if(distance>max)return{label:`extrapolation > ${max} m`,warning:true};return{label:'interpolation constructeur',warning:false};}

function updateFillContrast(){
  if(!state.fillEnabled) return;
  const keyLux=estimatedLuxAtDistance(state.testDistance);
  const fillLux=estimatedLuxAtDistance(state.fillDistance,state.fillFixture,state.fillIntensityPct,state.fillAccessory,state.fillCct);
  els.keyLuxResult.textContent=`${formatLux(keyLux)} lux`;
  els.fillLuxResult.textContent=`${formatLux(fillLux)} lux`;
  if(fillLux<=0){
    els.sourceGapResult.textContent='∞';
    els.sourceGapDetail.textContent='Fill éteinte';
    els.sourceRatioResult.textContent='∞ : 1';
    els.estimatedContrastResult.textContent='∞ · contraste non limité par la Fill';
    els.contrastCharacter.textContent='TRÈS CONTRASTÉ';
    return;
  }
  const q=keyLux/fillLux;
  let gapText, detail, gapStops=0;
  if(keyLux<=0){
    gapText='−∞';
    detail='Key éteinte';
  } else {
    const gap=Math.log2(q);
    gapStops=Math.abs(gap);
    gapText=`${gap>=0?'+':'−'}${Math.abs(gap).toFixed(1).replace('.',',')} stop${Math.abs(gap)>=1.5?'s':''}`;
    if(Math.abs(gap)<.05) detail='Niveaux pratiquement identiques';
    else if(gap>0) detail=`Key ${formatRatio(q)}× plus forte`;
    else detail=`Fill ${formatRatio(1/q)}× plus forte`;
  }
  const sourceRatio=q>=1?`${formatRatio(q)} : 1`:`1 : ${formatRatio(1/q)}`;
  const contrastRatio=1+q, contrastStops=Math.log2(contrastRatio);
  const character=gapStops<0.5?'FLAT':contrastStops<1.5?'DOUX':contrastStops<2.5?'MARQUÉ':contrastStops<4?'FORT':'TRÈS CONTRASTÉ';
  els.sourceGapResult.textContent=gapText;
  els.sourceGapDetail.textContent=detail;
  els.sourceRatioResult.textContent=sourceRatio;
  els.estimatedContrastResult.textContent=`≈ ${formatRatio(contrastRatio)} : 1 · ${contrastStops.toFixed(1).replace('.',',')} stops`;
  els.contrastCharacter.textContent=character;
}

function snapApertureForOpening(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=0||maxF>=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f<currentF);return valid.length?valid[valid.length-1]:null;}
function snapApertureForClosing(maxF,currentF){if(!Number.isFinite(maxF)||maxF<=currentF)return null;const valid=APERTURES.filter(f=>f<=maxF&&f>currentF);return valid.length?valid[valid.length-1]:null;}
function snapIsoUp(requiredIso){return ISO_VALUES.find(v=>v>=requiredIso)||null;}
function accessoryRole(key,a){if(a?.role)return a.role;if(key==='bare')return'bare';if(key.toLowerCase().includes('reflector'))return'reflector';if(['reflector','miniReflector'].includes(key))return'reflector';if(key.includes('softbox')||key.includes('dome'))return'softbox';if(key.toLowerCase().includes('spot'))return'fresnelSpot';if(key.toLowerCase().includes('flood'))return'fresnelFlood';return key;}
function currentAccessoryRole(){return accessoryRole(state.accessory,accessory());}
function findAccessoryByRole(fixtureKey,role){const entries=Object.entries(fixtures[fixtureKey].accessories);return entries.find(([k,a])=>accessoryRole(k,a)===role)?.[0]||null;}
function findStrongerFixture(reqLux,distance){const group=uiGroupForFixture(),order=UI_GROUPS[group]||[],idx=order.indexOf(state.fixture),role=currentAccessoryRole(); for(let i=idx+1;i<order.length;i++){const key=order[i],candidateAccessory=findAccessoryByRole(key,role);if(candidateAccessory&&estimatedLuxAtDistance(distance,key,100,candidateAccessory)>=reqLux)return key;} return null;}
function accessoryUiLabel(key=state.accessory,a=accessory()){const role=accessoryRole(key,a); if(role==='reflector') return a.quality==='estimated'?'Bol ≈':'Bol'; return a.label;}
function modifierHint(){const a=accessory(), role=currentAccessoryRole(), label=accessoryUiLabel(); if(role==='reflector') return 'Avec bol — faisceau concentré'; if(role==='softbox') return `Avec ${label} — faisceau large et diffus`; if(role==='bare') return 'Nu — faisceau natif du projecteur'; if(role==='fresnelSpot') return `Avec ${label} — faisceau étroit et concentré`; if(role==='fresnelFlood') return `Avec ${label} — faisceau élargi`; if(role==='grid') return `Avec ${label} — faisceau contrôlé`; return label;}
function formatRatio(v){if(!Number.isFinite(v))return'∞';if(v===0)return'0';const r=Math.round(v);if(Math.abs(v-r)<.05)return String(r);return (v>=10?v.toFixed(0):v.toFixed(1)).replace('.',',');}
function formatLux(v){if(!Number.isFinite(v))return'—';if(v>=100)return Math.round(v).toLocaleString('fr-FR');if(v>=10)return v.toFixed(1).replace('.',',');return v.toFixed(2).replace('.',',');}
function formatDistance(v){if(!Number.isFinite(v))return'—';if(v>=20)return v.toFixed(0).replace('.',',');return v.toFixed(1).replace('.',',');}
function formatAperture(v){if(!Number.isFinite(v))return'—';return v.toFixed(1).replace(/\.0$/,'').replace('.',',');}
function formatIso(v){if(!Number.isFinite(v))return'—';if(v>=1000)return Math.round(v/10)*10;return Math.max(1,Math.round(v));}
function escapeRegex(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}



const projectContactBtn=document.getElementById('projectContactBtn');
if(projectContactBtn){
  projectContactBtn.addEventListener('click',()=>{
    window.open('https://www.brunoguillard.com/','_blank','noopener');
  });
}
