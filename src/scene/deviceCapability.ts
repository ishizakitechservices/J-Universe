export interface RenderCapability {
  isSoftwareGl: boolean;
  isConstrainedDevice: boolean;
  pixelRatio: number;
  enableBloom: boolean;
  enableShadows: boolean;
  starCount: number;
  moteCount: number;
  sphereSegments: number;
}

export function detectRenderCapability(): RenderCapability {
  let isSoftwareGl = false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      isSoftwareGl = true;
    } else {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    }
  } catch {
    isSoftwareGl = true;
  }

  const nav =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & {
          deviceMemory?: number;
          connection?: { saveData?: boolean };
        })
      : null;

  const lowCores =
    typeof nav?.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMem =
    typeof nav?.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const saveData = Boolean(nav?.connection?.saveData);
  const narrowScreen =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const isConstrainedDevice =
    isSoftwareGl || saveData || lowMem || (lowCores && narrowScreen);

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  return {
    isSoftwareGl,
    isConstrainedDevice,
    pixelRatio:
      isSoftwareGl || isConstrainedDevice ? 1 : Math.min(dpr, 1.25),
    enableBloom: false,
    enableShadows: false,
    starCount: isSoftwareGl ? 320 : isConstrainedDevice ? 420 : 540,
    moteCount: isSoftwareGl ? 14 : isConstrainedDevice ? 18 : 24,
    sphereSegments: isSoftwareGl ? 16 : isConstrainedDevice ? 20 : 24,
  };
}

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function subscribeReducedMotion(onChange: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listener = (e: MediaQueryListEvent) => onChange(e.matches);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}
