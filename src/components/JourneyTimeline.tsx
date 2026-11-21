import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AccentWorld, JourneyMilestone } from '../data/universeData';
import { Link } from '../utils/router';

interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
}

const DOT_ACCENT: Record<AccentWorld, string> = {
  ultraviolet: 'bg-[#5246D8] dark:bg-[#9286D8]',
  lavender: 'bg-[#6D48B8] dark:bg-[#B9A2E6]',
  mint: 'bg-[#167A5B] dark:bg-[#7EC9B5]',
  sand: 'bg-[#8A6024] dark:bg-[#D3AC70]',
};

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <ol className="relative space-y-8">
      {milestones.map((item, idx) => (
        <li
          key={item.id}
          className="relative pl-8 sm:pl-10 pb-8 border-b border-black/10 dark:border-white/10 last:border-b-0 last:pb-0"
        >
          {/* Vertical Journey Connector */}
          {idx < milestones.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-4 bottom-0 w-px bg-black/15 dark:bg-white/15"
            />
          )}

          {/* Node Marker */}
          <span
            aria-hidden="true"
            className={`absolute left-0 top-2 w-4 h-4 rounded-full ring-4 ring-[#F3F0E9] dark:ring-[#101827] ${DOT_ACCENT[item.accent]}`}
          />

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#52555E] dark:text-[#A9B1C2] mb-1.5">
            <span>{item.chapter}</span>
            <span aria-hidden="true">·</span>
            <span>{item.periodLabel}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            {item.title}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-[#52555E] dark:text-[#A9B1C2] max-w-2xl leading-relaxed">
            {item.description}
          </p>

          {item.linkPath && item.linkLabel && (
            <div className="mt-4">
              <Link
                to={item.linkPath}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5246D8] dark:text-[#9286D8] hover:underline underline-offset-4"
              >
                <span>{item.linkLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
