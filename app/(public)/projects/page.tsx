import { createClient } from "@/lib/supabase/server";
import { QuestBoard } from "@/components/public/QuestBoard";

export const revalidate = 60;
export const metadata = { title: "Projects | Raaj Patre" };

export default async function ProjectsPage() {
  const supabase = createClient();
  
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-6xl">
      <div className="mb-12">
        <h1 className="font-pixel text-3xl sm:text-4xl text-text-primary mb-4">Quest Board</h1>
        <p className="font-mono text-sm text-text-primary/70 max-w-2xl">
          A collection of things I've built. From production-ready SaaS applications to open-source experiments.
        </p>
      </div>
      
      <QuestBoard projects={projects || []} />
    </div>
  );
}
