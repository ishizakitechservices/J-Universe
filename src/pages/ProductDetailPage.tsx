import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AccentWorld, PROJECTS } from '../data/universeData';
import { getRelatedProjects } from '../utils/portfolioLogic';
import { Link } from '../utils/router';
import { ResilientImage } from '../components/ResilientImage';
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
  const heroShot = project.screenshots[0];
  const extraShots = project.screenshots.slice(1);

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
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
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
              {project.name}
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
            <ResilientImage
              src={heroShot.src}
              alt={heroShot.alt}
              fallbackTitle={project.name}
              accent={project.themeAccent}
              aspectClass="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[260px]"
              priority
              onInspect={() =>
                setLightboxAsset({
                  src: heroShot.src,
                  alt: heroShot.alt,
                  title: project.name,
                  status: project.status,
                  caption: heroShot.caption,
                  liveUrl: project.liveUrl,
                  liveLabel: project.primaryActionLabel,
                  accent: project.themeAccent,
                })
              }
              inspectLabel={`Inspect full screenshot of ${project.name}`}
              className="w-full"
            />
            <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
              {heroShot.caption}
            </p>
          </div>
        )}
      </header>

      {/* Honest Prototype Clarification for ClassApp */}
      {project.slug === 'classapp' && (
        <section
          aria-label="ClassApp prototype notice"
          className="rounded-2xl border border-[#6D48B8]/25 dark:border-[#B9A2E6]/25 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8 space-y-3"
        >
          <p className="text-xs font-semibold text-[#6D48B8] dark:text-[#B9A2E6]">
            Prototype Notice · ClassApp - Student Learning
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Verified scope vs. unconfirmed features
          </h2>
          <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed max-w-3xl">
            Verified: ClassApp is publicly reachable as an early student-learning prototype at{' '}
            <span className="font-mono text-xs text-[#080B12] dark:text-[#F3F0E9]">
              classapp-rbci.onrender.com
            </span>
            . Unconfirmed: Detailed classroom workflows and final product capabilities are still evolving and have not been finalized or claimed as complete.
          </p>
        </section>
      )}

      {/* Two-Layer Explanation (Simple vs Optional Expandable Technical Details) */}
      <TwoLayerExplainer project={project} />

      {/* Additional Genuine Screenshots (e.g. MilkyPy Lessons view) */}
      {extraShots.length > 0 && (
        <section aria-label={`${project.name} screenshots`} className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Inside {project.name}
          </h2>
          <div className={extraShots.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'max-w-4xl'}>
            {extraShots.map((shot) => (
              <figure
                key={shot.src}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-4 sm:p-5 space-y-3"
              >
                <ResilientImage
                  src={shot.src}
                  alt={shot.alt}
                  fallbackTitle={project.name}
                  accent={project.themeAccent}
                  aspectClass="aspect-[16/9]"
                  onInspect={() =>
                    setLightboxAsset({
                      src: shot.src,
                      alt: shot.alt,
                      title: project.name,
                      status: project.status,
                      caption: shot.caption,
                      liveUrl: project.liveUrl,
                      liveLabel: project.primaryActionLabel,
                      accent: project.themeAccent,
                    })
                  }
                  inspectLabel={`Inspect ${shot.caption}`}
                />
                <figcaption className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                  {shot.caption}
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
                    ? 'Verified from public prototype inspection only; deeper in-app features remain unconfirmed.'
                    : 'Verified directly from the live public platform.'}
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
                      <span className="text-xs font-medium text-[#4D5363] dark:text-[#A9B1C2]">
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
                Verified Project Summary
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
