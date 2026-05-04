import Navbar from "./Navbar";
import Footer from "./Footer";
import PartnerMarquee from "./PartnerMarquee";

interface SiteChromeProps {
  children: React.ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <PartnerMarquee />
      <Footer />
    </div>
  );
}
