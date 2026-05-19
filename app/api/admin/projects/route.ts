import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { projectSchema } from "@/lib/validation/projects";
import { verifyAdminAuth } from "@/lib/auth-check";

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const parsedData = projectSchema.parse(body);

    const { data, error } = await adminClient
      .from('projects')
      .insert([parsedData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Project Create Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
