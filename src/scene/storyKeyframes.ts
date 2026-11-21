import { Vec3Tuple } from './worldConfig';

export type StorySceneId =
  | 'arrival'
  | 'what-i-do'
  | 'classapp'
  | 'milkypy'
  | 'about'
  | 'studio'
  | 'contact';

export interface StorySceneMeta {
  id: StorySceneId;
  chapter: string;
  label: string;
}

export const STORY_SCENES: StorySceneMeta[] = [
  { id: 'arrival', chapter: '01', label: 'Johnson' },
  { id: 'what-i-do', chapter: '02', label: 'What I Do' },
  { id: 'classapp', chapter: '03', label: 'ClassApp' },
  { id: 'milkypy', chapter: '04', label: 'MilkyPy' },
  { id: 'about', chapter: '05', label: 'About' },
  { id: 'studio', chapter: '06', label: 'Studio' },
  { id: 'contact', chapter: '07', label: 'Contact' },
];

export interface StoryKeyframe {
  id: StorySceneId;
  cameraPosition: Vec3Tuple;
  cameraTarget: Vec3Tuple;
  jPosition: Vec3Tuple;
  jScale: number;
  jRotationY: number;
  jOpacity: number;
  accentHex: number;
  accentIntensity: number;
}

export const STORY_LANDMARK_POSITIONS = {
  classapp: { x: 2.35, y: 0.15, z: -20 },
  milkypy: { x: -2.25, y: -0.05, z: -36 },
  studio: { x: 2.15, y: 0.1, z: -58 },
} as const;

const DESKTOP_KEYFRAMES: StoryKeyframe[] = [
  {
    id: 'arrival',
    cameraPosition: { x: 0.55, y: 0.85, z: 7.4 },
    cameraTarget: { x: -1.45, y: 0.0, z: 0 },
    jPosition: { x: 0.38, y: 0.05, z: 0 },
    jScale: 1.08,
    jRotationY: -0.24,
    jOpacity: 1.0,
    accentHex: 0x9286d8,
    accentIntensity: 1.35,
  },
  {
    id: 'what-i-do',
    cameraPosition: { x: -1.1, y: 1.55, z: -2.5 },
    cameraTarget: { x: 0.75, y: 0.15, z: -11.0 },
    jPosition: { x: 2.35, y: 0.55, z: -6.8 },
    jScale: 0.68,
    jRotationY: 0.55,
    jOpacity: 0.88,
    accentHex: 0x9286d8,
    accentIntensity: 1.1,
  },
  {
    id: 'classapp',
    // Copy sits on the left -> frame ClassApp lavender world centered cleanly in the right half
    cameraPosition: { x: 0.25, y: 0.65, z: -11.2 },
    cameraTarget: { x: 0.45, y: 0.1, z: -20.0 },
    jPosition: { x: 4.8, y: 2.6, z: 2.0 },
    jScale: 0.35,
    jRotationY: 0.9,
    jOpacity: 0.0,
    accentHex: 0xb9a2e6,
    accentIntensity: 1.55,
  },
  {
    id: 'milkypy',
    // Copy sits on the right -> frame MilkyPy mint crystalline sanctuary centered cleanly in the left half
    cameraPosition: { x: -0.1, y: 0.65, z: -27.2 },
    cameraTarget: { x: -0.35, y: 0.0, z: -36.0 },
    jPosition: { x: -4.8, y: 2.6, z: -12.0 },
    jScale: 0.35,
    jRotationY: -0.4,
    jOpacity: 0.0,
    accentHex: 0x7ec9b5,
    accentIntensity: 1.6,
  },
  {
    id: 'about',
    // Quiet intimate cosmos with soft horizon depth
    cameraPosition: { x: -0.75, y: 0.9, z: -41.5 },
    cameraTarget: { x: 0.35, y: 0.2, z: -49.0 },
    jPosition: { x: 2.6, y: 0.2, z: -64.5 },
    jScale: 0.45,
    jRotationY: -0.3,
    jOpacity: 0.25,
    accentHex: 0x9286d8,
    accentIntensity: 0.85,
  },
  {
    id: 'studio',
    // Copy sits on the left -> frame Ishizaki Tech Services gold astrolabe sculpture cleanly in the right half
    cameraPosition: { x: 0.1, y: 0.75, z: -49.0 },
    cameraTarget: { x: 0.35, y: 0.05, z: -58.0 },
    jPosition: { x: 2.6, y: 0.15, z: -64.5 },
    jScale: 0.5,
    jRotationY: -0.28,
    jOpacity: 0.3,
    accentHex: 0xd3ac70,
    accentIntensity: 1.7,
  },
  {
    id: 'contact',
    // Quiet cosmic horizon + small resolved J. beside contact message
    cameraPosition: { x: 0.75, y: 0.45, z: -60.5 },
    cameraTarget: { x: -1.05, y: 0.05, z: -66.5 },
    jPosition: { x: 0.55, y: 0.1, z: -65.5 },
    jScale: 0.58,
    jRotationY: -0.2,
    jOpacity: 1.0,
    accentHex: 0xd3ac70,
    accentIntensity: 1.25,
  },
];

const MOBILE_KEYFRAMES: StoryKeyframe[] = [
  {
    id: 'arrival',
    cameraPosition: { x: 0.1, y: -0.2, z: 10.6 },
    cameraTarget: { x: 0, y: -1.5, z: 0 },
    jPosition: { x: 0, y: 0.25, z: 0 },
    jScale: 0.92,
    jRotationY: -0.18,
    jOpacity: 1.0,
    accentHex: 0x9286d8,
    accentIntensity: 1.35,
  },
  {
    id: 'what-i-do',
    cameraPosition: { x: 0, y: 1.45, z: -2.8 },
    cameraTarget: { x: 0, y: -0.35, z: -11.5 },
    jPosition: { x: 0, y: 1.15, z: -7.5 },
    jScale: 0.62,
    jRotationY: 0.45,
    jOpacity: 0.85,
    accentHex: 0x9286d8,
    accentIntensity: 1.1,
  },
  {
    id: 'classapp',
    cameraPosition: { x: 2.35, y: 0.45, z: -11.2 },
    cameraTarget: { x: 2.35, y: -1.55, z: -20.0 },
    jPosition: { x: 2.35, y: 2.6, z: 2.0 },
    jScale: 0.35,
    jRotationY: 0.8,
    jOpacity: 0.0,
    accentHex: 0xb9a2e6,
    accentIntensity: 1.45,
  },
  {
    id: 'milkypy',
    cameraPosition: { x: -2.25, y: 0.3, z: -27.0 },
    cameraTarget: { x: -2.25, y: -1.6, z: -36.0 },
    jPosition: { x: -2.25, y: 2.4, z: -12.0 },
    jScale: 0.35,
    jRotationY: -0.3,
    jOpacity: 0.0,
    accentHex: 0x7ec9b5,
    accentIntensity: 1.45,
  },
  {
    id: 'about',
    cameraPosition: { x: 0, y: 0.75, z: -41.5 },
    cameraTarget: { x: 0, y: -0.25, z: -49.0 },
    jPosition: { x: 0.5, y: 0.9, z: -65.5 },
    jScale: 0.42,
    jRotationY: -0.25,
    jOpacity: 0.2,
    accentHex: 0x9286d8,
    accentIntensity: 0.85,
  },
  {
    id: 'studio',
    cameraPosition: { x: 2.15, y: 0.4, z: -49.8 },
    cameraTarget: { x: 2.15, y: -1.55, z: -58.0 },
    jPosition: { x: 2.15, y: 0.95, z: -65.5 },
    jScale: 0.46,
    jRotationY: -0.22,
    jOpacity: 0.3,
    accentHex: 0xd3ac70,
    accentIntensity: 1.5,
  },
  {
    id: 'contact',
    cameraPosition: { x: 0.55, y: -0.15, z: -60.5 },
    cameraTarget: { x: 0.55, y: -1.2, z: -66.5 },
    jPosition: { x: 0.55, y: 0.8, z: -65.5 },
    jScale: 0.5,
    jRotationY: -0.18,
    jOpacity: 1.0,
    accentHex: 0xd3ac70,
    accentIntensity: 1.1,
  },
];

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function smoothstep01(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3Tuple, b: Vec3Tuple, t: number): Vec3Tuple {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
  };
}

function lerpHexColor(hexA: number, hexB: number, t: number): number {
  const ar = (hexA >> 16) & 255;
  const ag = (hexA >> 8) & 255;
  const ab = hexA & 255;
  const br = (hexB >> 16) & 255;
  const bg = (hexB >> 8) & 255;
  const bb = hexB & 255;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const b = Math.round(lerp(ab, bb, t));
  return (r << 16) | (g << 8) | b;
}

export interface InterpolatedStoryPose {
  activeSceneId: StorySceneId;
  activeSceneIndex: number;
  cameraPosition: Vec3Tuple;
  cameraTarget: Vec3Tuple;
  jPosition: Vec3Tuple;
  jScale: number;
  jRotationY: number;
  jOpacity: number;
  accentHex: number;
  accentIntensity: number;
}

/**
 * Given a continuous normalized scene progress across [0, STORY_SCENES.length - 1],
 * returns the smooth eased 3D camera, sculptural J, and accent lighting composition.
 */
export function interpolateStoryState(
  sceneProgress: number,
  isMobile: boolean
): InterpolatedStoryPose {
  const frames = isMobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES;
  const maxIndex = frames.length - 1;
  const clamped = clamp(sceneProgress, 0, maxIndex);
  const idxA = Math.floor(clamped);
  const idxB = Math.min(idxA + 1, maxIndex);
  const localT = smoothstep01(clamped - idxA);

  const a = frames[idxA];
  const b = frames[idxB];
  const activeIndex = Math.round(clamped);

  return {
    activeSceneId: frames[activeIndex].id,
    activeSceneIndex: activeIndex,
    cameraPosition: lerpVec3(a.cameraPosition, b.cameraPosition, localT),
    cameraTarget: lerpVec3(a.cameraTarget, b.cameraTarget, localT),
    jPosition: lerpVec3(a.jPosition, b.jPosition, localT),
    jScale: lerp(a.jScale, b.jScale, localT),
    jRotationY: lerp(a.jRotationY, b.jRotationY, localT),
    jOpacity: lerp(a.jOpacity, b.jOpacity, localT),
    accentHex: lerpHexColor(a.accentHex, b.accentHex, localT),
    accentIntensity: lerp(a.accentIntensity, b.accentIntensity, localT),
  };
}

/**
 * Computes continuous scene progress [0, sectionCenters.length - 1] from scroll center Y
 * against an array of viewport-relative or document-absolute section center Y coordinates.
 */
export function computeStoryProgressFromOffsets(
  viewportCenterY: number,
  sectionCenters: number[]
): number {
  if (sectionCenters.length <= 1) return 0;
  if (viewportCenterY <= sectionCenters[0]) return 0;
  const lastIdx = sectionCenters.length - 1;
  if (viewportCenterY >= sectionCenters[lastIdx]) return lastIdx;

  for (let i = 0; i < lastIdx; i += 1) {
    const start = sectionCenters[i];
    const end = sectionCenters[i + 1];
    if (viewportCenterY >= start && viewportCenterY <= end) {
      const span = Math.max(end - start, 1);
      return i + (viewportCenterY - start) / span;
    }
  }
  return 0;
}
