import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { feedSchema } from "@/lib/validation/feed";
import { verifyAdminAuth } from "@/lib/auth-check";

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const parsedData = feedSchema.parse(body);

    const { data, error } = await adminClient
      .from('feed_entries')
      .insert([parsedData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Feed Create Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
