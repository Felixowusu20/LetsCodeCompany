import { getSiteBranding } from "../../lib/serverContent";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LazyPartnerMarquee from "./LazyPartnerMarquee";

interface SiteChromeProps {
  children: React.ReactNode;
}

export default async function SiteChrome({ children }: SiteChromeProps) {
  const branding = await getSiteBranding();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logoWhenUiLightUrl={branding.logoWhenUiLightUrl}
        logoWhenUiDarkUrl={branding.logoWhenUiDarkUrl}
      />
      <main className="flex-1 pt-20">{children}</main>
      <LazyPartnerMarquee />
      <Footer />
    </div>
  );
}
