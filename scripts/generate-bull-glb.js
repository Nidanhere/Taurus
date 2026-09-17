class FileReaderPolyfill {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onloadend = null;
    this.onerror = null;
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }).catch(err => {
      if (this.onerror) this.onerror(err);
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.resolve(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Build Charging Bull Mesh Hierarchy
const bullGroup = new THREE.Group();
bullGroup.name = "ChargingBull";

// Premium Dark Titanium / Brushed Obsidian / Bronze Patina
const bullMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0x1e232b),
  metalness: 0.86,
  roughness: 0.24,
  flatShading: false,
});

const hornMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0x0a0c10),
  metalness: 0.95,
  roughness: 0.12,
});

function createChargingBull() {
  const root = new THREE.Group();

  // Torso / Ribcage
  const torsoGeo = new THREE.SphereGeometry(1.2, 32, 24);
  torsoGeo.scale(1.15, 1.35, 1.85);
  const torso = new THREE.Mesh(torsoGeo, bullMaterial);
  torso.position.set(0, 1.25, 0.1);
  torso.rotation.x = 0.16;
  torso.castShadow = true;
  root.add(torso);

  // Muscular Shoulder Hump
  const humpGeo = new THREE.SphereGeometry(1.1, 32, 24);
  humpGeo.scale(1.28, 1.2, 1.35);
  const hump = new THREE.Mesh(humpGeo, bullMaterial);
  hump.position.set(0, 1.9, 0.85);
  hump.rotation.x = -0.12;
  hump.castShadow = true;
  root.add(hump);

  // Hindquarters
  const hindGeo = new THREE.SphereGeometry(1.12, 32, 24);
  hindGeo.scale(1.05, 1.22, 1.45);
  const hind = new THREE.Mesh(hindGeo, bullMaterial);
  hind.position.set(0, 1.35, -1.1);
  hind.castShadow = true;
  root.add(hind);

  // Massive Neck (Low, aggressive forward angle)
  const neckGeo = new THREE.CylinderGeometry(0.8, 1.15, 1.45, 28);
  neckGeo.scale(1.0, 1.05, 1.3);
  const neck = new THREE.Mesh(neckGeo, bullMaterial);
  neck.position.set(0, 1.35, 1.8);
  neck.rotation.x = 0.82;
  neck.castShadow = true;
  root.add(neck);

  // Head (Low, charging)
  const headGeo = new THREE.ConeGeometry(0.78, 1.55, 24);
  headGeo.scale(1.15, 0.9, 1.25);
  const head = new THREE.Mesh(headGeo, bullMaterial);
  head.position.set(0, 0.82, 2.58);
  head.rotation.x = 2.12;
  head.castShadow = true;
  root.add(head);

  // Brow & Forehead
  const browGeo = new THREE.BoxGeometry(1.15, 0.45, 0.85);
  const brow = new THREE.Mesh(browGeo, bullMaterial);
  brow.position.set(0, 1.02, 2.3);
  brow.rotation.x = 0.55;
  brow.castShadow = true;
  root.add(brow);

  // Muzzle & Flared Nostrils
  const muzzleGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.65, 20);
  muzzleGeo.scale(1.22, 0.92, 1.0);
  const muzzle = new THREE.Mesh(muzzleGeo, bullMaterial);
  muzzle.position.set(0, 0.45, 3.12);
  muzzle.rotation.x = 0.6;
  muzzle.castShadow = true;
  root.add(muzzle);

  // Sweeping Horns
  function createHorn(side) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.48, 0.28, 0.28),
      new THREE.Vector3(side * 0.98, 0.68, 0.48),
      new THREE.Vector3(side * 1.15, 1.18, 0.38),
      new THREE.Vector3(side * 0.95, 1.55, -0.05),
      new THREE.Vector3(side * 0.78, 1.72, -0.28)
    ]);
    const hornGeo = new THREE.TubeGeometry(curve, 36, 0.15, 16, false);
    const pos = hornGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = Math.floor(i / 17) / 36;
      const factor = Math.max(0.08, 1 - (u * 0.88));
      pos.setX(i, pos.getX(i) * factor);
      pos.setY(i, pos.getY(i) * factor);
    }
    hornGeo.computeVertexNormals();

    const horn = new THREE.Mesh(hornGeo, hornMaterial);
    horn.position.set(side * 0.44, 1.08, 2.22);
    horn.rotation.x = -0.32;
    horn.rotation.y = side * 0.16;
    horn.castShadow = true;
    return horn;
  }
  root.add(createHorn(-1));
  root.add(createHorn(1));

  // Ears
  function createEar(side) {
    const earGeo = new THREE.ConeGeometry(0.18, 0.58, 12);
    earGeo.scale(1.4, 0.4, 1.0);
    const ear = new THREE.Mesh(earGeo, bullMaterial);
    ear.position.set(side * 0.68, 0.96, 2.05);
    ear.rotation.z = -side * 1.12;
    ear.rotation.y = side * 0.4;
    ear.rotation.x = -0.2;
    ear.castShadow = true;
    return ear;
  }
  root.add(createEar(-1));
  root.add(createEar(1));

  // Front Left Leg (forward power step)
  root.add(createLegGroup(0.88, 1.25, -0.68, 1.1, 0.7, 0.22, 0.14));
  // Front Right Leg (braced back)
  root.add(createLegGroup(0.88, 1.25, 0.68, 1.1, 0.45, -0.36, -0.1));
  // Rear Left Leg (driving torque)
  root.add(createLegGroup(0.98, 1.4, -0.72, 1.15, -0.92, -0.26, 0.1));
  // Rear Right Leg (thrusting back)
  root.add(createLegGroup(0.98, 1.4, 0.72, 1.15, -1.3, 0.38, -0.15));

  // Whipping Tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.48, -1.82),
    new THREE.Vector3(0.12, 1.85, -2.15),
    new THREE.Vector3(-0.16, 2.15, -2.35),
    new THREE.Vector3(-0.38, 2.35, -2.18),
    new THREE.Vector3(-0.28, 2.52, -1.96)
  ]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 28, 0.07, 12, false);
  const tail = new THREE.Mesh(tailGeo, bullMaterial);
  tail.castShadow = true;
  root.add(tail);

  const tuftGeo = new THREE.ConeGeometry(0.15, 0.42, 12);
  const tuft = new THREE.Mesh(tuftGeo, hornMaterial);
  tuft.position.set(-0.28, 2.52, -1.96);
  tuft.rotation.x = -1.2;
  tuft.rotation.z = 0.5;
  tuft.castShadow = true;
  root.add(tuft);

  return root;
}

function createLegGroup(thighScale, legLength, x, y, z, rotX, rotZ) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.x = rotX;
  group.rotation.z = rotZ;

  const upperGeo = new THREE.SphereGeometry(0.54 * thighScale, 20, 16);
  upperGeo.scale(0.85, 1.4, 1.1);
  const upper = new THREE.Mesh(upperGeo, bullMaterial);
  upper.castShadow = true;
  group.add(upper);

  const lowerGeo = new THREE.CylinderGeometry(0.23, 0.17, legLength * 0.7, 16);
  const lower = new THREE.Mesh(lowerGeo, bullMaterial);
  lower.position.set(0, -legLength * 0.45, 0);
  lower.castShadow = true;
  group.add(lower);

  const hoofGeo = new THREE.CylinderGeometry(0.16, 0.25, 0.29, 16);
  const hoof = new THREE.Mesh(hoofGeo, hornMaterial);
  hoof.position.set(0, -legLength * 0.82, 0.05);
  hoof.castShadow = true;
  group.add(hoof);

  return group;
}

const chargingBull = createChargingBull();
bullGroup.add(chargingBull);

const box = new THREE.Box3().setFromObject(bullGroup);
const center = box.getCenter(new THREE.Vector3());
chargingBull.position.sub(center);
chargingBull.position.y += (box.max.y - box.min.y) * 0.5;

const exporter = new GLTFExporter();
try {
  const gltf = await exporter.parseAsync(bullGroup, { binary: true });
  const outputPath = path.resolve(modelsDir, 'charging-bull.glb');
  fs.writeFileSync(outputPath, Buffer.from(gltf));
  console.log(`Successfully generated charging-bull.glb at: ${outputPath} (${(gltf.byteLength / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Error generating GLB:', err);
}
