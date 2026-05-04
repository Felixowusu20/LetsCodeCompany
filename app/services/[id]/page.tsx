import Image from "next/image";
import Link from "next/link";
import { mockServices } from "../../../lib/mockData";
import { notFound } from "next/navigation";

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = mockServices.find(s => s.id === parseInt(params.id));

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <Link href="/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
              ← Back to Services
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
              Service
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              {service.description}
            </p>
            <div className="mt-8 text-6xl">{service.icon}</div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl" data-aos="zoom-in">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
