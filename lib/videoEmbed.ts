function isPlausibleYoutubeVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{6,64}$/.test(id);
}

/**
 * Extracts a YouTube video id from common URL shapes.
 * Handles youtube.com/watch?v=, youtu.be/, embed/, shorts/, optional www/m subdomain.
 */
export function parseYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    const withProto = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
    parsed = new URL(withProto);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return null;

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
    return id && isPlausibleYoutubeVideoId(id) ? id : null;
  }

  const isYoutubeHost =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host.endsWith(".youtube.com");

  if (!isYoutubeHost) return null;

  const path = parsed.pathname;

  if (path.startsWith("/embed/")) {
    const id = path.slice("/embed/".length).split("/")[0]?.split("?")[0];
    return id && isPlausibleYoutubeVideoId(id) ? id : null;
  }

  if (path.startsWith("/shorts/")) {
    const id = path.slice("/shorts/".length).split("/")[0]?.split("?")[0];
    return id && isPlausibleYoutubeVideoId(id) ? id : null;
  }

  if (path.startsWith("/live/")) {
    const id = path.slice("/live/".length).split("/")[0]?.split("?")[0];
    return id && isPlausibleYoutubeVideoId(id) ? id : null;
  }

  if (path === "/watch" || path === "/watch/") {
    const v = parsed.searchParams.get("v");
    return v && isPlausibleYoutubeVideoId(v) ? v : null;
  }

  const v = parsed.searchParams.get("v");
  if (v && isPlausibleYoutubeVideoId(v)) return v;

  return null;
}

/**
 * Classifies a background media URL for the hero: YouTube embed vs direct file stream.
 */
export function getVideoEmbedKind(url: string): "youtube" | "file" | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (parseYouTubeVideoId(trimmed)) return "youtube";

  if (trimmed.startsWith("/")) return "file";

  try {
    const withProto = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
    const parsed = new URL(withProto);
    if (["http:", "https:"].includes(parsed.protocol)) return "file";
  } catch {
    return null;
  }

  return null;
}
