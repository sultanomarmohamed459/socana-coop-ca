import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../lib/media';
import {
  isExactAdminAccessQuery,
  searchPublicDirectory,
  type PublicSearchResult,
} from '../lib/validation';
import type { Article, PageRoute } from '../types';

interface NavbarProps {
  currentPage: PageRoute;
  articles: Article[];
  onNavigate: (page: PageRoute, slug?: string) => void;
}

const NAV_LINKS: Array<{ page: PageRoute; label: string; href: string }> = [
  { page: 'home', label: 'Accueil', href: '/' },
  { page: 'about', label: 'À propos', href: '/a-propos' },
  { page: 'activities', label: 'Activités', href: '/activites' },
  { page: 'producers', label: 'Producteurs', href: '/producteurs' },
  { page: 'partners', label: 'Partenaires', href: '/partenaires' },
  { page: 'news', label: 'Actualités', href: '/actualites' },
];

export function Navbar({ currentPage, articles, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdminMatch = isExactAdminAccessQuery(searchQuery);
  const publicResults = isAdminMatch
    ? []
    : searchPublicDirectory(searchQuery, articles);

  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 90);
      return () => window.clearTimeout(timer);
    }
  }, [searchOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: PageRoute
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    setSearchOpen(false);
    onNavigate(page);
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        setSearchQuery('');
      }
      return next;
    });
    setMobileOpen(false);
  };

  const handleSelectPublicResult = (result: PublicSearchResult) => {
    setSearchQuery('');
    setSearchOpen(false);
    setMobileOpen(false);
    onNavigate(result.page, result.slug);
  };

  const handleAccessAdmin = () => {
    if (!isExactAdminAccessQuery(searchQuery)) return;
    setSearchQuery('');
    setSearchOpen(false);
    setMobileOpen(false);
    onNavigate('admin');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExactAdminAccessQuery(searchQuery)) {
      handleAccessAdmin();
      return;
    }
    if (searchQuery.trim().length > 0 && publicResults.length > 0) {
      handleSelectPublicResult(publicResults[0]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#124B3B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Official SOCANA COOP CA Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="btn-click-feedback shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B] rounded"
          aria-label="SOCANA COOP CA — Retour à l'accueil"
        >
          <img
            src={OFFICIAL_LOGO_URL}
            alt="SOCANA COOP CA Côte d'Ivoire"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'news' && currentPage === 'article');
            return (
              <a
                key={item.page}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.page)}
                aria-current={isActive ? 'page' : undefined}
                className={`btn-click-feedback relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B] rounded ${
                  isActive
                    ? 'text-[#124B3B]'
                    : 'text-[#3A453F] hover:text-[#124B3B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#B88A42]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Contact CTA + Search Loupe + Smooth Morphing Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="btn-click-feedback hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#B88A42] hover:bg-[#9F7434] rounded-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B88A42]"
          >
            Nous contacter
          </a>

          {/* Search Loupe Icon next to Menu */}
          <button
            type="button"
            onClick={handleSearchToggle}
            aria-expanded={searchOpen}
            aria-controls="header-search-bar"
            aria-label={searchOpen ? 'Fermer la recherche' : 'Rechercher'}
            className={`inline-flex items-center justify-center w-11 h-11 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B] ${
              searchOpen
                ? 'bg-[#124B3B] text-white'
                : 'text-[#124B3B] hover:bg-[#F7F8F5]'
            }`}
          >
            <Search className="w-5 h-5" strokeWidth={1.8} />
          </button>

          {/* Animated 3-bar to X Hamburger Menu */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setSearchOpen(false);
            }}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[#124B3B] hover:bg-[#F7F8F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
          >
            <span
              className="relative w-5 h-4 flex flex-col justify-between items-center"
              aria-hidden="true"
            >
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out ${
                  mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar with Public Keywords + Strict Hidden Admin Access */}
      <div
        id="header-search-bar"
        aria-hidden={!searchOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#F7F8F5] ${
          searchOpen
            ? 'grid-rows-[1fr] opacity-100 border-t border-[#124B3B]/10'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-[#6B756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  inputMode="search"
                  tabIndex={searchOpen ? 0 : -1}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un thème, une activité, un conseil agricole..."
                  aria-label="Champ de recherche"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la saisie"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#6B756F] hover:text-[#124B3B] rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Strict verification: only visible when input === 'Administrationsocana' */}
              {isAdminMatch && (
                <button
                  type="button"
                  onClick={handleAccessAdmin}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md whitespace-nowrap shrink-0"
                >
                  <span>Ouvrir l&apos;espace sécurisé</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Public Keyword Shortcuts / Matching Results (only after typing a letter or digit, never includes Administrationsocana) */}
            {!isAdminMatch && publicResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B756F]">
                  Mots-clés & résultats correspondants
                </p>
                <div className="flex flex-wrap gap-2">
                  {publicResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      tabIndex={searchOpen ? 0 : -1}
                      onClick={() => handleSelectPublicResult(item)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#124B3B] bg-white border border-[#124B3B]/15 hover:border-[#124B3B] hover:bg-[#124B3B] hover:text-white rounded-md transition-colors text-left"
                    >
                      <span className="truncate max-w-[260px] sm:max-w-xs">{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Smooth Mobile Navigation Drawer (Pure CSS Smooth Collapse/Expand) */}
      <div
        id="mobile-navigation-drawer"
        aria-hidden={!mobileOpen}
        className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${
          mobileOpen
            ? 'grid-rows-[1fr] opacity-100 border-t border-[#124B3B]/10 shadow-lg'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Navigation mobile" className="px-4 py-5 space-y-1">
            {NAV_LINKS.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'news' && currentPage === 'article');
              return (
                <a
                  key={item.page}
                  href={item.href}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={(e) => handleLinkClick(e, item.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`btn-click-feedback block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F7F8F5] text-[#124B3B] font-semibold'
                      : 'text-[#3A453F] hover:bg-[#F7F8F5] hover:text-[#124B3B]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 border-t border-[#124B3B]/10">
              <a
                href="/contact"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="btn-click-feedback block w-full text-center px-5 py-3 text-base font-medium text-white bg-[#B88A42] hover:bg-[#9F7434] rounded-md transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
