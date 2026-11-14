import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { resolveArticleImage } from '../lib/media';
import { formatFrenchDate, getAdjacentArticles } from '../lib/validation';
import type { Article, PageRoute } from '../types';

interface ArticleDetailPageProps {
  articles: Article[];
  slug: string;
  onNavigate: (page: PageRoute, slug?: string) => void;
}

export function ArticleDetailPage({
  articles,
  slug,
  onNavigate,
}: ArticleDetailPageProps) {
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <section className="bg-white py-24">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-5">
          <h1 className="text-3xl font-serif font-semibold text-[#124B3B]">
            Article introuvable
          </h1>
          <p className="text-base text-[#4A554F]">
            Cet article n&apos;est plus disponible ou son adresse a été modifiée.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#124B3B] rounded-md hover:bg-[#0B382E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux actualités</span>
          </button>
        </div>
      </section>
    );
  }

  const img = resolveArticleImage(article.mediaKey, article.customImageUrl);
  const { previous, next } = getAdjacentArticles(articles, article.slug);

  return (
    <article className="bg-white">
      {/* Top Return & Editorial Header */}
      <header className="bg-[#F7F8F5] border-b border-[#124B3B]/10 py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#124B3B] hover:text-[#B88A42] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux actualités</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B756F]">
            <span className="font-semibold uppercase tracking-[0.16em] text-[#B88A42]">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>{formatFrenchDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readTimeMinutes} min de lecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#124B3B] leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-lg text-[#3A453F] leading-relaxed">{article.excerpt}</p>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10">
        <figure className="space-y-2">
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-md bg-[#F7F8F5]">
            <ResilientImage
              src={img.src}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-xs font-serif italic text-[#6B756F] text-right">
            SOCANA COOP CA — {article.category}
          </figcaption>
        </figure>
      </div>

      {/* Optimal 65-75ch Mobile-Friendly Reading Column */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="space-y-6 text-base sm:text-[17px] leading-[1.8] text-[#2A332E]">
          {article.content.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:text-[#124B3B] first-letter:float-left first-letter:mr-3 first-letter:leading-none'
                  : undefined
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Previous / Next Article Navigation */}
        <nav
          aria-label="Navigation entre articles"
          className="mt-16 pt-10 border-t border-[#124B3B]/15 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div>
            {previous && (
              <button
                type="button"
                onClick={() => onNavigate('article', previous.slug)}
                className="group text-left space-y-1.5 w-full p-4 rounded-lg border border-[#124B3B]/10 hover:border-[#124B3B]/35 transition-colors"
              >
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#B88A42] font-semibold">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Article précédent</span>
                </span>
                <p className="font-serif text-lg font-semibold text-[#124B3B] group-hover:text-[#286B50] line-clamp-2">
                  {previous.title}
                </p>
              </button>
            )}
          </div>
          <div>
            {next && (
              <button
                type="button"
                onClick={() => onNavigate('article', next.slug)}
                className="group text-right space-y-1.5 w-full p-4 rounded-lg border border-[#124B3B]/10 hover:border-[#124B3B]/35 transition-colors"
              >
                <span className="inline-flex items-center justify-end gap-1.5 text-xs uppercase tracking-[0.16em] text-[#B88A42] font-semibold">
                  <span>Article suivant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <p className="font-serif text-lg font-semibold text-[#124B3B] group-hover:text-[#286B50] line-clamp-2">
                  {next.title}
                </p>
              </button>
            )}
          </div>
        </nav>
      </div>
    </article>
  );
}
