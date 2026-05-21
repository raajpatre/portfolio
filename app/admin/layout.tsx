import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Read session to surface email in the top nav.
  // Middleware enforces auth for all /admin/* routes except /admin/login.
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const email = session?.user?.email ?? "";

  // No session = on /admin/login (or expired) → render bare (login page is full-bleed).
  if (!email) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <AdminTopNav email={email} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
