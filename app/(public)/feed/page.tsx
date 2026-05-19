import { createClient } from "@/lib/supabase/server";
import { BattleLog } from "@/components/public/BattleLog";

export const revalidate = 60;
export const metadata = { title: "Feed | Raaj Patre" };

export default async function FeedPage() {
  const supabase = createClient();
  
  const { data: feedEntries } = await supabase
    .from("feed_entries")
    .select("*")
    .order("entry_date", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl">
      <div className="mb-16 text-center">
        <h1 className="font-pixel text-3xl sm:text-4xl text-text-primary mb-4">Battle Log</h1>
        <p className="font-mono text-sm text-text-primary/70 max-w-2xl mx-auto">
          A timeline of shipped features, hackathon wins, open-source contributions, and notable life events.
        </p>
      </div>
      
      <BattleLog entries={feedEntries || []} />
    </div>
  );
}
