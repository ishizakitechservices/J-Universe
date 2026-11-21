import * as THREE from 'three';
import { COSMIC_PALETTE } from './worldConfig';
import { createBrushedMetalRoughnessMap } from './texturesAndShaders';

export interface CentralCoreRig {
  group: THREE.Group;
  update: (elapsed: number, delta: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

function createSculptedJShape(inset = 0): THREE.Shape {
  const shape = new THREE.Shape();
  const topW = 0.25 - inset * 0.55;
  const stemRight = 0.43 - inset * 0.65;
  const stemLeft = 0.13 + inset * 0.65;
  const hookCenterX = -0.06;
  const hookCenterY = -0.34;
  const outerR = 0.49 - inset * 0.65;
  const innerR = 0.18 + inset * 0.65;

  shape.moveTo(stemLeft - topW * 0.72, 1.0 - inset);
  shape.lineTo(stemRight + 0.08, 1.0 - inset);
  shape.lineTo(stemRight, 0.78 + inset * 0.2);
  shape.lineTo(stemRight, hookCenterY);
  shape.absarc(hookCenterX, hookCenterY, outerR, 0, -Math.PI, true);
  shape.lineTo(hookCenterX - outerR, -0.14 - inset);
  shape.lineTo(hookCenterX - innerR, -0.14 - inset);
  shape.absarc(hookCenterX, hookCenterY, innerR, -Math.PI, 0, false);
  shape.lineTo(stemLeft, 0.78 + inset * 0.2);
  shape.lineTo(stemLeft - topW * 0.72, 0.85 + inset * 0.2);
  shape.closePath();

  return shape;
}

export function createCentralJSculpture(maxAnisotropy: number): CentralCoreRig {
  const group = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  const brushedRoughness = createBrushedMetalRoughnessMap(maxAnisotropy);
  disposables.push(brushedRoughness);

  // 1. Primary Sculpted Brushed Titanium J
  const mainShape = createSculptedJShape(0);
  const mainGeo = new THREE.ExtrudeGeometry(mainShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.042,
    bevelSegments: 5,
    curveSegments: 36,
  });
  mainGeo.center();
  mainGeo.computeVertexNormals();

  const titaniumMat = new THREE.MeshPhysicalMaterial({
    color: 0x1b2232,
    metalness: 0.92,
    roughness: 0.28,
    roughnessMap: brushedRoughness,
    anisotropy: 0.82,
    anisotropyRotation: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.24,
  });

  const mainMesh = new THREE.Mesh(mainGeo, titaniumMat);
  mainMesh.position.set(-0.14, 0.04, 0);
  mainMesh.castShadow = true;
  mainMesh.receiveShadow = true;
  group.add(mainMesh);
  disposables.push(mainGeo, titaniumMat);

  // 2. Stepped Warm Brass Relief Fillet (subtle horological inlay rather than blocky protrusion)
  const inlayShape = createSculptedJShape(0.068);
  const inlayGeo = new THREE.ExtrudeGeometry(inlayShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 32,
  });
  inlayGeo.center();
  inlayGeo.computeVertexNormals();

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: COSMIC_PALETTE.ishizakiGold,
    emissive: COSMIC_PALETTE.ishizakiGold,
    emissiveIntensity: 0.08,
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 0.65,
  });

  const inlayMesh = new THREE.Mesh(inlayGeo, goldMat);
  inlayMesh.position.copy(mainMesh.position);
  group.add(inlayMesh);
  disposables.push(inlayGeo, goldMat);

  // Delicate curved brass cradle arc embracing the base curve of the J
  const cradlePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i += 1) {
    const a = -Math.PI * 0.92 + (i / 24) * (Math.PI * 0.96);
    cradlePts.push(
      new THREE.Vector3(
        -0.2 + Math.cos(a) * 0.68,
        -0.3 + Math.sin(a) * 0.68,
        0
      )
    );
  }
  const cradleCurve = new THREE.CatmullRomCurve3(cradlePts);
  const cradleGeo = new THREE.TubeGeometry(cradleCurve, 32, 0.013, 10, false);
  const cradleMesh = new THREE.Mesh(cradleGeo, goldMat);
  group.add(cradleMesh);
  disposables.push(cradleGeo);

  // 3. The Signature Period Orb (composite warm-ivory pearl + brass meridian bezel)
  const dotPivot = new THREE.Group();
  dotPivot.position.set(0.76, -0.68, 0.08);
  group.add(dotPivot);

  const dotCoreGeo = new THREE.SphereGeometry(0.165, 28, 28);
  const dotCoreMat = new THREE.MeshPhysicalMaterial({
    color: COSMIC_PALETTE.warmIvory,
    metalness: 0.15,
    roughness: 0.2,
    clearcoat: 0.88,
    clearcoatRoughness: 0.12,
  });
  const dotCore = new THREE.Mesh(dotCoreGeo, dotCoreMat);
  dotPivot.add(dotCore);

  const dotBezelGeo = new THREE.TorusGeometry(0.24, 0.013, 12, 48);
  const dotBezel = new THREE.Mesh(dotBezelGeo, goldMat);
  dotBezel.rotation.set(Math.PI * 0.35, 0.4, 0);
  dotPivot.add(dotBezel);
  disposables.push(dotCoreGeo, dotCoreMat, dotBezelGeo);

  // 4. Fine Horological Gimbal Rings with Balanced Asymmetric Index Finials & 12 Graduations
  const innerGimbalGroup = new THREE.Group();
  innerGimbalGroup.rotation.set(0.55, 0.25, -0.18);
  group.add(innerGimbalGroup);

  const innerRingGeo = new THREE.TorusGeometry(1.72, 0.011, 12, 96);
  const innerRingMat = new THREE.MeshStandardMaterial({
    color: COSMIC_PALETTE.warmIvory,
    metalness: 0.85,
    roughness: 0.24,
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerGimbalGroup.add(innerRingMesh);

  // 12 delicate horological radial graduation ticks instanced around the inner armillary ring
  const tickGeo = new THREE.BoxGeometry(0.055, 0.012, 0.012);
  const tickMesh = new THREE.InstancedMesh(tickGeo, goldMat, 12);
  const tickMatrix = new THREE.Matrix4();
  const tickPos = new THREE.Vector3();
  const tickQuat = new THREE.Quaternion();
  const tickScale = new THREE.Vector3(1, 1, 1);
  const zAxis = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    const isCardinal = i % 3 === 0;
    tickPos.set(Math.cos(angle) * 1.72, Math.sin(angle) * 1.72, 0);
    tickQuat.setFromAxisAngle(zAxis, angle);
    tickScale.set(isCardinal ? 1.5 : 0.85, isCardinal ? 1.25 : 0.9, 1);
    tickMatrix.compose(tickPos, tickQuat, tickScale);
    tickMesh.setMatrixAt(i, tickMatrix);
  }
  tickMesh.instanceMatrix.needsUpdate = true;
  tickMesh.computeBoundingSphere();
  innerGimbalGroup.add(tickMesh);

  // Two opposing index markers (brass finial + satin pearl counterweight)
  const finialGeo = new THREE.CylinderGeometry(0.018, 0.038, 0.11, 12);
  const finialA = new THREE.Mesh(finialGeo, goldMat);
  finialA.position.set(1.72, 0, 0);
  finialA.rotation.z = Math.PI / 2;
  innerGimbalGroup.add(finialA);

  const counterGeo = new THREE.SphereGeometry(0.048, 16, 16);
  const counterB = new THREE.Mesh(counterGeo, dotCoreMat);
  counterB.position.set(-1.72, 0, 0);
  innerGimbalGroup.add(counterB);

  const outerGimbalGroup = new THREE.Group();
  outerGimbalGroup.rotation.set(-0.42, -0.35, 0.3);
  group.add(outerGimbalGroup);

  const outerRingGeo = new THREE.TorusGeometry(2.14, 0.009, 10, 112);
  const outerRingMat = new THREE.MeshStandardMaterial({
    color: COSMIC_PALETTE.mutedUltraviolet,
    metalness: 0.72,
    roughness: 0.32,
    transparent: true,
    opacity: 0.62,
  });
  const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerGimbalGroup.add(outerRingMesh);

  disposables.push(
    innerRingGeo,
    innerRingMat,
    tickGeo,
    finialGeo,
    counterGeo,
    outerRingGeo,
    outerRingMat
  );

  group.rotation.y = -0.18;

  return {
    group,
    update(elapsed: number, delta: number, reducedMotion: boolean) {
      if (reducedMotion) {
        group.position.y = 0;
        return;
      }
      group.position.y = Math.sin(elapsed * 0.55) * 0.065;
      group.rotation.y = -0.18 + Math.sin(elapsed * 0.22) * 0.1;
      innerGimbalGroup.rotation.z += delta * 0.07;
      outerGimbalGroup.rotation.y -= delta * 0.045;
      dotBezel.rotation.z += delta * 0.28;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
