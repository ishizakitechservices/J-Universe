import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import {
  JOURNAL_ENTRIES,
  PROJECTS,
  UNIVERSE_DESTINATIONS,
} from '../data/universeData';
import { searchUniverse } from '../utils/portfolioLogic';
import { useRouter } from '../utils/router';

export function CommandSearchModal() {
  const { isSearchOpen, closeSearch, navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () =>
      searchUniverse(
        query,
        UNIVERSE_DESTINATIONS,
        PROJECTS,
        JOURNAL_ENTRIES
      ),
    [query]
  );

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setActiveIndex(0);
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => window.clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length === 0 ? 0 : (prev + 1) % results.length
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length === 0
            ? 0
            : (prev - 1 + results.length) % results.length
        );
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        navigate(results[activeIndex].path);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, results, activeIndex, closeSearch, navigate]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#080B12]/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="universe-search-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-black/15 dark:border-white/15 bg-[#FAF8F4] dark:bg-[#101827] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/10 dark:border-white/10">
          <Search
            className="w-5 h-5 text-[#52555E] dark:text-[#A9B1C2] shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="universe-search-input" id="universe-search-title" className="sr-only">
            Search J/UNIVERSE destinations and projects
          </label>
          <input
            ref={inputRef}
            id="universe-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ClassApp, MilkyPy, Ishizaki Tech Services, About..."
            className="w-full bg-transparent text-sm sm:text-base text-[#080B12] dark:text-[#F3F0E9] placeholder:text-[#52555E] dark:placeholder:text-[#A9B1C2] focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#52555E] dark:text-[#A9B1C2] hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-[#080B12] dark:text-[#F3F0E9]">
                No destinations matched "{query}"
              </p>
              <p className="mt-1 text-xs text-[#52555E] dark:text-[#A9B1C2]">
                Try searching for ClassApp, MilkyPy, Ishizaki Tech Services, or About.
              </p>
            </div>
          ) : (
            <ul role="listbox" aria-label="Search results" className="space-y-1">
              {results.map((item, idx) => {
                const selected = idx === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-left transition-colors ${
                        selected
                          ? 'bg-[#EAE6DC] dark:bg-[#192338]'
                          : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] truncate">
                            {item.title}
                          </span>
                          <span aria-hidden="true" className="text-xs text-[#52555E] dark:text-[#A9B1C2]">
                            ·
                          </span>
                          <span className="text-xs text-[#5246D8] dark:text-[#9286D8] whitespace-nowrap">
                            {item.kind}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#52555E] dark:text-[#A9B1C2] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 text-[#52555E] dark:text-[#A9B1C2] shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-5 py-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-[#52555E] dark:text-[#A9B1C2]">
          <span>Use arrow keys to choose, Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
