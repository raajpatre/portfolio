import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-mono">
      {/* Navigation placeholder */}
      <nav className="p-4 border-b border-border-pixel">Public Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
