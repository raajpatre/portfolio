import { createClient } from "@/lib/supabase/server";
import { AchievementGrid } from "@/components/public/AchievementGrid";

export const revalidate = 60;
export const metadata = { title: "Certificates | Raaj Patre" };

export default async function CertificatesPage() {
  const supabase = createClient();
  
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_date", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-6xl">
      <div className="mb-12">
        <h1 className="font-pixel text-3xl sm:text-4xl text-accent-gold mb-4">Achievements Unlocked</h1>
        <p className="font-mono text-sm text-text-primary/70 max-w-2xl">
          Certifications, degrees, and official acknowledgments of leveling up my skills.
        </p>
      </div>
      
      <AchievementGrid certificates={certificates || []} />
    </div>
  );
}
