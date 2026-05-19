import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderGit2, Award, Rss } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // Verify session (double check, though middleware catches it)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  // Fetch counts
  const [{ count: projectsCount }, { count: certsCount }, { count: feedCount }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('feed_entries').select('*', { count: 'exact', head: true })
  ]);

  const cards = [
    { title: "Projects", count: projectsCount || 0, icon: FolderGit2, href: "/admin/projects", color: "text-accent-teal" },
    { title: "Certificates", count: certsCount || 0, icon: Award, href: "/admin/certificates", color: "text-accent-gold" },
    { title: "Feed Entries", count: feedCount || 0, icon: Rss, href: "/admin/feed", color: "text-accent-violet" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-pixel">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-text-primary/70 mt-1">Welcome back, {session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group block">
              <div className="rounded-xl border border-border-pixel bg-bg-base p-6 shadow-sm transition-colors hover:border-text-primary/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <p className="mt-4 text-4xl font-bold">{card.count}</p>
                <div className="mt-4 flex items-center text-sm text-text-primary/50 group-hover:text-text-primary/80 transition-colors">
                  Manage {card.title.toLowerCase()} &rarr;
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
