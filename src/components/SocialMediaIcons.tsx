import { Facebook, Instagram, Linkedin } from 'lucide-react';
import type { SiteSettings } from '../types';

interface SocialMediaIconsProps {
  socialLinks: SiteSettings['socialLinks'];
  variant: 'dark' | 'light';
}

const NETWORKS: Array<{
  key: keyof SiteSettings['socialLinks'];
  label: string;
  Icon: typeof Facebook;
}> = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
];

export function SocialMediaIcons({ socialLinks, variant }: SocialMediaIconsProps) {
  const isDark = variant === 'dark';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {NETWORKS.map(({ key, label, Icon }) => {
        const href = socialLinks[key]?.trim();
        if (href) {
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} SOCANA COOP CA`}
              className={`btn-click-feedback inline-flex items-center justify-center w-10 h-10 rounded-md border transition-colors duration-200 ${
                isDark
                  ? 'border-white/25 text-white hover:text-[#D0AC69] hover:border-[#D0AC69]'
                  : 'border-[#124B3B]/25 text-[#124B3B] hover:bg-[#124B3B] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        }

        return (
          <span
            key={key}
            role="img"
            aria-label={`${label} SOCANA COOP CA`}
            title={`${label} — lien à renseigner`}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-md border ${
              isDark
                ? 'border-white/20 text-white/75'
                : 'border-[#124B3B]/20 text-[#124B3B]/75 bg-[#F7F8F5]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </span>
        );
      })}
    </div>
  );
}
