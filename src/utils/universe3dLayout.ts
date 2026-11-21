import { AccentWorld, UniverseDestination } from '../data/universeData';

export interface OrbitalPosition3D {
  x: number;
  y: number;
  z: number;
  ringRadius: number;
}

export const RING_RADII_3D: Record<1 | 2 | 3, number> = {
  1: 3.1,
  2: 4.9,
  3: 6.7,
};

export const RING_TILTS_RAD: Record<1 | 2 | 3, { rx: number; rz: number }> = {
  1: { rx: 0.14, rz: -0.08 },
  2: { rx: -0.16, rz: 0.11 },
  3: { rx: 0.12, rz: 0.14 },
};

/**
 * Computes deterministic 3D orbital coordinates for a destination on its tilted orbital plane.
 */
export function computeOrbitalPosition3D(
  dest: Pick<UniverseDestination, 'orbitAngle' | 'orbitRing'>
): OrbitalPosition3D {
  const ringRadius = RING_RADII_3D[dest.orbitRing];
  const rad = (dest.orbitAngle * Math.PI) / 180;
  const tilt = RING_TILTS_RAD[dest.orbitRing];

  // Point on flat XZ circle
  const px = ringRadius * Math.cos(rad);
  const pz = ringRadius * Math.sin(rad);

  // Apply ring X and Z tilt (matching Three.js Euler XYZ order on ring meshes)
  // Rotate around X by rx: y1 = -pz * sin(rx), z1 = pz * cos(rx)
  const y1 = -pz * Math.sin(tilt.rx);
  const z1 = pz * Math.cos(tilt.rx);

  // Rotate around Z by rz: x2 = px * cos(rz) - y1 * sin(rz), y2 = px * sin(rz) + y1 * cos(rz)
  const x2 = px * Math.cos(tilt.rz) - y1 * Math.sin(tilt.rz);
  const y2 = px * Math.sin(tilt.rz) + y1 * Math.cos(tilt.rz);

  return {
    x: Number(x2.toFixed(4)),
    y: Number(y2.toFixed(4)),
    z: Number(z1.toFixed(4)),
    ringRadius,
  };
}

export interface Universe3dPalette {
  backgroundHex: number;
  fogHex: number;
  coreInkHex: number;
  ringHex: number;
  dustHex: number;
  accents: Record<AccentWorld, number>;
}

export function getUniverse3dPalette(theme: 'light' | 'dark'): Universe3dPalette {
  if (theme === 'dark') {
    return {
      backgroundHex: 0x111318,
      fogHex: 0x111318,
      coreInkHex: 0xf3f0e9,
      ringHex: 0x3b404e,
      dustHex: 0x9b98a6,
      accents: {
        ultraviolet: 0xa49aff,
        lavender: 0xd8c7f8,
        mint: 0xb5e5d2,
        sand: 0xebd3ae,
      },
    };
  }

  return {
    backgroundHex: 0xf3f0e9,
    fogHex: 0xf3f0e9,
    coreInkHex: 0x181b22,
    ringHex: 0xc2bdb2,
    dustHex: 0x6f6c66,
    accents: {
      ultraviolet: 0x5246d8,
      lavender: 0x6d48b8,
      mint: 0x167a5b,
      sand: 0x8a6024,
    },
  };
}
