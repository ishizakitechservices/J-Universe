import { AccentWorld } from '../data/universeData';

interface PlaceholderPalette {
  base: string;
  surface: string;
  primary: string;
  secondary: string;
}

const ACCENT_PALETTES: Record<AccentWorld, PlaceholderPalette> = {
  ultraviolet: {
    base: '#090C16',
    surface: '#141B2D',
    primary: '#9286D8',
    secondary: '#D3AC70',
  },
  lavender: {
    base: '#0A0D18',
    surface: '#161D31',
    primary: '#B9A2E6',
    secondary: '#7C6CE0',
  },
  mint: {
    base: '#070E14',
    surface: '#102029',
    primary: '#7EC9B5',
    secondary: '#3E8F7B',
  },
  sand: {
    base: '#0D0B09',
    surface: '#1E1914',
    primary: '#D3AC70',
    secondary: '#9E7843',
  },
};

/**
 * Generates an ultra-compact 24x15 low-resolution SVG data URI preview
 * matched to the showcase product accent so the blurred placeholder paints
 * instantaneously with zero network overhead before fading to full resolution.
 */
export function buildLowResPlaceholderDataUri(accent: AccentWorld): string {
  const p = ACCENT_PALETTES[accent] ?? ACCENT_PALETTES.ultraviolet;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15" width="24" height="15">`,
    `<rect width="24" height="15" fill="${p.base}"/>`,
    `<rect x="1" y="1" width="5" height="13" rx="0.8" fill="${p.surface}"/>`,
    `<rect x="7" y="1" width="16" height="3" rx="0.8" fill="${p.primary}" fill-opacity="0.34"/>`,
    `<rect x="7" y="5" width="7.5" height="4.2" rx="0.8" fill="${p.surface}"/>`,
    `<rect x="15.5" y="5" width="7.5" height="4.2" rx="0.8" fill="${p.secondary}" fill-opacity="0.28"/>`,
    `<rect x="7" y="10" width="16" height="4" rx="0.8" fill="${p.surface}" fill-opacity="0.88"/>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
