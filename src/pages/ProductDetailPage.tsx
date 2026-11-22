import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AccentWorld, PROJECTS } from '../data/universeData';
import { getRelatedProjects } from '../utils/portfolioLogic';
import { Link } from '../utils/router';
import { BrowserMockupFrame } from '../components/BrowserMockupFrame';
import { ProductStoryShowcase } from '../components/ProductStoryShowcase';
import { LightboxAsset, ScreenshotLightbox } from '../components/ScreenshotLightbox';
import { TwoLayerExplainer } from '../components/TwoLayerExplainer';
import { MilkyPyPlayground } from '../components/MilkyPyPlayground';
import { NotFoundPage } from './NotFoundPage';

interface ProductDetailPageProps {
  slug: string;
}

const ACCENT_LABEL: Record<AccentWorld, string> = {
  ultraviolet: 'text-[#5246D8] dark:text-[#9286D8]',
  lavender: 'text-[#6D48B8] dark:text-[#B9A2E6]',
  mint: 'text-[#167A5B] dark:text-[#7EC9B5]',
  sand: 'text-[#8A6024] dark:text-[#D3AC70]',
};

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const [lightboxAsset, setLightboxAsset] = useState<LightboxAsset | null>(null);
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return <NotFoundPage />;
  }

  const related = getRelatedProjects(project.slug, PROJECTS);
  // Hero picks a balanced aspect-ratio screenshot when available (e.g. Classes on ClassApp, Playground on MilkyPy)
  const heroShot =
    project.slug === 'classapp'
      ? project.screenshots[1] ?? project.screenshots[0]
      : project.slug === 'milkypy'
      ? project.screenshots[1] ?? project.screenshots[0]
      : project.screenshots[0];

  const storySrcs = new Set((project.storyChapters ?? []).map((c) => c.src));
  const extraModuleShots = project.screenshots.filter(
    (shot) => !storySrcs.has(shot.src)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-10 space-y-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#4D5363] dark:text-[#A9B1C2]">
        <Link
          to={project.isLabItem ? '/lab' : '/work'}
          className="inline-flex items-center gap-1.5 hover:text-[#080B12] dark:hover:text-[#F3F0E9]"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{project.isLabItem ? 'Back to The Lab' : 'Back to Work'}</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#080B12] dark:text-[#F3F0E9] font-medium">
          {project.name}
        </span>
      </nav>

      {/* Product Hero */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${ACCENT_LABEL[project.themeAccent]}`}>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.status}</span>
              {project.publicIdentity && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{project.publicIdentity}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#080B12] dark:text-[#F3F0E9]">
              {project.slug === 'classapp' ? 'ClassApp Pro' : project.name}
            </h1>

            <p className={`font-display text-xl sm:text-2xl ${ACCENT_LABEL[project.themeAccent]}`}>
              “{project.shortTagline}”
            </p>

            <p className="text-base sm:text-lg text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {project.detailedDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <span>{project.primaryActionLabel}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <Link
                to="/contact"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Ask about {project.name}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}

            <Link
              to={`/universe?world=${project.slug}`}
              className="min-h-[44px] inline-flex items-center text-sm font-medium text-[#4D5363] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9] underline underline-offset-4"
            >
              Explore in 3D Universe
            </Link>
          </div>
        </div>

        {heroShot && (
          <div className="lg:col-span-6 flex flex-col gap-2">
            <BrowserMockupFrame
              src={heroShot.src}
              alt={heroShot.alt}
              fallbackTitle={project.name}
              urlHint={heroShot.urlHint ?? (project.liveUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || project.slug)}
              availability={heroShot.availability}
              accent={project.themeAccent}
              aspectClass="aspect-[16/10]"
              objectFit="contain"
              priority
              onInspect={() =>
                setLightboxAsset({
                  src: heroShot.src,
                  alt: heroShot.alt,
                  title: project.name,
                  status: heroShot.availability ?? project.status,
                  caption: heroShot.caption,
                  liveUrl: project.liveUrl,
                  liveLabel: project.primaryActionLabel,
                  accent: project.themeAccent,
                })
              }
              inspectLabel={`Inspect full screenshot of ${project.name}`}
            />
            <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
              {heroShot.caption}
            </p>
          </div>
        )}
      </header>

      {/* Interactive 4-Step Product Story (Dashboard->Classes->Vault->Adom AI / Learn->Practice->Quiz->Play) */}
      <ProductStoryShowcase
        project={project}
        variant="expanded"
        onInspectShot={setLightboxAsset}
      />

      {/* Honest Availability Distinction for ClassApp */}
      {project.slug === 'classapp' && (
        <section
          aria-label="ClassApp stage availability breakdown"
          className="rounded-2xl border border-[#6D48B8]/25 dark:border-[#B9A2E6]/25 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8 space-y-5"
        >
          <div className="space-y-1">
            <p className="text-xs font-mono text-[#6D48B8] dark:text-[#B9A2E6]">
              Release Transparency
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Public Prototype vs. Newer ClassApp Pro Build
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] p-5 space-y-1.5">
              <p className="text-xs font-mono font-semibold text-[#8A6024] dark:text-[#D3AC70]">
                01 · Publicly Available
              </p>
              <h3 className="font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Render Prototype Entry
              </h3>
              <p className="text-xs sm:text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                Publicly reachable today at{' '}
                <span className="font-mono text-[#080B12] dark:text-[#F3F0E9]">
                  classapp-rbci.onrender.com
                </span>{' '}
                showing the early Student ID sign-in prototype.
              </p>
            </div>

            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] p-5 space-y-1.5">
              <p className="text-xs font-mono font-semibold text-[#6D48B8] dark:text-[#B9A2E6]">
                02 · Implemented in Pro Build
              </p>
              <h3 className="font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Newer Workspace Modules
              </h3>
              <p className="text-xs sm:text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                Dashboard, 11-subject Classes, Study Vault, Google Classroom link, Adom AI, Math Practice Quizzes, Flashcards, and Notices shown from real application captures.
              </p>
            </div>

            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] p-5 space-y-1.5">
              <p className="text-xs font-mono font-semibold text-[#4D5363] dark:text-[#A9B1C2]">
                03 · In Progress
              </p>
              <h3 className="font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Open Public Pro Rollout
              </h3>
              <p className="text-xs sm:text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                Public open-access deployment and live multi-school Classroom rollout remain in development rather than claimed as broadly live today.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Two-Layer Explanation (Simple vs Optional Expandable Technical Details) */}
      <TwoLayerExplainer project={project} />

      {/* Additional ClassApp Pro Modules & Prototype Verification Gallery */}
      {extraModuleShots.length > 0 && (
        <section aria-label={`${project.name} additional module screenshots`} className="space-y-5">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Additional {project.slug === 'classapp' ? 'ClassApp Pro Modules & Public Prototype' : `${project.name} Views`}
            </h2>
            <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2]">
              Google Classroom subject integration, mathematical quiz rendering, flashcards, notices, accessibility controls, and the live Render prototype entry screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extraModuleShots.map((shot) => (
              <figure
                key={shot.src}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-4 sm:p-5 space-y-3"
              >
                <BrowserMockupFrame
                  src={shot.src}
                  alt={shot.alt}
                  fallbackTitle={project.name}
                  urlHint={shot.urlHint ?? shot.sourceLabel}
                  availability={shot.availability}
                  accent={project.themeAccent}
                  aspectClass="aspect-[16/10]"
                  objectFit="contain"
                  onInspect={() =>
                    setLightboxAsset({
                      src: shot.src,
                      alt: shot.alt,
                      title: project.name,
                      status: shot.availability ?? project.status,
                      caption: shot.caption,
                      liveUrl: project.liveUrl,
                      liveLabel: project.primaryActionLabel,
                      accent: project.themeAccent,
                    })
                  }
                  inspectLabel={`Inspect ${shot.caption}`}
                />
                <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                  <span>{shot.caption}</span>
                  <span className={`font-mono shrink-0 ${ACCENT_LABEL[project.themeAccent]}`}>
                    {shot.sourceLabel}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Documented Capabilities & Product Record */}
      {(project.features.length > 0 || project.milestones.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {project.features.length > 0 && (
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  Documented Capabilities
                </h2>
                <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                  {project.slug === 'classapp'
                    ? 'Distinguishes implemented ClassApp Pro features shown above from the publicly hosted Render prototype entry.'
                    : 'Verified directly from the live platform at milkypy.com.'}
                </p>
              </div>
              <div className="space-y-4">
                {project.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                        {feat.title}
                      </h3>
                      <span className={`text-xs font-mono ${ACCENT_LABEL[project.themeAccent]}`}>
                        {feat.audience}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                      {feat.simpleSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.milestones.length > 0 && (
            <div className={project.features.length > 0 ? 'lg:col-span-5 space-y-5' : 'lg:col-span-12 space-y-5'}>
              <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Project Status Summary
              </h2>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 space-y-4">
                <ul className="space-y-3 text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                  {project.milestones.map((m) => (
                    <li key={m} className="flex items-start gap-2.5">
                      <span className={`mt-1 font-mono ${ACCENT_LABEL[project.themeAccent]}`} aria-hidden="true">
                        ·
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Optional Interactive Preview for MilkyPy Visitors */}
      {project.slug === 'milkypy' && (
        <section aria-label="Optional quick code preview">
          <MilkyPyPlayground />
        </section>
      )}

      {/* Related Work */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-black/10 dark:border-white/10 space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Connected inside J/UNIVERSE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((rel) => {
              const relPath =
                rel.slug === 'ishizaki-tech-services'
                  ? '/studio'
                  : `/work/${rel.slug}`;
              return (
                <Link
                  key={rel.id}
                  to={relPath}
                  className="rounded-xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 hover:border-black/25 dark:hover:border-white/25 transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-medium text-[#4D5363] dark:text-[#A9B1C2]">
                      {rel.category} · {rel.status}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                      {rel.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
                      {rel.shortTagline}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#4D5363] dark:text-[#A9B1C2] shrink-0" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ScreenshotLightbox
        asset={lightboxAsset}
        onClose={() => setLightboxAsset(null)}
      />
    </div>
  );
}
