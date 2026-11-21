import React from 'react';
import { RouterProvider, useRouter } from './utils/router';
import { ThemeProvider } from './utils/theme';
import { SiteHeader } from './components/SiteHeader';
import { CommandSearchModal } from './components/CommandSearchModal';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { UniversePage } from './pages/UniversePage';
import { AboutPage } from './pages/AboutPage';
import { StudioPage } from './pages/StudioPage';
import { JourneyPage } from './pages/JourneyPage';
import { LabPage } from './pages/LabPage';
import { JournalPage } from './pages/JournalPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

function PageView({ cleanPath }: { cleanPath: string }) {
  if (cleanPath === '/') return <HomePage />;
  if (cleanPath === '/work') return <WorkPage />;
  if (cleanPath.startsWith('/work/')) {
    const slug = cleanPath.slice('/work/'.length);
    return <ProductDetailPage slug={slug} />;
  }
  if (cleanPath === '/universe') return <UniversePage />;
  if (cleanPath === '/about') return <AboutPage />;
  if (cleanPath === '/studio') return <StudioPage />;
  if (cleanPath === '/journey') return <JourneyPage />;
  if (cleanPath === '/lab') return <LabPage />;
  if (cleanPath === '/journal') return <JournalPage />;
  if (cleanPath === '/contact') return <ContactPage />;
  if (cleanPath === '/privacy') return <PrivacyPage />;

  return <NotFoundPage />;
}

function AppShell() {
  const { pathname } = useRouter();
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const isStoryHome = cleanPath === '/';
  const isSpatialRoute = cleanPath === '/universe';
  const isImmersive = isStoryHome || isSpatialRoute;

  return (
    <div
      className={
        isSpatialRoute
          ? 'min-h-[100dvh] w-full bg-[#080B12] text-[#F3F0E9] overflow-hidden'
          : isStoryHome
          ? 'min-h-screen w-full bg-[#080B12] text-[#F3F0E9]'
          : 'min-h-screen flex flex-col bg-[#F3F0E9] text-[#080B12] dark:bg-[#080B12] dark:text-[#F3F0E9] transition-colors duration-150'
      }
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#F3F0E9] focus:text-[#080B12] text-sm font-semibold"
      >
        Skip to main content
      </a>

      <SiteHeader immersive={isImmersive} />

      <main
        id="main-content"
        className={isSpatialRoute ? 'w-full h-[100dvh]' : 'flex-1'}
      >
        <PageView cleanPath={cleanPath} />
      </main>

      {!isImmersive && <SiteFooter />}
      <CommandSearchModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppShell />
      </RouterProvider>
    </ThemeProvider>
  );
}
