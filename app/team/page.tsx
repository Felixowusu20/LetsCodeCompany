import Image from "next/image";
import Link from "next/link";
import { getTeamMembers } from "../../lib/serverContent";

const cardBackgrounds = ["bg-sky-200", "bg-rose-200", "bg-amber-200"];

/** Load team from Postgres at request time (avoids DB calls during `next build` when Neon is unreachable). */
export const dynamic = "force-dynamic";

export default async function Team() {
  const members = await getTeamMembers();
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
               Our Team
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
             Meet the Great Minds of ZeoFex
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              The Team behind ZeoFex is a group of passionate individuals dedicated to creating innovative solutions for modern product teams. With a diverse range of skills and expertise, our team is committed to delivering exceptional products and services that drive success for our clients.
             </p>
          </div>
        </div>
      </section>



      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <Link
                key={member.id}
                href={`/team/${member.id}`}
                className="group block overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80 transition hover:-translate-y-1 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`${cardBackgrounds[index % cardBackgrounds.length]} relative h-40`}>
                  <div className="absolute inset-x-0 -bottom-16 flex justify-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg shadow-slate-300/20">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className="pt-20 pb-8 px-8 text-center">
                  <h2 className="text-xl font-semibold text-slate-900">{member.name}</h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500">{member.role}</p>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{member.bio}</p>
                  <div className="mt-8 flex items-center justify-center gap-4 text-slate-500">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition group-hover:bg-blue-50">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.41 2.86 8.16 6.84 9.49.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0 1 12 6.84c.85.004 1.71.11 2.51.32 1.9-1.3 2.74-1.03 2.74-1.03.55 1.39.2 2.42.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49A10.001 10.001 0 0 0 22 12.04c0-5.52-4.48-10-10-10z" />
                      </svg>
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition group-hover:bg-blue-50">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M7.5 21H4.31A3.31 3.31 0 0 1 1 17.69V4.31A3.31 3.31 0 0 1 4.31 1h15.38A3.31 3.31 0 0 1 23 4.31v13.38A3.31 3.31 0 0 1 19.69 21H16.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3.75h1.5a.75.75 0 0 1 .75.75v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 0v0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.5 21v-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition group-hover:bg-blue-50">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M22.46 6c-.77.34-1.6.57-2.47.67a4.3 4.3 0 0 0 1.88-2.37 8.66 8.66 0 0 1-2.73 1.05A4.33 4.33 0 0 0 16.11 4c-2.4 0-4.33 1.93-4.33 4.32 0 .34.04.67.11.99A12.28 12.28 0 0 1 3.14 5.15a4.3 4.3 0 0 0-.59 2.18c0 1.5.76 2.82 1.92 3.59a4.32 4.32 0 0 1-1.96-.54v.05c0 2.1 1.49 3.85 3.46 4.25a4.4 4.4 0 0 1-1.95.07c.55 1.72 2.16 2.98 4.06 3.02A8.7 8.7 0 0 1 2 19.54a12.27 12.27 0 0 0 6.65 1.95c7.98 0 12.35-6.61 12.35-12.33 0-.19 0-.38-.01-.57A8.82 8.82 0 0 0 22.46 6Z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
