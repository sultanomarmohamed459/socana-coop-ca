import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { resolveArticleImage } from '../lib/media';
import { filterAndSortArticles, formatFrenchDate } from '../lib/validation';
import type { Article, PageRoute } from '../types';

interface NewsPageProps {
  articles: Article[];
  onNavigate: (page: PageRoute, slug?: string) => void;
}

const CATEGORIES = [
  'Toutes',
  'Conseils agricoles',
  'Vie de la coopérative',
  'Développement durable',
  'Filière hévéa',
];

export function NewsPage({ articles, onNavigate }: NewsPageProps) {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const filtered = filterAndSortArticles(articles, activeCategory, true);

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0B382E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
              Espace éditorial
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Actualités et conseils agricoles
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Retrouvez les guides techniques de terrain, les retours d&apos;expérience sur
              l&apos;hévéaculture durable et la vie institutionnelle de SOCANA COOP CA.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Editorial Grid */}
      <section className="bg-[#F7F8F5] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Interactive Category Filter Buttons */}
          <div
            role="tablist"
            aria-label="Filtrer les articles par catégorie"
            className="flex flex-wrap items-center gap-2 border-b border-[#124B3B]/15 pb-6"
          >
            {CATEGORIES.map((category) => {
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    selected
                      ? 'bg-[#124B3B] text-white'
                      : 'bg-white text-[#3A453F] border border-[#124B3B]/15 hover:border-[#124B3B]/40 hover:text-[#124B3B]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-[#124B3B]/10 rounded-xl p-12 text-center text-[#6B756F]">
              Aucun article disponible dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => {
                const img = resolveArticleImage(article.mediaKey, article.customImageUrl);
                return (
                  <article
                    key={article.id}
                    className="group bg-white rounded-xl overflow-hidden border border-[#124B3B]/10 flex flex-col"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <ResilientImage
                        src={img.src}
                        alt={article.title}
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
                          <span aria-hidden="true">·</span>
                          <span>{article.readTimeMinutes} min</span>
                        </div>
                        <h2 className="text-2xl font-serif font-semibold text-[#124B3B] leading-snug">
                          {article.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-[#4A554F]">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[#124B3B]/10">
                        <button
                          type="button"
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
          )}
        </div>
      </section>
    </div>
  );
}
