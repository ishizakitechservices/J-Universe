import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS, SITE_IDENTITY } from '../data/universeData';
import { Link } from '../utils/router';
import { ChapterHeader } from '../components/JourneyLine';
import { JMonogram } from '../components/JMonogram';
import { TwoLayerExplainer } from '../components/TwoLayerExplainer';

export function StudioPage() {
  const studioProject = PROJECTS.find((p) => p.slug === 'ishizaki-tech-services')!;
  const flagshipProducts = PROJECTS.filter(
    (p) => p.slug === 'classapp' || p.slug === 'milkypy'
  );

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-16">
      <section className="space-y-8">
        <ChapterHeader
          as="h1"
          chapter="Technology Initiative"
          title={SITE_IDENTITY.studio}
          subtitle={SITE_IDENTITY.studioDescription}
        />

        <div className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-7 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex items-center justify-center py-6 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
            <JMonogram size="xl" showOrbit interactive className="text-[#080B12] dark:text-[#F3F0E9]" />
          </div>

          <div className="md:col-span-8 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#8A6024] dark:text-[#D3AC70]">
                {SITE_IDENTITY.studioTagline}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#080B12] dark:text-[#F3F0E9]">
                Founded by {SITE_IDENTITY.owner}
              </h2>
              <p className="text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                {studioProject.detailedDescription}
              </p>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-mono text-[#4D5363] dark:text-[#A9B1C2]">
                Based in {SITE_IDENTITY.location} · Contact: {SITE_IDENTITY.email}
              </p>
              <Link
                to="/contact"
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-[#8A6024] dark:text-[#D3AC70] hover:underline underline-offset-4 whitespace-nowrap"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TwoLayerExplainer project={studioProject} />

      <section className="space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
          Projects Connected to {SITE_IDENTITY.studio}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flagshipProducts.map((prod) => (
            <Link
              key={prod.id}
              to={`/work/${prod.slug}`}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 hover:border-black/25 dark:hover:border-white/25 transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <p className="text-xs font-mono text-[#4D5363] dark:text-[#A9B1C2]">
                  {prod.category} · {prod.status}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {prod.name}
                </h3>
                <p className="mt-2 text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                  {prod.simpleDescription.whatItIs}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5246D8] dark:text-[#9286D8]">
                <span>Explore the Project</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
