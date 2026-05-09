export class AdminApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(body || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { error?: string };
    return j.error ?? text;
  } catch {
    return text || res.statusText;
  }
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new AdminApiError(res.status, await parseError(res));
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text.trim()) return undefined as T;
  return JSON.parse(text) as T;
}

export async function adminUpload(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.set("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) throw new AdminApiError(res.status, await parseError(res));
  return res.json() as Promise<{ url: string }>;
}

export type MeResponse = { email: string };
export type RegisterStatusResponse = { open: boolean; bootstrap: boolean };
