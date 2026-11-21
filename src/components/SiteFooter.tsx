import React from 'react';
import { SITE_IDENTITY } from '../data/universeData';
import { Link, useRouter } from '../utils/router';
import { useTheme } from '../utils/theme';
import { JMonogram } from './JMonogram';

export function SiteFooter({ flush = false }: { flush?: boolean }) {
  const { openSearch } = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <footer
      className={`${
        flush ? 'mt-0' : 'mt-24'
      } border-t border-black/10 dark:border-[#F3F0E9]/10 bg-[#FAF8F4] dark:bg-[#0B101B]`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <JMonogram size="sm" />
              <span className="font-display text-lg font-bold tracking-tight text-[#080B12] dark:text-[#F3F0E9]">
                {SITE_IDENTITY.brand}
              </span>
            </div>
            <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] max-w-sm leading-relaxed">
              Portfolio of {SITE_IDENTITY.owner}, based in {SITE_IDENTITY.location} and founder of {SITE_IDENTITY.studio}.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3.5 py-2 rounded-lg border border-black/12 dark:border-[#F3F0E9]/14 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9] hover:border-black/30 dark:hover:border-[#F3F0E9]/35 transition-colors whitespace-nowrap"
              >
                Switch to {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Theme
              </button>
              <button
                type="button"
                onClick={openSearch}
                className="px-3.5 py-2 rounded-lg border border-black/12 dark:border-[#F3F0E9]/14 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9] hover:border-black/30 dark:hover:border-[#F3F0E9]/35 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          {/* Projects */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="font-display text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Projects & Studio
            </h2>
            <ul className="space-y-2.5 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
              <li>
                <Link to="/work" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  All Work
                </Link>
              </li>
              <li>
                <Link to="/work/classapp" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  ClassApp (Prototype)
                </Link>
              </li>
              <li>
                <Link to="/work/milkypy" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  MilkyPy (Live)
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  Ishizaki Tech Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="font-display text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Pages
            </h2>
            <ul className="space-y-2.5 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
              <li>
                <Link to="/" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  About
                </Link>
              </li>
              <li>
                <Link to="/universe" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  3D Map
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="font-display text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Connect
            </h2>
            <ul className="space-y-2.5 text-sm text-[#4D5363] dark:text-[#A9B1C2]">
              <li>
                <Link to="/contact" className="hover:text-[#080B12] dark:hover:text-[#F3F0E9]">
                  Contact Form
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_IDENTITY.email}`}
                  className="hover:text-[#080B12] dark:hover:text-[#F3F0E9] break-words"
                >
                  {SITE_IDENTITY.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_IDENTITY.social.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${SITE_IDENTITY.social.xHandle} on X`}
                  className="inline-flex items-center gap-2 hover:text-[#080B12] dark:hover:text-[#F3F0E9] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 shrink-0"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="font-mono text-xs">{SITE_IDENTITY.social.xHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-black/10 dark:border-[#F3F0E9]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#4D5363] dark:text-[#A9B1C2]">
          <p>
            © {new Date().getFullYear()} {SITE_IDENTITY.owner} · {SITE_IDENTITY.studio} · {SITE_IDENTITY.location}
          </p>
          <p>{SITE_IDENTITY.messages.human}</p>
        </div>
      </div>
    </footer>
  );
}
