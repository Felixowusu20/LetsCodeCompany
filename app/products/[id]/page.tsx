import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "../../../lib/mockData";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div data-aos="fade-right">
              <Link href="/products" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                ← Back to Products
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
                Product
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl text-slate-900">
                {product.name}
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {product.description}
              </p>
              <p className="mt-4 text-2xl font-bold text-blue-600">{product.price}</p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl" data-aos="zoom-in" data-aos-delay="100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
