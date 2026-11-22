import * as THREE from 'three';
import { UniverseDestination } from '../data/universeData';
import { COSMIC_PALETTE, buildWorldVisualSpec } from './worldConfig';
import {
  createAtmosphereMaterial,
  createPlanetSurfaceTexture,
} from './texturesAndShaders';

export interface CelestialWorldRig {
  dest: UniverseDestination;
  group: THREE.Group;
  position: THREE.Vector3;
  radius: number;
  hitProxy: THREE.Mesh;
  atmosphereMat?: THREE.ShaderMaterial;
  orbitLine: THREE.LineLoop;
  orbitLineMat: THREE.LineBasicMaterial;
  update: (
    elapsed: number,
    delta: number,
    isFocused: boolean,
    isHovered: boolean,
    reducedMotion: boolean
  ) => void;
  dispose: () => void;
}

export function createCelestialWorld(
  dest: UniverseDestination,
  maxAnisotropy: number,
  _isSoftwareGl: boolean,
  targetSphereSegments = 28
): CelestialWorldRig {
  const spec = buildWorldVisualSpec(dest);
  const group = new THREE.Group();
  group.position.set(spec.position.x, spec.position.y, spec.position.z);

  const disposables: Array<{ dispose: () => void }> = [];
  const spinGroup = new THREE.Group();
  group.add(spinGroup);

  const satGroup = new THREE.Group();
  group.add(satGroup);

  let atmosphereMat: THREE.ShaderMaterial | undefined;
  const r = spec.planetRadius;

  const sphereSegments = targetSphereSegments;
  const surfaceTex = createPlanetSurfaceTexture(dest.archetype, maxAnisotropy);
  disposables.push(surfaceTex);

  const addAtmosphere = (colorHex: number, scale = 1.15, intensity = 0.85) => {
    const atmoGeo = new THREE.SphereGeometry(r * scale, sphereSegments, sphereSegments);
    const mat = createAtmosphereMaterial(colorHex, intensity);
    const atmoMesh = new THREE.Mesh(atmoGeo, mat);
    group.add(atmoMesh);
    disposables.push(atmoGeo, mat);
    atmosphereMat = mat;
  };

  if (dest.archetype === 'learning') {
    // ClassApp: Lavender Learning World with tilted translucent double ring + 3 companion moons
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.4,
      metalness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    spinGroup.add(coreMesh);
    disposables.push(coreGeo, coreMat);

    addAtmosphere(COSMIC_PALETTE.classAppLavender, 1.16, 0.92);

    const ringInnerGeo = new THREE.RingGeometry(r * 1.32, r * 1.56, 44);
    ringInnerGeo.rotateX(Math.PI / 2);
    const ringInnerMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.classAppLavender,
      roughness: 0.35,
      metalness: 0.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.62,
    });
    const ringInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
    ringInner.rotation.set(0.32, 0.1, -0.22);
    group.add(ringInner);

    const ringOuterGeo = new THREE.TorusGeometry(r * 1.72, 0.016, 8, 48);
    ringOuterGeo.rotateX(Math.PI / 2);
    const ringOuterMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      roughness: 0.25,
      metalness: 0.8,
    });
    const ringOuter = new THREE.Mesh(ringOuterGeo, ringOuterMat);
    ringOuter.rotation.copy(ringInner.rotation);
    group.add(ringOuter);

    // 3 orbiting small companion moons (Students, Parents, Teachers)
    const moonGeo = new THREE.SphereGeometry(0.085, 12, 12);
    const moonMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      emissive: COSMIC_PALETTE.classAppLavender,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.25,
    });
    for (let i = 0; i < 3; i += 1) {
      const a = (i * Math.PI * 2) / 3;
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.set(Math.cos(a) * r * 1.72, 0.08 * Math.sin(a * 2), Math.sin(a) * r * 1.72);
      satGroup.add(moon);
    }
    satGroup.rotation.copy(ringInner.rotation);
    disposables.push(ringInnerGeo, ringInnerMat, ringOuterGeo, ringOuterMat, moonGeo, moonMat);
  } else if (dest.archetype === 'discovery') {
    // MilkyPy: Mint & Teal Discovery World + brushed titanium gyro + geometric prism satellite
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.36,
      metalness: 0.14,
    });
    spinGroup.add(new THREE.Mesh(coreGeo, coreMat));
    disposables.push(coreGeo, coreMat);

    addAtmosphere(COSMIC_PALETTE.milkyPyMint, 1.16, 0.9);

    const gyroGeo = new THREE.TorusGeometry(r * 1.42, 0.022, 8, 48);
    gyroGeo.rotateX(Math.PI / 2);
    const gyroMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.milkyPyMint,
      emissive: COSMIC_PALETTE.milkyPyMint,
      emissiveIntensity: 0.18,
      metalness: 0.85,
      roughness: 0.22,
    });
    const gyro = new THREE.Mesh(gyroGeo, gyroMat);
    gyro.rotation.set(-0.38, 0.25, 0.32);
    satGroup.add(gyro);

    // Code prism moon
    const prismGeo = new THREE.OctahedronGeometry(0.13, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      emissive: COSMIC_PALETTE.milkyPyMint,
      emissiveIntensity: 0.32,
      metalness: 0.75,
      roughness: 0.18,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(r * 1.56, 0.16, 0);
    satGroup.add(prism);

    disposables.push(gyroGeo, gyroMat, prismGeo, prismMat);
  } else if (dest.archetype === 'creation') {
    // Ishizaki Tech Services: Sculpted Stone & Warm Gold astrolabe world
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.62,
      metalness: 0.22,
    });
    spinGroup.add(new THREE.Mesh(coreGeo, coreMat));
    disposables.push(coreGeo, coreMat);

    addAtmosphere(COSMIC_PALETTE.ishizakiGold, 1.14, 0.75);

    const brassMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.ishizakiGold,
      metalness: 0.94,
      roughness: 0.18,
    });
    const arcGeo1 = new THREE.TorusGeometry(r * 1.38, 0.028, 8, 48);
    const arc1 = new THREE.Mesh(arcGeo1, brassMat);
    arc1.rotation.set(Math.PI * 0.42, 0.2, 0.15);
    satGroup.add(arc1);

    const arcGeo2 = new THREE.TorusGeometry(r * 1.6, 0.018, 8, 48);
    const arc2 = new THREE.Mesh(arcGeo2, brassMat);
    arc2.rotation.set(-0.45, Math.PI * 0.3, -0.2);
    satGroup.add(arc2);

    // Equatorial seam ring
    const seamGeo = new THREE.TorusGeometry(r * 1.02, 0.015, 8, 44);
    seamGeo.rotateX(Math.PI / 2);
    const seam = new THREE.Mesh(seamGeo, brassMat);
    spinGroup.add(seam);

    disposables.push(brassMat, arcGeo1, arcGeo2, seamGeo);
  } else if (dest.archetype === 'cluster') {
    // The Lab: Sculptural multi-body constellation of developing ideas (not a single sphere)
    const centerGeo = new THREE.IcosahedronGeometry(r * 0.46, 0);
    const centerMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      metalness: 0.78,
      roughness: 0.28,
    });
    spinGroup.add(new THREE.Mesh(centerGeo, centerMat));

    const frameGeo = new THREE.TorusGeometry(r * 0.95, 0.015, 8, 44);
    const frameMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.milkyPyMint,
      emissive: COSMIC_PALETTE.milkyPyMint,
      emissiveIntensity: 0.2,
      metalness: 0.85,
      roughness: 0.22,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.rotation.set(0.65, 0.2, 0);
    satGroup.add(frame);

    const nodeGeoA = new THREE.OctahedronGeometry(0.18, 0);
    const nodeGeoB = new THREE.DodecahedronGeometry(0.16, 0);
    const nodeGeoC = new THREE.IcosahedronGeometry(0.15, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      emissive: COSMIC_PALETTE.mutedUltraviolet,
      emissiveIntensity: 0.22,
      metalness: 0.65,
      roughness: 0.25,
    });

    const nA = new THREE.Mesh(nodeGeoA, nodeMat);
    nA.position.set(r * 0.95, 0.14, 0.18);
    const nB = new THREE.Mesh(nodeGeoB, frameMat);
    nB.position.set(-r * 0.72, -0.25, r * 0.56);
    const nC = new THREE.Mesh(nodeGeoC, nodeMat);
    nC.position.set(-r * 0.2, 0.36, -r * 0.85);
    satGroup.add(nA, nB, nC);

    disposables.push(
      centerGeo,
      centerMat,
      frameGeo,
      frameMat,
      nodeGeoA,
      nodeGeoB,
      nodeGeoC,
      nodeMat
    );
  } else if (dest.archetype === 'pathway') {
    // My Journey: Slate-ultraviolet sphere encircled by a sweeping helical milestone ribbon
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.48,
      metalness: 0.2,
    });
    spinGroup.add(new THREE.Mesh(coreGeo, coreMat));
    addAtmosphere(COSMIC_PALETTE.mutedUltraviolet, 1.15, 0.78);

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i += 1) {
      const t = (i / 48) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(t) * r * 1.48,
          Math.sin(t * 2) * 0.24,
          Math.sin(t) * r * 1.48
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.022, 6, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      emissive: COSMIC_PALETTE.mutedUltraviolet,
      emissiveIntensity: 0.25,
      metalness: 0.75,
      roughness: 0.22,
    });
    const ribbon = new THREE.Mesh(tubeGeo, tubeMat);
    ribbon.rotation.z = 0.28;
    satGroup.add(ribbon);
    disposables.push(coreGeo, coreMat, tubeGeo, tubeMat);
  } else if (dest.archetype === 'archive') {
    // The Journal: Quiet lunar sphere cradled in a satin-ivory archival ring
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.72,
      metalness: 0.08,
    });
    spinGroup.add(new THREE.Mesh(coreGeo, coreMat));
    addAtmosphere(COSMIC_PALETTE.ishizakiGold, 1.12, 0.55);

    const discGeo = new THREE.RingGeometry(r * 1.34, r * 1.5, 44);
    discGeo.rotateX(Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      roughness: 0.6,
      metalness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.52,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.set(0.45, 0, -0.25);
    group.add(disc);
    disposables.push(coreGeo, coreMat, discGeo, discMat);
  } else if (dest.archetype === 'horizon') {
    // Future Projects: Crystalline polyhedral seed inside an open gilded orbital cradle
    const seedGeo = new THREE.OctahedronGeometry(r * 0.55, 1);
    const seedMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.classAppLavender,
      emissive: COSMIC_PALETTE.mutedUltraviolet,
      emissiveIntensity: 0.22,
      roughness: 0.16,
      metalness: 0.35,
    });
    spinGroup.add(new THREE.Mesh(seedGeo, seedMat));

    const cageMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.ishizakiGold,
      metalness: 0.9,
      roughness: 0.2,
    });
    const cageGeo = new THREE.TorusGeometry(r * 1.05, 0.016, 8, 44);
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(cageGeo, cageMat);
      ring.rotation.set(i * 0.7, i * 0.9, 0.3);
      satGroup.add(ring);
    }
    disposables.push(seedGeo, seedMat, cageMat, cageGeo);
  } else {
    // Origin (About Johnson): Warm ivory & muted ultraviolet layered sphere + delicate meridian halo
    const coreGeo = new THREE.SphereGeometry(r, sphereSegments, sphereSegments);
    const coreMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      roughness: 0.42,
      metalness: 0.16,
    });
    spinGroup.add(new THREE.Mesh(coreGeo, coreMat));
    addAtmosphere(COSMIC_PALETTE.mutedUltraviolet, 1.18, 0.88);

    const haloGeo = new THREE.TorusGeometry(r * 1.38, 0.018, 8, 44);
    const haloMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      emissive: COSMIC_PALETTE.mutedUltraviolet,
      emissiveIntensity: 0.2,
      metalness: 0.85,
      roughness: 0.22,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.set(0.55, 0.2, 0.15);
    satGroup.add(halo);
    disposables.push(coreGeo, coreMat, haloGeo, haloMat);
  }

  // Layer-1 generous invisible raycast proxy for effortless selection
  const hitGeo = new THREE.SphereGeometry(r * 1.65, 10, 10);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitProxy = new THREE.Mesh(hitGeo, hitMat);
  hitProxy.layers.set(1);
  hitProxy.userData.destId = dest.id;
  group.add(hitProxy);
  disposables.push(hitGeo, hitMat);

  // Subtle orbital ring path on this destination's tilted plane
  const orbitPts: THREE.Vector3[] = [];
  const tempDest = { orbitAngle: 0, orbitRing: dest.orbitRing };
  for (let i = 0; i < 64; i += 1) {
    tempDest.orbitAngle = (i / 64) * 360;
    const p = buildWorldVisualSpec({ ...dest, orbitAngle: tempDest.orbitAngle }).position;
    orbitPts.push(new THREE.Vector3(p.x, p.y, p.z));
  }
  const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
  const orbitLineMat = new THREE.LineBasicMaterial({
    color: spec.accentHex,
    transparent: true,
    opacity: 0.13,
  });
  const orbitLine = new THREE.LineLoop(orbitLineGeo, orbitLineMat);
  disposables.push(orbitLineGeo, orbitLineMat);

  let currentScale = 1;
  let currentOrbitOpacity = 0.13;

  return {
    dest,
    group,
    position: new THREE.Vector3(spec.position.x, spec.position.y, spec.position.z),
    radius: r,
    hitProxy,
    atmosphereMat,
    orbitLine,
    orbitLineMat,
    update(
      elapsed: number,
      delta: number,
      isFocused: boolean,
      isHovered: boolean,
      reducedMotion: boolean
    ) {
      const targetScale = isFocused ? 1.08 : isHovered ? 1.06 : 1.0;
      const targetOpacity = isFocused ? 0.36 : isHovered ? 0.28 : 0.12;
      currentScale = THREE.MathUtils.damp(currentScale, targetScale, 8, delta);
      currentOrbitOpacity = THREE.MathUtils.damp(
        currentOrbitOpacity,
        targetOpacity,
        8,
        delta
      );

      group.scale.setScalar(currentScale);
      orbitLineMat.opacity = currentOrbitOpacity;
      if (atmosphereMat) {
        const targetBoost = isFocused ? 0.42 : isHovered ? 0.28 : 0.0;
        atmosphereMat.uniforms.uFocusBoost.value = THREE.MathUtils.damp(
          atmosphereMat.uniforms.uFocusBoost.value,
          targetBoost,
          8,
          delta
        );
      }

      if (!reducedMotion) {
        spinGroup.rotation.y += delta * 0.14;
        satGroup.rotation.y += delta * 0.28;
        group.position.y =
          spec.position.y + Math.sin(elapsed * 0.65 + spec.position.x) * 0.06;
      } else {
        group.position.y = spec.position.y;
      }
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
