import { AccentWorld, PlanetArchetype, UniverseDestination } from '../data/universeData';

export const COSMIC_PALETTE = {
  cosmicInk: 0x080b12,
  deepSpaceBlue: 0x101827,
  warmIvory: 0xf3f0e9,
  mutedUltraviolet: 0x9286d8,
  classAppLavender: 0xb9a2e6,
  milkyPyMint: 0x7ec9b5,
  ishizakiGold: 0xd3ac70,
  slateSteel: 0x262e40,
} as const;

export const UNIVERSE_ACCENT_HEX: Record<AccentWorld, number> = {
  ultraviolet: COSMIC_PALETTE.mutedUltraviolet,
  lavender: COSMIC_PALETTE.classAppLavender,
  mint: COSMIC_PALETTE.milkyPyMint,
  sand: COSMIC_PALETTE.ishizakiGold,
};

export const WORLD_RING_RADII: Record<1 | 2 | 3, number> = {
  1: 6.2,
  2: 10.4,
  3: 14.8,
};

export const WORLD_RING_TILTS: Record<1 | 2 | 3, { rx: number; rz: number }> = {
  1: { rx: 0.16, rz: -0.1 },
  2: { rx: -0.18, rz: 0.12 },
  3: { rx: 0.13, rz: 0.15 },
};

export interface Vec3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface CameraPose {
  position: Vec3Tuple;
  target: Vec3Tuple;
}

export interface WorldVisualSpec {
  planetRadius: number;
  ringRadius: number;
  position: Vec3Tuple;
  accentHex: number;
}

const ARCHETYPE_RADII: Record<PlanetArchetype, number> = {
  learning: 0.92,
  discovery: 0.88,
  creation: 0.9,
  origin: 0.78,
  pathway: 0.72,
  cluster: 0.84,
  archive: 0.66,
  horizon: 0.68,
};

export function getPlanetRadius(archetype: PlanetArchetype): number {
  return ARCHETYPE_RADII[archetype] ?? 0.75;
}

/**
 * Computes deterministic 3D orbital coordinates for a destination on its tilted orbital plane.
 */
export function computeWorldPosition3D(
  dest: Pick<UniverseDestination, 'orbitAngle' | 'orbitRing'>
): Vec3Tuple {
  const ringRadius = WORLD_RING_RADII[dest.orbitRing];
  const rad = (dest.orbitAngle * Math.PI) / 180;
  const tilt = WORLD_RING_TILTS[dest.orbitRing];

  const px = ringRadius * Math.cos(rad);
  const pz = ringRadius * Math.sin(rad);

  const y1 = -pz * Math.sin(tilt.rx);
  const z1 = pz * Math.cos(tilt.rx);

  const x2 = px * Math.cos(tilt.rz) - y1 * Math.sin(tilt.rz);
  const y2 = px * Math.sin(tilt.rz) + y1 * Math.cos(tilt.rz);

  return {
    x: Number(x2.toFixed(4)),
    y: Number(y2.toFixed(4)),
    z: Number(z1.toFixed(4)),
  };
}

export function buildWorldVisualSpec(dest: UniverseDestination): WorldVisualSpec {
  return {
    planetRadius: getPlanetRadius(dest.archetype),
    ringRadius: WORLD_RING_RADII[dest.orbitRing],
    position: computeWorldPosition3D(dest),
    accentHex: UNIVERSE_ACCENT_HEX[dest.accent],
  };
}

export function getArrivalCameraPose(isMobile: boolean): CameraPose {
  if (isMobile) {
    return {
      position: { x: 0.25, y: 0.35, z: 12.2 },
      target: { x: 0, y: -1.55, z: 0 },
    };
  }
  return {
    position: { x: 0.95, y: 1.4, z: 7.4 },
    target: { x: -1.45, y: -0.05, z: 0 },
  };
}

export function getOverviewCameraPose(isMobile: boolean): CameraPose {
  if (isMobile) {
    return {
      position: { x: 0, y: 34.0, z: 50.0 },
      target: { x: 0, y: -3.6, z: 0 },
    };
  }
  return {
    position: { x: 1.8, y: 15.8, z: 27.5 },
    target: { x: 0, y: -1.65, z: 0 },
  };
}

/**
 * Computes an asymmetric cinematic close-up camera pose framing the selected planet
 * away from the editorial story overlay (right-center on desktop, upper-center on mobile).
 */
export function getFocusedWorldCameraPose(
  worldPos: Vec3Tuple,
  planetRadius: number,
  isMobile: boolean
): CameraPose {
  const horizLen = Math.hypot(worldPos.x, worldPos.z) || 1;
  const outX = worldPos.x / horizLen;
  const outZ = worldPos.z / horizLen;
  // Tangent vector in XZ plane for 3/4 rim-lit phase angle
  const tanX = -outZ;
  const tanZ = outX;

  const dist = isMobile
    ? Math.max(planetRadius * 6.8, 5.4)
    : Math.max(planetRadius * 5.6, 4.6);
  const camX = worldPos.x + outX * dist * 0.82 + tanX * dist * 0.46;
  const camY = worldPos.y + planetRadius * 0.65;
  const camZ = worldPos.z + outZ * dist * 0.82 + tanZ * dist * 0.46;

  // Compute view forward and camera right vector so we can offset target cleanly
  const fwdX = worldPos.x - camX;
  const fwdY = worldPos.y - camY;
  const fwdZ = worldPos.z - camZ;
  const fwdLen = Math.hypot(fwdX, fwdY, fwdZ) || 1;
  const nx = fwdX / fwdLen;
  const ny = fwdY / fwdLen;
  const nz = fwdZ / fwdLen;

  // right = normalize(cross(forward, up(0,1,0))) = normalize(-nz, 0, nx)
  const rLen = Math.hypot(-nz, nx) || 1;
  const rx = -nz / rLen;
  const rz = nx / rLen;

  if (isMobile) {
    return {
      position: {
        x: Number(camX.toFixed(4)),
        y: Number(camY.toFixed(4)),
        z: Number(camZ.toFixed(4)),
      },
      target: {
        x: Number(worldPos.x.toFixed(4)),
        y: Number((worldPos.y - planetRadius * 1.75).toFixed(4)),
        z: Number(worldPos.z.toFixed(4)),
      },
    };
  }

  // Offset target left along camera right axis so planet appears cleanly on the right-center
  const offsetLeft = planetRadius * 1.65;
  return {
    position: {
      x: Number(camX.toFixed(4)),
      y: Number(camY.toFixed(4)),
      z: Number(camZ.toFixed(4)),
    },
    target: {
      x: Number((worldPos.x - rx * offsetLeft).toFixed(4)),
      y: Number((worldPos.y - ny * 0.05).toFixed(4)),
      z: Number((worldPos.z - rz * offsetLeft).toFixed(4)),
    },
  };
}
