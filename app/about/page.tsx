import About from "@/components/home/About";
import { getAboutContent } from "@/lib/serverContent";

/** Load About content from Postgres at request time so the build does not need DB access. */
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getAboutContent();
  return (
    <main>
      <About content={content} />
    </main>
  );
}
