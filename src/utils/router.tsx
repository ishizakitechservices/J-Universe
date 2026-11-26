import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { resolveRouteMeta } from './portfolioLogic';

interface RouterContextValue {
  pathname: string;
  search: string;
  navigate: (to: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseLocation() {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '' };
  }
  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
  };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(parseLocation);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const syncDocumentMeta = useCallback((pathname: string) => {
    const meta = resolveRouteMeta(pathname);
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', meta.description);

    const canonicalUrl = `${window.location.origin}${pathname === '/' ? '/' : pathname}`;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, []);

  useEffect(() => {
    syncDocumentMeta(loc.pathname);
  }, [loc.pathname, syncDocumentMeta]);

  useEffect(() => {
    const onPopState = () => {
      setLoc(parseLocation());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    const nextPath = url.pathname || '/';
    const nextSearch = url.search || '';

    if (
      nextPath !== window.location.pathname ||
      nextSearch !== window.location.search
    ) {
      window.history.pushState({}, '', `${nextPath}${nextSearch}`);
      setLoc({ pathname: nextPath, search: nextSearch });
    }

    setIsSearchOpen(false);

    if (url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <RouterContext.Provider
      value={{
        pathname: loc.pathname,
        search: loc.search,
        navigate,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used inside RouterProvider');
  }
  return ctx;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    if (to.startsWith('http') || to.startsWith('mailto:')) {
      return;
    }
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
