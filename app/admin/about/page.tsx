import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAboutContent } from "@/data/about";
import AboutAdminClient from "@/components/admin/AboutAdminClient";

export default async function AdminAboutPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const initial = await getAboutContent();
  return <AboutAdminClient initial={initial} />;
}
