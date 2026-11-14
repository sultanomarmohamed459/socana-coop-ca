import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateMembershipInput,
  validatePartnershipInput,
  validateContactInput,
  validateArticleInput,
  filterAndSortArticles,
  getAdjacentArticles,
  slugify,
  formatFrenchDate,
  isExactAdminAccessQuery,
  searchPublicDirectory,
} from './validation';
import type { Article } from '../types';

test('validateMembershipInput rejects empty or invalid phone', () => {
  const invalid = validateMembershipInput({
    fullName: 'Kouassi Jean',
    phone: '123',
    locality: 'Dabou',
    message: 'Bonjour',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);
});

test('validateMembershipInput accepts valid producer submission with optional area', () => {
  const result = validateMembershipInput({
    fullName: 'Koné Seydou',
    phone: '+225 07 08 09 10 11',
    locality: 'San-Pédro',
    plantationArea: '6 hectares',
    message: 'Je souhaite rejoindre la coopérative pour la collecte et le suivi technique.',
  });
  assert.equal(result.valid, true);
  assert.equal(result.data?.locality, 'San-Pédro');
  assert.equal(result.data?.plantationArea, '6 hectares');
});

test('validatePartnershipInput validates email and organization', () => {
  const bad = validatePartnershipInput({
    organizationName: 'A',
    contactName: 'Marie Touré',
    email: 'not-an-email',
    partnershipType: 'Technique',
    message: 'Proposition de collaboration agricole.',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.organizationName);
  assert.ok(bad.errors.email);

  const ok = validatePartnershipInput({
    organizationName: 'AgroTech CI',
    contactName: 'Marie Touré',
    email: 'marie@agrotech.ci',
    partnershipType: 'Accompagnement technique',
    message: 'Nous proposons un programme de formation aux bonnes pratiques de saignée.',
  });
  assert.equal(ok.valid, true);
});

test('validateContactInput validates required fields and optional phone', () => {
  const result = validateContactInput({
    name: 'Amani Koffi',
    email: 'amani@exemple.ci',
    subject: 'Demande de renseignements',
    message: 'Je souhaiterais connaître les horaires de permanence à Abidjan.',
  });
  assert.equal(result.valid, true);
  assert.equal(result.data?.phone, undefined);
});

test('slugify normalizes French accents cleanly', () => {
  assert.equal(
    slugify("Maîtriser la saignée de l'hévéa en Côte d'Ivoire"),
    'maitriser-la-saignee-de-l-hevea-en-cote-d-ivoire'
  );
});

test('validateArticleInput splits double newlines into paragraphs', () => {
  const res = validateArticleInput({
    title: 'Nouvelle campagne de collecte durable',
    category: 'Vie de la coopérative',
    publishedAt: '2026-10-15',
    excerpt: 'Organisation de la collecte groupée dans le Bas-Sassandra.',
    content: 'Premier paragraphe détaillé.\n\nDeuxième paragraphe détaillé.',
    mediaKey: 'collection',
    published: true,
  });
  assert.equal(res.valid, true);
  assert.equal(res.data?.content.length, 2);
});

test('filterAndSortArticles orders descending and getAdjacentArticles resolves neighbors', () => {
  const sample: Article[] = [
    {
      id: '1',
      slug: 'ancien',
      title: 'Article ancien',
      category: 'Filière hévéa',
      publishedAt: '2026-08-01',
      excerpt: 'Résumé ancien',
      content: ['Contenu'],
      mediaKey: 'canopy',
      published: true,
      readTimeMinutes: 2,
    },
    {
      id: '2',
      slug: 'recent',
      title: 'Article récent',
      category: 'Conseils agricoles',
      publishedAt: '2026-10-20',
      excerpt: 'Résumé récent',
      content: ['Contenu'],
      mediaKey: 'tapping',
      published: true,
      readTimeMinutes: 3,
    },
    {
      id: '3',
      slug: 'brouillon',
      title: 'Article brouillon',
      category: 'Conseils agricoles',
      publishedAt: '2026-11-01',
      excerpt: 'Résumé brouillon',
      content: ['Contenu'],
      mediaKey: 'hero',
      published: false,
      readTimeMinutes: 1,
    },
  ];

  const published = filterAndSortArticles(sample, 'Toutes', true);
  assert.equal(published.length, 2);
  assert.equal(published[0].slug, 'recent');
  assert.equal(published[1].slug, 'ancien');

  const nav = getAdjacentArticles(sample, 'recent');
  assert.equal(nav.previous, null);
  assert.equal(nav.next?.slug, 'ancien');
});

test('formatFrenchDate formats ISO dates in French', () => {
  const formatted = formatFrenchDate('2026-10-18');
  assert.match(formatted, /octobre 2026/i);
});

test('isExactAdminAccessQuery matches only the exact string Administrationsocana', () => {
  assert.equal(isExactAdminAccessQuery('Administrationsocana'), true);
  assert.equal(isExactAdminAccessQuery('administrationsocana'), false);
  assert.equal(isExactAdminAccessQuery('Administrationsocan'), false);
  assert.equal(isExactAdminAccessQuery('Administrationsocana '), false);
  assert.equal(isExactAdminAccessQuery('Administration'), false);
  assert.equal(isExactAdminAccessQuery(''), false);
});

test('searchPublicDirectory requires a letter or digit and never leaks Administrationsocana', () => {
  assert.equal(searchPublicDirectory('', []).length, 0);
  assert.equal(searchPublicDirectory('   ', []).length, 0);
  assert.equal(searchPublicDirectory('---', []).length, 0);

  const digitMatches = searchPublicDirectory('2', []);
  assert.ok(digitMatches.some((t) => t.page === 'about'));

  const heveaMatches = searchPublicDirectory('latex', []);
  assert.ok(heveaMatches.some((t) => t.page === 'activities'));

  const partialAdmin = searchPublicDirectory('Administrationsocan', []);
  assert.equal(partialAdmin.length, 0);
});


