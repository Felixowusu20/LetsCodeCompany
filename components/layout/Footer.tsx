import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-white">LetsCode</h3>
            <p className="mt-4 text-slate-400">
              Building reliable websites, apps, AI tools, and digital platforms for modern teams.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-slate-400">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              Company
            </h4>
            <ul className="mt-5 space-y-3 text-slate-400">
              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/team" className="transition hover:text-white">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Let us turn your ideas into reality
            </p>
            <p className="mt-4 text-slate-300">
              ready to start a project or just want to say hi? We are here to help you build something great.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Book a Call
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-slate-500">
          © 2026 LetsCode. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
