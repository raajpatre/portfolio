import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface StatusRow {
  status: string;
  count: number;
}

function StatusPill({ status }: { status: string | null | undefined }) {
  if (status === "shipped") {
    return (
      <span className="inline-flex items-center font-mono text-[10px] font-semibold px-2 py-1 rounded-sm tracking-[0.06em] uppercase text-accent-teal bg-accent-teal/12 shadow-[0_0_0_1px_rgba(61,214,172,0.4)]">
        Shipped
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center font-mono text-[10px] font-semibold px-2 py-1 rounded-sm tracking-[0.06em] uppercase text-accent-red bg-accent-red/12 shadow-[0_0_0_1px_rgba(245,92,92,0.4)]">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center font-mono text-[10px] font-semibold px-2 py-1 rounded-sm tracking-[0.06em] uppercase text-text-muted bg-text-muted/12 shadow-[0_0_0_1px_rgba(107,112,148,0.4)]">
      Draft
    </span>
  );
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const [
    { count: projectsCount },
    { count: certsCount },
    { count: feedCount },
    { data: recentProjects },
    { data: recentCerts },
    { data: recentFeed },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("feed_entries").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("certificates")
      .select("id, title, issued_date")
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("feed_entries")
      .select("id, content, category, entry_date")
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  // Stitch a "recent activity" feed across all three resources, newest first
  type Recent = {
    id: string;
    title: string;
    resource: "Project" | "Certificate" | "Feed";
    status: string | null;
    date: string;
  };
  const recent: Recent[] = [
    ...(recentProjects ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      resource: "Project" as const,
      status: p.status,
      date: p.created_at?.slice(0, 10) ?? "",
    })),
    ...(recentCerts ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      resource: "Certificate" as const,
      status: "shipped",
      date: c.issued_date ?? "",
    })),
    ...(recentFeed ?? []).map((f) => ({
      id: f.id,
      title: f.content.slice(0, 60),
      resource: "Feed" as const,
      status: null,
      date: f.entry_date ?? "",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16">
      {/* Page header */}
      <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="font-mono text-[22px] font-bold text-text-primary tracking-[0.02em] mb-1">
            Dashboard
          </h1>
          <p className="font-mono text-[12px] text-text-muted">
            Quick overview. Manage projects, certs and feed entries.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {[
          { num: projectsCount ?? 0, label: "Projects" },
          { num: certsCount ?? 0, label: "Certificates" },
          { num: feedCount ?? 0, label: "Feed entries" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-bg-surface border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] p-5 rounded-sm transition-colors hover:border-text-muted"
          >
            <div className="font-mono text-[36px] font-bold text-text-primary leading-[1.1] mb-1.5">
              {s.num}
            </div>
            <div className="font-mono text-[12px] text-text-muted tracking-[0.06em] uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2.5 flex-wrap mb-7">
        <Link
          href="/admin/projects"
          className="inline-flex items-center font-mono text-[13px] font-semibold text-accent-violet border border-accent-violet shadow-[0_0_0_1px_#7c6df5] bg-transparent px-3.5 py-2.5 rounded-sm transition-all hover:brightness-110"
        >
          + Add project
        </Link>
        <Link
          href="/admin/certificates"
          className="inline-flex items-center font-mono text-[13px] font-semibold text-accent-teal border border-accent-teal shadow-[0_0_0_1px_#3dd6ac] bg-transparent px-3.5 py-2.5 rounded-sm transition-all hover:brightness-110"
        >
          + Add certificate
        </Link>
        <Link
          href="/admin/feed"
          className="inline-flex items-center font-mono text-[13px] font-semibold text-accent-gold border border-accent-gold shadow-[0_0_0_1px_#f5c542] bg-transparent px-3.5 py-2.5 rounded-sm transition-all hover:brightness-110"
        >
          + Add entry
        </Link>
      </div>

      {/* Recent activity */}
      <div className="flex items-end justify-between mb-3.5 gap-4">
        <div>
          <h2 className="font-mono text-[14px] font-bold text-text-primary tracking-[0.02em] mb-0.5">
            Recent activity
          </h2>
          <p className="font-mono text-[12px] text-text-muted">
            Latest edits across all resources.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center font-mono text-[12px] font-semibold text-text-primary border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] bg-transparent px-3.5 py-2.5 rounded-sm transition-colors hover:border-text-muted hover:shadow-[0_0_0_1px_#6b7094]"
        >
          Manage projects →
        </Link>
      </div>

      <div className="bg-bg-surface border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] rounded-sm overflow-hidden">
        {recent.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="font-mono text-[14px] text-text-primary mb-1.5">No activity yet</div>
            <div className="font-mono text-[12px] text-text-muted mb-4">
              Create your first record to see it here.
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center font-mono text-[13px] font-semibold text-white bg-accent-violet border border-accent-violet px-3.5 py-2.5 rounded-sm transition-all hover:brightness-110"
            >
              + New project
            </Link>
          </div>
        ) : (
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Title", "Resource", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-mono text-[11px] font-semibold text-text-muted tracking-[0.08em] uppercase px-4 py-3 border-b border-border-pixel bg-bg-surface"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr
                  key={`${r.resource}-${r.id}`}
                  className={`transition-colors hover:bg-bg-elevated ${
                    i === recent.length - 1 ? "" : "border-b border-border-pixel"
                  }`}
                >
                  <td className="px-4 py-3.5 font-mono font-semibold text-text-primary">{r.title}</td>
                  <td className="px-4 py-3.5 font-mono text-[12px] text-text-muted">{r.resource}</td>
                  <td className="px-4 py-3.5">
                    {r.status ? <StatusPill status={r.status} /> : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[12px] text-text-muted">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
