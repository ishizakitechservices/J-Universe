import React from 'react';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_ENTRIES } from '../data/universeData';
import { ChapterHeader } from '../components/JourneyLine';
import { Link } from '../utils/router';

export function JournalPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-12">
      <ChapterHeader
        as="h1"
        chapter="06 / The Journal"
        title="Notes & Digital Garden"
        subtitle="A quiet reading space for reflections, product notes, and lessons learned while building."
      />

      {JOURNAL_ENTRIES.length === 0 ? (
        <section className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs text-[#5246D8] dark:text-[#9286D8]">
              Digital Garden · Publishing Soon
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              First notes are being written carefully
            </h2>
            <p className="text-base text-[#52555E] dark:text-[#A9B1C2] leading-relaxed">
              Rather than filling this space with synthetic articles, The Journal remains intentionally quiet until authentic reflections on ClassApp, MilkyPy, and independent product design are ready to share.
            </p>
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-4">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold"
            >
              <span>Explore Current Products</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]"
            >
              Suggest a topic to write about
            </Link>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {JOURNAL_ENTRIES.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-[#52555E] dark:text-[#A9B1C2]">
                <span>{entry.category}</span>
                <span aria-hidden="true">·</span>
                <span>{entry.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>{entry.readTime}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                {entry.title}
              </h3>
              <p className="text-sm text-[#52555E] dark:text-[#A9B1C2]">
                {entry.excerpt}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
