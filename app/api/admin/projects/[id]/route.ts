import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { projectSchema } from "@/lib/validation/projects";
import { verifyAdminAuth } from "@/lib/auth-check";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const parsedData = projectSchema.partial().parse(body);

    const { data, error } = await adminClient
      .from('projects')
      .update(parsedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Project Update Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAdminAuth();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { error } = await adminClient
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Project Delete Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
