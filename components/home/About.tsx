import React from "react";
import { type AboutContent, getAboutContent } from "@/lib/serverContent";

type Props = {
  content?: AboutContent;
};

const About = async ({ content }: Props) => {
  const data = content ?? (await getAboutContent());
  const hasMission = Boolean(data.missionTitle || data.missionText || data.missionImage);
  const hasVision = Boolean(data.visionTitle || data.visionText || data.visionImage);
  const missionVision = [
    hasMission
      ? { title: data.missionTitle, text: data.missionText, image: data.missionImage }
      : null,
    hasVision
      ? { title: data.visionTitle, text: data.visionText, image: data.visionImage }
      : null,
  ].filter((item): item is { title: string; text: string; image: string } => item !== null);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950/80 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            {data.heroEyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">
                {data.heroEyebrow}
              </p>
            ) : null}
            {data.heroTitle ? (
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {data.heroTitle}
              </h1>
            ) : null}
            {data.heroSubtitle ? (
              <p className="mt-6 text-lg leading-8 text-slate-200">
                {data.heroSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {data.storyImage ? (
            <div className="rounded-3xl overflow-hidden shadow-xl" data-aos="fade-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.storyImage}
                alt={data.storyTitle || "Our story"}
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              />
            </div>
          ) : (
            <div className="h-[320px] rounded-3xl bg-slate-100 sm:h-[420px] lg:h-[520px]" aria-hidden="true" />
          )}

          <div data-aos="fade-left">
            {data.storyTitle ? (
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {data.storyTitle}
              </h2>
            ) : null}
            {data.storyParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`${idx === 0 ? "mt-5 sm:mt-6" : "mt-4"} leading-relaxed text-slate-600`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {missionVision.length > 0 ? (
        <section className="py-24 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:gap-8 lg:px-10">
            {missionVision.map((item, index) => (
              <div
                key={item.title || index}
                className="rounded-3xl overflow-hidden bg-white shadow-lg"
                data-aos="fade-up"
                data-aos-delay={index * 120}
              >
                {item.image ? (
                  <div className="relative h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6 sm:p-10">
                  {item.title ? (
                    <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  ) : null}
                  {item.text ? (
                    <p className="mt-4 text-slate-600 leading-relaxed">{item.text}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.values.length > 0 ? (
        <section className="py-24">
          <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:mb-12 sm:px-6 lg:px-10" data-aos="fade-up">
            {data.valuesTitle ? (
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{data.valuesTitle}</h2>
            ) : null}
            {data.valuesSubtitle ? (
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                {data.valuesSubtitle}
              </p>
            ) : null}
          </div>

          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:gap-8 lg:px-10">
            {data.values.map((value, index) => (
              <div
                key={value.title || index}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                {value.image ? (
                  <div className="relative h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6 sm:p-8">
                  {value.title ? (
                    <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                  ) : null}
                  {value.desc ? (
                    <p className="mt-3 text-slate-600">{value.desc}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default About;
