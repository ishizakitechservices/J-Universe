import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIVERSE_DESTINATIONS } from '../data/universeData';
import {
  computeOrbitalPosition3D,
  getUniverse3dPalette,
  RING_RADII_3D,
} from './universe3dLayout';

test('computeOrbitalPosition3D places nodes on their exact 3D ring radius', () => {
  for (const dest of UNIVERSE_DESTINATIONS) {
    const pos = computeOrbitalPosition3D(dest);
    const distFromOrigin = Math.hypot(pos.x, pos.y, pos.z);
    const expectedRadius = RING_RADII_3D[dest.orbitRing];
    assert.ok(
      Math.abs(distFromOrigin - expectedRadius) < 0.01,
      `Expected ${dest.name} distance ${distFromOrigin} to match ${expectedRadius}`
    );
  }
});

test('computeOrbitalPosition3D creates real 3D elevation depth across nodes', () => {
  const ys = UNIVERSE_DESTINATIONS.map((d) => computeOrbitalPosition3D(d).y);
  const spread = Math.max(...ys) - Math.min(...ys);
  assert.ok(spread > 0.5, `Expected non-flat 3D Y spread, got ${spread}`);
});

test('getUniverse3dPalette returns distinct light and dark scene palettes', () => {
  const light = getUniverse3dPalette('light');
  const dark = getUniverse3dPalette('dark');

  assert.equal(light.backgroundHex, 0xf3f0e9);
  assert.equal(dark.backgroundHex, 0x111318);
  assert.notEqual(light.accents.ultraviolet, dark.accents.ultraviolet);
});
