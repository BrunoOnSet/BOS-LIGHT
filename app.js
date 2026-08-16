// BOS LIGHT V0.5 — assistant de puissance/exposition pour le tournage
// Données constructeur : Aputure/amaran Halo.
// Conversion d'exposition incidente : constante C = 340 (Lumisphere Sekonic).

const INCIDENT_C = 340;

const state = {
  fixture: 'halo60x',
  accessory: 'softbox',
  cct: 5600,
  intensityPct: 100,
  iso: 800,
  shutterDenom: 50,
  aperture: 2.8,
  testDistance: 2.0
};

const fixtures = {
  halo60x: {
    label: 'Halo 60x', softboxLabel: 'Softbox 60', maxMeasuredM: 3,
    data: {
      2700:{bare:[[1,2570],[3,295]],softbox:[[1,1760],[3,133]],reflector:[[1,21440],[3,2164]]},
      3200:{bare:[[1,2800],[3,321]],softbox:[[1,1927],[3,145]],reflector:[[1,23530],[3,2372]]},
      4300:{bare:[[1,3070],[3,353]],softbox:[[1,2129],[3,160]],reflector:[[1,26000],[3,2622]]},
      5600:{bare:[[1,3240],[3,372]],softbox:[[1,2255],[3,169]],reflector:[[1,27520],[3,2777]]},
      6500:{bare:[[1,3270],[3,375]],softbox:[[1,2285],[3,171]],reflector:[[1,27890],[3,2812]]}
    }
  },
  halo100x: {
    label: 'Halo 100x', softboxLabel: 'Softbox 60', maxMeasuredM: 3,
    data: {
      2700:{bare:[[1,3670],[3,414]],softbox:[[1,2417],[3,182]],reflector:[[1,27910],[3,2690]]},
      3200:{bare:[[1,4360],[3,492]],softbox:[[1,2892],[3,218]],reflector:[[1,33500],[3,3230]]},
      4300:{bare:[[1,4890],[3,551]],softbox:[[1,3280],[3,247]],reflector:[[1,38100],[3,3670]]},
      5600:{bare:[[1,4860],[3,547]],softbox:[[1,3290],[3,248]],reflector:[[1,38400],[3,3700]]},
      6500:{bare:[[1,4630],[3,521]],softbox:[[1,3140],[3,237]],reflector:[[1,36700],[3,3540]]}
    }
  },
  halo200x: {
    label: 'Halo 200x', softboxLabel: 'Softbox 90', maxMeasuredM: 5,
    data: {
      2700:{bare:[[1,7800],[3,881],[5,358]],softbox:[[1,7090],[3,489],[5,175]],reflector:[[1,22000],[3,2136],[5,746]]},
      3200:{bare:[[1,9460],[3,1066],[5,441]],softbox:[[1,8620],[3,595],[5,216]],reflector:[[1,26730],[3,2594],[5,921]]},
      4300:{bare:[[1,10500],[3,1184],[5,495]],softbox:[[1,9620],[3,662],[5,244]],reflector:[[1,29800],[3,2889],[5,1038]]},
      5600:{bare:[[1,10530],[3,1187],[5,503]],softbox:[[1,9670],[3,666],[5,248]],reflector:[[1,29980],[3,2901],[5,1054]]},
      6500:{bare:[[1,9800],[3,1104],[5,471]],softbox:[[1,9010],[3,621],[5,233]],reflector:[[1,27930],[3,2705],[5,988]]}
    }
  },
  halo300x: {
    label: 'Halo 300x', softboxLabel: 'Softbox 90', maxMeasuredM: 5,
    data: {
      2700:{bare:[[1,11850],[3,1335],[5,554]],softbox:[[1,11530],[3,808],[5,293]],reflector:[[1,38100],[3,3630],[5,1292]]},
      3200:{bare:[[1,14600],[3,1647],[5,685]],softbox:[[1,14250],[3,999],[5,364]],reflector:[[1,47200],[3,4480],[5,1602]]},
      4300:{bare:[[1,16200],[3,1827],[5,768]],softbox:[[1,15850],[3,1113],[5,410]],reflector:[[1,52600],[3,5000],[5,1803]]},
      5600:{bare:[[1,16120],[3,1819],[5,763]],softbox:[[1,15890],[3,1111],[5,408]],reflector:[[1,52600],[3,5000],[5,1796]]},
      6500:{bare:[[1,14360],[3,1515],[5,683]],softbox:[[1,14140],[3,989],[5,366]],reflector:[[1,46800],[3,4450],[5,1610]]}
    }
  },
  halo600x: {
    label: 'Halo 600x', softboxLabel: 'Softbox 90', maxMeasuredM: 5,
    data: {
      2700:{bare:[[1,23600],[3,2627],[5,1094]],softbox:[[1,21590],[3,1485],[5,566]],reflector:[[1,72500],[3,6900],[5,2519]]},
      3200:{bare:[[1,27920],[3,3100],[5,1280]],softbox:[[1,25590],[3,1767],[5,662]],reflector:[[1,86400],[3,8200],[5,2948]]},
      4300:{bare:[[1,32000],[3,3550],[5,1475]],softbox:[[1,29700],[3,2042],[5,768]],reflector:[[1,99900],[3,9480],[5,3420]]},
      5600:{bare:[[1,32500],[3,3610],[5,1494]],softbox:[[1,30300],[3,2087],[5,782]],reflector:[[1,102100],[3,9680],[5,3480]]},
      6500:{bare:[[1,31200],[3,3460],[5,1461]],softbox:[[1,29300],[3,2012],[5,766]],reflector:[[1,98400],[3,9340],[5,3410]]}
    }
  }
};

const accessoryLabels = { bare: 'Nu', reflector: 'Réflecteur', softbox: 'Softbox' };
const ISO_VALUES = [100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800];
const SHUTTER_DENOMS = [24,25,30,40,48,50,60,80,100,120,125,160,200,250,320,400,500,640,800,1000];
const APERTURES = [1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];
const FIXTURE_ORDER = ['halo60x','halo100x','halo200x','halo300x','halo600x'];

const $ = sel => document.querySelector(sel);
const els = {
  fixtureGrid: $('#fixtureGrid'), accessoryGrid: $('#accessoryGrid'), cctGrid: $('#cctGrid'),
  softboxButtonLabel: $('#softboxButtonLabel'), cctValue: $('#cctValue'),
  intensitySlider: $('#intensitySlider'), intensityValue: $('#intensityValue'),
  isoSelect: $('#isoSelect'), shutterSelect: $('#shutterSelect'), apertureSelect: $('#apertureSelect'),
  maxDistance: $('#maxDistance'), heroSummary: $('#heroSummary'),
  testDistanceSlider: $('#testDistanceSlider'), testDistanceValue: $('#testDistanceValue'),
  statusBox: $('#statusBox'), statusTitle: $('#statusTitle'), statusText: $('#statusText'), solutionIntro: $('#solutionIntro'), solutions: $('#solutions'),
  testLux: $('#testLux'), stopMargin: $('#stopMargin'), requiredIso: $('#requiredIso'), possibleAperture: $('#possibleAperture'),
  sourceDescriptor: $('#sourceDescriptor'), measurementRow: $('#measurementRow'), dataNote: $('#dataNote'), dimmerNote: $('#dimmerNote'),
  resetBtn: $('#resetBtn')
};

init();

function init() {
  populateSelect(els.isoSelect, ISO_VALUES, v => `ISO ${v}`, state.iso);
  populateSelect(els.apertureSelect, APERTURES, v => `f/${formatAperture(v)}`, state.aperture);
  populateSelect(els.shutterSelect, SHUTTER_DENOMS, v => `1/${v}`, state.shutterDenom);
  bindUI();
  update();
}

function populateSelect(select, values, labelFn, selected) {
  select.innerHTML = '';
  values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = labelFn(v);
    if (Number(v) === Number(selected)) opt.selected = true;
    select.appendChild(opt);
  });
}

function bindUI() {
  els.fixtureGrid.addEventListener('click', e => {
    const b = e.target.closest('button[data-fixture]'); if (!b) return;
    state.fixture = b.dataset.fixture; update();
  });
  els.accessoryGrid.addEventListener('click', e => {
    const b = e.target.closest('button[data-accessory]'); if (!b) return;
    state.accessory = b.dataset.accessory; update();
  });
  els.cctGrid.addEventListener('click', e => {
    const b = e.target.closest('button[data-cct]'); if (!b) return;
    state.cct = Number(b.dataset.cct); update();
  });
  els.intensitySlider.addEventListener('input', () => { state.intensityPct = Number(els.intensitySlider.value); update(); });
  els.isoSelect.addEventListener('change', () => { state.iso = Number(els.isoSelect.value); update(); });
  els.apertureSelect.addEventListener('change', () => { state.aperture = Number(els.apertureSelect.value); update(); });
  els.shutterSelect.addEventListener('change', () => { state.shutterDenom = Number(els.shutterSelect.value); update(); });
  els.testDistanceSlider.addEventListener('input', () => { state.testDistance = Number(els.testDistanceSlider.value); update(); });
  els.resetBtn.addEventListener('click', reset);
}

function reset() {
  Object.assign(state, { fixture:'halo60x', accessory:'softbox', cct:5600, intensityPct:100, iso:800, shutterDenom:50, aperture:2.8, testDistance:2.0 });
  els.intensitySlider.value = state.intensityPct;
  els.isoSelect.value = state.iso;
  els.apertureSelect.value = state.aperture;
  els.shutterSelect.value = state.shutterDenom;
  els.testDistanceSlider.value = state.testDistance;
  update();
}

function update() {
  syncActiveButtons();
  const fixture = fixtures[state.fixture];
  const points = getPoints();
  const reqLux = requiredLux(state.iso, state.shutterDenom, state.aperture);
  const maxD = state.intensityPct <= 0 ? 0 : solveDistanceForLux(reqLux);

  els.softboxButtonLabel.textContent = fixture.softboxLabel.toUpperCase();
  els.cctValue.textContent = `${state.cct} K`;
  els.intensityValue.textContent = `${state.intensityPct} %`;
  els.testDistanceValue.textContent = `${state.testDistance.toFixed(1).replace('.', ',')} m`;
  els.maxDistance.textContent = maxD > 0 ? formatDistance(maxD) : '0,0';
  els.heroSummary.textContent = `${fixture.label} · ${currentAccessoryLabel()} · ${state.intensityPct} % · ISO max ${state.iso} · f/${formatAperture(state.aperture)} · 1/${state.shutterDenom}`;

  updateDistanceStatus(reqLux, maxD);
  updateAdvanced(reqLux, maxD, points);
}

function syncActiveButtons() {
  document.querySelectorAll('[data-fixture]').forEach(b => b.classList.toggle('active', b.dataset.fixture === state.fixture));
  document.querySelectorAll('[data-accessory]').forEach(b => b.classList.toggle('active', b.dataset.accessory === state.accessory));
  document.querySelectorAll('[data-cct]').forEach(b => b.classList.toggle('active', Number(b.dataset.cct) === state.cct));
}

function currentAccessoryLabel(fixtureKey = state.fixture) {
  if (state.accessory === 'softbox') return fixtures[fixtureKey].softboxLabel;
  return accessoryLabels[state.accessory];
}

function getPoints(fixtureKey = state.fixture) {
  return fixtures[fixtureKey].data[state.cct][state.accessory];
}

function requiredLux(iso, shutterDenom, aperture) {
  const t = 1 / shutterDenom;
  return INCIDENT_C * aperture * aperture / (iso * t);
}

function estimatedLuxAtDistance(distance, fixtureKey = state.fixture, intensityPct = state.intensityPct) {
  if (intensityPct <= 0) return 0;
  const fullPower = curveLux(distance, getPoints(fixtureKey));
  return fullPower * (intensityPct / 100);
}

function curveLux(distance, points) {
  const d = Math.max(0.05, distance);
  let a, b;
  if (d <= points[0][0]) [a,b] = [points[0], points[1]];
  else if (d >= points[points.length - 1][0]) [a,b] = [points[points.length - 2], points[points.length - 1]];
  else {
    for (let i=0;i<points.length-1;i++) {
      if (d >= points[i][0] && d <= points[i+1][0]) { a=points[i]; b=points[i+1]; break; }
    }
  }
  const [d1,e1] = a; const [d2,e2] = b;
  const exponent = Math.log(e2/e1) / Math.log(d2/d1);
  return e1 * Math.pow(d/d1, exponent);
}

function solveDistanceForLux(targetLux) {
  if (state.intensityPct <= 0) return 0;
  if (estimatedLuxAtDistance(0.1) < targetLux) return 0;
  let lo = 0.1, hi = 1;
  while (estimatedLuxAtDistance(hi) > targetLux && hi < 200) hi *= 2;
  if (hi >= 200 && estimatedLuxAtDistance(hi) > targetLux) return 200;
  for (let i=0;i<80;i++) {
    const mid = (lo+hi)/2;
    if (estimatedLuxAtDistance(mid) >= targetLux) lo = mid; else hi = mid;
  }
  return (lo+hi)/2;
}

function updateDistanceStatus(reqLux, maxD) {
  const d = state.testDistance;
  const lux = estimatedLuxAtDistance(d);
  const margin = lux > 0 ? Math.log2(lux / reqLux) : -Infinity;
  const reqIso = lux > 0 ? INCIDENT_C * state.aperture * state.aperture / (lux * (1/state.shutterDenom)) : Infinity;
  const possibleF = lux > 0 ? Math.sqrt(lux * state.iso * (1/state.shutterDenom) / INCIDENT_C) : 0;

  els.statusBox.classList.remove('comfortable','just','insufficient');
  let title, text, cls;
  if (state.intensityPct <= 0 || lux <= 0) {
    cls = 'insufficient';
    title = 'SOURCE ÉTEINTE';
    text = 'Le projecteur est à 0 %. Monte sa puissance pour commencer le calcul.';
  } else if (margin >= 0.7) {
    cls = 'comfortable';
    title = 'CONFORTABLE';
    text = `À ${formatDistance(d)} m, la quantité de lumière reçue au niveau du sujet est suffisante avec tes réglages caméra, avec encore de la marge.`;
  } else if (margin >= 0) {
    cls = 'just';
    title = 'ÇA PASSE';
    text = `À ${formatDistance(d)} m, tu atteins l’exposition de référence avec tes réglages caméra, mais avec peu de marge.`;
  } else {
    cls = 'insufficient';
    title = 'PAS ASSEZ DE LUMIÈRE';
    text = `À ${formatDistance(d)} m, la quantité de lumière reçue au niveau du sujet est insuffisante pour tes réglages caméra.`;
  }
  els.statusBox.classList.add(cls);
  els.statusTitle.textContent = title;
  els.statusText.textContent = text;

  const solutions = [];
  if (state.intensityPct <= 0) {
    els.solutionIntro.textContent = 'Pour obtenir une exposition de référence, commence par :';
    solutions.push(['MONTE LA PUISSANCE','au-dessus de 0 %']);
  } else if (margin >= 0) {
    els.solutionIntro.textContent = 'Tu es dans la bonne zone. Si tu veux modifier ton installation :';
    if (maxD > d + 0.1) solutions.push(['TU PEUX RECULER',`jusqu’à ${formatDistance(maxD)} m`]);
    const targetPct = state.intensityPct * reqLux / lux;
    if (targetPct < state.intensityPct - 3 && targetPct >= 1) solutions.push(['TU PEUX DIMMER',`vers ${Math.max(1,Math.round(targetPct))} %`]);
    const closeF = snapApertureForClosing(possibleF, state.aperture);
    if (closeF) solutions.push(['TU PEUX FERMER',`jusqu’à environ f/${formatAperture(closeF)}`]);
  } else {
    els.solutionIntro.textContent = `Pour obtenir une bonne exposition à ${formatDistance(d)} m, change au moins un de ces réglages :`;
    if (maxD > 0) {
      if (maxD >= 1) solutions.push(['RAPPROCHE TA SOURCE',`place-la à ${formatDistance(maxD)} m ou moins`]);
      else solutions.push(['RAPPROCHE TA SOURCE','il faudrait moins de 1 m']);
    }
    const neededPct = lux > 0 ? state.intensityPct * reqLux / lux : Infinity;
    if (state.intensityPct < 100 && neededPct <= 100) solutions.push(['MONTE LA PUISSANCE',`vers ${Math.ceil(neededPct)} %`]);
    const openF = snapApertureForOpening(possibleF, state.aperture);
    if (openF) solutions.push(['OUVRE TON DIAPH',`passe à f/${formatAperture(openF)} ou plus ouvert`]);
    if (Number.isFinite(reqIso) && reqIso > state.iso) {
      const isoStep = snapIsoUp(reqIso);
      solutions.push(['MONTE TON ISO', isoStep ? `passe à environ ISO ${isoStep}` : `il faudrait environ ISO ${formatIso(reqIso)}`]);
    }
    const stronger = findStrongerFixture(reqLux, d);
    if (stronger) solutions.push(['PRENDS PLUS PUISSANT',`passe au ${fixtures[stronger].label}`]);
  }

  els.solutions.innerHTML = solutions.slice(0,4).map(([label,value]) => `<div class="solution"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function snapApertureForOpening(maxF, currentF) {
  if (!Number.isFinite(maxF) || maxF <= 0 || maxF >= currentF) return null;
  const valid = APERTURES.filter(f => f <= maxF && f < currentF);
  return valid.length ? valid[valid.length - 1] : null;
}

function snapApertureForClosing(maxF, currentF) {
  if (!Number.isFinite(maxF) || maxF <= currentF) return null;
  const valid = APERTURES.filter(f => f <= maxF && f > currentF);
  return valid.length ? valid[valid.length - 1] : null;
}

function snapIsoUp(requiredIso) {
  return ISO_VALUES.find(v => v >= requiredIso) || null;
}

function findStrongerFixture(reqLux, distance) {
  const currentIndex = FIXTURE_ORDER.indexOf(state.fixture);
  for (let i=currentIndex+1; i<FIXTURE_ORDER.length; i++) {
    const key = FIXTURE_ORDER[i];
    if (estimatedLuxAtDistance(distance, key, 100) >= reqLux) return key;
  }
  return null;
}

function updateAdvanced(reqLux, maxD, points) {
  const d = state.testDistance;
  const lux = estimatedLuxAtDistance(d);
  const margin = lux > 0 ? Math.log2(lux / reqLux) : -Infinity;
  const reqIso = lux > 0 ? INCIDENT_C * state.aperture * state.aperture / (lux * (1/state.shutterDenom)) : Infinity;
  const possibleF = lux > 0 ? Math.sqrt(lux * state.iso * (1/state.shutterDenom) / INCIDENT_C) : 0;
  const rangeAtTest = classifyDistance(d, points);
  const rangeAtMax = classifyDistance(maxD, points);

  els.testLux.textContent = `${formatLux(lux)} lux`;
  els.stopMargin.textContent = Number.isFinite(margin) ? `${margin >= 0 ? '+' : ''}${margin.toFixed(1).replace('.', ',')} stop${Math.abs(margin)>=1.5?'s':''}` : '—';
  els.requiredIso.textContent = Number.isFinite(reqIso) ? `ISO ${formatIso(reqIso)}` : '—';
  els.possibleAperture.textContent = possibleF > 0 ? `f/${formatAperture(possibleF)}` : '—';
  els.sourceDescriptor.textContent = `${fixtures[state.fixture].label} · ${currentAccessoryLabel()} · ${state.cct} K · à 100 %`;
  els.measurementRow.innerHTML = points.map(([md,mlux]) => `<div class="measure-chip"><span>${md} m</span><strong>${formatLux(mlux)} lux</strong></div>`).join('');

  const confidence = rangeAtTest.warning || rangeAtMax.warning
    ? `Une partie du calcul sort de la plage mesurée par le constructeur (${rangeAtTest.label.toLowerCase()} / distance max : ${rangeAtMax.label.toLowerCase()}).`
    : 'La distance testée et la distance max restent dans la plage de mesures constructeur ; LIGHT interpole entre les points publiés.';
  els.dataNote.textContent = confidence;
  els.dataNote.classList.toggle('warning', rangeAtTest.warning || rangeAtMax.warning);

  if (state.intensityPct === 100) {
    els.dimmerNote.textContent = 'Puissance 100 % : les points de départ sont les mesures laboratoire publiées.';
    els.dimmerNote.classList.remove('warning');
  } else {
    els.dimmerNote.textContent = 'Sous 100 %, LIGHT estime les lux proportionnellement au dimmer. Cette partie est moins fiable faute de courbe constructeur détaillée par pourcentage.';
    els.dimmerNote.classList.add('warning');
  }
}

function classifyDistance(distance, points) {
  if (!Number.isFinite(distance) || distance <= 0) return {label:'source éteinte', warning:true};
  const min = points[0][0], max = points[points.length-1][0];
  if (distance < min) return {label:`extrapolation < ${min} m`, warning:true};
  if (distance > max) return {label:`extrapolation > ${max} m`, warning:true};
  return {label:'interpolation constructeur', warning:false};
}

function formatLux(v) {
  if (!Number.isFinite(v)) return '—';
  if (v >= 100) return Math.round(v).toLocaleString('fr-FR');
  if (v >= 10) return v.toFixed(1).replace('.', ',');
  return v.toFixed(2).replace('.', ',');
}
function formatDistance(v) {
  if (!Number.isFinite(v)) return '—';
  if (v >= 20) return v.toFixed(0).replace('.', ',');
  return v.toFixed(1).replace('.', ',');
}
function formatAperture(v) {
  if (!Number.isFinite(v)) return '—';
  return v.toFixed(1).replace(/\.0$/,'').replace('.', ',');
}
function formatIso(v) {
  if (!Number.isFinite(v)) return '—';
  if (v >= 1000) return Math.round(v/10)*10;
  return Math.max(1,Math.round(v));
}
