import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZeoFex • Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[calc(100vh-5rem)] bg-muted">{children}</div>;
}
