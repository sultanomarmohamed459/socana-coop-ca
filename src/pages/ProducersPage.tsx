import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { submitMembership } from '../lib/api';
import { MEDIA_ASSETS } from '../lib/media';
import { validateMembershipInput } from '../lib/validation';

const BENEFITS = [
  {
    number: '01',
    title: 'Débouché structuré et régulier',
    text: "Bénéficiez d'une organisation collective de la collecte et d'un accès direct à des circuits de commercialisation fiables.",
  },
  {
    number: '02',
    title: 'Accompagnement agronomique',
    text: "Profitez de conseils pratiques sur la conduite de l'hévéa, l'entretien des parcelles et l'amélioration de la saignée.",
  },
  {
    number: '03',
    title: 'Transparence des opérations',
    text: "Chaque livraison est enregistrée avec rigueur afin d'assurer un suivi clair de vos apports et de leur valorisation.",
  },
  {
    number: '04',
    title: 'Force du collectif coopératif',
    text: "Rejoignez une communauté de producteurs solidaires engagés pour la pérennité de leurs exploitations.",
  },
];

export function ProducersPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [plantationArea, setPlantationArea] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const check = validateMembershipInput({
      fullName,
      phone,
      locality,
      plantationArea,
      message,
    });

    if (!check.valid || !check.data) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await submitMembership(check.data);
      setSubmittedName(check.data.fullName);
      setFullName('');
      setPhone('');
      setLocality('');
      setPlantationArea('');
      setMessage('');
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer votre demande pour le moment."
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
              Espace producteurs
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white leading-[1.1]">
              Rejoindre SOCANA COOP CA et valoriser durablement votre plantation.
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Nous accompagnons les hévéaculteurs de Côte d&apos;Ivoire à travers un encadrement
              technique de proximité, une collecte organisée et des bonnes pratiques agricoles.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              Avantages membres
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Pourquoi adhérer à notre coopérative ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b) => (
              <div
                key={b.number}
                className="p-7 rounded-xl bg-[#F7F8F5] border border-[#124B3B]/10 space-y-3"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-[#B88A42] tabular-nums">
                  {b.number}
                </p>
                <h3 className="text-xl font-serif font-semibold text-[#124B3B]">{b.title}</h3>
                <p className="text-sm leading-relaxed text-[#4A554F]">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions, Collection & Good Practices */}
      <section className="bg-[#F7F8F5] border-y border-[#124B3B]/10 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5">
              <div className="h-full min-h-[320px] rounded-xl overflow-hidden shadow-sm">
                <ResilientImage
                  src={MEDIA_ASSETS.tapping.src}
                  alt={MEDIA_ASSETS.tapping.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
                  Conditions &amp; accompagnement
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
                  Modalités d&apos;adhésion, collecte et bonnes pratiques
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[#124B3B]/10 space-y-2">
                  <h3 className="text-xl font-serif font-semibold text-[#124B3B]">
                    Conditions d&apos;adhésion
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4A554F]">
                    Être producteur ou exploitant d&apos;une plantation d&apos;hévéas en Côte
                    d&apos;Ivoire (en production ou en phase de croissance) et adhérer aux statuts
                    et principes de transparence de la coopérative.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#124B3B]/10 space-y-2">
                  <h3 className="text-xl font-serif font-semibold text-[#124B3B]">
                    Informations sur la collecte
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4A554F]">
                    Les tournées de collecte sont organisées par secteur selon un calendrier
                    partagé avec les délégués de zone, avec pesée transparente et enregistrement
                    systématique.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#124B3B]/10 space-y-2 sm:col-span-2">
                  <h3 className="text-xl font-serif font-semibold text-[#124B3B]">
                    Bonnes pratiques agricoles encouragées
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4A554F]">
                    Maintien de la propreté des tasses de récolte, saignée respectueuse du panneau
                    d&apos;écorce, absence de corps étrangers dans le caoutchouc et préservation du
                    couvert végétal des parcelles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Form */}
      <section id="devenir-membre" className="bg-white py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A42]">
              Adhésion producteur
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#124B3B]">
              Devenir membre de SOCANA COOP CA
            </h2>
            <p className="text-base text-[#4A554F]">
              Remplissez ce formulaire pour déposer votre demande d&apos;adhésion. Un responsable
              de la coopérative vous contactera rapidement.
            </p>
          </div>

          {submittedName ? (
            <div
              role="status"
              className="bg-[#F7F8F5] border border-[#286B50]/30 rounded-xl p-8 sm:p-10 text-center space-y-4"
            >
              <CheckCircle2 className="w-10 h-10 text-[#124B3B] mx-auto" />
              <h3 className="text-2xl font-serif font-semibold text-[#124B3B]">
                Demande d&apos;adhésion enregistrée
              </h3>
              <p className="text-sm sm:text-base text-[#3A453F] max-w-lg mx-auto leading-relaxed">
                Merci <strong>{submittedName}</strong>. Votre demande a bien été transmise aux
                équipes de SOCANA COOP CA. Nos conseillers prendront contact avec vous dans les
                meilleurs délais.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedName('')}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#124B3B] border border-[#124B3B]/30 rounded-md hover:bg-white transition-colors"
              >
                Soumettre une autre demande
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-[#F7F8F5] border border-[#124B3B]/10 rounded-xl p-6 sm:p-10 space-y-6"
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
                    htmlFor="member-fullname"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Nom et prénoms <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="member-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex. Kouassi Yao Jean"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-700">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="member-phone"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Numéro de téléphone <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="member-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex. +225 07 00 00 00 00"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="member-locality"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Localité <span className="text-[#B88A42]">*</span>
                  </label>
                  <input
                    id="member-locality"
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="Ex. Dabou, Grand-Lahou, San-Pédro..."
                    className="w-full px-4 py-3 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                  {errors.locality && (
                    <p className="text-xs text-red-700">{errors.locality}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="member-area"
                    className="block text-sm font-medium text-[#1A231E]"
                  >
                    Superficie de la plantation (facultatif)
                  </label>
                  <input
                    id="member-area"
                    type="text"
                    value={plantationArea}
                    onChange={(e) => setPlantationArea(e.target.value)}
                    placeholder="Ex. 5 hectares"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="member-message"
                  className="block text-sm font-medium text-[#1A231E]"
                >
                  Message <span className="text-[#B88A42]">*</span>
                </label>
                <textarea
                  id="member-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez l'état de votre plantation (en production ou jeune plantation) et vos attentes..."
                  className="w-full px-4 py-3 text-sm bg-white border border-[#124B3B]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#124B3B]"
                />
                {errors.message && <p className="text-xs text-red-700">{errors.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-white bg-[#124B3B] hover:bg-[#0B382E] disabled:opacity-60 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124B3B]"
                >
                  {submitting ? 'Envoi en cours...' : "Envoyer ma demande d'adhésion"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
