/**
 * pg warns that sslmode=require|prefer|verify-ca will change meaning in pg v9 / pg-connection-string v3.
 * Neon and many hosts still default to sslmode=require — normalize to verify-full for explicit behavior.
 * @see https://www.postgresql.org/docs/current/libpq-ssl.html
 */
const LEGACY_SSL_MODES = new Set(["require", "prefer", "verify-ca"]);

export function normalizePgConnectionString(connectionString: string): string {
  const trimmed = connectionString.trim();
  if (!trimmed) return trimmed;

  try {
    const u = new URL(trimmed);
    const current = u.searchParams.get("sslmode");
    if (current && LEGACY_SSL_MODES.has(current.toLowerCase())) {
      u.searchParams.set("sslmode", "verify-full");
    }
    return u.toString();
  } catch {
    return trimmed.replace(/([?&])sslmode=(require|prefer|verify-ca)(?=&|$)/gi, "$1sslmode=verify-full");
  }
}
