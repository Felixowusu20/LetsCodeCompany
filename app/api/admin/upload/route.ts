import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function parseCloudinaryUrl(raw: string): { cloudName: string; apiKey: string; apiSecret: string } {
  // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
  if (!raw.startsWith("cloudinary://")) {
    throw new Error("CLOUDINARY_URL must start with cloudinary://");
  }
  const rest = raw.slice("cloudinary://".length);
  const at = rest.lastIndexOf("@");
  if (at === -1) throw new Error("CLOUDINARY_URL is missing @<cloud_name>");

  const creds = rest.slice(0, at);
  const cloudName = rest.slice(at + 1).trim();
  if (!cloudName) throw new Error("CLOUDINARY_URL has an empty cloud name");

  const colon = creds.indexOf(":");
  if (colon === -1) throw new Error("CLOUDINARY_URL is missing : between api_key and api_secret");
  const apiKey = decodeURIComponent(creds.slice(0, colon));
  const apiSecret = decodeURIComponent(creds.slice(colon + 1));
  if (!apiKey || !apiSecret) throw new Error("CLOUDINARY_URL must include api_key and api_secret");

  return { cloudName, apiKey, apiSecret };
}

function sha1Hex(input: string): string {
  return createHash("sha1").update(input).digest("hex");
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const rawCloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!rawCloudinaryUrl) {
    return NextResponse.json(
      { error: "CLOUDINARY_URL is not set. Configure it (e.g. on Vercel) to enable uploads." },
      { status: 500 },
    );
  }

  let cloud: { cloudName: string; apiKey: string; apiSecret: string };
  try {
    cloud = parseCloudinaryUrl(rawCloudinaryUrl);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid CLOUDINARY_URL format." },
      { status: 500 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "letscode/uploads";

  // Signed upload: signature is sha1 of sorted params joined with '&' + api_secret.
  // Only include upload params (exclude file, api_key, signature).
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp: String(timestamp),
  };
  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  const signature = sha1Hex(signatureBase + cloud.apiSecret);

  const body = new FormData();
  body.append("file", file, file.name || "upload");
  body.append("api_key", cloud.apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloud.cloudName}/image/upload`;
  const resp = await fetch(endpoint, { method: "POST", body });

  let json: unknown;
  try {
    json = await resp.json();
  } catch {
    json = null;
  }

  if (!resp.ok) {
    const msg =
      typeof json === "object" && json && "error" in json
        ? // Cloudinary returns { error: { message: string } }
          (json as { error?: { message?: string } }).error?.message || "Cloudinary upload failed."
        : "Cloudinary upload failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const secureUrl =
    typeof json === "object" && json && "secure_url" in json ? (json as { secure_url?: string }).secure_url : null;
  if (!secureUrl) {
    return NextResponse.json({ error: "Upload succeeded but Cloudinary response was missing secure_url." }, { status: 502 });
  }

  return NextResponse.json({ url: secureUrl });
}
