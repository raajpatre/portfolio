import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/public/HomeClient";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();

  const { data: allProjects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = allProjects || [];

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  const shipped = projects.filter((p) => p.status === "shipped").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const questsCompleted = shipped;
  const languages = new Set(projects.flatMap((p) => p.stack || [])).size;

  return (
    <HomeClient
      featuredProjects={featuredProjects}
      stats={{ questsCompleted, shipped, inProgress, languages }}
    />
  );
}
