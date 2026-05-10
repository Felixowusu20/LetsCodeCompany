import Image from "next/image";
import Link from "next/link";
import { getBlogPostById } from "../../../lib/serverContent";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

/** Load post at request time (avoids DB calls during `next build` when Neon is unreachable). */
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <Link href="/blog" className="text-blue-200 hover:text-blue-100 mb-4 inline-block">
              ← Back to Blog
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">
              {post.date}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-blue-100 sm:mt-6 sm:text-lg sm:leading-8">
              By {post.author}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-10 h-64 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl sm:mb-12 sm:h-96" data-aos="zoom-in">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="prose prose-slate max-w-none sm:prose-lg" data-aos="fade-up" data-aos-delay="100">
            <p className="text-slate-600 text-base leading-7 sm:text-lg sm:leading-8">
              {post.excerpt}
            </p>
            {post.content ? (
              <p className="mt-8 text-slate-700">
                {post.content}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
