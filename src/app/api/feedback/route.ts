import { NextResponse } from "next/server";
import { getTutorFeedback } from "@/lib/tutor/services/tutorFeedbackService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { scenario, messages } = body;

    if (!scenario || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const feedback = await getTutorFeedback(scenario, messages);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error in /api/feedback:", error);

    return NextResponse.json(
      { error: "Error generating feedback." },
      { status: 500 }
    );
  }
}