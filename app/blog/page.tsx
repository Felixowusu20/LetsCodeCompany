import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "../../lib/serverContent";

/** Load posts at request time (avoids DB calls during `next build` when Neon is unreachable). */
export const dynamic = "force-dynamic";

export default async function Blog() {
  const posts = await getBlogPosts();
  return (
    <main className="bg-slate-50">
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
              News Updates
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Latest stories, updates, and featured insights.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stay informed with the newest articles, reports, and product announcements from our team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{post.comments} comments</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-slate-600 leading-7">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200">
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                    </div>
                    <Link href={`/blog/${post.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
                No posts published yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
