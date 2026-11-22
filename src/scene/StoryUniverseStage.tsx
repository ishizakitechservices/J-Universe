import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  COSMIC_PALETTE,
  WORLD_RING_RADII,
} from './worldConfig';
import {
  STORY_LANDMARK_POSITIONS,
  interpolateStoryState,
} from './storyKeyframes';
import {
  createAtmosphereMaterial,
  createCosmicSkyMaterial,
  createPlanetSurfaceTexture,
} from './texturesAndShaders';
import { createCentralJSculpture } from './centralCore';
import {
  computeRenderScale,
  detectRenderCapability,
  getFramePacingConfig,
} from './deviceCapability';

interface StoryUniverseStageProps {
  sceneProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  onSceneProgressVisualChange?: (activeIndex: number) => void;
  stageNotifyRef: React.MutableRefObject<(() => void) | null>;
}

const _lookTarget = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _targetJPos = new THREE.Vector3();
const _targetColor = new THREE.Color();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyColor = new THREE.Color();
const _upAxis = new THREE.Vector3(0, 1, 0);

export function StoryUniverseStage({
  sceneProgressRef,
  reducedMotion,
  stageNotifyRef,
}: StoryUniverseStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    stageNotifyRef.current?.();
  }, [reducedMotion, stageNotifyRef]);

  useEffect(() => {
    const container = containerRef.current;
    const mountEl = canvasMountRef.current;
    if (!container || !mountEl) return;
    const containerEl: HTMLDivElement = container;

    const cap = detectRenderCapability();
    const { isSoftwareGl } = cap;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !cap.isConstrainedDevice && cap.pixelRatio <= 1.1,
        powerPreference: 'default',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const initW = Math.max(containerEl.clientWidth, 320);
    const initH = Math.max(containerEl.clientHeight, 320);
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(cap.pixelRatio);
    renderer.setSize(initW, initH);
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COSMIC_PALETTE.cosmicInk);
    scene.fog = new THREE.FogExp2(COSMIC_PALETTE.cosmicInk, 0.021);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const isMobileInit = initW < 768;
    const camera = new THREE.PerspectiveCamera(
      initW < 640 ? 50 : 42,
      initW / initH,
      0.1,
      190
    );

    const initialPose = interpolateStoryState(sceneProgressRef.current, isMobileInit);
    camera.position.set(
      initialPose.cameraPosition.x,
      initialPose.cameraPosition.y,
      initialPose.cameraPosition.z
    );
    _lookTarget.set(
      initialPose.cameraTarget.x,
      initialPose.cameraTarget.y,
      initialPose.cameraTarget.z
    );
    camera.lookAt(_lookTarget);

    // Streamlined Celestial Studio Lighting (Hemi + Key + Dynamic Accent)
    const hemiLight = new THREE.HemisphereLight(
      0xb4c8ee,
      COSMIC_PALETTE.cosmicInk,
      1.05
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff2de, 2.05);
    keyLight.position.set(12, 16, 14);
    scene.add(keyLight);

    const storyAccentLight = new THREE.PointLight(
      initialPose.accentHex,
      initialPose.accentIntensity * 0.85,
      28,
      1.45
    );
    storyAccentLight.position.set(2.8, 1.8, 3.0);
    scene.add(storyAccentLight);

    const disposables: Array<{ dispose: () => void }> = [envTarget];

    // 1. Sky Dome centered along the journey corridor
    const skyGeo = new THREE.SphereGeometry(130, 20, 14);
    const skyMat = createCosmicSkyMaterial();
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 0, -30);
    scene.add(skyMesh);
    disposables.push(skyGeo, skyMat);

    // 2. Calibrated Starfield spanning travel corridor [z: +22..-96]
    const starCount = cap.starCount;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const paletteChoices = [
      new THREE.Color(COSMIC_PALETTE.warmIvory),
      new THREE.Color(0xc2d2f0),
      new THREE.Color(COSMIC_PALETTE.ishizakiGold),
      new THREE.Color(COSMIC_PALETTE.classAppLavender),
      new THREE.Color(COSMIC_PALETTE.milkyPyMint),
    ];

    for (let i = 0; i < starCount; i += 1) {
      const u = ((i * 7919) % 10000) / 10000;
      const v = ((i * 6271) % 10000) / 10000;
      const w = ((i * 3571) % 10000) / 10000;
      const angle = u * Math.PI * 2;
      const radialDist = 9.5 + v * 38;
      starPositions[i * 3] = Math.cos(angle) * radialDist;
      starPositions[i * 3 + 1] = Math.sin(angle) * (radialDist * 0.72);
      starPositions[i * 3 + 2] = 22 - w * 116;

      const cIdx = i % 13 === 0 ? 2 : i % 9 === 0 ? 3 : i % 11 === 0 ? 4 : i % 3 === 0 ? 1 : 0;
      const c = paletteChoices[cIdx];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
      starSizes[i] = i % 19 === 0 ? 2.9 : i % 5 === 0 ? 1.9 : 1.2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uPixelRatio: { value: cap.pixelRatio },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        uniform float uPixelRatio;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (44.0 / max(-mvPosition.z, 2.0));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.08, dist) * 0.82;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    // 3. Quiet Instanced Parallax Dust Motes along Journey
    const moteCount = cap.moteCount;
    const moteGeo = new THREE.IcosahedronGeometry(0.032, 0);
    const moteMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      roughness: 0.42,
      metalness: 0.35,
      transparent: true,
      opacity: 0.44,
    });
    const moteMesh = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    for (let i = 0; i < moteCount; i += 1) {
      const a = i * 2.399963;
      const rad = 2.9 + ((i * 29) % 100) * 0.085;
      const z = 8 - ((i * 53) % 780) * 0.1;
      _dummyPos.set(Math.cos(a) * rad, Math.sin(a * 0.7) * rad * 0.52, z);
      const s = 0.6 + ((i * 11) % 8) * 0.07;
      _dummyScale.setScalar(s);
      _dummyQuat.setFromAxisAngle(_upAxis, i * 0.5);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      moteMesh.setMatrixAt(i, _dummyMatrix);
      _dummyColor.setHex(
        i % 3 === 0 ? COSMIC_PALETTE.ishizakiGold : COSMIC_PALETTE.warmIvory
      );
      moteMesh.setColorAt(i, _dummyColor);
    }
    moteMesh.instanceMatrix.needsUpdate = true;
    if (moteMesh.instanceColor) moteMesh.instanceColor.needsUpdate = true;
    moteMesh.computeBoundingSphere();
    scene.add(moteMesh);
    disposables.push(moteGeo, moteMat);

    // 4. Subtle Connecting Trajectory Line (visual continuity from Arrival -> Contact)
    const threadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, -0.15, 0),
      new THREE.Vector3(1.85, 0.35, -7.2),
      new THREE.Vector3(STORY_LANDMARK_POSITIONS.classapp.x, 0.25, STORY_LANDMARK_POSITIONS.classapp.z),
      new THREE.Vector3(STORY_LANDMARK_POSITIONS.milkypy.x, -0.15, STORY_LANDMARK_POSITIONS.milkypy.z),
      new THREE.Vector3(-0.35, 0.1, -49.0),
      new THREE.Vector3(STORY_LANDMARK_POSITIONS.studio.x, 0.15, STORY_LANDMARK_POSITIONS.studio.z),
      new THREE.Vector3(0.55, 0.1, -65.5),
    ]);
    const threadGeo = new THREE.BufferGeometry().setFromPoints(
      threadCurve.getPoints(96)
    );
    const threadMat = new THREE.LineBasicMaterial({
      color: COSMIC_PALETTE.mutedUltraviolet,
      transparent: true,
      opacity: 0.16,
    });
    scene.add(new THREE.Line(threadGeo, threadMat));
    disposables.push(threadGeo, threadMat);

    // 5. The Handcrafted J. Monogram Sculpture
    const centralRig = createCentralJSculpture(maxAnisotropy);
    centralRig.group.position.set(
      initialPose.jPosition.x,
      initialPose.jPosition.y,
      initialPose.jPosition.z
    );
    centralRig.group.scale.setScalar(initialPose.jScale);
    scene.add(centralRig.group);
    disposables.push(centralRig);

    const sharedGoldMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.ishizakiGold,
      emissive: COSMIC_PALETTE.ishizakiGold,
      emissiveIntensity: 0.05,
      metalness: 0.94,
      roughness: 0.18,
    });
    const sharedIvoryMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      roughness: 0.24,
      metalness: 0.22,
    });
    disposables.push(sharedGoldMat, sharedIvoryMat);

    // 6. SCENE 03 — ClassApp Lavender Academic Globe (z = -20)
    const seg = cap.sphereSegments;
    const classAppGroup = new THREE.Group();
    classAppGroup.position.set(
      STORY_LANDMARK_POSITIONS.classapp.x,
      STORY_LANDMARK_POSITIONS.classapp.y,
      STORY_LANDMARK_POSITIONS.classapp.z
    );
    scene.add(classAppGroup);

    const classAppTex = createPlanetSurfaceTexture('learning', maxAnisotropy);
    const classAppCoreGeo = new THREE.SphereGeometry(1.72, seg, seg);
    const classAppCoreMat = new THREE.MeshStandardMaterial({
      map: classAppTex,
      roughness: 0.44,
      metalness: 0.08,
    });
    const classAppCore = new THREE.Mesh(classAppCoreGeo, classAppCoreMat);
    classAppGroup.add(classAppCore);

    // Refined brass polar meridian axis & curved cradle arc (distinguishes ClassApp as a crafted celestial globe)
    const axisGeo = new THREE.CylinderGeometry(0.016, 0.016, 4.02, 12);
    const axisMesh = new THREE.Mesh(axisGeo, sharedGoldMat);
    axisMesh.rotation.z = 0.22;
    classAppGroup.add(axisMesh);

    const axisCapGeo = new THREE.SphereGeometry(0.044, 12, 12);
    const axisCapTop = new THREE.Mesh(axisCapGeo, sharedGoldMat);
    axisCapTop.position.set(0, 2.01, 0);
    axisMesh.add(axisCapTop);
    const axisCapBottom = new THREE.Mesh(axisCapGeo, sharedGoldMat);
    axisCapBottom.position.set(0, -2.01, 0);
    axisMesh.add(axisCapBottom);

    const cradleArcGeo = new THREE.TorusGeometry(1.94, 0.015, 8, 36, Math.PI * 1.15);
    const cradleArc = new THREE.Mesh(cradleArcGeo, sharedGoldMat);
    cradleArc.rotation.set(0.08, 0.35, -Math.PI * 0.57 + 0.22);
    classAppGroup.add(cradleArc);

    const classAppAtmoGeo = new THREE.SphereGeometry(1.98, seg, seg);
    const classAppAtmoMat = createAtmosphereMaterial(
      COSMIC_PALETTE.classAppLavender,
      0.64
    );
    classAppGroup.add(new THREE.Mesh(classAppAtmoGeo, classAppAtmoMat));

    const classAppRingGeo = new THREE.RingGeometry(2.26, 2.66, 48);
    classAppRingGeo.rotateX(Math.PI / 2);
    const classAppRingMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.classAppLavender,
      roughness: 0.4,
      metalness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.48,
    });
    const classAppRing = new THREE.Mesh(classAppRingGeo, classAppRingMat);
    classAppRing.rotation.set(0.32, 0.12, -0.2);
    classAppGroup.add(classAppRing);

    const classAppOuterGeo = new THREE.TorusGeometry(2.88, 0.014, 8, 52);
    classAppOuterGeo.rotateX(Math.PI / 2);
    const classAppOuter = new THREE.Mesh(classAppOuterGeo, sharedIvoryMat);
    classAppOuter.rotation.copy(classAppRing.rotation);
    classAppGroup.add(classAppOuter);

    const classAppMoons = new THREE.Group();
    classAppMoons.rotation.copy(classAppRing.rotation);
    const moonGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const companionMoon = new THREE.Mesh(moonGeo, sharedIvoryMat);
    companionMoon.position.set(2.88, 0.06, 0);
    classAppMoons.add(companionMoon);
    classAppGroup.add(classAppMoons);

    disposables.push(
      classAppTex,
      classAppCoreGeo,
      classAppCoreMat,
      axisGeo,
      axisCapGeo,
      cradleArcGeo,
      classAppAtmoGeo,
      classAppAtmoMat,
      classAppRingGeo,
      classAppRingMat,
      classAppOuterGeo,
      moonGeo
    );

    // 7. SCENE 04 — MilkyPy Faceted Mint Sanctuary (z = -36)
    const milkyPyGroup = new THREE.Group();
    milkyPyGroup.position.set(
      STORY_LANDMARK_POSITIONS.milkypy.x,
      STORY_LANDMARK_POSITIONS.milkypy.y,
      STORY_LANDMARK_POSITIONS.milkypy.z
    );
    scene.add(milkyPyGroup);

    const milkyPyTex = createPlanetSurfaceTexture('discovery', maxAnisotropy);
    const milkyCoreGeo = new THREE.IcosahedronGeometry(1.24, 1);
    const milkyCoreMat = new THREE.MeshStandardMaterial({
      map: milkyPyTex,
      color: 0xffffff,
      roughness: 0.24,
      metalness: 0.34,
      flatShading: true,
    });
    const milkyCore = new THREE.Mesh(milkyCoreGeo, milkyCoreMat);
    milkyPyGroup.add(milkyCore);

    // Outer translucent crystal lattice shell (lightweight PBR, zero dual-pass transmission)
    const milkyShellGeo = new THREE.IcosahedronGeometry(1.58, 1);
    const milkyShellMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.milkyPyMint,
      roughness: 0.12,
      metalness: 0.16,
      transparent: true,
      opacity: 0.26,
      flatShading: true,
      depthWrite: false,
    });
    const milkyShell = new THREE.Mesh(milkyShellGeo, milkyShellMat);
    milkyPyGroup.add(milkyShell);

    const milkyInnerRingGeo = new THREE.TorusGeometry(1.9, 0.018, 8, 44);
    const milkyRingMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.milkyPyMint,
      metalness: 0.85,
      roughness: 0.22,
    });
    const milkyOrbitA = new THREE.Group();
    const mRingA = new THREE.Mesh(milkyInnerRingGeo, milkyRingMat);
    mRingA.rotation.set(0.62, 0.25, -0.35);
    milkyOrbitA.add(mRingA);

    const milkyOuterRingGeo = new THREE.TorusGeometry(2.44, 0.013, 8, 48);
    const mRingB = new THREE.Mesh(milkyOuterRingGeo, sharedIvoryMat);
    mRingB.rotation.set(-0.55, 0.4, 0.28);
    milkyOrbitA.add(mRingB);

    // 2 asymmetric orbiting markers (faceted code prism + ivory counterweight)
    const prismGeo = new THREE.OctahedronGeometry(0.19, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.milkyPyMint,
      emissive: COSMIC_PALETTE.milkyPyMint,
      emissiveIntensity: 0.14,
      roughness: 0.18,
      metalness: 0.48,
    });
    const prismNode = new THREE.Mesh(prismGeo, prismMat);
    prismNode.position.set(2.44, 0.26, 0);
    prismNode.rotation.set(0.3, 0.6, 0.2);
    milkyOrbitA.add(prismNode);

    const mintMoonGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const mintMoon = new THREE.Mesh(mintMoonGeo, sharedIvoryMat);
    mintMoon.position.set(-1.9, -0.22, 0);
    milkyOrbitA.add(mintMoon);

    milkyPyGroup.add(milkyOrbitA);

    const milkyAtmoGeo = new THREE.SphereGeometry(2.08, 18, 18);
    const milkyAtmoMat = createAtmosphereMaterial(
      COSMIC_PALETTE.milkyPyMint,
      0.46
    );
    milkyPyGroup.add(new THREE.Mesh(milkyAtmoGeo, milkyAtmoMat));

    disposables.push(
      milkyPyTex,
      milkyCoreGeo,
      milkyCoreMat,
      milkyShellGeo,
      milkyShellMat,
      milkyInnerRingGeo,
      milkyRingMat,
      milkyOuterRingGeo,
      prismGeo,
      prismMat,
      mintMoonGeo,
      milkyAtmoGeo,
      milkyAtmoMat
    );

    // 8. SCENE 05 — Quiet Horizon Ring Arc for About (z = -50.5)
    const aboutHaloGeo = new THREE.TorusGeometry(WORLD_RING_RADII[1] * 0.55, 0.011, 8, 52);
    const aboutHaloMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.mutedUltraviolet,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.22,
    });
    const aboutHalo = new THREE.Mesh(aboutHaloGeo, aboutHaloMat);
    aboutHalo.position.set(0.2, -0.35, -50.5);
    aboutHalo.rotation.set(Math.PI * 0.44, 0.18, -0.2);
    scene.add(aboutHalo);
    disposables.push(aboutHaloGeo, aboutHaloMat);

    // 9. SCENE 06 — Ishizaki Tech Services Sculptural Gold Astrolabe (z = -58)
    const studioGroup = new THREE.Group();
    studioGroup.position.set(
      STORY_LANDMARK_POSITIONS.studio.x,
      STORY_LANDMARK_POSITIONS.studio.y,
      STORY_LANDMARK_POSITIONS.studio.z
    );
    scene.add(studioGroup);

    const studioKnotGeo = new THREE.TorusKnotGeometry(0.84, 0.21, 56, 10, 2, 3);
    const studioKnotMat = new THREE.MeshStandardMaterial({
      color: 0x1d2433,
      metalness: 0.9,
      roughness: 0.24,
    });
    const studioKnot = new THREE.Mesh(studioKnotGeo, studioKnotMat);
    studioGroup.add(studioKnot);

    const studioAstrolabeGroup = new THREE.Group();
    const sArcGeo1 = new THREE.TorusGeometry(1.9, 0.026, 8, 52);
    const sArc1 = new THREE.Mesh(sArcGeo1, sharedGoldMat);
    sArc1.rotation.set(Math.PI * 0.4, 0.22, 0.14);

    const sArcGeo2 = new THREE.TorusGeometry(2.36, 0.017, 8, 56);
    const sArc2 = new THREE.Mesh(sArcGeo2, sharedGoldMat);
    sArc2.rotation.set(-0.48, Math.PI * 0.28, -0.22);

    const sArcGeo3 = new THREE.TorusGeometry(2.7, 0.012, 8, 56);
    const sArc3 = new THREE.Mesh(sArcGeo3, sharedIvoryMat);
    sArc3.rotation.set(0.22, -0.45, 0.65);

    studioAstrolabeGroup.add(sArc1, sArc2, sArc3);

    const sPinGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.12, 10);
    for (let i = 0; i < 2; i += 1) {
      const sign = i === 0 ? 1 : -1;
      const pin = new THREE.Mesh(sPinGeo, sharedGoldMat);
      pin.position.set(sign * 2.36, 0, 0);
      pin.rotation.z = Math.PI / 2;
      sArc2.add(pin);
    }

    // 12 instanced radial brass calibration pins along sArc1
    const radialPinGeo = new THREE.BoxGeometry(0.024, 0.09, 0.024);
    const radialPins = new THREE.InstancedMesh(radialPinGeo, sharedGoldMat, 12);
    for (let i = 0; i < 12; i += 1) {
      const theta = (i / 12) * Math.PI * 2;
      _dummyPos.set(Math.cos(theta) * 1.9, Math.sin(theta) * 1.9, 0);
      _dummyQuat.setFromAxisAngle(_upAxis, 0);
      const qRot = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        theta + Math.PI / 2
      );
      const isCardinal = i % 3 === 0;
      _dummyScale.set(isCardinal ? 1.25 : 0.85, isCardinal ? 1.35 : 0.85, isCardinal ? 1.25 : 0.85);
      _dummyMatrix.compose(_dummyPos, qRot, _dummyScale);
      radialPins.setMatrixAt(i, _dummyMatrix);
    }
    radialPins.instanceMatrix.needsUpdate = true;
    radialPins.computeBoundingSphere();
    sArc1.add(radialPins);

    studioGroup.add(studioAstrolabeGroup);

    const studioGlowGeo = new THREE.SphereGeometry(2.05, 18, 18);
    const studioGlowMat = createAtmosphereMaterial(
      COSMIC_PALETTE.ishizakiGold,
      0.42
    );
    studioGroup.add(new THREE.Mesh(studioGlowGeo, studioGlowMat));

    disposables.push(
      studioKnotGeo,
      studioKnotMat,
      sArcGeo1,
      sArcGeo2,
      sArcGeo3,
      sPinGeo,
      radialPinGeo,
      studioGlowGeo,
      studioGlowMat
    );

    let frameId = 0;
    let idleTimerId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let isInViewport = true;
    let currentPixelRatio = cap.pixelRatio;
    let lastTimeMs = performance.now();
    let lastFrameRenderMs = 0;
    let elapsedTotal = 0;
    let currentDampedProgress = sceneProgressRef.current;

    containerEl.dataset.inViewport = 'true';

    function pauseScheduledFrames() {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      clearTimeout(idleTimerId);
      renderBusy = false;
    }

    function afterDraw(cb: () => void) {
      if (disposed || !isInViewport) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed || !isInViewport) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepAndRender(nowMs: number): boolean {
      const rawDt = Math.min(Math.max((nowMs - lastTimeMs) / 1000, 0.001), 0.25);
      const dt = Math.min(rawDt, 0.08);
      lastTimeMs = nowMs;
      lastFrameRenderMs = nowMs;
      const isReduced = reducedMotionRef.current;
      if (!isReduced) {
        elapsedTotal += dt;
      }

      skyMat.uniforms.uTime.value = elapsedTotal;

      const targetProgress = sceneProgressRef.current;
      const prevProgress = currentDampedProgress;
      currentDampedProgress = isReduced
        ? targetProgress
        : THREE.MathUtils.damp(currentDampedProgress, targetProgress, 9.5, rawDt);

      const transitionActive = Math.abs(targetProgress - currentDampedProgress) > 0.002;
      if (!transitionActive) {
        currentDampedProgress = targetProgress;
      }

      const isMobile = containerEl.clientWidth < 768;
      const pose = interpolateStoryState(currentDampedProgress, isMobile);

      _targetCamPos.set(
        pose.cameraPosition.x,
        pose.cameraPosition.y,
        pose.cameraPosition.z
      );
      _targetLook.set(
        pose.cameraTarget.x,
        pose.cameraTarget.y,
        pose.cameraTarget.z
      );

      camera.position.copy(_targetCamPos);
      _lookTarget.copy(_targetLook);
      camera.lookAt(_lookTarget);

      // Cull distant landmarks so Hero & individual chapters only render nearby 3D subjects
      const camZ = camera.position.z;
      classAppGroup.visible = Math.abs(camZ - STORY_LANDMARK_POSITIONS.classapp.z) < 34;
      milkyPyGroup.visible = Math.abs(camZ - STORY_LANDMARK_POSITIONS.milkypy.z) < 34;
      aboutHalo.visible = Math.abs(camZ - -50.5) < 32;
      studioGroup.visible = Math.abs(camZ - STORY_LANDMARK_POSITIONS.studio.z) < 34;

      centralRig.group.visible = pose.jOpacity > 0.04;
      if (centralRig.group.visible) {
        _targetJPos.set(pose.jPosition.x, pose.jPosition.y, pose.jPosition.z);
        centralRig.group.position.copy(_targetJPos);
        centralRig.group.scale.setScalar(pose.jScale);
        centralRig.update(elapsedTotal, dt, isReduced);
        centralRig.group.position.y =
          pose.jPosition.y + (isReduced ? 0 : Math.sin(elapsedTotal * 0.55) * 0.065);
        centralRig.group.rotation.y =
          pose.jRotationY + (isReduced ? 0 : Math.sin(elapsedTotal * 0.25) * 0.08);
      }

      _targetColor.setHex(pose.accentHex);
      storyAccentLight.color.lerp(_targetColor, isReduced ? 1 : Math.min(dt * 5, 1));
      storyAccentLight.intensity = pose.accentIntensity * 0.85;
      storyAccentLight.position.set(
        camera.position.x + 2.5,
        camera.position.y + 1.4,
        camera.position.z - 4.5
      );

      if (!isReduced) {
        if (classAppGroup.visible) {
          classAppCore.rotation.y += dt * 0.1;
          classAppMoons.rotation.y += dt * 0.18;
        }
        if (milkyPyGroup.visible) {
          milkyCore.rotation.y -= dt * 0.14;
          milkyCore.rotation.x = Math.sin(elapsedTotal * 0.35) * 0.1;
          milkyShell.rotation.y += dt * 0.075;
          milkyShell.rotation.z = Math.cos(elapsedTotal * 0.25) * 0.08;
          milkyOrbitA.rotation.y += dt * 0.2;
        }
        if (studioGroup.visible) {
          studioKnot.rotation.y += dt * 0.12;
          studioAstrolabeGroup.rotation.y -= dt * 0.14;
        }
        if (aboutHalo.visible) {
          aboutHalo.rotation.z += dt * 0.04;
        }
        stars.rotation.z = elapsedTotal * 0.002;
      }

      renderer.render(scene, camera);

      return transitionActive || Math.abs(prevProgress - currentDampedProgress) > 0.001;
    }

    function requestRender() {
      if (disposed || document.hidden || !isInViewport) return;
      clearTimeout(idleTimerId);
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((nowMs) => {
        if (disposed || !isInViewport) {
          renderBusy = false;
          return;
        }
        renderDirty = false;
        const animating = stepAndRender(nowMs);

        const done = () => {
          renderBusy = false;
          if (disposed || document.hidden || !isInViewport) return;

          const pacing = getFramePacingConfig({
            isMobileViewport: containerEl.clientWidth < 768,
            isSoftwareGl,
          });

          if (renderDirty || animating) {
            if (!isSoftwareGl && pacing.activeMinIntervalMs > 0) {
              const sinceDraw = performance.now() - lastFrameRenderMs;
              const waitMs = Math.max(pacing.activeMinIntervalMs - sinceDraw, 0);
              if (waitMs > 4) {
                idleTimerId = window.setTimeout(requestRender, waitMs);
                return;
              }
            }
            requestRender();
          } else if (!isSoftwareGl && !reducedMotionRef.current) {
            // Pace idle ambient cosmos (~15fps on mobile, ~26fps on desktop)
            idleTimerId = window.setTimeout(requestRender, pacing.idleIntervalMs);
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    stageNotifyRef.current = requestRender;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const handleVisibility = () => {
      if (document.hidden) {
        pauseScheduledFrames();
      } else if (isInViewport) {
        lastTimeMs = performance.now();
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const latest = entries[entries.length - 1];
          if (!latest) return;
          const nowVisible = latest.isIntersecting;
          if (nowVisible === isInViewport) return;
          isInViewport = nowVisible;
          containerEl.dataset.inViewport = String(nowVisible);
          if (!nowVisible) {
            pauseScheduledFrames();
          } else if (!document.hidden) {
            lastTimeMs = performance.now();
            requestRender();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(containerEl);
    }

    let lastW = initW;
    let lastH = initH;
    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      const w = Math.max(containerEl.clientWidth, 320);
      const h = Math.max(containerEl.clientHeight, 320);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;

      const nextPixelRatio = computeRenderScale({
        isSoftwareGl,
        isConstrainedDevice: cap.isConstrainedDevice,
        isMobileViewport: w < 768,
        devicePixelRatio: window.devicePixelRatio || 1,
      });
      if (nextPixelRatio !== currentPixelRatio) {
        currentPixelRatio = nextPixelRatio;
        renderer.setPixelRatio(nextPixelRatio);
        starMat.uniforms.uPixelRatio.value = nextPixelRatio;
      }

      camera.fov = w < 640 ? 50 : 42;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isInViewport) {
        stepAndRender(performance.now());
      }
    });
    resizeObserver.observe(containerEl);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    stepAndRender(performance.now());
    requestRender();

    return () => {
      disposed = true;
      stageNotifyRef.current = null;
      pauseScheduledFrames();
      intersectionObserver?.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [sceneProgressRef, stageNotifyRef]);

  return (
    <div
      ref={containerRef}
      data-testid="story-universe-stage"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none bg-[#080B12] overflow-hidden"
    >
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full ${webglFailed ? 'invisible' : ''}`}
      />

      {webglFailed && (
        <div
          data-testid="universe-story-fallback"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_24%,rgba(146,134,216,0.22),transparent_56%),radial-gradient(ellipse_at_24%_78%,rgba(126,201,181,0.14),transparent_56%),#080B12]"
        >
          <svg
            viewBox="0 0 1200 800"
            className="w-full h-full opacity-25"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="880" cy="340" r="190" fill="none" stroke="#9286D8" strokeWidth="1" />
            <circle cx="880" cy="340" r="265" fill="none" stroke="#D3AC70" strokeWidth="0.75" strokeDasharray="4 8" />
            <circle cx="310" cy="560" r="140" fill="none" stroke="#7EC9B5" strokeWidth="0.8" />
          </svg>
        </div>
      )}
    </div>
  );
}
