export type FooterSocialLinkItem = {
  platform: string;
  href: string;
  label: string;
};

export function slugifySocialPlatform(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/^twitter$/, "x");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) || s.length > 40) return "other";
  return s;
}

export function coerceFooterSocialLinks(raw: unknown): FooterSocialLinkItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): FooterSocialLinkItem | null => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const platformRaw =
        typeof obj.platform === "string" ? obj.platform.trim() : "";
      const href = typeof obj.href === "string" ? obj.href.trim() : "";
      if (!href) return null;
      const okHref =
        href.startsWith("https://") ||
        href.startsWith("http://") ||
        href.startsWith("//");
      if (!okHref) return null;
      const platform = slugifySocialPlatform(platformRaw || "other");
      const label =
        typeof obj.label === "string" && obj.label.trim()
          ? obj.label.trim()
          : platform === "other"
            ? "Social link"
            : platform.charAt(0).toUpperCase() + platform.slice(1);
      return { platform, href, label };
    })
    .filter((v): v is FooterSocialLinkItem => v !== null);
}
