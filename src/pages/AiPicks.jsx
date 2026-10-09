import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { searchAlbums } from "../services/itunes.js";
import { getRecommendations } from "../services/ai.js";

export default function AiPicks({ openAlbum }) {
  const [prompt, setPrompt] = useState("");
  const [picks, setPicks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { albums } = await getRecommendations(prompt.trim());
      const found = await Promise.all(
        albums.map(async (s) => {
          const [match] = await searchAlbums(`${s.title} ${s.artist}`);
          return match ? { album: match, reason: s.reason } : null;
        })
      );
      setPicks(found.filter(Boolean));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h2 className="page-title">AI picks</h2>
      <div className="search">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Describe a mood or taste, e.g. calm albums for studying"
          aria-label="Describe what you want to hear"
          maxLength={300}
        />
        <button onClick={ask} disabled={loading}>{loading ? "Thinking…" : "Get picks"}</button>
      </div>

      {error && <p className="notice error">{error}</p>}
      {picks?.length === 0 && <p className="notice">No matching albums found. Try describing it differently.</p>}

      <div className="grid">
        {picks?.map(({ album, reason }) => (
          <AlbumCard
            key={album.collectionId}
            title={album.collectionName}
            artist={album.artistName}
            art={album.artworkUrl100}
            meta={reason}
            onOpen={() => openAlbum(album.collectionId)}
          />
        ))}
      </div>
    </section>
  );
}