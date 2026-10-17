import * as THREE from 'three';

/**
 * Check if WebGL is supported by the client browser
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Shared pastel nursery color palette
 */
export const PASTEL_COLORS = {
  teddyFur: 0xf4ba8d,
  teddyFurShadow: 0xe09b68,
  teddySnout: 0xfff2e2,
  teddyInnerEar: 0xffc9d9,
  teddyNose: 0x8b3a62,
  teddyEyes: 0x3b1b3c,
  teddyCheek: 0xff8ca3,
  bowPink: 0xff70b8,
  starGold: 0xffe66d,
  starGoldEmissive: 0xffd166,
  cloudWhite: 0xffffff,
  cloudFluff: 0xfff5f8,
  babyBlue: 0x83d9ff,
  lavender: 0xb99aff,
  strawberryRed: 0xff4d6d,
  strawberryStem: 0xa5f3c1,
  woodCream: 0xffedd5,
  darkOutline: 0x3b1b3c,
};

/**
 * Procedural 3D Teddy Bear Builder
 * Assembles a composite 3D character group resembling Ted:
 * Rounded ears, soft plush body, snout, eyes, nose, cheeks, and bow!
 */
export function createTedMesh(): {
  group: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  bow: THREE.Group;
  setExpression: (expr: 'happy' | 'sleepy' | 'sparkle' | 'curious' | 'giggle') => void;
} {
  const group = new THREE.Group();
  group.name = 'Ted';

  // Teddy Material (Soft velvet/plush feel)
  const furMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddyFur,
    roughness: 0.75,
    metalness: 0.05,
  });

  const snoutMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddySnout,
    roughness: 0.6,
    metalness: 0.05,
  });

  const innerEarMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddyInnerEar,
    roughness: 0.7,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddyEyes,
    roughness: 0.3,
  });

  const noseMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddyNose,
    roughness: 0.4,
  });

  const cheekMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.teddyCheek,
    roughness: 0.9,
    transparent: true,
    opacity: 0.85,
  });

  const bowMaterial = new THREE.MeshStandardMaterial({
    color: PASTEL_COLORS.bowPink,
    roughness: 0.4,
    metalness: 0.1,
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
  });

  // --- 1. TORSO / BODY ---
  const bodyGeo = new THREE.SphereGeometry(1.25, 32, 24);
  bodyGeo.scale(1, 1.15, 0.9);
  const body = new THREE.Mesh(bodyGeo, furMaterial);
  body.position.y = 1.35;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Creamy Tummy Patch
  const tummyGeo = new THREE.SphereGeometry(0.75, 24, 16);
  tummyGeo.scale(0.95, 1.1, 0.35);
  const tummy = new THREE.Mesh(tummyGeo, snoutMaterial);
  tummy.position.set(0, 1.3, 0.92);
  group.add(tummy);

  // Tiny heart-shaped belly button / button
  const buttonGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
  buttonGeo.rotateX(Math.PI / 2);
  const button = new THREE.Mesh(buttonGeo, bowMaterial);
  button.position.set(0, 1.3, 1.15);
  group.add(button);

  // --- 2. LEGS / FEET ---
  const footGeo = new THREE.SphereGeometry(0.55, 20, 16);
  footGeo.scale(0.85, 0.65, 1.1);

  const leftFoot = new THREE.Mesh(footGeo, furMaterial);
  leftFoot.position.set(-0.75, 0.4, 0.35);
  leftFoot.rotation.x = -0.15;
  leftFoot.rotation.y = 0.2;
  leftFoot.castShadow = true;
  group.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, furMaterial);
  rightFoot.position.set(0.75, 0.4, 0.35);
  rightFoot.rotation.x = -0.15;
  rightFoot.rotation.y = -0.2;
  rightFoot.castShadow = true;
  group.add(rightFoot);

  // Paw pads on feet
  const padGeo = new THREE.SphereGeometry(0.25, 16, 12);
  padGeo.scale(1, 0.8, 0.2);
  const leftPad = new THREE.Mesh(padGeo, innerEarMaterial);
  leftPad.position.set(-0.75, 0.38, 0.75);
  leftPad.rotation.x = -Math.PI / 4;
  group.add(leftPad);

  const rightPad = new THREE.Mesh(padGeo, innerEarMaterial);
  rightPad.position.set(0.75, 0.38, 0.75);
  rightPad.rotation.x = -Math.PI / 4;
  group.add(rightPad);

  // --- 3. ARMS ---
  const armGeo = new THREE.SphereGeometry(0.48, 20, 16);
  armGeo.scale(0.65, 1.25, 0.7);

  const leftArm = new THREE.Mesh(armGeo, furMaterial);
  leftArm.position.set(-1.25, 1.6, 0.15);
  leftArm.rotation.z = 0.35;
  leftArm.rotation.x = 0.2;
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, furMaterial);
  rightArm.position.set(1.25, 1.6, 0.15);
  rightArm.rotation.z = -0.35;
  rightArm.rotation.x = 0.2;
  rightArm.castShadow = true;
  group.add(rightArm);

  // --- 4. HEAD GROUP (Can tilt / nod) ---
  const head = new THREE.Group();
  head.position.y = 2.75;
  group.add(head);

  // Main Head
  const headGeo = new THREE.SphereGeometry(1.2, 32, 24);
  headGeo.scale(1.1, 1.0, 0.95);
  const headMesh = new THREE.Mesh(headGeo, furMaterial);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Snout
  const snoutGeo = new THREE.SphereGeometry(0.5, 24, 16);
  snoutGeo.scale(1.15, 0.85, 0.8);
  const snout = new THREE.Mesh(snoutGeo, snoutMaterial);
  snout.position.set(0, -0.15, 0.95);
  head.add(snout);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.18, 16, 12);
  noseGeo.scale(1.2, 0.8, 0.9);
  const nose = new THREE.Mesh(noseGeo, noseMaterial);
  nose.position.set(0, 0.05, 1.35);
  head.add(nose);

  // Smile Line
  const smileCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.15, -0.18, 1.28),
    new THREE.Vector3(0, -0.28, 1.32),
    new THREE.Vector3(0.15, -0.18, 1.28)
  );
  const smileGeo = new THREE.TubeGeometry(smileCurve, 12, 0.025, 8, false);
  const smile = new THREE.Mesh(smileGeo, darkMaterial);
  head.add(smile);

  // Eyes (Embroidered bead style with white specular highlight)
  const eyeGeo = new THREE.SphereGeometry(0.14, 16, 14);
  const leftEye = new THREE.Mesh(eyeGeo, darkMaterial);
  leftEye.position.set(-0.42, 0.15, 0.95);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, darkMaterial);
  rightEye.position.set(0.42, 0.15, 0.95);
  head.add(rightEye);

  const eyeCatchGeo = new THREE.SphereGeometry(0.045, 12, 10);
  const leftCatch = new THREE.Mesh(eyeCatchGeo, whiteMaterial);
  leftCatch.position.set(-0.38, 0.2, 1.05);
  head.add(leftCatch);

  const rightCatch = new THREE.Mesh(eyeCatchGeo, whiteMaterial);
  rightCatch.position.set(0.46, 0.2, 1.05);
  head.add(rightCatch);

  // Rosy Cheeks
  const cheekGeo = new THREE.SphereGeometry(0.24, 16, 12);
  cheekGeo.scale(1.2, 0.6, 0.3);
  const leftCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
  leftCheek.position.set(-0.68, -0.1, 0.85);
  leftCheek.rotation.y = -0.3;
  head.add(leftCheek);

  const rightCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
  rightCheek.position.set(0.68, -0.1, 0.85);
  rightCheek.rotation.y = 0.3;
  head.add(rightCheek);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.55, 24, 16);
  earGeo.scale(1, 1, 0.6);

  const leftEar = new THREE.Mesh(earGeo, furMaterial);
  leftEar.position.set(-0.95, 0.95, 0);
  leftEar.rotation.z = -0.35;
  leftEar.rotation.x = -0.1;
  head.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, furMaterial);
  rightEar.position.set(0.95, 0.95, 0);
  rightEar.rotation.z = 0.35;
  rightEar.rotation.x = -0.1;
  head.add(rightEar);

  // Inner Ear Pads
  const innerEarGeo = new THREE.SphereGeometry(0.32, 20, 14);
  innerEarGeo.scale(0.9, 0.9, 0.3);

  const leftInner = new THREE.Mesh(innerEarGeo, innerEarMaterial);
  leftInner.position.set(-0.95, 0.95, 0.16);
  leftInner.rotation.z = -0.35;
  head.add(leftInner);

  const rightInner = new THREE.Mesh(innerEarGeo, innerEarMaterial);
  rightInner.position.set(0.95, 0.95, 0.16);
  rightInner.rotation.z = 0.35;
  head.add(rightInner);

  // --- 5. TED'S CUTE ACCESSORY: PINK BOW OR STAR PIN ---
  const bow = new THREE.Group();
  bow.position.set(0.8, 1.25, 0.3);
  bow.rotation.z = -0.25;

  const bowKnotGeo = new THREE.SphereGeometry(0.12, 12, 10);
  const bowKnot = new THREE.Mesh(bowKnotGeo, bowMaterial);
  bow.add(bowKnot);

  const bowWingGeo = new THREE.ConeGeometry(0.22, 0.45, 16);
  bowWingGeo.rotateZ(Math.PI / 2);

  const leftWing = new THREE.Mesh(bowWingGeo, bowMaterial);
  leftWing.position.set(-0.25, 0, 0);
  bow.add(leftWing);

  const rightWing = new THREE.Mesh(bowWingGeo, bowMaterial);
  rightWing.position.set(0.25, 0, 0);
  rightWing.rotation.z = Math.PI;
  bow.add(rightWing);

  // Tiny golden star pin in center of bow
  const starPin = create3DStar(0.14, 0.05, PASTEL_COLORS.starGold);
  starPin.position.set(0, 0, 0.12);
  bow.add(starPin);

  head.add(bow);

  // Expression controller
  const setExpression = (expr: 'happy' | 'sleepy' | 'sparkle' | 'curious' | 'giggle') => {
    switch (expr) {
      case 'sleepy':
        leftEye.scale.set(1.2, 0.2, 1);
        rightEye.scale.set(1.2, 0.2, 1);
        leftCatch.visible = false;
        rightCatch.visible = false;
        leftCheek.scale.set(1.5, 0.8, 0.3);
        rightCheek.scale.set(1.5, 0.8, 0.3);
        break;
      case 'sparkle':
        leftEye.scale.set(1.2, 1.2, 1.2);
        rightEye.scale.set(1.2, 1.2, 1.2);
        leftCatch.visible = true;
        rightCatch.visible = true;
        leftCatch.scale.set(1.8, 1.8, 1.8);
        rightCatch.scale.set(1.8, 1.8, 1.8);
        break;
      case 'giggle':
        leftEye.scale.set(1.3, 0.3, 1);
        rightEye.scale.set(1.3, 0.3, 1);
        leftCatch.visible = false;
        rightCatch.visible = false;
        leftCheek.scale.set(1.8, 1.1, 0.4);
        rightCheek.scale.set(1.8, 1.1, 0.4);
        break;
      case 'curious':
        leftEye.scale.set(1.4, 1.4, 1);
        rightEye.scale.set(1.1, 1.1, 1);
        leftCatch.visible = true;
        rightCatch.visible = true;
        break;
      case 'happy':
      default:
        leftEye.scale.set(1, 1, 1);
        rightEye.scale.set(1, 1, 1);
        leftCatch.visible = true;
        rightCatch.visible = true;
        leftCatch.scale.set(1, 1, 1);
        rightCatch.scale.set(1, 1, 1);
        leftCheek.scale.set(1.2, 0.6, 0.3);
        rightCheek.scale.set(1.2, 0.6, 0.3);
        break;
    }
  };

  return { group, head, body, leftArm, rightArm, bow, setExpression };
}

/**
 * Procedural 3D Beveled Star
 */
export function create3DStar(
  outerRadius = 1,
  depth = 0.3,
  color = PASTEL_COLORS.starGold
): THREE.Mesh {
  const shape = new THREE.Shape();
  const points = 5;
  const innerRadius = outerRadius * 0.45;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: depth * 0.25,
    bevelThickness: depth * 0.25,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.2,
    emissive: color,
    emissiveIntensity: 0.15,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

/**
 * Procedural 3D Fluffy Pastel Cloud Platform
 */
export function createFluffyCloudMesh(
  scaleX = 4,
  scaleY = 1.2,
  scaleZ = 3,
  color = PASTEL_COLORS.cloudWhite
): THREE.Group {
  const cloud = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.05,
  });

  // Base cluster of overlapping spheres
  const puffs = [
    { x: 0, y: 0, z: 0, r: 1.3 },
    { x: -1.2, y: -0.1, z: 0.2, r: 1.0 },
    { x: 1.2, y: -0.1, z: -0.1, r: 1.05 },
    { x: -0.6, y: 0.3, z: -0.4, r: 0.95 },
    { x: 0.7, y: 0.25, z: 0.4, r: 0.9 },
    { x: 0, y: -0.3, z: 0.8, r: 0.85 },
    { x: -1.6, y: -0.25, z: -0.2, r: 0.75 },
    { x: 1.6, y: -0.25, z: 0.2, r: 0.8 },
  ];

  puffs.forEach((p) => {
    const geo = new THREE.SphereGeometry(p.r, 20, 16);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(p.x, p.y, p.z);
    mesh.receiveShadow = true;
    cloud.add(mesh);
  });

  cloud.scale.set(scaleX / 3.2, scaleY / 1.5, scaleZ / 2.5);
  return cloud;
}

/**
 * Procedural 3D Crescent Moon
 */
export function createCrescentMoon(size = 1.5): THREE.Mesh {
  const shape = new THREE.Shape();
  // Outer arc
  shape.absarc(0, 0, size, -Math.PI * 0.4, Math.PI * 0.8, false);
  // Inner subtracting arc
  shape.absarc(size * 0.45, size * 0.25, size * 0.82, Math.PI * 0.85, -Math.PI * 0.45, true);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  geometry.center();

  const material = new THREE.MeshStandardMaterial({
    color: 0xfff0aa,
    emissive: 0xffe066,
    emissiveIntensity: 0.25,
    roughness: 0.4,
    metalness: 0.1,
  });

  const moon = new THREE.Mesh(geometry, material);
  moon.castShadow = true;
  return moon;
}

/**
 * Procedural 3D Toy Alphabet Block
 */
export function createToyBlock(
  size = 0.8,
  baseColor = 0xffd1e3,
  letter = 'A'
): THREE.Group {
  const blockGroup = new THREE.Group();

  const boxGeo = new THREE.BoxGeometry(size, size, size);
  const boxMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.45,
    metalness: 0.1,
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.castShadow = true;
  box.receiveShadow = true;
  blockGroup.add(box);

  // Border inlay
  const edgeGeo = new THREE.BoxGeometry(size * 1.01, size * 1.01, size * 1.01);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  const wire = new THREE.Mesh(edgeGeo, wireMat);
  blockGroup.add(wire);

  return blockGroup;
}
