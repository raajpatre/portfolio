import { createClient } from "@/lib/supabase/server";
import { AchievementGrid } from "@/components/public/AchievementGrid";

export const revalidate = 60;
export const metadata = { title: "Achievement Cabinet | Raaj Patre" };

export default async function CertificatesPage() {
  const supabase = createClient();

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_date", { ascending: false });

  const list = certificates || [];
  const unlocked = list.filter((c) => !c.locked).length;
  const locked = list.filter((c) => c.locked).length;

  return (
    <>
      {/* Fixed room background — fades to dark at bottom */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/certs-bg.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,12,26,0) 0%, rgba(10,12,26,0.45) 45%, rgba(10,12,26,0.92) 100%), rgba(10,12,26,0.25)",
          }}
        />
      </div>

      {/* Page header — transparent so the shelf shows through */}
      <section className="relative z-[1] h-[220px] flex items-end justify-center pb-7 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,12,26,0) 0%, rgba(10,12,26,0) 50%, rgba(10,12,26,0.55) 100%)",
          }}
        />
        <div className="relative z-[1] text-center flex flex-col items-center gap-2.5">
          <h1
            className="font-pixel text-[clamp(16px,3vw,22px)] text-accent-gold tracking-[0.08em] m-0"
            style={{ textShadow: "0 0 18px rgba(245,197,66,0.45)" }}
          >
            ★ ACHIEVEMENT CABINET ★
          </h1>
          <p className="font-mono text-[13px] text-text-muted m-0">Proof of quests completed.</p>
          <span className="font-pixel text-[8px] text-accent-teal bg-accent-teal/12 shadow-[0_0_0_1px_#3dd6ac] px-2.5 py-1.5 tracking-[0.12em] rounded-sm inline-flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] animate-pulse inline-block" />
            {unlocked} UNLOCKED · {locked} LOCKED
          </span>
        </div>
      </section>

      <AchievementGrid certificates={list} />
    </>
  );
}
