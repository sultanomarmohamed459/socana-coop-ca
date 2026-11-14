import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { MEDIA_ASSETS } from '../lib/media';
import type { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

const VALUES = [
  {
    number: '01',
    title: 'Solidarité coopérative',
    text: "Unir les forces des planteurs individuels pour accéder à de meilleures conditions d'encadrement technique, de collecte et de mise en marché.",
  },
  {
    number: '02',
    title: 'Transparence & équité',
    text: "Garantir à chaque producteur membre une information claire sur les pesées, la qualité du caoutchouc naturel et les modalités de commercialisation.",
  },
  {
    number: '03',
    title: 'Exigence agronomique',
    text: "Préserver la santé des arbres par des pratiques de saignée maîtrisées et un entretien rigoureux des parcelles sur toute la durée de vie de l'hévéa.",
  },
  {
    number: '04',
    title: 'Durabilité environnementale',
    text: "Promouvoir une hévéaculture respectueuse des sols, des ressources hydriques et de l'équilibre des territoires ruraux ivoiriens.",
  },
];

const OBJECTIVES = [
  'Structurer durablement les bassins de production autour de standards techniques homogènes.',
  'Sécuriser l’évacuation régulière du latex naturel grâce à une logistique de collecte fiable.',
  'Renforcer les compétences techniques et la gestion économique des exploitations membres.',
  'Développer des partenariats institutionnels et industriels créateurs de valeur partagée.',
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-[#0B382E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
              À propos de nous · Fondée en 2016
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Une coopérative ivoirienne bâtie sur la confiance et la maîtrise du terroir.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Implantée à Abidjan et active auprès des bassins de production, SOCANA COOP CA fédère
              et accompagne les producteurs de caoutchouc naturel dans une démarche professionnelle et
              durable.
            </p>
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                  Notre histoire depuis 2016
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
                  Structurer la filière hévéicole au plus près des planteurs
                </h2>
                <p className="text-base leading-relaxed text-[#3A453F]">
                  Créée en 2016 en Côte d&apos;Ivoire, SOCANA COOP CA est née de la volonté de
                  répondre aux défis concrets rencontrés par les producteurs d&apos;hévéas :
                  l&apos;accès au conseil technique, l&apos;organisation régulière de la collecte et
                  la valorisation équitable de leur récolte.
                </p>
                <p className="text-base leading-relaxed text-[#3A453F]">
                  Depuis sa fondation, la coopérative s&apos;attache à professionnaliser chaque
                  maillon de la chaîne locale tout en maintenant une gouvernance coopérative proche
                  de ses membres.
                </p>
              </div>

              <div className="pt-6 border-t border-[#124B3B]/15 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                  Notre mission
                </p>
                <p className="text-base leading-relaxed text-[#3A453F]">
                  Accompagner les hévéaculteurs dans l&apos;amélioration continue de leurs pratiques,
                  organiser la collecte rigoureuse du latex naturel et assurer sa commercialisation
                  dans le respect des standards de qualité et d&apos;équité.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[360px] lg:min-h-[500px] rounded-xl overflow-hidden shadow-sm">
                <ResilientImage
                  src={MEDIA_ASSETS.canopy.src}
                  alt={MEDIA_ASSETS.canopy.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Vision Pull Quote */}
      <section className="bg-[#F7F8F5] border-y border-[#124B3B]/10 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B88A42]">
            Notre vision
          </p>
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-medium text-[#124B3B] leading-snug">
            « Contribuer au développement d&apos;une filière du caoutchouc naturel ivoirien plus
            structurée, équitable, performante et durable. »
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              Nos valeurs
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Les principes qui guident chacune de nos décisions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((val) => (
              <div
                key={val.number}
                className="p-8 rounded-xl bg-[#F7F8F5] border border-[#124B3B]/10 space-y-3"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-[#B88A42] tabular-nums">
                  {val.number}
                </p>
                <h3 className="text-2xl font-serif font-semibold text-[#124B3B]">{val.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#4A554F]">{val.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives & Commitment to Producers */}
      <section className="bg-[#0B382E] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] rounded-xl overflow-hidden">
                <ResilientImage
                  src={MEDIA_ASSETS.producers.src}
                  alt={MEDIA_ASSETS.producers.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center space-y-7">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D0AC69]">
                  Objectifs &amp; engagement
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white leading-tight">
                  Un engagement concret aux côtés des producteurs ivoiriens
                </h2>
              </div>

              <ul className="space-y-4">
                {OBJECTIVES.map((obj, index) => (
                  <li
                    key={obj}
                    className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-[#D0AC69] tabular-nums pt-0.5">
                      0{index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-white/85 leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('producers')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0B382E] bg-[#D0AC69] hover:bg-[#B88A42] hover:text-white rounded-md transition-colors"
                >
                  <span>Découvrir l&apos;espace producteurs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
