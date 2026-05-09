import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductCardById } from "../../../lib/serverContent";

/** Next.js 15+ passes `params` as a Promise — must await to avoid runtime errors. */
export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductCardById(id);

  if (!product) {
    notFound();
  }

  const downloadUrl = product.downloadUrl?.trim() || "";
  const websiteUrl = product.websiteUrl?.trim() || "";
  const cta =
    downloadUrl ? { label: "Download", href: downloadUrl } : websiteUrl ? { label: "Visit", href: websiteUrl } : null;
  const hasImage = Boolean(product.image?.trim());

  return (
    <main className="bg-slate-50">
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div data-aos="fade-right">
              <Link href="/products" className="mb-4 inline-block text-blue-600 hover:text-blue-700">
                ← Back to Products
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Product</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{product.name}</h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p>
              {cta ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  {cta.label}
                </a>
              ) : null}
              {product.tags.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div
              className="relative h-96 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              {hasImage ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500">
                  <span className="text-sm font-semibold">No image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
