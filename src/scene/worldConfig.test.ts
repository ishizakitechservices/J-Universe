import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIVERSE_DESTINATIONS } from '../data/universeData';
import {
  buildWorldVisualSpec,
  computeWorldPosition3D,
  COSMIC_PALETTE,
  getArrivalCameraPose,
  getFocusedWorldCameraPose,
  getOverviewCameraPose,
  WORLD_RING_RADII,
} from './worldConfig';

test('computeWorldPosition3D places all destinations on their exact 3D ring radius', () => {
  for (const dest of UNIVERSE_DESTINATIONS) {
    const pos = computeWorldPosition3D(dest);
    const dist = Math.hypot(pos.x, pos.y, pos.z);
    const expected = WORLD_RING_RADII[dest.orbitRing];
    assert.ok(
      Math.abs(dist - expected) < 0.01,
      `Expected ${dest.name} radius ${dist} to match ${expected}`
    );
  }
});

test('getFocusedWorldCameraPose frames planets clear of the editorial overlay on desktop and mobile', () => {
  const classApp = UNIVERSE_DESTINATIONS[0];
  const spec = buildWorldVisualSpec(classApp);

  const desktopFocus = getFocusedWorldCameraPose(spec.position, spec.planetRadius, false);
  const mobileFocus = getFocusedWorldCameraPose(spec.position, spec.planetRadius, true);

  const dDist = Math.hypot(
    desktopFocus.position.x - spec.position.x,
    desktopFocus.position.y - spec.position.y,
    desktopFocus.position.z - spec.position.z
  );
  assert.ok(dDist >= 3.2 && dDist <= 6.0, `Expected close-up distance, got ${dDist}`);

  // Mobile lowers target Y so the planet rests in the upper portion of the frame
  assert.ok(mobileFocus.target.y < spec.position.y);
});

test('arrival and overview poses keep safe distance from origin and match design tokens', () => {
  const arrival = getArrivalCameraPose(false);
  const overview = getOverviewCameraPose(false);

  const arrivalDist = Math.hypot(arrival.position.x, arrival.position.y, arrival.position.z);
  const overviewDist = Math.hypot(overview.position.x, overview.position.y, overview.position.z);

  assert.ok(overviewDist > arrivalDist * 2.5);
  assert.equal(COSMIC_PALETTE.cosmicInk, 0x080b12);
  assert.equal(COSMIC_PALETTE.ishizakiGold, 0xd3ac70);
});
