import React, { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { SITE_IDENTITY } from '../data/universeData';
import { ChapterHeader } from '../components/JourneyLine';
import { ContactComposer } from '../components/ContactComposer';
import { copyTextSafely } from '../utils/contactSubmission';

export function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    const ok = await copyTextSafely(SITE_IDENTITY.email);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-12">
      <ChapterHeader
        as="h1"
        chapter="Connect"
        title="Have an idea worth building?"
        subtitle="Message Johnson Bediako Ametsitsi or Ishizaki Tech Services directly — no email address required."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Direct Contact Column */}
        <aside className="lg:col-span-5 rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-7 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Direct Contact
            </h2>
            <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              Reach {SITE_IDENTITY.owner} ({SITE_IDENTITY.location}) about ClassApp, MilkyPy, or {SITE_IDENTITY.studio}.
            </p>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-5 space-y-3">
            <p className="text-xs font-semibold text-[#4D5363] dark:text-[#A9B1C2]">
              Official Inbox
            </p>
            <div className="flex items-center gap-2 text-sm font-mono text-[#080B12] dark:text-[#F3F0E9] break-all">
              <Mail className="w-4 h-4 text-[#5246D8] dark:text-[#9286D8] shrink-0" aria-hidden="true" />
              <span>{SITE_IDENTITY.email}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={`mailto:${SITE_IDENTITY.email}`}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-xs font-semibold whitespace-nowrap"
              >
                <span>Open Email App</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-black/12 dark:border-white/12 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9] whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#167A5B] dark:text-[#7EC9B5]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-5 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#4D5363] dark:text-[#A9B1C2]">
              X Account
            </span>
            <a
              href={SITE_IDENTITY.social.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${SITE_IDENTITY.social.xHandle} on X`}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-mono font-medium text-[#080B12] dark:text-[#F3F0E9] hover:text-[#5246D8] dark:hover:text-[#9286D8] transition-colors whitespace-nowrap"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-3.5 h-3.5 shrink-0"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{SITE_IDENTITY.social.xHandle}</span>
            </a>
          </div>

          <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed border-t border-black/10 dark:border-white/10 pt-5">
            Share feedback, project questions, or collaboration ideas anonymously or add an optional email or X handle if you would like a response.
          </p>
        </aside>

        {/* Server-backed Contact Form */}
        <div className="lg:col-span-7 rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-7 sm:p-8">
          <ContactComposer variant="full" />
        </div>
      </div>
    </div>
  );
}
