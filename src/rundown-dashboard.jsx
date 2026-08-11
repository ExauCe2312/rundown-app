import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Libre+Franklin:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.rd-root { font-family: 'Libre Franklin', sans-serif; background: #F0F1EC; color: #1C2430; }
.rd-display { font-family: 'Fraunces', serif; }
.rd-mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
.rd-muted { color: #5B6472; }
.rd-line { border: 1px solid #E4E1D8; }
.rd-card { background: #FFFFFF; }
.rd-sidebar { background: #1C2430; }
.rd-hairline { border-bottom: 1px solid #1C2430; }
.rd-btn-primary { background: #1C2430; color: #F0F1EC; }
.rd-btn-primary:hover { background: #2A3547; }
.rd-nav-item { transition: background 0.15s ease; }
.rd-nav-item:hover { background: rgba(255,255,255,0.06); }
`;

const PLATEFORMES = {
  youtube: { code: 'YT', label: 'YouTube', couleur: '#E14434' },
  instagram: { code: 'IG', label: 'Instagram', couleur: '#C43D6B' },
  tiktok: { code: 'TT', label: 'TikTok', couleur: '#1E8F86' },
  newsletter: { code: 'NL', label: 'Newsletter', couleur: '#A66A0E' },
};

const STATS = [
  { label: 'Vues totales', value: '128 400', delta: '+12,4 %', trend: 'up' },
  { label: "Taux d'engagement", value: '6,8 %', delta: '+0,9 pt', trend: 'up' },
  { label: 'Nouveaux abonnés', value: '2 340', delta: '+18 %', trend: 'up' },
  { label: 'Contenus publiés', value: '24 / 28', delta: "86 % de l'objectif", trend: 'neutral' },
];

const VIEWS_TREND = [
  { jour: '26 juil', vues: 3200 },
  { jour: '27 juil', vues: 3450 },
  { jour: '28 juil', vues: 3100 },
  { jour: '29 juil', vues: 3800 },
  { jour: '30 juil', vues: 4200 },
  { jour: '31 juil', vues: 3950 },
  { jour: '1 août', vues: 4600 },
  { jour: '2 août', vues: 4300 },
  { jour: '3 août', vues: 5100 },
  { jour: '4 août', vues: 4800 },
  { jour: '5 août', vues: 5400 },
  { jour: '6 août', vues: 5950 },
  { jour: '7 août', vues: 5700 },
  { jour: '8 août', vues: 6300 },
];

const PLATFORM_BREAKDOWN = [
  { key: 'youtube', pct: 42 },
  { key: 'instagram', pct: 31 },
  { key: 'tiktok', pct: 18 },
  { key: 'newsletter', pct: 9 },
];

const POSTS_BY_DATE = {
  '2026-8-5': [{ platform: 'instagram', title: 'Carrousel : 5 astuces SEO' }],
  '2026-8-8': [{ platform: 'youtube', title: 'Tuto complet Notion' }],
  '2026-8-10': [{ platform: 'newsletter', title: 'Newsletter #24' }],
  '2026-8-12': [{ platform: 'tiktok', title: 'Behind the scenes' }],
  '2026-8-14': [{ platform: 'instagram', title: 'Reel : routine matinale' }],
  '2026-8-15': [
    { platform: 'youtube', title: 'Live Q&R communauté' },
    { platform: 'newsletter', title: 'Récap mensuel' },
  ],
  '2026-8-18': [{ platform: 'tiktok', title: 'Duo tendance' }],
  '2026-8-20': [{ platform: 'instagram', title: 'Résultats du mois' }],
  '2026-8-22': [{ platform: 'youtube', title: 'Vlog coulisses' }],
  '2026-8-25': [{ platform: 'newsletter', title: 'Newsletter #25' }],
  '2026-8-28': [{ platform: 'tiktok', title: 'Astuce rapide' }],
  '2026-8-29': [{ platform: 'instagram', title: 'Bilan du mois' }],
};

const UPCOMING = [
  { platform: 'newsletter', title: 'Newsletter #24 — bilan de juillet', date: '10 août' },
  { platform: 'tiktok', title: 'Behind the scenes du tournage', date: '12 août' },
  { platform: 'instagram', title: 'Reel : routine matinale', date: '14 août' },
  { platform: 'youtube', title: 'Live Q&R avec la communauté', date: '15 août' },
  { platform: 'tiktok', title: 'Duo tendance de la semaine', date: '18 août' },
];

const NAV_ITEMS = ['Bureau', 'Calendrier', 'Contenus', 'Statistiques', 'Audience', 'Paramètres'];
const JOURS = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
const JOURS_LONGS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function getCalendarCells(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function RundownDashboard() {
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => getCalendarCells(viewDate), [viewDate]);
  const today = new Date(2026, 7, 8);
  const todayLabel = `${JOURS_LONGS[today.getDay()]} ${today.getDate()} ${MOIS[today.getMonth()]} ${today.getFullYear()}`;

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="rd-root min-h-screen flex">
      <style>{STYLES}</style>

      <aside className="rd-sidebar w-56 shrink-0 hidden md:flex flex-col text-white">
        <div className="px-6 py-7">
          <span className="rd-display text-2xl font-semibold tracking-tight">Rundown</span>
          <p className="text-xs mt-1" style={{ color: '#8891A0' }}>Studio de production de contenu</p>
        </div>
        <nav className="flex-1 px-4 mt-3 space-y-0.5">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className="rd-nav-item w-full text-left px-3 py-2 text-sm rounded"
              style={
                i === 0
                  ? { background: 'rgba(255,255,255,0.08)', fontWeight: 600, borderLeft: '2px solid #F0F1EC' }
                  : { color: '#9AA2AF', borderLeft: '2px solid transparent' }
              }
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mx-4 mb-6 p-4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs mb-2" style={{ color: '#8891A0' }}>Objectif du mois</p>
          <p className="rd-mono text-lg mb-2">
            24 <span style={{ color: '#8891A0' }}>/ 28</span>
          </p>
          <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-1 rounded-full" style={{ width: '86%', background: '#F0F1EC' }} />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="rd-hairline px-5 md:px-10 pt-8 pb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="rd-mono text-xs rd-muted uppercase tracking-wider mb-2">Édition du {todayLabel}</p>
              <h1 className="rd-display text-3xl font-semibold">Votre semaine en un coup d'œil</h1>
            </div>
            <button className="rd-btn-primary flex items-center gap-2 text-sm px-4 py-2.5 rounded">
              <Plus size={16} />
              Nouveau contenu
            </button>
          </div>
        </div>

        <div className="px-5 md:px-10 py-6 space-y-6">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rd-card rd-line rounded-lg p-4">
                <p className="text-xs rd-muted uppercase tracking-wide mb-2">{s.label}</p>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className="rd-mono text-2xl font-semibold">{s.value}</span>
                  <span
                    className="rd-mono text-xs"
                    style={{ color: s.trend === 'up' ? '#3F7D5C' : s.trend === 'down' ? '#B5452F' : '#5B6472' }}
                  >
                    {s.trend === 'up' && '▲ '}
                    {s.trend === 'down' && '▼ '}
                    {s.delta}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 rd-card rd-line rounded-lg p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h2 className="rd-display text-xl font-semibold">Calendrier de publication</h2>
                <div className="flex items-center gap-3">
                  <span className="rd-mono text-sm capitalize">{MOIS[month]} {year}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={goPrev} className="rd-line p-1.5 rounded hover:bg-stone-50">
                      <ChevronLeft size={15} />
                    </button>
                    <button onClick={goNext} className="rd-line p-1.5 rounded hover:bg-stone-50">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {Object.values(PLATEFORMES).map((p) => (
                  <span key={p.code} className="flex items-center gap-1.5 text-xs rd-muted">
                    <span className="rd-mono text-white px-1 rounded" style={{ background: p.couleur, fontSize: '10px' }}>
                      {p.code}
                    </span>
                    {p.label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 mb-1">
                {JOURS.map((j, i) => (
                  <div key={i} className="rd-mono text-center text-xs rd-muted py-1">{j}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((d, idx) => {
                  if (d === null) return <div key={idx} />;
                  const key = `${year}-${month + 1}-${d}`;
                  const posts = POSTS_BY_DATE[key] || [];
                  const isToday = year === 2026 && month === 7 && d === 8;
                  return (
                    <div
                      key={idx}
                      className="rd-line rounded-md p-1.5 flex flex-col justify-between"
                      style={{
                        minHeight: '62px',
                        background: isToday ? '#FBF9F4' : '#FFFFFF',
                        borderColor: isToday ? '#1C2430' : '#E4E1D8',
                        borderWidth: isToday ? '1.5px' : '1px',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rd-mono text-xs">{d}</span>
                        {isToday && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1C2430' }} />}
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {posts.slice(0, 3).map((post, i) => (
                          <span
                            key={i}
                            title={post.title}
                            className="rd-mono text-white px-1 rounded leading-tight"
                            style={{ background: PLATEFORMES[post.platform].couleur, fontSize: '10px' }}
                          >
                            {PLATEFORMES[post.platform].code}
                          </span>
                        ))}
                        {posts.length > 3 && (
                          <span className="rd-mono rd-muted" style={{ fontSize: '10px' }}>
                            +{posts.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rd-card rd-line rounded-lg p-5 flex flex-col gap-6">
              <div>
                <h2 className="rd-display text-xl font-semibold mb-1">Statistiques globales</h2>
                <p className="rd-mono text-xs rd-muted mb-3 uppercase tracking-wide">Vues, 14 derniers jours</p>
                <div style={{ height: 130 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VIEWS_TREND}>
                      <defs>
                        <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1C2430" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1C2430" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="jour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                      <Area type="monotone" dataKey="vues" stroke="#1C2430" strokeWidth={1.75} fill="url(#colorVues)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <p className="rd-mono text-xs rd-muted mb-3 uppercase tracking-wide">Répartition par plateforme</p>
                <div className="space-y-2.5">
                  {PLATFORM_BREAKDOWN.map((pb) => {
                    const p = PLATEFORMES[pb.key];
                    return (
                      <div key={pb.key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="rd-mono text-white px-1 rounded" style={{ background: p.couleur, fontSize: '10px' }}>
                              {p.code}
                            </span>
                            {p.label}
                          </span>
                          <span className="rd-mono">{pb.pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: '#EDEBE3' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${pb.pct}%`, background: p.couleur }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rd-card rd-line rounded-lg p-5">
            <h2 className="rd-display text-xl font-semibold mb-4">Prochaines publications</h2>
            <div className="divide-y divide-stone-200">
              {UPCOMING.map((u, i) => {
                const p = PLATEFORMES[u.platform];
                return (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <span className="rd-mono text-white px-1.5 py-0.5 rounded shrink-0 text-xs" style={{ background: p.couleur }}>
                      {p.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{u.title}</p>
                      <p className="text-xs rd-muted">{p.label}</p>
                    </div>
                    <span className="rd-mono text-xs rd-muted uppercase whitespace-nowrap">{u.date}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
