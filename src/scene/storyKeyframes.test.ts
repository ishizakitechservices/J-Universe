import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORY_LANDMARK_POSITIONS,
  STORY_SCENES,
  computeStoryProgressFromOffsets,
  interpolateStoryState,
} from './storyKeyframes';

test('interpolateStoryState preserves clean bounds and monotonic forward travel along -Z', () => {
  const maxIdx = STORY_SCENES.length - 1;
  let prevZ = Infinity;

  for (let step = 0; step <= maxIdx; step += 1) {
    const pose = interpolateStoryState(step, false);
    assert.ok(
      pose.cameraPosition.z < prevZ,
      `Scene ${step} (${pose.activeSceneId}) camera Z (${pose.cameraPosition.z}) should advance forward past ${prevZ}`
    );
    prevZ = pose.cameraPosition.z;
    assert.ok(pose.jScale > 0);
  }
});

test('desktop keyframes position ClassApp opposite left text and MilkyPy opposite right text', () => {
  const classAppPose = interpolateStoryState(2, false);
  const milkyPyPose = interpolateStoryState(3, false);

  // Target shifted left (-x) pushes planet at x=0 to the right side of viewport
  assert.ok(classAppPose.cameraTarget.x < STORY_LANDMARK_POSITIONS.classapp.x);
  // Target shifted right (+x) pushes MilkyPy at x=0 to the left side of viewport
  assert.ok(milkyPyPose.cameraTarget.x > STORY_LANDMARK_POSITIONS.milkypy.x);
});

test('mobile keyframes center landmarks horizontally and frame them vertically above reading content', () => {
  const expectedTargetX: Record<number, number> = {
    0: 0,
    2: STORY_LANDMARK_POSITIONS.classapp.x,
    3: STORY_LANDMARK_POSITIONS.milkypy.x,
    5: STORY_LANDMARK_POSITIONS.studio.x,
    6: 0.55,
  };
  for (const idx of [0, 2, 3, 5, 6]) {
    const mobilePose = interpolateStoryState(idx, true);
    assert.equal(mobilePose.cameraTarget.x, expectedTargetX[idx]);
    assert.ok(mobilePose.cameraTarget.y < 0);
  }
});

test('computeStoryProgressFromOffsets maps scroll midpoints cleanly across chapters', () => {
  const centers = [450, 1350, 2250, 3150];
  assert.equal(computeStoryProgressFromOffsets(100, centers), 0);
  assert.equal(computeStoryProgressFromOffsets(900, centers), 0.5);
  assert.equal(computeStoryProgressFromOffsets(2250, centers), 2);
  assert.equal(computeStoryProgressFromOffsets(5000, centers), 3);
});
