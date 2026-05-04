import Image from "next/image";
import { CheckCircle2, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { contactMock } from "../../lib/mockData";

const channelIcons = [Mail, Phone, MapPin];

export default function Contact() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s build the next version of your product.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Tell us what you are creating, improving, or scaling. We will help shape the right frontend foundation for the work ahead.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.35fr] lg:px-8">
          <aside className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80" data-aos="fade-right">
              <div className="relative h-72">
                <Image
                  src={contactMock.image}
                  alt="LetsCode product studio workspace"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-950/10 backdrop-blur">
                    <Clock3 className="h-4 w-4 text-blue-600" />
                    Monday - Friday, 9am - 6pm
                  </div>
                </div>
              </div>
              <div className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Start with a focused conversation.
                </h2>
                <p className="leading-7 text-slate-600">
                  We use your message to understand the product stage, scope, timeline, and technical direction before recommending next steps.
                </p>
                <div className="space-y-3">
                  {contactMock.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-200/70 backdrop-blur" data-aos="fade-right" data-aos-delay="120">
              <h2 className="text-xl font-bold text-slate-900">Typical response times</h2>
              <div className="mt-6 space-y-5">
                {contactMock.responseTimes.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-slate-600">{item.label}</p>
                    <p className="text-right text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {contactMock.channels.map((channel, index) => {
                const Icon = channelIcons[index];

                return (
                  <article
                    key={channel.title}
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl"
                    data-aos="fade-up"
                    data-aos-delay={index * 90}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 text-lg font-semibold text-slate-900">{channel.title}</h2>
                    <p className="mt-2 text-sm font-semibold text-blue-600">{channel.value}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{channel.description}</p>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/80 sm:p-8 lg:p-10" data-aos="fade-left" data-aos-delay="120">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
                  Project inquiry
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  Send us the useful details.
                </h2>
                <p className="mt-4 leading-7 text-slate-600">
                  This frontend uses mock form handling for now, keeping the page ready for backend integration later.
                </p>
              </div>

              <form className="mt-10 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@company.com"
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-slate-800">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Company name"
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-semibold text-slate-800">
                      Budget range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      defaultValue=""
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Select a range
                      </option>
                      <option>$5k - $15k</option>
                      <option>$15k - $50k</option>
                      <option>$50k+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us about your goals, timeline, and the product experience you want to create."
                    className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-sm leading-6 text-slate-500">
                    No backend is connected yet, so this form is prepared as a frontend-ready interface.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    Send Message
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
