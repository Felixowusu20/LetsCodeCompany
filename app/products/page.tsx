import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "../../lib/mockData";

export default function Products() {
  return (
    <main className="bg-slate-50">
            <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
              Products
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Powerful product design for modern product teams.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Explore purpose-built experiences that simplify operations, improve retention, and drive measurable results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {mockProducts.map((product, index) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/80 transition hover:-translate-y-1 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">{product.price}</p>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900">{product.name}</h2>
                  <p className="mt-4 text-slate-600">{product.description}</p>
                  <Link href={`/products/${product.id}`} className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
