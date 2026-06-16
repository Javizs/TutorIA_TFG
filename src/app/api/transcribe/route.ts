import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("file");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "Audio file is required." },
        { status: 400 }
      );
    }

    const openAIFormData = new FormData();
    openAIFormData.append("file", audioFile);
    openAIFormData.append("model", "gpt-4o-mini-transcribe");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Transcription error status:", response.status);
      return NextResponse.json(
        { error: "Error transcribing audio." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Error in /api/transcribe:", error);
    return NextResponse.json(
      { error: "Unexpected transcription error." },
      { status: 500 }
    );
  }
}
