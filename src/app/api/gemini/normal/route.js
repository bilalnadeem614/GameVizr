import { NextResponse } from "next/server";
import { callGenerateContent, extractText } from "@/lib/vertexAi";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, model } = body || {};

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const selectedModel = model || "gemini-3-pro-preview";
    const result = await callGenerateContent({
      model: selectedModel,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = extractText(result);
    return NextResponse.json({ text, model: selectedModel });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
