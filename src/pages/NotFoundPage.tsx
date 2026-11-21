import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { JMonogram } from '../components/JMonogram';
import { Link } from '../utils/router';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-8 py-20 text-center space-y-6">
      <div className="flex justify-center">
        <JMonogram size="lg" showOrbit />
      </div>
      <p className="text-xs font-semibold text-[#5246D8] dark:text-[#9286D8]">
        404 · Page Not Found
      </p>
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#080B12] dark:text-[#F3F0E9]">
        This page could not be found
      </h1>
      <p className="text-base text-[#4D5363] dark:text-[#A9B1C2] max-w-md mx-auto">
        The page you tried to open does not exist or may have moved. Return home or open the interactive 3D map to explore.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/universe"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 text-sm font-medium text-[#080B12] dark:text-[#F3F0E9]"
        >
          <Compass className="w-4 h-4" aria-hidden="true" />
          <span>Open Universe Explorer</span>
        </Link>
      </div>
    </div>
  );
}
