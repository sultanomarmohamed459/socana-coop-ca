export type PageRoute =
  | 'home'
  | 'about'
  | 'activities'
  | 'producers'
  | 'partners'
  | 'news'
  | 'article'
  | 'contact'
  | 'admin';

export type MediaKey =
  | 'hero'
  | 'tapping'
  | 'producers'
  | 'collection'
  | 'sustainable'
  | 'canopy';

export type ArticleCategory =
  | 'Conseils agricoles'
  | 'Vie de la coopérative'
  | 'Développement durable'
  | 'Filière hévéa';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  publishedAt: string; // YYYY-MM-DD
  excerpt: string;
  content: string[]; // Paragraphs
  mediaKey: MediaKey;
  customImageUrl?: string;
  published: boolean;
  readTimeMinutes: number;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
}

export interface CustomStat {
  id: string;
  value: string;
  label: string;
  detail: string;
}

export interface SiteSettings {
  location: string;
  addressDetail: string;
  email: string;
  phone: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}

export type SubmissionStatus = 'Nouveau' | 'En cours' | 'Traité';

export interface MembershipRequest {
  id: string;
  fullName: string;
  phone: string;
  locality: string;
  plantationArea?: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface PartnershipProposal {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface PublicSiteData {
  articles: Article[];
  partners: Partner[];
  customStats: CustomStat[];
  settings: SiteSettings;
}

export interface AdminOverviewData extends PublicSiteData {
  memberships: MembershipRequest[];
  partnerships: PartnershipProposal[];
  contacts: ContactMessage[];
}
