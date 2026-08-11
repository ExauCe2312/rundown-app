import React from 'react';
import { Link } from 'react-router-dom';
import './rundown.css';

const FEATURES = [
  {
    n: '01',
    title: 'Calendrier multi-plateforme',
    text: "Planifiez YouTube, Instagram, TikTok et newsletter sur un seul calendrier visuel. Fini les fichiers Excel et les post-it.",
  },
  {
    n: '02',
    title: 'Statistiques globales',
    text: "Vues, engagement, abonnés : toutes vos métriques clés réunies au même endroit, sans ouvrir cinq tableaux de bord différents.",
  },
  {
    n: '03',
    title: "Suivi d'objectifs",
    text: "Fixez un rythme de publication réaliste et suivez votre progression en temps réel, mois après mois.",
  },
  {
    n: '04',
    title: 'Répartition par plateforme',
    text: "Comprenez en un coup d'œil où se concentre votre audience, et investissez votre temps là où il compte.",
  },
];

const PLANS = [
  {
    nom: 'Solo',
    prix: 'Gratuit',
    periode: '',
    description: 'Pour démarrer sereinement.',
    highlight: false,
    cta: 'Commencer gratuitement',
    features: ['1 plateforme suivie', 'Calendrier de publication basique', '10 publications programmées / mois'],
  },
  {
    nom: 'Créateur',
    prix: '15 €',
    periode: '/ mois',
    description: 'Pour publier sur plusieurs canaux sans y perdre la tête.',
    highlight: true,
    badge: 'Le plus populaire',
    cta: '14 jours gratuits',
    features: [
      'Plateformes illimitées',
      'Statistiques globales complètes',
      "Suivi d'objectifs mensuels",
      'Publications illimitées',
    ],
  },
  {
    nom: 'Studio',
    prix: '39 €',
    periode: '/ mois',
    description: 'Pour les équipes et agences créatrices.',
    highlight: false,
    cta: "Contacter l'équipe",
    features: ['Tout Créateur, plus :', 'Comptes collaborateurs multiples', 'Export de rapports', 'Support prioritaire'],
  },
];

const PLATEFORMES = {
  youtube: { code: 'YT', couleur: '#E14434' },
  instagram: { code: 'IG', couleur: '#C43D6B' },
  tiktok: { code: 'TT', couleur: '#1E8F86' },
  newsletter: { code: 'NL', couleur: '#A66A0E' },
};

const FOOTER_COLONNES = [
  { titre: 'Produit', liens: ['Fonctionnalités', 'Tarifs', 'Nouveautés', 'Feuille de route'] },
  { titre: 'Ressources', liens: ["Centre d'aide", 'Guides créateurs', 'Blog', 'Communauté'] },
  { titre: 'Entreprise', liens: ['À propos', 'Contact', 'Mentions légales', 'Confidentialité'] },
];

function Fonctionnalites() {
  return (
    <section style={{ background: '#F0F1EC' }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <p className="rd-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#5B6472' }}>Fonctionnalités</p>
        <h2 className="rd-display text-3xl md:text-4xl font-semibold mb-3" style={{ color: '#1C2430' }}>
          Pensé pour le rythme d'un créateur
        </h2>
        <p className="text-base mb-12 max-w-xl" style={{ color: '#5B6472' }}>
          Chaque fonctionnalité existe pour une raison : vous faire gagner du temps, pas vous donner un écran de
          plus à surveiller.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((f) => (
            <div key={f.n} className="flex gap-4">
              <span className="rd-mono text-sm shrink-0" style={{ color: '#B9B4A5' }}>{f.n}</span>
              <div>
                <h3 className="text-lg font-semibold mb-1.5" style={{ color: '#1C2430' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5B6472' }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tarifs() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <p className="rd-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#5B6472' }}>Tarifs</p>
        <h2 className="rd-display text-3xl md:text-4xl font-semibold mb-3" style={{ color: '#1C2430' }}>
          Des tarifs aussi clairs que votre calendrier
        </h2>
        <p className="text-base mb-12 max-w-xl" style={{ color: '#5B6472' }}>
          Changez de formule à tout moment. Aucune carte bancaire requise pour démarrer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.nom}
              className="rd-line rounded-lg p-6 flex flex-col"
              style={plan.highlight ? { background: '#1C2430', borderColor: '#1C2430' } : { background: '#FFFFFF' }}
            >
              {plan.highlight && (
                <span
                  className="rd-mono text-xs uppercase tracking-wide inline-block mb-4 px-2 py-1 rounded-full self-start"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#F0F1EC' }}
                >
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold mb-1" style={{ color: plan.highlight ? '#F0F1EC' : '#1C2430' }}>
                {plan.nom}
              </h3>
              <p className="text-sm mb-5" style={{ color: plan.highlight ? '#B7BEC8' : '#5B6472' }}>
                {plan.description}
              </p>
              <div className="rd-mono mb-6" style={{ color: plan.highlight ? '#F0F1EC' : '#1C2430' }}>
                <span className="text-3xl font-semibold">{plan.prix}</span>
                {plan.periode && <span className="text-sm ml-1">{plan.periode}</span>}
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="text-sm flex items-start gap-2"
                    style={{ color: plan.highlight ? '#DADDE1' : '#374151' }}
                  >
                    <span className="rd-mono" style={{ color: plan.highlight ? '#F0F1EC' : '#1C2430' }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              
              {/* Le bouton devient un lien vers le login */}
              <Link
                to="/login"
                className="block text-sm font-medium px-4 py-2.5 rounded text-center"
                style={
                  plan.highlight
                    ? { background: '#F0F1EC', color: '#1C2430', textDecoration: 'none' }
                    : { background: '#1C2430', color: '#F0F1EC', textDecoration: 'none' }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="rd-mono text-xs mt-8" style={{ color: '#9CA3AF' }}>
          * Tarifs indicatifs, à ajuster selon votre positionnement et vos coûts réels.
        </p>
      </div>
    </section>
  );
}

function PiedDePage() {
  return (
    <footer style={{ background: '#1C2430' }}>
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <span className="rd-display text-xl font-semibold" style={{ color: '#F0F1EC' }}>Rundown</span>
            <p className="text-sm mt-3 max-w-xs" style={{ color: '#8891A0' }}>
              Le calendrier éditorial des créateurs qui n'ont pas de temps à perdre.
            </p>
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {Object.values(PLATEFORMES).map((p) => (
                <span
                  key={p.code}
                  className="rd-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ background: p.couleur, color: '#FFFFFF' }}
                >
                  {p.code}
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLONNES.map((col) => (
            <div key={col.titre}>
              <p className="rd-mono text-xs uppercase tracking-wide mb-3" style={{ color: '#8891A0' }}>{col.titre}</p>
              <ul className="space-y-2">
                {col.liens.map((lien) => (
                  <li key={lien}>
                    <a href="#" className="text-sm" style={{ color: '#DADDE1' }}>{lien}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between flex-wrap gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="rd-mono text-xs" style={{ color: '#6B7280' }}>© 2026 Rundown. Tous droits réservés.</p>
          <p className="rd-mono text-xs" style={{ color: '#6B7280' }}>Fait pour les créateurs, pas pour les tableurs.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RundownHomepageSections() {
  return (
    <div className="rd-root">
      <Fonctionnalites />
      <Tarifs />
      <PiedDePage />
    </div>
  );
}