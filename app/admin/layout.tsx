import { ReactNode } from "react";
import "../globals.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-base text-text-primary font-mono">
        {/* Admin Navigation placeholder */}
        <nav className="p-4 border-b border-border-pixel">Admin Panel</nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
