import React, { useEffect, useState } from 'react';
import { Expand } from 'lucide-react';
import { AccentWorld } from '../data/universeData';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  accent?: AccentWorld;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
  onInspect?: () => void;
  inspectLabel?: string;
}

const ACCENT_SURFACE: Record<AccentWorld, string> = {
  ultraviolet: 'from-[#9286D8]/20 via-[#EAE6DC] to-[#F3F0E9] dark:via-[#101827] dark:to-[#080B12]',
  lavender: 'from-[#B9A2E6]/25 via-[#EAE6DC] to-[#F3F0E9] dark:via-[#101827] dark:to-[#080B12]',
  mint: 'from-[#7EC9B5]/25 via-[#EAE6DC] to-[#F3F0E9] dark:via-[#101827] dark:to-[#080B12]',
  sand: 'from-[#D3AC70]/25 via-[#EAE6DC] to-[#F3F0E9] dark:via-[#101827] dark:to-[#080B12]',
};

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  accent = 'ultraviolet',
  aspectClass = 'aspect-video',
  className = '',
  priority = false,
  onInspect,
  inspectLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br ${ACCENT_SURFACE[accent]} ${aspectClass} flex items-center justify-center p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center">
          <div className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            {fallbackTitle}
          </div>
          <p className="mt-1 text-xs text-[#4D5363] dark:text-[#A9B1C2]">
            Visual preview
          </p>
        </div>
      </div>
    );
  }

  const imageContent = (
    <>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
      />
      {onInspect && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080B12]/88 border border-[#F3F0E9]/18 text-[11px] font-medium text-[#F3F0E9] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
        >
          <Expand className="w-3 h-3" />
          <span>Expand</span>
        </span>
      )}
    </>
  );

  if (onInspect) {
    return (
      <button
        type="button"
        onClick={onInspect}
        aria-label={inspectLabel ?? `Inspect full screenshot of ${fallbackTitle}`}
        className={`group relative block w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[#EAE6DC] dark:bg-[#101827] ${aspectClass} text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#9286D8] ${className}`}
      >
        {imageContent}
      </button>
    );
  }

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[#EAE6DC] dark:bg-[#101827] ${aspectClass} ${className}`}
    >
      {imageContent}
    </div>
  );
}
