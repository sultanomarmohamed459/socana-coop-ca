import type { Article, ArticleCategory, MediaKey } from '../types';

export interface ValidationResult<T> {
  valid: boolean;
  errors: Record<string, string>;
  data?: T;
}

export interface MembershipPayload {
  fullName: string;
  phone: string;
  locality: string;
  plantationArea?: string;
  message: string;
}

export interface PartnershipPayload {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ArticlePayload {
  title: string;
  category: ArticleCategory;
  publishedAt: string;
  excerpt: string;
  content: string[];
  mediaKey: MediaKey;
  customImageUrl?: string;
  published: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-().+]/g, '');
  return digits.length >= 8 && digits.length <= 15 && /^\d+$/.test(digits);
}

export function validateMembershipInput(input: Record<string, unknown>): ValidationResult<MembershipPayload> {
  const fullName = cleanText(input.fullName);
  const phone = cleanText(input.phone);
  const locality = cleanText(input.locality);
  const plantationArea = cleanText(input.plantationArea);
  const message = cleanText(input.message);

  const errors: Record<string, string> = {};

  if (fullName.length < 3) {
    errors.fullName = 'Veuillez renseigner votre nom et vos prénoms.';
  }
  if (!isValidPhone(phone)) {
    errors.phone = 'Veuillez saisir un numéro de téléphone valide (au moins 8 chiffres).';
  }
  if (locality.length < 2) {
    errors.locality = 'Veuillez indiquer votre localité ou région.';
  }
  if (message.length < 10) {
    errors.message = 'Veuillez préciser votre demande ou situation (minimum 10 caractères).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      fullName,
      phone,
      locality,
      plantationArea: plantationArea || undefined,
      message,
    },
  };
}

export function validatePartnershipInput(input: Record<string, unknown>): ValidationResult<PartnershipPayload> {
  const organizationName = cleanText(input.organizationName);
  const contactName = cleanText(input.contactName);
  const email = cleanText(input.email);
  const phone = cleanText(input.phone);
  const partnershipType = cleanText(input.partnershipType);
  const message = cleanText(input.message);

  const errors: Record<string, string> = {};

  if (organizationName.length < 2) {
    errors.organizationName = "Veuillez indiquer le nom de votre organisation ou entreprise.";
  }
  if (contactName.length < 2) {
    errors.contactName = 'Veuillez renseigner le nom du contact principal.';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Veuillez saisir une adresse e-mail professionnelle valide.';
  }
  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Le numéro de téléphone saisi est invalide.';
  }
  if (partnershipType.length < 2) {
    errors.partnershipType = 'Veuillez sélectionner un type de partenariat.';
  }
  if (message.length < 10) {
    errors.message = 'Veuillez décrire votre proposition (minimum 10 caractères).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      organizationName,
      contactName,
      email,
      phone: phone || undefined,
      partnershipType,
      message,
    },
  };
}

export function validateContactInput(input: Record<string, unknown>): ValidationResult<ContactPayload> {
  const name = cleanText(input.name);
  const email = cleanText(input.email);
  const phone = cleanText(input.phone);
  const subject = cleanText(input.subject);
  const message = cleanText(input.message);

  const errors: Record<string, string> = {};

  if (name.length < 2) {
    errors.name = 'Veuillez renseigner votre nom complet.';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Veuillez saisir une adresse e-mail valide.';
  }
  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Le numéro de téléphone saisi est invalide.';
  }
  if (subject.length < 3) {
    errors.subject = "Veuillez préciser l'objet de votre message.";
  }
  if (message.length < 10) {
    errors.message = 'Veuillez rédiger votre message (minimum 10 caractères).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    },
  };
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function estimateReadTimeMinutes(paragraphs: string[]): number {
  const words = paragraphs
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function validateArticleInput(input: Record<string, unknown>): ValidationResult<ArticlePayload> {
  const title = cleanText(input.title);
  const category = cleanText(input.category) as ArticleCategory;
  const publishedAt = cleanText(input.publishedAt) || new Date().toISOString().slice(0, 10);
  const excerpt = cleanText(input.excerpt);
  const mediaKey = (cleanText(input.mediaKey) || 'canopy') as MediaKey;
  const customImageUrl = cleanText(input.customImageUrl);
  const published = Boolean(input.published);

  const rawContent = Array.isArray(input.content)
    ? input.content.map((p) => cleanText(p)).filter(Boolean)
    : cleanText(input.content)
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

  const errors: Record<string, string> = {};
  const allowedCategories: ArticleCategory[] = [
    'Conseils agricoles',
    'Vie de la coopérative',
    'Développement durable',
    'Filière hévéa',
  ];
  const allowedMediaKeys: MediaKey[] = [
    'hero',
    'tapping',
    'producers',
    'collection',
    'sustainable',
    'canopy',
  ];

  if (title.length < 5) {
    errors.title = "Le titre de l'article doit contenir au moins 5 caractères.";
  }
  if (!allowedCategories.includes(category)) {
    errors.category = 'Catégorie invalide.';
  }
  if (excerpt.length < 12) {
    errors.excerpt = 'Le résumé doit contenir au moins 12 caractères.';
  }
  if (rawContent.length === 0) {
    errors.content = "Le contenu de l'article est requis.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      title,
      category,
      publishedAt,
      excerpt,
      content: rawContent,
      mediaKey: allowedMediaKeys.includes(mediaKey) ? mediaKey : 'canopy',
      customImageUrl: customImageUrl || undefined,
      published,
    },
  };
}

export function filterAndSortArticles(
  articles: Article[],
  category: string = 'Toutes',
  onlyPublished: boolean = true
): Article[] {
  return articles
    .filter((article) => (onlyPublished ? article.published : true))
    .filter((article) => (category === 'Toutes' ? true : article.category === category))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAdjacentArticles(
  articles: Article[],
  currentSlug: string
): { previous: Article | null; next: Article | null } {
  const sorted = filterAndSortArticles(articles, 'Toutes', true);
  const index = sorted.findIndex((item) => item.slug === currentSlug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function formatFrenchDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export const SECRET_ADMIN_KEYWORD = 'Administrationsocana';

export function isExactAdminAccessQuery(input: string): boolean {
  return input === SECRET_ADMIN_KEYWORD;
}

export interface PublicSearchResult {
  id: string;
  label: string;
  description: string;
  page: 'home' | 'about' | 'activities' | 'producers' | 'partners' | 'news' | 'article' | 'contact';
  slug?: string;
  keywords: string[];
}

export const PUBLIC_SEARCH_TOPICS: PublicSearchResult[] = [
  {
    id: 'topic-about',
    label: 'Coopérative & Vision (2016)',
    description: 'Histoire, mission, vision et valeurs de SOCANA COOP CA',
    page: 'about',
    keywords: ['à propos', 'histoire', '2016', 'mission', 'vision', 'valeurs', 'coopérative'],
  },
  {
    id: 'topic-activities',
    label: "Culture de l'hévéa & Collecte",
    description: 'Accompagnement, collecte du latex naturel et commercialisation',
    page: 'activities',
    keywords: ['hévéa', 'hévéaculture', 'collecte', 'latex', 'caoutchouc naturel', 'commercialisation', 'bonnes pratiques'],
  },
  {
    id: 'topic-producers',
    label: 'Devenir membre producteur',
    description: "Avantages, conditions d'adhésion et demande en ligne",
    page: 'producers',
    keywords: ['producteur', 'planteur', 'devenir membre', 'adhésion', 'superficie', 'plantation'],
  },
  {
    id: 'topic-partners',
    label: 'Partenaires & Collaborations',
    description: 'Réseau de partenaires et proposition de partenariat',
    page: 'partners',
    keywords: ['partenaire', 'partenariat', 'collaboration', 'industriel', 'réseau'],
  },
  {
    id: 'topic-news',
    label: 'Actualités et conseils agricoles',
    description: 'Guides techniques de saignée, gestion des sols et vie coopérative',
    page: 'news',
    keywords: ['actualités', 'conseils agricoles', 'saignée', 'agroforesterie', 'sols', 'articles'],
  },
  {
    id: 'topic-contact',
    label: 'Contact & Siège à Abidjan',
    description: "Coordonnées, réseaux sociaux et formulaire d'échange",
    page: 'contact',
    keywords: ['contact', 'abidjan', 'téléphone', 'e-mail', 'message', 'réseaux sociaux'],
  },
];

function normalizeSearchTerm(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function searchPublicDirectory(
  rawQuery: string,
  articles: Article[]
): PublicSearchResult[] {
  if (isExactAdminAccessQuery(rawQuery)) {
    return [];
  }

  const query = normalizeSearchTerm(rawQuery);
  if (!/[a-z0-9]/.test(query)) {
    return [];
  }

  const matchedTopics = PUBLIC_SEARCH_TOPICS.filter((topic) => {
    const haystack = normalizeSearchTerm(
      `${topic.label} ${topic.description} ${topic.keywords.join(' ')}`
    );
    return haystack.includes(query);
  });

  const matchedArticles: PublicSearchResult[] = articles
    .filter((art) => art.published)
    .filter((art) => {
      const haystack = normalizeSearchTerm(`${art.title} ${art.category} ${art.excerpt}`);
      return haystack.includes(query);
    })
    .slice(0, 4)
    .map((art) => ({
      id: `art-${art.id}`,
      label: art.title,
      description: art.category,
      page: 'article',
      slug: art.slug,
      keywords: [art.category],
    }));

  return [...matchedTopics, ...matchedArticles].slice(0, 6);
}


