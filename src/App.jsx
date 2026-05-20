import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";

const APP_AUTHOR = import.meta.env.VITE_APP_AUTHOR || "Stephcom75";
const REPOSITORY_URL = import.meta.env.VITE_REPOSITORY_URL || "https://github.com/Stephcom75/atelier-ia-tableaux";
const APP_URL = import.meta.env.VITE_APP_URL || "https://atelier-ia-tableaux.vercel.app";
const POLLINATIONS_HOME = "https://pollinations.ai";
const POLLINATIONS_REGISTER = "https://enter.pollinations.ai";

const ARTISTS = [
  {
    id: "van-gogh",
    label: "Van Gogh",
    tag: "Énergie expressive",
    helper: "Touches épaisses, ciel vibrant, mouvement visible.",
    prompt:
      "post-impressionist oil painting inspired by Vincent van Gogh, expressive swirling brushstrokes, thick impasto texture, luminous sky, emotional color palette",
  },
  {
    id: "renoir",
    label: "Renoir",
    tag: "Lumière douce",
    helper: "Ambiance chaleureuse, peau nacrée, impressionnisme élégant.",
    prompt:
      "impressionist oil painting inspired by Pierre-Auguste Renoir, soft luminous brushwork, warm atmosphere, delicate light, refined human presence, painterly texture",
  },
  {
    id: "corot",
    label: "Corot",
    tag: "Paysage poétique",
    helper: "Brume, arbres délicats, nature calme et élégante.",
    prompt:
      "poetic landscape oil painting inspired by Jean-Baptiste-Camille Corot, soft misty atmosphere, subtle natural colors, classical composition, delicate trees and calm light",
  },
  {
    id: "mix",
    label: "Mix musée",
    tag: "Fusion premium",
    helper: "Fusion Van Gogh + Renoir + Corot pour un rendu galerie.",
    prompt:
      "museum-quality oil painting blending post-impressionist expressive brushwork, soft impressionist light, poetic classical landscape atmosphere, rich canvas texture",
  },
];

const RATIOS = [
  { id: "square", label: "Carré", width: 1024, height: 1024, helper: "1:1" },
  { id: "portrait", label: "Portrait", width: 1024, height: 1536, helper: "2:3" },
  { id: "landscape", label: "Paysage", width: 1536, height: 1024, helper: "3:2" },
];

const EXAMPLES = [
  "Une ruelle japonaise de nuit sous la pluie, lanternes chaudes, reflets au sol",
  "Un portrait élégant d’un homme au regard profond dans un intérieur parisien",
  "Un champ de fleurs devant une montagne au coucher du soleil",
  "Une table de Shabbat chaleureuse avec bougies, verre de vin et pain tressé",
];

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function HeaderBadge({ children }) {
  return <span className="header-badge">{children}</span>;
}

export default function App() {
  const [subject, setSubject] = useState(EXAMPLES[0]);
  const [artistId, setArtistId] = useState("van-gogh");
  const [ratioId, setRatioId] = useState("square");
  const [quality, setQuality] = useState("high");
  const [negativePrompt, setNegativePrompt] = useState("text, watermark, signature, frame, logo, blurry, low quality");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("atelier_gallery") || "[]");
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");

  const artist = useMemo(() => ARTISTS.find((item) => item.id === artistId), [artistId]);
  const ratio = useMemo(() => RATIOS.find((item) => item.id === ratioId), [ratioId]);

  const finalPrompt = useMemo(() => {
    return [
      subject,
      artist.prompt,
      "fine art oil painting",
      "visible canvas grain",
      "museum lighting",
      "elegant composition",
      "highly detailed",
      "gallery quality",
      `negative prompt: ${negativePrompt}`,
    ].join(", ");
  }, [subject, artist, negativePrompt]);

  function saveGallery(items) {
    const cleanItems = items.slice(0, 24);
    setGallery(cleanItems);
    localStorage.setItem("atelier_gallery", JSON.stringify(cleanItems));
  }

  async function generateImage() {
    setError("");

    if (!subject.trim()) {
      setError("Décris le tableau que tu veux générer.");
      return;
    }

    setLoading(true);

    try {
      const serverResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          width: ratio.width,
          height: ratio.height,
          quality,
        }),
      });

      const data = await serverResponse.json();

      if (!serverResponse.ok) {
        throw new Error(data?.details || data?.error || `Erreur serveur ${serverResponse.status}`);
      }

      if (!data?.url) {
        throw new Error("Le serveur n’a pas renvoyé d’image.");
      }

      const item = {
        id: crypto.randomUUID(),
        url: data.url,
        subject,
        artist: artist.label,
        size: `${ratio.width}×${ratio.height}`,
        quality,
        prompt: finalPrompt,
        date: new Date().toLocaleString("fr-FR"),
      };

      saveGallery([item, ...gallery]);
    } catch (err) {
      setError(err?.message || "Erreur inconnue pendant la génération.");
    } finally {
      setLoading(false);
    }
  }

  function openImage(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function clearGallery() {
    saveGallery([]);
  }

  return (
    <main className="app-shell">
      <section className="layout">
        <motion.aside
          className="sidebar"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="hero-card">
            <div className="badge-row">
              <HeaderBadge>
                <Sparkles size={15} />
                Built with pollinations.ai
              </HeaderBadge>
              <HeaderBadge>App Author : {APP_AUTHOR}</HeaderBadge>
              <HeaderBadge>Clé API protégée côté serveur</HeaderBadge>
            </div>

            <h1>Atelier IA de tableaux.</h1>
            <p>
              Génère des images de style tableau de musée avec Pollinations, le modèle zimage et une direction artistique inspirée de Van Gogh, Renoir ou Corot.
            </p>

            <div className="link-row">
              <a href={POLLINATIONS_HOME} target="_blank" rel="noreferrer">
                pollinations.ai <ExternalLink size={14} />
              </a>
              <a href={POLLINATIONS_REGISTER} target="_blank" rel="noreferrer" className="secondary-link">
                Compte API <ExternalLink size={14} />
              </a>
              <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" className="secondary-link">
                GitHub <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="panel">
            <div className="secure-box">
              <Sparkles size={18} />
              <div>
                <strong>Version V3 sécurisée</strong>
                <span>Les utilisateurs n’ont plus besoin d’entrer de clé API. La clé reste dans Vercel.</span>
              </div>
            </div>

            <div className="field">
              <label>
                <Palette size={15} />
                Sujet du tableau
              </label>
              <textarea value={subject} onChange={(event) => setSubject(event.target.value)} rows={5} />
            </div>

            <div className="example-grid">
              {EXAMPLES.map((example) => (
                <button key={example} onClick={() => setSubject(example)}>
                  {example}
                </button>
              ))}
            </div>

            <div className="field">
              <label>Style artistique</label>
              <div className="artist-list">
                {ARTISTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setArtistId(item.id)}
                    className={classNames("artist-card", artistId === item.id && "active")}
                  >
                    <span>{item.label}</span>
                    <small>{item.tag}</small>
                    <em>{item.helper}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="ratio-grid">
              {RATIOS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setRatioId(item.id)}
                  className={classNames(ratioId === item.id && "active")}
                >
                  <span>{item.label}</span>
                  <small>{item.helper}</small>
                </button>
              ))}
            </div>

            <div className="field">
              <label>Qualité</label>
              <select value={quality} onChange={(event) => setQuality(event.target.value)}>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="hd">HD</option>
              </select>
            </div>

            <div className="field">
              <label>Éléments à éviter</label>
              <input value={negativePrompt} onChange={(event) => setNegativePrompt(event.target.value)} />
            </div>

            {error && (
              <div className="error-box">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button className="generate-button" onClick={generateImage} disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : <Wand2 size={20} />}
              {loading ? "Génération en cours..." : "Générer le tableau"}
            </button>
          </div>
        </motion.aside>

        <section className="main-panel">
          <div className="prompt-card">
            <div>
              <span>Prompt final</span>
              <p>{finalPrompt}</p>
            </div>
          </div>

          <div className="gallery-header">
            <div>
              <h2>Galerie</h2>
              <p>{gallery.length} image{gallery.length > 1 ? "s" : ""} générée{gallery.length > 1 ? "s" : ""}</p>
            </div>
            {gallery.length > 0 && <button onClick={clearGallery}>Vider la galerie</button>}
          </div>

          {gallery.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={60} />
              <h3>Aucun tableau généré</h3>
              <p>Décris une scène, choisis un style, puis lance la génération.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="image-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: index * 0.025 }}
                >
                  <button className="image-button" onClick={() => openImage(item.url)}>
                    <img src={item.url} alt={item.subject} />
                  </button>
                  <div className="image-meta">
                    <div>
                      <h3>{item.artist}</h3>
                      <p>{item.size} · {item.quality} · {item.date}</p>
                    </div>
                    <p>{item.subject}</p>
                    <button onClick={() => openImage(item.url)}>
                      <Download size={17} />
                      Télécharger / ouvrir
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <footer>
            <p>
              Crédit : cette application utilise l’API <a href={POLLINATIONS_HOME} target="_blank" rel="noreferrer">pollinations.ai</a>. Badge : Built with pollinations.ai. App Author : <strong>{APP_AUTHOR}</strong>.
            </p>
          </footer>
        </section>
      </section>
    </main>
  );
}
