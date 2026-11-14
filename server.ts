import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  createArticle,
  createContactMessage,
  createCustomStat,
  createMembershipRequest,
  createPartner,
  createPartnershipProposal,
  deleteArticle,
  deleteCustomStat,
  deletePartner,
  getAdminOverview,
  getPublicData,
  updateArticle,
  updateSiteSettings,
  updateSubmissionStatus,
} from './server/store.ts';
import {
  validateArticleInput,
  validateContactInput,
  validateMembershipInput,
  validatePartnershipInput,
} from './src/lib/validation.ts';
import type { SubmissionStatus } from './src/types.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const ADMIN_CODE = process.env.ADMIN_ACCESS_CODE || 'SOCANA2016';

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const provided = req.header('x-admin-code');
  if (!provided || provided !== ADMIN_CODE) {
    return res.status(401).json({ error: "Code d'accès administrateur requis ou invalide." });
  }
  return next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Public read endpoint
  app.get('/api/public-data', (_req, res) => {
    try {
      res.json(getPublicData());
    } catch (error) {
      console.error('Failed to read public data:', error);
      res.status(500).json({ error: 'Impossible de charger les données du site.' });
    }
  });

  // Public form submissions
  app.post('/api/memberships', (req, res) => {
    const check = validateMembershipInput(req.body ?? {});
    if (!check.valid || !check.data) {
      return res.status(400).json({ error: 'Formulaire invalide.', errors: check.errors });
    }
    const created = createMembershipRequest(check.data);
    return res.status(201).json({ message: 'Votre demande a été enregistrée.', entry: created });
  });

  app.post('/api/partnerships', (req, res) => {
    const check = validatePartnershipInput(req.body ?? {});
    if (!check.valid || !check.data) {
      return res.status(400).json({ error: 'Formulaire invalide.', errors: check.errors });
    }
    const created = createPartnershipProposal(check.data);
    return res.status(201).json({ message: 'Votre proposition a été transmise.', entry: created });
  });

  app.post('/api/contacts', (req, res) => {
    const check = validateContactInput(req.body ?? {});
    if (!check.valid || !check.data) {
      return res.status(400).json({ error: 'Formulaire invalide.', errors: check.errors });
    }
    const created = createContactMessage(check.data);
    return res.status(201).json({ message: 'Votre message a bien été envoyé.', entry: created });
  });

  // Admin endpoints
  app.post('/api/admin/verify', (req, res) => {
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    if (code !== ADMIN_CODE) {
      return res.status(401).json({ error: "Code d'accès incorrect." });
    }
    return res.json({ verified: true });
  });

  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    res.json(getAdminOverview());
  });

  app.post('/api/admin/articles', requireAdmin, (req, res) => {
    const check = validateArticleInput(req.body ?? {});
    if (!check.valid || !check.data) {
      return res.status(400).json({ error: 'Article invalide.', errors: check.errors });
    }
    const created = createArticle(check.data);
    return res.status(201).json(created);
  });

  app.put('/api/admin/articles/:id', requireAdmin, (req, res) => {
    const check = validateArticleInput(req.body ?? {});
    if (!check.valid || !check.data) {
      return res.status(400).json({ error: 'Article invalide.', errors: check.errors });
    }
    const updated = updateArticle(String(req.params.id), check.data);
    if (!updated) {
      return res.status(404).json({ error: 'Article introuvable.' });
    }
    return res.json(updated);
  });

  app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
    const ok = deleteArticle(String(req.params.id));
    if (!ok) {
      return res.status(404).json({ error: 'Article introuvable.' });
    }
    return res.json({ deleted: true });
  });

  app.post('/api/admin/partners', requireAdmin, (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const role = typeof req.body?.role === 'string' ? req.body.role.trim() : '';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    const logoUrl = typeof req.body?.logoUrl === 'string' ? req.body.logoUrl.trim() : '';
    const websiteUrl = typeof req.body?.websiteUrl === 'string' ? req.body.websiteUrl.trim() : '';

    if (name.length < 2 || role.length < 2 || description.length < 10) {
      return res.status(400).json({
        error: 'Veuillez renseigner le nom, le domaine et une description détaillée du partenaire.',
      });
    }
    const created = createPartner({ name, role, description, logoUrl, websiteUrl });
    return res.status(201).json(created);
  });

  app.delete('/api/admin/partners/:id', requireAdmin, (req, res) => {
    const ok = deletePartner(String(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Partenaire introuvable.' });
    return res.json({ deleted: true });
  });

  app.post('/api/admin/stats', requireAdmin, (req, res) => {
    const value = typeof req.body?.value === 'string' ? req.body.value.trim() : '';
    const label = typeof req.body?.label === 'string' ? req.body.label.trim() : '';
    const detail = typeof req.body?.detail === 'string' ? req.body.detail.trim() : '';
    if (!value || !label) {
      return res.status(400).json({ error: "Veuillez indiquer une valeur et un libellé." });
    }
    const created = createCustomStat({ value, label, detail });
    return res.status(201).json(created);
  });

  app.delete('/api/admin/stats/:id', requireAdmin, (req, res) => {
    const ok = deleteCustomStat(String(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Indicateur introuvable.' });
    return res.json({ deleted: true });
  });

  app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const updated = updateSiteSettings(req.body ?? {});
    return res.json(updated);
  });

  app.patch('/api/admin/submissions/:type/:id', requireAdmin, (req, res) => {
    const type = String(req.params.type);
    const id = String(req.params.id);
    const status = req.body?.status as SubmissionStatus;
    if (
      (type !== 'memberships' && type !== 'partnerships' && type !== 'contacts') ||
      (status !== 'Nouveau' && status !== 'En cours' && status !== 'Traité')
    ) {
      return res.status(400).json({ error: 'Paramètres de mise à jour invalides.' });
    }
    const ok = updateSubmissionStatus(type, id, status);
    if (!ok) return res.status(404).json({ error: 'Demande introuvable.' });
    return res.json({ updated: true });
  });

  // Mount Vite in dev or serve static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SOCANA COOP CA server listening on http://localhost:${PORT}`);
  });
}

startServer();
