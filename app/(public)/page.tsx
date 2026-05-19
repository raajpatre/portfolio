import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/public/HomeClient";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();
  
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  return (
    <HomeClient featuredProjects={featuredProjects || []} />
  );
}
