import { createClient } from "@/lib/supabase/server";
import { QuestBoard } from "@/components/public/QuestBoard";
import { CrossedSwords } from "@/components/public/CrossedSwords";

export const revalidate = 60;
export const metadata = { title: "Quest Board | Raaj Patre" };

export default async function ProjectsPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Quest Banner */}
      <section
        className="relative h-[200px] sm:h-[300px] flex items-center justify-center border-b border-border-pixel overflow-hidden"
        style={{
          backgroundImage: 'url("/quest-banner.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        {/* Dim overlay so title pops */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(10,12,26,0.35) 0%, rgba(10,12,26,0.75) 90%), linear-gradient(to bottom, rgba(10,12,26,0.45) 0%, rgba(10,12,26,0.15) 30%, rgba(10,12,26,0.15) 70%, rgba(10,12,26,0.7) 100%)",
          }}
        />
        {/* Corner nails */}
        {[
          { pos: "top-3.5 left-3.5" },
          { pos: "top-3.5 right-3.5" },
          { pos: "bottom-3.5 left-3.5" },
          { pos: "bottom-3.5 right-3.5" },
        ].map(({ pos }) => (
          <span
            key={pos}
            className={`absolute ${pos} w-2 h-2 bg-border-pixel z-[2]`}
            style={{ boxShadow: "0 0 0 1px #000, inset 0 0 0 2px #1a1e38" }}
            aria-hidden="true"
          />
        ))}

        {/* Title row with crossed swords */}
        <div className="relative z-[1] flex items-center gap-4 sm:gap-6 px-5">
          <CrossedSwords />
          <div className="text-center">
            <h1
              className="font-pixel text-[clamp(18px,3.6vw,28px)] text-accent-gold tracking-[0.06em] mb-2.5"
              style={{ textShadow: "0 0 18px rgba(245,197,66,0.35)" }}
            >
              QUEST BOARD
            </h1>
            <p className="font-mono text-[13px] text-text-muted">
              Active missions. Shipped builds. Work in progress.
            </p>
          </div>
          <CrossedSwords flip />
        </div>
      </section>

      <QuestBoard projects={projects || []} />
    </>
  );
}
