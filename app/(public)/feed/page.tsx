import { createClient } from "@/lib/supabase/server";
import { BattleLog } from "@/components/public/BattleLog";

export const revalidate = 60;
export const metadata = { title: "Battle Log | Raaj Patre" };

export default async function FeedPage() {
  const supabase = createClient();

  const { data: feedEntries } = await supabase
    .from("feed_entries")
    .select("*")
    .order("entry_date", { ascending: false });

  return (
    <>
      {/* Fixed city background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/battle-log-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center top",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(10,12,26,0) 0%, rgba(10,12,26,0.35) 35%, rgba(10,12,26,0.92) 80%), radial-gradient(ellipse at 50% 0%, rgba(10,12,26,0) 0%, rgba(10,12,26,0.45) 80%)",
          }}
        />
      </div>

      {/* Page header */}
      <section className="relative z-[1] px-5 sm:px-8 lg:px-16 pt-14 pb-7">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-pixel text-[clamp(18px,3.4vw,24px)] text-text-primary tracking-[0.06em] mb-3">
              ▣ BATTLE LOG
            </h1>
            <p className="font-mono text-[13px] text-text-muted max-w-lg leading-relaxed">
              A running record of quests, launches, wins, and events.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 font-pixel text-[7px] text-accent-teal border border-accent-teal shadow-[0_0_0_1px_#3dd6ac] px-2.5 py-2 bg-accent-teal/8 tracking-[0.16em] rounded-sm">
            <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] animate-[blink_1s_ease-in-out_infinite]" />
            ACTIVE
          </div>
        </div>
      </section>

      {/* BattleLog tabs + timeline */}
      <BattleLog entries={feedEntries || []} />
    </>
  );
}
