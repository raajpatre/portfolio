import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Admin Navigation placeholder */}
      <nav className="p-4 border-b border-border-pixel">Admin Panel</nav>
      <main>{children}</main>
    </div>
  );
}
