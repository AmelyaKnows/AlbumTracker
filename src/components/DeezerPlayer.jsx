import { useEffect, useState } from "react";
import { findDeezerAlbumId } from "../services/deezer.js";

export default function DeezerPlayer({ title, artist }) {
  const [id, setId] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setId(null);
    findDeezerAlbumId(title, artist)
      .then((found) => {
        if (cancelled) return;
        setId(found);
        setState(found ? "ready" : "none");
      })
      .catch(() => !cancelled && setState("none"));
    return () => {
      cancelled = true;
    };
  }, [title, artist]);

  if (state === "loading") return <p className="notice">Looking for the full album player…</p>;
  if (state === "none") return <p className="notice">No full-album player found for this album.</p>;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <iframe
        title="Deezer player"
        src={`https://widget.deezer.com/widget/dark/album/${id}`}
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: 12 }}
        allow="encrypted-media; clipboard-write"
        loading="lazy"
      />
      <p className="card-meta">
        Full tracks play when you're logged in to Deezer (depending on your plan and country). Otherwise you get previews.
      </p>
    </div>
  );
}