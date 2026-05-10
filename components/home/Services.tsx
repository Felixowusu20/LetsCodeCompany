import Image from "next/image";
import Link from "next/link";
import { getServices } from "../../lib/serverContent";

export default async function Services() {
  const services = await getServices();
  return (
    <>
      {/* HEADER */}
      <div className="mb-12 text-center sm:mb-20" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          What We Do
        </p>

        <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          Our Services
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          We deliver modern digital solutions that help businesses grow and scale.
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <div
            key={service.id}
            className="group relative h-64 overflow-hidden rounded-2xl sm:h-[320px]"
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
            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                {service.title}
              </h3>

              <p className="mb-4 text-sm text-white/80">
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
      <div className="mt-16 rounded-2xl bg-blue-50 p-8 text-center sm:mt-24 sm:p-14" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Ready to get started?
        </p>

        <h3 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Let’s build something amazing together.
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Partner with ZeoFex to design, build, and scale your next big idea.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex w-full justify-center rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto"
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
