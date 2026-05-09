import About from "../components/home/About";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import { getHomeHeroSlides } from "../lib/serverContent";

/** Load hero from Postgres at request time (avoids DB calls during `next build` when Neon is unreachable). */
export const dynamic = "force-dynamic";

export default async function Home() {
  const heroSlides = await getHomeHeroSlides();
  const heroKey = heroSlides.map((s) => String(s.id)).join("-");

  return (
    <div>
      <Hero key={heroKey} slides={heroSlides} />
      <Services />
      <About />
    </div>
  );
}
