import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Expand, Lock } from 'lucide-react';
import { AccentWorld, StageAvailability } from '../data/universeData';
import { buildLowResPlaceholderDataUri } from '../utils/imagePlaceholder';

const loadedImageSrcs = new Set<string>();

interface BrowserMockupFrameProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  urlHint: string;
  availability?: StageAvailability;
  accent?: AccentWorld;
  aspectClass?: string;
  objectFit?: 'contain' | 'cover';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  blurredPlaceholder?: boolean;
  placeholderSrc?: string;
  onInspect?: () => void;
  inspectLabel?: string;
  className?: string;
}

const ACCENT_SURFACE: Record<AccentWorld, string> = {
  ultraviolet: 'from-[#9286D8]/20 via-[#101827] to-[#080B12]',
  lavender: 'from-[#B9A2E6]/25 via-[#101827] to-[#080B12]',
  mint: 'from-[#7EC9B5]/25 via-[#101827] to-[#080B12]',
  sand: 'from-[#D3AC70]/25 via-[#101827] to-[#080B12]',
};

const AVAILABILITY_TONE: Record<StageAvailability, string> = {
  Live: 'text-[#7EC9B5]',
  'ClassApp Pro Build': 'text-[#B9A2E6]',
  'Public Prototype': 'text-[#D3AC70]',
  'In Development': 'text-[#A9B1C2]',
};

export function BrowserMockupFrame({
  src,
  alt,
  fallbackTitle,
  urlHint,
  availability,
  accent = 'ultraviolet',
  aspectClass = 'aspect-[16/10]',
  objectFit = 'contain',
  priority = false,
  loading,
  blurredPlaceholder = true,
  placeholderSrc,
  onInspect,
  inspectLabel,
  className = '',
}: BrowserMockupFrameProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => Boolean(src && loadedImageSrcs.has(src)));

  const resolvedLoading: 'lazy' | 'eager' = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedPlaceholderSrc = useMemo(
    () => placeholderSrc ?? buildLowResPlaceholderDataUri(accent),
    [accent, placeholderSrc]
  );

  useEffect(() => {
    setHasError(false);
    if (!src) {
      setIsLoaded(false);
      return;
    }
    if (loadedImageSrcs.has(src)) {
      setIsLoaded(true);
      return;
    }
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      loadedImageSrcs.add(src);
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  const handleLoad = () => {
    if (src) {
      loadedImageSrcs.add(src);
    }
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const viewportBody = hasError || !src ? (
    <div
      className={`h-full w-full bg-gradient-to-br ${ACCENT_SURFACE[accent]} flex items-center justify-center p-6`}
      role="img"
      aria-label={alt}
    >
      <div className="text-center">
        <div className="font-display text-xl font-semibold text-[#F3F0E9]">
          {fallbackTitle}
        </div>
        <p className="mt-1 text-xs text-[#A9B1C2]">Screenshot preview</p>
      </div>
    </div>
  ) : (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(146,134,216,0.09),#060911_76%)]">
      {blurredPlaceholder && (
        <img
          src={resolvedPlaceholderSrc}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-500 motion-reduce:transition-none ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={resolvedLoading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`relative z-10 h-full w-full ${
          objectFit === 'contain' ? 'object-contain p-1 sm:p-1.5' : 'object-cover object-top'
        } transition-[opacity,transform] duration-500 motion-reduce:transition-none group-hover:scale-[1.01] ${
          isLoaded || !blurredPlaceholder ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#F3F0E9]/16 bg-[#090D16] shadow-[0_18px_48px_rgba(0,0,0,0.48)] ${className}`}
    >
      {/* Top Browser Chrome */}
      <div className="h-8 px-3 border-b border-[#F3F0E9]/10 bg-[#0D1320] flex items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-[#F3F0E9]/22" />
          <span className="w-2 h-2 rounded-full bg-[#F3F0E9]/16" />
          <span className="w-2 h-2 rounded-full bg-[#F3F0E9]/12" />
        </div>

        <div className="min-w-0 flex-1 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 max-w-full truncate px-2.5 py-0.5 rounded bg-[#070A12] border border-[#F3F0E9]/8 text-[#A9B1C2]">
            <Lock className="w-2.5 h-2.5 shrink-0 opacity-65" aria-hidden="true" />
            <span className="truncate">{urlHint}</span>
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {availability && (
            <span className={`hidden sm:inline font-medium ${AVAILABILITY_TONE[availability]}`}>
              {availability}
            </span>
          )}
        </div>
      </div>

      {/* Zero-CLS Framed Screenshot Viewport */}
      {onInspect ? (
        <button
          type="button"
          onClick={onInspect}
          aria-label={inspectLabel ?? `Inspect full screenshot of ${fallbackTitle}`}
          className={`group relative block w-full ${aspectClass} bg-[#060911] text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#9286D8]`}
        >
          {viewportBody}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080B12]/90 border border-[#F3F0E9]/20 text-[11px] font-medium text-[#F3F0E9] opacity-85 sm:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          >
            <Expand className="w-3 h-3" />
            <span>Expand</span>
          </span>
        </button>
      ) : (
        <div className={`group relative w-full ${aspectClass} bg-[#060911]`}>
          {viewportBody}
        </div>
      )}
    </div>
  );
}
