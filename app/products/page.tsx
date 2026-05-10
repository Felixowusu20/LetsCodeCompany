import Image from "next/image";
import Link from "next/link";
import { getProjectsAsProducts } from "../../lib/serverContent";

/** Load projects from Postgres at request time (avoids DB calls during `next build` when Neon is unreachable). */
export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeParam(v: string | string[] | undefined): string {
  if (!v) return "";
  return Array.isArray(v) ? (v[0] ?? "") : v;
}

function getCta(product: { downloadUrl?: string | null; websiteUrl?: string | null }) {
  const downloadUrl = product.downloadUrl?.trim() || "";
  const websiteUrl = product.websiteUrl?.trim() || "";
  if (downloadUrl) return { label: "Download", href: downloadUrl };
  if (websiteUrl) return { label: "Visit", href: websiteUrl };
  return null;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const products = await getProjectsAsProducts();
  const sp = (await searchParams) ?? {};
  const q = normalizeParam(sp.q).trim();
  const filtered =
    q.length === 0
      ? products
      : products.filter((p) => {
          const hay = `${p.name}\n${p.description}\n${p.tags.join(" ")}`.toLowerCase();
          return hay.includes(q.toLowerCase());
        });

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">Products</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Explore our apps</h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Search and download the products we’ve shipped for teams like yours.
            </p>

            <form action="/products" method="get" className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search apps, tags, and descriptions…"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-3.5 text-sm text-white placeholder:text-slate-300 shadow-lg shadow-blue-950/30 outline-none transition focus:border-blue-300/60 focus:ring-4 focus:ring-blue-400/20 sm:py-4"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-950/30 transition hover:bg-slate-100 sm:py-4"
                >
                  Search
                </button>
                {q ? (
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:py-4"
                  >
                    Clear
                  </Link>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">All apps</h2>
            <p className="text-sm text-slate-600">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
              {q ? (
                <>
                  {" "}
                  for <span className="font-semibold text-slate-900">“{q}”</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, index) => {
              const cta = getCta(product);
              return (
                <article
                  key={product.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {product.image?.trim() ? (
                        <Image src={product.image} alt="" fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-400">—</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        <Link href={`/products/${product.id}`} className="hover:text-blue-700">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>

                      {product.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Link href={`/products/${product.id}`} className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                          Details
                        </Link>
                        {cta ? (
                          <a
                            href={cta.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                          >
                            {cta.label}
                          </a>
                        ) : (
                          <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
                No projects published yet. Add projects in the admin to populate this page.
              </div>
            )}
            {products.length > 0 && filtered.length === 0 && (
              <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
                No apps match your search.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
