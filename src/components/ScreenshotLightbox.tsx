import React, { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { AccentWorld } from '../data/universeData';

export interface LightboxAsset {
  src: string;
  alt: string;
  title: string;
  status?: string;
  caption?: string;
  liveUrl?: string;
  liveLabel?: string;
  accent?: AccentWorld;
}

interface ScreenshotLightboxProps {
  asset: LightboxAsset | null;
  onClose: () => void;
}

const ACCENT_TAG: Record<AccentWorld, string> = {
  ultraviolet: 'text-[#9286D8]',
  lavender: 'text-[#B9A2E6]',
  mint: 'text-[#7EC9B5]',
  sand: 'text-[#D3AC70]',
};

export function ScreenshotLightbox({ asset, onClose }: ScreenshotLightboxProps) {
  useEffect(() => {
    if (!asset) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [asset, onClose]);

  if (!asset) return null;

  const accentClass = asset.accent ? ACCENT_TAG[asset.accent] : 'text-[#9286D8]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${asset.title} full screenshot viewer`}
      className="fixed inset-0 z-[80] bg-[#05070D] flex flex-col justify-between p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="mx-auto w-full max-w-6xl flex items-center justify-between gap-4 pb-4 border-b border-[#F3F0E9]/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className={`text-xs font-semibold ${accentClass}`}>
            {asset.title}
            {asset.status ? ` · ${asset.status}` : ''}
          </p>
          {asset.caption && (
            <p className="text-xs sm:text-sm text-[#A9B1C2] truncate mt-0.5">
              {asset.caption}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {asset.liveUrl && (
            <a
              href={asset.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F3F0E9] text-[#080B12] text-xs font-semibold hover:bg-[#D3AC70] transition-colors whitespace-nowrap"
            >
              <span>{asset.liveLabel ?? 'Open Live'}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close full screenshot viewer"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-[#F3F0E9]/20 bg-[#101827] text-[#F3F0E9] hover:border-[#F3F0E9]/50 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Centered High-Resolution Capture */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center py-4 sm:py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={asset.src}
          alt={asset.alt}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl border border-[#F3F0E9]/16 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs font-mono text-[#A9B1C2] pt-2">
        Press ESC or click outside to close
      </div>
    </div>
  );
}
