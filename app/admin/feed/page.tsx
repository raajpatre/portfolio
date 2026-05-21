import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FeedClient from "@/components/admin/FeedClient";

export default async function FeedPage() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const { data: feed } = await supabase
    .from('feed_entries')
    .select('*')
    .order('entry_date', { ascending: false });

  return <FeedClient initialFeed={feed || []} />;
}
