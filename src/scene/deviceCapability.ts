export interface RenderCapability {
  isSoftwareGl: boolean;
  isConstrainedDevice: boolean;
  isMobile: boolean;
  pixelRatio: number;
  enableBloom: boolean;
  enableShadows: boolean;
  starCount: number;
  moteCount: number;
  sphereSegments: number;
}

export interface RenderScaleInput {
  isSoftwareGl: boolean;
  isConstrainedDevice: boolean;
  isMobileViewport: boolean;
  devicePixelRatio: number;
}

export interface FramePacingConfig {
  activeMinIntervalMs: number;
  idleIntervalMs: number;
}

export function computeRenderScale({
  isSoftwareGl,
  isConstrainedDevice,
  isMobileViewport,
  devicePixelRatio,
}: RenderScaleInput): number {
  if (isMobileViewport) {
    // Reduce mobile backing resolution multiplier to lower fragment fill load on phone GPUs
    return 0.85;
  }
  if (isSoftwareGl || isConstrainedDevice) {
    return 1;
  }
  return Math.min(Math.max(devicePixelRatio || 1, 1), 1.25);
}

export function getFramePacingConfig({
  isMobileViewport,
  isSoftwareGl,
}: {
  isMobileViewport: boolean;
  isSoftwareGl: boolean;
}): FramePacingConfig {
  if (isMobileViewport) {
    // Target ~30fps max active scroll / ~15fps idle on mobile devices
    return {
      activeMinIntervalMs: isSoftwareGl ? 0 : 33,
      idleIntervalMs: 66,
    };
  }
  return {
    activeMinIntervalMs: 0,
    idleIntervalMs: 38,
  };
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
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const isConstrainedDevice =
    isSoftwareGl || saveData || lowMem || (lowCores && isMobile);

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const pixelRatio = computeRenderScale({
    isSoftwareGl,
    isConstrainedDevice,
    isMobileViewport: isMobile,
    devicePixelRatio: dpr,
  });

  return {
    isSoftwareGl,
    isConstrainedDevice,
    isMobile,
    pixelRatio,
    enableBloom: false,
    enableShadows: false,
    starCount: isSoftwareGl ? 320 : isConstrainedDevice || isMobile ? 400 : 540,
    moteCount: isSoftwareGl ? 14 : isConstrainedDevice || isMobile ? 16 : 24,
    sphereSegments: isSoftwareGl ? 16 : isConstrainedDevice || isMobile ? 20 : 24,
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
