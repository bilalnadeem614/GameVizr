import { NextResponse } from "next/server";
import { callGenerateContent, extractText } from "@/lib/vertexAi";

function normalizeBase64(input) {
  if (!input) return "";
  const dataUrlPrefix = /^data:[^;]+;base64,/;
  return input.replace(dataUrlPrefix, "");
}

async function readImageFromUrl(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Image URL did not return an image content-type");
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return { base64, mimeType: contentType };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, imageBase64, mimeType, imageUrl, model } = body || {};

    let finalBase64 = imageBase64;
    let finalMimeType = mimeType;

    if (imageUrl) {
      const remoteImage = await readImageFromUrl(imageUrl);
      finalBase64 = remoteImage.base64;
      finalMimeType = remoteImage.mimeType;
    }

    if (!finalBase64 || !finalMimeType) {
      return NextResponse.json(
        { error: "Missing imageBase64/mimeType or imageUrl" },
        { status: 400 }
      );
    }

    const parts = [];
    if (prompt) {
      parts.push({ text: prompt });
    }
    parts.push({
      inlineData: {
        mimeType: finalMimeType,
        data: normalizeBase64(finalBase64),
      },
    });

    const selectedModel = model || "gemini-3-pro-image-preview";
    const result = await callGenerateContent({
      model: selectedModel,
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    const text = extractText(result);
    return NextResponse.json({ text, model: selectedModel });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
