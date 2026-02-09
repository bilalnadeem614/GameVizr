import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callGenerateContent, extractInlineImage } from "@/lib/vertexAi";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey);
}

function guessExtension(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/jpeg") return "jpg";
  return "png";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, model } = body || {};

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const selectedModel = model || "gemini-3-pro-image-preview";
    const result = await callGenerateContent({
      model: selectedModel,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    });

    const image = extractInlineImage(result);
    if (!image) {
      return NextResponse.json(
        { error: "No image data returned" },
        { status: 502 }
      );
    }

    const bucket = process.env.SUPABASE_BUCKET || "gemini-3-data";
    const supabase = getSupabaseClient();
    const ext = guessExtension(image.mimeType);
    const fileName = `gemini/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const fileBuffer = Buffer.from(image.data, "base64");

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: image.mimeType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      imageUrl: publicUrlData?.publicUrl || null,
      mimeType: image.mimeType,
      model: selectedModel,
      bucket,
      path: fileName,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
