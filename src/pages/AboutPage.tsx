import React from 'react';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import {
  CONFIRMED_ACHIEVEMENTS,
  CONFIRMED_SKILLS,
  ORIGIN_STORY_SECTIONS,
  PROJECTS,
  SITE_IDENTITY,
} from '../data/universeData';
import { Link } from '../utils/router';
import { JMonogram } from '../components/JMonogram';

export function AboutPage() {
  const classApp = PROJECTS.find((p) => p.slug === 'classapp')!;
  const milkyPy = PROJECTS.find((p) => p.slug === 'milkypy')!;

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-16">
      {/* Intro — Uses J. Identity (no synthetic photograph) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#5246D8] dark:text-[#9286D8]">
            <span>About</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{SITE_IDENTITY.location}</span>
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#080B12] dark:text-[#F3F0E9]">
            {SITE_IDENTITY.owner}
          </h1>

          <p className="font-display text-xl text-[#5246D8] dark:text-[#9286D8]">
            {SITE_IDENTITY.role}
          </p>

          <p className="text-lg text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed max-w-2xl">
            {SITE_IDENTITY.approvedBiography}
          </p>
        </div>

        <div className="lg:col-span-5 flex lg:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-8 sm:p-10 space-y-8">
            <JMonogram size="xl" showOrbit interactive className="text-[#080B12] dark:text-[#F3F0E9]" />
            <div className="space-y-1.5 border-t border-black/10 dark:border-white/10 pt-5">
              <p className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                {SITE_IDENTITY.brand}
              </p>
              <p className="font-mono text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                {SITE_IDENTITY.location} · {SITE_IDENTITY.studio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work & Audience Clarity */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-7 space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-xs text-[#5246D8] dark:text-[#9286D8]">
              Featured Projects
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Learning & education work
            </h2>
            <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              Current public projects shared alongside their real stage of development.
            </p>
          </div>

          <div className="space-y-3 border-t border-black/10 dark:border-white/10 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {classApp.name}
                </p>
                <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                  {classApp.status} · {classApp.publicIdentity}
                </p>
              </div>
              <Link
                to="/work/classapp"
                className="min-h-[44px] inline-flex items-center px-1 text-xs font-semibold text-[#6D48B8] dark:text-[#B9A2E6] hover:underline underline-offset-4 whitespace-nowrap"
              >
                Explore
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-black/8 dark:border-white/8 pt-3">
              <div>
                <p className="font-display font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {milkyPy.name}
                </p>
                <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2]">
                  {milkyPy.status} · Python learning website
                </p>
              </div>
              {milkyPy.liveUrl && (
                <a
                  href={milkyPy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1 px-1 text-xs font-semibold text-[#167A5B] dark:text-[#7EC9B5] hover:underline underline-offset-4 whitespace-nowrap"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-7 space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-xs text-[#8A6024] dark:text-[#D3AC70]">
              Technology Initiative & Approach
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              {SITE_IDENTITY.studio}
            </h2>
            <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {SITE_IDENTITY.studioDescription}
            </p>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-4 space-y-2">
            <p className="text-xs font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Presented plainly for every visitor
            </p>
            <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              Whether you are visiting as a student, teacher, recruiter, business owner, developer, potential collaborator, or curious guest, every page uses plain language first with optional technical details kept expandable.
            </p>
          </div>
        </div>
      </section>

      {/* Optional Origin Story / Skills / Achievements render only when supplied */}
      {ORIGIN_STORY_SECTIONS.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Background & Origin Story
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORIGIN_STORY_SECTIONS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 space-y-2"
              >
                <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {(CONFIRMED_SKILLS.length > 0 || CONFIRMED_ACHIEVEMENTS.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CONFIRMED_SKILLS.length > 0 && (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 space-y-3">
              <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Skills
              </h2>
              <ul className="space-y-1.5 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
                {CONFIRMED_SKILLS.map((skill) => (
                  <li key={skill}>· {skill}</li>
                ))}
              </ul>
            </div>
          )}
          {CONFIRMED_ACHIEVEMENTS.length > 0 && (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 space-y-3">
              <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Achievements
              </h2>
              <ul className="space-y-1.5 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
                {CONFIRMED_ACHIEVEMENTS.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/work"
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold"
        >
          <span>Explore My Work</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          to="/contact"
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-white/15 text-sm font-medium text-[#080B12] dark:text-[#F3F0E9]"
        >
          <span>Get in Touch</span>
        </Link>
      </div>
    </div>
  );
}
