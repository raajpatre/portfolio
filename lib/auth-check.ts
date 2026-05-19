import { createClient } from "@/lib/supabase/server";

export async function verifyAdminAuth() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }
  
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return { error: "Forbidden", status: 403 };
  }
  
  return { success: true };
}
