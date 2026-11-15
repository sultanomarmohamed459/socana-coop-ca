import { useState } from 'react';
import { Building2, CheckCircle2, ExternalLink } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { submitPartnership } from '../lib/api';
import { validatePartnershipInput } from '../lib/validation';
import type { Partner } from '../types';

interface PartnersPageProps {
  partners: Partner[];
}

const PARTNERSHIP_TYPES = [
  'Partenariat industriel / Commercialisation',
  'Appui technique & agronomique',
  'Institutionnel / Développement rural',
  'Logistique & équipement',
  'Autre collaboration',
];

export function PartnersPage({ partners = [] }: PartnersPageProps) {
  const safePartners = partners ?? [];
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partnershipType, setPartnershipType] = useState(PARTNERSHIP_TYPES[0]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrg, setSubmittedOrg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const check = validatePartnershipInput({
      organizationName,
      contactName,
      email,
      phone,
      partnershipType,
      message,
    });

    if (!check.valid || !check.data) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await submitPartnership(check.data);
      setSubmittedOrg(check.data.organizationName);
      setOrganizationName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setPartnershipType(PARTNERSHIP_TYPES[0]);
      setMessage('');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Impossible de transmettre votre proposition pour le moment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0B382E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
              Nos partenaires
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Des alliances durables au service de la filière caoutchouc naturel.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              SOCANA COOP CA collabore avec des acteurs industriels, techniques et institutionnels
              partageant une vision exigeante de la qualité et du développement rural en Côte
              d&apos;Ivoire.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid (No invented partners) */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              Réseau officiel
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Organisations et partenaires engagés
            </h2>
          </div>

          {safePartners.length === 0 ? (
            <div className="bg-[#F7F8F5] border border-[#124B3B]/10 rounded-xl p-10 sm:p-14 text-center max-w-3xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white border border-[#124B3B]/15 flex items-center justify-center mx-auto text-[#124B3B]">
                <Building2 className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Annuaire des partenaires en cours de publication
              </h3>
              <p className="text-sm sm:text-base text-[#4A554F] max-w-xl mx-auto leading-relaxed">
                Les partenaires officiels de SOCANA COOP CA sont publiés et mis à jour
                directement par la direction de la coopérative. Vous souhaitez initier une
                collaboration ? Utilisez le formulaire ci-dessous.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safePartners.map((partner) => (
                <article
                  key={partner.id}
                  className="bg-[#F7F8F5] border border-[#124B3B]/10 rounded-xl p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="h-16 flex items-center">
                      {partner.logoUrl ? (
                        <ResilientImage
                          src={partner.logoUrl}
                          alt={`Logo ${partner.name}`}
                          className="max-h-14 w-auto object-contain"
                          fallbackLabel={partner.name}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-white border border-[#124B3B]/15 flex items-center justify-center text-[#124B3B]">
                          <Building2 className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88A42]">
                        {partner.role}
                      </p>
                      <h3 className="text-2xl font-serif font-semibold text-[#124B3B]">
                        {partner.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-[#4A554F]">
                      {partner.description}
                    </p>
                  </div>

                  {partner.websiteUrl && (
                    <div className="pt-4 border-t border-[#124B3B]/10">
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#124B3B] hover:text-[#B88A42] transition-colors"
                      >
                        <span>Visiter le site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Proposal Form */}
      <section className="bg-[#F7F8F5] border-t border-[#124B3B]/10 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              Collaborer avec nous
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Proposition de partenariat
            </h2>
            <p className="text-base text-[#4A554F]">
              Vous représentez un industriel, une institution financière, un programme technique ou
              un acteur de la chaîne de valeur agricole ? Présentez-nous votre initiative.
            </p>
          </div>

          {submittedOrg ? (
            <div
              role="status"
              className="bg-white border border-[#286B50]/30 rounded-xl p-8 sm:p-10 text-center space-y-4"
            >
              <CheckCircle2 className="w-10 h-10 text-[#124B3B] mx-auto" />
              <h3 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Proposition transmise avec succès
              </h3>
              <p className="text-sm sm:text-base text-[#3A453F] max-w-lg mx-auto leading-relaxed">
                Merci à <strong>{submittedOrg}</strong>. Votre proposition de partenariat a bien
                été enregistrée et sera examinée par le Conseil d&apos;Administration et la
                direction de SOCANA COOP CA.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedOrg('')}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#124B3B] border border-[#124B3B]/30 rounded-md hover:bg-[#F7F8F5] transition-colors"
              >
                Envoyer une nouvelle proposition
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white border border-[#124B3B]/10 rounded-xl p-6 sm:p-10 space-y-6"
            >
              {serverError && (
                <div
                  role="alert"
                  className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-800"
                >
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-org"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Organisation / Entreprise <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="partner-org"
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Nom de votre structure"
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.organizationName && (
                    <p className="text-xs text-red-700">{errors.organizationName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-contact"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Nom du responsable <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="partner-contact"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nom et prénom"
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.contactName && (
                    <p className="text-xs text-red-700">{errors.contactName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-email"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Adresse e-mail <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@organisation.ci"
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-phone"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Téléphone (facultatif)
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 ..."
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="partner-type"
                  className="block text-sm font-medium text-[#1A231E]"
                >
                  Nature du partenariat <span className="text-[#B88A42]">*</span>
                </label>
                <select
                  id="partner-type"
                  value={partnershipType}
                  onChange={(e) => setPartnershipType(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                >
                  {PARTNERSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="partner-message"
                  className="block text-sm font-medium text-[#1A231E]"
                >
                  Présentation de votre proposition <span className="text-[#B88A42]">*</span>
                </label>
                <textarea
                  id="partner-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez les objectifs, le périmètre et les modalités envisagées..."
                  className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                />
                {errors.message && <p className="text-xs text-red-700">{errors.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] disabled:opacity-60 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
                >
                  {submitting ? 'Transmission en cours...' : 'Soumettre la proposition'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
