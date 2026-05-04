import Image from "next/image";
import Link from "next/link";
import { mockBlogPosts } from "../../../lib/mockData";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = mockBlogPosts.find(p => p.id === parseInt(params.id));

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
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
            <p className="mt-6 text-lg leading-8 text-blue-100">
              By {post.author}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl mb-12" data-aos="zoom-in">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="prose prose-lg prose-slate max-w-none" data-aos="fade-up" data-aos-delay="100">
            <p className="text-slate-600 text-lg leading-8">
              {post.excerpt}
            </p>
            <p className="mt-8 text-slate-700">
              This is a placeholder for the full blog post content. When you add the backend, you can replace this with the actual content from your CMS or database. The mock data structure is ready to accommodate full article content.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
