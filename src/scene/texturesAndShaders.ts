import * as THREE from 'three';
import { PlanetArchetype } from '../data/universeData';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an anisotropic brushed-metal roughness texture for the central J. titanium sculpture.
 */
export function createBrushedMetalRoughnessMap(
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, 256, 256);
    const rng = mulberry32(9012);
    for (let y = 0; y < 256; y += 1) {
      const lum = Math.floor(62 + rng() * 58);
      ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
      ctx.fillRect(0, y, 256, 1);
    }
    for (let i = 0; i < 420; i += 1) {
      const x = rng() * 256;
      const y = rng() * 256;
      const w = 24 + rng() * 90;
      const lum = Math.floor(45 + rng() * 95);
      ctx.fillStyle = `rgba(${lum},${lum},${lum},0.35)`;
      ctx.fillRect(x, y, w, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Generates distinct planetary surface CanvasTextures per world archetype.
 * Zero external image dependencies.
 */
export function createPlanetSurfaceTexture(
  archetype: PlanetArchetype,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const w = 256;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  const rng = mulberry32(
    archetype.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 17)
  );

  if (archetype === 'learning') {
    // ClassApp: rich lavender atmospheric currents with calm warm-ivory bands
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#6F5CA8');
    grad.addColorStop(0.28, '#9D86D4');
    grad.addColorStop(0.5, '#C4B1EE');
    grad.addColorStop(0.75, '#8A73C4');
    grad.addColorStop(1, '#58478F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 42; i += 1) {
      const y = rng() * h;
      const bandH = 3 + rng() * 14;
      ctx.fillStyle =
        rng() > 0.45 ? 'rgba(243, 240, 233, 0.12)' : 'rgba(54, 39, 98, 0.16)';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, y, w * 0.65, bandH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Delicate meridian lines evoking connection & structured schedules
    ctx.strokeStyle = 'rgba(243, 240, 233, 0.14)';
    ctx.lineWidth = 1;
    for (let lat = 48; lat < h; lat += 40) {
      ctx.beginPath();
      ctx.moveTo(0, lat);
      ctx.bezierCurveTo(w * 0.33, lat - 6, w * 0.66, lat + 6, w, lat);
      ctx.stroke();
    }
  } else if (archetype === 'discovery') {
    // MilkyPy: mint & deep teal currents with constellation vertices
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1D5954');
    grad.addColorStop(0.32, '#479F8D');
    grad.addColorStop(0.55, '#86D6BF');
    grad.addColorStop(0.8, '#2F7D72');
    grad.addColorStop(1, '#143D3B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 36; i += 1) {
      const cx = rng() * w;
      const cy = rng() * h;
      const rx = 28 + rng() * 75;
      const ry = 10 + rng() * 26;
      ctx.fillStyle =
        rng() > 0.5 ? 'rgba(181, 229, 210, 0.14)' : 'rgba(12, 42, 46, 0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (rng() - 0.5) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Subtle luminous node network representing logic & code steps
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < 18; i += 1) {
      pts.push([30 + rng() * (w - 60), 30 + rng() * (h - 60)]);
    }
    ctx.strokeStyle = 'rgba(243, 240, 233, 0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length - 1; i += 2) {
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(243, 240, 233, 0.45)';
    for (const [px, py] of pts) {
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (archetype === 'creation') {
    // Ishizaki Tech Services: carved stone basalt & warm gold mineral strata
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#4E3F2C');
    grad.addColorStop(0.35, '#8A6F48');
    grad.addColorStop(0.55, '#D3AC70');
    grad.addColorStop(0.78, '#7A613E');
    grad.addColorStop(1, '#332A1F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 45; i += 1) {
      const y = rng() * h;
      ctx.strokeStyle =
        rng() > 0.55 ? 'rgba(243, 240, 233, 0.22)' : 'rgba(25, 20, 14, 0.28)';
      ctx.lineWidth = 1 + rng() * 3.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        w * 0.3,
        y + (rng() - 0.5) * 28,
        w * 0.7,
        y + (rng() - 0.5) * 28,
        w,
        y
      );
      ctx.stroke();
    }
  } else if (archetype === 'origin' || archetype === 'pathway') {
    // About Johnson & My Journey: obsidian-slate paired with muted ultraviolet & warm ivory
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1D2235');
    grad.addColorStop(0.35, '#4A437A');
    grad.addColorStop(0.58, '#9286D8');
    grad.addColorStop(0.8, '#2D314D');
    grad.addColorStop(1, '#131724');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 32; i += 1) {
      const x = rng() * w;
      const y = rng() * h;
      const r = 10 + rng() * 34;
      ctx.fillStyle =
        rng() > 0.5 ? 'rgba(243, 240, 233, 0.09)' : 'rgba(14, 18, 30, 0.22)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (archetype === 'archive') {
    // Journal: serene slate & warm ivory lunar paper grain
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#4E4B47');
    grad.addColorStop(0.45, '#9F978A');
    grad.addColorStop(0.75, '#D4CAB8');
    grad.addColorStop(1, '#3A3835');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 65; i += 1) {
      ctx.fillStyle =
        rng() > 0.5 ? 'rgba(243, 240, 233, 0.08)' : 'rgba(16, 24, 39, 0.14)';
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, 4 + rng() * 18, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Cluster (The Lab) & Horizon (Future Projects): brushed metallic mineral finish
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2B364C');
    grad.addColorStop(0.5, archetype === 'cluster' ? '#63A89A' : '#9E8EE0');
    grad.addColorStop(1, '#1A2233');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Custom GLSL deep-space sky dome with subtle painterly Deep Space Blue & Muted Ultraviolet atmospheric depth.
 */
export function createCosmicSkyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uCosmicInk: { value: new THREE.Color(0x080b12) },
      uDeepSpace: { value: new THREE.Color(0x101827) },
      uUltraviolet: { value: new THREE.Color(0x9286d8) },
      uGold: { value: new THREE.Color(0xd3ac70) },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uCosmicInk;
      uniform vec3 uDeepSpace;
      uniform vec3 uUltraviolet;
      uniform vec3 uGold;
      varying vec3 vWorldDir;

      void main() {
        vec3 d = normalize(vWorldDir);
        float horizon = smoothstep(-0.6, 0.7, d.y);
        vec3 base = mix(uCosmicInk, uDeepSpace, horizon * 0.65);

        // Analytical galactic nebula band without 3D hash loops
        float bandPlane = 1.0 - smoothstep(0.0, 0.58, abs(d.y * 0.85 - d.x * 0.38 + d.z * 0.22));
        float waveA = sin(d.x * 4.2 + uTime * 0.03) * cos(d.z * 3.8 - uTime * 0.02);
        float waveB = sin((d.y + d.x) * 6.5 - uTime * 0.02);
        float cloud = 0.5 + 0.32 * waveA + 0.18 * waveB;
        float wisp = smoothstep(0.38, 0.85, cloud) * bandPlane;

        vec3 col = base;
        col = mix(col, uDeepSpace * 1.4, wisp * 0.52);
        col += uUltraviolet * wisp * 0.09;
        col += uGold * smoothstep(0.66, 0.92, cloud) * bandPlane * 0.04;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

/**
 * Custom GLSL Fresnel atmospheric rim glow around celestial worlds.
 */
export function createAtmosphereMaterial(
  colorHex: number,
  intensity = 0.85
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uIntensity: { value: intensity },
      uFocusBoost: { value: 0.0 },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      void main() {
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uFocusBoost;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      void main() {
        vec3 viewDir = normalize(vViewPos);
        // BackSide normals point outward from center relative to view; edge rim is where dot approaches 0
        float rim = clamp(0.65 - abs(dot(vNormalView, viewDir)), 0.0, 1.0);
        float alpha = pow(rim, 2.3) * (uIntensity + uFocusBoost);
        gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 0.72));
      }
    `,
  });
}
