import React, { Suspense, lazy } from 'react';
import { RouterProvider, useRouter } from './utils/router';
import { ThemeProvider } from './utils/theme';
import { SiteHeader } from './components/SiteHeader';
import { CommandSearchModal } from './components/CommandSearchModal';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';

const WorkPage = lazy(() =>
  import('./pages/WorkPage').then((m) => ({ default: m.WorkPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const UniversePage = lazy(() =>
  import('./pages/UniversePage').then((m) => ({ default: m.UniversePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const StudioPage = lazy(() =>
  import('./pages/StudioPage').then((m) => ({ default: m.StudioPage }))
);
const JourneyPage = lazy(() =>
  import('./pages/JourneyPage').then((m) => ({ default: m.JourneyPage }))
);
const LabPage = lazy(() =>
  import('./pages/LabPage').then((m) => ({ default: m.LabPage }))
);
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function PageView({ cleanPath }: { cleanPath: string }) {
  if (cleanPath === '/') return <HomePage />;

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-xs font-mono text-[#A9B1C2]">
          Loading…
        </div>
      }
    >
      {cleanPath === '/work' ? (
        <WorkPage />
      ) : cleanPath.startsWith('/work/') ? (
        <ProductDetailPage slug={cleanPath.slice('/work/'.length)} />
      ) : cleanPath === '/universe' ? (
        <UniversePage />
      ) : cleanPath === '/about' ? (
        <AboutPage />
      ) : cleanPath === '/studio' ? (
        <StudioPage />
      ) : cleanPath === '/journey' ? (
        <JourneyPage />
      ) : cleanPath === '/lab' ? (
        <LabPage />
      ) : cleanPath === '/journal' ? (
        <JournalPage />
      ) : cleanPath === '/contact' ? (
        <ContactPage />
      ) : cleanPath === '/privacy' ? (
        <PrivacyPage />
      ) : (
        <NotFoundPage />
      )}
    </Suspense>
  );
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
