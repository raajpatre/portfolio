import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 border-b border-border-pixel">Admin Panel</nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
