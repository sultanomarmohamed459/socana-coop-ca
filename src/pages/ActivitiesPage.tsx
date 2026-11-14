import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { MEDIA_ASSETS } from '../lib/media';
import type { PageRoute } from '../types';

interface ActivitiesPageProps {
  onNavigate: (page: PageRoute) => void;
}

const ACTIVITIES_DETAIL = [
  {
    number: '01',
    title: "Accompagnement des producteurs d'hévéa",
    subtitle: 'Proximité et conseil technique sur parcelle',
    paragraphs: [
      "Le cœur du modèle de SOCANA COOP CA repose sur la relation directe entretenue avec les planteurs. Nos équipes conseillent les producteurs dans la conduite quotidienne de leurs plantations, depuis l'entretien des jeunes parcelles jusqu'à la mise en saignée.",
      "Cet accompagnement vise à optimiser la productivité des arbres tout en préservant l'écorce et la santé durable des peuplements.",
    ],
    highlights: [
      'Diagnostic régulier de l’état sanitaire des parcelles',
      'Appui technique sur les techniques de saignée et le choix du matériel',
      'Écoute active et orientation administrative des membres',
    ],
    media: MEDIA_ASSETS.producers,
  },
  {
    number: '02',
    title: 'Collecte du latex naturel',
    subtitle: 'Logistique organisée et pesée transparente',
    paragraphs: [
      "SOCANA COOP CA coordonne les opérations de collecte du caoutchouc naturel dans les zones de production afin d'éviter aux planteurs l'isolement logistique et les pertes après récolte.",
      "Chaque enlèvement s'appuie sur des procédures rigoureuses de réception, de contrôle visuel de la propreté du caoutchouc et de pesée contradictoire.",
    ],
    highlights: [
      'Planification régulière des tournées et points de regroupement',
      'Contrôle transparent du poids et de la qualité à réception',
      'Traçabilité documentaire des apports de chaque producteur',
    ],
    media: MEDIA_ASSETS.collection,
  },
  {
    number: '03',
    title: 'Commercialisation du caoutchouc naturel',
    subtitle: 'Valorisation collective et débouchés sécurisés',
    paragraphs: [
      "En regroupant la production de ses membres, la coopérative renforce le pouvoir de négociation des planteurs et sécurise l'accès à des acheteurs et unités de transformation fiables en Côte d'Ivoire.",
      "La mise en marché collective garantit une continuité d'écoulement et protège le producteur face aux aléas des circuits informels.",
    ],
    highlights: [
      'Regroupement de lots répondant aux exigences industrielles',
      'Négociation commerciale portée par la force du collectif',
      'Suivi rigoureux des règlements et des bordereaux de livraison',
    ],
    media: MEDIA_ASSETS.tapping,
  },
  {
    number: '04',
    title: 'Organisation et structuration de la production',
    subtitle: 'Une gouvernance coopérative claire et efficace',
    paragraphs: [
      "Une filière performante repose sur des producteurs organisés. Depuis 2016, SOCANA COOP CA structure les bassins hévéicoles en facilitant la coordination entre planteurs, transporteurs et acheteurs.",
      "Cette organisation permet d'anticiper les volumes saisonniers, de planifier les besoins en matériel de récolte et d'assurer un suivi administratif rigoureux.",
    ],
    highlights: [
      'Recensement structuré des parcelles et des besoins terrain',
      'Coordination fluide de la chaîne logistique locale',
      'Représentation professionnelle des intérêts des adhérents',
    ],
    media: MEDIA_ASSETS.hero,
  },
  {
    number: '05',
    title: 'Promotion des bonnes pratiques agricoles',
    subtitle: 'Qualité du caoutchouc et agriculture durable',
    paragraphs: [
      "La valeur du caoutchouc naturel ivoirien dépend directement de la qualité des pratiques en plantation. Nous sensibilisons les producteurs à la propreté des récipients, à l'absence de corps étrangers et au respect des cycles de repos des arbres.",
      "Parallèlement, nous encourageons la protection des sols et l'adoption de méthodes culturales durables pour préserver l'avenir des exploitations familiales.",
    ],
    highlights: [
      'Sensibilisation à la propreté du latex et du coagulum',
      'Protection des sols contre l’érosion et gestion du couvert végétal',
      'Respect des normes environnementales et sociales de la filière',
    ],
    media: MEDIA_ASSETS.sustainable,
  },
];

export function ActivitiesPage({ onNavigate }: ActivitiesPageProps) {
  return (
    <div>
      {/* Header */}
      <section className="bg-[#0B382E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
              Nos activités
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Cinq piliers opérationnels au service d&apos;une hévéaculture performante.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              De l&apos;appui technique en plantation jusqu&apos;à la commercialisation du caoutchouc
              naturel, SOCANA COOP CA déploie une organisation complète et transparente.
            </p>
          </div>
        </div>
      </section>

      {/* Alternating 5 Activity Sections */}
      <div className="divide-y divide-[#124B3B]/10">
        {ACTIVITIES_DETAIL.map((act, index) => {
          const isReversed = index % 2 === 1;
          const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#F7F8F5]';
          return (
            <section key={act.number} className={`${bgClass} py-20 lg:py-24`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
                  <div
                    className={`lg:col-span-6 ${
                      isReversed ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="h-full min-h-[320px] lg:min-h-[440px] rounded-xl overflow-hidden shadow-sm">
                      <ResilientImage
                        src={act.media.src}
                        alt={act.media.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-6 flex flex-col justify-center space-y-5 ${
                      isReversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42] tabular-nums">
                        {act.number} · {act.subtitle}
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B] leading-tight">
                        {act.title}
                      </h2>
                    </div>

                    <div className="space-y-4 text-base leading-relaxed text-[#3A453F]">
                      {act.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>

                    <ul className="pt-3 border-t border-[#124B3B]/15 space-y-2.5 text-sm text-[#3A453F]">
                      {act.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-[#B88A42] mt-2 shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-[#124B3B] text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white">
              Vous souhaitez rejoindre nos opérations de collecte ou devenir partenaire ?
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              Nos équipes échangent directement avec les planteurs et les acteurs de la filière.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('producers')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#0B382E] bg-[#D0AC69] hover:bg-[#B88A42] hover:text-white rounded-md transition-colors"
            >
              <span>Devenir membre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white border border-white/35 hover:bg-white/10 rounded-md transition-colors"
            >
              <span>Nous contacter</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
