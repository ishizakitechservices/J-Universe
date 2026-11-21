import React, { useEffect, useState } from 'react';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Link, useRouter } from '../utils/router';
import { useTheme } from '../utils/theme';

const PRIMARY_NAV = [
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Studio', path: '/studio' },
  { label: 'Contact', path: '/contact' },
];

const SECONDARY_NAV = [
  { label: '3D Universe', path: '/universe' },
  { label: 'ClassApp', path: '/work/classapp' },
  { label: 'MilkyPy', path: '/work/milkypy' },
  { label: 'Contact Page', path: '/contact' },
];

interface SiteHeaderProps {
  immersive?: boolean;
}

export function SiteHeader({ immersive = false }: SiteHeaderProps) {
  const { pathname, openSearch } = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const headerShellClass = immersive
    ? 'fixed top-0 inset-x-0 z-40 border-b border-[#F3F0E9]/10 bg-[#080B12]/94'
    : 'sticky top-0 z-40 border-b border-black/10 dark:border-[#F3F0E9]/10 bg-[#FAF8F4]/95 dark:bg-[#080B12]/95';

  const brandClass = immersive
    ? 'inline-flex items-center min-h-[44px] font-display text-lg font-bold tracking-tight text-[#F3F0E9] whitespace-nowrap shrink-0'
    : 'inline-flex items-center min-h-[44px] font-display text-lg font-bold tracking-tight text-[#080B12] dark:text-[#F3F0E9] whitespace-nowrap shrink-0';

  const mobileNavItems = [{ label: 'Home', path: '/' }, ...PRIMARY_NAV];

  return (
    <header className={headerShellClass}>
      <div className="mx-auto max-w-6xl px-6 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Mark (Home) */}
        <Link to="/" aria-label="J/UNIVERSE Home" className={brandClass}>
          J<span className="text-[#9286D8]">/</span>UNIVERSE
        </Link>

        {/* Zone 2: Work | About | Studio | Contact */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8"
        >
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.path);
            if (immersive) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b transition-colors ${
                    active
                      ? 'text-[#F3F0E9] border-[#9286D8]'
                      : 'text-[#F3F0E9]/78 border-transparent hover:text-[#F3F0E9]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b transition-colors ${
                  active
                    ? 'text-[#080B12] dark:text-[#F3F0E9] border-[#5E52BA] dark:border-[#9286D8]'
                    : 'text-[#4D5363] dark:text-[#A9B1C2] border-transparent hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Single subtle Search trigger on desktop + mobile drawer button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search universe"
            className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              immersive
                ? 'border-[#F3F0E9]/18 bg-[#080B12]/75 text-[#F3F0E9] hover:border-[#F3F0E9]/45'
                : 'border-black/12 dark:border-[#F3F0E9]/18 text-[#080B12] dark:text-[#F3F0E9] hover:border-black/30 dark:hover:border-[#F3F0E9]/45'
            }`}
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors ${
              immersive
                ? 'border-[#F3F0E9]/18 bg-[#080B12]/80 text-[#F3F0E9]'
                : 'border-black/12 dark:border-[#F3F0E9]/15 text-[#080B12] dark:text-[#F3F0E9]'
            }`}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-[#F3F0E9]/12 bg-[#080B12] text-[#F3F0E9] px-6 py-6 space-y-6"
        >
          <nav aria-label="Mobile primary navigation" className="grid grid-cols-1 gap-1.5">
            {mobileNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-base font-medium ${
                    active
                      ? 'bg-[#101827] text-[#F3F0E9]'
                      : 'text-[#A9B1C2] hover:text-[#F3F0E9]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#F3F0E9]/10">
            <p className="text-xs font-mono text-[#9286D8] mb-3">
              Universe Destinations
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="min-h-[44px] flex items-center px-3.5 py-2.5 rounded-lg border border-[#F3F0E9]/12 bg-[#101827]/85 text-sm font-medium text-[#F3F0E9]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F3F0E9]/10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openSearch();
              }}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#F3F0E9]/15 text-sm font-medium text-[#F3F0E9]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Search</span>
            </button>
            {!immersive && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#F3F0E9]/15 text-sm font-medium text-[#F3F0E9]"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" aria-hidden="true" />
                    <span>Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" aria-hidden="true" />
                    <span>Dark Theme</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
