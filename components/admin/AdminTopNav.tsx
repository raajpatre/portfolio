"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/feed", label: "Feed" },
];

export function AdminTopNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const onLogout = async () => {
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b border-border-pixel bg-bg-surface">
      <div className="flex items-center gap-6">
        <span className="font-mono text-[12px] text-text-muted tracking-[0.12em]">
          PORTFOLIO ADMIN
        </span>
        <nav className="hidden sm:flex gap-1">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "font-mono text-[12px] px-3 py-2 rounded-sm transition-colors",
                isActive(t.href)
                  ? "text-text-primary bg-bg-elevated"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="hidden sm:inline font-mono text-[12px] text-text-muted truncate max-w-[200px]">
          {email}
        </span>
        <button
          onClick={onLogout}
          disabled={loading}
          className="font-mono text-[12px] text-accent-red bg-transparent border-0 px-2 py-1.5 rounded-sm cursor-pointer transition-colors hover:bg-accent-red/10 disabled:opacity-50"
        >
          {loading ? "Logging out…" : "Logout"}
        </button>
      </div>

      {/* Mobile tabs row */}
      <nav className="sm:hidden absolute top-full left-0 right-0 flex gap-1 px-4 py-2 border-b border-border-pixel bg-bg-surface overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "font-mono text-[11px] px-2.5 py-1.5 rounded-sm transition-colors whitespace-nowrap",
              isActive(t.href)
                ? "text-text-primary bg-bg-elevated"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
