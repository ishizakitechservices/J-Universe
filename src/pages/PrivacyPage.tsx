import React from 'react';
import { SITE_IDENTITY } from '../data/universeData';
import { ChapterHeader } from '../components/JourneyLine';

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-8 pt-12 space-y-10">
      <ChapterHeader
        as="h1"
        chapter="Site Notice"
        title="Privacy & Local Preferences"
        subtitle="A straightforward summary of how J/UNIVERSE handles your visit."
      />

      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-7 sm:p-10 space-y-6 text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-2">
            No Tracking or Advertising Cookies
          </h2>
          <p>
            J/UNIVERSE does not use behavioral advertising trackers, third-party analytics profiles, or hidden background telemetry.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-2">
            Theme Preference Storage
          </h2>
          <p>
            When you switch between Light, Dark, and System themes, your preference is stored locally in your browser (<code className="font-mono text-xs">localStorage</code>) solely so the site remembers how you prefer to read it.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-2">
            Contact Messages
          </h2>
          <p>
            Messages prepared on the Contact page are composed directly for your own email client to send to{' '}
            <a
              href={`mailto:${SITE_IDENTITY.email}`}
              className="underline underline-offset-4 text-[#080B12] dark:text-[#F3F0E9]"
            >
              {SITE_IDENTITY.email}
            </a>
            . Nothing is transmitted or stored in an external database by this website.
          </p>
        </div>
      </div>
    </div>
  );
}
