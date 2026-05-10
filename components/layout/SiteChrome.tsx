import Navbar from "./Navbar";
import Footer from "./Footer";
import LazyPartnerMarquee from "./LazyPartnerMarquee";

interface SiteChromeProps {
  children: React.ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <LazyPartnerMarquee />
      <Footer />
    </div>
  );
}
