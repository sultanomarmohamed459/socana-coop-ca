import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
  Handshake,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { MEDIA_ASSETS, resolveArticleImage } from '../lib/media';
import { formatFrenchDate } from '../lib/validation';
import type { Article, CustomStat, PageRoute } from '../types';

interface HomePageProps {
  articles: Article[];
  customStats: CustomStat[];
  loading?: boolean;
  onNavigate: (page: PageRoute, slug?: string) => void;
}

const HOME_ACTIVITIES = [
  {
    number: '01',
    title: 'Accompagnement des producteurs',
    description:
      'Suivi de proximité sur les parcelles, appui technique à la saignée et conseil continu pour améliorer la qualité du latex récolté.',
    media: MEDIA_ASSETS.producers,
  },
  {
    number: '02',
    title: "Culture de l'hévéa",
    description:
      "Valorisation de l'hévéaculture villageoise à travers des itinéraires techniques adaptés aux terroirs ivoiriens.",
    media: MEDIA_ASSETS.tapping,
  },
  {
    number: '03',
    title: 'Collecte du latex naturel',
    description:
      'Organisation rigoureuse de la collecte, pesée transparente et acheminement structuré depuis les bassins de production.',
    media: MEDIA_ASSETS.collection,
  },
  {
    number: '04',
    title: 'Commercialisation du caoutchouc naturel',
    description:
      'Mise en marché collective et accès sécurisé aux débouchés industriels pour défendre une rémunération juste.',
    media: MEDIA_ASSETS.hero,
  },
  {
    number: '05',
    title: "Promotion d'une agriculture durable",
    description:
      'Préservation des sols, entretien responsable des plantations et transmission de pratiques respectueuses de l’environnement.',
    media: MEDIA_ASSETS.sustainable,
  },
];

const COMMITMENTS = [
  {
    icon: Handshake,
    title: 'Proximité avec les producteurs',
    description:
      'Une présence régulière sur le terrain, à l’écoute des réalités quotidiennes de chaque planteur.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparence',
    description:
      'Des opérations de pesée, de classement et de suivi administratif claires et vérifiables.',
  },
  {
    icon: Compass,
    title: 'Accompagnement',
    description:
      'Des conseils agronomiques pratiques pour pérenniser le capital végétal de chaque exploitation.',
  },
  {
    icon: Award,
    title: 'Valorisation de la production',
    description:
      'La mutualisation des volumes et l’exigence qualité au service de la valeur créée par nos membres.',
  },
  {
    icon: Leaf,
    title: 'Développement durable',
    description:
      'Un engagement constant pour une hévéaculture ivoirienne responsable, résiliente et tournée vers l’avenir.',
  },
];

export function HomePage({
  articles,
  customStats,
  loading = false,
  onNavigate,
}: HomePageProps) {
  const activitiesScrollerRef = useRef<HTMLDivElement>(null);
  const floatScrollRef = useRef(0);
  const isHoveredRef = useRef(false);
  const manualPauseUntilRef = useRef(0);
  const needsSyncRef = useRef(false);

  useEffect(() => {
    const el = activitiesScrollerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0) {
        if (isHoveredRef.current || now < manualPauseUntilRef.current) {
          needsSyncRef.current = true;
        } else {
          if (needsSyncRef.current) {
            floatScrollRef.current = el.scrollLeft;
            needsSyncRef.current = false;
          }
          floatScrollRef.current += (dt * 36) / 1000;
          if (floatScrollRef.current >= halfWidth) {
            floatScrollRef.current -= halfWidth;
          } else if (floatScrollRef.current < 0) {
            floatScrollRef.current += halfWidth;
          }
          el.scrollLeft = floatScrollRef.current;
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleScrollActivities = (direction: 'left' | 'right') => {
    const el = activitiesScrollerRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth <= 0) return;

    const cardStep = window.innerWidth < 640 ? 314 : 407;
    manualPauseUntilRef.current = performance.now() + 750;
    needsSyncRef.current = true;

    if (direction === 'left' && el.scrollLeft < cardStep) {
      el.scrollLeft += halfWidth;
    } else if (direction === 'right' && el.scrollLeft + cardStep > halfWidth * 1.8) {
      el.scrollLeft -= halfWidth;
    }

    el.scrollBy({
      left: direction === 'right' ? cardStep : -cardStep,
      behavior: 'smooth',
    });
  };

  const latestArticles = articles?.slice(0, 6) ?? [];
  const marqueeArticles =
    latestArticles.length === 0
      ? []
      : latestArticles.length === 1
        ? [latestArticles[0], latestArticles[0], latestArticles[0]]
        : latestArticles.length === 2
          ? [...latestArticles, ...latestArticles]
          : latestArticles;

  const coreIndicators = [
    {
      value: '2016',
      label: 'Année de création',
      detail: 'Un ancrage coopératif solide dans la filière hévéicole ivoirienne.',
    },
    {
      value: 'Abidjan',
      label: 'Implantation',
      detail: "Coordination institutionnelle et pilotage des opérations en Côte d'Ivoire.",
    },
    {
      value: 'Hévéaculture',
      label: "Domaine d'activité",
      detail: 'Accompagnement, collecte et commercialisation du caoutchouc naturel.',
    },
    ...(customStats ?? []).map((s) => ({
      value: s.value,
      label: s.label,
      detail: s.detail,
    })),
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-[#0B382E]">
        <div className="absolute inset-0 overflow-hidden">
          <ResilientImage
            src={MEDIA_ASSETS.hero.src}
            alt={MEDIA_ASSETS.hero.alt}
            className="w-full h-full object-cover object-center hero-image-animate"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0B382E]/90 via-[#0B382E]/70 to-[#0B382E]/35"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-7">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-[#D0AC69]">
              SOCANA COOP CA · Côte d&apos;Ivoire
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-serif font-semibold leading-[1.08] tracking-tight text-white">
              Ensemble, cultivons la valeur du caoutchouc naturel.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-white/90 max-w-2xl">
              Depuis 2016, nous accompagnons les producteurs de caoutchouc naturel en Côte
              d&apos;Ivoire à travers une agriculture structurée, équitable et durable.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-[#0B382E] bg-[#D0AC69] hover:bg-[#B88A42] hover:text-white rounded-md transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Découvrir notre coopérative</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('activities')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-white border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Découvrir nos activités</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION : NOS CHIFFRES CLÉS */}
      <section className="bg-white border-b border-[#124B3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-[#124B3B]/10 pb-4">
            <h2 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#6B756F]">
              Repères institutionnels
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 divide-[#124B3B]/10">
            {coreIndicators.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="space-y-2 pt-6 first:pt-0 md:pt-0"
              >
                <p className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-semibold text-[#124B3B] tabular-nums leading-none">
                  {item.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88A42] pt-1">
                  {item.label}
                </p>
                {item.detail && (
                  <p className="text-sm text-[#6B756F] leading-relaxed">{item.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION : QUI SOMMES-NOUS ? */}
      <section className="bg-[#F7F8F5] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] lg:min-h-[480px] rounded-xl overflow-hidden shadow-sm">
                <ResilientImage
                  src={MEDIA_ASSETS.canopy.src}
                  alt={MEDIA_ASSETS.canopy.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                Qui sommes-nous ?
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-semibold text-[#124B3B] leading-[1.15]">
                Une coopérative engagée au service de la filière hévéicole ivoirienne.
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-[#3A453F]">
                <p>
                  Fondée en 2016 et établie en Côte d&apos;Ivoire,{' '}
                  <strong className="font-semibold text-[#124B3B]">SOCANA COOP CA</strong> œuvre
                  chaque jour à la structuration et à la valorisation de la filière du caoutchouc
                  naturel.
                </p>
                <p>
                  Nous plaçons le producteur au centre de notre modèle coopératif en conjuguant
                  accompagnement agronomique de terrain, organisation rigoureuse de la collecte et
                  commercialisation responsable auprès des acteurs industriels.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
                >
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION : NOS ACTIVITÉS */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                Nos activités
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-semibold text-[#124B3B] leading-[1.15]">
                Une chaîne de valeur maîtrisée, de la plantation au marché.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('activities')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#124B3B] hover:text-[#B88A42] transition-colors whitespace-nowrap self-start md:self-auto"
            >
              <span>Explorer toutes nos activités</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal Marquee Editorial Showcase with Bidirectional Controls */}
          <div
            className="relative"
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            onFocus={() => {
              isHoveredRef.current = true;
            }}
            onBlur={() => {
              isHoveredRef.current = false;
            }}
          >
            <div className="relative overflow-hidden py-1">
              {/* Soft edge fades matching bg-white */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-14 bg-gradient-to-r from-white to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-14 bg-gradient-to-l from-white to-transparent"
              />

              <div
                ref={activitiesScrollerRef}
                aria-label="Défilement horizontal de nos activités"
                onWheel={() => {
                  manualPauseUntilRef.current = performance.now() + 900;
                  needsSyncRef.current = true;
                }}
                onTouchStart={() => {
                  manualPauseUntilRef.current = performance.now() + 900;
                  needsSyncRef.current = true;
                }}
                className="flex overflow-x-auto no-scrollbar"
              >
                {[false, true].map((isDuplicate) => (
                  <div
                    key={isDuplicate ? 'act-loop-b' : 'act-loop-a'}
                    aria-hidden={isDuplicate ? true : undefined}
                    className="flex items-stretch gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0"
                  >
                    {HOME_ACTIVITIES.map((act) => (
                      <article
                        key={`${isDuplicate ? 'b' : 'a'}-${act.number}`}
                        className="group w-[290px] sm:w-[340px] lg:w-[375px] shrink-0 bg-[#F7F8F5] rounded-xl overflow-hidden border border-[#124B3B]/10 flex flex-col shadow-[0_2px_12px_-4px_rgba(18,75,59,0.05)]"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <ResilientImage
                            src={act.media.src}
                            alt={isDuplicate ? '' : act.media.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="p-6 sm:p-7 space-y-2.5 flex-1">
                          <p className="text-xs font-semibold tracking-[0.18em] text-[#B88A42] tabular-nums">
                            {act.number}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#124B3B] leading-snug">
                            {act.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#4A554F]">
                            {act.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Bidirectional Scroll Buttons directly below */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleScrollActivities('left')}
                aria-label="Faire défiler les activités vers l'arrière"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#124B3B]/20 bg-white text-[#124B3B] hover:bg-[#124B3B] hover:text-white hover:border-[#124B3B] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => handleScrollActivities('right')}
                aria-label="Faire défiler les activités vers l'avant"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#124B3B]/20 bg-white text-[#124B3B] hover:bg-[#124B3B] hover:text-white hover:border-[#124B3B] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION : POURQUOI SOCANA COOP CA ? */}
      <section className="bg-[#0B382E] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D0AC69]">
              Nos engagements
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-semibold text-white leading-[1.15]">
              Pourquoi choisir SOCANA COOP CA ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 border-t border-white/15 pt-12">
            {COMMITMENTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-4">
                  <div className="w-11 h-11 rounded-md border border-[#D0AC69]/40 bg-white/5 flex items-center justify-center text-[#D0AC69]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/80">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SECTION : ACTUALITÉS */}
      <section className="bg-[#F7F8F5] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                Actualités &amp; conseils agricoles
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-semibold text-[#124B3B]">
                Publications récentes de la coopérative
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#124B3B] hover:text-[#B88A42] transition-colors whitespace-nowrap self-start md:self-auto"
            >
              <span>Toutes les actualités</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading && latestArticles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" aria-busy="true">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className="bg-white rounded-xl overflow-hidden border border-[#124B3B]/10 h-[390px] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#124B3B]/10" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-1/2 bg-[#124B3B]/10 rounded" />
                    <div className="h-5 w-5/6 bg-[#124B3B]/10 rounded" />
                    <div className="h-4 w-full bg-[#124B3B]/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : latestArticles.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#124B3B]/10 p-10 text-center text-[#6B756F]">
              Aucun article publié pour le moment. Les publications apparaîtront ici dès leur
              mise en ligne par la coopérative.
            </div>
          ) : (
            <div
              className="articles-marquee-container relative overflow-hidden py-1"
              aria-label="Défilement horizontal des publications récentes"
            >
              {/* Soft edge fades matching #F7F8F5 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-14 bg-gradient-to-r from-[#F7F8F5] to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-14 bg-gradient-to-l from-[#F7F8F5] to-transparent"
              />

              <div className="articles-marquee-track">
                {[false, true].map((isDuplicate) => (
                  <div
                    key={isDuplicate ? 'loop-b' : 'loop-a'}
                    aria-hidden={isDuplicate ? true : undefined}
                    className="flex items-stretch gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0"
                  >
                    {marqueeArticles.map((article, idx) => {
                      const img = resolveArticleImage(
                        article.mediaKey,
                        article.customImageUrl
                      );
                      return (
                        <article
                          key={`${isDuplicate ? 'b' : 'a'}-${article.id}-${idx}`}
                          className="group w-[290px] sm:w-[340px] lg:w-[375px] shrink-0 bg-white rounded-xl overflow-hidden border border-[#124B3B]/10 flex flex-col shadow-[0_2px_12px_-4px_rgba(18,75,59,0.06)]"
                        >
                          <div className="aspect-[4/3] overflow-hidden">
                            <ResilientImage
                              src={img.src}
                              alt={isDuplicate ? '' : article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-5">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B756F]">
                                <span className="font-semibold uppercase tracking-[0.14em] text-[#B88A42]">
                                  {article.category}
                                </span>
                                <span aria-hidden="true">·</span>
                                <time dateTime={article.publishedAt}>
                                  {formatFrenchDate(article.publishedAt)}
                                </time>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#124B3B] leading-snug">
                                {article.title}
                              </h3>
                              <p className="text-sm leading-relaxed text-[#4A554F] line-clamp-3">
                                {article.excerpt}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-[#124B3B]/10">
                              <button
                                type="button"
                                tabIndex={isDuplicate ? -1 : 0}
                                onClick={() => onNavigate('article', article.slug)}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#124B3B] hover:text-[#B88A42] transition-colors"
                              >
                                <span>Lire l&apos;article</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. SECTION : APPEL À L'ACTION */}
      <section className="bg-[#124B3B] text-white py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
            Rejoindre la dynamique
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white leading-[1.12]">
            Construisons ensemble l&apos;avenir du caoutchouc naturel.
          </h2>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Vous êtes producteur, partenaire ou acteur de la filière hévéicole ? SOCANA COOP CA
            est à votre écoute.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => onNavigate('producers')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-[#0B382E] bg-[#D0AC69] hover:bg-[#B88A42] hover:text-white rounded-md transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Devenir membre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white border border-white/40 hover:bg-white/10 rounded-md transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Nous contacter</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
