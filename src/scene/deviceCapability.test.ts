import test from 'node:test';
import assert from 'node:assert/strict';
import { computeRenderScale, getFramePacingConfig } from './deviceCapability';
import { buildLowResPlaceholderDataUri } from '../utils/imagePlaceholder';

test('computeRenderScale lowers resolution multiplier on mobile devices', () => {
  const mobileScale = computeRenderScale({
    isSoftwareGl: false,
    isConstrainedDevice: false,
    isMobileViewport: true,
    devicePixelRatio: 3,
  });
  const desktopScale = computeRenderScale({
    isSoftwareGl: false,
    isConstrainedDevice: false,
    isMobileViewport: false,
    devicePixelRatio: 2,
  });

  assert.equal(mobileScale < 1, true);
  assert.equal(mobileScale < desktopScale, true);
  assert.equal(desktopScale, 1.25);
});

test('getFramePacingConfig reduces active and idle frame rate on mobile', () => {
  const mobilePacing = getFramePacingConfig({
    isMobileViewport: true,
    isSoftwareGl: false,
  });
  const desktopPacing = getFramePacingConfig({
    isMobileViewport: false,
    isSoftwareGl: false,
  });

  assert.equal(mobilePacing.activeMinIntervalMs >= 30, true);
  assert.equal(mobilePacing.idleIntervalMs > desktopPacing.idleIntervalMs, true);
  assert.equal(desktopPacing.activeMinIntervalMs, 0);
});

test('buildLowResPlaceholderDataUri emits compact accent-tinted SVG data URIs', () => {
  const classAppUri = buildLowResPlaceholderDataUri('lavender');
  const milkyPyUri = buildLowResPlaceholderDataUri('mint');

  assert.equal(classAppUri.startsWith('data:image/svg+xml;charset=utf-8,'), true);
  assert.equal(milkyPyUri.startsWith('data:image/svg+xml;charset=utf-8,'), true);
  assert.notEqual(classAppUri, milkyPyUri);
});
