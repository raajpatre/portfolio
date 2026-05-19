import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  // Fetch all projects, newest first
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return <ProjectsClient initialProjects={projects || []} />;
}
