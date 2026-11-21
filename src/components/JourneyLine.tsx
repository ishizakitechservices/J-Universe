import React from 'react';

interface ChapterHeaderProps {
  chapter: string;
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
}

export function ChapterHeader({
  chapter,
  title,
  subtitle,
  as = 'h2',
}: ChapterHeaderProps) {
  const HeadingTag = as;
  const headingClass =
    as === 'h1'
      ? 'font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#080B12] dark:text-[#F3F0E9] max-w-2xl'
      : 'font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#080B12] dark:text-[#F3F0E9] max-w-2xl';

  return (
    <div className="mb-8 sm:mb-10 border-b border-black/10 dark:border-white/10 pb-6">
      <p className="text-xs font-semibold tracking-wide text-[#5246D8] dark:text-[#9286D8] mb-2">
        {chapter}
      </p>
      <HeadingTag className={headingClass}>{title}</HeadingTag>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-[#4D5363] dark:text-[#A9B1C2] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function JourneyLineDivider() {
  return (
    <div
      className="mx-auto max-w-6xl px-6 sm:px-8 py-2"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full border border-[#5246D8] dark:border-[#9286D8]" />
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
      </div>
    </div>
  );
}
