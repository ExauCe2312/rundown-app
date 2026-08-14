// React import is not required with the new JSX transform
import { ArrowRight } from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Libre+Franklin:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.rd-display { font-family: 'Fraunces', serif; }
.rd-mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
`;

const PLATEFORMES = {
  youtube: { code: "YT", couleur: "#E14434" },
  instagram: { code: "IG", couleur: "#C43D6B" },
  tiktok: { code: "TT", couleur: "#1E8F86" },
  newsletter: { code: "NL", couleur: "#A66A0E" },
};

export default function RundownHero() {
  return (
    <section
      className="min-h-screen flex items-center"
      style={{ background: "#1C2430" }}
    >
      <style>{STYLES}</style>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div
          className="inline-flex items-center gap-2 rd-mono text-xs uppercase tracking-widest mb-6 px-3 py-1 rounded-full"
          style={{ color: "#F0F1EC", background: "rgba(255,255,255,0.08)" }}
        >
          Rundown pour créateurs de contenu
        </div>

        <h1
          className="rd-display text-4xl md:text-6xl font-semibold leading-tight mb-6"
          style={{ color: "#F0F1EC" }}
        >
          Arrêtez de jongler
          <br />
          entre vos plateformes.
        </h1>

        <p
          className="text-base md:text-lg mb-10 max-w-xl mx-auto"
          style={{ color: "#B7BEC8" }}
        >
          Rundown réunit votre calendrier de publication et vos statistiques en
          un seul endroit — pour récupérer des heures chaque semaine, sans rien
          perdre de vue.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
          <button
            className="flex items-center gap-2 text-sm font-medium px-6 py-3 rounded"
            style={{ background: "#F0F1EC", color: "#1C2430" }}
          >
            Commencer gratuitement <ArrowRight size={16} />
          </button>
          <button
            className="text-sm font-medium underline underline-offset-4"
            style={{ color: "#B7BEC8" }}
          >
            Voir la démo
          </button>
        </div>

        <div
          className="inline-block text-left px-6 py-5 rounded-lg mb-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p
            className="rd-display text-lg mb-3"
            style={{ color: "#F0F1EC", fontStyle: "italic" }}
          >
            « Depuis que j'ai un vrai calendrier éditorial, je publie deux fois
            plus — et je dors mieux. »
          </p>
          <p
            className="rd-mono text-xs uppercase tracking-wide"
            style={{ color: "#8891A0" }}
          >
            Léa Corbin — créatrice YouTube &amp; newsletter
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="rd-mono text-xs" style={{ color: "#6B7280" }}>
            Compatible avec
          </span>
          {Object.values(PLATEFORMES).map((p) => (
            <span
              key={p.code}
              className="rd-mono text-xs px-1.5 py-0.5 rounded"
              style={{ background: p.couleur, color: "#FFFFFF" }}
            >
              {p.code}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
