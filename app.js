import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_BASE = 'https://threejs.org/examples/models/gltf/LeePerrySmith/';
const MODEL_URL = MODEL_BASE + 'LeePerrySmith.glb';
const COLOR_URL = MODEL_BASE + 'Map-COL.jpg';
const NORMAL_URL = MODEL_BASE + 'Infinite-Level_02_Tangent_SmoothUV.jpg';

const state = {
  pattern: 'rembrandt',
  sourceSizeCm: 120,
  sourceDistanceM: 1.2,
  cameraDistanceM: 1.5,
  exposure: 'auto',
  view: 'preview'
};

const patternData = {
  paramount: { label: 'PARAMOUNT', azimuth: 0, elevation: 32 },
  loop: { label: 'LOOP', azimuth: 28, elevation: 26 },
  rembrandt: { label: 'REMBRANDT', azimuth: 48, elevation: 28 },
  split: { label: 'SPLIT', azimuth: 88, elevation: 18 }
};

const els = {
  canvas: document.querySelector('#threeCanvas'),
  loading: document.querySelector('#loading'),
  loadError: document.querySelector('#loadError'),
  patternGrid: document.querySelector('#patternGrid'),
  sizeSlider: document.querySelector('#sizeSlider'),
  distanceSlider: document.querySelector('#distanceSlider'),
  cameraSlider: document.querySelector('#cameraSlider'),
  sizeValue: document.querySelector('#sizeValue'),
  distanceValue: document.querySelector('#distanceValue'),
  cameraValue: document.querySelector('#cameraValue'),
  exposureToggle: document.querySelector('#exposureToggle'),
  hudPattern: document.querySelector('#hudPattern'),
  hudStats: document.querySelector('#hudStats'),
  setupReadout: document.querySelector('#setupReadout'),
  lightNode: document.querySelector('#lightNode'),
  lightPanel: document.querySelector('#lightPanel'),
  lightRay: document.querySelector('#lightRay'),
  cameraNode: document.querySelector('#cameraNode'),
  resetBtn: document.querySelector('#resetBtn')
};

let renderer, scene, camera, keyLight, keyTarget, head, panelMesh;
let headReady = false;
let faceCenter = new THREE.Vector3(0, 0.1, 0);

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
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020305);

  camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);
  scene.add(camera);

  // Very faint room floor / bounce reference.
  const ambient = new THREE.HemisphereLight(0x51647a, 0x08090b, 0.085);
  scene.add(ambient);

  keyTarget = new THREE.Object3D();
  keyTarget.position.copy(faceCenter);
  scene.add(keyTarget);

  keyLight = new THREE.SpotLight(0xffffff, 48, 0, THREE.MathUtils.degToRad(52), 0.62, 2);
  keyLight.castShadow = true;
  keyLight.target = keyTarget;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 30;
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

    // Normalize model to a consistent face height.
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
    headReady = true;
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

  // Camera: same focal length, physical distance represented by a practical virtual scale.
  const camZ = mapRange(state.cameraDistanceM, 0.8, 3, 4.25, 8.9);
  camera.position.set(0, 0.08, camZ);
  camera.lookAt(faceCenter);

  // Light placement is expressed as a fixed direction (azimuth + elevation) from the face.
  // Changing distance ONLY moves the source along that ray, so Paramount stays Paramount,
  // Loop stays Loop, etc. Camera looks from +Z toward the face.
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

  // Soft-shadow proxy for apparent source size. This is intentionally calibrated for visual teaching,
  // not a path-traced area-light solution.
  const apparentSize = (state.sourceSizeCm / 100) / state.sourceDistanceM;
  keyLight.shadow.radius = THREE.MathUtils.clamp(apparentSize * 8.5, 0.7, 16);

  // AUTO is now a PARTIAL compensation based on the real virtual distance used by the renderer.
  // With a decay of 2, exponent 2 would fully cancel inverse-square falloff. 1.6 deliberately
  // leaves a gentle falloff: at long distance the face remains readable, but gets slightly darker.
  const baseIntensity = 48;
  const referenceDistance = sourceWorldDistance(1.2);
  const autoCompensationExponent = 1.6;
  keyLight.intensity = state.exposure === 'auto'
    ? baseIntensity * Math.pow(d / referenceDistance, autoCompensationExponent)
    : baseIntensity;

  // Make the virtual panel visible only as a faint spatial reference reflected nowhere.
  const panelWorldSize = THREE.MathUtils.clamp(state.sourceSizeCm / 100 * 0.8, 0.18, 1.7);
  panelMesh.scale.set(panelWorldSize, panelWorldSize * 0.72, 1);
  panelMesh.position.copy(keyLight.position);
  panelMesh.lookAt(faceCenter);
  panelMesh.visible = false; // Preview stays clean; Setup conveys the fixture location.
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
      els.patternGrid.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
      updateAll();
    });
  });

  els.sizeSlider.addEventListener('input', () => { state.sourceSizeCm = +els.sizeSlider.value; updateAll(); });
  els.distanceSlider.addEventListener('input', () => { state.sourceDistanceM = +els.distanceSlider.value; updateAll(); });
  els.cameraSlider.addEventListener('input', () => { state.cameraDistanceM = +els.cameraSlider.value; updateAll(); });

  els.exposureToggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.exposure = btn.dataset.exposure;
      els.exposureToggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
      updateAll();
    });
  });

  els.resetBtn.addEventListener('click', () => {
    Object.assign(state, { pattern: 'rembrandt', sourceSizeCm: 120, sourceDistanceM: 1.2, cameraDistanceM: 1.5, exposure: 'auto' });
    els.sizeSlider.value = state.sourceSizeCm;
    els.distanceSlider.value = state.sourceDistanceM;
    els.cameraSlider.value = state.cameraDistanceM;
    els.patternGrid.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.pattern === state.pattern));
    els.exposureToggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.exposure === state.exposure));
    updateAll();
  });
}

function updateAll() {
  updateReadouts();
  updateSetup();
  updateThree();
}

function updateReadouts() {
  const p = patternData[state.pattern];
  els.sizeValue.value = `${state.sourceSizeCm} cm`;
  els.distanceValue.value = `${state.sourceDistanceM.toFixed(1)} m`;
  els.cameraValue.value = `${state.cameraDistanceM.toFixed(1)} m`;
  els.hudPattern.textContent = p.label;
  els.hudStats.textContent = `${state.sourceSizeCm} cm · ${state.sourceDistanceM.toFixed(1)} m · ${state.exposure === 'auto' ? 'AUTO' : 'PHYSIQUE'}`;
  els.setupReadout.textContent = `${p.label} · ${state.sourceSizeCm} cm · ${state.sourceDistanceM.toFixed(1)} m`;
}

function updateSetup() {
  const p = patternData[state.pattern];
  const az = THREE.MathUtils.degToRad(p.azimuth);

  const centerX = 50;
  const centerY = 47;
  const radius = mapRange(state.sourceDistanceM, 0.5, 4, 19, 42);

  // Top view: 0° is in front of subject, 90° is camera-right / subject-left.
  const lightX = centerX - Math.sin(az) * radius;
  const lightY = centerY - Math.cos(az) * radius;
  els.lightNode.style.left = `${lightX}%`;
  els.lightNode.style.top = `${lightY}%`;

  const panelW = mapRange(state.sourceSizeCm, 20, 200, 28, 96);
  els.lightPanel.style.width = `${panelW}px`;
  els.lightPanel.style.height = `${Math.max(12, panelW * 0.27)}px`;

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

function sourceWorldDistance(distanceM) {
  return mapRange(distanceM, 0.5, 4, 2.35, 8.9);
}

function mapRange(v, a, b, c, d) {
  const t = (v - a) / (b - a);
  return c + (d - c) * t;
}
