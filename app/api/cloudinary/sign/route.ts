import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_FOLDERS = ["raaj-portfolio/projects", "raaj-portfolio/certificates"];

export async function POST(request: Request) {
  // 1. Verify session
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 2. If no session -> 401
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. If email doesn't match -> 403
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { folder } = body;

    // Validate folder
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = cloudinary.config().api_secret;
    const apiKey = cloudinary.config().api_key;
    const cloudName = cloudinary.config().cloud_name;

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Cloudinary config missing.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
