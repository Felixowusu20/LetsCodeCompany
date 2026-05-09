import Image from "next/image";
import Link from "next/link";
import { getServices } from "../../lib/serverContent";

export default async function Services() {
  const services = await getServices();
  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-20" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          What We Do
        </p>

        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900">
          Our Services
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          We deliver modern digital solutions that help businesses grow and scale.
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <div
            key={service.id}
            className="relative h-[320px] rounded-2xl overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay={idx * 70}
          >
            {/* IMAGE */}
            {service.image ? (
              <Image src={service.image} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            )}

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* CONTENT */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>

              <p className="text-sm text-white/80 mb-4">
                {service.description}
              </p>

              <Link
                href={`/services/${service.id}`}
                className="text-sm font-semibold text-blue-300 hover:text-blue-400 transition"
              >
                See details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA BLOCK */}
      <div className="mt-24 text-center bg-blue-50 rounded-2xl p-14" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Ready to get started?
        </p>

        <h3 className="mt-4 text-3xl font-bold text-gray-900">
          Let’s build something amazing together.
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Partner with LetsCode to design, build, and scale your next big idea.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
