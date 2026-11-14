import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type {
  AdminOverviewData,
  Article,
  ContactMessage,
  CustomStat,
  MembershipRequest,
  Partner,
  PartnershipProposal,
  PublicSiteData,
  SiteSettings,
  SubmissionStatus,
} from '../src/types.ts';
import {
  estimateReadTimeMinutes,
  filterAndSortArticles,
  slugify,
  type ArticlePayload,
  type ContactPayload,
  type MembershipPayload,
  type PartnershipPayload,
} from '../src/lib/validation.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'socana-store.json');

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-saignee-hevea',
    slug: 'maitriser-la-saignee-hevea-preserver-ecorce',
    title: "Maîtriser la saignée de l'hévéa : préserver l'écorce et la longévité des plantations",
    category: 'Conseils agricoles',
    publishedAt: '2026-10-18',
    excerpt:
      "Angle d'incision, profondeur de coupe et respect des cycles de repos : les gestes techniques essentiels pour sécuriser le rendement sur le long terme.",
    content: [
      "La qualité et la durée de vie productive d'une plantation d'hévéas reposent avant tout sur la rigueur technique apportée lors de la saignée. Une incision trop profonde endommage le cambium, compromet la régénération de l'écorce et expose l'arbre aux maladies du panneau.",
      "Les conseillers agricoles de SOCANA COOP CA accompagnent directement les planteurs sur le terrain afin de vérifier l'angle d'inclinaison de l'encoche (généralement compris entre 30° et 35°), le réglage de la gouge et le rythme de saignée adapté à la vigueur des arbres.",
      "Au-delà de la coupe, la propreté des gouttières et des tasses de récolte joue un rôle déterminant dans la pureté du latex naturel recueilli. En évitant les impuretés végétales et les contaminations extérieures, le producteur valorise mieux sa récolte lors des opérations de collecte.",
    ],
    mediaKey: 'tapping',
    published: true,
    readTimeMinutes: 3,
  },
  {
    id: 'art-collecte-groupee',
    slug: 'collecte-groupee-securiser-revenu-producteur',
    title: 'Structuration coopérative : comment la collecte groupée sécurise le revenu du producteur',
    category: 'Vie de la coopérative',
    publishedAt: '2026-09-29',
    excerpt:
      "Depuis 2016, l'organisation collective des tournées d'enlèvement et le contrôle transparent du poids renforcent la position économique des hévéaculteurs.",
    content: [
      "L'isolement logistique demeure l'un des principaux freins à la rentabilité des exploitations familiales. En mutualisant la planification des enlèvements entre plusieurs bassins de production, la coopérative réduit les pertes après récolte et fluidifie l'évacuation du caoutchouc naturel.",
      "Chaque lot déposé fait l'objet d'une pesée vérifiée et d'une traçabilité claire. Cette transparence établit une relation de confiance durable entre les membres adhérents et les équipes opérationnelles de SOCANA COOP CA.",
      "La mise en marché collective permet également aux producteurs de bénéficier d'un accès plus régulier aux débouchés industriels tout en conservant un suivi administratif structuré.",
    ],
    mediaKey: 'collection',
    published: true,
    readTimeMinutes: 3,
  },
  {
    id: 'art-agroforesterie-durable',
    slug: 'gestion-durable-sols-bassins-heveicoles-ivoiriens',
    title: 'Gestion durable des sols et couverture végétale dans les plantations ivoiriennes',
    category: 'Développement durable',
    publishedAt: '2026-09-04',
    excerpt:
      "Préserver l'humidité des parcelles, limiter l'érosion pendant les saisons des pluies et accompagner la transition vers des pratiques agro-écologiques responsables.",
    content: [
      "Le maintien d'un couvert végétal adapté entre les lignes d'hévéas protège les sols tropicaux contre le lessivage et favorise la rétention d'eau durant les périodes sèches. Ces pratiques améliorent la vigueur des jeunes plants dès les premières années d'implantation.",
      "SOCANA COOP CA encourage la gestion raisonnée des intrants, le désherbage sélectif et la sensibilisation continue des planteurs à la préservation des zones boisées environnantes.",
      "Cette démarche s'inscrit dans notre vision fondatrice : bâtir une filière du caoutchouc naturel ivoirien performante sur le plan économique tout en respectant les équilibres environnementaux des territoires ruraux.",
    ],
    mediaKey: 'sustainable',
    published: true,
    readTimeMinutes: 3,
  },
];

const DEFAULT_STORE: AdminOverviewData = {
  articles: INITIAL_ARTICLES,
  partners: [],
  customStats: [],
  settings: {
    location: "Abidjan, Côte d'Ivoire",
    addressDetail: '',
    email: '',
    phone: '',
    socialLinks: {
      facebook: '',
      linkedin: '',
      instagram: '',
    },
  },
  memberships: [],
  partnerships: [],
  contacts: [],
};

function ensureStoreFile(): AdminOverviewData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AdminOverviewData>;
    return {
      articles: Array.isArray(parsed.articles) ? parsed.articles : structuredClone(INITIAL_ARTICLES),
      partners: Array.isArray(parsed.partners) ? parsed.partners : [],
      customStats: Array.isArray(parsed.customStats) ? parsed.customStats : [],
      settings: parsed.settings ?? structuredClone(DEFAULT_STORE.settings),
      memberships: Array.isArray(parsed.memberships) ? parsed.memberships : [],
      partnerships: Array.isArray(parsed.partnerships) ? parsed.partnerships : [],
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    };
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
}

function writeStore(data: AdminOverviewData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, STORE_PATH);
}

export function getPublicData(): PublicSiteData {
  const store = ensureStoreFile();
  return {
    articles: filterAndSortArticles(store.articles, 'Toutes', true),
    partners: store.partners,
    customStats: store.customStats,
    settings: store.settings,
  };
}

export function getAdminOverview(): AdminOverviewData {
  const store = ensureStoreFile();
  return {
    ...store,
    articles: filterAndSortArticles(store.articles, 'Toutes', false),
  };
}

export function createMembershipRequest(payload: MembershipPayload): MembershipRequest {
  const store = ensureStoreFile();
  const entry: MembershipRequest = {
    id: randomUUID(),
    ...payload,
    status: 'Nouveau',
    createdAt: new Date().toISOString(),
  };
  store.memberships.unshift(entry);
  writeStore(store);
  return entry;
}

export function createPartnershipProposal(payload: PartnershipPayload): PartnershipProposal {
  const store = ensureStoreFile();
  const entry: PartnershipProposal = {
    id: randomUUID(),
    ...payload,
    status: 'Nouveau',
    createdAt: new Date().toISOString(),
  };
  store.partnerships.unshift(entry);
  writeStore(store);
  return entry;
}

export function createContactMessage(payload: ContactPayload): ContactMessage {
  const store = ensureStoreFile();
  const entry: ContactMessage = {
    id: randomUUID(),
    ...payload,
    status: 'Nouveau',
    createdAt: new Date().toISOString(),
  };
  store.contacts.unshift(entry);
  writeStore(store);
  return entry;
}

export function createArticle(payload: ArticlePayload): Article {
  const store = ensureStoreFile();
  const baseSlug = slugify(payload.title) || `article-${Date.now()}`;
  const slugExists = store.articles.some((a) => a.slug === baseSlug);
  const slug = slugExists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const article: Article = {
    id: randomUUID(),
    slug,
    ...payload,
    readTimeMinutes: estimateReadTimeMinutes(payload.content),
  };
  store.articles.unshift(article);
  writeStore(store);
  return article;
}

export function updateArticle(id: string, payload: ArticlePayload): Article | null {
  const store = ensureStoreFile();
  const idx = store.articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  const updated: Article = {
    ...store.articles[idx],
    ...payload,
    readTimeMinutes: estimateReadTimeMinutes(payload.content),
  };
  store.articles[idx] = updated;
  writeStore(store);
  return updated;
}

export function deleteArticle(id: string): boolean {
  const store = ensureStoreFile();
  const prevLen = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  if (store.articles.length === prevLen) return false;
  writeStore(store);
  return true;
}

export function createPartner(input: {
  name: string;
  role: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
}): Partner {
  const store = ensureStoreFile();
  const partner: Partner = {
    id: randomUUID(),
    name: input.name.trim(),
    role: input.role.trim(),
    description: input.description.trim(),
    logoUrl: input.logoUrl?.trim() || undefined,
    websiteUrl: input.websiteUrl?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  store.partners.unshift(partner);
  writeStore(store);
  return partner;
}

export function deletePartner(id: string): boolean {
  const store = ensureStoreFile();
  const prevLen = store.partners.length;
  store.partners = store.partners.filter((p) => p.id !== id);
  if (store.partners.length === prevLen) return false;
  writeStore(store);
  return true;
}

export function createCustomStat(input: { value: string; label: string; detail: string }): CustomStat {
  const store = ensureStoreFile();
  const stat: CustomStat = {
    id: randomUUID(),
    value: input.value.trim(),
    label: input.label.trim(),
    detail: input.detail.trim(),
  };
  store.customStats.push(stat);
  writeStore(store);
  return stat;
}

export function deleteCustomStat(id: string): boolean {
  const store = ensureStoreFile();
  const prevLen = store.customStats.length;
  store.customStats = store.customStats.filter((s) => s.id !== id);
  if (store.customStats.length === prevLen) return false;
  writeStore(store);
  return true;
}

export function updateSiteSettings(nextSettings: Partial<SiteSettings>): SiteSettings {
  const store = ensureStoreFile();
  store.settings = {
    location: nextSettings.location?.trim() || "Abidjan, Côte d'Ivoire",
    addressDetail: nextSettings.addressDetail?.trim() ?? '',
    email: nextSettings.email?.trim() ?? '',
    phone: nextSettings.phone?.trim() ?? '',
    socialLinks: {
      facebook: nextSettings.socialLinks?.facebook?.trim() ?? '',
      linkedin: nextSettings.socialLinks?.linkedin?.trim() ?? '',
      instagram: nextSettings.socialLinks?.instagram?.trim() ?? '',
    },
  };
  writeStore(store);
  return store.settings;
}

export function updateSubmissionStatus(
  type: 'memberships' | 'partnerships' | 'contacts',
  id: string,
  status: SubmissionStatus
): boolean {
  const store = ensureStoreFile();
  const list = store[type];
  const item = list.find((entry) => entry.id === id);
  if (!item) return false;
  item.status = status;
  writeStore(store);
  return true;
}
