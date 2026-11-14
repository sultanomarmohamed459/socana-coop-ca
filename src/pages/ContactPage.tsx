import { useState } from 'react';
import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { SocialMediaIcons } from '../components/SocialMediaIcons';
import { submitContact } from '../lib/api';
import { validateContactInput } from '../lib/validation';
import type { SiteSettings } from '../types';

interface ContactPageProps {
  settings: SiteSettings;
}

export function ContactPage({ settings }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentName, setSentName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const check = validateContactInput({ name, email, phone, subject, message });
    if (!check.valid || !check.data) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await submitContact(check.data);
      setSentName(check.data.name);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer votre message pour le moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasExactAddress = settings.addressDetail.trim().length > 0;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0B382E] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D0AC69]">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Échanger avec l&apos;équipe de SOCANA COOP CA.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Une question sur la collecte, l&apos;accompagnement technique ou une demande
              institutionnelle ? Notre équipe à Abidjan vous répond avec attention.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="bg-[#F7F8F5] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Coordinates Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-xl border border-[#124B3B]/10 p-7 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88A42]">
                    Coordonnées officielles
                  </p>
                  <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                    Siège et permanence
                  </h2>
                </div>

                <ul className="space-y-5 text-sm text-[#3A453F]">
                  <li className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#124B3B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A231E]">Localisation</p>
                      <p>
                        {hasExactAddress
                          ? `${settings.addressDetail} — ${settings.location}`
                          : settings.location}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-[#124B3B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A231E]">Adresse e-mail</p>
                      {settings.email ? (
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-[#124B3B] hover:text-[#B88A42] transition-colors break-all"
                        >
                          {settings.email}
                        </a>
                      ) : (
                        <p className="text-[#6B756F]">Adresse e-mail à venir</p>
                      )}
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-[#124B3B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A231E]">Téléphone</p>
                      {settings.phone ? (
                        <a
                          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                          className="text-[#124B3B] hover:text-[#B88A42] transition-colors"
                        >
                          {settings.phone}
                        </a>
                      ) : (
                        <p className="text-[#6B756F]">Téléphone à venir</p>
                      )}
                    </div>
                  </li>
                </ul>

                <div className="pt-5 border-t border-[#124B3B]/10 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88A42]">
                    Réseaux sociaux
                  </p>
                  <SocialMediaIcons socialLinks={settings.socialLinks} variant="light" />
                </div>
              </div>

              {/* Conditional Map strictly rendered only when exact address is provided */}
              {hasExactAddress && (
                <div className="bg-white rounded-xl border border-[#124B3B]/10 overflow-hidden">
                  <div className="p-5 border-b border-[#124B3B]/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88A42]">
                      Localisation
                    </p>
                    <p className="text-sm font-medium text-[#124B3B] mt-1">
                      {settings.addressDetail}, {settings.location}
                    </p>
                  </div>
                  <iframe
                    title="Carte de localisation SOCANA COOP CA"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=-4.12%2C5.25%2C-3.90%2C5.42&layer=mapnik`}
                    className="w-full h-56 border-0"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              {sentName ? (
                <div
                  role="status"
                  className="bg-white border border-[#286B50]/30 rounded-xl p-8 sm:p-10 text-center space-y-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#124B3B] mx-auto" />
                  <h2 className="text-2xl font-serif font-semibold text-[#124B3B]">
                    Message envoyé
                  </h2>
                  <p className="text-sm sm:text-base text-[#3A453F] max-w-lg mx-auto leading-relaxed">
                    Merci <strong>{sentName}</strong>. Votre message a bien été transmis aux
                    équipes de SOCANA COOP CA. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSentName('')}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#124B3B] border border-[#124B3B]/30 rounded-md hover:bg-[#F7F8F5] transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-white border border-[#124B3B]/10 rounded-xl p-6 sm:p-10 space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#124B3B]">
                      Nous écrire directement
                    </h2>
                    <p className="text-sm text-[#6B756F]">
                      Tous les champs marqués d&apos;un astérisque sont obligatoires.
                    </p>
                  </div>

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
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-[#1A231E]"
                      >
                        Nom <span className="text-[#B88A42]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom complet"
                        className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                      />
                      {errors.name && <p className="text-xs text-red-700">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-[#1A231E]"
                      >
                        Adresse e-mail <span className="text-[#B88A42]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.ci"
                        className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                      />
                      {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-medium text-[#1A231E]"
                      >
                        Téléphone (facultatif)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+225 ..."
                        className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                      />
                      {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-[#1A231E]"
                      >
                        Objet <span className="text-[#B88A42]">*</span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Objet de votre message"
                        className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-700">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-[#1A231E]"
                    >
                      Message <span className="text-[#B88A42]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Rédigez votre message à l'attention de SOCANA COOP CA..."
                      className="w-full px-4 py-3 text-sm bg-[#F7F8F5] border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-700">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] disabled:opacity-60 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
                    >
                      {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
