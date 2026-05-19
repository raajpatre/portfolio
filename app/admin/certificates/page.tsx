import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CertificatesClient from "./CertificatesClient";

export default async function CertificatesPage() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_date', { ascending: false });

  return <CertificatesClient initialCertificates={certificates || []} />;
}
