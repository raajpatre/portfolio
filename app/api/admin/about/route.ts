import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { aboutSchema } from "@/lib/validation/about";
import { verifyAdminAuth } from "@/lib/auth-check";

// GET — return the singleton row (admin only; public site reads via server client directly)
export async function GET() {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await adminClient
    .from("about_content")
    .select("origin, guild, factions, stats, save_file, updated_at")
    .eq("id", "singleton")
    .single();

  if (error) {
    console.error("About GET error:", error);
    return NextResponse.json({ error: "Failed to load about content" }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH — upsert the singleton row
export async function PATCH(request: Request) {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const parsed = aboutSchema.parse(body);

    const { data, error } = await adminClient
      .from("about_content")
      .upsert(
        {
          id: "singleton",
          origin: parsed.origin,
          guild: parsed.guild,
          factions: parsed.factions,
          stats: parsed.stats,
          save_file: parsed.save_file,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("origin, guild, factions, stats, save_file, updated_at")
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("About PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
