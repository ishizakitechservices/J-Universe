import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AccentWorld, ProjectItem, StoryChapter } from '../data/universeData';
import { BrowserMockupFrame } from './BrowserMockupFrame';
import { LightboxAsset } from './ScreenshotLightbox';

interface ProductStoryShowcaseProps {
  project: ProjectItem;
  variant?: 'compact' | 'expanded';
  onInspectShot: (asset: LightboxAsset) => void;
}

const ACCENT_TAB_ACTIVE: Record<AccentWorld, string> = {
  ultraviolet: 'bg-[#9286D8] text-[#080B12]',
  lavender: 'bg-[#B9A2E6] text-[#080B12]',
  mint: 'bg-[#7EC9B5] text-[#080B12]',
  sand: 'bg-[#D3AC70] text-[#080B12]',
};

const ACCENT_TEXT: Record<AccentWorld, string> = {
  ultraviolet: 'text-[#5246D8] dark:text-[#9286D8]',
  lavender: 'text-[#6D48B8] dark:text-[#B9A2E6]',
  mint: 'text-[#167A5B] dark:text-[#7EC9B5]',
  sand: 'text-[#8A6024] dark:text-[#D3AC70]',
};

const ACCENT_BORDER_ACTIVE: Record<AccentWorld, string> = {
  ultraviolet: 'border-[#5246D8] dark:border-[#9286D8]',
  lavender: 'border-[#6D48B8] dark:border-[#B9A2E6]',
  mint: 'border-[#167A5B] dark:border-[#7EC9B5]',
  sand: 'border-[#8A6024] dark:border-[#D3AC70]',
};

export function ProductStoryShowcase({
  project,
  variant = 'compact',
  onInspectShot,
}: ProductStoryShowcaseProps) {
  const chapters: StoryChapter[] = project.storyChapters ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    chapters.forEach((chapter) => {
      const preload = new Image();
      preload.src = chapter.src;
    });
  }, [chapters]);

  if (chapters.length === 0) {
    return null;
  }

  const activeChapter = chapters[activeIndex] ?? chapters[0];

  const stepPrev = () => {
    setActiveIndex((prev) => (prev - 1 + chapters.length) % chapters.length);
  };

  const stepNext = () => {
    setActiveIndex((prev) => (prev + 1) % chapters.length);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepPrev();
    }
  };

  const inspectActive = () => {
    onInspectShot({
      src: activeChapter.src,
      alt: activeChapter.alt,
      title: `${project.name} · ${activeChapter.title}`,
      status: activeChapter.availability,
      caption: activeChapter.summary,
      liveUrl: project.liveUrl,
      liveLabel: project.primaryActionLabel,
      accent: project.themeAccent,
    });
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-2.5">
        {/* Interactive Story Stepper */}
        <div className="flex items-center justify-between gap-2">
          <div
            role="tablist"
            aria-label={`${project.name} visual story steps`}
            onKeyDown={handleTabKeyDown}
            className="w-full sm:w-auto grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1 sm:gap-1.5"
          >
            {chapters.map((chapter, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveIndex(idx)}
                  className={`min-h-[38px] sm:min-h-[34px] px-1.5 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-colors flex flex-col sm:flex-row items-center justify-center sm:gap-1 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#9286D8] ${
                    selected
                      ? ACCENT_TAB_ACTIVE[project.themeAccent]
                      : 'bg-[#101827] text-[#A9B1C2] border border-[#F3F0E9]/12 hover:text-[#F3F0E9] hover:border-[#F3F0E9]/30'
                  }`}
                >
                  <span className="font-mono text-[9px] sm:text-[10px] opacity-75 leading-none">
                    {chapter.stepNumber}
                  </span>
                  <span className="leading-tight">{chapter.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <span className="hidden sm:inline font-mono text-[11px] text-[#A9B1C2] tabular-nums shrink-0">
            {activeChapter.stepNumber} / 0{chapters.length}
          </span>
        </div>

        {/* Framed Authentic Capture */}
        <BrowserMockupFrame
          src={activeChapter.src}
          alt={activeChapter.alt}
          fallbackTitle={`${project.name} — ${activeChapter.shortLabel}`}
          urlHint={activeChapter.urlHint}
          availability={activeChapter.availability}
          accent={project.themeAccent}
          aspectClass="aspect-[16/9]"
          objectFit="contain"
          priority
          onInspect={inspectActive}
          inspectLabel={`Inspect full screenshot of ${project.name} ${activeChapter.shortLabel}`}
        />

        {/* Active Step Narrative */}
        <div
          role="tabpanel"
          aria-label={activeChapter.title}
          className="space-y-0.5 pt-0.5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-[#F3F0E9]">
              {activeChapter.title}
            </h3>
            <span className={`text-[11px] font-mono ${ACCENT_TEXT[project.themeAccent]}`}>
              {activeChapter.availability}
            </span>
          </div>
          <p className="text-xs text-[#A9B1C2] leading-relaxed">
            {activeChapter.summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label={`${project.name} interactive story`}
      className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-5 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <p className={`text-xs font-mono ${ACCENT_TEXT[project.themeAccent]}`}>
            Interactive Visual Story
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            {project.slug === 'classapp'
              ? 'From Student Dashboard to Adom AI'
              : 'From First Python Concept to Playable Games'}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={stepPrev}
            aria-label="Previous story step"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-black/12 dark:border-white/12 text-[#080B12] dark:text-[#F3F0E9] hover:border-black/35 dark:hover:border-white/35 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="font-mono text-xs text-[#4D5363] dark:text-[#A9B1C2] px-2 tabular-nums">
            {activeChapter.stepNumber} / 0{chapters.length}
          </span>
          <button
            type="button"
            onClick={stepNext}
            aria-label="Next story step"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-black/12 dark:border-white/12 text-[#080B12] dark:text-[#F3F0E9] hover:border-black/35 dark:hover:border-white/35 transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Step Navigation Column */}
        <div
          role="tablist"
          aria-label={`${project.name} chapters`}
          onKeyDown={handleTabKeyDown}
          className="lg:col-span-4 space-y-2.5"
        >
          {chapters.map((chapter, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={chapter.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveIndex(idx)}
                className={`w-full text-left rounded-xl border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-[#9286D8] ${
                  selected
                    ? `${ACCENT_BORDER_ACTIVE[project.themeAccent]} bg-[#F3F0E9] dark:bg-[#080B12]`
                    : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono text-xs font-semibold ${ACCENT_TEXT[project.themeAccent]}`}>
                    Step {chapter.stepNumber} · {chapter.shortLabel}
                  </span>
                  <span className="text-[11px] font-mono text-[#4D5363] dark:text-[#A9B1C2]">
                    {chapter.availability}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {chapter.title}
                </h3>
                {selected && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                    {chapter.summary}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Browser Mockup Viewport */}
        <div className="lg:col-span-8 space-y-3" role="tabpanel" aria-label={activeChapter.title}>
          <BrowserMockupFrame
            src={activeChapter.src}
            alt={activeChapter.alt}
            fallbackTitle={`${project.name} — ${activeChapter.shortLabel}`}
            urlHint={activeChapter.urlHint}
            availability={activeChapter.availability}
            accent={project.themeAccent}
            aspectClass="aspect-[16/10]"
            objectFit="contain"
            priority
            onInspect={inspectActive}
            inspectLabel={`Inspect full screenshot of ${activeChapter.title}`}
          />
          <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
            {activeChapter.summary}
          </p>
        </div>
      </div>
    </section>
  );
}
