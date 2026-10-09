export function toEmbedUrl(link = "") {
  const m = link.match(/open\.spotify\.com\/(album|track|playlist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
}

export default function SpotifyEmbed({ link }) {
  const src = toEmbedUrl(link);
  if (!src) return null;
  return (
    <iframe
      title="Spotify player"
      src={src}
      width="100%"
      height="352"
      style={{ border: 0, borderRadius: 12, marginBottom: "2rem" }}
      allow="encrypted-media; clipboard-write"
      loading="lazy"
    />
  );
}