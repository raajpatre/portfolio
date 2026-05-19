import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Phase 1 placeholder — admin feed GET" });
}

export async function POST() {
  return NextResponse.json({ message: "Phase 1 placeholder — admin feed POST" });
}
