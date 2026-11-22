import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { UNIVERSE_DESTINATIONS, UniverseDestination } from '../data/universeData';
import {
  CameraPose,
  COSMIC_PALETTE,
  getArrivalCameraPose,
  getFocusedWorldCameraPose,
  getOverviewCameraPose,
} from './worldConfig';
import { createCosmicSkyMaterial } from './texturesAndShaders';
import { createCentralJSculpture } from './centralCore';
import { detectRenderCapability } from './deviceCapability';
import { CelestialWorldRig, createCelestialWorld } from './planets';

export type UniverseViewPhase = 'arrival' | 'overview' | 'focused';

interface UniverseStageProps {
  viewPhase: UniverseViewPhase;
  selectedId: string | null;
  reducedMotion: boolean;
  onSelectWorld: (id: string) => void;
  onManualExplore: () => void;
}

const _projVec = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyColor = new THREE.Color();

export function UniverseStage({
  viewPhase,
  selectedId,
  reducedMotion,
  onSelectWorld,
  onManualExplore,
}: UniverseStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const viewPhaseRef = useRef(viewPhase);
  viewPhaseRef.current = viewPhase;

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const onSelectWorldRef = useRef(onSelectWorld);
  onSelectWorldRef.current = onSelectWorld;

  const onManualExploreRef = useRef(onManualExplore);
  onManualExploreRef.current = onManualExplore;

  const [webglFailed, setWebglFailed] = useState(false);

  const stageApiRef = useRef<{
    flyToTarget: (instant?: boolean) => void;
    requestRender: () => void;
  } | null>(null);

  // Trigger smooth camera choreography when phase, selection, or motion preference changes
  useEffect(() => {
    stageApiRef.current?.flyToTarget(reducedMotion);
  }, [viewPhase, selectedId, reducedMotion]);

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
    scene.fog = new THREE.FogExp2(COSMIC_PALETTE.cosmicInk, 0.011);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const initialMobile = initW < 768;
    const camera = new THREE.PerspectiveCamera(
      initW < 640 ? 54 : 44,
      initW / initH,
      0.1,
      160
    );
    const initPose = getArrivalCameraPose(initialMobile);
    camera.position.set(
      initPose.position.x,
      initPose.position.y,
      initPose.position.z
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.85;
    controls.minDistance = 2.6;
    controls.maxDistance = 42;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.target.set(initPose.target.x, initPose.target.y, initPose.target.z);
    controls.update();

    // Streamlined celestial studio lighting (Hemi + Key + Warm Fill)
    const hemiLight = new THREE.HemisphereLight(
      0xb2c8ee,
      COSMIC_PALETTE.cosmicInk,
      1.15
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.15);
    keyLight.position.set(14, 18, 12);
    scene.add(keyLight);

    const accentWarmFill = new THREE.PointLight(
      COSMIC_PALETTE.ishizakiGold,
      1.4,
      26,
      1.6
    );
    accentWarmFill.position.set(3.5, -2.5, 4.5);
    scene.add(accentWarmFill);

    const disposables: Array<{ dispose: () => void }> = [envTarget];

    // 1. Deep Cosmic Sky Dome
    const skyGeo = new THREE.SphereGeometry(95, 20, 14);
    const skyMat = createCosmicSkyMaterial();
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);
    disposables.push(skyGeo, skyMat);

    // 2. Distant Layered Starfield (crisp anti-aliased circular stars via custom ShaderMaterial)
    const starCount = cap.starCount;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const paletteChoices = [
      new THREE.Color(COSMIC_PALETTE.warmIvory),
      new THREE.Color(0xc2d2f0),
      new THREE.Color(COSMIC_PALETTE.ishizakiGold),
      new THREE.Color(COSMIC_PALETTE.classAppLavender),
    ];

    for (let i = 0; i < starCount; i += 1) {
      // Deterministic golden-sphere scatter for reproducible composition
      const u = ((i * 7919) % 10000) / 10000;
      const v = ((i * 6271) % 10000) / 10000;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const radius = 36 + ((i * 41) % 44);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const cIdx = i % 11 === 0 ? 2 : i % 7 === 0 ? 3 : i % 3 === 0 ? 1 : 0;
      const c = paletteChoices[cIdx];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
      starSizes[i] = i % 19 === 0 ? 3.2 : i % 5 === 0 ? 2.1 : 1.3;
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
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        uniform float uPixelRatio;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (46.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.05, dist) * 0.9;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    // 3. Mid-field Instanced Cosmic Motes for 3D parallax depth
    const moteCount = cap.moteCount;
    const moteGeo = new THREE.OctahedronGeometry(0.04, 0);
    const moteMat = new THREE.MeshStandardMaterial({
      color: COSMIC_PALETTE.warmIvory,
      roughness: 0.35,
      metalness: 0.4,
      transparent: true,
      opacity: 0.55,
    });
    const moteMesh = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    for (let i = 0; i < moteCount; i += 1) {
      const a = i * 2.399963;
      const rad = 4.2 + ((i * 29) % 140) * 0.12;
      const y = (((i * 17) % 36) - 18) * 0.25;
      _dummyPos.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
      const s = 0.65 + ((i * 11) % 8) * 0.08;
      _dummyScale.setScalar(s);
      _dummyQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.5);
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

    // 4. Central Sculptural J. Monogram
    const centralRig = createCentralJSculpture(maxAnisotropy);
    scene.add(centralRig.group);
    disposables.push(centralRig);

    // 5. Data-Driven Celestial Worlds
    const worldRigs: CelestialWorldRig[] = [];
    const hitTargets: THREE.Object3D[] = [];
    const addedRingIndices = new Set<number>();

    UNIVERSE_DESTINATIONS.forEach((dest: UniverseDestination) => {
      const rig = createCelestialWorld(dest, maxAnisotropy, isSoftwareGl, cap.sphereSegments);
      scene.add(rig.group);
      // Avoid duplicating identical orbital ring loops per tier
      if (!addedRingIndices.has(dest.orbitRing)) {
        scene.add(rig.orbitLine);
        addedRingIndices.add(dest.orbitRing);
      }
      worldRigs.push(rig);
      hitTargets.push(rig.hitProxy);
      disposables.push(rig);
    });

    // Camera transition state
    let desiredCamPos = camera.position.clone();
    let desiredTarget = controls.target.clone();
    let isCameraTransitioning = false;
    let hoveredId: string | null = null;

    function computePoseForState(): CameraPose {
      const mobile = containerEl.clientWidth < 768;
      const phase = viewPhaseRef.current;
      const selId = selectedIdRef.current;

      if (phase === 'arrival') {
        return getArrivalCameraPose(mobile);
      }
      if (phase === 'focused' && selId) {
        const rig = worldRigs.find((w) => w.dest.id === selId);
        if (rig) {
          return getFocusedWorldCameraPose(
            { x: rig.position.x, y: rig.position.y, z: rig.position.z },
            rig.radius,
            mobile
          );
        }
      }
      return getOverviewCameraPose(mobile);
    }

    function projectWorldLabels() {
      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;
      const phase = viewPhaseRef.current;
      const selId = selectedIdRef.current;

      for (const rig of worldRigs) {
        const btn = labelRefs.current[rig.dest.id];
        if (!btn) continue;

        // Keep Arrival state pure and unobstructed; only show all projected labels in Overview
        const showLabel =
          phase === 'overview' || (phase === 'focused' && rig.dest.id === selId);
        if (!showLabel) {
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
          continue;
        }

        _projVec.copy(rig.group.position);
        _projVec.y += rig.radius + 0.42;
        _projVec.project(camera);

        const inFront = _projVec.z >= -1 && _projVec.z <= 1;
        if (!inFront) {
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
          continue;
        }

        const rawX = ((_projVec.x + 1) / 2) * width;
        const rawY = ((-_projVec.y + 1) / 2) * height;
        const halfW = (btn.offsetWidth || 108) / 2;
        const btnH = btn.offsetHeight || 28;

        // Safe viewport bounds clear of top floating header (80px) and bottom dock (112px)
        const xPx = Math.min(Math.max(rawX, halfW + 16), width - halfW - 16);
        const yPx = Math.min(Math.max(rawY, btnH + 78), height - 112);

        btn.style.opacity = phase === 'focused' ? '0' : '1';
        btn.style.pointerEvents = phase === 'overview' ? 'auto' : 'none';
        btn.style.transform = `translate3d(${xPx.toFixed(1)}px, ${yPx.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    }

    // Frame scheduling (full-rate during camera flight/drag; quiet ~25fps idle; on-demand on Software WebGL)
    let frameId = 0;
    let idleTimerId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTimeMs = performance.now();
    let elapsedTotal = 0;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
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
      const dt = Math.min(Math.max((nowMs - lastTimeMs) / 1000, 0.001), 0.08);
      lastTimeMs = nowMs;
      const isReduced = reducedMotionRef.current;
      if (!isReduced) {
        elapsedTotal += dt;
      }

      skyMat.uniforms.uTime.value = elapsedTotal;

      // Smooth camera flight interpolation
      let stillAnimating = false;
      if (isCameraTransitioning) {
        const lambda = isReduced ? 60 : 4.2;
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          desiredCamPos.x,
          lambda,
          dt
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          desiredCamPos.y,
          lambda,
          dt
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          desiredCamPos.z,
          lambda,
          dt
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          desiredTarget.x,
          lambda,
          dt
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          desiredTarget.y,
          lambda,
          dt
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          desiredTarget.z,
          lambda,
          dt
        );

        const posRem = camera.position.distanceTo(desiredCamPos);
        const tgtRem = controls.target.distanceTo(desiredTarget);
        if (isReduced || (posRem < 0.025 && tgtRem < 0.025)) {
          camera.position.copy(desiredCamPos);
          controls.target.copy(desiredTarget);
          isCameraTransitioning = false;
        } else {
          stillAnimating = true;
        }
      }

      centralRig.update(elapsedTotal, dt, isReduced);

      const selId = selectedIdRef.current;
      const focusedMode = viewPhaseRef.current === 'focused';
      for (const rig of worldRigs) {
        rig.update(
          elapsedTotal,
          dt,
          focusedMode && rig.dest.id === selId,
          hoveredId === rig.dest.id,
          isReduced
        );
      }

      if (!isReduced) {
        stars.rotation.y = elapsedTotal * 0.004;
      }

      const controlsDamping = controls.update();
      if (controlsDamping && !isSoftwareGl) {
        stillAnimating = true;
      }

      renderer.render(scene, camera);

      projectWorldLabels();
      return stillAnimating;
    }

    function requestRender() {
      if (disposed || document.hidden) return;
      clearTimeout(idleTimerId);
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((nowMs) => {
        if (disposed) return;
        renderDirty = false;
        const transitionActive = stepAndRender(nowMs);

        const done = () => {
          renderBusy = false;
          if (disposed || document.hidden) return;
          if (renderDirty || transitionActive) {
            requestRender();
          } else if (!isSoftwareGl && !reducedMotionRef.current) {
            idleTimerId = window.setTimeout(requestRender, 38);
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    stageApiRef.current = {
      flyToTarget(instant = false) {
        const pose = computePoseForState();
        desiredCamPos.set(pose.position.x, pose.position.y, pose.position.z);
        desiredTarget.set(pose.target.x, pose.target.y, pose.target.z);
        if (instant) {
          camera.position.copy(desiredCamPos);
          controls.target.copy(desiredTarget);
          isCameraTransitioning = false;
        } else {
          isCameraTransitioning = true;
        }
        requestRender();
      },
      requestRender,
    };

    // Controls events
    const handleControlsStart = () => {
      isCameraTransitioning = false;
      if (viewPhaseRef.current === 'arrival') {
        onManualExploreRef.current();
      }
    };
    const handleControlsChange = () => requestRender();
    controls.addEventListener('start', handleControlsStart);
    controls.addEventListener('change', handleControlsChange);

    // Raycast hover + click on Layer 1 hit proxies
    _raycaster.layers.set(1);

    function updatePointer(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    let downX = 0;
    let downY = 0;
    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 7) return;
      updatePointer(e.clientX, e.clientY);
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const destId = hits[0].object.userData.destId as string | undefined;
        if (destId) {
          onSelectWorldRef.current(destId);
        }
      }
    };

    let lastHoverTs = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTs < 48) return;
      lastHoverTs = now;
      updatePointer(e.clientX, e.clientY);
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(hitTargets, false);
      const nextHover =
        hits.length > 0
          ? ((hits[0].object.userData.destId as string | undefined) ?? null)
          : null;
      if (nextHover !== hoveredId) {
        hoveredId = nextHover;
        renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'grab';
        requestRender();
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    const handleVisibility = () => {
      if (!document.hidden) {
        lastTimeMs = performance.now();
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let lastW = initW;
    let lastH = initH;
    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      const w = Math.max(containerEl.clientWidth, 320);
      const h = Math.max(containerEl.clientHeight, 320);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      camera.fov = w < 640 ? 54 : 44;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      stepAndRender(performance.now());
    });
    resizeObserver.observe(containerEl);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Apply initial pose accurately and render
    stageApiRef.current.flyToTarget(true);

    return () => {
      disposed = true;
      stageApiRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      clearTimeout(idleTimerId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('change', handleControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="universe-stage"
      data-phase={viewPhase}
      data-selected-world={selectedId ?? ''}
      className="relative w-full h-full bg-[#080B12] overflow-hidden select-none"
    >
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full ${webglFailed ? 'invisible' : ''}`}
      />

      {/* Semantic Projected HTML World Labels (Overview mode only; no backdrop-blur over WebGL) */}
      {!webglFailed && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {UNIVERSE_DESTINATIONS.map((dest) => (
            <button
              key={dest.id}
              ref={(el) => {
                labelRefs.current[dest.id] = el;
              }}
              type="button"
              onClick={() => onSelectWorld(dest.id)}
              style={{ left: 0, top: 0, opacity: 0 }}
              className="absolute px-2.5 py-1 rounded-md bg-[#080B12]/85 border border-[#F3F0E9]/18 text-[#F3F0E9] hover:border-[#F3F0E9]/55 text-xs font-medium tracking-tight whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#9286D8]"
            >
              {dest.shortLabel}
            </button>
          ))}
        </div>
      )}

      {/* WebGL Failure / Context-Loss Graceful Fallback */}
      {webglFailed && (
        <div
          data-testid="universe-3d-fallback"
          className={`absolute inset-0 z-10 bg-[#080B12] flex flex-col justify-center px-6 sm:px-10 pointer-events-auto ${
            viewPhase === 'arrival'
              ? 'items-center sm:items-end text-center sm:text-left pb-60 sm:pb-0'
              : 'items-center text-center'
          }`}
        >
          <div className="max-w-md space-y-4 rounded-2xl border border-[#F3F0E9]/14 bg-[#101827] p-6">
            <p className="font-mono text-xs text-[#9286D8]">J/UNIVERSE</p>
            <h2 className="font-display text-2xl font-bold text-[#F3F0E9]">
              3D acceleration is unavailable right now
            </h2>
            <p className="text-sm text-[#A9B1C2] leading-relaxed">
              You can still explore ClassApp, MilkyPy, Ishizaki Tech Services, and every destination below.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
              {UNIVERSE_DESTINATIONS.slice(0, 4).map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => onSelectWorld(dest.id)}
                  className="px-3 py-1.5 rounded-lg border border-[#F3F0E9]/16 bg-[#080B12] text-xs font-medium text-[#F3F0E9] hover:border-[#9286D8] transition-colors whitespace-nowrap"
                >
                  {dest.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
