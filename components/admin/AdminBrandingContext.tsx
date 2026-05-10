"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteBranding } from "../../lib/siteBranding";

const AdminBrandingContext = createContext<SiteBranding | null>(null);

export function AdminBrandingProvider({
  branding,
  children,
}: {
  branding: SiteBranding;
  children: ReactNode;
}) {
  return (
    <AdminBrandingContext.Provider value={branding}>
      {children}
    </AdminBrandingContext.Provider>
  );
}

export function useAdminBranding(): SiteBranding {
  const v = useContext(AdminBrandingContext);
  if (!v) {
    return {
      logoWhenUiLightUrl: "/whitelog.jpeg",
      logoWhenUiDarkUrl: "/logo.jpeg",
      adminPanelLogoUrl: "/logo.jpeg",
    };
  }
  return v;
}
