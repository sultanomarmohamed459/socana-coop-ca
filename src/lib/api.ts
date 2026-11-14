import type {
  AdminOverviewData,
  Article,
  CustomStat,
  Partner,
  PublicSiteData,
  SiteSettings,
  SubmissionStatus,
} from '../types';
import type {
  ArticlePayload,
  ContactPayload,
  MembershipPayload,
  PartnershipPayload,
} from './validation';

async function parseResponse<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error || 'Une erreur est survenue lors de la communication avec le serveur.');
  }
  return payload as T;
}

export async function fetchPublicData(): Promise<PublicSiteData> {
  const res = await fetch('/api/public-data');
  return parseResponse<PublicSiteData>(res);
}

export async function submitMembership(data: MembershipPayload): Promise<{ message: string }> {
  const res = await fetch('/api/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<{ message: string }>(res);
}

export async function submitPartnership(data: PartnershipPayload): Promise<{ message: string }> {
  const res = await fetch('/api/partnerships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<{ message: string }>(res);
}

export async function submitContact(data: ContactPayload): Promise<{ message: string }> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<{ message: string }>(res);
}

export async function verifyAdminCode(code: string): Promise<boolean> {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data?.verified);
}

export async function fetchAdminOverview(code: string): Promise<AdminOverviewData> {
  const res = await fetch('/api/admin/overview', {
    headers: { 'x-admin-code': code },
  });
  return parseResponse<AdminOverviewData>(res);
}

export async function adminCreateArticle(code: string, payload: ArticlePayload): Promise<Article> {
  const res = await fetch('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify(payload),
  });
  return parseResponse<Article>(res);
}

export async function adminUpdateArticle(
  code: string,
  id: string,
  payload: ArticlePayload
): Promise<Article> {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify(payload),
  });
  return parseResponse<Article>(res);
}

export async function adminDeleteArticle(code: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-code': code },
  });
  await parseResponse(res);
}

export async function adminCreatePartner(
  code: string,
  payload: { name: string; role: string; description: string; logoUrl?: string; websiteUrl?: string }
): Promise<Partner> {
  const res = await fetch('/api/admin/partners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify(payload),
  });
  return parseResponse<Partner>(res);
}

export async function adminDeletePartner(code: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/partners/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-code': code },
  });
  await parseResponse(res);
}

export async function adminCreateStat(
  code: string,
  payload: { value: string; label: string; detail: string }
): Promise<CustomStat> {
  const res = await fetch('/api/admin/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify(payload),
  });
  return parseResponse<CustomStat>(res);
}

export async function adminDeleteStat(code: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/stats/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-code': code },
  });
  await parseResponse(res);
}

export async function adminUpdateSettings(
  code: string,
  settings: SiteSettings
): Promise<SiteSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify(settings),
  });
  return parseResponse<SiteSettings>(res);
}

export async function adminUpdateSubmissionStatus(
  code: string,
  type: 'memberships' | 'partnerships' | 'contacts',
  id: string,
  status: SubmissionStatus
): Promise<void> {
  const res = await fetch(`/api/admin/submissions/${type}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
    body: JSON.stringify({ status }),
  });
  await parseResponse(res);
}
