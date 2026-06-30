import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file selected" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from("img-gallery")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get Public URL
    const { data } = supabase.storage
      .from("img-gallery")
      .getPublicUrl(fileName);

    // Save URL in Database
    const { error: dbError } = await supabase
      .from("img-gallery")
      .insert([
        {
          image: data.publicUrl,
        },
      ]);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: data.publicUrl,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}