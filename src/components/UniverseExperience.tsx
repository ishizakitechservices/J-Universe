import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import {
  AccentWorld,
  JOURNEY_MILESTONES,
  PROJECTS,
  SITE_IDENTITY,
  UNIVERSE_DESTINATIONS,
} from '../data/universeData';
import { Link, useRouter } from '../utils/router';
import { JMonogram } from './JMonogram';
import { ResilientImage } from './ResilientImage';
import type { UniverseViewPhase } from '../scene/UniverseStage';

const UniverseStage = lazy(() =>
  import('../scene/UniverseStage').then((m) => ({ default: m.UniverseStage }))
);

const WORLD_ACCENT_TEXT: Record<AccentWorld, string> = {
  lavender: 'text-[#B9A2E6]',
  mint: 'text-[#7EC9B5]',
  sand: 'text-[#D3AC70]',
  ultraviolet: 'text-[#9286D8]',
};

const WORLD_CTA_STYLE: Record<AccentWorld, string> = {
  lavender: 'bg-[#B9A2E6] text-[#080B12] hover:bg-[#cbb8ef]',
  mint: 'bg-[#7EC9B5] text-[#080B12] hover:bg-[#95d6c5]',
  sand: 'bg-[#D3AC70] text-[#080B12] hover:bg-[#dfbe8a]',
  ultraviolet: 'bg-[#9286D8] text-[#080B12] hover:bg-[#a99fe3]',
};

interface UniverseExperienceProps {
  initialPhase?: UniverseViewPhase;
}

export function UniverseExperience({
  initialPhase = 'arrival',
}: UniverseExperienceProps) {
  const { search } = useRouter();
  const [viewPhase, setViewPhase] = useState<UniverseViewPhase>(initialPhase);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Allow direct focus via ?world=<id> query string (e.g. from inner product pages)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const worldParam = params.get('world');
    if (worldParam) {
      const match = UNIVERSE_DESTINATIONS.find(
        (d) => d.id === worldParam || d.productSlug === worldParam
      );
      if (match) {
        setSelectedId(match.id);
        setViewPhase('focused');
      }
    }
  }, [search]);

  const selectedIndex = useMemo(
    () => UNIVERSE_DESTINATIONS.findIndex((d) => d.id === selectedId),
    [selectedId]
  );

  const selectedDest =
    selectedIndex >= 0 ? UNIVERSE_DESTINATIONS[selectedIndex] : null;

  const selectedProject = useMemo(() => {
    if (!selectedDest?.productSlug) return null;
    return PROJECTS.find((p) => p.slug === selectedDest.productSlug) ?? null;
  }, [selectedDest]);

  const labProjects = useMemo(
    () => PROJECTS.filter((p) => p.isLabItem),
    []
  );

  const handleSelectWorld = useCallback((id: string) => {
    setSelectedId(id);
    setViewPhase('focused');
  }, []);

  const handleExploreUniverse = useCallback(() => {
    setSelectedId(null);
    setViewPhase('overview');
  }, []);

  const handleBackToArrival = useCallback(() => {
    setSelectedId(null);
    setViewPhase('arrival');
  }, []);

  const handleStepWorld = useCallback(
    (delta: -1 | 1) => {
      const len = UNIVERSE_DESTINATIONS.length;
      const base = selectedIndex >= 0 ? selectedIndex : 0;
      const nextIdx = (base + delta + len) % len;
      setSelectedId(UNIVERSE_DESTINATIONS[nextIdx].id);
      setViewPhase('focused');
    },
    [selectedIndex]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'Escape' && viewPhase === 'focused') {
        handleExploreUniverse();
      } else if (e.key === 'ArrowRight' && viewPhase !== 'arrival') {
        handleStepWorld(1);
      } else if (e.key === 'ArrowLeft' && viewPhase !== 'arrival') {
        handleStepWorld(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewPhase, handleExploreUniverse, handleStepWorld]);

  return (
    <section
      aria-label="Interactive 3D J/UNIVERSE"
      className="relative w-full h-[100dvh] min-h-[600px] bg-[#080B12] text-[#F3F0E9] overflow-hidden"
    >
      {/* Full-Viewport Interactive 3D Cosmos */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-[#080B12] flex flex-col items-center justify-center gap-4">
            <JMonogram size="lg" showOrbit />
            <p className="font-mono text-xs text-[#A9B1C2]">
              Entering J/UNIVERSE...
            </p>
          </div>
        }
      >
        <UniverseStage
          viewPhase={viewPhase}
          selectedId={selectedId}
          reducedMotion={reducedMotion}
          onSelectWorld={handleSelectWorld}
          onManualExplore={() => {
            if (viewPhase === 'arrival') setViewPhase('overview');
          }}
        />
      </Suspense>

      {/* ARRIVAL OVERLAY — Pure Minimal First Impression */}
      {viewPhase === 'arrival' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-0 sm:justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/75 via-45% to-transparent sm:bg-gradient-to-r sm:from-[#080B12]/85 sm:via-[#080B12]/35 sm:to-transparent"
          />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
            <div className="pointer-events-auto max-w-lg space-y-5">
              <p className="text-xs font-mono tracking-wide text-[#A9B1C2]">
                {SITE_IDENTITY.owner} · {SITE_IDENTITY.studio}
              </p>

              <div className="space-y-2">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F3F0E9] leading-[1.0]">
                  JOHNSON.
                </h1>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-[#F3F0E9]/90 leading-snug">
                  {SITE_IDENTITY.primaryHeadline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#A9B1C2] leading-relaxed max-w-md">
                {SITE_IDENTITY.supportingIntro}
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <button
                  type="button"
                  onClick={handleExploreUniverse}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#F3F0E9] text-[#080B12] text-sm font-semibold hover:bg-[#D3AC70] transition-colors whitespace-nowrap"
                >
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <span>Explore my universe</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <Link
                  to="/work"
                  className="text-sm font-medium text-[#F3F0E9]/80 hover:text-[#F3F0E9] underline underline-offset-4 whitespace-nowrap"
                >
                  Browse work directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW BOTTOM BAR — Effortless Destination Strip (Zero Cockpit Clutter) */}
      {viewPhase === 'overview' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-5 px-4 sm:px-8">
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <nav
              aria-label="Celestial destinations"
              className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto px-2 py-1.5 rounded-xl bg-[#080B12]/90 border border-[#F3F0E9]/14 max-w-full"
            >
              {UNIVERSE_DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectWorld(dest.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A9B1C2] hover:text-[#F3F0E9] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0"
                >
                  {dest.shortLabel}
                </button>
              ))}
            </nav>

            <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setReducedMotion((prev) => !prev)}
                aria-pressed={reducedMotion}
                className="px-3 py-1.5 rounded-lg bg-[#080B12]/90 border border-[#F3F0E9]/14 text-xs text-[#A9B1C2] hover:text-[#F3F0E9] transition-colors whitespace-nowrap"
              >
                {reducedMotion ? 'Motion: Reduced' : 'Reduce Motion'}
              </button>

              <button
                type="button"
                onClick={handleBackToArrival}
                className="px-3 py-1.5 rounded-lg bg-[#080B12]/90 border border-[#F3F0E9]/14 text-xs text-[#A9B1C2] hover:text-[#F3F0E9] transition-colors whitespace-nowrap"
              >
                Intro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOCUSED WORLD EDITORIAL STORY OVERLAY */}
      {viewPhase === 'focused' && selectedDest && (
        <aside
          aria-label={`${selectedDest.name} preview`}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end lg:justify-center"
        >
          {/* Edge gradient scrim (only behind text side; leaves planet unobstructed) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/80 via-55% to-transparent lg:bg-gradient-to-r lg:from-[#080B12]/95 lg:via-[#080B12]/55 lg:to-transparent"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 pb-6 lg:pb-0">
            <div className="pointer-events-auto max-w-md lg:max-w-lg space-y-5">
              {/* Top navigation row */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleExploreUniverse}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#A9B1C2] hover:text-[#F3F0E9] transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Back to Universe</span>
                </button>

                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStepWorld(-1)}
                    aria-label="Previous destination"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#F3F0E9]/15 bg-[#080B12]/85 text-[#F3F0E9] hover:border-[#F3F0E9]/40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepWorld(1)}
                    aria-label="Next destination"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#F3F0E9]/15 bg-[#080B12]/85 text-[#F3F0E9] hover:border-[#F3F0E9]/40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* World heading & narrative */}
              <div className="space-y-2.5">
                <p className={`text-xs font-mono ${WORLD_ACCENT_TEXT[selectedDest.accent]}`}>
                  {selectedDest.worldRole} · {selectedDest.status}
                </p>

                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F3F0E9] leading-[1.06]">
                  {selectedDest.name}
                </h1>

                <p className={`font-display text-lg sm:text-xl ${WORLD_ACCENT_TEXT[selectedDest.accent]}`}>
                  “{selectedDest.tagline}”
                </p>

                <p className="text-sm sm:text-base text-[#A9B1C2] leading-relaxed">
                  {selectedDest.summary}
                </p>
              </div>

              {/* Verified product screenshot & concise features when applicable */}
              {selectedProject && (
                <div className="space-y-4 pt-1">
                  {selectedProject.screenshots[0] && (
                    <ResilientImage
                      src={selectedProject.screenshots[0].src}
                      alt={selectedProject.screenshots[0].alt}
                      fallbackTitle={selectedProject.name}
                      accent={selectedProject.themeAccent}
                      aspectClass="aspect-[16/8]"
                      className="border-[#F3F0E9]/14 bg-[#101827]"
                    />
                  )}

                  {selectedProject.features.length > 0 && (
                    <ul className="hidden sm:grid grid-cols-1 gap-2 border-t border-[#F3F0E9]/10 pt-3">
                      {selectedProject.features.slice(0, 2).map((feat) => (
                        <li key={feat.title} className="text-xs text-[#A9B1C2] leading-relaxed">
                          <span className="font-semibold text-[#F3F0E9]">
                            {feat.title}:
                          </span>{' '}
                          {feat.simpleSummary}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Origin / Journey verified milestones preview */}
              {(selectedDest.archetype === 'origin' ||
                selectedDest.archetype === 'pathway') &&
                JOURNEY_MILESTONES.length > 0 && (
                  <ul className="hidden sm:grid grid-cols-1 gap-2 border-t border-[#F3F0E9]/10 pt-3">
                    {JOURNEY_MILESTONES.slice(0, 2).map((m) => (
                      <li key={m.id} className="text-xs text-[#A9B1C2] leading-relaxed">
                        <span className="font-semibold text-[#F3F0E9]">
                          {m.title}:
                        </span>{' '}
                        {m.description}
                      </li>
                    ))}
                  </ul>
                )}

              {/* The Lab / Future Concepts real verified entries */}
              {(selectedDest.archetype === 'cluster' ||
                selectedDest.archetype === 'horizon') &&
                labProjects.length > 0 && (
                  <ul className="hidden sm:grid grid-cols-1 gap-2 border-t border-[#F3F0E9]/10 pt-3">
                    {labProjects.map((item) => (
                      <li key={item.id} className="text-xs text-[#A9B1C2] leading-relaxed">
                        <span className="font-semibold text-[#F3F0E9]">
                          {item.name}
                        </span>{' '}
                        <span className="font-mono text-[#9286D8]">
                          ({item.status})
                        </span>{' '}
                        — {item.shortTagline}
                      </li>
                    ))}
                  </ul>
                )}

              {/* Primary Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={selectedDest.path}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${WORLD_CTA_STYLE[selectedDest.accent]}`}
                >
                  <span>{selectedDest.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                {selectedProject?.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#F3F0E9]/20 text-xs font-semibold text-[#F3F0E9] hover:border-[#F3F0E9]/45 transition-colors whitespace-nowrap"
                  >
                    <span>{selectedProject.primaryActionLabel}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setReducedMotion((prev) => !prev)}
                  aria-pressed={reducedMotion}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A9B1C2] hover:text-[#F3F0E9] transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{reducedMotion ? 'Motion: Reduced' : 'Reduce Motion'}</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}
