import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, Mail, Sparkles } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import {
  PROJECTS,
  SITE_IDENTITY,
} from '../data/universeData';
import {
  getPrefersReducedMotion,
  subscribeReducedMotion,
} from '../scene/deviceCapability';
import {
  STORY_SCENES,
  computeStoryProgressFromOffsets,
} from '../scene/storyKeyframes';
import { StoryUniverseStage } from '../scene/StoryUniverseStage';
import { Link } from '../utils/router';
import { JMonogram } from './JMonogram';
import { ProductStoryShowcase } from './ProductStoryShowcase';
import { LightboxAsset, ScreenshotLightbox } from './ScreenshotLightbox';
import { SiteFooter } from './SiteFooter';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const HERO_REVEAL = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: REVEAL_EASE },
} as const;

const SECTION_REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.6, ease: REVEAL_EASE },
} as const;

const HERO_TEXT_SHADOW =
  '[text-shadow:0_2px_18px_rgba(8,11,18,0.92),0_1px_4px_rgba(8,11,18,0.96)]';

const READABLE_CARD_SURFACE =
  'border-[#F3F0E9]/16 bg-[#080C16]/88 backdrop-blur-lg shadow-[0_24px_64px_rgba(0,0,0,0.62)]';

export function StoryHomepage() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const sceneProgressRef = useRef<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stageNotifyRef = useRef<(() => void) | null>(null);

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(getPrefersReducedMotion);
  const [lightboxAsset, setLightboxAsset] = useState<LightboxAsset | null>(null);

  const classApp = useMemo(
    () => PROJECTS.find((p) => p.slug === 'classapp')!,
    []
  );
  const milkyPy = useMemo(
    () => PROJECTS.find((p) => p.slug === 'milkypy')!,
    []
  );
  const studio = useMemo(
    () => PROJECTS.find((p) => p.slug === 'ishizaki-tech-services')!,
    []
  );

  useEffect(() => {
    return subscribeReducedMotion(setReducedMotion);
  }, []);

  const syncScrollProgress = useCallback(() => {
    const centers = sectionRefs.current.map((el, idx) => {
      if (!el) return idx * window.innerHeight;
      const rect = el.getBoundingClientRect();
      return window.scrollY + rect.top + rect.height * 0.45;
    });
    const viewportMidY = window.scrollY + window.innerHeight * 0.5;
    const progress = computeStoryProgressFromOffsets(viewportMidY, centers);
    sceneProgressRef.current = progress;
    if (progressBarRef.current) {
      const normalized = Math.min(Math.max(progress / (STORY_SCENES.length - 1), 0), 1);
      progressBarRef.current.style.transform = `scaleX(${normalized.toFixed(4)})`;
    }
    const rounded = Math.round(progress);
    setActiveSceneIndex((prev) => (prev !== rounded ? rounded : prev));
    stageNotifyRef.current?.();
  }, []);

  useEffect(() => {
    syncScrollProgress();
    const onScroll = () => syncScrollProgress();
    const onResize = () => syncScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [syncScrollProgress]);

  const scrollToScene = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_IDENTITY.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      // Clipboard blocked; mailto link remains visible
    }
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div
        data-testid="story-homepage"
        data-active-scene={STORY_SCENES[activeSceneIndex]?.id ?? 'arrival'}
        className="dark relative w-full bg-[#080B12] text-[#F3F0E9]"
      >
      {/* Single Cohesive Full-Viewport 3D Universe Stage */}
      <StoryUniverseStage
        sceneProgressRef={sceneProgressRef}
        reducedMotion={reducedMotion}
        stageNotifyRef={stageNotifyRef}
      />

      {/* GPU-composited Hairline Reading Progress Bar directly beneath fixed top nav */}
      <div
        aria-hidden="true"
        className="fixed top-16 left-0 right-0 h-[2px] z-30 pointer-events-none bg-[#F3F0E9]/8"
      >
        <div
          ref={progressBarRef}
          style={{ transform: 'scaleX(0)' }}
          className="h-full w-full origin-left bg-gradient-to-r from-[#9286D8] via-[#7EC9B5] to-[#D3AC70] will-change-transform"
        />
      </div>

      {/* Discreet Vertical Chapter Rail (Desktop xl+ only; simple jump anchors) */}
      <nav
        aria-label="Story chapters"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3"
      >
        {STORY_SCENES.map((scene, idx) => {
          const active = activeSceneIndex === idx;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => scrollToScene(scene.id)}
              aria-current={active ? 'location' : undefined}
              aria-label={`Jump to ${scene.chapter} ${scene.label}`}
              className="group flex items-center gap-2.5 py-0.5 text-right focus-visible:outline-2 focus-visible:outline-[#9286D8]"
            >
              <span
                className={`text-[11px] font-mono transition-opacity px-1.5 py-0.5 rounded bg-[#080B12]/90 ${
                  active
                    ? 'opacity-100 text-[#F3F0E9]'
                    : 'opacity-0 group-hover:opacity-90 text-[#A9B1C2]'
                }`}
              >
                {scene.chapter} {scene.label}
              </span>
              <span
                className={`block h-[2px] transition-all ${
                  active
                    ? 'w-6 bg-[#F3F0E9]'
                    : 'w-2.5 bg-[#F3F0E9]/30 group-hover:bg-[#F3F0E9]/65'
                }`}
              />
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setReducedMotion((prev) => !prev)}
        aria-pressed={reducedMotion}
        aria-label={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
        className="hidden xl:inline-flex fixed bottom-5 right-6 z-30 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F3F0E9]/14 bg-[#080B12]/92 text-[11px] font-mono text-[#A9B1C2] hover:text-[#F3F0E9] transition-colors whitespace-nowrap"
      >
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        <span>{reducedMotion ? 'Motion: Off' : 'Motion: On'}</span>
      </button>

      {/* Continuous Semantic Scroll Narrative */}
      <div className="relative z-10">
        {/* ================================================================
            SCENE 01 — ARRIVAL / JOHNSON
           ================================================================ */}
        <section
          id="arrival"
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          aria-label="Introduction"
          className="relative min-h-[100dvh] flex items-end md:items-center pt-24 pb-12 md:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/88 via-52% to-transparent md:bg-gradient-to-r md:from-[#080B12]/88 md:via-[#080B12]/42 md:to-transparent"
          />

          <motion.div
            {...HERO_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 pt-[42dvh] md:pt-0"
          >
            <div className={`max-w-xl space-y-4 sm:space-y-6 ${HERO_TEXT_SHADOW}`}>
              <p className="text-sm font-medium text-[#D3AC70]">
                {SITE_IDENTITY.owner} · {SITE_IDENTITY.location}
              </p>

              <h1 className="font-display text-[2.05rem] sm:text-5xl lg:text-[4rem] font-bold tracking-[-0.015em] text-[#F3F0E9] leading-[1.06]">
                {SITE_IDENTITY.primaryHeadline}
              </h1>

              <p className="text-base sm:text-xl text-[#D0D5DF] leading-relaxed max-w-lg">
                {SITE_IDENTITY.supportingIntro}
              </p>

              <p className="text-xs sm:text-sm text-[#A9B1C2] leading-relaxed">
                Creator of{' '}
                <a
                  href="#classapp"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToScene('classapp');
                  }}
                  className="text-[#F3F0E9] underline underline-offset-4 decoration-[#B9A2E6]/70 hover:text-[#B9A2E6]"
                >
                  ClassApp
                </a>{' '}
                (Prototype) and{' '}
                <a
                  href="#milkypy"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToScene('milkypy');
                  }}
                  className="text-[#F3F0E9] underline underline-offset-4 decoration-[#7EC9B5]/70 hover:text-[#7EC9B5]"
                >
                  MilkyPy
                </a>{' '}
                (Live), through{' '}
                <Link
                  to="/studio"
                  className="text-[#F3F0E9] underline underline-offset-4 decoration-[#D3AC70]/70 hover:text-[#D3AC70]"
                >
                  {SITE_IDENTITY.studio}
                </Link>
                .
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 [text-shadow:none]">
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToScene('work');
                  }}
                  className="min-h-[44px] inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#F3F0E9] text-[#080B12] text-sm font-semibold hover:bg-[#D3AC70] transition-colors whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                >
                  <span>Explore My Work</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <Link
                  to="/about"
                  className={`min-h-[44px] inline-flex items-center px-2 text-sm font-medium text-[#F3F0E9]/88 hover:text-[#F3F0E9] underline underline-offset-4 whitespace-nowrap ${HERO_TEXT_SHADOW}`}
                >
                  About Me
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 02 — OVERVIEW / PRODUCTS FOR LEARNING & EDUCATION
           ================================================================ */}
        <section
          id="what-i-do"
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          aria-label="What I Focus On"
          className="relative min-h-[76dvh] flex items-center pt-24 pb-16 sm:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#080B12]/72 to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 space-y-9"
          >
            <div className={`max-w-2xl space-y-2.5 ${HERO_TEXT_SHADOW}`}>
              <p className="text-xs font-semibold tracking-wide text-[#D3AC70]">
                At a Glance
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F3F0E9] leading-[1.08]">
                Simple, helpful tools for learning and education.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.55, delay: 0.04, ease: REVEAL_EASE }}
                className="flex"
              >
                <Link
                  to="/work/classapp"
                  className={`group w-full rounded-2xl border p-6 sm:p-7 space-y-3 hover:border-[#B9A2E6]/50 transition-colors flex flex-col justify-between ${READABLE_CARD_SURFACE}`}
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#B9A2E6]">
                      01 · {classApp.status}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#F3F0E9]">
                      {classApp.name} Pro
                    </h3>
                    <p className="text-sm text-[#A9B1C2] leading-relaxed">
                      Dashboard, 11 subjects, Study Vault, Adom AI, and an early public prototype.
                    </p>
                  </div>
                  <span className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#B9A2E6]">
                    <span>View ClassApp</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.55, delay: 0.12, ease: REVEAL_EASE }}
                className="flex"
              >
                <Link
                  to="/work/milkypy"
                  className={`group w-full rounded-2xl border p-6 sm:p-7 space-y-3 hover:border-[#7EC9B5]/50 transition-colors flex flex-col justify-between ${READABLE_CARD_SURFACE}`}
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#7EC9B5]">
                      02 · {milkyPy.status} Website
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#F3F0E9]">
                      {milkyPy.name}
                    </h3>
                    <p className="text-sm text-[#A9B1C2] leading-relaxed">
                      Python lessons, browser editor, quizzes, and simple games.
                    </p>
                  </div>
                  <span className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#7EC9B5]">
                    <span>View MilkyPy</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.55, delay: 0.2, ease: REVEAL_EASE }}
                className="flex"
              >
                <Link
                  to="/studio"
                  className={`group w-full rounded-2xl border p-6 sm:p-7 space-y-3 hover:border-[#D3AC70]/50 transition-colors flex flex-col justify-between ${READABLE_CARD_SURFACE}`}
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#D3AC70]">
                      03 · Technology Initiative
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#F3F0E9]">
                      {SITE_IDENTITY.studio}
                    </h3>
                    <p className="text-sm text-[#A9B1C2] leading-relaxed">
                      The technology initiative founded by {SITE_IDENTITY.owner}.
                    </p>
                  </div>
                  <span className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3AC70]">
                    <span>About Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 03 — CLASSAPP (Prototype Status · Left Card + Right 3D World)
           ================================================================ */}
        <section
          id="classapp"
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          aria-label="ClassApp"
          className="relative min-h-[100dvh] scroll-mt-20 flex items-end md:items-center pt-24 pb-12 sm:pt-24 sm:pb-14"
        >
          <span id="work" className="absolute top-0 left-0 scroll-mt-20" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/74 via-45% to-transparent md:bg-gradient-to-r md:from-[#080B12]/82 md:via-[#080B12]/36 md:to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-5 sm:px-8 pt-[24dvh] md:pt-0"
          >
            <div className={`max-w-xl rounded-2xl border p-4 sm:p-5 space-y-3 ${READABLE_CARD_SURFACE}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#B9A2E6]">
                    {classApp.publicIdentity ?? classApp.name} · {classApp.status}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F0E9] mt-0.5">
                    {classApp.name} Pro
                  </h2>
                </div>
                <p className="text-xs text-[#B9A2E6]">
                  {classApp.shortTagline}
                </p>
              </div>

              <ProductStoryShowcase
                project={classApp}
                variant="compact"
                onInspectShot={setLightboxAsset}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-[#F3F0E9]/10 pt-3 text-xs">
                <div>
                  <span className="font-semibold text-[#F3F0E9]">Implemented in Pro:</span>{' '}
                  <span className="text-[#A9B1C2]">
                    Dashboard, 11 subjects, Vault, Adom AI, Google Classroom, Quizzes & Notices.
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#B9A2E6]">Public Prototype:</span>{' '}
                  <span className="text-[#A9B1C2]">
                    Early sign-in entry at{' '}
                    <span className="font-mono text-[#F3F0E9]">classapp-rbci.onrender.com</span>.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-0.5">
                {classApp.liveUrl && (
                  <a
                    href={classApp.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B9A2E6] text-[#080B12] text-sm font-semibold hover:bg-[#cbb8ef] transition-colors whitespace-nowrap"
                  >
                    <span>{classApp.primaryActionLabel}</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}

                <Link
                  to="/work/classapp"
                  className="min-h-[44px] inline-flex items-center px-1 text-sm font-medium text-[#F3F0E9]/90 hover:text-[#F3F0E9] underline underline-offset-4 whitespace-nowrap"
                >
                  Explore Full ClassApp Story
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 04 — MILKYPY (Live Website · Right Card + Left 3D Sanctuary)
           ================================================================ */}
        <section
          id="milkypy"
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          aria-label="MilkyPy"
          className="relative min-h-[100dvh] scroll-mt-20 flex items-end md:items-center pt-24 pb-12 sm:pt-24 sm:pb-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/74 via-45% to-transparent md:bg-gradient-to-l md:from-[#080B12]/82 md:via-[#080B12]/36 md:to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-5 sm:px-8 pt-[24dvh] md:pt-0 flex md:justify-end"
          >
            <div className={`max-w-xl w-full rounded-2xl border p-4 sm:p-5 space-y-3 ${READABLE_CARD_SURFACE}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#7EC9B5]">
                    Python Learning Platform · {milkyPy.status}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F0E9] mt-0.5">
                    {milkyPy.name}
                  </h2>
                </div>
                <p className="text-xs text-[#7EC9B5]">
                  {milkyPy.shortTagline}
                </p>
              </div>

              <ProductStoryShowcase
                project={milkyPy}
                variant="compact"
                onInspectShot={setLightboxAsset}
              />

              <div className="border-t border-[#F3F0E9]/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#A9B1C2]">
                <span>
                  <span className="font-semibold text-[#F3F0E9]">Learning Flow:</span>{' '}
                  24 Lessons → In-Browser IDE → Quizzes → Remixable Games
                </span>
                <span className="font-mono text-[#7EC9B5]">PWA Offline Ready</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-0.5">
                {milkyPy.liveUrl && (
                  <a
                    href={milkyPy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7EC9B5] text-[#080B12] text-sm font-semibold hover:bg-[#95d6c5] transition-colors whitespace-nowrap"
                  >
                    <span>{milkyPy.primaryActionLabel}</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}

                <Link
                  to="/work/milkypy"
                  className="min-h-[44px] inline-flex items-center px-1 text-sm font-medium text-[#7EC9B5] hover:text-[#F3F0E9] underline underline-offset-4 whitespace-nowrap"
                >
                  Explore Full MilkyPy Journey
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 05 — ABOUT JOHNSON (J. Identity Card + Approved Biography)
           ================================================================ */}
        <section
          id="about"
          ref={(el) => {
            sectionRefs.current[4] = el;
          }}
          aria-label="About Johnson"
          className="relative min-h-[80dvh] flex items-center pt-24 pb-16 sm:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#080B12]/78 to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-6 sm:px-8"
          >
            <div className={`rounded-2xl border p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center ${READABLE_CARD_SURFACE}`}>
              <div className="lg:col-span-4 flex flex-col items-start gap-6 border-b lg:border-b-0 lg:border-r border-[#F3F0E9]/10 pb-6 lg:pb-0 lg:pr-8">
                <JMonogram size="xl" showOrbit interactive className="text-[#F3F0E9]" />
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold text-[#F3F0E9]">
                    {SITE_IDENTITY.owner}
                  </p>
                  <p className="text-xs text-[#A9B1C2]">
                    {SITE_IDENTITY.location} · {SITE_IDENTITY.studio}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#9286D8]">
                    About Johnson
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#F3F0E9] leading-snug">
                    {SITE_IDENTITY.role}.
                  </h2>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-[#D0D5DF] leading-relaxed max-w-2xl">
                  <p>{SITE_IDENTITY.approvedBiography}</p>
                  <p className="text-[#A9B1C2]">
                    Every project here is explained in plain language first, with optional technical details for curious readers and developers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    to="/about"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9286D8] text-[#080B12] text-sm font-semibold hover:bg-[#a99fe3] transition-colors whitespace-nowrap"
                  >
                    <span>About Me</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/work"
                    className="min-h-[44px] inline-flex items-center px-2 text-sm font-medium text-[#F3F0E9]/85 hover:text-[#F3F0E9] underline underline-offset-4 whitespace-nowrap"
                  >
                    View All Work
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 06 — ISHIZAKI TECH SERVICES (Left Card + Right 3D Sculpture)
           ================================================================ */}
        <section
          id="studio"
          ref={(el) => {
            sectionRefs.current[5] = el;
          }}
          aria-label="Ishizaki Tech Services"
          className="relative min-h-[88dvh] flex items-end md:items-center pt-24 pb-14 sm:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/74 via-45% to-transparent md:bg-gradient-to-r md:from-[#080B12]/82 md:via-[#080B12]/36 md:to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 pt-[30dvh] md:pt-0"
          >
            <div className={`max-w-lg rounded-2xl border p-6 sm:p-8 space-y-5 ${READABLE_CARD_SURFACE}`}>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#D3AC70]">
                  {SITE_IDENTITY.studio}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F0E9] leading-tight">
                  {SITE_IDENTITY.studioTagline}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#D0D5DF] leading-relaxed">
                {studio.detailedDescription}
              </p>

              <div className="border-t border-[#F3F0E9]/10 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#A9B1C2]">
                <span className="font-semibold text-[#D3AC70]">Projects:</span>
                <Link to="/work/classapp" className="py-1 hover:text-[#F3F0E9] underline underline-offset-4">
                  ClassApp ({classApp.status})
                </Link>
                <Link to="/work/milkypy" className="py-1 hover:text-[#F3F0E9] underline underline-offset-4">
                  MilkyPy ({milkyPy.status})
                </Link>
              </div>

              <div>
                <Link
                  to="/studio"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D3AC70] text-[#080B12] text-sm font-semibold hover:bg-[#dfbe8a] transition-colors whitespace-nowrap"
                >
                  <span>Visit Studio Page</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            SCENE 07 — CONTACT (Clean Horizon + Direct Contact Card)
           ================================================================ */}
        <section
          id="contact"
          ref={(el) => {
            sectionRefs.current[6] = el;
          }}
          aria-label="Contact"
          className="relative min-h-[78dvh] flex items-end md:items-center pt-24 pb-16 sm:py-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/74 to-transparent md:bg-gradient-to-r md:from-[#080B12]/82 md:via-[#080B12]/36 md:to-transparent"
          />

          <motion.div
            {...SECTION_REVEAL}
            className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 pt-[22dvh] md:pt-0"
          >
            <div className={`max-w-xl rounded-2xl border p-6 sm:p-8 space-y-5 ${READABLE_CARD_SURFACE}`}>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#D3AC70]">
                  Get in Touch
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F0E9] leading-tight">
                  Have an idea worth building?
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#D0D5DF] leading-relaxed">
                Reach out directly by email or prepare an email draft on the contact page about {classApp.name}, {milkyPy.name}, or {SITE_IDENTITY.studio}.
              </p>

              <div className="border-y border-[#F3F0E9]/12 py-4 space-y-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2.5 text-sm font-mono text-[#F3F0E9] break-words">
                    <Mail className="w-4 h-4 text-[#D3AC70] shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${SITE_IDENTITY.email}`}
                      className="py-1 hover:text-[#D3AC70] transition-colors"
                    >
                      {SITE_IDENTITY.email}
                    </a>
                  </div>
                  <a
                    href={SITE_IDENTITY.social.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${SITE_IDENTITY.social.xHandle} on X`}
                    className="min-h-[44px] inline-flex items-center gap-2 text-xs font-mono text-[#A9B1C2] hover:text-[#D3AC70] transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-3.5 h-3.5 shrink-0"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>{SITE_IDENTITY.social.xHandle}</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F3F0E9] text-[#080B12] text-sm font-semibold hover:bg-[#D3AC70] transition-colors whitespace-nowrap"
                  >
                    <span>Prepare a Message</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F3F0E9]/18 text-xs font-medium text-[#F3F0E9] hover:border-[#F3F0E9]/45 transition-colors whitespace-nowrap"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#7EC9B5]" aria-hidden="true" />
                        <span>Email Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs text-[#A9B1C2]">
                <Link to="/work" className="min-h-[44px] inline-flex items-center hover:text-[#F3F0E9] underline underline-offset-4">
                  Work Overview
                </Link>
                <Link to="/universe" className="min-h-[44px] inline-flex items-center hover:text-[#F3F0E9] underline underline-offset-4">
                  Interactive 3D Map
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToScene('arrival')}
                  className="min-h-[44px] inline-flex items-center hover:text-[#F3F0E9] underline underline-offset-4"
                >
                  Back to Top
                </button>
                <button
                  type="button"
                  onClick={() => setReducedMotion((prev) => !prev)}
                  aria-pressed={reducedMotion}
                  className="xl:hidden min-h-[44px] inline-flex items-center hover:text-[#F3F0E9] underline underline-offset-4"
                >
                  {reducedMotion ? 'Motion: Reduced' : 'Reduce Motion'}
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer Layered Cleanly Below Contact Horizon */}
      <div className="relative z-10 bg-[#080B12]">
        <SiteFooter flush />
      </div>

      <ScreenshotLightbox
        asset={lightboxAsset}
        onClose={() => setLightboxAsset(null)}
      />
      </div>
    </MotionConfig>
  );
}
