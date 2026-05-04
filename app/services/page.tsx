import Image from "next/image";
import Link from "next/link";
import { mockServices } from "../../lib/mockData";

export default function Services() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
              Services
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Powerful service design for modern product teams.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              We combine engineering, design, and strategy to build digital products that feel premium and scale effortlessly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockServices.map((service) => (
              <article
                key={service.id}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80 transition hover:-translate-y-1 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={service.id * 70}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute left-6 bottom-6 inline-flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur">
                    <span className="text-xl">{service.icon}</span>
                    <span className="font-semibold">{service.title}</span>
                  </div>
                </div>
                <div className="space-y-4 p-8">
                  <p className="text-slate-600">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">Trusted solution</span>
                    <Link href={`/services/${service.id}`} className="text-sm text-slate-400 hover:text-blue-600">
                      See details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
