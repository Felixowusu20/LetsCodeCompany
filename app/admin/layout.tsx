import type { Metadata } from "next";
import { AdminBrandingProvider } from "../../components/admin/AdminBrandingContext";
import { getSiteBranding } from "../../lib/serverContent";

export const metadata: Metadata = {
  title: "ZeoFex • Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = await getSiteBranding();
  return (
    <AdminBrandingProvider branding={branding}>
      <div className="min-h-[calc(100vh-5rem)] bg-muted">{children}</div>
    </AdminBrandingProvider>
  );
}
