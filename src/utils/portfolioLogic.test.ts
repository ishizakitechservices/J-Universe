import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONFIRMED_ACHIEVEMENTS,
  CONFIRMED_SKILLS,
  JOURNAL_ENTRIES,
  JOURNEY_MILESTONES,
  ORIGIN_STORY_SECTIONS,
  PROJECTS,
  SITE_IDENTITY,
  UNIVERSE_DESTINATIONS,
  ProjectItem,
} from '../data/universeData';
import {
  formatContactDraft,
  formatContactSubject,
  isAllowedWebhookUrl,
} from './contactSubmission';
import {
  buildMailtoHref,
  filterProjects,
  getRelatedProjects,
  resolveRouteMeta,
  runMilkyPyLesson,
  searchUniverse,
  validateContactForm,
} from './portfolioLogic';

test('official source-of-truth enforces confirmed facts and omits unconfirmed content', () => {
  assert.equal(SITE_IDENTITY.owner, 'Johnson Bediako Ametsitsi');
  assert.equal(SITE_IDENTITY.location, 'Ghana');
  assert.equal(SITE_IDENTITY.email, 'ishizakitechservices@gmail.com');
  assert.equal(SITE_IDENTITY.social.xHandle, '@ishizakitech');
  assert.equal(SITE_IDENTITY.social.xUrl, 'https://x.com/ishizakitech');
  assert.equal(SITE_IDENTITY.social.xProfileUrlVerified, true);

  const classApp = PROJECTS.find((p) => p.slug === 'classapp')!;
  assert.equal(classApp.status, 'Prototype');
  assert.equal(classApp.liveUrl, 'https://classapp-rbci.onrender.com/');
  assert.equal(classApp.primaryActionLabel, 'View Prototype');
  assert.deepEqual(
    classApp.storyChapters?.map((c) => c.shortLabel),
    ['Dashboard', 'Classes', 'Vault', 'Adom AI']
  );
  assert.equal(
    classApp.features.some((f) => f.provenance === 'IMPLEMENTED IN PRO BUILD'),
    true
  );
  assert.equal(
    classApp.features.some((f) => f.provenance === 'DOCUMENTED BY PUBLIC PRODUCT'),
    true
  );

  const milkyPy = PROJECTS.find((p) => p.slug === 'milkypy')!;
  assert.equal(milkyPy.status, 'Live');
  assert.equal(milkyPy.liveUrl, 'https://milkypy.com/');
  assert.equal(milkyPy.primaryActionLabel, 'Visit MilkyPy');
  assert.deepEqual(
    milkyPy.storyChapters?.map((c) => c.shortLabel),
    ['Learn', 'Practice', 'Quiz', 'Play']
  );

  assert.equal(JOURNAL_ENTRIES.length, 0);
  assert.equal(JOURNEY_MILESTONES.length, 0);
  assert.equal(ORIGIN_STORY_SECTIONS.length, 0);
  assert.equal(CONFIRMED_SKILLS.length, 0);
  assert.equal(CONFIRMED_ACHIEVEMENTS.length, 0);
});

test('filterProjects separates flagship products and lab items cleanly', () => {
  const mainProducts = filterProjects(PROJECTS, { includeLab: false });
  assert.equal(mainProducts.some((p) => p.slug === 'classapp'), true);
  assert.equal(mainProducts.some((p) => p.slug === 'milkypy'), true);
  assert.equal(mainProducts.some((p) => Boolean(p.isLabItem)), false);

  const sampleLabList: ProjectItem[] = [
    ...PROJECTS,
    {
      ...PROJECTS[0],
      id: 'sample-lab',
      slug: 'sample-lab',
      name: 'Sample Concept',
      category: 'Lab Experiment',
      status: 'Concept',
      isLabItem: true,
    },
  ];
  const labItems = filterProjects(sampleLabList, { labOnly: true });
  assert.equal(labItems.length, 1);
  assert.equal(labItems[0].isLabItem, true);
});

test('filterProjects filters by status and search query', () => {
  const prototypes = filterProjects(PROJECTS, { status: 'Prototype' });
  assert.equal(prototypes.some((p) => p.slug === 'classapp'), true);

  const queryMatches = filterProjects(PROJECTS, { query: 'python' });
  assert.equal(queryMatches.some((p) => p.slug === 'milkypy'), true);
});

test('getRelatedProjects returns verified related entries', () => {
  const related = getRelatedProjects('classapp', PROJECTS);
  assert.equal(related.some((p) => p.slug === 'milkypy'), true);
  assert.equal(getRelatedProjects('unknown-slug', PROJECTS).length, 0);
});

test('searchUniverse finds destinations by keyword', () => {
  const results = searchUniverse(
    'MilkyPy',
    UNIVERSE_DESTINATIONS,
    PROJECTS,
    JOURNAL_ENTRIES
  );
  assert.equal(results.length >= 1, true);
  assert.equal(results[0].path, '/work/milkypy');
});

test('validateContactForm allows omitting email while catching invalid inputs', () => {
  const invalid = validateContactForm({
    name: 'J',
    email: 'not-an-email',
    topic: '',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.topic);
  assert.ok(invalid.errors.message);

  const validWithoutEmail = validateContactForm({
    name: 'Ama Mensah',
    email: '',
    topic: 'General Question',
    message: 'Testing ClassApp and MilkyPy without providing my email.',
  });
  assert.equal(validWithoutEmail.valid, true);
  assert.deepEqual(validWithoutEmail.errors, {});

  const validWithHandle = validateContactForm({
    name: 'Kofi Boateng',
    email: '@ishizakitech',
    topic: 'MilkyPy Learning Inquiry',
    message: 'Love the Python lessons on MilkyPy!',
  });
  assert.equal(validWithHandle.valid, true);

  const hrefNoEmail = buildMailtoHref({
    name: 'Ama Mensah',
    email: '',
    topic: 'General Question',
    message: 'Hello Johnson!',
  });
  assert.equal(hrefNoEmail.startsWith('mailto:ishizakitechservices@gmail.com'), true);
  assert.equal(hrefNoEmail.includes('()'), false);
});

test('contact formatting strips header newlines and SSRF validator blocks private hosts', () => {
  const cleanSubject = formatContactSubject({
    name: 'Ama\r\nBcc: evil@attacker.test',
    email: '',
    topic: 'ClassApp\nInquiry',
    message: 'Valid message body over ten chars',
  });
  assert.equal(/[\r\n]/.test(cleanSubject), false);

  const draft = formatContactDraft({
    name: 'Kwame',
    email: '',
    topic: 'General Question',
    message: 'Great work on ClassApp Pro.',
  });
  assert.match(draft, /To: ishizakitechservices@gmail\.com/);
  assert.match(draft, /Reply contact: Not provided/);

  assert.equal(isAllowedWebhookUrl('https://formspree.io/f/demo123'), true);
  assert.equal(isAllowedWebhookUrl('http://formspree.io/f/demo123'), false);
  assert.equal(isAllowedWebhookUrl('https://localhost:3000/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://127.0.0.1/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://169.254.169.254/latest'), false);
  assert.equal(isAllowedWebhookUrl('https://192.168.1.10/hook'), false);
});

test('runMilkyPyLesson evaluates print, variables, arithmetic, and loops safely', () => {
  const res = runMilkyPyLesson(`
# First Python steps
name = "MilkyPy"
step = 2 + 3
print("Hello", name)
print("Steps:", step)
for i in range(3):
    print("Round", i)
  `);

  assert.equal(res.ok, true);
  assert.deepEqual(res.output, [
    'Hello MilkyPy',
    'Steps: 5',
    'Round 0',
    'Round 1',
    'Round 2',
  ]);
});

test('runMilkyPyLesson rejects unsafe imports and oversized loops cleanly', () => {
  const blockedImport = runMilkyPyLesson('import os\nprint("hi")');
  assert.equal(blockedImport.ok, false);
  assert.match(blockedImport.error ?? '', /disabled/i);

  const hugeLoop = runMilkyPyLesson('for i in range(999):\n    print(i)');
  assert.equal(hugeLoop.ok, false);
  assert.match(hugeLoop.error ?? '', /limits range/i);
});

test('resolveRouteMeta returns branded metadata for known routes', () => {
  const meta = resolveRouteMeta('/work/classapp');
  assert.match(meta.title, /ClassApp/);
  assert.match(meta.description, /prototype/i);
  assert.match(meta.description, /Johnson Bediako Ametsitsi/);

  const homeMeta = resolveRouteMeta('/');
  assert.match(homeMeta.title, /J\/UNIVERSE/);
  assert.match(homeMeta.title, /Johnson Bediako Ametsitsi/);
  assert.match(homeMeta.description, /J\/UNIVERSE/);
  assert.match(homeMeta.description, /Johnson Bediako Ametsitsi/);

  const aboutMeta = resolveRouteMeta('/about');
  assert.match(aboutMeta.title, /Johnson Bediako Ametsitsi/);
  assert.match(aboutMeta.title, /J\/UNIVERSE/);

  const nameHits = searchUniverse(
    'Johnson Bediako Ametsitsi',
    UNIVERSE_DESTINATIONS,
    PROJECTS,
    JOURNAL_ENTRIES
  );
  assert.equal(nameHits.some((item) => item.path === '/'), true);
  assert.equal(nameHits.some((item) => item.path === '/about'), true);

  const brandHits = searchUniverse(
    'J/UNIVERSE',
    UNIVERSE_DESTINATIONS,
    PROJECTS,
    JOURNAL_ENTRIES
  );
  assert.equal(brandHits.some((item) => item.path === '/'), true);
});
