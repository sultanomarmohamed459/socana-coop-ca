import { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Lock,
  LogOut,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  adminCreateArticle,
  adminCreatePartner,
  adminCreateStat,
  adminDeleteArticle,
  adminDeletePartner,
  adminDeleteStat,
  adminUpdateArticle,
  adminUpdateSettings,
  adminUpdateSubmissionStatus,
  fetchAdminOverview,
  verifyAdminCode,
} from '../lib/api';
import { formatFrenchDate } from '../lib/validation';
import type {
  AdminOverviewData,
  Article,
  ArticleCategory,
  MediaKey,
  SiteSettings,
  SubmissionStatus,
} from '../types';

interface AdminPageProps {
  onDataChange: () => Promise<void>;
}

type AdminTab = 'submissions' | 'articles' | 'partners' | 'stats' | 'settings';

const MEDIA_OPTIONS: Array<{ value: MediaKey; label: string }> = [
  { value: 'tapping', label: 'Récolte et saignée du latex' },
  { value: 'collection', label: 'Collecte et pesée du caoutchouc' },
  { value: 'producers', label: 'Collaboration entre producteurs' },
  { value: 'sustainable', label: 'Agroforesterie durable' },
  { value: 'canopy', label: 'Allée de plantation mature' },
  { value: 'hero', label: 'Panorama de plantation d’hévéas' },
];

const CATEGORIES: ArticleCategory[] = [
  'Conseils agricoles',
  'Vie de la coopérative',
  'Développement durable',
  'Filière hévéa',
];

export function AdminPage({ onDataChange }: AdminPageProps) {
  const [adminCode, setAdminCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('submissions');
  const [feedback, setFeedback] = useState('');

  // Article form state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>('Conseils agricoles');
  const [artDate, setArtDate] = useState(new Date().toISOString().slice(0, 10));
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artMediaKey, setArtMediaKey] = useState<MediaKey>('tapping');
  const [artCustomImg, setArtCustomImg] = useState('');
  const [artPublished, setArtPublished] = useState(true);

  // Partner form state
  const [partName, setPartName] = useState('');
  const [partRole, setPartRole] = useState('');
  const [partDesc, setPartDesc] = useState('');
  const [partLogo, setPartLogo] = useState('');
  const [partWebsite, setPartWebsite] = useState('');

  // Custom Stat form state
  const [statValue, setStatValue] = useState('');
  const [statLabel, setStatLabel] = useState('');
  const [statDetail, setStatDetail] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  const loadOverview = async (code: string) => {
    const data = await fetchAdminOverview(code);
    setOverview(data);
    setSettingsForm(data.settings);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setVerifying(true);
    try {
      const ok = await verifyAdminCode(adminCode);
      if (!ok) {
        setAuthError("Code d'accès administrateur invalide.");
        return;
      }
      await loadOverview(adminCode);
    } catch {
      setAuthError('Impossible de vérifier le code pour le moment.');
    } finally {
      setVerifying(false);
    }
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArtTitle('');
    setArtCategory('Conseils agricoles');
    setArtDate(new Date().toISOString().slice(0, 10));
    setArtExcerpt('');
    setArtContent('');
    setArtMediaKey('tapping');
    setArtCustomImg('');
    setArtPublished(true);
  };

  const startEditingArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArtTitle(article.title);
    setArtCategory(article.category);
    setArtDate(article.publishedAt);
    setArtExcerpt(article.excerpt);
    setArtContent(article.content.join('\n\n'));
    setArtMediaKey(article.mediaKey);
    setArtCustomImg(article.customImageUrl || '');
    setArtPublished(article.published);
    setActiveTab('articles');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    const payload = {
      title: artTitle,
      category: artCategory,
      publishedAt: artDate,
      excerpt: artExcerpt,
      content: artContent
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
      mediaKey: artMediaKey,
      customImageUrl: artCustomImg.trim() || undefined,
      published: artPublished,
    };

    try {
      if (editingArticleId) {
        await adminUpdateArticle(adminCode, editingArticleId, payload);
        setFeedback('Article mis à jour.');
      } else {
        await adminCreateArticle(adminCode, payload);
        setFeedback('Article publié avec succès.');
      }
      resetArticleForm();
      await loadOverview(adminCode);
      await onDataChange();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    await adminDeleteArticle(adminCode, id);
    await loadOverview(adminCode);
    await onDataChange();
    setFeedback('Article supprimé.');
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      await adminCreatePartner(adminCode, {
        name: partName,
        role: partRole,
        description: partDesc,
        logoUrl: partLogo,
        websiteUrl: partWebsite,
      });
      setPartName('');
      setPartRole('');
      setPartDesc('');
      setPartLogo('');
      setPartWebsite('');
      await loadOverview(adminCode);
      await onDataChange();
      setFeedback('Partenaire ajouté.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Impossible d'ajouter le partenaire.");
    }
  };

  const handleDeletePartner = async (id: string) => {
    await adminDeletePartner(adminCode, id);
    await loadOverview(adminCode);
    await onDataChange();
    setFeedback('Partenaire retiré.');
  };

  const handleCreateStat = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      await adminCreateStat(adminCode, {
        value: statValue,
        label: statLabel,
        detail: statDetail,
      });
      setStatValue('');
      setStatLabel('');
      setStatDetail('');
      await loadOverview(adminCode);
      await onDataChange();
      setFeedback('Indicateur ajouté.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Impossible d'ajouter l'indicateur.");
    }
  };

  const handleDeleteStat = async (id: string) => {
    await adminDeleteStat(adminCode, id);
    await loadOverview(adminCode);
    await onDataChange();
    setFeedback('Indicateur supprimé.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    await adminUpdateSettings(adminCode, settingsForm);
    await loadOverview(adminCode);
    await onDataChange();
    setFeedback('Coordonnées et réseaux sociaux mis à jour.');
  };

  const handleStatusChange = async (
    type: 'memberships' | 'partnerships' | 'contacts',
    id: string,
    status: SubmissionStatus
  ) => {
    await adminUpdateSubmissionStatus(adminCode, type, id, status);
    await loadOverview(adminCode);
  };

  if (!overview) {
    return (
      <section className="bg-[#F7F8F5] py-20 lg:py-28">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl border border-[#124B3B]/15 p-8 space-y-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-[#F7F8F5] border border-[#124B3B]/15 flex items-center justify-center text-[#124B3B]">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-semibold text-[#124B3B]">
                Espace Administration
              </h1>
              <p className="text-sm text-[#4A554F] leading-relaxed">
                Connectez-vous pour gérer les demandes d&apos;adhésion, les articles
                d&apos;actualités, les partenaires et les coordonnées de SOCANA COOP CA.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div
                  role="alert"
                  className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800"
                >
                  {authError}
                </div>
              )}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-access-code"
                  className="block text-sm font-medium text-[#1A231E]"
                >
                  Code d&apos;accès coopérative
                </label>
                <input
                  id="admin-access-code"
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Saisissez le code d'accès"
                  className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                />
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="w-full px-5 py-3 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md transition-colors"
              >
                {verifying ? 'Vérification...' : 'Accéder au tableau de bord'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F7F8F5] py-12 lg:py-16 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#124B3B]/15 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              SOCANA COOP CA · Gestion
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Administration du site
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setOverview(null);
              setAdminCode('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#124B3B] bg-white border border-[#124B3B]/20 rounded-md hover:bg-[#124B3B] hover:text-white transition-colors self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Verrouiller la session</span>
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            role="status"
            className="flex items-center gap-2.5 p-4 rounded-lg bg-white border border-[#286B50]/30 text-sm text-[#124B3B]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#286B50] shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Sections d'administration"
          className="flex flex-wrap gap-2"
        >
          {(
            [
              ['submissions', 'Demandes & Messages'],
              ['articles', 'Actualités'],
              ['partners', 'Partenaires'],
              ['stats', 'Chiffres clés'],
              ['settings', 'Coordonnées & Réseaux'],
            ] as Array<[AdminTab, string]>
          ).map(([tabId, label]) => (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={activeTab === tabId}
              onClick={() => setActiveTab(tabId)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tabId
                  ? 'bg-[#124B3B] text-white'
                  : 'bg-white text-[#3A453F] border border-[#124B3B]/15 hover:text-[#124B3B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-8">
            {/* Producer Membership Requests */}
            <div className="bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Demandes d&apos;adhésion producteurs ({overview.memberships.length})
              </h2>
              {overview.memberships.length === 0 ? (
                <p className="text-sm text-[#6B756F]">
                  Aucune demande d&apos;adhésion enregistrée pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-[#124B3B]/10">
                  {overview.memberships.map((m) => (
                    <div
                      key={m.id}
                      className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[#124B3B]">
                          {m.fullName} · <span className="font-normal text-[#6B756F]">{m.locality}</span>
                        </p>
                        <p className="text-xs text-[#6B756F]">
                          Tél. : {m.phone}
                          {m.plantationArea ? ` · Superficie : ${m.plantationArea}` : ''}
                        </p>
                        <p className="text-sm text-[#3A453F] pt-1">{m.message}</p>
                      </div>
                      <select
                        aria-label={`Statut de la demande de ${m.fullName}`}
                        value={m.status}
                        onChange={(e) =>
                          handleStatusChange(
                            'memberships',
                            m.id,
                            e.target.value as SubmissionStatus
                          )
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md self-start"
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En cours">En cours</option>
                        <option value="Traité">Traité</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partnership Proposals */}
            <div className="bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Propositions de partenariat ({overview.partnerships.length})
              </h2>
              {overview.partnerships.length === 0 ? (
                <p className="text-sm text-[#6B756F]">
                  Aucune proposition de partenariat reçue pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-[#124B3B]/10">
                  {overview.partnerships.map((p) => (
                    <div
                      key={p.id}
                      className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[#124B3B]">
                          {p.organizationName} ·{' '}
                          <span className="font-normal text-[#B88A42]">{p.partnershipType}</span>
                        </p>
                        <p className="text-xs text-[#6B756F]">
                          Contact : {p.contactName} ({p.email}
                          {p.phone ? ` · ${p.phone}` : ''})
                        </p>
                        <p className="text-sm text-[#3A453F] pt-1">{p.message}</p>
                      </div>
                      <select
                        aria-label={`Statut de la proposition de ${p.organizationName}`}
                        value={p.status}
                        onChange={(e) =>
                          handleStatusChange(
                            'partnerships',
                            p.id,
                            e.target.value as SubmissionStatus
                          )
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md self-start"
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En cours">En cours</option>
                        <option value="Traité">Traité</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Messages */}
            <div className="bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Messages de contact ({overview.contacts.length})
              </h2>
              {overview.contacts.length === 0 ? (
                <p className="text-sm text-[#6B756F]">
                  Aucun message de contact reçu pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-[#124B3B]/10">
                  {overview.contacts.map((c) => (
                    <div
                      key={c.id}
                      className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[#124B3B]">
                          {c.subject} · <span className="font-normal text-[#6B756F]">{c.name}</span>
                        </p>
                        <p className="text-xs text-[#6B756F]">
                          {c.email}
                          {c.phone ? ` · ${c.phone}` : ''}
                        </p>
                        <p className="text-sm text-[#3A453F] pt-1">{c.message}</p>
                      </div>
                      <select
                        aria-label={`Statut du message de ${c.name}`}
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange('contacts', c.id, e.target.value as SubmissionStatus)
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md self-start"
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En cours">En cours</option>
                        <option value="Traité">Traité</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveArticle}
              className="lg:col-span-5 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4 self-start"
            >
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                {editingArticleId ? "Modifier l'article" : 'Publier un article'}
              </h2>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Titre</label>
                <input
                  type="text"
                  required
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#1A231E]">Catégorie</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#1A231E]">Date</label>
                  <input
                    type="date"
                    required
                    value={artDate}
                    onChange={(e) => setArtDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Photographie éditoriale
                </label>
                <select
                  value={artMediaKey}
                  onChange={(e) => setArtMediaKey(e.target.value as MediaKey)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                >
                  {MEDIA_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  URL d&apos;image personnalisée (facultatif)
                </label>
                <input
                  type="url"
                  value={artCustomImg}
                  onChange={(e) => setArtCustomImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Résumé</label>
                <textarea
                  rows={2}
                  required
                  value={artExcerpt}
                  onChange={(e) => setArtExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Contenu (séparez les paragraphes par une ligne vide)
                </label>
                <textarea
                  rows={5}
                  required
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#1A231E]">
                <input
                  type="checkbox"
                  checked={artPublished}
                  onChange={(e) => setArtPublished(e.target.checked)}
                />
                <span>Publier immédiatement sur le site</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingArticleId ? 'Enregistrer' : 'Publier'}</span>
                </button>
                {editingArticleId && (
                  <button
                    type="button"
                    onClick={resetArticleForm}
                    className="px-4 py-2.5 text-sm text-[#4A554F] border border-[#124B3B]/20 rounded-md"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Articles enregistrés ({overview.articles.length})
              </h2>
              <div className="divide-y divide-[#124B3B]/10">
                {overview.articles.map((art) => (
                  <div
                    key={art.id}
                    className="py-4 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-[#6B756F]">
                        <span className="font-semibold uppercase tracking-wider text-[#B88A42]">
                          {art.category}
                        </span>{' '}
                        · {formatFrenchDate(art.publishedAt)} ·{' '}
                        {art.published ? 'Publié' : 'Brouillon'}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-[#124B3B]">
                        {art.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditingArticle(art)}
                        aria-label={`Modifier "${art.title}"`}
                        className="p-2 text-[#124B3B] hover:bg-[#F7F8F5] rounded-md"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id)}
                        aria-label={`Supprimer "${art.title}"`}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERS */}
        {activeTab === 'partners' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleCreatePartner}
              className="lg:col-span-5 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4 self-start"
            >
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Ajouter un partenaire officiel
              </h2>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Nom du partenaire
                </label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Domaine / Rôle
                </label>
                <input
                  type="text"
                  required
                  value={partRole}
                  onChange={(e) => setPartRole(e.target.value)}
                  placeholder="Ex. Transformation industrielle, Appui agronomique"
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Description</label>
                <textarea
                  rows={3}
                  required
                  value={partDesc}
                  onChange={(e) => setPartDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  URL du logo (facultatif)
                </label>
                <input
                  type="url"
                  value={partLogo}
                  onChange={(e) => setPartLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Site web (facultatif)
                </label>
                <input
                  type="url"
                  value={partWebsite}
                  onChange={(e) => setPartWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter le partenaire</span>
              </button>
            </form>

            <div className="lg:col-span-7 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Partenaires publiés ({overview.partners.length})
              </h2>
              {overview.partners.length === 0 ? (
                <p className="text-sm text-[#6B756F]">
                  Aucun partenaire ajouté pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-[#124B3B]/10">
                  {overview.partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="py-4 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B88A42]">
                          {partner.role}
                        </p>
                        <h3 className="font-serif text-lg font-semibold text-[#124B3B]">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-[#4A554F]">{partner.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(partner.id)}
                        aria-label={`Retirer ${partner.name}`}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-md shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM STATS */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleCreateStat}
              className="lg:col-span-5 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4 self-start"
            >
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Ajouter un chiffre clé
              </h2>
              <p className="text-xs text-[#6B756F]">
                Complète les trois repères de base (2016, Abidjan, Hévéaculture) sur la page
                d&apos;accueil.
              </p>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Valeur</label>
                <input
                  type="text"
                  required
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="Ex. 450+"
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Libellé</label>
                <input
                  type="text"
                  required
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  placeholder="Ex. Producteurs accompagnés"
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Précision (facultatif)
                </label>
                <input
                  type="text"
                  value={statDetail}
                  onChange={(e) => setStatDetail(e.target.value)}
                  placeholder="Courte phrase explicative"
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter l&apos;indicateur</span>
              </button>
            </form>

            <div className="lg:col-span-7 bg-white rounded-xl border border-[#124B3B]/10 p-6 space-y-4">
              <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Indicateurs supplémentaires ({overview.customStats.length})
              </h2>
              {overview.customStats.length === 0 ? (
                <p className="text-sm text-[#6B756F]">
                  Seuls les trois indicateurs institutionnels fixes (2016, Abidjan, Hévéaculture)
                  sont affichés pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-[#124B3B]/10">
                  {overview.customStats.map((s) => (
                    <div key={s.id} className="py-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl font-serif font-semibold text-[#124B3B] tabular-nums">
                          {s.value}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B88A42]">
                          {s.label}
                        </p>
                        {s.detail && <p className="text-sm text-[#4A554F] mt-1">{s.detail}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteStat(s.id)}
                        aria-label={`Supprimer ${s.label}`}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && settingsForm && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-xl border border-[#124B3B]/10 p-6 sm:p-8 max-w-3xl space-y-6"
          >
            <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
              Coordonnées et réseaux sociaux
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Ville / Pays</label>
                <input
                  type="text"
                  value={settingsForm.location}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, location: e.target.value })
                  }
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">
                  Adresse exacte (active la carte sur Contact)
                </label>
                <input
                  type="text"
                  value={settingsForm.addressDetail}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, addressDetail: e.target.value })
                  }
                  placeholder="Ex. Cocody Angré, Rue..."
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Adresse e-mail</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="contact@socana-coop.ci"
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1A231E]">Téléphone</label>
                <input
                  type="tel"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  placeholder="+225 ..."
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#124B3B]/10 space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#124B3B]">Réseaux sociaux</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#1A231E]">Facebook URL</label>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.facebook}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#1A231E]">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.linkedin}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#1A231E]">Instagram URL</label>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.instagram}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] rounded-md transition-colors"
            >
              Enregistrer les coordonnées
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
