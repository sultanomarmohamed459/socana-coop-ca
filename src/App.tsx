import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { fetchPublicData } from './lib/api';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { AdminPage } from './pages/AdminPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { PartnersPage } from './pages/PartnersPage';
import { ProducersPage } from './pages/ProducersPage';
import type { PageRoute, PublicSiteData } from './types';

function parseLocation(pathname: string): { page: PageRoute; slug?: string } {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return { page: 'home' };
  if (clean === '/a-propos') return { page: 'about' };
  if (clean === '/activites') return { page: 'activities' };
  if (clean === '/producteurs') return { page: 'producers' };
  if (clean === '/partenaires') return { page: 'partners' };
  if (clean === '/actualites') return { page: 'news' };
  if (clean.startsWith('/actualites/')) {
    return { page: 'article', slug: decodeURIComponent(clean.replace('/actualites/', '')) };
  }
  if (clean === '/contact') return { page: 'contact' };
  if (clean === '/admin') return { page: 'admin' };
  return { page: 'home' };
}

function buildPath(page: PageRoute, slug?: string): string {
  switch (page) {
    case 'home':
      return '/';
    case 'about':
      return '/a-propos';
    case 'activities':
      return '/activites';
    case 'producers':
      return '/producteurs';
    case 'partners':
      return '/partenaires';
    case 'news':
      return '/actualites';
    case 'article':
      return slug ? `/actualites/${encodeURIComponent(slug)}` : '/actualites';
    case 'contact':
      return '/contact';
    case 'admin':
      return '/admin';
  }
}

const DEFAULT_PUBLIC_DATA: PublicSiteData = {
  articles: [],
  partners: [],
  customStats: [],
  settings: {
    location: "Abidjan, Côte d'Ivoire",
    addressDetail: '',
    email: '',
    phone: '',
    socialLinks: { facebook: '', linkedin: '', instagram: '' },
  },
};

export default function App() {
  const [route, setRoute] = useState<{ page: PageRoute; slug?: string }>(() =>
    parseLocation(window.location.pathname)
  );
  const [siteData, setSiteData] = useState<PublicSiteData>(DEFAULT_PUBLIC_DATA);
  const [loading, setLoading] = useState(true);

  const refreshPublicData = useCallback(async () => {
    try {
      const data = await fetchPublicData();
      setSiteData({
        articles: Array.isArray(data?.articles) ? data.articles : DEFAULT_PUBLIC_DATA.articles,
        partners: Array.isArray(data?.partners) ? data.partners : DEFAULT_PUBLIC_DATA.partners,
        customStats: Array.isArray(data?.customStats)
          ? data.customStats
          : DEFAULT_PUBLIC_DATA.customStats,
        settings: data?.settings
          ? {
              ...DEFAULT_PUBLIC_DATA.settings,
              ...data.settings,
              socialLinks: {
                ...DEFAULT_PUBLIC_DATA.settings.socialLinks,
                ...(data.settings.socialLinks ?? {}),
              },
            }
          : DEFAULT_PUBLIC_DATA.settings,
      });
    } catch (err) {
      console.error('Failed to load site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseLocation(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((page: PageRoute, slug?: string) => {
    const nextPath = buildPath(page, slug);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setRoute({ page, slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A231E]">
      <Navbar
        currentPage={route.page}
        articles={siteData.articles}
        onNavigate={navigate}
      />

      <main className="flex-1">
        {route.page === 'home' && (
          <HomePage
            articles={siteData.articles}
            customStats={siteData.customStats}
            loading={loading}
            onNavigate={navigate}
          />
        )}
        {route.page === 'about' && <AboutPage onNavigate={navigate} />}
        {route.page === 'activities' && <ActivitiesPage onNavigate={navigate} />}
        {route.page === 'producers' && <ProducersPage />}
        {route.page === 'partners' && <PartnersPage partners={siteData.partners} />}
        {route.page === 'news' && (
          <NewsPage articles={siteData.articles} onNavigate={navigate} />
        )}
        {route.page === 'article' && (
          <ArticleDetailPage
            articles={siteData.articles}
            slug={route.slug || ''}
            onNavigate={navigate}
          />
        )}
        {route.page === 'contact' && <ContactPage settings={siteData.settings} />}
        {route.page === 'admin' && <AdminPage onDataChange={refreshPublicData} />}
      </main>

      <Footer settings={siteData.settings} onNavigate={navigate} />
    </div>
  );
}
