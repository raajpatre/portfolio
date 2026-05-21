import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/public/HomeClient";
import { getAboutContent } from "@/data/about";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();

  const [{ data: allProjects }, about] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    getAboutContent(),
  ]);

  const projects = allProjects || [];

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  const shipped = projects.filter((p) => p.status === "shipped").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const questsCompleted = shipped;

  return (
    <HomeClient
      featuredProjects={featuredProjects}
      stats={{ questsCompleted, shipped, inProgress }}
      about={{
        origin: about.origin,
        guild: about.guild,
        factions: about.factions,
        saveFile: about.saveFile,
      }}
    />
  );
}
