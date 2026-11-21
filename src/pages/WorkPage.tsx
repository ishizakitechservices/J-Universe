import React, { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import { PROJECTS, ProjectCategory } from '../data/universeData';
import { filterProjects } from '../utils/portfolioLogic';
import { Link } from '../utils/router';
import { ChapterHeader } from '../components/JourneyLine';
import { ResilientImage } from '../components/ResilientImage';
import { LightboxAsset, ScreenshotLightbox } from '../components/ScreenshotLightbox';

const CATEGORIES: Array<ProjectCategory | 'All'> = [
  'All',
  'Flagship Product',
  'Learning Tool',
  'Studio Initiative',
];

export function WorkPage() {
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [lightboxAsset, setLightboxAsset] = useState<LightboxAsset | null>(null);

  const filtered = useMemo(
    () =>
      filterProjects(PROJECTS, {
        category,
        query,
        includeLab: false,
      }),
    [category, query]
  );

  const labCount = useMemo(
    () => filterProjects(PROJECTS, { labOnly: true }).length,
    []
  );

  const productItems = useMemo(
    () => filtered.filter((p) => p.slug !== 'ishizaki-tech-services'),
    [filtered]
  );

  const studioItem = useMemo(
    () => filtered.find((p) => p.slug === 'ishizaki-tech-services') ?? null,
    [filtered]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-10">
      <ChapterHeader
        as="h1"
        chapter="Portfolio"
        title="Work & Digital Products"
        subtitle="Projects and initiatives created by Johnson Bediako Ametsitsi."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter products by category"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#EAE6DC] dark:bg-[#101827] border border-black/10 dark:border-white/10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                  : 'text-[#4D5363] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-[#4D5363] dark:text-[#A9B1C2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="work-filter-search" className="sr-only">
            Filter products by keyword
          </label>
          <input
            id="work-filter-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter products..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] text-sm text-[#080B12] dark:text-[#F3F0E9] placeholder:text-[#4D5363] dark:placeholder:text-[#A9B1C2]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            No products match your filter
          </p>
          <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2]">
            Try clearing the keyword search or switching back to All categories.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setQuery('');
              }}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {productItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {productItems.map((project) => {
                const thumb = project.screenshots[0];
                return (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-5">
                      {thumb && (
                        <ResilientImage
                          src={thumb.src}
                          alt={thumb.alt}
                          fallbackTitle={project.name}
                          accent={project.themeAccent}
                          aspectClass="aspect-[16/10]"
                          priority
                          onInspect={() =>
                            setLightboxAsset({
                              src: thumb.src,
                              alt: thumb.alt,
                              title: project.name,
                              status: project.status,
                              caption: thumb.caption,
                              liveUrl: project.liveUrl,
                              liveLabel: project.primaryActionLabel,
                              accent: project.themeAccent,
                            })
                          }
                          inspectLabel={`Inspect full screenshot of ${project.name}`}
                        />
                      )}

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                          <span>{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                            {project.status}
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#080B12] dark:text-[#F3F0E9]">
                          {project.name}
                        </h2>
                        <p className="text-sm font-medium text-[#5246D8] dark:text-[#9286D8]">
                          {project.shortTagline}
                        </p>
                        <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                          {project.simpleDescription.whatItIs}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={`/work/${project.slug}`}
                        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] hover:text-[#5246D8] dark:hover:text-[#9286D8] transition-colors"
                      >
                        <span>Explore {project.name}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-medium text-[#5246D8] dark:text-[#9286D8] hover:underline underline-offset-4"
                        >
                          <span>{project.primaryActionLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {studioItem && (
            <article className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-semibold text-[#8A6024] dark:text-[#D3AC70]">
                  Technology Initiative
                </p>
                <h2 className="font-display text-2xl font-bold text-[#080B12] dark:text-[#F3F0E9]">
                  {studioItem.name}
                </h2>
                <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                  {studioItem.simpleDescription.whatItIs}
                </p>
              </div>
              <Link
                to="/studio"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                <span>Explore Studio</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </article>
          )}
        </div>
      )}

      {labCount > 0 && (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Looking for prototypes and early ideas?
            </h3>
            <p className="mt-1 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
              Visit The Lab to see ongoing experiments and future product concepts.
            </p>
          </div>
          <Link
            to="/lab"
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 text-sm font-medium text-[#080B12] dark:text-[#F3F0E9] hover:border-black/35 dark:hover:border-white/35 whitespace-nowrap shrink-0"
          >
            <span>Open The Lab</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      <ScreenshotLightbox
        asset={lightboxAsset}
        onClose={() => setLightboxAsset(null)}
      />
    </div>
  );
}
