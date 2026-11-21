import React from 'react';
import { JOURNEY_MILESTONES } from '../data/universeData';
import { ChapterHeader } from '../components/JourneyLine';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { Link } from '../utils/router';

export function JourneyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-12">
      <ChapterHeader
        as="h1"
        chapter="Journey"
        title="Technology journey in progress"
        subtitle="Verified milestones and background history are only published here once officially confirmed."
      />

      {JOURNEY_MILESTONES.length > 0 ? (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-10">
          <JourneyTimeline milestones={JOURNEY_MILESTONES} />
        </div>
      ) : (
        <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-8 sm:p-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Detailed timeline not yet published
          </h2>
          <p className="text-sm sm:text-base text-[#52555E] dark:text-[#A9B1C2] max-w-2xl leading-relaxed">
            Johnson Bediako Ametsitsi is a technology creator based in Ghana and founder of Ishizaki Tech Services. A detailed personal origin timeline has not been published yet; in the meantime, explore active products including ClassApp and MilkyPy.
          </p>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Link
          to="/about"
          className="font-medium text-[#5246D8] dark:text-[#9286D8] hover:underline underline-offset-4"
        >
          About Johnson
        </Link>
        <span aria-hidden="true" className="text-[#52555E] dark:text-[#A9B1C2]">
          ·
        </span>
        <Link
          to="/work"
          className="font-medium text-[#080B12] dark:text-[#F3F0E9] hover:underline underline-offset-4"
        >
          Explore Work
        </Link>
        <span aria-hidden="true" className="text-[#52555E] dark:text-[#A9B1C2]">
          ·
        </span>
        <Link
          to="/studio"
          className="font-medium text-[#080B12] dark:text-[#F3F0E9] hover:underline underline-offset-4"
        >
          Ishizaki Tech Services
        </Link>
      </div>
    </div>
  );
}
