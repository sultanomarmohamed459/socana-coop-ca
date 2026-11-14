import { useState } from 'react';
import { Mail, MapPin, Phone, X } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../lib/media';
import type { PageRoute, SiteSettings } from '../types';
import { SocialMediaIcons } from './SocialMediaIcons';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ settings, onNavigate }: FooterProps) {
  const [legalOpen, setLegalOpen] = useState(false);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, page: PageRoute) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="bg-[#0B382E] text-white border-t border-[#D0AC69]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="/"
              onClick={(e) => handleLink(e, 'home')}
              className="btn-click-feedback inline-block bg-white rounded-lg px-5 py-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D0AC69]"
              aria-label="SOCANA COOP CA — Accueil"
            >
              <img
                src={OFFICIAL_LOGO_URL}
                alt="SOCANA COOP CA Côte d'Ivoire"
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-sm leading-relaxed text-white/80 max-w-sm">
              Coopérative agricole ivoirienne dédiée depuis 2016 à l&apos;hévéaculture, à
              l&apos;accompagnement des producteurs, à la collecte organisée et à la
              commercialisation durable du caoutchouc naturel.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#D0AC69]">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLink(e, 'home')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/a-propos"
                  onClick={(e) => handleLink(e, 'about')}
                  className="hover:text-white transition-colors"
                >
                  À propos de nous
                </a>
              </li>
              <li>
                <a
                  href="/activites"
                  onClick={(e) => handleLink(e, 'activities')}
                  className="hover:text-white transition-colors"
                >
                  Nos activités
                </a>
              </li>
              <li>
                <a
                  href="/producteurs"
                  onClick={(e) => handleLink(e, 'producers')}
                  className="hover:text-white transition-colors"
                >
                  Espace producteurs
                </a>
              </li>
              <li>
                <a
                  href="/partenaires"
                  onClick={(e) => handleLink(e, 'partners')}
                  className="hover:text-white transition-colors"
                >
                  Nos partenaires
                </a>
              </li>
              <li>
                <a
                  href="/actualites"
                  onClick={(e) => handleLink(e, 'news')}
                  className="hover:text-white transition-colors"
                >
                  Actualités et conseils agricoles
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, 'contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Coordinates Column */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#D0AC69]">
              Coordonnées
            </h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D0AC69] shrink-0 mt-0.5" />
                <span>
                  {settings.addressDetail
                    ? `${settings.addressDetail}, ${settings.location}`
                    : settings.location}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D0AC69] shrink-0 mt-0.5" />
                {settings.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-white transition-colors break-all"
                  >
                    {settings.email}
                  </a>
                ) : (
                  <span className="text-white/65">Adresse e-mail à venir</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D0AC69] shrink-0 mt-0.5" />
                {settings.phone ? (
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                ) : (
                  <span className="text-white/65">Téléphone à venir</span>
                )}
              </li>
            </ul>
          </div>

          {/* Socials Column - always displays Facebook, LinkedIn, Instagram logos */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#D0AC69]">
              Réseaux sociaux
            </h2>
            <SocialMediaIcons socialLinks={settings.socialLinks} variant="dark" />
          </div>
        </div>

        {/* Bottom Legal Bar (no public Administration link) */}
        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/65">
          <p>© {new Date().getFullYear()} SOCANA COOP CA — Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalOpen(true)}
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Mentions légales
            </button>
          </div>
        </div>
      </div>

      {/* Legal Notices Modal */}
      {legalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white text-[#1A231E] rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#124B3B]/10 pb-4">
              <h3 id="legal-modal-title" className="text-2xl font-serif font-semibold text-[#124B3B]">
                Mentions légales
              </h3>
              <button
                type="button"
                onClick={() => setLegalOpen(false)}
                aria-label="Fermer les mentions légales"
                className="p-2 rounded-md text-[#6B756F] hover:text-[#124B3B] hover:bg-[#F7F8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-[#3A453F]">
              <p>
                <strong>Raison sociale :</strong> SOCANA COOP CA (Société Coopérative Agricole avec
                Conseil d&apos;Administration).
              </p>
              <p>
                <strong>Année de création :</strong> 2016 — Implantation : {settings.location}.
              </p>
              <p>
                <strong>Activité principale :</strong> Hévéaculture, accompagnement des producteurs,
                collecte et commercialisation du caoutchouc naturel.
              </p>
              <p>
                <strong>Protection des données :</strong> Les informations recueillies via les
                formulaires d&apos;adhésion, de partenariat et de contact sont exclusivement
                destinées à l&apos;étude de vos demandes par les équipes de SOCANA COOP CA.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium bg-[#124B3B] text-white rounded-md hover:bg-[#0B382E] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
