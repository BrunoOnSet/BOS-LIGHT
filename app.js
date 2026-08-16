import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_BASE = 'https://threejs.org/examples/models/gltf/LeePerrySmith/';
const MODEL_URL = MODEL_BASE + 'LeePerrySmith.glb';
const COLOR_URL = MODEL_BASE + 'Map-COL.jpg';
const NORMAL_URL = MODEL_BASE + 'Infinite-Level_02_Tangent_SmoothUV.jpg';

// Exposure calibration: standard incident meter relationship
// N² / t = E * ISO / C, with C = 250.
// This is used for the stop readout and for relative camera exposure in the preview.
const INCIDENT_METER_C = 250;
const REFERENCE_CAMERA = { iso: 800, shutter: 1 / 50, aperture: 5.6 };
const REFERENCE_LUX = requiredLuxForCamera(REFERENCE_CAMERA.iso, REFERENCE_CAMERA.shutter, REFERENCE_CAMERA.aperture);
const BASE_LIGHT_INTENSITY = 48;
const BASE_TONE_EXPOSURE = 1.05;

const state = {
  pattern: 'rembrandt',
  fixture: 'halo200x',
  accessory: 'softbox',
  intensityPct: 10,
  sourceDistanceM: 1.2,
  cameraDistanceM: 1.5,
  iso: 800,
  shutter: 1 / 50,
  aperture: 5.6,
  view: 'preview'
};

const patternData = {
  paramount: { label: 'PARAMOUNT', azimuth: 0, elevation: 32 },
  loop: { label: 'LOOP', azimuth: 28, elevation: 26 },
  rembrandt: { label: 'REMBRANDT', azimuth: 48, elevation: 28 },
  split: { label: 'SPLIT', azimuth: 88, elevation: 18 }
};

// Manufacturer lab photometrics at 5600 K.
// 60x / 100x: official measurements at 1 m and 3 m.
// 200x / 300x / 600x: official measurements at 1 m, 3 m and 5 m.
// Accessory labels match the families published by amaran:
// - 60x/100x: Mini Reflector, Light Dome 60
// - 200x/300x/600x: Reflector, Light Dome 90
const fixtures = {
  halo60x: {
    label: 'Halo 60x', softboxLabel: 'Softbox 60', softboxCm: 60,
    photometrics: {
      bare: [[1, 3240], [3, 372]],
      reflector: [[1, 27520], [3, 2777]],
      softbox: [[1, 2255], [3, 169]]
    }
  },
  halo100x: {
    label: 'Halo 100x', softboxLabel: 'Softbox 60', softboxCm: 60,
    photometrics: {
      bare: [[1, 4860], [3, 547]],
      reflector: [[1, 38400], [3, 3700]],
      softbox: [[1, 3290], [3, 248]]
    }
  },
  halo200x: {
    label: 'Halo 200x', softboxLabel: 'Softbox 90', softboxCm: 90,
    photometrics: {
      bare: [[1, 10530], [3, 1187], [5, 503]],
      reflector: [[1, 29980], [3, 2901], [5, 1054]],
      softbox: [[1, 9670], [3, 666], [5, 248]]
    }
  },
  halo300x: {
    label: 'Halo 300x', softboxLabel: 'Softbox 90', softboxCm: 90,
    photometrics: {
      bare: [[1, 16120], [3, 1819], [5, 763]],
      reflector: [[1, 52600], [3, 5000], [5, 1796]],
      softbox: [[1, 15890], [3, 1111], [5, 408]]
    }
  },
  halo600x: {
    label: 'Halo 600x', softboxLabel: 'Softbox 90', softboxCm: 90,
    photometrics: {
      bare: [[1, 32500], [3, 3610], [5, 1494]],
      reflector: [[1, 102100], [3, 9680], [5, 3480]],
      softbox: [[1, 30300], [3, 2087], [5, 782]]
    }
  }
};

const accessoryData = {
  bare: { label: 'Nu', effectiveSourceCm: 8, shadowGain: 7.0, spotHalfAngleDeg: 42.5, penumbra: 0.42 },
  reflector: { label: 'Réflecteur', effectiveSourceCm: 8, shadowGain: 6.0, spotHalfAngleDeg: 28, penumbra: 0.30 },
  softbox: { label: 'Softbox', effectiveSourceCm: null, shadowGain: 10.5, spotHalfAngleDeg: 47, penumbra: 0.70 }
};

const ISO_VALUES = [100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800];
const SHUTTER_DENOMINATORS = [25,30,40,50,60,80,100,125,160,200,250,320,400,500,640,800,1000];
const APERTURE_VALUES = [1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22];

const els = {
  canvas: document.querySelector('#threeCanvas'),
  loading: document.querySelector('#loading'),
  loadError: document.querySelector('#loadError'),
  patternGrid: document.querySelector('#patternGrid'),
  fixtureGrid: document.querySelector('#fixtureGrid'),
  accessoryGrid: document.querySelector('#accessoryGrid'),
  softboxButtonLabel: document.querySelector('#softboxButtonLabel'),
  intensitySlider: document.querySelector('#intensitySlider'),
  distanceSlider: document.querySelector('#distanceSlider'),
  cameraSlider: document.querySelector('#cameraSlider'),
  intensityValue: document.querySelector('#intensityValue'),
  distanceValue: document.querySelector('#distanceValue'),
  cameraValue: document.querySelector('#cameraValue'),
  isoSelect: document.querySelector('#isoSelect'),
  shutterSelect: document.querySelector('#shutterSelect'),
  apertureSelect: document.querySelector('#apertureSelect'),
  luxValue: document.querySelector('#luxValue'),
  exposureDelta: document.querySelector('#exposureDelta'),
  hudPattern: document.querySelector('#hudPattern'),
  hudStats: document.querySelector('#hudStats'),
  setupReadout: document.querySelector('#setupReadout'),
  lightNode: document.querySelector('#lightNode'),
  lightNodeLabel: document.querySelector('#lightNodeLabel'),
  lightPanel: document.querySelector('#lightPanel'),
  lightRay: document.querySelector('#lightRay'),
  cameraNode: document.querySelector('#cameraNode'),
  resetBtn: document.querySelector('#resetBtn')
};

let renderer, scene, camera, keyLight, keyTarget, head, panelMesh;
let faceCenter = new THREE.Vector3(0, 0.1, 0);

populateCameraControls();
initThree();
bindUI();
updateAll();

async function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: els.canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = BASE_TONE_EXPOSURE;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020305);

  camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);
  scene.add(camera);

  // Faint room ambience only. It stays constant so the key remains the dominant exposure source.
  const ambient = new THREE.HemisphereLight(0x51647a, 0x08090b, 0.055);
  scene.add(ambient);

  keyTarget = new THREE.Object3D();
  keyTarget.position.copy(faceCenter);
  scene.add(keyTarget);

  keyLight = new THREE.SpotLight(0xffffff, BASE_LIGHT_INTENSITY, 0, THREE.MathUtils.degToRad(47), 0.62, 2);
  keyLight.castShadow = true;
  keyLight.target = keyTarget;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 35;
  keyLight.shadow.bias = -0.00018;
  keyLight.shadow.normalBias = 0.018;
  scene.add(keyLight);

  const panelGeo = new THREE.PlaneGeometry(1, 1);
  const panelMat = new THREE.MeshBasicMaterial({ color: 0xcbeaff, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
  panelMesh = new THREE.Mesh(panelGeo, panelMat);
  scene.add(panelMesh);

  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  try {
    const [gltf, colorMap, normalMap] = await Promise.all([
      loader.loadAsync(MODEL_URL),
      textureLoader.loadAsync(COLOR_URL),
      textureLoader.loadAsync(NORMAL_URL)
    ]);

    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const original = gltf.scene.children.find(o => o.isMesh) || gltf.scene.children[0];
    head = new THREE.Mesh(original.geometry, new THREE.MeshPhysicalMaterial({
      map: colorMap,
      normalMap,
      normalScale: new THREE.Vector2(0.72, 0.72),
      roughness: 0.48,
      metalness: 0,
      clearcoat: 0.03,
      clearcoatRoughness: 0.75,
      sheen: 0.08,
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color(0x7d2c20)
    }));

    head.castShadow = true;
    head.receiveShadow = true;

    head.geometry.computeBoundingBox();
    const box = head.geometry.boundingBox.clone();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const targetHeight = 3.4;
    const scale = targetHeight / size.y;
    head.scale.setScalar(scale);
    head.position.set(-center.x * scale, -center.y * scale - 0.05, -center.z * scale);
    scene.add(head);

    faceCenter.set(0, 0.15, 0.12);
    keyTarget.position.copy(faceCenter);
    els.loading.classList.add('hidden');
    updateThree();
  } catch (err) {
    console.error(err);
    els.loading.classList.add('hidden');
    els.loadError.classList.remove('hidden');
  }

  window.addEventListener('resize', resizeRenderer);
  const observer = new ResizeObserver(resizeRenderer);
  observer.observe(els.canvas.parentElement);
  resizeRenderer();
  renderer.setAnimationLoop(render);
}

function resizeRenderer() {
  if (!renderer || !camera) return;
  const rect = els.canvas.parentElement.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function updateThree() {
  if (!renderer || !camera || !keyLight) return;

  const camZ = mapRange(state.cameraDistanceM, 0.8, 3, 4.25, 8.9);
  camera.position.set(0, 0.08, camZ);
  camera.lookAt(faceCenter);

  const p = patternData[state.pattern];
  const az = THREE.MathUtils.degToRad(p.azimuth);
  const el = THREE.MathUtils.degToRad(p.elevation);
  const d = sourceWorldDistance(state.sourceDistanceM);

  const lightDirection = new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    Math.cos(az) * Math.cos(el)
  ).normalize();

  keyLight.position.copy(faceCenter).addScaledVector(lightDirection, d);
  keyTarget.position.copy(faceCenter);

  const fixture = fixtures[state.fixture];
  const accessory = accessoryData[state.accessory];
  const effectiveSourceCm = state.accessory === 'softbox' ? fixture.softboxCm : accessory.effectiveSourceCm;
  const apparentSize = (effectiveSourceCm / 100) / state.sourceDistanceM;

  // Visual proxy for source softness. Softbox size and distance both alter apparent source size.
  // Bare and reflector remain intentionally hard.
  keyLight.shadow.radius = THREE.MathUtils.clamp(apparentSize * accessory.shadowGain, state.accessory === 'softbox' ? 1.1 : 0.45, state.accessory === 'softbox' ? 16 : 2.4);
  keyLight.angle = THREE.MathUtils.degToRad(accessory.spotHalfAngleDeg);
  keyLight.penumbra = accessory.penumbra;

  const currentLux = getCurrentLux();
  const referenceWorldDistance = sourceWorldDistance(1.2);

  // We first compute target illuminance from manufacturer data, then compensate the renderer's
  // own inverse-square falloff so that illuminance at the face follows that target value.
  // Relative brightness therefore tracks lux while placement distance remains geometrically correct.
  keyLight.intensity = BASE_LIGHT_INTENSITY
    * (currentLux / REFERENCE_LUX)
    * Math.pow(d / referenceWorldDistance, 2);

  // Camera settings are applied as a relative exposure multiplier.
  renderer.toneMappingExposure = BASE_TONE_EXPOSURE * cameraExposureFactor();

  // Keep a hidden world panel for potential future reflections / visualization.
  const panelSizeM = state.accessory === 'softbox' ? fixture.softboxCm / 100 : 0.12;
  const panelWorldSize = THREE.MathUtils.clamp(panelSizeM * 0.8, 0.12, 1.2);
  panelMesh.scale.set(panelWorldSize, panelWorldSize * 0.75, 1);
  panelMesh.position.copy(keyLight.position);
  panelMesh.lookAt(faceCenter);
  panelMesh.visible = false;
}

function render() {
  if (!renderer || !scene || !camera) return;
  renderer.render(scene, camera);
}

function bindUI() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelector('#previewView').classList.toggle('active', state.view === 'preview');
      document.querySelector('#setupView').classList.toggle('active', state.view === 'setup');
      if (state.view === 'preview') resizeRenderer();
    });
  });

  els.patternGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pattern = btn.dataset.pattern;
      syncActiveButtons();
      updateAll();
    });
  });

  els.fixtureGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.fixture = btn.dataset.fixture;
      syncActiveButtons();
      updateAll();
    });
  });

  els.accessoryGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.accessory = btn.dataset.accessory;
      syncActiveButtons();
      updateAll();
    });
  });

  els.intensitySlider.addEventListener('input', () => { state.intensityPct = +els.intensitySlider.value; updateAll(); });
  els.distanceSlider.addEventListener('input', () => { state.sourceDistanceM = +els.distanceSlider.value; updateAll(); });
  els.cameraSlider.addEventListener('input', () => { state.cameraDistanceM = +els.cameraSlider.value; updateAll(); });

  els.isoSelect.addEventListener('change', () => { state.iso = +els.isoSelect.value; updateAll(); });
  els.shutterSelect.addEventListener('change', () => { state.shutter = 1 / (+els.shutterSelect.value); updateAll(); });
  els.apertureSelect.addEventListener('change', () => { state.aperture = +els.apertureSelect.value; updateAll(); });

  els.resetBtn.addEventListener('click', () => {
    Object.assign(state, {
      pattern: 'rembrandt', fixture: 'halo200x', accessory: 'softbox', intensityPct: 10,
      sourceDistanceM: 1.2, cameraDistanceM: 1.5, iso: 800, shutter: 1 / 50, aperture: 5.6
    });
    syncControlsFromState();
    updateAll();
  });
}

function populateCameraControls() {
  els.isoSelect.innerHTML = ISO_VALUES.map(v => `<option value="${v}">${v}</option>`).join('');
  els.shutterSelect.innerHTML = SHUTTER_DENOMINATORS.map(v => `<option value="${v}">1/${v}</option>`).join('');
  els.apertureSelect.innerHTML = APERTURE_VALUES.map(v => `<option value="${v}">f/${formatAperture(v)}</option>`).join('');
  syncControlsFromState();
}

function syncControlsFromState() {
  els.intensitySlider.value = state.intensityPct;
  els.distanceSlider.value = state.sourceDistanceM;
  els.cameraSlider.value = state.cameraDistanceM;
  els.isoSelect.value = String(state.iso);
  els.shutterSelect.value = String(Math.round(1 / state.shutter));
  els.apertureSelect.value = String(state.aperture);
  syncActiveButtons();
}

function syncActiveButtons() {
  els.patternGrid.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.pattern === state.pattern));
  els.fixtureGrid.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.fixture === state.fixture));
  els.accessoryGrid.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.accessory === state.accessory));
}

function updateAll() {
  updateReadouts();
  updateSetup();
  updateThree();
}

function updateReadouts() {
  const p = patternData[state.pattern];
  const fixture = fixtures[state.fixture];
  const accessoryLabel = state.accessory === 'softbox' ? fixture.softboxLabel : accessoryData[state.accessory].label;
  const currentLux = getCurrentLux();
  const deltaStops = exposureDeltaStops(currentLux);

  els.softboxButtonLabel.textContent = fixture.softboxLabel.toUpperCase();
  els.intensityValue.value = `${Math.round(state.intensityPct)} %`;
  els.distanceValue.value = `${state.sourceDistanceM.toFixed(1)} m`;
  els.cameraValue.value = `${state.cameraDistanceM.toFixed(1)} m`;
  els.luxValue.textContent = `${formatLux(currentLux)} lux`;
  els.exposureDelta.textContent = formatStops(deltaStops);

  els.hudPattern.textContent = p.label;
  els.hudStats.textContent = `${fixture.label} · ${accessoryLabel} · ${Math.round(state.intensityPct)} % · ${formatLux(currentLux)} lx`;
  els.setupReadout.textContent = `${p.label} · ${fixture.label} · ${accessoryLabel} · ${state.sourceDistanceM.toFixed(1)} m`;
  els.lightNodeLabel.textContent = `${fixture.label.toUpperCase()} · ${accessoryLabel.toUpperCase()}`;
}

function updateSetup() {
  const p = patternData[state.pattern];
  const az = THREE.MathUtils.degToRad(p.azimuth);

  const centerX = 50;
  const centerY = 47;
  const radius = mapRange(state.sourceDistanceM, 0.5, 4, 19, 42);

  const lightX = centerX - Math.sin(az) * radius;
  const lightY = centerY - Math.cos(az) * radius;
  els.lightNode.style.left = `${lightX}%`;
  els.lightNode.style.top = `${lightY}%`;

  const fixture = fixtures[state.fixture];
  let panelW;
  if (state.accessory === 'softbox') panelW = mapRange(fixture.softboxCm, 60, 90, 72, 96);
  else panelW = state.accessory === 'reflector' ? 42 : 30;
  els.lightPanel.style.width = `${panelW}px`;
  els.lightPanel.style.height = `${state.accessory === 'softbox' ? Math.max(18, panelW * 0.28) : Math.max(13, panelW * 0.36)}px`;
  els.lightPanel.classList.toggle('hard-source', state.accessory !== 'softbox');

  const dx = lightX - centerX;
  const dy = lightY - centerY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  const stage = document.querySelector('#setupStage').getBoundingClientRect();
  const pxDx = dx / 100 * stage.width;
  const pxDy = dy / 100 * stage.height;
  const len = Math.hypot(pxDx, pxDy);
  els.lightRay.style.height = `${len}px`;
  els.lightRay.style.transform = `translateX(-50%) rotate(${angle}deg)`;

  const cameraY = mapRange(state.cameraDistanceM, 0.8, 3, 75, 91);
  els.cameraNode.style.top = `${cameraY}%`;
}

function getCurrentLux() {
  if (state.intensityPct <= 0) return 0;
  const table = fixtures[state.fixture].photometrics[state.accessory];
  const luxAt100 = interpolatePhotometricLux(table, state.sourceDistanceM);
  return luxAt100 * (state.intensityPct / 100);
}

function interpolatePhotometricLux(points, distanceM) {
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // Outside published distances: inverse-square extrapolation from the nearest measured point.
  if (distanceM <= first[0]) return first[1] * Math.pow(first[0] / distanceM, 2);
  if (distanceM >= last[0]) return last[1] * Math.pow(last[0] / distanceM, 2);

  // Between measured points: interpolate in log(distance)/log(lux) space.
  // This preserves a physically plausible power-law curve while passing exactly through lab values.
  for (let i = 0; i < sorted.length - 1; i++) {
    const [d1, e1] = sorted[i];
    const [d2, e2] = sorted[i + 1];
    if (distanceM >= d1 && distanceM <= d2) {
      const x = (Math.log(distanceM) - Math.log(d1)) / (Math.log(d2) - Math.log(d1));
      return Math.exp(Math.log(e1) + x * (Math.log(e2) - Math.log(e1)));
    }
  }
  return last[1];
}

function cameraExposureFactor() {
  return (state.iso / REFERENCE_CAMERA.iso)
    * (state.shutter / REFERENCE_CAMERA.shutter)
    * Math.pow(REFERENCE_CAMERA.aperture / state.aperture, 2);
}

function requiredLuxForCamera(iso, shutterSeconds, aperture) {
  return INCIDENT_METER_C * aperture * aperture / (shutterSeconds * iso);
}

function exposureDeltaStops(currentLux) {
  if (currentLux <= 0) return -Infinity;
  const required = requiredLuxForCamera(state.iso, state.shutter, state.aperture);
  return Math.log2(currentLux / required);
}

function sourceWorldDistance(distanceM) {
  return mapRange(distanceM, 0.5, 4, 2.35, 8.9);
}

function formatLux(v) {
  if (!Number.isFinite(v) || v <= 0) return '0';
  if (v >= 10000) return (Math.round(v / 100) * 100).toLocaleString('fr-FR');
  if (v >= 1000) return (Math.round(v / 10) * 10).toLocaleString('fr-FR');
  return Math.round(v).toLocaleString('fr-FR');
}

function formatStops(v) {
  if (v === -Infinity) return '−∞ stop';
  const rounded = Math.round(v * 10) / 10;
  if (Math.abs(rounded) < 0.05) return '0.0 stop';
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded).toFixed(1)} stop${Math.abs(rounded) >= 1.5 ? 's' : ''}`;
}

function formatAperture(v) {
  return Number.isInteger(v) ? String(v) : String(v);
}

function mapRange(v, a, b, c, d) {
  const t = (v - a) / (b - a);
  return c + (d - c) * t;
}
