import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";
import "./rundown.css";

const PLATFORM_COLORS = {
  YouTube: "#E14434",
  Instagram: "#C43D6B",
  TikTok: "#1E8F86",
  Newsletter: "#A66A0E",
  LinkedIn: "#2E74B5",
  Facebook: "#38507A",
  "X / Twitter": "#44403C",
  Threads: "#5B4B8A",
};

const MONTH_NAMES = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export default function RundownDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bureau");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [contents, setContents] = useState([]);
  const [contentsLoading, setContentsLoading] = useState(true);
  const [contentsError, setContentsError] = useState(null);

  const [contentForm, setContentForm] = useState({
    title: "",
    platform: "YouTube",
    date: "",
    time: "",
    mediaUrl: "",
    status: "Planifié",
  });

  const [nameForm, setNameForm] = useState(user?.user_metadata?.name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirm: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setContentsLoading(true);
      try {
        const { data, error } = await supabase
          .from("contents")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });

        if (!active) return;

        if (error) {
          setContentsError("Impossible de charger vos contenus. Rechargez la page.");
        } else {
          setContents(data || []);
        }
      } catch {
        if (active) setContentsError("Impossible de charger vos contenus. Rechargez la page.");
      } finally {
        if (active) setContentsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);
    setSubmitting(true);

    const { data, error } = await supabase
      .from("contents")
      .insert([
        {
          user_id: user.id,
          title: contentForm.title,
          platform: contentForm.platform,
          date: contentForm.date,
          time: contentForm.time || null,
          media_url: contentForm.mediaUrl || null,
          status: contentForm.status,
        },
      ])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      setModalError("Impossible d’enregistrer ce contenu. Réessayez.");
      return;
    }

    setContents((prev) =>
      [...prev, data].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setIsModalOpen(false);
    setContentForm({
      title: "",
      platform: "YouTube",
      date: "",
      time: "",
      mediaUrl: "",
      status: "Planifié",
    });
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce contenu ? Cette action est irréversible.")) return;

    const previous = contents;
    setContentsError(null);
    setContents((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase.from("contents").delete().eq("id", id);

    if (error) {
      setContents(previous);
      setContentsError("Impossible de supprimer ce contenu. Réessayez.");
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setNameMessage(null);
    if (!nameForm.trim()) {
      setNameMessage({ type: "error", text: "Le nom ne peut pas être vide." });
      return;
    }
    setNameSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { name: nameForm.trim() },
    });
    setNameSaving(false);
    if (error) {
      setNameMessage({
        type: "error",
        text: "Impossible de mettre à jour le nom. Réessayez.",
      });
    } else {
      setNameMessage({ type: "success", text: "Nom mis à jour." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordForm.password.length < 8) {
      setPasswordMessage({ type: "error", text: "8 caractères minimum." });
      return;
    }
    if (passwordForm.password !== passwordForm.confirm) {
      setPasswordMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas.",
      });
      return;
    }
    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.password,
    });
    setPasswordSaving(false);
    if (error) {
      setPasswordMessage({
        type: "error",
        text: "Impossible de changer le mot de passe. Réessayez.",
      });
    } else {
      setPasswordMessage({ type: "success", text: "Mot de passe mis à jour." });
      setPasswordForm({ password: "", confirm: "" });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "bureau":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span
                  className="rd-mono text-xs uppercase"
                  style={{ color: "#5B6472" }}
                >
                  Édition du Mardi 11 Août 2026
                </span>
                <h1
                  className="rd-display text-2xl font-semibold mt-1"
                  style={{ color: "#1C2430" }}
                >
                  Bienvenue,{" "}
                  {user?.user_metadata?.name || user?.email || "Créateur"}
                </h1>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium px-4 py-2 rounded flex items-center gap-2 w-full sm:w-auto justify-center"
                style={{ background: "#1C2430", color: "#F0F1EC" }}
              >
                + Nouveau contenu
              </button>
            </div>

            {contentsError && (
              <div
                className="rd-mono text-xs mb-5 px-3 py-2 rounded"
                style={{ background: "rgba(181,69,47,0.08)", color: "#B5452F" }}
              >
                {contentsError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: "#5B6472" }}>
                  VUES TOTALES
                </span>
                <div
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#1C2430" }}
                >
                  128 400
                </div>
                <span className="text-xs text-green-600 mt-1 block">
                  ▲ +12,4 %
                </span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: "#5B6472" }}>
                  TAUX D'ENGAGEMENT
                </span>
                <div
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#1C2430" }}
                >
                  6,8 %
                </div>
                <span className="text-xs text-green-600 mt-1 block">
                  ▲ +0,9 pt
                </span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: "#5B6472" }}>
                  NOUVEAUX ABONNÉS
                </span>
                <div
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#1C2430" }}
                >
                  2 340
                </div>
                <span className="text-xs text-green-600 mt-1 block">
                  ▲ +18 %
                </span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: "#5B6472" }}>
                  CONTENUS PUBLIÉS
                </span>
                <div
                  className="text-2xl font-bold mt-2"
                  style={{ color: "#1C2430" }}
                >
                  {contents.length} / 28
                </div>
                <span
                  className="text-xs mt-1 block"
                  style={{ color: "#5B6472" }}
                >
                  Suivi en direct
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rd-line rounded">
                <h3
                  className="rd-display text-lg font-semibold mb-2"
                  style={{ color: "#1C2430" }}
                >
                  Prochaines publications
                </h3>
                <p className="text-xs mb-4" style={{ color: "#5B6472" }}>
                  Aperçu rapide de vos planifications en cours.
                </p>
                {contentsLoading ? (
                  <p className="text-xs text-gray-500 py-4 text-center">
                    Chargement...
                  </p>
                ) : contents.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">
                    Aucune publication planifiée.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contents.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rd-line rounded flex items-center justify-between text-sm bg-gray-50"
                      >
                        <div>
                          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-black/5 mr-2">
                            {item.platform}
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "#1C2430" }}
                          >
                            {item.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.date} à{" "}
                          {item.time ? item.time.slice(0, 5) : "00:00"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rd-line rounded">
                <h3
                  className="rd-display text-lg font-semibold mb-2"
                  style={{ color: "#1C2430" }}
                >
                  Statistiques globales
                </h3>
                <p className="text-xs mb-4" style={{ color: "#5B6472" }}>
                  Vues, 14 derniers jours.
                </p>
                <div
                  className="h-32 flex items-center justify-center border border-dashed rounded text-xs"
                  style={{ color: "#5B6472" }}
                >
                  Graphique d'activité
                </div>
              </div>
            </div>
          </div>
        );

      case "calendrier":
        return (
          <div>
            <h1
              className="rd-display text-2xl font-semibold mb-4"
              style={{ color: "#1C2430" }}
            >
              Calendrier éditorial
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5B6472" }}>
              Vue d'ensemble de vos diffusions multi-plateformes programmées.
            </p>
            {contentsLoading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : contents.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucun contenu planifié pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contents.map((item) => (
                  <div key={item.id} className="bg-white p-4 rd-line rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#1C2430] text-[#F0F1EC]">
                        {item.platform}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {item.date} — {item.time ? item.time.slice(0, 5) : ""}
                      </span>
                    </div>
                    <h4
                      className="font-semibold text-sm mb-2"
                      style={{ color: "#1C2430" }}
                    >
                      {item.title}
                    </h4>
                    {item.media_url && (
                      <p className="text-xs text-blue-600 truncate mb-2">
                        📎 Média attaché : {item.media_url}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "contenus":
        return (
          <div>
            <h1
              className="rd-display text-2xl font-semibold mb-4"
              style={{ color: "#1C2430" }}
            >
              Gestion des Contenus
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5B6472" }}>
              Retrouvez, suivez et supprimez vos publications planifiées.
            </p>

            {contentsError && (
              <div
                className="rd-mono text-xs mb-4 px-3 py-2 rounded"
                style={{ background: "rgba(181,69,47,0.08)", color: "#B5452F" }}
              >
                {contentsError}
              </div>
            )}

            {contentsLoading ? (
              <div
                className="p-8 bg-white rd-line rounded text-center text-sm"
                style={{ color: "#5B6472" }}
              >
                Chargement...
              </div>
            ) : contents.length === 0 ? (
              <div
                className="p-8 bg-white rd-line rounded text-center text-sm"
                style={{ color: "#5B6472" }}
              >
                Aucun contenu enregistré pour le moment. Cliquez sur "+ Nouveau
                contenu".
              </div>
            ) : (
              <div className="space-y-4">
                {contents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rd-line rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200"
                          style={{ color: "#1C2430" }}
                        >
                          {item.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          📅 {item.date} à{" "}
                          {item.time ? item.time.slice(0, 5) : "00:00"}
                        </span>
                      </div>
                      <h4
                        className="font-medium text-base"
                        style={{ color: "#1C2430" }}
                      >
                        {item.title}
                      </h4>
                      {item.media_url && (
                        <p className="text-xs text-gray-500 mt-1">
                          Média : {item.media_url}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="text-xs px-3 py-1.5 rounded font-medium"
                      style={{
                        background: "rgba(181,69,47,0.08)",
                        color: "#B5452F",
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "statistiques": {
        const platformCounts = contents.reduce((acc, item) => {
          acc[item.platform] = (acc[item.platform] || 0) + 1;
          return acc;
        }, {});
        const total = contents.length;
        const platformBreakdown = Object.entries(platformCounts)
          .map(([platform, count]) => ({
            platform,
            count,
            pct: total ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count);

        const monthlyMap = {};
        contents.forEach((item) => {
          const d = new Date(item.date);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (!monthlyMap[key]) {
            monthlyMap[key] = {
              mois: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
              contenus: 0,
              sort: d.getFullYear() * 12 + d.getMonth(),
            };
          }
          monthlyMap[key].contenus += 1;
        });
        const monthlyData = Object.values(monthlyMap).sort(
          (a, b) => a.sort - b.sort,
        );

        return (
          <div>
            <h1
              className="rd-display text-2xl font-semibold mb-1"
              style={{ color: "#1C2430" }}
            >
              Statistiques Globales
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5B6472" }}>
              Basées sur vos contenus planifiés. Les vues et l'engagement
              s'ajouteront une fois vos comptes de plateformes connectés.
            </p>

            {total === 0 ? (
              <div
                className="p-8 bg-white rd-line rounded text-center text-sm"
                style={{ color: "#5B6472" }}
              >
                Ajoutez des contenus pour voir apparaître vos statistiques ici.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rd-line rounded">
                  <h3
                    className="rd-display text-lg font-semibold mb-4"
                    style={{ color: "#1C2430" }}
                  >
                    Répartition par plateforme
                  </h3>
                  <div className="space-y-3">
                    {platformBreakdown.map((p) => (
                      <div key={p.platform}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: "#1C2430" }}>{p.platform}</span>
                          <span
                            className="rd-mono"
                            style={{ color: "#5B6472" }}
                          >
                            {p.count} · {p.pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${p.pct}%`,
                              background:
                                PLATFORM_COLORS[p.platform] || "#8891A0",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rd-line rounded">
                  <h3
                    className="rd-display text-lg font-semibold mb-4"
                    style={{ color: "#1C2430" }}
                  >
                    Contenus planifiés par mois
                  </h3>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis
                          dataKey="mois"
                          tick={{ fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 6 }}
                        />
                        <Bar
                          dataKey="contenus"
                          fill="#1C2430"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "parametres":
        return (
          <div>
            <h1
              className="rd-display text-2xl font-semibold mb-4"
              style={{ color: "#1C2430" }}
            >
              Paramètres du compte
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5B6472" }}>
              Gérez vos informations de profil et vos préférences de connexion.
            </p>

            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-white rd-line rounded">
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "#5B6472" }}
                >
                  E-mail connecté
                </p>
                <p className="text-sm font-bold" style={{ color: "#1C2430" }}>
                  {user?.email}
                </p>
              </div>

              <div className="p-4 bg-white rd-line rounded">
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "#5B6472" }}
                >
                  Nom affiché
                </p>
                {nameMessage && (
                  <div
                    className="rd-mono text-xs mb-3 px-3 py-2 rounded"
                    style={
                      nameMessage.type === "error"
                        ? {
                            background: "rgba(181,69,47,0.08)",
                            color: "#B5452F",
                          }
                        : {
                            background: "rgba(63,125,92,0.1)",
                            color: "#3F7D5C",
                          }
                    }
                  >
                    {nameMessage.text}
                  </div>
                )}
                <form onSubmit={handleNameSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={nameForm}
                    onChange={(e) => setNameForm(e.target.value)}
                    className="rd-input flex-1 rd-line rounded px-3 py-2 text-sm"
                    placeholder="Votre nom"
                  />
                  <button
                    type="submit"
                    disabled={nameSaving}
                    className="text-xs font-medium px-4 py-2 rounded"
                    style={{
                      background: "#1C2430",
                      color: "#F0F1EC",
                      opacity: nameSaving ? 0.6 : 1,
                    }}
                  >
                    {nameSaving ? "..." : "Enregistrer"}
                  </button>
                </form>
              </div>

              <div className="p-4 bg-white rd-line rounded">
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "#5B6472" }}
                >
                  Changer le mot de passe
                </p>
                {passwordMessage && (
                  <div
                    className="rd-mono text-xs mb-3 px-3 py-2 rounded"
                    style={
                      passwordMessage.type === "error"
                        ? {
                            background: "rgba(181,69,47,0.08)",
                            color: "#B5452F",
                          }
                        : {
                            background: "rgba(63,125,92,0.1)",
                            color: "#3F7D5C",
                          }
                    }
                  >
                    {passwordMessage.text}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <input
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        password: e.target.value,
                      })
                    }
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                    placeholder="Nouveau mot de passe"
                  />
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirm: e.target.value,
                      })
                    }
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                    placeholder="Confirmer le mot de passe"
                  />
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="text-xs font-medium px-4 py-2 rounded w-full"
                    style={{
                      background: "#1C2430",
                      color: "#F0F1EC",
                      opacity: passwordSaving ? 0.6 : 1,
                    }}
                  >
                    {passwordSaving
                      ? "Enregistrement..."
                      : "Changer le mot de passe"}
                  </button>
                </form>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-medium px-3 py-2 rounded rd-line"
                style={{ background: "rgba(181,69,47,0.08)", color: "#B5452F" }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative"
      style={{ background: "#F0F1EC" }}
    >
      <div className="lg:hidden flex justify-between items-center p-4 bg-[#1C2430] text-[#F0F1EC]">
        <span className="rd-display text-lg font-semibold">Rundown</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-xs px-3 py-1.5 rounded bg-white/10"
        >
          {isMobileMenuOpen ? "Fermer ✕" : "Menu ☰"}
        </button>
      </div>

      <aside
        className={`w-full lg:w-64 flex-shrink-0 flex-col justify-between p-6 bg-[#1C2430] text-[#F0F1EC] ${
          isMobileMenuOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        <div>
          <div className="mb-8 hidden lg:block">
            <span className="rd-display text-xl font-semibold">Rundown</span>
            <p className="text-xs mt-1" style={{ color: "#A0AEC0" }}>
              Studio de production de contenu
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: "bureau", label: "Bureau" },
              { id: "calendrier", label: "Calendrier" },
              { id: "contenus", label: "Contenus" },
              { id: "statistiques", label: "Statistiques" },
              { id: "parametres", label: "Paramètres" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded text-sm transition-colors"
                style={{
                  background:
                    activeTab === item.id
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  color: activeTab === item.id ? "#F0F1EC" : "#A0AEC0",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          className="text-xs pt-4 border-t border-gray-700 mt-6 lg:mt-0"
          style={{ color: "#A0AEC0" }}
        >
          Connecté en tant que <br />
          <span className="font-medium text-white truncate block">
            {user?.user_metadata?.name || user?.email}
          </span>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl rd-line">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="rd-display text-lg font-semibold"
                style={{ color: "#1C2430" }}
              >
                Planifier un nouveau contenu
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm font-bold px-2 py-1 rounded hover:bg-gray-100"
                style={{ color: "#5B6472" }}
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div
                className="rd-mono text-xs mb-4 px-3 py-2 rounded"
                style={{ background: "rgba(181,69,47,0.08)", color: "#B5452F" }}
              >
                {modalError}
              </div>
            )}

            <form onSubmit={handleContentSubmit}>
              <div className="mb-4">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#1C2430" }}
                >
                  Titre ou légende de la publication
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.title}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, title: e.target.value })
                  }
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  placeholder="Ex: Mon nouveau tutoriel complet..."
                />
              </div>

              <div className="mb-4">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#1C2430" }}
                >
                  Plateforme cible
                </label>
                <select
                  value={contentForm.platform}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, platform: e.target.value })
                  }
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="X / Twitter">X / Twitter</option>
                  <option value="Threads">Threads</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "#1C2430" }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={contentForm.date}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, date: e.target.value })
                    }
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "#1C2430" }}
                  >
                    Heure précise
                  </label>
                  <input
                    type="time"
                    required
                    value={contentForm.time}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, time: e.target.value })
                    }
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#1C2430" }}
                >
                  Lien du média ou de la vidéo (Optionnel)
                </label>
                <input
                  type="url"
                  value={contentForm.mediaUrl}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, mediaUrl: e.target.value })
                  }
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  placeholder="https://exemple.com/ma-video.mp4"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-medium px-4 py-2 rounded rd-line bg-gray-50 hover:bg-gray-100"
                  style={{ color: "#5B6472" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs font-medium px-4 py-2 rounded"
                  style={{
                    background: "#1C2430",
                    color: "#F0F1EC",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Enregistrement..." : "Programmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
