import { aboutMock } from "@/lib/mockData";
import React from "react";

const About = () => {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
              About LetsCode
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

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl" data-aos="fade-right">
            <img
              src={aboutMock.story.image}
              alt="Our story"
              className="w-full h-[520px] object-cover"
            />
          </div>

          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold text-slate-900">
              {aboutMock.story.title}
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              {aboutMock.story.paragraphs[0]}
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {aboutMock.story.paragraphs[1]}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid gap-8 md:grid-cols-2">
          {[aboutMock.mission, aboutMock.vision].map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl overflow-hidden bg-white shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-slate-900">Our Values</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            The principles that guide our work and shape every customer experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto px-6 lg:px-10">
          {aboutMock.values.map((value, index) => (
            <div
              key={value.title}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 90}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={value.image}
                  alt={value.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-3 text-slate-600">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
